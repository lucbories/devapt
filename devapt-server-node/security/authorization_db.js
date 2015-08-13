'use strict';

var Q = require('q'),
    assert = require('assert'),
    models = require('../models/models'),
    Sequelize = require('Sequelize'),
    app_config = require('../config/app_config');


// GET APP CONFIG
var cfg_auth = app_config.application.security.authorization;
assert.ok(cfg_auth && cfg_auth.mode, 'bad authorization configuration (need application.security.authorization.mode)');
assert.ok(cfg_auth && cfg_auth.model, 'bad authorization configuration (need application.security.authorization.model)');
assert.ok(cfg_auth && cfg_auth.username, 'bad authorization configuration (need application.security.authorization.username)');
assert.ok(cfg_auth && cfg_auth.role, 'bad authorization configuration (need application.security.authorization.role)');



/* EXAMPLE OF CONFIGURATION:
      application.security.authorization.enabled=FALSE
      application.security.authorization.mode=database
      application.security.authorization.model=MODEL_AUTH_USERS_ROLES
      application.security.authorization.role=label
      application.security.authorization.username=login
*/
// GET AUTHORIZATION CONFIGURATION
var mode = cfg_auth.mode;
var model_name = cfg_auth.model;
var model_role = cfg_auth.role;
var model_username = cfg_auth.username;


// GET MODEL
var auth_model_record = null;


// DEFINE EXPORTED MODULE API
var API = {};


// INIT AUTHORIZATION 
API.init = function(arg_server)
{
  console.info('init authorization (DB)');
  
  auth_model_record = models.get_model(model_name);
  assert.ok(auth_model_record && auth_model_record.model, 'Authorization model resource [' + model_name + ']');
  
  return (auth_model_record && auth_model_record.model) ? Q(true): Q.defer().reject();
};


// TEST IF A USER HAS A GIVEN ROLE
API.has_user_role = function(arg_username, arg_role_name)
{
  console.info('authorization.has_user_role for user [' + arg_username + '] and role [' + arg_role_name + '] (DB)');
  
  assert.ok(auth_model_record && auth_model_record.model, 'Authorization model resource [' + model_name + ']');
  
  // DEFINE WHERE CLAUSE FOR USER
  var query_username = {
    where: {},
    include:{ all:true }
  };
  query_username.where[model_username] = arg_username;
  console.log(query_username, 'query_username');
  
  // USER PROMISE SUCCESS CALLBACK
  var success_cb = function(arg_user)
  {
    // console.log(arg_user, 'authorization.user success');
    
    var user = arg_user.toJSON();
    // console.log(user, 'authorization.user JSON');
    
    var result = user.roles.filter( function(arg_obj) { return arg_obj[model_role] === arg_role_name} );
    // console.log(result, 'result');
    // console.log(result.length > 0, 'result');
    
    return result.length > 0;
  };
  
  // USER PROMISE FAILURE CALLBACK
  var failure_cb = function()
  {
    return false;
  };
  
  // QUERY A USER
  var promise = auth_model_record.model.findOne(query_username);
  promise.then(success_cb, failure_cb);
  
  return promise;
};


// EXPORT AUTHORIZATION MODULE API
module.exports = API;
