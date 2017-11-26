// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Errorable from '../../common/base/errorable'
import Collection from '../../common/base/collection'

// SERVER IMPORTS
import runtime from '../base/runtime'


let context = 'server/plugins/plugins_manager'



/**
 * @file Plugins manager class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class PluginsManager extends Errorable
{
	/**
	 * Create a plugins manager instance.
	 * @extends Errorable
	 * @param {string|undefined} arg_log_context - optional.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_log_context, arg_logger_manager)
	{
		super(arg_log_context ? arg_log_context : context, arg_logger_manager)
		
		this.is_plugins_manager = true
		
		this._runtime = arg_runtime
		this.registered_plugins = new Collection()
		this.enabled_plugins = new Collection()
	}
	
	
    /**
     * Load a map of plugins.
     * @param {array} arg_plugins - plugins file name or class array.
     * @returns {nothing}
     */
	load(arg_plugins)
	{
		this.update_trace_enabled()
		
		// console.log(arg_plugins, 'arg_plugins')
		// const base_dir = get_base_dir()
        
		for(let plugin of arg_plugins)
		{
			// GIVEN PLUGIN IS A RELATIVE FILE PATH NAME
			if ( T.isString(plugin) )
			{
				// const plugin_dir = plugin != default_plugin_path ? base_dir : __dirname

				// const file_path_name = path.isAbsolute(plugin) ? plugin : path.join(plugin_dir, plugin)
				const file_path_name = runtime.context.get_absolute_plugin_path(plugin)
				console.info('loading plugin [' + plugin + '] at [' + (file_path_name == plugin ? 'same' : file_path_name) + ']')

				try
				{
					const required = require(file_path_name)
					const PluginClass = ('default' in required) ? required.default : required
					// console.log('loading rendering plugin class', PluginClass)
					
					plugin = new PluginClass(this._runtime, this)
				}
				catch(e)
				{
					console.error(context + '.load:' + plugin + 'failed', e)
				}
			}

			// GIVEN PLUGIN IS A PLUGIN CLASS INSTANCE
			if ( T.isObject(plugin) && this.plugin_is_valid(plugin) )
			{
				const plugin_name = plugin.get_name()
				if ( T.isString(plugin_name) )
				{
					// this.plugins[plugin_name] = plugin
					// this.plugins_ordered.push(plugin)
					this.register_plugin(plugin)
					continue
				}
			}

			// UNKNOW PLUGIN TYPE
			console.error(plugin, 'plugin')
			assert(false, context + ':bad plugin')
		}
	}
	
	
	/**
	 * Load plugin at first position
	 * @param {Plugin} arg_plugin - plugin instance
	 * @returns {nothing}
	 */
	load_at_first(arg_plugin)
	{
		assert( T.isObject(arg_plugin) && this.plugin_is_valid(arg_plugin), context + ':load_at_first:bad plugin object')
		this.register_plugin(arg_plugin, 0)
	}
	
	
	/**
	 * Test if plugin is valid.
	 * @abstract
	 * @method plugin_is_valid
	 * @param {Plugin} arg_plugin - plugin instance.
	 * @returns {boolean} - given plugin is valid for this manager.
	 */
	
	
	
	/**
	 * Get registered plugins list.
	 * @returns {array} - plugins list 
	 */
	get_plugins()
	{
		return this.registered_plugins.get_all()
	}
	
	
	/**
	 * Get registered plugins list with a filtered type.
	 * @param {string|array} arg_type_or_types - type name or types names array
	 * @returns {array} - plugins list 
	 */
	get_typed_plugins(arg_type_or_types)
	{
		return this.registered_plugins.get_all(arg_type_or_types)
	}
	
	
	/**
	 * Register a plugin to be used later, do not active it now.
	 * @param {object} arg_plugin - plugin instance.
	 * @param {integer} arg_position - index in array (0:first or undefined)
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	register_plugin(arg_plugin, arg_position)
	{
		assert( T.isObject(arg_plugin) && arg_plugin.is_plugin, context + ':bad plugin object')

		const plugin_name = arg_plugin.get_name()
		if (this.registered_plugins.find_by_name(plugin_name) )
		{
			this.error_already_registered(plugin_name)
			return Promise.resolve(false)
		}
		
		if (arg_position === 0)
		{
			this.registered_plugins.add_first(arg_plugin)
		}
		else
		{
			this.registered_plugins.add(arg_plugin)
		}
		// arg_plugin.manager = this

		return Promise.resolve(true)
	}
	
	
	/**
	 * Unregister a registered plugin and disble it before if needed.
	 * @param {object} arg_plugin - plugin instance.
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	unregister_plugin(arg_plugin)
	{
		assert( T.isObject(arg_plugin) && arg_plugin.is_plugin, context + ':bad plugin object')
		
		const plugin_name = arg_plugin.get_name()
		
		// PLUGIN IS REGISTERED ?
		if ( ! this.registered_plugins.has(arg_plugin) )
		{
			this.error_not_registered(plugin_name)
			return Promise.resolve(false)
		}
		
		let disable_promise = Promise.resolve(true)
		
		// PLUGIN IS ENABLED ?
		if (this.enabled_plugins.has(arg_plugin) )
		{
			this.enabled_plugins.remove(arg_plugin)
			disable_promise = arg_plugin.disable()
		}
		
		// UNREGISTER
		this.registered_plugins.remove(arg_plugin)
		arg_plugin.manager = null
		delete arg_plugin.manager
		
		return disable_promise
	}
	
	
	/**
	 * Get a registered plugin by its name and its enabled flag.
	 * @param {string} arg_name - registered plugin name
	 * @param {boolean} arg_enabled - plugin is enabled ?
	 * @returns {Plugin}
	 */
	plugin(arg_name, arg_enabled)
	{
		if (arg_enabled)
		{
			return this.enabled_plugins.item(arg_name)
		}
		return this.registered_plugins.item(arg_name)
	}
	
	
	/**
	 * Get a registered plugin by its name.
	 * @param {string} arg_name - registered plugin name
	 * @returns {Plugin}
	 */
	registered_plugin(arg_name)
	{
		return this.registered_plugins.item(arg_name)
	}
	
	
	/**
	 * Get a enabled plugin by its name.
	 * @param {string} arg_name - enabled plugin name
	 * @returns {Plugin}
	 */
	enabled_plugin(arg_name)
	{
		return this.enabled_plugins.item(arg_name)
	}
	
	
	/**
	 * Error wrapper - on registering an already registered plugin
	 * @param {string} arg_plugin_name - plugin name
	 * @returns {nothing}
	 */
	error_already_registered(arg_plugin_name)
	{
		this.error('plugin with name [' + arg_plugin_name + '] is already registered')
	}
	
	
	/**
	 * Error wrapper - a plugin is not registered
	 * @param {string} arg_plugin_name - plugin name
	 * @returns {nothing}
	 */
	error_not_registered(arg_plugin_name)
	{
		this.error('plugin with name [' + arg_plugin_name + '] is not registered')
	}
}
