
import assert from 'assert'
import T from 'typr'
import path from 'path'

import parser from '../../../parser/parser'
import logs from '../../../utils/logs'



let context = 'common/store/config/loaders/load_config_apps_app'
let error_msg_bad_config = context + ':bad config - config.applications.* should be a plain object'
let error_msg_bad_from_file = context + ':bad config - config.applications.*.from_file should be a string'
let error_msg_bad_license = context + ':bad config - config.applications.*.license should be a string'
let error_msg_bad_url = context + ':bad config - config.applications.*.url should be a string'
let error_msg_bad_file_config = context + ':bad config - config.applications.*.from_file content should be an object'

let error_msg_bad_modules = context + ':bad config - config.applications.*.modules should be an array'
let error_msg_bad_plugins = context + ':bad config - config.applications.*.plugins should be an array'
let error_msg_bad_resources = context + ':bad config - config.applications.*.resources should be an array'
let error_msg_bad_services = context + ':bad config - config.applications.*.services should be an object'

let error_msg_bad_module_name = context + ':bad config - config.applications.*.modules.* should be a string'
let error_msg_bad_plugin_name = context + ':bad config - config.applications.*.plugins.* should be a string'
let error_msg_bad_resource_name = context + ':bad config - config.applications.*.resources.* should be a string'

let error_msg_bad_assets = context + ':bad config - config.applications.*.assets should be a plain object'
let error_msg_bad_assets_css = context + ':bad config - config.applications.*.assets.css should be an array'
let error_msg_bad_assets_js = context + ':bad config - config.applications.*.assets.js should be an array'
let error_msg_bad_assets_img = context + ':bad config - config.applications.*.assets.img should be an array'
let error_msg_bad_assets_index = context + ':bad config - config.applications.*.assets.index should be a string'
let error_msg_bad_asset = context + ':bad config - config.applications.*.assets.[css,js,imd].* should be a string'

let error_msg_plugin_not_found = context + ':bad config - config.applications.*.plugins.* not found in config.plugins'
let error_msg_module_not_found = context + ':bad config - config.applications.*.modules.* not found in config.modules'
let error_msg_resource_not_found = context + ':bad config - config.applications.*.resources.* not found in config.resources'



/**
 * Load the 'config.applications.*' keys of the final state
 * Pure function: (Plain Object) => (mutated Plain Object)
 */
function load_config_apps_app(arg_app_config, arg_config_modules, arg_config_plugins, arg_config_resources, arg_base_dir)
{
	logs.info(context, 'loading config.applications.[app]')
	
	
	try{
		// CHECK APPLICATION
		assert(T.isObject(arg_app_config), error_msg_bad_config)
		assert(T.isString(arg_app_config.url), error_msg_bad_url)
		assert(T.isString(arg_app_config.license), error_msg_bad_license)
		
		assert(T.isObject(arg_app_config.services), error_msg_bad_services)
		assert(T.isArray(arg_app_config.resources), error_msg_bad_resources)
		assert(T.isArray(arg_app_config.modules), error_msg_bad_modules)
		assert(T.isArray(arg_app_config.plugins), error_msg_bad_plugins)
		
		assert(T.isObject(arg_app_config.assets), error_msg_bad_assets)
		assert(T.isArray(arg_app_config.assets.css), error_msg_bad_assets_css)
		assert(T.isArray(arg_app_config.assets.js), error_msg_bad_assets_js)
		assert(T.isArray(arg_app_config.assets.img), error_msg_bad_assets_img)
		assert(T.isString(arg_app_config.assets.index), error_msg_bad_assets_index)
		
		
		// LOAD FILE
		if (arg_app_config.from_file)
		{
			logs.info(context, 'loading config.applications.[app].from_file')
			assert(T.isString(arg_app_config.from_file), error_msg_bad_from_file)
			
			let file_path_name = path.join(arg_base_dir, 'apps', arg_app_config.from_file)
			
			let app_file_config = parser.read(file_path_name, 'utf8')
			// console.log(config, 'config')
			assert(T.isObject(app_file_config), error_msg_bad_file_config)
			
			Object.assign(arg_app_config, app_file_config)
		}
		
		
		// LOOP ON RESOURCES
		arg_app_config.resources.forEach(
			function(resource_name)
			{
				assert(T.isString(resource_name), error_msg_bad_resource_name)
				assert(resource_name in arg_config_resources, error_msg_resource_not_found)
			}
		)
		
		// LOOP ON MODULES
		arg_app_config.modules.forEach(
			function(module_name)
			{
				assert(T.isString(module_name), error_msg_bad_module_name)
				assert(module_name in arg_config_modules, error_msg_module_not_found)
			}
		)
		
		// LOOP ON PLUGINS
		arg_app_config.plugins.forEach(
			function(plugin_name)
			{
				assert(T.isString(plugin_name), error_msg_bad_plugin_name)
				assert(plugin_name in arg_config_plugins, error_msg_plugin_not_found)
			}
		)
		
		// LOOP ON ASSETS CSS
		arg_app_config.assets.css.forEach(
			function(asset)
			{
				assert(T.isString(asset), error_msg_bad_asset)
			}
		)
		
		// LOOP ON ASSETS JS
		arg_app_config.assets.js.forEach(
			function(asset)
			{
				assert(T.isString(asset), error_msg_bad_asset)
			}
		)
		
		// LOOP ON ASSETS IMG
		arg_app_config.assets.img.forEach(
			function(asset)
			{
				assert(T.isString(asset), error_msg_bad_asset)
			}
		)
	}
	catch(e)
	{
		arg_app_config.applications = { error: { context:context, exception:e } }
	}
	
	return arg_app_config
}

export default load_config_apps_app
