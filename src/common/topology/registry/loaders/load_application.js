// NPM IMPORTS
import assert from 'assert'
import T from 'typr'
import path from 'path'

// COMMON IMPORTS
import parser from '../../../utils/parser/parser'


const context = 'common/topology/registry/loaders/load_application'



let error_msg_bad_config = context + ':bad config - config.applications.* should be a plain object'
let error_msg_bad_from_file = context + ':bad config - config.applications.*.from_file should be a string'
let error_msg_bad_license = context + ':bad config - config.applications.*.license should be a string'
let error_msg_bad_url = context + ':bad config - config.applications.*.url should be a string'
let error_msg_bad_file_config = context + ':bad config - config.applications.*.from_file content should be an object'

let error_msg_bad_used_packages = context + ':bad config - config.applications.*.used_packages should be an array'
let error_msg_bad_used_plugins = context + ':bad config - config.applications.*.used_plugins should be an array'
let error_msg_bad_used_services = context + ':bad config - config.applications.*.used_services should be an array'
let error_msg_bad_provided_services = context + ':bad config - config.applications.*.provided_services should be an array'

let error_msg_bad_service_name = context + ':bad config - config.applications.*.used_services|provided_services.* should be a string'
let error_msg_bad_package_name = context + ':bad config - config.applications.*.used_packages.* should be a string'
let error_msg_bad_plugin_name = context + ':bad config - config.applications.*.used_plugins.* should be a string'

// let error_msg_bad_assets = context + ':bad config - config.applications.*.assets should be a plain object'
// let error_msg_bad_assets_css = context + ':bad config - config.applications.*.assets.css should be an array'
// let error_msg_bad_assets_js = context + ':bad config - config.applications.*.assets.js should be an array'
// let error_msg_bad_assets_img = context + ':bad config - config.applications.*.assets.img should be an array'
// let error_msg_bad_assets_index = context + ':bad config - config.applications.*.assets.index should be a string'
// let error_msg_bad_asset = context + ':bad config - config.applications.*.assets.[css,js,imd].* should be a string'

let error_msg_used_plugin_not_found = context + ':bad config - config.applications.*.used_plugins.* not found in config.plugins'
let error_msg_used_package_not_found = context + ':bad config - config.applications.*.used_packages.* not found in config.packages'
let error_msg_used_service_not_found = context + ':bad config - config.applications.*.used_service.* not found in config.resources'
let error_msg_provided_service_not_found = context + ':bad config - config.applications.*.provided_service.* not found in config.resources'



/**
 * Load the 'config.applications.*' keys of the final state
 * Pure function: (Plain Object) => (mutated Plain Object)
 */
function load_application(logs, arg_app_name, arg_app_config, arg_config_packages, arg_config_plugins, arg_config_services, arg_base_dir)
{
	logs.info(context, 'loading world.tenants.*.applications.' + arg_app_name)
	
	
	try{
		// LOAD FROM FILE
		if ( T.isString(arg_app_config.from_file) )
		{
			logs.info(context, 'loading world.tenants.*.applications.' + arg_app_name + '.from_file')
			assert(T.isString(arg_app_config.from_file), error_msg_bad_from_file)
			
			let file_path_name = path.join(arg_base_dir, arg_app_config.from_file)
			
			let app_file_config = parser.read(file_path_name, 'utf8')
			// console.log(config, 'config')
			assert(T.isObject(app_file_config), error_msg_bad_file_config)
			
			arg_app_config = Object.assign(arg_app_config, app_file_config)
		}

		assert(T.isObject(arg_app_config), error_msg_bad_config)

		// CHECK APPLICATION
		assert(T.isString(arg_app_config.url), error_msg_bad_url)
		assert(T.isString(arg_app_config.license), error_msg_bad_license)
		
		assert(T.isArray(arg_app_config.provided_services), error_msg_bad_provided_services)
		assert(T.isArray(arg_app_config.used_services), error_msg_bad_used_services)
		assert(T.isArray(arg_app_config.used_packages), error_msg_bad_used_packages)
		assert(T.isArray(arg_app_config.used_plugins), error_msg_bad_used_plugins)
		
		// assert(T.isObject(arg_app_config.assets), error_msg_bad_assets)
		// assert(T.isArray(arg_app_config.assets.css), error_msg_bad_assets_css)
		// assert(T.isArray(arg_app_config.assets.js), error_msg_bad_assets_js)
		// assert(T.isArray(arg_app_config.assets.img), error_msg_bad_assets_img)
		// assert(T.isString(arg_app_config.assets.index), error_msg_bad_assets_index)
		
		
		
		// LOOP ON PROVIDED SERVICES
		logs.info(context, 'loading world.tenants.*.applications.' + arg_app_name + '.provided_services')
		arg_app_config.provided_services.forEach(
			function(service_name)
			{
				assert(T.isString(service_name), error_msg_bad_service_name)
				assert(service_name in arg_config_services, error_msg_provided_service_not_found)
			}
		)
		
		// LOOP ON USED SERVICES
		logs.info(context, 'loading world.tenants.*.applications.' + arg_app_name + '.used_services')
		arg_app_config.used_services.forEach(
			function(service_name)
			{
				assert(T.isString(service_name), error_msg_bad_service_name)
				assert(service_name in arg_config_services, error_msg_used_service_not_found)
			}
		)
		
		// LOOP ON USED PACKAGES
		logs.info(context, 'loading world.tenants.*.applications.' + arg_app_name + '.used_packages')
		arg_app_config.used_packages.forEach(
			function(package_name)
			{
				assert(T.isString(package_name), error_msg_bad_package_name)
				assert(package_name in arg_config_packages, error_msg_package_not_found)
			}
		)
		
		// LOOP ON USED PLUGINS
		logs.info(context, 'loading world.tenants.*.applications.' + arg_app_name + '.used_plugins')
		arg_app_config.used_plugins.forEach(
			function(plugin_name)
			{
				assert(T.isString(plugin_name), error_msg_bad_plugin_name)
				assert(plugin_name in arg_config_plugins, error_msg_plugin_not_found)
			}
		)
		
		// // LOOP ON ASSETS CSS
		// arg_app_config.assets.css.forEach(
		// 	function(asset)
		// 	{
		// 		assert(T.isString(asset), error_msg_bad_asset)
		// 	}
		// )
		
		// // LOOP ON ASSETS JS
		// arg_app_config.assets.js.forEach(
		// 	function(asset)
		// 	{
		// 		assert(T.isString(asset), error_msg_bad_asset)
		// 	}
		// )
		
		// // LOOP ON ASSETS IMG
		// arg_app_config.assets.img.forEach(
		// 	function(asset)
		// 	{
		// 		assert(T.isString(asset), error_msg_bad_asset)
		// 	}
		// )
	}
	catch(e)
	{
		// console.error(context + ' has error:' + e)
		arg_app_config = { error: { context:context, exception:e } }
	}
	
	return arg_app_config
}

export default load_application
