
import T from 'typr'
import assert from 'assert'
import path from 'path'

import { get_base_dir } from '../../utils/paths'


const context = 'common/rendering/base/rendering_manager'
const default_plugin_path = '../default/rendering_plugin'


/**
 * Rendering manager class for renderer plugins managing.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RenderingManager
{
    /**
     * Create a RenderingManager instance
     * @param {array} arg_plugins - plugins array of path or class
     */
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
			this.load( [default_plugin_path] )
		}
	}
	
    
	/**
     * Create a component instance by lookup on self contained plugins.
     * @param {string} arg_class_name - component class name.
     * @param {string} arg_name - component name.
     * @param {object} arg_settings - component settings plain object.
     * @param {object} arg_state - component initial state plain object.
     * @returns {boolean} component class found or not.
     */
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
	
    
	/**
     * Test if a component class is known into self contained plugins.
     * @param {string} arg_class_name - component class name.
     * @returns {boolean} componenet class found or not.
     */
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
	
	
    /**
     * Load a map of rendering plugins.
     * @param {array} arg_plugins - plugins file name or class array.
     * @returns {boolean} componenet class found or not.
     */
	load(arg_plugins)
	{
		// console.log(arg_plugins, 'arg_plugins')
		const base_dir = get_base_dir()
        
		for(let plugin of arg_plugins)
		{
            // GIVEN PLUGIN IS A RELATIVE FILE PATH NAME
			if ( T.isString(plugin) )
			{
                const plugin_dir = plugin != default_plugin_path ? base_dir : __dirname
                
                const file_path_name = path.join(plugin_dir, plugin)
				console.info('loading plugin at [' + plugin + '] at [' + file_path_name + ']')
				
                const PluginClass = require(file_path_name)
				plugin = new PluginClass()
			}
			
            // GIVEN PLUGIN IS A PLUGIN CLASS INSTANCE
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
			
            // UNKNOW PLUGIN TYPE
			console.error(plugin, 'plugin')
			assert(false, context + ':bad plugin')
		}
	}
}
