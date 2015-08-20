'use strict';

var parser = require('./ini_parser'),
	Q = require('q'),
	path = require('path'),
	assert = require('assert'),
	module_config = require('./module_config');


/*
	application....
		modules.AAA.
			views[]: file path name
			models[]: file path name
			menubars[]: file path name
			menus[]: file path name
			connexions[]: file path name
*/


// GLOBAL CONFIG REPOSITORY
var loaded_configs = {};
loaded_configs.apps = {};
loaded_configs.files = {};


// GLOBAL RESOURCES
loaded_configs.views = {};
loaded_configs.models = {};
loaded_configs.menubars = {};
loaded_configs.menus = {};
loaded_configs.connexions = {};


// LOAD AN APPLICATION CONFIGURATION
function load_app_config(arg_file_path_name, arg_base_dir, arg_force_reload)
{
	console.info('loading application configuration from file [%s] of private dir [%s]', arg_file_path_name, arg_base_dir);
	
	var app_config_path = path.join(arg_base_dir, arg_file_path_name);
	
	
	if ( (app_config_path in loaded_configs.files) && !!! arg_force_reload)
	{
		return loaded_configs.files[app_config_path];
	}
	
	
	// LOAD APPLICATION INI CONFIGURATION
	var app_config = parser.read(app_config_path, 'utf-8');
	console.info('loading application configuration: file [%s]', app_config_path);
	if ( ! ('application' in app_config) )
	{
		throw Error('No application root key in configuration');
	}
	
	
	// INIT CONFIGURATION
	app_config.application['views'] = {};
	app_config.application['models'] = {};
	app_config.application['menubars'] = {};
	app_config.application['menus'] = {};
	app_config.application['connexions'] = {};
	app_config['basedir'] = arg_base_dir;
	
	
	// INIT TMP VARS
	var module_type = null;
	var msg = null;
	var loading_base_dir = path.join(arg_base_dir, '..');
	
	
	// LOAD CONNEXIONS application.resources.connexions.*
	if ('resources' in app_config.application)
	{
		var resources = app_config.application.resources;
		if ((typeof resources) !== 'object')
		{
			module_type = (typeof resources).toString();
			msg = 'Bad type for application.resources [' + module_type + ']';
			throw Error(msg);
		}
	}
	if ('connexions' in app_config.application.security)
	{
		var connexions = app_config.application.security.connexions;
		if ((typeof connexions) !== 'object')
		{
			module_type = (typeof connexions).toString();
			msg = 'Bad type for application.resources.connexions [' + module_type + ']';
			throw Error(msg);
		}
		assert.ok(connexions.files, 'connexions.files');
		connexions = connexions.files;
		
		var res_type = 'connexions';
		// var res_obj = null;
		var res_config = null
		var res_filename = null;
		
		Object.keys(connexions).forEach(
			function(arg_value, arg_index, arg_array)
			{
				res_filename = path.join(arg_base_dir, connexions[arg_value]);
				res_config = parser.read(res_filename, 'utf-8');
				console.info('loading application configuration of [%s] resources: file [%s]', res_type, res_filename);
				
				Object.keys(res_config).forEach(
					function(arg_res_name, arg_res_index, arg_res_array)
					{
						app_config.application[res_type][arg_res_name] = res_config[arg_res_name];
						app_config.application[res_type][arg_res_name].name = arg_res_name;
						loaded_configs[res_type][arg_res_name] = res_config[arg_res_name];
					}
				);
			}
		);
	}
	
	
	// LOAD MODULES application.modules.*
	if ('modules' in app_config.application)
	{
		var modules = app_config.application.modules;
		if ((typeof modules) !== 'object')
		{
			module_type = (typeof modules).toString();
			msg = 'Bad type for application.modules [' + module_type + ']';
			throw Error(msg);
		}
		
		// LOOP ON MODULES NAMES
		Object.keys(modules).forEach(
			function(arg_module_name/*, arg_index, arg_array*/)
			{
				var module_obj = modules[arg_module_name];
				
				// LOAD MODULE CONFIGURATION
				var out_cfg = module_config.load_module(arg_module_name, module_obj, loading_base_dir);
				// console.log(out_cfg, 'out_cfg');
				// console.log(typeof out_cfg, 'out_cfg');
				
				// LOOP ON RESOURCES TYPES
				Object.keys(out_cfg).forEach(
					function(arg_res_type/*, arg_index, arg_array*/)
					{
						var resources_obj = out_cfg[arg_res_type];
						
						// LOOP ON RESOURCES NAMES
						Object.keys(resources_obj).forEach(
							function(arg_res_name/*, arg_index, arg_array*/)
							{
								var res_obj = resources_obj[arg_res_name];
								
								// REGISTER MODULE RESOURCE
								app_config.application[arg_res_type][arg_res_name] = res_obj;
								loaded_configs[arg_res_type][arg_res_name] = res_obj;
							}
						);
					}
				);
			}
		);
	}
	
	// SAVE APP CONFIG
	// parser.write('./tmp/' + app_config_filename + '.out.ini', app_config);

	loaded_configs.files[app_config_path] = app_config;
	loaded_configs.apps[app_config.application.name] = app_config;
	
	// console.log(loaded_configs, 'loaded_configs');
	
	console.info('loading application configuration end');
	
	return Q(app_config.application);
}


// EXPORT CONFIG API
module.exports =
{
	"load_app_config": load_app_config,
	
	"get_app_config": function(arg_app_name) { return (arg_app_name in loaded_configs.apps) ? loaded_configs.apps[arg_app_name] : null; },
	
	"get_resource": function(arg_res_type, arg_res_name)
	{
		switch(arg_res_type)
		{
			case 'views':
			case 'view': return (arg_res_name in loaded_configs.views) ? loaded_configs.views[arg_res_name] : null;
			
			case 'models':
			case 'model': return (arg_res_name in loaded_configs.models) ? loaded_configs.models[arg_res_name] : null;
			
			case 'menubars':
			case 'menubar': return (arg_res_name in loaded_configs.menubars) ? loaded_configs.menubars[arg_res_name] : null;
			
			case 'menus':
			case 'menu': return (arg_res_name in loaded_configs.menus) ? loaded_configs.menus[arg_res_name] : null;
			
			case 'connexions':
			case 'connexion': return (arg_res_name in loaded_configs.connexions) ? loaded_configs.connexions[arg_res_name] : null;
		}
		
		return null;
	},
	
	"get_view":      function(arg_res_name)  { return this.get_resource('connexion', arg_res_name); },
	"get_model":     function(arg_res_name)  { return this.get_resource('model', arg_res_name); },
	"get_menubar":   function(arg_res_name)  { return this.get_resource('menubar', arg_res_name); },
	"get_menu":      function(arg_res_name)  { return this.get_resource('menu', arg_res_name); },
	"get_connexion": function(arg_res_name)  { return this.get_resource('connexion', arg_res_name); },
	
	"get_views":      function() { return loaded_configs.views; },
	"get_models":     function() { return loaded_configs.models; },
	"get_menubars":   function() { return loaded_configs.menubars; },
	"get_menus":      function() { return loaded_configs.menus; },
	"get_connexions": function() { return loaded_configs.connexions; }
}
