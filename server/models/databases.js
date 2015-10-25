'use strict';

import Q from 'q'
import assert from 'assert'
import Sequelize from 'sequelize'

import load_database_cb from './load_database'
import add_database_cb from './add_database'
import { store, config } from '../common/store/index'



// INIT DATABASES REPOSITORY
var databases = {};



export function init(arg_server, arg_app_name)
{
  var self = this;
  console.log('init databases');
  
  // GET APP CONFIG
  var cfg_connexions = config.get_connexions();
  assert.ok(cfg_connexions, 'cfg_connexions');

  // LOOP ON CONNEXIONS CONFIGURATIONS
  var promises = [];
  cfg_connexions.forEach(
    function(arg_value, arg_index, arg_array)
    {
      promises.push( self.load_database(arg_value, arg_server) );
    }
  );
  
  return Q.all(promises);
}
  
  
export function load_database(arg_cx_name, arg_server) { return load_database_cb(databases, arg_cx_name, arg_server); }
  
  
export function add_database(arg_cx_name, arg_server) { return add_database_cb(databases, arg_cx_name, arg_server); }
  
  
export function get_database(arg_cx_name)
{
  console.info('getting database', arg_cx_name);
  
  if (arg_cx_name in databases)
  {
    return databases[arg_cx_name];
  }
  
  return null;
}
  
  
  // get_auth_database: function()
  // {
  //   return this.get_database(auth_cx_name);
  // },
  
  
export function get_databases()
{
  return Object.keys(databases);
}
