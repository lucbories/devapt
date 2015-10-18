'use strict';

var Sequelize = require('sequelize'),
    Q = require('q'),
    assert = require('assert'),
    
    apps_config = require('../config/app_config')
    ;



// EXPORT API
module.exports = function add_database(arg_databases, arg_cx_name, arg_server, arg_sequelize)
{
  console.info('adding database', arg_cx_name);
  
  if (arg_cx_name in arg_databases)
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
  arg_databases[arg_cx_name] = {
    name:arg_cx_name,
    epilogue:db_epilogue,
    sequelize:arg_sequelize
  }
  
  return Q(true);
}