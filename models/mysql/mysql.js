
debugi = console.log;

const fs = require('fs');
const util = require('util');
const eventEmitter = require('events').EventEmitter;

// sqltable.json declare

var definition = {
  usint_inc : "smallint unsigned not null auto_increment",
  uint_inc : "int unsigned not null auto_increment",
  usint : "smallint unsigned not null default 0",
  uint : "int unsigned not null default 0",
  int : "int not null default 0",
  bint : "bigint not null default 0",
  ubint : "bigint unsigned not null default 0",
  char8 : "char(8) character set utf8 collate utf8_bin not null default ''",
  char16 : "char(16) character set utf8 collate utf8_bin not null default ''",
  char32 : "char(32) character set utf8 collate utf8_bin not null default ''",
  char128 : "char(128) character set utf8 collate utf8_bin not null default ''",
  charmax : "char character set utf8 collate utf8_bin not null default ''",
  vchar16 : "varchar(16) character set utf8 collate utf8_bin not null default ''",
  vchar32 : "varchar(32) character set utf8 collate utf8_bin not null default ''",
  vchar128 : "varchar(128) character set utf8 collate utf8_bin not null default ''",
  vcharmax : "varchar character set utf8 collate utf8_bin not null default ''",
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

    this.finish_flag = 0;
    this.finish_event = new eventEmitter();
    this.finish_event.on("finish",(name) => {
      debugi("mysql init finish " ,name ,this.finish_flag);
      this.finish_flag += 1;
      if (this.finish_flag >= 2){
        this.finish_flag = 0;
        this.clean_memory();
      }
    });
   
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
        + ");");
      await this.query("create table if not exists column_metadata ("
        + " table_name " + definition.char16 + ","
        + " id " + definition.char16 + ","
        + " definition " + definition.char32
        + ");");
      }catch(e) {
         debugi("public mysql :",e);
    }

    let newtabel = fs.readFileSync(this.table_file);
    newtabel = newtabel.toString();
    if (newtabel == '') return;
    debugi(newtabel);
    this.table_content = JSON.parse(newtabel);

    let compare_table = this.compare_table.bind(this);
    this.db.query("select * from table_metadata;",compare_table);
  }

  async compare_table(err,rows,fields) {
    if (err) {
      debugi(err);
    }

    debugi(rows);

    for (let i = 0; i < rows.length; i++) {
      this.old_table_list[rows[i].id] = {};
      this.old_table_list[rows[i].id].index_def = rows[i].index_def;
      this.old_table_list[rows[i].id].primary_def = rows[i].primary_def;
    }

    debugi(this.table_content);
    // delete the old table
    for(let old_table in this.old_table_list) {
      if (this.table_content[old_table]) continue;
      else {
        this.delete_table(old_table);
        delete this.old_table_list[old_table];
      }
    }

    //comare the column before create table;
    let compare_column = this.compare_column.bind(this);
    this.query("select * from column_metadata;",compare_column);

    // add the new table
    for(let table_name in this.table_content) {
      if (this.old_table_list[table_name]) continue;
      else {
        this.create_table(table_name);
      }
    }
  }



  async clean_memory(){
    this.old_column_list = null;
    this.old_table_list = null;
    this.table_content = null;
  }

  async compare_column(err,rows,fields){
    // compare the column
    if (err){
      debugi(err);
    }
    debugi(rows);

    for (let i = 0; i < rows.length; i++){
      if (this.old_column_list[rows[i].table_name] == null){
        this.old_column_list[rows[i].table_name] = {};
      }
      this.old_column_list[rows[i].table_name][rows[i].id] = rows[i].definition;
    }
    debugi(this.old_column_list);
    for (let old_table_name in this.old_column_list){
      if (this.table_content[old_table_name] == null){
        this.delete_column(old_table_name,null);
        delete this.old_column_list[old_table_name];
        continue;
      }
      for (let old_column_name in this.old_column_list[old_table_name]){
        if (this.table_content[old_table_name][old_column_name] == null){
          this.delete_column(old_table_name,old_column_name);
          delete this.old_column_list[old_table_name][old_column_name];
          continue;  
        }
        if (this.table_content[old_table_name][old_column_name] != this.old_column_list[old_table_name][old_column_name]){
          this.change_column(old_table_name,old_column_name,this.table_content[old_table_name][old_column_name]);
          continue;  
        }
      }
    }

    for (let new_table_name in this.table_content){
      if (!this.old_column_list[new_table_name]) continue;

      for (let new_column_name in this.table_content[new_table_name]){
        if (new_column_name == "index_def" || new_column_name == "primary_def") continue;
        if (this.old_column_list[new_table_name][new_column_name] == null){
          this.add_column(new_table_name,new_column_name,this.table_content[new_table_name][new_column_name]);
        }
      }
    }

    this.compare_index();
    this.compare_primary();
  }

  async add_column(table_name,column_name,column_definition){
    debugi("add_column ",table_name , column_name , column_definition);
    if (!definition[column_definition]) return;
    
    let s = "alter table " + table_name + " add column " + column_name + " " + definition[column_definition] + " ;";
    this.db.query(s,(err) => {
      if (err) debugi(err);
    });

    s = "insert into column_metadata values (?,?,?);";
    this.db.query(s,[table_name,column_name,column_definition],(err) => {
      if (err) debugi(err);
    });
  }

  async change_column(table_name,column_name,column_definition){
    debugi("change_column ", table_name,column_name,column_definition);
    if (!definition[column_definition]) return;
    let s = "update column_metadata set definition = ? where table_name = ? and id = ?;"
    this.db.query(s,[column_definition,table_name,column_name],(err) => {
      if (err) debugi(err);
    });

    s = "alter table " + table_name + " modify " + column_name + " " + definition[column_definition] + " ;";
    this.db.query(s,(err) => {
      if (err) debugi(err);
    });    
  }

  async delete_column(table_name,column_name){
    debugi("delete_column " ,table_name,column_name);
    if (column_name == null){
      let s = "delete from column_metadata where table_name = ?;";
      this.db.query(s,[table_name],(err)=>{
        if (err) debugi(err);  
      });
      
    }else{
      let s = "delete from column_metadata where table_name = ? and id = ?;";
      this.db.query(s,[table_name,column_name],(err) => {
        if (err) debugi(err);
      });
  
      s = "alter table " + table_name + " drop column " + column_name + " ;";
      this.db.query(s,(err) => {
        if (err) debugi(err);
      });
    }
  }

  async compare_index(){
    // compare the index_def
    for (let old_table in this.old_table_list) {
      let old_index_def_list = [];
      let new_index_def_list = [];

      if (this.old_table_list[old_table].index_def == "" && this.table_content[old_table].index_def == null) continue;
      if (this.old_table_list[old_table].index_def != ""){
        old_index_def_list = this.old_table_list[old_table].index_def.split(',');
      }
      if (this.table_content[old_table].index_def != null){
        new_index_def_list = this.table_content[old_table].index_def;
      }
      
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

    this.finish_event.emit('finish',"index");
  }

  async change_index(table_name,old_index_def_list,new_index_def_list){
    debugi("change_index" ,table_name,old_index_def_list,new_index_def_list);
    let s = "";
    let old_index_name = "";
    let new_index_name = "";
    let new_index_def = "";
    
    if (old_index_def_list.length != 0){
      for (let old_index in old_index_def_list){
        old_index_name = old_index_name + old_index_def_list[old_index] + "_";
      }
      old_index_name = old_index_name.substring(0,old_index_name.length - 1);
    }
    if (new_index_def_list.length != 0){
      for (let new_index in new_index_def_list){
        new_index_name = new_index_name + new_index_def_list[new_index] + "_";
        new_index_def = new_index_def + new_index_def_list[new_index] + ",";
      }
      new_index_name = new_index_name.substring(0,new_index_name.length - 1);
      new_index_def = new_index_def.substring(0,new_index_def.length - 1);
    }

    if (old_index_name != ""){
      s = "alter table " + table_name + " drop index " + old_index_name + " ;";
      debugi(s);
      this.db.query(s,(err) => {
        if (err) debugi(err);
      });
    }

    if (new_index_name != ""){
      s = "alter table " + table_name + " add index " + new_index_name + " ( " + new_index_def + " );";
      debugi(s);
      this.db.query(s,(err) => {
        if (err) debugi(err);
      });
    }

    s = "update table_metadata set index_def = ? where id  = ?;";
    this.db.query(s,[new_index_def,table_name],(err) => {
      if (err) debugi(err);
    });
  }

  async compare_primary(){
    // compare the primary 
    for (let old_table in this.old_table_list) {
      if (this.old_table_list[old_table].primary_def != this.table_content[old_table].primary_def){
        this.change_primary(old_table,this.old_table_list[old_table].primary_def,this.table_content[old_table].primary_def);
      }
    }

    this.finish_event.emit('finish',"primary");
  }
  

  async change_primary(table_name,old_primary_def,new_primary_def){
    debugi("change_primary " ,table_name,old_primary_def,new_primary_def);
    let s ;
    if (old_primary_def != ""){
      s = "alter table " + table_name + " drop primary key;";
      debugi(s);
      this.db.query(s,(err) => {
        if (err) debugi(err);
      });
    }

    if (new_primary_def != null){
      s = "alter table " + table_name + " add primary key (" + new_primary_def + ");";
      debugi(s);
      this.db.query(s,(err) => {
        if (err) debugi(err);
      });
    }

    if (new_primary_def == null) new_primary_def = "";
    s = "update table_metadata set primary_def = ? where id = ? ;";
    this.db.query(s,[new_primary_def,table_name],(err) => {
      if (err) debugi(err);
    });
  }


  async delete_table(table_name) {
    debugi("delete_table", table_name);
    let s = "drop table " + table_name + " ;";
    this.query(s,(err) => {
      if (err) debugi(err);
    });
    this.query("delete from table_metadata where id = ?;", [table_name],(err) => {
      if (err) debugi(err);
    });
    this.query("delete from column_metadata where table_name = ?;", [table_name],(err) => {
      if (err) debugi(err);
    });
  }

  async create_table(table_name) {
    debugi("create new table: " , table_name);
    let column_content = this.table_content[table_name];
    let index_def = "";
    let primary_def = "";
    let key_def = "";
    let index_name = "";
    // create new table
    var s = "create table if not exists " + table_name + " (";
    
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
        key_def = key_def + " ( \"" + table_name + "\" , \"" + column_name + "\" ,\"" + column_content[column_name] + "\" ),";

      }
    }
    s = s.substring(0,s.length - 1);
    s += ");";
    debugi(s);

    this.db.query(s,(err) => {
      if (err) debugi(err);
    });

    // add table message into table_metadata
    s = "insert into table_metadata values (?,?,?);";
    this.db.query(s,[table_name,index_def,primary_def],(err) => {
      if (err) debugi(err);
    });

    // add table messge into column_metadata
    key_def = key_def.substring(0,key_def.length - 1);
    s = "insert into column_metadata values " + key_def + " ;";
    this.db.query(s,(err) => {
      if (err) debugi(err);
    })
  }
}

// var client = new mysql_server({
//   user: "shareapp",
//   password: "123"
// },"../models/mysql/sqltable.json");

module.exports = mysql_server;