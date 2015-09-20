'use strict';

/*
	API
		API.clone_resource(arg_resource_obj, arg_app_cfg): nothing
		
		
		API.update_cloned_resources(arg_app_cfg): nothing
		
		
		API.reload_resource(arg_resource_before_obj, arg_resource_after_obj): nothing
			load again an existing resource and update it
		
		API.load_resource = function(arg_resource_obj): nothing
			load or reload (call API.reload_resource) a resource
		
		API.load_resources(arg_resource_key, arg_resource_obj, arg_base_dir): nothing
*/

var parser = require('./config_parser'),
	// Q = require('q'),
	path = require('path'),
	assert = require('assert'),
	logs = require('../utils/logs');


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


API.clone_resource = function(arg_resource_obj, arg_app_cfg)
{
	logs.info('resource_config', 'cloning resource [%s] of type [%s]', arg_resource_obj.name, arg_resource_obj.class_type);
	
	var target_obj = arg_app_cfg.application[arg_resource_obj.class_type][arg_resource_obj.name]; // TODO CHECK EXISTS ?
	console.log(target_obj, 'target_obj');
	
	var src_name = target_obj.clone;
	var src_obj = arg_app_cfg.application[arg_resource_obj.class_type][src_name]; // TODO CHECK EXISTS ?
	console.log(src_obj, 'src_obj');
	
	target_obj.res_clone_of = src_obj.name;
	if (! src_obj.res_clones)
	{
		src_obj.res_clones = [];
	}
	src_obj.res_clones.push(target_obj.name);
	
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
	logs.info('resource_config', 'update cloned resources');
	
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


API.reload_resource = function(arg_resource_before_obj, arg_resource_after_obj, arg_set_name, arg_res_name)
{
	logs.info('resource_config', 'reload resource [%s] of type [%s]', arg_res_name, arg_set_name);
	
	
}


API.load_resource = function(arg_resource_obj, arg_set_name, arg_res_name)
{
	logs.info('resource_config', 'load resource [%s] of type [%s]', arg_res_name, arg_set_name);
	
	var out_cfg = parser.split_all_keys(arg_resource_obj);
	out_cfg.name = arg_res_name;
	out_cfg.class_type = arg_set_name;
	
	// CLONE AN EXISTING RESOURCE
	if ( arg_resource_obj.clone && (typeof arg_resource_obj.clone) === 'string')
	{
		resources_to_clone.push(out_cfg);
	}
	
	return out_cfg;
}



/**
 * @public
 * @memberof				Server.resource_config.API
 * @desc					Load a resource configuration object directly or with a resources file and returns a resource plain object
 * @param {string}			arg_resource_key	Resource key (resource name or file key)
 * @param {object|string}	arg_resource_obj	Resource plain object of file name
 * @param {string}			arg_base_dir		Configuration files base directory
 * @return {object}			A plain object of a configuration tree
 */
API.load_resources = function(arg_resource_key, arg_resource_obj, arg_base_dir)
{
	logs.info('resource_config', 'loading resource configuration at [%s]', arg_resource_key);
	
	
	// CASE: application.modules.AAA.models.BBB.class_name=...
	// with arg_resource_obj = {class_name=...}
	//      arg_resource_key = BBB
	if ((typeof arg_resource_obj) === 'object')
	{
		logs.info('resource_config', 'loading resource configuration object at [%s]', arg_resource_key);
		
		var set_name = arg_resource_obj.class_type ? arg_resource_obj.class_type : 'unknow resources set';
		
		return API.load_resource(arg_resource_obj, set_name, arg_resource_key);
	}
	
	
	// CASE: application.modules.AAA.models[]=file path name
	// with arg_resource_obj = file path name
	if ((typeof arg_resource_obj) !== 'string')
	{
		throw Error('Bad format for resource object at [' + arg_resource_key + ']');
	}
	
	
	// LOAD FILE
	logs.info('resource_config', 'loading resource configuration file [%s]', arg_resource_obj);
	var res_filename = path.join(arg_base_dir, arg_resource_obj);
	arg_resource_obj = parser.read(res_filename, 'utf-8');
	// console.log(arg_resource_obj, 'arg_resource_obj');
	
	
	// LOOP ON MODULE RESOURCES
	// CASE: arg_resource_obj = application.views/models/menubars/menus...
	assert.ok( (typeof arg_resource_obj.application) === 'object', 'loaded resources should begin with application.SSS.RRR');
	
	var out_cfg = {};
	
	Object.keys(arg_resource_obj.application).forEach(
		function(arg_set_name/*, arg_set_index, arg_set_array*/)
		{
			logs.info('resource_config', 'loading resource configuration for set [%s]', arg_set_name);
			
			var set_resources = arg_resource_obj.application[arg_set_name];
			
			Object.keys(set_resources).forEach(
				function(arg_res_name/*, arg_res_index, arg_res_array*/)
				{
					// logs.info('resource_config', 'loading resource configuration for resource [%s]', arg_res_name);
					
					var res_cfg = set_resources[arg_res_name];
					
					if ( ! out_cfg[arg_set_name] )
					{
						out_cfg[arg_set_name] = {};
					}
					
					if ( out_cfg[arg_set_name][arg_res_name] )
					{
						out_cfg[arg_set_name][arg_res_name] = API.reload_resource(out_cfg[arg_set_name][arg_res_name], res_cfg, arg_set_name, arg_res_name);
					}
					else
					{
						out_cfg[arg_set_name][arg_res_name] = API.load_resource(res_cfg, arg_set_name, arg_res_name);
					}
				}
			);
		}
	);
	
	// console.log(out_cfg, 'API.load_resources out_cfg');
	
	return out_cfg;
}


module.exports = API;
