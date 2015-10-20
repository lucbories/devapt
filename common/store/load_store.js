
import path from 'path'
import fs from 'fs'
import assert from 'assert'
import T from 'typr'

import logs from '../../server/utils/logs'

import * as store_config_actions from './config/actions'
import store from './index'
import * as parser from '../../server/config/config_parser'



function load_app_config(arg_file_path_name, arg_base_dir, arg_force_reload)
{
	logs.info('app_config', 'loading application configuration from file [%s] of private dir [%s]', arg_file_path_name, arg_base_dir);
	
	var app_config_path = path.join(arg_base_dir, arg_file_path_name);
	
	
	if ( ( store.files.indexOf(app_config_path) >= 0 ) && !!! arg_force_reload)
	{
		return store.files.get(app_config_path);
	}
	
	
	// LOAD APPLICATION INI CONFIGURATION
	var app_config = parser.read(app_config_path, 'utf-8');
	logs.info('app_config', 'loading application configuration: file [%s]', app_config_path);
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
	
}



// LOAD APPS.JSON
let apps_config = require('../../apps/apps.json')

// CHECK APPS CONFIG
assert(T.isObject(apps_config), 'apps.json should be a plain object')
assert(T.isString(apps_config.host), 'apps.json:host should be a string')
assert(T.isString(apps_config.port), 'apps.json:port should be a string')
assert(T.isObject(apps_config.apps), 'apps.json:apps should be a plain object')
assert(T.isObject(apps_config.modules), 'apps.json:modules should be a plain object')
assert(T.isObject(apps_config.plugins), 'apps.json:plugins should be a plain object')
assert(T.isObject(apps_config.security), 'apps.json:security should be a plain object')

// LOAD APPLICATIONS
let applications = apps_config.apps
let modules = {};
applications.forEach(
	function(app)
	{
		// CHECK APPLICATION
		assert(T.isObject(app), 'apps.json:apps.app should be a plain object')
		assert(T.isString(app.from_file), 'apps.json:apps.app.from_file should be a string')
		assert(T.isArray(app.modules), 'apps.json:apps.app.modules should be an array')
		assert(T.isArray(app.plugins), 'apps.json:apps.app.plugins should be an array')
		
		// LOOP ON MODULES
		let modules = app.modules
		modules.forEach(
			function(module_name)
			{
				
			}
		)
	}
)

 forEach(function(element) {
	
}, this);