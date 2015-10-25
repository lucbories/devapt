'use strict';

import { store, config } from '../common/store/index'

var Q = require('q'),
    assert = require('assert'),
    restify = require('restify'),
	// path = require('path'),
	
    // app_config = require('./config/app_config'),
    // apps_config = require('../apps/apps.json'),
	
    databases = require('./models/databases'),
    models = require('./models/models'),
    authentication = require('./security/authentication'),
    authorization = require('./security/authorization'),
    routes = require('./routes/routes')
    ;



let init = function(arg_server)
{
	let self = this
	console.info('init all applications')
	
		
	// LOAD ALL APPS CONFIGURATIONS
	let promise = self.load_all_apps(arg_server)
	
	
	// INITIALIZE DATABASES
	.then(
		function()
		{
			return databases.init(arg_server)
		}
	)
	
	// INITIALIZE MODELS
	.then(
		function()
		{
			return models.init(arg_server)
		}
	)
	
	// INITIALIZE REST ROUTES
	.then(
		function()
		{
			return routes.init(arg_server)
		}
	)
	
	// INITIALIZE AUTHENTICATION
	.then(
		function()
		{
			return authentication.init(arg_server)
		}
	)
	
	// INITIALIZE AUTHORIZATION
	.then(
		function()
		{
			return authorization.init(arg_server)
		}
	)
	
	return promise
}



let load_all_apps = function(arg_server)
{
	console.info('loading all applications')
	
	// INITIALIZE STATIC FILES ROUTES FOR ALL APPS
	let app_record = null
	let app_url_base = null
	let app_url_default = null
	
	let app_public_dir = '../apps/public/'
	
	let app_static_cb = null
	
	
	// REGISTER JS ASSETS DEV ROUTE
	app_static_cb = restify.serveStatic(
		{
			directory: '../'/*,
			default: 'index.html'*/
		}
	);
	arg_server.get('/client/.*', app_static_cb)
	console.info('registering static route for application dev JS [%s] at url [%s]', '../client/', '/client/.*')
	
	
	// REGISTER JS ASSETS PRODUCTION ROUTE
	app_static_cb = restify.serveStatic(
		{
			directory: app_public_dir/*,
			default: 'index.html'*/
		}
	)
	arg_server.get('/assets/js/.*', app_static_cb)
	console.info('registering static route for application production JS [%s] at url [%s]', '../apps/public/', '/assets/js/.*')
	
	
	// REGISTER CSS ASSETS PRODUCTION ROUTE
	app_static_cb = restify.serveStatic(
		{
			directory: app_public_dir/*,
			default: 'index.html'*/
		}
	)
	arg_server.get('/assets/css/.*', app_static_cb)
	console.info('registering static route for application production CSS [%s] at url [%s]', '../apps/public/', '/assets/css/.*')
	
	
	// REGISTER CSS ASSETS PRODUCTION ROUTE
	app_static_cb = restify.serveStatic(
		{
			directory: app_public_dir/*,
			default: 'index.html'*/
		}
	)
	arg_server.get('/assets/img/.*', app_static_cb)
	console.info('registering static route for application production IMG [%s] at url [%s]', '../apps/public/', '/assets/img/.*')
	
	
	// LOOP ON REGISTERED APPLICATIONS AND LOAD EACH APPLICATION CONFIGURATION
	var apps_list = config.get_applications()
	apps_list.forEach(
		function(arg_app_name)
		{
			console.info('loading application [%s]', arg_app_name)
			
			// GET APP CONFIG
			app_record = config.get_application(arg_app_name)
			let app_url = app_record.url
			console.info('registering static files for application [%s] at url [%s]', arg_app_name, app_url)
			
			// REGISTER STATIC FILES ROUTES FOR APPLICATION
			app_url_base = app_url + '.*';
			app_url_default = app_record.url.default;
			app_url_default = (app_url_default ? app_url_default : 'index.html');
			assert.ok( (typeof app_url_base) === 'string' && app_url_base.length > 3);
			
			app_static_cb = restify.serveStatic(
				{
					directory: app_public_dir,
					default: app_url_default
				}
			);
			arg_server.get(app_url_base, app_static_cb);
			console.info('new static route at [%s] default [%s] in [%s]', app_url_base, app_url_default, app_public_dir)
			
			
			// REGISTER APPLICATION CONFIGURATION ROUTE FOR APPLICATION
			app_url_base = '/resources/applications/' + arg_app_name // TODO
			app_static_cb = function (req, res, next)
			{
				// PREPARE AND SEND OUTPUT
				var safe_config = app_record;
				safe_config.connexions = null;
				res.contentType = 'json';
				res.send(safe_config);
				return next();
			};
			arg_server.get(app_url_base, app_static_cb);
			console.info('new application [%s] configuration route [%s]', arg_app_name, app_url_base)
		}
	)
	
	return Q(true)
}


export { init, load_all_apps }
