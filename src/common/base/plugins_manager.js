
import T from 'typr'
import assert from 'assert'
import Errorable from './errorable'
import Collection from './collection'


let context = 'common/base/plugins_manager'



/**
 * Plugins manager class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class PluginsManager extends Errorable
{
	/**
	 * Create an Authentication base class.
	 * @param {string|undefined} arg_log_context - optional.
	 * @returns {nothing}
	 */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_plugins_manager = true
		
		this.registered_plugins = new Collection()
		this.enabled_plugins = new Collection()
	}
    
    
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
     * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	register_plugin(arg_plugin)
	{
        assert( T.isObject(arg_plugin) && arg_plugin.is_plugin, context + ':bad plugin object')
        
        const plugin_name = arg_plugin.get_name()
        if (this.registered_plugins.find_by_name(plugin_name) )
        {
            this.error_already_registered(plugin_name)
            return Promise.resolved(true)
        }
		
        this.registered_plugins.add(arg_plugin)
        arg_plugin.manager = this
        
        return Promise.resolved(false)
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
            return Promise.resolved(false)
        }
        
        let disable_promise = Promise.resolved(true)
        
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
