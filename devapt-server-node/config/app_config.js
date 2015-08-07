'use strict';

var parser = require('./ini_parser');


// DEFINE FILE NAME
var app_base_path = '../';
var app_config_filename = 'app_cfg.ini';
var app_config_path = app_base_path + 'devapt-tutorial-1/private/' + app_config_filename;


// LOAD app_cfg.ini
var app_config = parser.read(app_config_path, 'utf-8');
if ( ! ('application' in app_config) )
{
	throw Error('No application root key in configuration');
}
app_config.application['views'] = {};
app_config.application['models'] = {};
app_config.application['menubars'] = {};
app_config.application['menus'] = {};
app_config.application['connexions'] = {};
app_config['basedir'] = app_base_path + 'devapt-tutorial-1/';


// LOAD CONNEXIONS application.resources.connexions.*
if ('resources' in app_config.application)
{
	var resources = app_config.application.resources;
	if ((typeof resources) !== 'object')
	{
		var module_type = (typeof resources).toString();
		var msg = 'Bad type for application.resources [' + module_type + ']';
		throw Error(msg);
	}
}
if ('connexions' in app_config.application.resources)
{
	var connexions = app_config.application.resources.connexions;
	if ((typeof connexions) !== 'object')
	{
		var module_type = (typeof connexions).toString();
		var msg = 'Bad type for application.resources.connexions [' + module_type + ']';
		throw Error(msg);
	}
	
	var res_type = 'connexions';
	// var res_obj = null;
	var res_config = null
	var res_filename = null;
	
	Object.keys(connexions).forEach(
		function(arg_value, arg_index, arg_array)
		{
			res_filename = app_config['basedir'] + 'private/' + connexions[arg_value];
			res_config = parser.read(res_filename, 'utf-8');
			// console.log(res_config, res_filename);
			
			Object.keys(res_config).forEach(
				function(arg_res_name, arg_res_index, arg_res_array)
				{
					app_config.application[res_type][arg_res_name] = res_config[arg_res_name];
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
		var module_type = (typeof modules).toString();
		var msg = 'Bad type for application.modules [' + module_type + ']';
		throw Error(msg);
	}
	Object.keys(modules).forEach(
		function(arg_value, arg_index, arg_array)
		{
			var module_obj = modules[arg_value];
			var has_views = ('views' in module_obj);
			var has_models = ('models' in module_obj);
			var has_menubars = ('menubars' in module_obj);
			var has_menus = ('menus' in module_obj);
			if (! (has_views || has_models || has_menubars || has_menus) )
			{
				throw Error('Bad format for application.modules.[' + arg_value + ']');
			}
			
			// LOAD RESOURCES
			var res_type = null;
			var res_obj = null;
			var res_config = null
			var res_filename = null;
			
			// LOAD VIEWS RESOURCES
			if (has_views)
			{
				res_type = 'views';
				res_obj = module_obj[res_type];
				if ((typeof res_obj) !== 'object')
				{
					throw Error('Bad format for application.modules.[' + res_type + ']');
				}
				Object.keys(res_obj).forEach(
					function(arg_module_file_key, arg_module_file_index, arg_module_file_array)
					{
						res_filename = app_config['basedir'] + 'modules/' + res_obj[arg_module_file_key];
						res_config = parser.read(res_filename, 'utf-8');
						// console.log(res_config, res_filename);
						
						if ((typeof res_config.application[res_type]) !== 'object')
						{
							throw Error('Bad format for application.[' + res_type + '] for file [' + res_filename + '] for key [' + arg_module_file_key + ']');
						}
						
						var res_cfg = null;
						Object.keys(res_config.application[res_type]).forEach(
							function(arg_res_name, arg_res_index, arg_res_array)
							{
								res_cfg = res_config.application[res_type][arg_res_name];
								app_config.application[res_type][arg_res_name] = parser.split_all_keys(res_cfg);
							}
						);
					}
				);
			}
			
			// LOAD MODELS RESOURCES
			if (has_models)
			{
				res_type = 'models';
				res_obj = module_obj[res_type];
				if ((typeof res_obj) !== 'object')
				{
					throw Error('Bad format for application.modules.[' + res_type + ']');
				}
				Object.keys(res_obj).forEach(
					function(arg_module_file_key, arg_module_file_index, arg_module_file_array)
					{
						res_filename = app_config['basedir'] + 'modules/' + res_obj[arg_module_file_key];
						res_config = parser.read(res_filename, 'utf-8');
						// console.log(res_config, res_filename);
						
						if ((typeof res_config.application[res_type]) !== 'object')
						{
							throw Error('Bad format for application.[' + res_type + '] for file [' + res_filename + '] for key [' + arg_module_file_key + ']');
						}
						
						var res_cfg = null;
						Object.keys(res_config.application[res_type]).forEach(
							function(arg_res_name, arg_res_index, arg_res_array)
							{
								res_cfg = res_config.application[res_type][arg_res_name];
								app_config.application[res_type][arg_res_name] = parser.split_all_keys(res_cfg);
								// app_config.application[res_type][arg_res_name] = res_config.application[res_type][arg_res_name];
							}
						);
					}
				);
			}
			
			// LOAD MENUBARS RESOURCES
			if (has_menubars)
			{
				res_type = 'menubars';
				res_obj = module_obj[res_type];
				if ((typeof res_obj) !== 'object')
				{
					throw Error('Bad format for application.modules.[' + res_type + ']');
				}
				Object.keys(res_obj).forEach(
					function(arg_module_file_key, arg_module_file_index, arg_module_file_array)
					{
						res_filename = app_config['basedir'] + 'modules/' + res_obj[arg_module_file_key];
						res_config = parser.read(res_filename, 'utf-8');
						// console.log(res_config, res_filename);
						
						if ((typeof res_config.application[res_type]) !== 'object')
						{
							throw Error('Bad format for application.[' + res_type + '] for file [' + res_filename + '] for key [' + arg_module_file_key + ']');
						}
						
						var res_cfg = null;
						Object.keys(res_config.application[res_type]).forEach(
							function(arg_res_name, arg_res_index, arg_res_array)
							{
								res_cfg = res_config.application[res_type][arg_res_name];
								app_config.application[res_type][arg_res_name] = parser.split_all_keys(res_cfg);
								// app_config.application[res_type][arg_res_name] = res_config.application[res_type][arg_res_name];
							}
						);
					}
				);
			}
			
			// LOAD MENUS RESOURCES
			if (has_menus)
			{
				res_type = 'menus';
				res_obj = module_obj[res_type];
				if ((typeof res_obj) !== 'object')
				{
					throw Error('Bad format for application.modules.[' + res_type + ']');
				}
				Object.keys(res_obj).forEach(
					function(arg_module_file_key, arg_module_file_index, arg_module_file_array)
					{
						res_filename = app_config['basedir'] + 'modules/' + res_obj[arg_module_file_key];
						res_config = parser.read(res_filename, 'utf-8');
						// console.log(res_config, res_filename);
						
						if ((typeof res_config.application[res_type]) !== 'object')
						{
							throw Error('Bad format for application.[' + res_type + '] for file [' + res_filename + '] for key [' + arg_module_file_key + ']');
						}
						
						var res_cfg = null;
						Object.keys(res_config.application[res_type]).forEach(
							function(arg_res_name, arg_res_index, arg_res_array)
							{
								res_cfg = res_config.application[res_type][arg_res_name];
								app_config.application[res_type][arg_res_name] = parser.split_all_keys(res_cfg);
								// app_config.application[res_type][arg_res_name] = res_config.application[res_type][arg_res_name];
							}
						);
					}
				);
			}
		}
	);
}

// SAVE APP CONFIG
parser.write('./tmp/' + app_config_filename + '.out.ini', app_config);


// EXPORT APP CONFIG
module.exports = app_config;
