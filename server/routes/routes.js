'use strict';

var Q = require('q'),
    
    app_config = require('../config/app_config'),
    models_module = require('../models/models'),
    
    load_model_routes = require('./load_model_routes'),
    load_resource_routes = require('./load_resource_routes'),
    load_security_routes = require('./load_security_routes')
    ;


// CREATE DEFAULT ROUTES API
var API = {};



API.init = function(arg_server)
{
  console.info('init routes');
  
  
  // ADD SECURITY ROUTES
  load_security_routes(arg_server);
  
  
  // ADD MODELS REST ROUTES
  console.info('init routes for REST server');
  var models_names = models_module.get_models();
  models_names.forEach(
    function(arg_value, arg_index, arg_array)
    {
      console.info('loading routes for model [%s]', arg_value);
      
      load_model_routes(arg_value);
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
  load_resource_routes(arg_server, 'views', views);
  load_resource_routes(arg_server, 'models', models);
  load_resource_routes(arg_server, 'menubars', menubars);
  load_resource_routes(arg_server, 'menus', menus);
  load_resource_routes(arg_server, 'connexions', connexions);
  
  
  return Q(true);
};



// EXPORT
exports = module.exports = API;
