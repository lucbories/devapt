
import assert from 'assert'
import T from 'typr'

import logs from '../utils/logs'


let context = 'common/loaders/load_config_apps_app'
let error_msg_bad_config = context + ':bad config - config.apps.* should be a plain object'
let error_msg_bad_from_file = context + ':bad config - config.apps.*.from_file should be a string'
let error_msg_bad_license = context + ':bad config - config.apps.*.license should be a string'
let error_msg_bad_modules = context + ':bad config - config.apps.*.modules should be an array'
let error_msg_bad_plugins = context + ':bad config - config.apps.*.plugins should be an array'
let error_msg_bad_module_name = context + ':bad config - config.apps.*.modules.* should be a string'
let error_msg_bad_plugin_name = context + ':bad config - config.apps.*.plugins.* should be a string'
let error_msg_bad_assets = context + ':bad config - config.apps.*.assets should be a plain object'
let error_msg_bad_assets_css = context + ':bad config - config.apps.*.assets.css should be an array'
let error_msg_bad_assets_js = context + ':bad config - config.apps.*.assets.js should be an array'
let error_msg_bad_assets_img = context + ':bad config - config.apps.*.assets.img should be an array'
let error_msg_bad_assets_index = context + ':bad config - config.apps.*.assets.index should be a string'
let error_msg_bad_asset = context + ':bad config - config.apps.*.assets.[css,js,imd].* should be a string'
let error_msg_plugin_not_found = context + ':bad config - config.apps.*.plugins.* not found in config.plugins'
let error_msg_module_not_found = context + ':bad config - config.apps.*.modules.* not found in config.modules'



/**
 * Load the 'config.apps.*' keys of the final state
 * Pure function: (Plain Object) => (mutated Plain Object)
 */
function load_config_apps_app(arg_app_config, arg_config_modules, arg_config_plugins)
{
	logs.info(context, 'loading config.apps.[app]')
	
	
	try{
		// CHECK APPLICATION
		assert(T.isObject(arg_app_config), error_msg_bad_config)
		assert(T.isString(arg_app_config.from_file), error_msg_bad_from_file)
		assert(T.isString(arg_app_config.license), error_msg_bad_license)
		assert(T.isArray(arg_app_config.modules), error_msg_bad_modules)
		assert(T.isArray(arg_app_config.plugins), error_msg_bad_plugins)
		assert(T.isObject(arg_app_config.assets), error_msg_bad_assets)
		assert(T.isArray(arg_app_config.assets.css), error_msg_bad_assets_css)
		assert(T.isArray(arg_app_config.assets.js), error_msg_bad_assets_js)
		assert(T.isArray(arg_app_config.assets.img), error_msg_bad_assets_img)
		assert(T.isString(arg_app_config.assets.index), error_msg_bad_assets_index)
		
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
			arg_app_config.apps = { error: e }
	}
	
	return arg_app_config
}

export default load_config_apps_app
