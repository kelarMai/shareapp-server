
const fs = require('fs');
const util = require('util');

// sqltable.json declare

var definition = {
  usint_inc : "smallint unsigned not null auto_increment",
  uint_inc : "int unsigned not null auto_increment",
  usint : "smallint unsigned not null default 0",
  uint : "int unsigned not null default 0",
  char16 : "char(16) character set utf8 collate utf8_bin not null default ''",
  char32 : "char(32) character set utf8 collate utf8_bin not null default ''",
  char128 : "char(128) character set utf8 collate utf8_bin not null default ''",
  char256 : "varchar(256) character set utf8 collate utf8_bin not null default ''",
}

class mysql_server {
  constructor(config,table_file) {
    const mysql_handle = require('mysql');
    this.db = mysql_handle.createConnection({
      host: config.ip ? config.ip : '127.0.0.1',
      user: config.user ? config.user : "root",
      port: config.port ? config.port : "3306",
      password: config.password ? config.password : "123",
      database: config.database ? config.database : "shareapp"
    });
    this.table_file = table_file;
    this.table_content = null;

    this.old_column_list = {};
    this.old_table_list = {};
    // this.compare_table = this.compare_table.bind(this);
    
    this.db.connect();
    this.query = util.promisify(this.db.query).bind(this.db);
    this.init_table();
  }

  async init_table() {
    try {
      await this.query("create table if not exists table_metadata ("
        + " id " + definition.char16 + ","
        + " index_def " + definition.char128 + ","
        + " primary_def " + definition.char32
        // + ","
        // + "primary key (sn)"
        + ");");
      await this.query("create table if not exists column_metadata ("
        + " table_name " + definition.char16 + ","
        + " id " + definition.char16 + ","
        + " definition " + definition.char32
        // + ","
        // + "index (table_sn,column_sn)"
        + ");");
      }catch(e) {
         console.log("public mysql :",e);
    }

    let newtabel = fs.readFileSync(this.table_file);
    newtabel = newtabel.toString();
    if (newtabel == '') return;
    console.log(newtabel);
    this.table_content = JSON.parse(newtabel);

    let compare_table = this.compare_table.bind(this);
    this.db.query("select * from table_metadata;",compare_table);
  }

  async compare_table(err,rows,fields) {
    if (err) {
      console.log(err);
      throw err;
    }

    console.log(rows);

    for (let i = 0; i < rows.length; i++) {
      this.old_table_list[rows[i].id] = {};
      this.old_table_list[rows[i].id].index_def = rows[i].index_def;
      this.old_table_list[rows[i].id].primary_def = rows[i].primary_def;
    }

    console.log(this.table_content);
    // delete the old table
    for(let old_table in this.old_table_list) {
      if (this.table_content[old_table]) continue;
      else {
        this.delete_table(old_table);
        delete this.old_table_list[old_table];
      }
    }

    // add the new table
    for(let table_name in this.table_content) {
      if (this.old_table_list[table_name]) continue;
      else {
        this.create_table(table_name);
      }
    }

    this.old_column_list = await this.query("select * from column_metadata;");
    await this.compare_column();
    
    await this.compare_index();
    await this.compare_primary();

    this.clean_memory();
  }

  async clean_memory(){

  }

  async compare_column(){
    // compare the column

  }

  async compare_index(){
    // compare the index_def
    for (let old_table in this.old_table_list) {
      let old_index_def_list = this.old_table_list[old_table].index_def.split(',');
      let new_index_def_list = this.table_content[old_table].index_def;
      if (old_index_def_list.length != new_index_def_list.length) {
        this.change_index(old_table,old_index_def_list,new_index_def_list);
        continue;
      }
      for (let i = 0; i < new_index_def_list.length; i++) {
        if (new_index_def_list[i] != old_index_def_list[i]) {
          this.change_index(old_table,old_index_def_list,new_index_def_list);
          break;
        }
      }
    }
  }

  async compare_primary(){
    // compare the primary 
    for (let old_table in this.old_table_list) {
      if (this.old_table_list[old_table].primary_def != this.table_content[old_table].primary_def){
        this.change_primary(old_table,this.table_content[old_table].primary_def);
      }
    }
  }
  

  async change_primary(table_name,primary_def){
    let s = "alter table " + table_name + " drop primary key;";
    console.log(s);
    this.db.query(s,(err) => {
      if (err) console.log(err);
    });
    s = "alter table " + table_name + " add primary key (" + primary_def + ");";
    console.log(s);
    this.db.query(s,(err) => {
      if (err) console.log(err);
    });
  }

  async change_index(table_name,old_index_def_list,new_index_def_list){
    let old_index_name = "";
    let new_index_name = "";
    let new_index_def = "";
    for (let old_index in old_index_def_list){
      old_index_name = old_index_name + old_index_def_list[old_index] + "_";
    }
    for (let new_index in new_index_def_list){
      new_index_name = new_index_name + new_index_def_list[new_index] + "_";
      new_index_def = new_index_def + new_index_def_list[new_index] + ",";
    }

    old_index_name = old_index_name.substring(0,old_index_name.length - 1);
    new_index_name = new_index_name.substring(0,new_index_name.length - 1);
    new_index_def = new_index_def.substring(0,new_index_def.length - 1);

    let s = "alter table " + table_name + " drop index " + old_index_name + " ;";
    console.log(s);
    this.db.query(s,(err) => {
      if (err) console.log(err);
    });
    s = "alter table " + table_name + " add index " + new_index_name + " ( " + new_index_def + " );";
    console.log(s);
    this.db.query(s,(err) => {
      if (err) console.log(err);
    });
  }

  async delete_table(table_name) {
    this.query("drop table ? ;",[table_name],(err,rows,fields)=>{
      if (err) console.log(err);
    });
  }

  async create_table(table_name) {
    console.log("create new table: " + table_name);
    let column_content = this.table_content[table_name];
    let index_def = "";
    let primary_def = "";
    // create new table
    var s = "create table if not exists " + table_name + " (";
    
    let index_name = "";
    for (let column_name in column_content) {
      if (column_name == "index_def") {
        s += " index "

        for (let i = 0; i < column_content[column_name].length; i++){
          if (i == 0) {
            index_name = index_name + column_content[column_name][i];
            index_def = index_def + column_content[column_name][i];
          }
          else {
            index_name = index_name + "_" + column_content[column_name][i];
            index_def = index_def + "," + column_content[column_name][i];
          }
        }

        s = s + index_name + " ( " + index_def + " ),";
      }else if(column_name == "primary_def") {
        s = s + " primary key ( " + column_content[column_name] + " ),";
        primary_def = column_content[column_name];
      }else {
        if (!definition[column_content[column_name]]) continue;
        s = s + column_name + " " + definition[column_content[column_name]] + ",";
      }
    }
    s = s.substring(0,s.length - 1);
    s += ");";
    console.log(s);

    this.db.query(s,(err) => {
      if (err) 
        console.log(err);
    });

    // add table message into table_metadata and column_metadata
    s = "insert into table_metadata values (?,?,?);";
    this.db.query(s,[table_name,index_def,primary_def],(err) => {
      if (err) 
        console.log(err);
    });
  }
}

var client = new mysql_server({
  user: "shareapp",
  password: "123"
},"../config/sqltable.json");
// client.init_table();
