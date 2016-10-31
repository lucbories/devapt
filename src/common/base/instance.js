// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import uid from '../utils/uid'
import { is_browser, is_server } from '../utils/is_browser'
import Stateable from './stateable'

// SERVER INSTANCE
import topology_registry from '../topology/registry/index'


const context = 'common/base/instance'



const NOT_STORED_COLLECTIONS = ['defined_topology', 'deployed_topology', 'registered_services', 'components', 'svc_providers', 'svc_consumers', 'buses', 'remote_bus_gateways']



/**
 * @file Devapt base class for resources, servers, Collection items...
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Instance extends Stateable
{
	/**
	 * Create an instance.
	 * @extends Stateable
	 * @abstract
	 * 
	 * @param {string} arg_collection - collection name.
	 * @param {string} arg_class - class name.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings plain object
	 * @param {string} arg_log_context - log context.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_collection, arg_class, arg_name, arg_settings, arg_log_context, arg_logger_manager)
	{
		// Loggable.static_debug(context, 'Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name)
		// Loggable.static_info(context, 'Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name)
		
		// console.log('Instance collection:%s class:%s name:%s context:%s', arg_collection, arg_class, arg_name, arg_log_context)
		
		// DEBUG
		if ( ! ( T.isString(arg_name) && arg_name.length > 0) )
		{
			console.error(context + ':Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name, arg_settings)
		}
		
		assert( T.isString(arg_collection) && arg_collection.length > 0, context + ':bad collection string')
		assert( (NOT_STORED_COLLECTIONS.indexOf(arg_collection) > -1) || topology_registry.has_collection(arg_collection), context + ':bad collection for ' + arg_collection)
		assert( T.isString(arg_class) && arg_class.length > 0, context + ':bad class [' + arg_class + ']')
		assert( T.isString(arg_name) && arg_name.length > 0, context + ':bad name [' + arg_name + ']')
		
		const my_uid = uid()
		const my_info = `[${arg_collection},${arg_name},${my_uid}] `
		const my_context = arg_log_context ? arg_log_context + my_info : context + my_info
		
		
		// GET RUNTIME
		const server_runtime_file = '../../server/base/runtime'
		// const browser_runtime_file = 'see window.devapt().runtime()'
		
		let runtime = undefined
		if (is_server())
		{
			runtime = require(server_runtime_file).default
		}
		else if (is_browser())
		{
			runtime = window.devapt().runtime()
		}
		
		const default_state = {}
		super(arg_settings, runtime, default_state, my_context, arg_logger_manager)


        // CLASS ATTRIBUTES
		this.is_instance = true
		// this.is_weighted = false
        
        // INSTANCE ATTRIBUTES
		this.is_loaded = false
		this.$id = my_uid
		this.$name = arg_name
		this.$type = arg_collection
		this.$class = arg_class
		// this.$weight = 1
		
		// REGISTER INSTANCE IN TOPOLOGY
		if (is_server())
		{
			if ( topology_registry.has_collection(arg_collection) )
			{
				topology_registry.set_item( ['runtime', 'instances', this.$name], {'id':this.$id, 'name':this.$name, 'class':this.$class, 'type':this.$type} )
			}
		}
		
		// UPDATE TRACE FLAG
		if ( ! this.is_server_runtime )
		{
			this.update_trace_enabled()
		}
	}

	
	
	/**
	 * Get instance unique id.
	 * 
	 * @returns {string}
	 */
	get_id()
	{
		return this.$id
	}
	
	

	/**
	 * Get instance unique name.
	 * 
	 * @returns {string}
	 */
	get_name()
	{
		return this.$name
	}
	
	

	/**
	 * Get instance weight.
	 * 
	 * @returns {number}
	 */
	// get_weight()
	// {
	// 	return this.$weight
	// }
	

	
	/**
	 * Set instance weight.
	 * 
	 * @param {number} arg_weight - instance weight.
	 * 
	 * @returns {nothing}
	 */
	// set_weight(arg_weight)
	// {
	// 	assert( T.isNumber(arg_weight), context + ':bad weight value')
	// 	this.$weight = arg_weight
	// }
	

	
	/**
	 * Get instance type.
	 * 
	 * @returns {string}
	 */
	get_type()
	{
		return this.$type
	}
	

	
	/**
	 * Get instance class.
	 * 
	 * @returns {string}
	 */
	get_class()
	{
		return this.$class
	}
	
	

    /**
     * Get instance description: {$type:..., $class:..., $id:..., $name:...}.
	 * 
     * @returns {object} - instance object description
     */
	get_descriptor()
	{
		return { $type:this.$type, $class:this.$class, $id:this.$id, $name:this.$name }
	}
	

	
    /**
     * Get instance description string: $type:..., $class:..., $id:..., $name:....
	 * 
     * @returns {string} - instance object description
     */
	get_descriptor_string()
	{
		return '{$type:' + this.get_type() + ', $class:' + this.get_class() + ', $id:' + this.get_id() + ', $name:' + this.get_name() + '}'
	}
	
	

	/**
	 * Test if this code run inside a browser.
	 * 
	 * @returns {boolean}
	 */
	is_browser() { return is_browser() }
	

	
	/**
	 * Test if this code run on a browser.
	 * 
	 * @returns {boolean}
	 */
	is_server() { return is_server() }
	
	
	
	/**
	 * Load instance settings.
	 * @abstract
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		this.is_loaded = true
		if ( ! this.is_server_runtime )
		{
			this.update_trace_enabled()
		}
	}
}
