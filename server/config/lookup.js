'use strict';

var assert = require('assert'),
	logs = require('../utils/logs');


function lookup(arg_app_resources, arg_res_type, arg_res_name)
{
	logs.info('config/lookup', 'resource of type [' + (arg_res_type ? arg_res_type : 'unknow') + '] named [' + (arg_res_name ? arg_res_name : 'unknow') + ']');
	
	// CHECK ARGS
	assert.ok((typeof arg_app_resources) === 'object', 'arg_app_resources should be an object');
	assert.ok((typeof arg_res_name) === 'string', 'arg_res_name should be a string');
	assert.ok(arg_res_name.length > 0, 'arg_res_name should be a non empty string');
	assert.ok((typeof arg_res_name) === 'string', 'arg_res_name should be a string');
	
	// GET RESOURCE CONTAINERS
	var resource_containers = [];
	assert.ok( (typeof arg_res_type) !== 'string', 'resource type is not a string value');
	switch(arg_res_type)
	{
		case 'view':
		case 'views':
			resource_containers = [arg_app_resources.views];
			break;
		case 'model':
		case 'models':
			resource_containers = [arg_app_resources.models];
			break;
		case 'menubar':
		case 'menubars':
			resource_containers = [arg_app_resources.menubars];
			break;
		case 'menu':
		case 'menus':
			resource_containers = [arg_app_resources.menus];
			break;
		case 'connexion':
		case 'connexions':
			resource_containers = [arg_app_resources.connexions];
			break;
		default:
			resource_containers = [arg_app_resources.views, arg_app_resources.models, arg_app_resources.menubars, arg_app_resources.menus, arg_app_resources.connexions];
			break;
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
	
	// GET AND CHECK RESOURCE OBJECT
	var resource_obj = container_obj[arg_res_name];
	assert.ok( (typeof resource_obj) === 'object', 'resource object is not an object');
	
	return resource_obj;
}


module.exports = lookup;