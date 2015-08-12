'use strict';

var Q = require('q'),
    assert = require('assert'),
    models = require('../models/models'),
    app_config = require('../config/app_config');


// GET APP CONFIG
var cfg_auth = app_config.application.security.authentication;
assert.ok(cfg_auth && cfg_auth.mode, 'bad authentication configuration (need application.security.authentication.mode)');
assert.ok(cfg_auth && cfg_auth.model, 'bad authentication configuration (need application.security.authentication.model)');
assert.ok(cfg_auth && cfg_auth.username, 'bad authentication configuration (need application.security.authentication.username)');
assert.ok(cfg_auth && cfg_auth.password, 'bad authentication configuration (need application.security.authentication.password)');



/* EXAMPLE OF CONFIGURATION:
      application.security.authentication.enabled=true
      application.security.authentication.mode=database
      application.security.authentication.model=AUTH_MODEL_USERS
      application.security.authentication.username=login
      application.security.authentication.password=password
*/
// GET AUTHENTICATION CONFIGURATION
var mode = cfg_auth.mode;
var model_name = cfg_auth.model;
var model_username = cfg_auth.username;
var model_password = cfg_auth.password;


// GET MODEL
var auth_model_obj = models.get_model(model_name);
assert.ok(auth_model_obj, 'Authentication model resource');


// DEFINE EXPORTED MODULE API
var API = {};


// INIT AUTHENTICATION 
API.init = function(arg_server)
{
  return models.ready_promise;
};


// AUTHENTICATE A USER
API.authenticate = function(arg_login, arg_password)
{
  var query = {
    attributes: [model_username, model_password]
  };
  query.where[model_username] = arg_login;
  
  var success_cb = function(arg_user)
  {
    console.log(arg_user, 'authenticate.user');
    if (arg_user.password === arg_password)
    {
      return true;
    }
    return false;
  };
  
  var failure_cb = function()
  {
    return false;
  };
  
  var promise = auth_model_obj.findOne(query);
  promise.then(success_cb, failure_cb);
  
  return promise;
};


// LOGIN A USER AND START A SESSION (NOT YET AVAILABLE)
API.login = function(arg_login, arg_password)
{
  return this.authenticate(arg_login, arg_password);
};


// LOGOUT A USER AND END A SESSION (NOT YET AVAILABLE)
API.logout = function(arg_login)
{
  return Q(false);
};


// GET A USER TOKEN
API.get_token = function(arg_login, arg_password)
{
  return Q(null);
};


// RENEW A USER TOKEN
API.renew_token = function(arg_login, arg_token)
{
  return Q(null);
};


// CHECK A USER TOKEN
API.check_token = function(arg_login, arg_token)
{
  return Q(null);
};


// EXPORT AUTHENTICATION MODULE API
module.exports = API;