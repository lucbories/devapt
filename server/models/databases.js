'use strict';

var Sequelize = require('sequelize'),
    Q = require('q'),
    assert = require('assert'),
    
    apps_config = require('../config/app_config'),
    
    load_database = require('./load_database'),
    add_database = require('./add_database')
    ;


// INIT DATABASES REPOSITORY
var databases = {};




// EXPORT API
module.exports = {
  init: function(arg_server, arg_app_name)
  {
    var self = this;
    console.log('init databases');
    
    // GET APP CONFIG
    var cfg_connexions = apps_config.get_connexions();
    assert.ok(cfg_connexions, 'cfg_connexions');

    // LOOP ON CONNEXIONS CONFIGURATIONS
    var promises = [];
    Object.keys(cfg_connexions).forEach(
      function(arg_value, arg_index, arg_array)
      {
        promises.push( self.load_database(arg_value, arg_server) );
      }
    );
    
    return Q.all(promises);
  },
  
  
  load_database: function(arg_cx_name, arg_server) { return load_database(databases, arg_cx_name, arg_server); },
  
  
  add_database: function(arg_cx_name, arg_server) { return add_database(databases, arg_cx_name, arg_server); },
  
  
  get_database: function(arg_cx_name)
  {
    console.info('getting database', arg_cx_name);
    
    if (arg_cx_name in databases)
    {
      return databases[arg_cx_name];
    }
    
    return null;
  },
  
  
  // get_auth_database: function()
  // {
  //   return this.get_database(auth_cx_name);
  // },
  
  
  get_databases: function()
  {
    return Object.keys(databases);
  }
}