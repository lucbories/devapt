'use strict';

var Sequelize = require('sequelize'),
    Q = require('q'),
    assert = require('assert'),
    app_config = require('../config/app_config');


// INIT DATABASES REPOSITORY
var databases = {};


// GET APP CONFIG
var cfg_auth = app_config.application.security.authentication;


// GET CONNEXIONS
var auth_cx_name = cfg_auth.connexion;
var cfg_connexions = app_config.application.connexions


// EXPORT API
module.exports = {
  init: function(arg_server)
  {
    if (auth_cx_name)
    {
      return this.load_database(auth_cx_name, arg_server);
    }
    
    return Q(true);
  },
  
  
  load_database: function(arg_cx_name, arg_server)
  {
    console.info('loading database', arg_cx_name);
    
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
        
        host:cx_obj.host,
        port:cx_obj.port,
        
        logging:false,
        
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
      
      return this.add_database(arg_cx_name, arg_server, db_sequelize);
    }
    
    console.error(cfg_connexions, 'databases.cfg_connexions');
    return Q(false);
  },
  
  
  add_database: function(arg_cx_name, arg_server, arg_sequelize)
  {
    console.info('adding database', arg_cx_name);
    
    if (arg_cx_name in databases)
    {
      return Q(true);
    }
    
    // LOAD EPILOGUE
    var db_epilogue = require('epilogue');
    
    // INITIALIZE EPILOGUE
    db_epilogue.initialize({
      app: arg_server,
      sequelize: arg_sequelize
    });
    
    // REGISTER A DATABASE
    databases[arg_cx_name] = {
      name:arg_cx_name,
      epilogue:db_epilogue,
      sequelize:arg_sequelize
    }
    
    return Q(true);
  },
  
  
  get_database: function(arg_cx_name)
  {
    console.info('getting database', arg_cx_name);
    
    if (arg_cx_name in databases)
    {
      return databases[arg_cx_name];
    }
    
    return null;
  },
  
  
  get_auth_database: function()
  {
    return this.get_database(auth_cx_name);
  },
  
  
  get_databases: function()
  {
    return Object.keys(databases);
  }
}