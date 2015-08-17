'use strict';

var Q = require('q'),
    assert = require('assert'),
    restify = require('restify'),
	path = require('path'),
	
    app_config = require('./config/app_config'),
    apps_config = require('../apps/apps.json'),
	
    databases = require('./models/databases'),
    models = require('./models/models'),
    authentication = require('./security/authentication'),
    authorization = require('./security/authorization'),
    routes = require('./routes/routes')
    ;



// EXPORTED APPS API
var API = {};



API.init = function(arg_server)
{
	var self = this;
	console.info('init all applications');
	
		
	// LOAD ALL APPS CONFIGURATIONS
	var promise = self.load_all_apps(arg_server)
	
	
	// INITIALIZE DATABASES
	.then(
		function()
		{
			return databases.init(arg_server);
		}
	)
	
	// INITIALIZE MODELS
	.then(
		function()
		{
			return models.init(arg_server);
		}
	)
	
	// INITIALIZE REST ROUTES
	.then(
		function()
		{
			return routes.init(arg_server);
		}
	)
	
	// INITIALIZE AUTHENTICATION
	.then(
		function()
		{
			return authentication.init(arg_server);
		}
	)
	
	// INITIALIZE AUTHORIZATION
	.then(
		function()
		{
			return authorization.init(arg_server);
		}
	)
	
	return promise;	
};



API.load_all_apps = function(arg_server)
{
	console.info('loading all applications');
	
	// INITIALIZE STATIC FILES ROUTES FOR ALL APPS
	var app_record = null;
	var app_cfg_file = null;
	var app_base_dir = null;
	var app_url_base = null;
	var app_url_default = null;
	
	var app_public_dir = '../apps/public/';
	
	var app_static_cb = null;
	
	var app_loader_promise = null;
	var all_loader_promises = [];
	
	// LOOP ON REGISTERED APPLICATIONS AND LOAD EACH APPLICATION CONFIGURATION
	var apps_list = apps_config.apps;
	Object.keys(apps_list).forEach(
		function(arg_value, arg_index, arg_array)
		{
			console.info('loading application [%s]', arg_value);
			
			app_record = apps_list[arg_value];
			
			app_cfg_file = app_record.config;
			app_base_dir = '../apps/' + app_record.base;
			
			app_loader_promise = app_config.load_app_config(app_cfg_file, app_base_dir, false);
			
			all_loader_promises.push(app_loader_promise);
			
			app_loader_promise.done(
				function(arg_loaded_cfg)
				{
					console.info('registering static files for application [%s] at url [%s]', arg_value, arg_loaded_cfg.url.base);
					
					app_url_base = arg_loaded_cfg.url.base + '.*';
					app_url_default = arg_loaded_cfg.url.default;
					app_url_default = (app_url_default ? app_url_default : 'index.html');
					
					// CHECK URL BASE
					assert.ok( (typeof app_url_base) === 'string' && app_url_base.length > 3);
					
					app_static_cb = restify.serveStatic(
						{
							directory: app_public_dir,
							default: app_url_default
						}
					);
					
					arg_server.get(app_url_base, app_static_cb);
					
					console.info('new static route at [%s] default [%s] in [%s]', app_url_base, app_url_default, app_public_dir);
				}
			);
		}
	);
	
	return Q.all(all_loader_promises)
}


module.exports = API;