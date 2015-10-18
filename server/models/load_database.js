'use strict';

var Sequelize = require('sequelize'),
    Q = require('q'),
    assert = require('assert'),
    
    apps_config = require('../config/app_config'),
    
    add_database = require('./add_database')
    ;



// EXPORT API
module.exports = function load_database(arg_databases, arg_cx_name, arg_server)
{
  console.info('loading database', arg_cx_name);
  
  // GET APP CONFIG
  var cfg_connexions = apps_config.get_connexions();
  assert.ok(cfg_connexions, 'cfg_connexions');
  
  // CHECK CONNEXION NAME
  if (arg_cx_name in cfg_connexions)
  {
    var cx_obj = cfg_connexions[arg_cx_name];
    
    // GET ATTRIBUTES
    var cfg_db_engine = '' + cx_obj.engine;
    // var cfg_db_charset = '' + cx_obj.charset;
    // var cfg_db_options = '' + cx_obj.options; // TODO
    var cfg_db_name = cx_obj.database_name;
    var cfg_db_user = cx_obj.user_name;
    var cfg_db_password = cx_obj.user_pwd;
    
    // SET DB DIALECT
    var db_dialect = null;
    switch(cfg_db_engine.toLocaleLowerCase())
    {
      case 'pdo_mysql':
      case 'mysql':
        db_dialect = 'mysql';
        break;
      case 'pdo_mariadb':
      case 'mariadb':
        db_dialect = 'mariadb';
        break;
      case 'pdo_sqlite':
      case 'sqlite':
        db_dialect = 'sqlite';
        break;
      case 'pdo_postgres':
      case 'postgres':
        db_dialect = 'postgres';
        break;
      case 'pdo_mssql':
      case 'mssql':
        db_dialect = 'mssql';
        break;
        
      // case 'mongodb':
      //   db_dialect = 'mongodb';
      //   break;
    }
    assert.ok(db_dialect !== null, 'bad db dialect');
    
    // SET DB SETTINGS
    var db_options = {
      dialect:db_dialect,
      // dialectOptions: { charset:'utf-8'},
      
      host:cx_obj.host,
      port:cx_obj.port,
      
      logging:console.log, // OR false
      
      pool: {
        max: cx_obj.pool_max ? cx_obj.pool_max : 5,
        min: cx_obj.pool_min ? cx_obj.pool_min : 0,
        idle: cx_obj.pool_idle ? cx_obj.pool_idle : 10000
      }
    };
    
    // SET SQLITE FILE
    if (db_dialect === 'sqlite')
    {
      assert.ok( (typeof cx_obj.file).toLocaleLowerCase() === 'string', 'bad sqlite file');
      db_options.storage = cx_obj.file;
    }
    
    // if (cfg_db_options !== '')
    // {
    //   db_options.dialectOptions = cfg_db_options; // TODO CONVERT STRING TO PLAIN OBJECT
    // }

    // DEFINE AUTH DATABASE
    var db_sequelize = new Sequelize(cfg_db_name, cfg_db_user, cfg_db_password, db_options);
    
    return add_database(arg_databases, arg_cx_name, arg_server, db_sequelize);
  }
  
  console.error(cfg_connexions, 'databases.cfg_connexions');
  return Q(false);
}
