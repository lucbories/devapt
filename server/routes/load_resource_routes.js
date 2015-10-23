'use strict';

// import { dispatch } from 'redux'

import { dispatch_store_config_get_value } from '../../common/store/config/actions'
import { dispatch_store_runtime_get_value } from '../../common/store/runtime/actions'


var Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    
    app_config = require('../config/app_config'),
    databases = require('../models/databases'),
    models = require('../models/models'),
    authentication = require('../security/authentication'),
    authorization = require('../security/authorization')
    ;



// CONFIGURE REST RESOURCE ACCESSES
var epilogue_module = require('epilogue');
var ForbiddenError = epilogue_module.Errors.ForbiddenError;
var NotFoundError = epilogue_module.Errors.NotFoundError;





// CALLBACK FUNCTION TO CHECK AUTHENTICATION AND AUTHORIZATION
var security_restify_cb = function(arg_resource_name, arg_role, arg_action_name)
{
  return function(arg_req, arg_res, arg_next)
  {
    if (! arg_resource_name)
    {
      arg_resource_name = arg_req.params.name;
    }
    console.info('check security for [' + arg_action_name + '] on resource [' + arg_resource_name + '] with role [' + arg_role + ']');
    
    var authentication_msg = 'Authentication is rejected to ' + arg_action_name + ' for resource [' + arg_resource_name + ']';
    var authorization_msg = 'Authorization is rejected to ' + arg_action_name + ' for resource [' + arg_resource_name + ']';
    var failure_msg = 'Failure for ' + arg_action_name + ' for resource [' + arg_resource_name + ']';
    
    var failure_cb = function(arg_msg)
    {
        var error = new ForbiddenError(failure_msg + ":[" + arg_msg + ']');
        return arg_next(error);
    };
    
    var success_cb = function(arg_authenticated)
    {
      if (! arg_authenticated)
      {
        console.error(authentication_msg);
        var error = new ForbiddenError(authentication_msg);
        return arg_next(error);
      }
      console.info('items ' + arg_action_name + ' authentication is accepted for resource [' + arg_resource_name + ']');
      
      authorization.check_authorization(arg_req, arg_role).then(
        function(arg_authorized)
        {
          if (! arg_authorized)
          {
            console.error(authorization_msg);
            var error = new ForbiddenError(authorization_msg);
            return arg_next(error);
          }
        
          console.info('items ' + arg_action_name + ' authorization is accepted for resource [' + arg_resource_name + ']');
          return arg_next();
        },
        failure_cb
      );
    }
    
    authentication.check_request(arg_req).then(success_cb, failure_cb);
  }
};


// REGISTER ROUTES FOR RESOURCES SET
// EXPORT
exports = module.exports = function load_resource_routes(arg_server, arg_set_name, arg_set_obj)
{
  console.info('loading routes get for resources set [%s]', arg_set_name);
  
  // CHECK SET NAME
  var set_is_valid = arg_set_name in {'views':0, 'models':0, 'menubars':0, 'menus':0, 'connexions':0};
  if (! set_is_valid)
  {
    console.error('bad resources set name [%s]', arg_set_name);
    return;
  }
  
  // ADD RESOURCES LIST ROUTES
  arg_server.get('/resources/' + arg_set_name,
    security_restify_cb(arg_set_name, 'ROLE_AUTH_USER_READ', 'list'),
    function (req, res, next)
    {
      var resources_list = dispatch_store_runtime_get_value(['runtime', 'application', 'resources'])
//      var resources_list = Object.keys(arg_set_obj);
      
      // PREPARE AND SEND OUTPUT
      res.contentType = 'json';
      res.send({ resources: resources_list });
      return next();
    }
  );
  
  // ADD RESOURCES GET ROUTES
  arg_server.get('/resources/' + arg_set_name + '/:name',
    security_restify_cb(null, 'ROLE_AUTH_USER_READ', 'list'), // TODO ROLE FOR ACCESS
    function (req, res, next) 
    {
      var resource_name = req.params.name;
      
      // CHECK RESOURCE NAME
      var resource_is_valid = resource_name in arg_set_obj;
      if (! resource_is_valid)
      {
        var error_msg = 'resource not found [%s] in resources set [%s]';
        console.error('resource not found [%s] in resources set [%s]', resource_name, arg_set_name);
        var error = new NotFoundError(error_msg, resource_name, arg_set_name);
        return next(error);
      }
      
      // GET RESOURCE DEFINITION
      var resource_def = arg_set_obj[resource_name];
      
      // WRAP CONNEXIONS ATTRIBUTES
      if (arg_set_name === 'connexions')
      {
        resource_def.host = 'host';
        resource_def.port = 'port';
        resource_def.user_name = 'user';
        resource_def.user_pwd = '******';
      }
      
      // WRAP INCLUDED FILE
      if ( (typeof resource_def.include_file_path_name) === 'string' )
      {
        console.log('resource_def.include_file_path_name', resource_def.include_file_path_name);
        
        var file_path = path.join(__dirname, '../../apps/private/', resource_def.include_file_path_name);
        console.log('file_path', file_path);
        
        fs.readFile(file_path, {encoding: 'utf-8'},
          function(err, data)
          {
            if (err)
            {
              var error_msg = 'resource include file not found [%s] for resource [%s]';
              console.error(error_msg, resource_name, file_path);
              var error = new NotFoundError(error_msg, resource_name, file_path);
              return next(error);
            }
            
            console.log('file is read');
            resource_def.include_file_content = data;
            
            res.contentType = 'json';
            res.send(resource_def);
          }
        );
        
        return next();
      }
      
      // PREPARE AND SEND OUTPUT
      res.contentType = 'json';
      res.send(resource_def);
      return next();
    }
  );
  
  // ADD RESOURCES GET ROUTES
  arg_server.get('/resources/:name',
    security_restify_cb(null, 'ROLE_AUTH_USER_READ', 'list'), // TODO ROLE FOR ACCESS
    function (arg_req, arg_res, arg_next) 
    {
      var resource_name = arg_req.params.name;
      
      var resources_sets = ['views', 'models', 'menubars', 'menus', 'connexions'];
      var set_name = null;
      var set_index = null;
      for(set_index in resources_sets)
      {
        set_name = resources_sets[set_index];
        var resource_def = app_config.get_resource(set_name, resource_name);
        
        // NOT FOUND IN CURRENT SET
        if (! resource_def)
        {
          continue;
        }
        
        // RESOURCE DEFINITION FOUND IN CURRENT SET
        if (set_name === 'connexions')
        {
          resource_def.host = 'host';
          resource_def.port = 'port';
          resource_def.user_name = 'user';
          resource_def.user_pwd = '******';
        }
        
        // PREPARE AND SEND OUTPUT
        // var output_json = JSON.stringify(resource_def);
        arg_res.contentType = 'json';
        arg_res.send(resource_def);
        return arg_next();
      }
      
      // NOT FOUND IN ALL SETS
      var error_msg = 'resource not found [%s] in all resources sets';
      console.error(error_msg, resource_name);
      arg_res.status(404);
      arg_res.send(error_msg);
      return arg_next();
    }
  );
}

