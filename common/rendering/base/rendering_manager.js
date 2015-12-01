
import T from 'typr'
import assert from 'assert'


const context = 'common/rendering/base/rendering_manager'



export default class RenderingManager
{
	constructor(arg_plugins)
	{
		this.plugins = {}
		this.plugins_ordered = []
		
		if ( T.isArray(arg_plugins) )
		{
			this.load(arg_plugins)
		}
		
		if (! this.plugins.default)
		{
			this.load(['../default/rendering_plugin'])
		}
	}
	
	
	create(arg_class_name, arg_name, arg_settings, arg_state)
	{
		assert( T.isString(arg_class_name), context + ':bad class string')
		
		for(let plugin of this.plugins_ordered)
		{
			if ( plugin.has(arg_class_name) )
			{
				return plugin.create(arg_class_name, arg_name, arg_settings, arg_state)
			}
		}
		
		
		return false
	}
	
	
	has(arg_class_name)
	{
		assert( T.isString(arg_class_name), context + ':bad class string')
		
		for(let plugin of this.plugins_ordered)
		{
			if ( plugin.has(arg_class_name) )
			{
				return true
			}
		}
		
		
		return false
	}
	
	
	load(arg_plugins)
	{
		console.log(arg_plugins, 'arg_plugins')
		
		for(let plugin of arg_plugins)
		{
			if ( T.isString(plugin) )
			{
				console.info('loading plugin at [' + plugin + ']')
				const PluginClass = require(plugin)
				plugin = new PluginClass()
			}
			
			if ( T.isObject(plugin) && plugin.is_rendering_plugin )
			{
				const plugin_name = plugin.get_name()
				if ( T.isString(plugin_name) )
				{
					this.plugins[plugin_name] = plugin
					this.plugins_ordered.push(plugin)
					continue
				}
			}
			
			console.error(plugin, 'plugin')
			assert(false, context + ':bad plugin')
		}
	}
}
