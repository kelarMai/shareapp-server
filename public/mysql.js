
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
  char255 : "varchar(255) character set utf8 collate utf8_bin not null default ''",
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
    

    this.connect();
    this.query = util.promisify(this.db.query).bind(this.db);
    this.init_table();
  }

  async connect() {
    try {
      await this.db.connect();
    }catch(e) {
      console.log("mysql connect error " + err);
    }
  }

  async init_table() {
    try {
      await this.query("create table if not exists table_metadata ("
        + " id " + definition.char16 + ","
        + " index_def " + definition.char32 + ","
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
    console.log(this.table_content);
    this.query("select * from table_metadata;",this.compare_table);

  }

  async compare_table(err,rows,fields) {
    console.log(rows);
    let old_table_list = {};
    for (let i = 0; i < rows.length; i++) {
      old_table_list[rows[i].id] = {};
      old_table_list[rows[i].id].id = rows[i].id;
      old_table_list[rows[i].id].index_def = rows[i].index_def;
      old_table_list[rows[i].id].primary_def = rows[i].primary_def;
    }
    console.log("555");
    // delete the old table
    // add the new table
    for(old_table in old_table_list) {
      if (this.table_content[old_table_list[old_table][id]]) continue;
      else {
        this.delete_table(old_table_list[old_table][id]);
        old_table_list[old_table] = null;
      }
    }
    console.log("6666");
    console.log(this.table_content);
    for(newtable in this.table_content) {
      if (old_table_list[newtable]) continue;
      else {
        console.log("777");
        this.create_tabel(newtable);
      }
    }
  }

  async delete_table(table_name) {
    this.query("drop table ? ;",[table_name],(err,rows,fields)=>{
      if (err) console.log(err);
    });
  }

  async create_tabel(table_name) {
    console.log("0000000000000000 " + table_name);
    let column_content = this.table_content[table_name];

    // create new table
    var s = "create table if not exists " + table_name + " (";
    
    for (column_name in column_content) {
      if (column_name == "index_def") {
        s += " index ("
        for (let i = 0; i < column_content[column_name].length; i++){
          if (i == 0) s = s + column_content[column_name][i];
          else s = s + " ," + column_content[column_name][i];
        }
        s += " ),";
      }else if(column_name == "primary_def") {
        s = s + " primary key (" + column_content[column_name] + " ),";
      }else {
        if (!definition[column_content[column_name]]) continue;
        s = s + column_name + " " + definition[column_content[column_name]] + ",";
      }
    }
    s = s.Substring(0,s.Length-1);
    s += ");";
    console.log("22222222222222");
    console.log(s);

    // add table message into table_metadata and column_metadata
    s = ""
  }
}

var client = new mysql_server({
  user: "shareapp",
  password: "123"
},"../config/sqltable.json");
// client.init_table();
