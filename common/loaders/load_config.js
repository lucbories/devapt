
import assert from 'assert'
import T from 'typr'

import logs from '../../server/utils/logs'
import load_config_apps from './load_config_apps'
import load_config_modules from './load_config_modules'
import load_config_plugins from './load_config_plugins'
import load_config_security from './load_config_security'


let context = 'common/loaders/load_config'
let error_msg_bad_config = context + ':bad config'



/**
 * Load the 'config' key of the final state
 * Pure function: (Plain Object) => (new Plain Object)
 */
function load_config(arg_state, arg_initial_config)
{
	logs.info(context, 'loading config');
	
	
	// LOAD APPS.JSON
	try{
		// GET CONFIG JSON
		let config = arg_initial_config || require('../../apps/apps.json')
		
		// CHECK CONFIG PARTS
		assert(T.isObject(config), 'apps.json should be a plain object')
		assert(T.isString(config.host), 'apps.json:host should be a string')
		assert(T.isString(config.port), 'apps.json:port should be a string')
		assert(T.isObject(config.apps), 'apps.json:apps should be a plain object')
		assert(T.isObject(config.modules), 'apps.json:modules should be a plain object')
		assert(T.isObject(config.plugins), 'apps.json:plugins should be a plain object')
		assert(T.isObject(config.security), 'apps.json:security should be a plain object')
		
		// LOAD CONFIG PARTS
		arg_state.config = {}
		arg_state.config.host = config.host
		arg_state.config.port = config.port
		arg_state.config.apps = load_config_apps(config.apps)
		arg_state.config.modules = load_config_modules(config.modules)
		arg_state.config.plugins = load_config_plugins(config.plugins)
		arg_state.config.security = load_config_security(config.security)
	}
	catch(e)
	{
		arg_state.config = { error: e }
	}
	
	return arg_state
}

export default load_config
