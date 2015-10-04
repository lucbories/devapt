'use strict';

var assert = require('assert'),
	logs = require('../utils/logs');


function replace(arg_app_resources, arg_res_type, arg_res_name, arg_old_value, arg_new_value)
{
	logs.info('config/replace', 'resource of type [' + (arg_res_type ? arg_res_type : 'unknow') + '] named [' + (arg_res_name ? arg_res_name : 'unknow') + ']');
	logs.debug('config/replace', 'resource old value [' + (arg_old_value ? arg_old_value : 'unknow') + '] new value [' + (arg_new_value ? arg_new_value :'unknow') + ']');
	
	// CHECK ARGS
	assert.ok((typeof arg_app_resources) === 'object', 'arg_app_resources should be an object');
	assert.ok((typeof arg_res_name) === 'string', 'arg_res_name should be a string');
	assert.ok(arg_res_name.length > 0, 'arg_res_name should be a non empty string');
	assert.ok((typeof arg_res_name) === 'string', 'arg_res_name should be a string');
	assert.ok(arg_old_value !== undefined, 'arg_old_value should not be undefined');
	assert.ok(arg_old_value !== null, 'arg_old_value should not be null');
	assert.ok(arg_new_value !== undefined, 'arg_new_value should not be undefined');
	assert.ok(arg_new_value !== null, 'arg_new_value should not be null');
	
	// GET RESOURCE CONTAINERS
	var resource_containers = [];
	if ( (typeof arg_res_type) === 'string' )
	{
		switch(arg_res_type)
		{
			case 'views':
				resource_containers = [arg_app_resources.views];
				break;
			case 'models':
				resource_containers = [arg_app_resources.models];
				break;
			case 'menubars':
				resource_containers = [arg_app_resources.menubars];
				break;
			case 'menus':
				resource_containers = [arg_app_resources.menus];
				break;
			case 'connexions':
				resource_containers = [arg_app_resources.connexions];
				break;
			default:
				resource_containers = [arg_app_resources.views, arg_app_resources.models, arg_app_resources.menubars, arg_app_resources.menus, arg_app_resources.connexions];
				break;
		}
	}
	assert.ok(resource_containers.length > 0, 'resource containers is not empty');
	
	// GET AND CHECK RESOURCE CONTAINER
	var container_obj = null;
	resource_containers.some(
		function(arg_container_obj, arg_index, arg_array)
		{
			if (arg_res_name in arg_container_obj)
			{
				container_obj = arg_container_obj;
				return true;
			}
		}
	);
	assert.ok( (typeof container_obj) === 'object', 'resource container is not an object');
	
	// GET AND CHECK RESOURCE VALUE
	var resource_value = container_obj[arg_res_name];
	assert.ok( (typeof resource_value) !== 'undefined', 'resource object is not an object');
	if ( (typeof resource_value) !== (typeof arg_old_value) )
	{
		logs.error('config/replace', 'resource bad old value type [' + (typeof resource_value) + '] given [' + (typeof arg_old_value) + ']');
		return false;
	}
	
	// REPLACE VALUE
	container_obj[arg_res_name] = arg_new_value;
	
	return true;
}


module.exports = replace;