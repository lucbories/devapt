// NPM IMPORTS
import assert from 'assert'
import T from 'typr'


const context = 'common/topology/registry/loaders/load_plugins'



let error_msg_bad_config = context + ':bad config'
// let error_msg_bad_plugin = context + ':plugins.* should be an object'
// let error_msg_bad_js = context + ':plugins.*.js should be a string'
// let error_msg_bad_css = context + ':plugins.*.css should be an array'
// let error_msg_bad_autoload = context + ':plugins.*.autoload should be a boolean'



function load_plugins(logs, arg_plugins_config/*, arg_base_dir*/)
{
	logs.info(context, 'loading world.plugins')
	
	try{
		// CHECK MODULES
		assert(T.isObject(arg_plugins_config), error_msg_bad_config)
		
		// LOOP ON PLUGINS
		const plugins_types = ['rendering']
		Object.keys(arg_plugins_config).forEach(
			function(plugin_name)
			{
				const plugin_cfg = arg_plugins_config[plugin_name]

				// CHECK TYPE
				assert( T.isString(plugin_cfg.type), 'bad plugin type string')
				assert( plugins_types.indexOf(plugin_cfg.type) > -1, context + ':bad plugin.type [' + plugin_cfg.type + '] not in [' + plugins_types.toString() + ']')

				// CHECK SOURCE: FILE OR PACKAGE
				assert( T.isString(plugin_cfg.file) || T.isString(plugin_cfg.package), 'bad plugin source (plugin.file or plugin.package) string')
			}
		)
	}
	catch(e)
	{
		arg_plugins_config = { error: { context:context, exception:e} }
	}
	
	return arg_plugins_config
}

export default load_plugins
