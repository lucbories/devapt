'use strict';

var Q = require('q'),
    fs = require('fs'),
    path = require('path'),
    epilogue_module = require('epilogue'),
    
    app_config = require('../config/app_config'),
    databases = require('../models/databases'),
    models = require('../models/models'),
    // authentication = require('../security/authentication'),
    authorization = require('../security/authorization'),
    
    ForbiddenError = epilogue_module.Errors.ForbiddenError,
    NotFoundError = epilogue_module.Errors.NotFoundError
    ;



// EXPORT
exports = module.exports = function load_routes_for_model(arg_model_name)
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
    include: model_record.includes/*,
    search: {
      param: 'searchOnlyUsernames',
      operator: '$gt', // $like as default or $ne, $not, $gte, $gt, $lte, $lt, $like (default), $ilike/$iLike, $notLike, $notILike
      attributes: [ 'username' ]
    },
    sort: {
      default: '-email,username',
      param: 'orderby',
      attributes: [ 'username' ]
    },
    pagination: false // default: true with use of offset and count or page and count
    */
  };
  
  var model_resource = db.epilogue.resource(epilogue_settings);
  
  load_routes_for_model_resource(arg_model_name, model_resource, db, roles);
}



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
      
      authorization.check_authorization(arg_req, arg_role).then(
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

