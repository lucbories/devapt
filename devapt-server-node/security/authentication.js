'use strict';

var Q = require('q'),
    app_config = require('../config/app_config'),
    md5 = require('MD5');


// GET APP CONFIG
var cfg_auth = app_config.application.security.authentication;
// console.log(cfg_auth, 'cfg_auth');



// CREATE DEFAULT AUTHENTICATION API
var auth_api = {}
auth_api.enabled = cfg_auth.enabled;
auth_api.mode = cfg_auth.mode;


auth_api.init = function(arg_server)
{
  console.info('init authentication (default)');
  return Q(true);
};


auth_api.hash_password = function(arg_password)
{
  return md5(arg_password);
};



auth_api.get_credentials = function(arg_request)
{
  /* AUTHENTICATION FROM HEADER
    req.username=...
    req.authorization={
      scheme: <Basic|Signature|...>,
      credentials: <Undecoded value of header>,
      basic: {
        username: $user
        password: $password
      }
    }
    */
  // console.log(arg_request.params, 'request.params');
  
  var credentials = { 'user':null, 'password':null };
  if (!arg_request) return credentials;
  
  
  if (arg_request && arg_request.params && arg_request.params.username && arg_request.params.password)
  {
    console.info('authentication with params args');
    credentials.user = arg_request.params.username;
    credentials.password = arg_request.params.password;
    return credentials;
  }
  
  if (arg_request.authorization)
  {
    console.info('authentication with basic auth header args');
    if (!arg_request.authorization.basic) return credentials;
    credentials.user = arg_request.authorization.basic.username;
    credentials.password = arg_request.authorization.basic.password;
    return credentials;
  }
  
  console.error('credentials failure without args');
  return credentials;
};



auth_api.check_request = function(arg_request)
{
  var self = this;
  var credentials = self.get_credentials(arg_request);
  
  if (!self.enabled) return Q(true);
  
  if (!credentials.user || !credentials.password) return Q(false);
  
  
  return self.authenticate(credentials.user, credentials.password);
};


  
auth_api.authenticate = function(arg_login, arg_password)
{
  console.info('authenticate a user [' + arg_login + '] with a password (default)');
  return Q(false);
};



auth_api.login = function(arg_login, arg_password)
{
  console.info('login a user [' + arg_login + '] with a password (default)');
  return Q(false);
};



auth_api.logout = function(arg_login)
{
  console.info('logout a user [' + arg_login + '] (default)');
  return Q(false);
};

auth_api.get_token = function(arg_login, arg_password)
{
  console.info('get token for given user [' + arg_login + '] with a password (default)');
  return Q(null);
};

auth_api.renew_token = function(arg_login, arg_token)
{
  console.info('renew given token for given user [' + arg_login + '] (default)');
  return Q(null);
};

auth_api.check_token = function(arg_login, arg_token)
{
  console.info('check token for given user [' + arg_login + '] with a token (default)');
  return Q(null);
};


// SET DEFAULT AUTHENTICATION API
if (auth_api.enabled)
{
  var auth_alt_api = null;
  
  switch(auth_api.mode)
  {
    case 'database':
    {
      auth_alt_api = require('./authentication_db');
      // console.info('auth mode=database');
      
      auth_api.init         = auth_alt_api.init         ? auth_alt_api.init         : auth_api.init;
      auth_api.authenticate = auth_alt_api.authenticate ? auth_alt_api.authenticate : auth_api.authenticate;
      auth_api.login        = auth_alt_api.login        ? auth_alt_api.login        : auth_api.login;
      auth_api.logout       = auth_alt_api.logout       ? auth_alt_api.logout       : auth_api.logout;
      auth_api.get_token    = auth_alt_api.get_token    ? auth_alt_api.get_token    : auth_api.get_token;
      auth_api.renew_token  = auth_alt_api.renew_token  ? auth_alt_api.renew_token  : auth_api.renew_token;
      auth_api.check_token  = auth_alt_api.check_token  ? auth_alt_api.check_token  : auth_api.check_token;
      break;
    }
    
   case 'jsonfile':
    {
      auth_alt_api = require('./authentication_jsonfile');
      // console.info('auth mode=jsonfile');
      
      auth_api.init         = auth_alt_api.init         ? auth_alt_api.init         : auth_api.init;
      auth_api.authenticate = auth_alt_api.authenticate ? auth_alt_api.authenticate : auth_api.authenticate;
      auth_api.login        = auth_alt_api.login        ? auth_alt_api.login        : auth_api.login;
      auth_api.logout       = auth_alt_api.logout       ? auth_alt_api.logout       : auth_api.logout;
      auth_api.get_token    = auth_alt_api.get_token    ? auth_alt_api.get_token    : auth_api.get_token;
      auth_api.renew_token  = auth_alt_api.renew_token  ? auth_alt_api.renew_token  : auth_api.renew_token;
      auth_api.check_token  = auth_alt_api.check_token  ? auth_alt_api.check_token  : auth_api.check_token;
      break;
    }
    
    default:
    {
      console.info('auth mode=default');
    }
    /*
    case 'passport':
    {
      auth_alt_api = require('./authentication_db');
      
      auth_api.ready_promise= auth_alt_api.ready_promise? auth_alt_api.ready_promise: auth_api.ready_promise;
      auth_api.init         = auth_alt_api.init         ? auth_alt_api.init         : auth_api.init;
      auth_api.authenticate = auth_alt_api.authenticate ? auth_alt_api.authenticate : auth_api.authenticate;
      auth_api.login        = auth_alt_api.login        ? auth_alt_api.login        : auth_api.login;
      auth_api.logout       = auth_alt_api.logout       ? auth_alt_api.logout       : auth_api.logout;
      auth_api.get_token    = auth_alt_api.get_token    ? auth_alt_api.get_token    : auth_api.get_token;
      auth_api.renew_token  = auth_alt_api.renew_token  ? auth_alt_api.renew_token  : auth_api.renew_token;
      auth_api.check_token  = auth_alt_api.check_token  ? auth_alt_api.check_token  : auth_api.check_token;
      break;
    }*/
  }
}


// EXPORT AUTHENTICATION OBJECT
module.exports = auth_api
