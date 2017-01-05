// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import fs from 'fs'

// COMMON IMPORTS
import TopologyDefineItem from './topology_define_item'


let context = 'common/topology/define/topology_define_plugin'



/**
 * @file TopologyDefinePlugin class: describe a Plugin topology item.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class TopologyDefinePlugin extends TopologyDefineItem
{
	/**
	 * Create a TopologyDefinePlugin instance.
	 * @extends TopologyDefineItem
	 * 
	 * SETTINGS FORMAT:
	 * 	"plugins":{
	 * 		"pluginA":{
	 *			"type":"...", // rendering
	 * 			"file":"..."
	 * 		},
	 * 		"pluginB":{
	 *			"type":"...",
	 * 			"package":"..."
	 * 		}
	 * 	}
	 * 
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_name, arg_settings, 'TopologyDefinePlugin', log_context)
		
		this.is_topology_define_plugin = true

		this.topology_type = 'plugins'
		
		this.topology_plugin_type = this.get_setting('type', undefined)
		this.topology_plugin_file = this.get_setting('file', undefined)
		this.topology_plugin_package = this.get_setting('package', undefined)

		this.info('Plugin is created')
	}



	/**
	 * Load rendering plugins.
	 * 
	 * @returns {Promise}
	 */
	load_rendering_plugin(arg_runtime)
	{
		const self = this
		self.enter_group('load_rendering_plugin')

		const plugins_mgr = arg_runtime.get_plugins_factory().get_rendering_manager()
		assert( T.isObject(plugins_mgr) && plugins_mgr.is_plugins_manager, context + ':load_rendering_plugin:bad plugin manager object')

		this.debug('plugin=%s', this.get_name())

		let plugin_class = undefined

		// RENDERING PLUGIN IS LOADED FROM A NPM PACKAGE
		if ( T.isString(this.topology_plugin_package) )
		{
			// TODO : loading packages without full path?
			let file_path = undefined
			const pkg = this.topology_plugin_package

			file_path = self.get_runtime().context.get_absolute_path('./node_modules/', pkg)
			let file_path_stats = file_path ? fs.statSync(file_path) : undefined
			if ( ! file_path_stats || ! file_path_stats.isDirectory())
			{
				file_path = self.get_runtime().context.get_absolute_path('../node_modules/', pkg)
				file_path_stats = file_path ? fs.statSync(file_path) : undefined
				if ( ! file_path_stats || ! file_path_stats.isDirectory())
				{
					file_path = self.get_runtime().context.get_absolute_path('../../node_modules/', pkg)
					file_path_stats = file_path ? fs.statSync(file_path) : undefined
					if ( ! file_path_stats || ! file_path_stats.isDirectory())
					{
						file_path = self.get_runtime().context.get_absolute_path('../../../node_modules/', pkg)
						file_path_stats = file_path ? fs.statSync(file_path) : undefined
						if ( ! file_path_stats || ! file_path_stats.isDirectory())
						{
							file_path = undefined
						}
					}
				}
			}

			if (file_path)
			{
				console.log(context + ':load_rendering_plugins:package=%s for plugin=%s at=%s', pkg, this.get_name(), file_path)
				plugin_class = require(file_path)
			}
			else
			{
				file_path = undefined
				console.error(context + ':load_rendering_plugins:not found package=%s for plugin=%s at=%s', pkg, this.get_name())
			}
		}


		// LOAD A PLUGIN FROM A PATH
		else if ( T.isString(this.topology_plugin_file) )
		{
			const file_path = self.get_runtime().context.get_absolute_path(this.topology_plugin_file)
			console.log(context + ':load_rendering_plugins:file_path=%s for plugin=%s', file_path, this.get_name())

			plugin_class = require(file_path)
		}


		// REGISTER PLUGIN CLASS
		if (plugin_class)
		{
			if ( plugin_class.default )
			{
				plugin_class = plugin_class.default
			}

			const plugin = new plugin_class(arg_runtime, plugins_mgr)
			plugins_mgr.load_at_first(plugin)
			plugin.$plugin_class = plugin_class
			plugin.find_rendering_function = (type)=>{
				if ( T.isFunction(plugin.$plugin_class.find_rendering_function) )
				{
					// console.log('plugin.$plugin_class.find_rendering_function FOUND')
					return plugin.$plugin_class.find_rendering_function(type)
				}
				// console.log('plugin.$plugin_class.find_rendering_function NOT FOUND')
				return undefined
			}

			this.topology_plugin_instance = plugin

			console.log(context + ':load_rendering_plugins:plugin=%s is loaded', this.get_name())
		}
			
			
		self.leave_group('load_rendering_plugin')
		return Promise.resolve(true)
	}



	/**
	 * Find a rendering function.
	 * 
	 * @param {string} arg_type - rendering item type.
	 * 
	 * @returns {Function} - rendering function.
	 */
	find_rendering_function(arg_type)
	{
		if ( this.topology_plugin_type != 'rendering')
		{
			console.warn(context + ':find_rendering_function:not a rendering plugin:' + this.get_name())
			return undefined
		}

		if ( ! T.isObject(this.topology_plugin_instance) || ! this.topology_plugin_instance.is_rendering_plugin )
		{
			console.warn(context + ':find_rendering_function:no rendering plugin instance:' + this.get_name())
			return undefined
		}

		if ( ! T.isFunction(this.topology_plugin_instance.find_rendering_function) )
		{
			console.warn(context + ':find_rendering_function:no rendering plugin function:' + this.get_name())
			return undefined
		}

		const fn = this.topology_plugin_instance.find_rendering_function(arg_type)
		// console.log(fn, context + ':find_rendering_function:rendering function for ' + this.get_name())

		return fn
	}
}
