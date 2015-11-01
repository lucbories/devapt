'use strict';

var Q = require('q'),
    
    authentication = require('./authentication'),
    apps_config = require('../../apps/apps.json')
    ;


// GET APP CONFIG
var cfg_auth = apps_config.security.authorization;
// console.log(cfg_auth, 'cfg_auth');


// AUTHORIZATION API METHODS
var API_methods = [
  'init',
  'add_user_roles',
  'remove_user_roles',
  'get_user_roles',
  'has_user_role',
  'get_role_users',
  'add_role_parents',
  'remove_role_parents',
  'remove_role',
  'remove_resource',
  'allow remove_allow',
  'get_allowed_permissions',
  'is_allowed', 'are_any_roles_allowed',
  'get_role_permissions'
  ];


// CREATE DEFAULT AUTHORIZATION API
var API = {}
API.enabled = cfg_auth.enabled ? true : false;
API.mode = cfg_auth.mode || 'default';



/*
  ------------------------------------------------------------------------------------------
  Init authorization feature
  
  @param {string}   arg_user_identifier   user identifier (user name or login or email)
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.init = function(arg_server)
{
  console.info('init authorization (default)');
  return Q(true);
}



/*
  ------------------------------------------------------------------------------------------
  @desc             Add roles to given user
  
  @param {string}   arg_user_identifier   user identifier (user name or login or email)
  @param {array}    arg_roles             roles (array of strings)
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.add_user_roles = function(arg_user_identifier, arg_roles)
{
  console.info('add roles to given user (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc             Remove roles from given user
  
  @param {string}   arg_user_identifier   user identifier (user name or login or email)
  @param {array}    arg_roles             roles (array of strings)
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.remove_user_roles = function(arg_user_identifier, arg_roles)
{
  console.info('remove roles from given user (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc             Get roles of given user
  
  @param {string}   arg_user_identifier   user identifier (user name or login or email)
  
  @return {promise} Returns a promise of an array of roles
                    as resolved(array of strings):success, rejected(msg):failure
*/
API.get_user_roles = function(arg_user_identifier)
{
  console.info('get users of given role (default)');
  return Q([]);
}



/*
  ------------------------------------------------------------------------------------------
  @desc             Test if given user has given role
  
  @param {string}   arg_user_identifier   user identifier (user name or login or email)
  @param {string}   arg_role_name         role name
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.has_user_role = function(arg_user_identifier, arg_role_name)
{
  console.info('test if given user has given role (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc             Get users of given role
  
  @param {string}   arg_role_name         role name
  
  @return {promise} Returns a promise of an array of users identifiers
                    as resolved(array of strings):success, rejected(msg):failure
*/
API.get_role_users = function(arg_role_name)
{
  console.info('get roles of given user (default)');
  return Q([]);
}



/*
  ------------------------------------------------------------------------------------------
  @desc             Add parents roles to given child role
  
  @param {string}   arg_role_name         child role name
  @param {array}    arg_parents_roles     parent roles names
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.add_role_parents = function(arg_role_name, arg_parents_roles)
{
  console.info('add parents roles to given role (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc             Remove parents roles from given child role
  
  @param {string}   arg_role_name         child role name
  @param {array}    arg_parents_roles     parent roles names
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.remove_role_parents = function(arg_role_name, arg_parents_roles)
{
  console.info('remove parents roles to given role (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc             Remove given role
  
  @param {string}   arg_role_name         role name
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.remove_role = function(arg_role_name)
{
  console.info('remove given role (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc             Remove given resource
  
  @param {string}   arg_resource_name     resource name
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.remove_resource = function(arg_resource_name)
{
  console.info('remove given resource (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc                    Allow given permissions on given resource for given roles
  
  @param {string|array}    arg_roles             roles names (one string or an array of strings)
  @param {string|array}    arg_resources         resources names (one string or an array of strings)
  @param {string|array}    arg_permissions       permissions names (one string or an array of strings)
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.allow = function(arg_roles, arg_resources, arg_permissions)
{
  console.info('allow given permissions on given resource for given roles (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc                    Remove allowed given permissions on given resource for given roles
  
  @param {string|array}    arg_roles             roles names (one string or an array of strings)
  @param {string|array}    arg_resources         resources names (one string or an array of strings)
  @param {string|array}    arg_permissions       permissions names (one string or an array of strings)
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.remove_allow = function(arg_roles, arg_resources, arg_permissions)
{
  console.info('remove allowed for given permissions on given resource for given roles (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc                    Get allowed given permissions on given resource for given roles
  
  @param {string}          arg_user_identifier   user identifier (user name or login or email)
  @param {string|array}    arg_resources         resources names (one string or an array of strings)
  
  @return {promise} Returns a promise as resolved(array):success, rejected(msg):failure
*/
API.get_allowed_permissions = function(arg_user_identifier, arg_resources)
{
  console.info('get allowed permissions on given resources for given user (default)');
  return Q([]);
}



/*
  ------------------------------------------------------------------------------------------
  @desc                    Test if given user is allowed for given permissions on given resource
  
  @param {string}          arg_user_identifier   user identifier (user name or login or email)
  @param {string}          arg_resource_name     resource name
  @param {string|array}    arg_permissions       permissions names (one string or an array of strings)
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.is_allowed = function(arg_user_identifier, arg_resource_name, arg_permissions)
{
  console.info('test if given user is allowed for given permissions on given resource (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc                    Test if one of given roles is allowed for given permissions on given resource
  
  @param {string|array}    arg_roles             roles names (one string or an array of strings)
  @param {string}          arg_resource_name     resource name
  @param {string|array}    arg_permissions       permissions names (one string or an array of strings)
  
  @return {promise} Returns a promise as resolved(boolean):success, rejected(msg):failure
*/
API.are_any_roles_allowed = function(arg_roles, arg_resource_name, arg_permissions)
{
  console.info('test if one of given roles is allowed for given permissions on given resource (default)');
  return Q(false);
}



/*
  ------------------------------------------------------------------------------------------
  @desc                    Get what permissions on which resources is given roles allowed
  
  @param {string}          arg_role_name         role name
  
  @return {promise} Returns a promise as resolved(object):success, rejected(msg):failure
*/
API.get_role_permissions = function(arg_role_name)
{
  console.info('Get what permissions on which resources is given roles allowed (default)');
  return Q(false);
}



// SET DEFAULT AUTHORIZATION API
if (API.enabled)
{
  var backend = null;
  
  switch(API.mode)
  {
    case 'database':
    {
      backend = require('./authorization_db');
      // console.info('auth mode=database');
      break;
    }
    
   case 'jsonfile':
    {
      backend = require('./authorization_jsonfile');
      // console.info('auth mode=jsonfile');
      break;
    }
    
    default:
    {
      console.info('auth mode=default');
    }
  }
}


// UPDATE API WITH BACKEND
if (backend)
{
  API_methods.forEach(
    function(arg_value, arg_index, arg_array)
    {
      if (arg_value in backend)
      {
        API[arg_value] = backend[arg_value];
      }
    }
  );
}


// CHECK REQUEST
API.check_authorization = function(arg_request, arg_role)
{
  var credentials = authentication.get_credentials(arg_request);
  if (!credentials.user) return false;
  
  return API.has_user_role(credentials.user, arg_role);
};


// EXPORT AUTHORIZATION OBJECT
module.exports = API
export default API
