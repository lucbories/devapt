
import assert from 'assert'
import T from 'typr'



let context = 'common/store/config/loaders/load_config_plugins'
let error_msg_bad_config = context + ':bad config'
// let error_msg_bad_plugin = context + ':plugins.* should be an object'
// let error_msg_bad_js = context + ':plugins.*.js should be a string'
// let error_msg_bad_css = context + ':plugins.*.css should be an array'
// let error_msg_bad_autoload = context + ':plugins.*.autoload should be a boolean'



function load_config_plugins(logs, arg_plugins_config/*, arg_base_dir*/)
{
	logs.info(context, 'loading config.plugins')
	
	try{
		// CHECK MODULES
		assert(T.isObject(arg_plugins_config), error_msg_bad_config)
		
		// LOOP ON PLUGINS SETS
		const sets = ['rendering']
		Object.keys(arg_plugins_config).forEach(
			function(plugin_set_name)
			{
				assert( sets.indexOf(plugin_set_name) > -1, context + ':bad plugin set [' + plugin_set_name + '] not in [' + sets.toString() + ']')
				
				// TODO ?
			}
		)
	}
	catch(e)
	{
		arg_plugins_config = { error: { context:context, exception:e} }
	}
	
	return arg_plugins_config
}

export default load_config_plugins
