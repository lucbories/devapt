'use strict';

var Q = require('q'),
    app_config = require('../config/app_config'),
    databases = require('../models/databases'),
    models = require('../models/models'),
    authentication = require('../security/authentication'),
    authorization = require('../security/authorization')
    ;


// CREATE DEFAULT ROUTES API
var API = {};



var check_authorization = function(arg_request, arg_role)
{
  var credentials = authentication.get_credentials(arg_request);
  if (!credentials.user) return false;
  
  return authorization.has_user_role(credentials.user, arg_role);
};



function load_routes_for_model(arg_model_name)
{
  console.info('load routes for model [' + arg_model_name + ']');
  
  var model_record = null;
  var db = null;
  var roles = null;
  
  // GET AND CHECK MODEL
  model_record = models.get_model(arg_model_name);
  if (!model_record)
  {
    console.error('route loading failure for model: [%s]', arg_model_name);
    return Q(false);
  }
  
  // GET AND CHECK DATABASE
  db = databases.get_database(model_record.database);
  if (!db)
  {
    console.error('route loading failure for database: [%s]', model_record.database);
    return Q(false);
  }
  
  // GET ACCESS ROLES
  roles = model_record.roles;
  
  // CREATE REST RESOURCE
  model_record.includes.forEach(
    function(arg_value, arg_index, arg_array)
    {
      var loop_model = arg_array[arg_index].model;
      // console.log(loop_model, 'loop_model');
      // console.log((typeof loop_model), '(typeof loop_model)');
      if ( (typeof loop_model).toLocaleLowerCase() === 'string' )
      {
        model_record.includes[arg_index].model = models.get_model(loop_model).model;
      }
    }
  );
  
  var epilogue_settings = {
    model: model_record.model,
    endpoints: ['/' + arg_model_name, '/' + arg_model_name + '/:' + model_record.model.primaryKeyAttribute],
    include: model_record.includes
  };
  
  var model_resource = db.epilogue.resource(epilogue_settings);
  
  load_routes_for_model_resource(arg_model_name, model_resource, db, roles);
}



// CONFIGURE REST RESOURCE ACCESSES
var epilogue_module = require('epilogue');
var ForbiddenError = epilogue_module.Errors.ForbiddenError;
var NotFoundError = epilogue_module.Errors.NotFoundError;



// EPILOGUE CALLBACK FUNCTION TO CHECK AUTHENTICATION AND AUTHORIZATION
var security_epilogue_cb = function(arg_model_name, arg_role, arg_action_name)
{
  return function(arg_req, arg_res, arg_context)
  {
    console.info('check security for [' + arg_action_name + '] on model [' + arg_model_name + '] with role [' + arg_role + ']');
    
    var authentication_msg = 'Authentication is rejected to ' + arg_action_name + ' for model [' + arg_model_name + ']';
    var authorization_msg = 'Authorization is rejected to ' + arg_action_name + ' for model [' + arg_model_name + ']';
    var failure_msg = 'Failure for ' + arg_action_name + ' for model [' + arg_model_name + ']';
    
    var failure_cb = function(arg_msg)
    {
        return  arg_context.error( new ForbiddenError(failure_msg + ":[" + arg_msg + ']') );
    };
    
    var success_cb = function(arg_authenticated)
    {
      if (! arg_authenticated)
      {
        console.error(authentication_msg);
        // throw new ForbiddenError(authentication_msg);
        return arg_context.error( new ForbiddenError(authentication_msg) );
      }
      console.info('items ' + arg_action_name + ' authentication is accepted for model [' + arg_model_name + ']');
      
      check_authorization(arg_req, arg_role).then(
        function(arg_authorized)
        {
          if (! arg_authorized)
          {
            console.error(authorization_msg);
            // throw new ForbiddenError(authorization_msg);
            return arg_context.error( new ForbiddenError(authorization_msg) );
          }
        
          console.info('items ' + arg_action_name + ' authorization is accepted for model [' + arg_model_name + ']');
          return arg_context.continue();
        },
        failure_cb
      );
    }
    
    authentication.check_request(arg_req).then(success_cb, failure_cb);
  }
};



function load_routes_for_model_resource(arg_model_name, model_resource, db, arg_roles)
{
  console.info('load routes for model resource [' + arg_model_name + ']');
  
  
  // REGISTER CREATE ACCESS CHECK
  model_resource.create.auth( security_epilogue_cb(arg_model_name, arg_roles.create, 'create items') );
  
  // REGISTER LIST ACCESS CHECK
  model_resource.list.auth( security_epilogue_cb(arg_model_name, arg_roles.read, 'list items') );
  
  // REGISTER READ ACCESS CHECK
  model_resource.read.auth( security_epilogue_cb(arg_model_name, arg_roles.read, 'read an item') );
  
  // REGISTER UPDATE ACCESS CHECK
  model_resource.update.auth( security_epilogue_cb(arg_model_name, arg_roles.update, 'update items') );
  
  // REGISTER DELETE ACCESS CHECK
  model_resource.delete.auth( security_epilogue_cb(arg_model_name, arg_roles.delete, 'delete items') );
}



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
      
      check_authorization(arg_req, arg_role).then(
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
function load_routes_for_resources_set(arg_server, arg_set_name, arg_set_obj)
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
      var resources_list = Object.keys(arg_set_obj);
      
      // PREPARE AND SEND OUTPUT
      var output_json = JSON.stringify(resources_list);
      res.send(output_json);
      return next();
    }
  );
  
  // ADD RESOURCES GET ROUTES
  arg_server.get('/resources/' + arg_set_name + '/:name',
    security_restify_cb(null, 'ROLE_AUTH_USER_READ', 'list'),
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
      if (arg_set_name === 'connexions')
      {
        resource_def.host = 'host';
        resource_def.port = 'port';
        resource_def.user_name = 'user';
        resource_def.user_pwd = '******';
      }
      
      // PREPARE AND SEND OUTPUT
      var output_json = JSON.stringify(resource_def);
      res.send(output_json);
      return next();
    }
  );
}



API.init = function(arg_server)
{
  console.info('init routes');
  var models_module = models = require('../models/models');
  
  // ADD MODELS REST ROUTES
  console.info('init routes for REST server');
  var models_names = models_module.get_models();
  models_names.forEach(
    function(arg_value, arg_index, arg_array)
    {
      console.info('loading routes for model [%s]', arg_value);
      
      load_routes_for_model(arg_value);
    }
  );
  
  
  // GET RESOURCES
  console.info('init routes for resources server');
  var views = app_config.get_views();
  var models = app_config.get_models();
  var menubars = app_config.get_menubars();
  var menus = app_config.get_menus();
  var connexions = app_config.get_connexions();
  
  // ADD RESOURCES SET ROUTES
  load_routes_for_resources_set(arg_server, 'views', views);
  load_routes_for_resources_set(arg_server, 'models', models);
  load_routes_for_resources_set(arg_server, 'menubars', menubars);
  load_routes_for_resources_set(arg_server, 'menus', menus);
  load_routes_for_resources_set(arg_server, 'connexions', connexions);
  
  
  return Q(true);
};



// EXPORT
exports = module.exports = API;
