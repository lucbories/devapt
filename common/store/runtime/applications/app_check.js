import assert from 'assert'
import T from 'typr'



let context = 'common/store/runtime/application/app_check'

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



export default function app_check_safe(arg_config)
{
	// CHECK APPLICATION CONFIGURATION
	try{
		return app_check_not_safe(arg_config)
	}
	catch(e)
	{
	}
	
	return false
}


export function app_check_not_safe(arg_app_config)
{
	// CHECK APPLICATION CONFIGURATION
	assert(T.isObject(arg_app_config), context + 'app config should be a plain object')
	
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
	
	return true
}