'use strict';

var parser = require('./ini_parser'),
	// Q = require('q'),
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

var resources_to_clone = [];


API.update_resource = function(arg_resource_before_obj, arg_resource_after_obj)
{
	console.info('update resource [%s] of type [%s]', arg_resource_before_obj.name, arg_resource_before_obj.resources_set);
	
	
}


API.clone_resource = function(arg_resource_obj, arg_app_cfg)
{
	console.info('cloning resource [%s] of type [%s]', arg_resource_obj.name, arg_resource_obj.resources_set);
	
	var target_obj = arg_app_cfg.application[arg_resource_obj.resources_set][arg_resource_obj.name]; // TODO CHECK EXISTS ?
	console.log(target_obj, 'target_obj');
	
	var src_name = target_obj.clone;
	var src_obj = arg_app_cfg.application[arg_resource_obj.resources_set][src_name]; // TODO CHECK EXISTS ?
	console.log(src_obj, 'src_obj');
	
	// COPY ATTRIBUTES
	Object.keys(src_obj).forEach(
		function(arg_value, arg_index, arg_array)
		{
			if (arg_value === 'name')			return;
			if (arg_value === 'resource_set')	return;
			
			if (arg_value === 'items')
			{
				return;// TODO
			}
			
			target_obj[arg_value] = src_obj[arg_value];
		}
	);
}


API.update_cloned_resources = function(arg_app_cfg)
{
	console.info('update cloned resources');
	
	// UPDATE CLONED RESOURCES
	if(resources_to_clone.length > 0)
	{
		resources_to_clone.forEach(
			function(arg_res_value, arg_res_index, arg_res_array)
			{
				API.clone_resource(arg_res_value, arg_app_cfg);
			}
		);
		
		resources_to_clone = [];
	}
}


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
		out_cfg[set_name][arg_resource_key].resources_set = set_name;
		
		// console.log(out_cfg, 'API.load_resources out_cfg');
		
		// CLONE AN EXISTING RESOURCE
		if ( arg_resource_obj.clone && (typeof arg_resource_obj.clone) === 'string')
		{
			resources_to_clone.push( out_cfg[set_name][arg_resource_key] );
		}
		
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
	// console.log(arg_resource_obj, 'arg_resource_obj');
	
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
					out_cfg[arg_set_name][arg_res_name].resources_set = arg_set_name;
					
					// CLONE AN EXISTING RESOURCE
					if ( res_cfg.clone && (typeof res_cfg.clone) === 'string')
					{
						resources_to_clone.push( out_cfg[arg_set_name][arg_res_name] );
					}
				}
			);
		}
	);
	
	// console.log(out_cfg, 'API.load_resources out_cfg');
	
	return out_cfg;
}


module.exports = API;
