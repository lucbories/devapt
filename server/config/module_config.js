'use strict';

var parser = require('./config_parser'),
	Q = require('q'),
	path = require('path'),
	assert = require('assert'),
	logs = require('../utils/logs'),
	resource_config = require('./resource_config');


/*
	application.modules.AAA.models[]=file path name
	or
	application.modules.AAA.models.BBB.class_type=view
	application.modules.AAA.models.BBB.class_name=HBox
	
	application....
		modules.AAA.
			views[]: file path name
			models[]: file path name
			menubars[]: file path name
			menus[]: file path name
			connexions[]: file path name
*/



var API = {};


API.load_module = function(arg_module_name, arg_module_obj, arg_base_dir)
{
	logs.info('module_config', 'loading module [%s] configuration from [%s]', arg_module_name, arg_base_dir);
	
	
	var has_views = ('views' in arg_module_obj);
	var has_models = ('models' in arg_module_obj);
	var has_menubars = ('menubars' in arg_module_obj);
	var has_menus = ('menus' in arg_module_obj);
	
	if (! (has_views || has_models || has_menubars || has_menus) )
	{
		throw Error('Bad format for application.modules.[' + arg_module_name + ']');
	}
	
	
	// LOAD RESOURCES
	var res_type = null;
	var res_typeof = null;
	var res_obj = null;
	var resources_obj = null;
	var loaded_resources = [];
	
	
	// LOAD VIEWS RESOURCES
	if (has_views)
	{
		res_type = 'views';
		logs.info('module_config', 'loading module [%s] configuration of [%s] resources', arg_module_name, res_type);
		
		resources_obj = arg_module_obj[res_type];
		res_typeof = typeof resources_obj;
		
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		
		Object.keys(resources_obj).forEach(
			function(arg_resource_key, arg_module_file_index, arg_module_file_array)
			{
				logs.info('module_config', 'loading module [%s] configuration of [%s] resources: for [%s]', arg_module_name, res_type, arg_resource_key);
				
				res_obj = resources_obj[arg_resource_key];
				
				loaded_resources.push( resource_config.load_resources(arg_resource_key, res_obj, arg_base_dir) );
			}
		);
	}
	
	
	// LOAD MODELS RESOURCES
	if (has_models)
	{
		res_type = 'models';
		logs.info('module_config', 'loading module [%s] configuration of [%s] resources', arg_module_name, res_type);
		
		resources_obj = arg_module_obj[res_type];
		res_typeof = typeof resources_obj;
		
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		
		Object.keys(resources_obj).forEach(
			function(arg_resource_key, arg_module_file_index, arg_module_file_array)
			{
				logs.info('module_config', 'loading module [%s] configuration of [%s] resources: for [%s]', arg_module_name, res_type, arg_resource_key);
				
				res_obj = resources_obj[arg_resource_key];
				
				loaded_resources.push( resource_config.load_resources(arg_resource_key, res_obj, arg_base_dir) );
			}
		);
	}
	
	
	// LOAD MENUBARS RESOURCES
	if (has_menubars)
	{
		res_type = 'menubars';
		logs.info('module_config', 'loading module [%s] configuration of [%s] resources', arg_module_name, res_type);
		
		resources_obj = arg_module_obj[res_type];
		res_typeof = typeof resources_obj;
		
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		
		Object.keys(resources_obj).forEach(
			function(arg_resource_key, arg_module_file_index, arg_module_file_array)
			{
				logs.info('module_config', 'loading module [%s] configuration of [%s] resources: for [%s]', arg_module_name, res_type, arg_resource_key);
				
				res_obj = resources_obj[arg_resource_key];
				
				loaded_resources.push( resource_config.load_resources(arg_resource_key, res_obj, arg_base_dir) );
			}
		);
	}
	
	
	// LOAD MENUS RESOURCES
	if (has_menus)
	{
		res_type = 'menus';
		logs.info('module_config', 'loading module [%s] configuration of [%s] resources', arg_module_name, res_type);
		
		resources_obj = arg_module_obj[res_type];
		res_typeof = typeof resources_obj;
		
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		
		Object.keys(resources_obj).forEach(
			function(arg_resource_key, arg_module_file_index, arg_module_file_array)
			{
				logs.info('module_config', 'loading module [%s] configuration of [%s] resources: for [%s]', arg_module_name, res_type, arg_resource_key);
				
				res_obj = resources_obj[arg_resource_key];
				
				loaded_resources.push( resource_config.load_resources(arg_resource_key, res_obj, arg_base_dir) );
			}
		);
	}
	
	
	// UPDATE OUTPUT
	var out_cfg = {};
	loaded_resources.forEach(
		function(arg_load_value, arg_load_index, arg_load_array)
		{
			var loaded_cfg = loaded_resources[arg_load_index];
			
			Object.keys(loaded_cfg).forEach(
				function(arg_set_name/*, arg_set_index, arg_set_array*/)
				{
					var set_resources = loaded_cfg[arg_set_name];
					
					Object.keys(set_resources).forEach(
						function(arg_res_name/*, arg_res_index, arg_res_array*/)
						{
							var res_cfg = set_resources[arg_res_name];
							
							if (! out_cfg[arg_set_name] )
							{
								out_cfg[arg_set_name] = {};
							}
							
							out_cfg[arg_set_name][arg_res_name] = parser.split_all_keys(res_cfg);
							out_cfg[arg_set_name][arg_res_name].name = arg_res_name;
						}
					);
				}
			);
		}
	);
	
	
	return out_cfg;
}


module.exports = API;
