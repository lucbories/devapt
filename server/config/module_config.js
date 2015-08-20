'use strict';

var parser = require('./ini_parser'),
	Q = require('q'),
	path = require('path'),
	assert = require('assert');


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



API.load_resources = function(arg_resource_key, arg_resource_obj, arg_base_dir)
{
	console.info('loading resource configuration at [%s]', arg_resource_key);
	
	
	var out_cfg = {};
	
	// CASE: application.modules.AAA.models.BBB.class_name=...
	// with arg_resource_obj = {class_name=...}
	//      arg_resource_key = BBB
	if ((typeof arg_resource_obj) === 'object')
	{
		console.info('loading resource configuration object at [%s]', arg_resource_key);
		
		var set_name = arg_resource_obj.class_type ? arg_resource_obj.class_type : 'unknow resources set';
		
		out_cfg[set_name][arg_resource_key] = parser.split_all_keys(arg_resource_obj);
		out_cfg[set_name][arg_resource_key].name = arg_resource_key;
		
		// console.log(out_cfg, 'API.load_resources out_cfg');
		
		return out_cfg;
	}
	
	
	// CASE: application.modules.AAA.models[]=file path name
	// with arg_resource_obj = file path name
	if ((typeof arg_resource_obj) !== 'string')
	{
		throw Error('Bad format for resource object at [' + arg_resource_key + ']');
	}
	
	console.info('loading resource configuration file [%s]', arg_resource_obj);
	
	
	// LOAD FILE
	var res_filename = path.join(arg_base_dir, arg_resource_obj);
	arg_resource_obj = parser.read(res_filename, 'utf-8');
	
	
	// LOOP ON MODULE RESOURCES
	// CASE: arg_resource_obj = application.views/models/menubars/menus...
	assert.ok( (typeof arg_resource_obj.application) === 'object', 'loaded resources should begin with application.SSS.RRR');
	Object.keys(arg_resource_obj.application).forEach(
		function(arg_set_name/*, arg_set_index, arg_set_array*/)
		{
			console.info('loading resource configuration for set [%s]', arg_set_name);
			var set_resources = arg_resource_obj.application[arg_set_name];
			
			Object.keys(set_resources).forEach(
				function(arg_res_name/*, arg_res_index, arg_res_array*/)
				{
					console.info('loading resource configuration for resource [%s]', arg_res_name);
					
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
	
	// console.log(out_cfg, 'API.load_resources out_cfg');
	
	return out_cfg;
}


API.load_module = function(arg_module_name, arg_module_obj, arg_base_dir)
{
	var out_cfg = {};
	
	
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
		console.info('loading module [%s] configuration of [%s] resources', arg_module_name, res_type);
		
		resources_obj = arg_module_obj[res_type];
		res_typeof = typeof resources_obj;
		
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		
		Object.keys(resources_obj).forEach(
			function(arg_resource_key, arg_module_file_index, arg_module_file_array)
			{
				console.info('loading module [%s] configuration of [%s] resources: for [%s]', arg_module_name, res_type, arg_resource_key);
				
				res_obj = resources_obj[arg_resource_key];
				
				loaded_resources.push( API.load_resources(arg_resource_key, res_obj, arg_base_dir) );
			}
		);
	}
	
	
	// LOAD MODELS RESOURCES
	if (has_models)
	{
		res_type = 'models';
		console.info('loading module [%s] configuration of [%s] resources', arg_module_name, res_type);
		
		resources_obj = arg_module_obj[res_type];
		res_typeof = typeof resources_obj;
		
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		
		Object.keys(resources_obj).forEach(
			function(arg_resource_key, arg_module_file_index, arg_module_file_array)
			{
				console.info('loading module [%s] configuration of [%s] resources: for [%s]', arg_module_name, res_type, arg_resource_key);
				
				res_obj = resources_obj[arg_resource_key];
				
				loaded_resources.push( API.load_resources(arg_resource_key, res_obj, arg_base_dir) );
			}
		);
	}
	
	
	// LOAD MENUBARS RESOURCES
	if (has_menubars)
	{
		res_type = 'menubars';
		console.info('loading module [%s] configuration of [%s] resources', arg_module_name, res_type);
		
		resources_obj = arg_module_obj[res_type];
		res_typeof = typeof resources_obj;
		
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		
		Object.keys(resources_obj).forEach(
			function(arg_resource_key, arg_module_file_index, arg_module_file_array)
			{
				console.info('loading module [%s] configuration of [%s] resources: for [%s]', arg_module_name, res_type, arg_resource_key);
				
				res_obj = resources_obj[arg_resource_key];
				
				loaded_resources.push( API.load_resources(arg_resource_key, res_obj, arg_base_dir) );
			}
		);
	}
	
	
	// LOAD MENUS RESOURCES
	if (has_menus)
	{
		res_type = 'menus';
		console.info('loading module [%s] configuration of [%s] resources', arg_module_name, res_type);
		
		resources_obj = arg_module_obj[res_type];
		res_typeof = typeof resources_obj;
		
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		
		Object.keys(resources_obj).forEach(
			function(arg_resource_key, arg_module_file_index, arg_module_file_array)
			{
				console.info('loading module [%s] configuration of [%s] resources: for [%s]', arg_module_name, res_type, arg_resource_key);
				
				res_obj = resources_obj[arg_resource_key];
				
				loaded_resources.push( API.load_resources(arg_resource_key, res_obj, arg_base_dir) );
			}
		);
	}
	
	
	// UPDATE OUTPUT
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
	/*
	// LOAD MODELS RESOURCES
	if (has_models)
	{
		res_type = 'models';
		res_obj = arg_module_obj[res_type];
		res_typeof = typeof res_obj;
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		Object.keys(res_obj).forEach(
			function(arg_module_file_key, arg_module_file_index, arg_module_file_array)
			{
				res_filename = path.join(arg_base_dir, res_obj[arg_module_file_key]);
				res_config = parser.read(res_filename, 'utf-8');
				console.info('loading module [%s] configuration of [%s] resources: file [%s]', arg_module_file_key, res_type, res_filename);
				
				if ((typeof res_config.application[res_type]) !== 'object')
				{
					throw Error('Bad format for application.[' + res_type + '] for file [' + res_filename + '] for key [' + arg_module_file_key + ']');
				}
				
				var res_cfg = null;
				Object.keys(res_config.application[res_type]).forEach(
					function(arg_res_name, arg_res_index, arg_res_array)
					{
						res_cfg = res_config.application[res_type][arg_res_name];
						
						if (! out_cfg[res_type] )
						{
							out_cfg[res_type] = {};
						}
						
						out_cfg[res_type][arg_res_name] = parser.split_all_keys(res_cfg);
						out_cfg[res_type][arg_res_name].name = arg_res_name;
					}
				);
			}
		);
	}
	
	// LOAD MENUBARS RESOURCES
	if (has_menubars)
	{
		res_type = 'menubars';
		res_obj = arg_module_obj[res_type];
		res_typeof = typeof res_obj;
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		Object.keys(res_obj).forEach(
			function(arg_module_file_key, arg_module_file_index, arg_module_file_array)
			{
				res_filename = path.join(arg_base_dir, res_obj[arg_module_file_key]);
				res_config = parser.read(res_filename, 'utf-8');
				console.info('loading module [%s] configuration of [%s] resources: file [%s]', arg_module_file_key, res_type, res_filename);
				
				if ((typeof res_config.application[res_type]) !== 'object')
				{
					throw Error('Bad format for application.[' + res_type + '] for file [' + res_filename + '] for key [' + arg_module_file_key + ']');
				}
				
				var res_cfg = null;
				Object.keys(res_config.application[res_type]).forEach(
					function(arg_res_name, arg_res_index, arg_res_array)
					{
						res_cfg = res_config.application[res_type][arg_res_name];
						
						if (! out_cfg[res_type] )
						{
							out_cfg[res_type] = {};
						}
						
						out_cfg[res_type][arg_res_name] = parser.split_all_keys(res_cfg);
						out_cfg[res_type][arg_res_name].name = arg_res_name;
					}
				);
			}
		);
	}
	
	// LOAD MENUS RESOURCES
	if (has_menus)
	{
		res_type = 'menus';
		res_obj = arg_module_obj[res_type];
		res_typeof = typeof res_obj;
		if (res_typeof !== 'object')
		{
			throw Error('Bad format for application.modules.[' + res_type + ']');
		}
		Object.keys(res_obj).forEach(
			function(arg_module_file_key, arg_module_file_index, arg_module_file_array)
			{
				res_filename = path.join(arg_base_dir, res_obj[arg_module_file_key]);
				res_config = parser.read(res_filename, 'utf-8');
				console.info('loading module [%s] configuration of [%s] resources: file [%s]', arg_module_file_key, res_type, res_filename);
				
				if ((typeof res_config.application[res_type]) !== 'object')
				{
					throw Error('Bad format for application.[' + res_type + '] for file [' + res_filename + '] for key [' + arg_module_file_key + ']');
				}
				
				var res_cfg = null;
				Object.keys(res_config.application[res_type]).forEach(
					function(arg_res_name, arg_res_index, arg_res_array)
					{
						res_cfg = res_config.application[res_type][arg_res_name];
						
						if (! out_cfg[res_type] )
						{
							out_cfg[res_type] = {};
						}
						
						out_cfg[res_type][arg_res_name] = parser.split_all_keys(res_cfg);
						out_cfg[res_type][arg_res_name].name = arg_res_name;
					}
				);
			}
		);
	}
	
	return out_cfg;*/
}


module.exports = API;
