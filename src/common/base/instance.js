import T from 'typr'
import assert from 'assert'

import uid from '../utils/uid'
import { is_browser, is_server } from '../utils/is_browser'
import { store } from '../store/index'
import { dispatch_store_config_create_value } from '../store/config/actions'

import Loggable from './loggable'
import Settingsable from './settingsable'



let context = 'common/base/instance'
const NOT_STORED_COLLECTIONS = ['registered_services', 'components', 'svc_providers', 'svc_consumers']



/**
 * @file Devapt base class for resources, servers, Collection items...
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Instance extends Settingsable
{
	/**
	 * Create an instance.
	 * @extends Settingsable
	 * @abstract
	 * @param {string} arg_collection - collection name.
	 * @param {string} arg_class - class name.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings plain object
	 * @param {string} arg_log_context - log context.
	 * @returns {nothing}
	 */
	constructor(arg_collection, arg_class, arg_name, arg_settings, arg_log_context)
	{
		Loggable.static_debug(context, 'Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name)
		Loggable.static_info(context, 'Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name)
		
		assert( T.isString(arg_collection) && arg_collection.length > 0, context + ':bad collection string')
		assert( (NOT_STORED_COLLECTIONS.indexOf(arg_collection) > -1) || store.has_collection(arg_collection), context + ':bad collection')
		assert( T.isString(arg_class) && arg_class.length > 0, context + ':bad class [' + arg_class + ']')
		assert( T.isString(arg_name) && arg_name.length > 0, context + ':bad name [' + arg_name + ']')
		
		const my_uid = uid()
		const my_info = `[${arg_collection},${arg_name},${my_uid}] `
		const my_context = arg_log_context ? arg_log_context + my_info : context + my_info
		
		super(arg_settings, my_context)
		
        // CLASS ATTRIBUTES
		this.is_instance = true
		this.is_weighted = false
        
        // INSTANCE ATTRIBUTES
		this.is_loaded = false
		this.$id = my_uid
		this.$name = arg_name
		this.$type = arg_collection
		this.$class = arg_class
		this.$weight = 1
		
		if ( store.has_collection(arg_collection) )
		{
			dispatch_store_config_create_value(store, ['runtime', 'instances', this.$name], {'id':this.$id, 'name':this.$name, 'class':this.$class, 'type':this.$type} )
		}
	}
	
	
	/**
	 * Get instance unique id.
	 * @returns {string}
	 */
	get_id()
	{
		return this.$id
	}
	
	
	/**
	 * Get instance unique name.
	 * @returns {string}
	 */
	get_name()
	{
		return this.$name
	}
	
	
	/**
	 * Get instance weight.
	 * @returns {number}
	 */
	get_weight()
	{
		return this.$weight
	}
	
	
	/**
	 * Set instance weight.
	 * @param {number} arg_weight - instance weight.
	 * @returns {nothing}
	 */
	set_weight(arg_weight)
	{
		assert( T.isNumber(arg_weight), context + ':bad weight value')
		this.$weight = arg_weight
	}
	
	
	/**
	 * Get instance type.
	 * @returns {string}
	 */
	get_type()
	{
		return this.$type
	}
	
	
	/**
	 * Get instance class.
	 * @returns {string}
	 */
	get_class()
	{
		return this.$class
	}
	
	
    /**
     * Get instance description: {$type:..., $class:..., $id:..., $name:...}.
     * @returns {object} - instance object description
     */
	get_descriptor()
	{
		return { $type:this.$type, $class:this.$class, $id:this.$id, $name:this.$name }
	}
	
	
	/**
	 * Test if this code run inside a browser.
	 * @returns {boolean}
	 */
	is_browser() { return is_browser() }
	
	
	/**
	 * Test if this code run on a browser.
	 * @returns {boolean}
	 */
	is_server() { return is_server() }
	
	
	/**
	 * Load instance settings.
	 * @abstract
	 * @returns {nothing}
	 */
	load()
	{
		this.is_loaded = true
	}
}
