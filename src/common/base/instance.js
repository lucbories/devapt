import T from 'typr'
import assert from 'assert'

import uid from '../utils/uid'
import { is_browser, is_server } from '../utils/is_browser'
import { store } from '../store/index'
// import { dispatch_store_config_create_value } from '../store/config/actions'

import Settingsable from './settingsable'



let context = 'common/base/instance'
const NOT_STORED_COLLECTIONS = ['registered_services', 'components', 'svc_providers', 'svc_consumers', 'buses', 'remote_bus_gateways']



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
	 * 
	 * @param {string} arg_collection - collection name.
	 * @param {string} arg_class - class name.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings plain object
	 * @param {string} arg_log_context - log context.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_collection, arg_class, arg_name, arg_settings, arg_log_context)
	{
		// Loggable.static_debug(context, 'Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name)
		// Loggable.static_info(context, 'Instance.constructor(%s,%s,%s)', arg_collection, arg_class, arg_name)
		
		// console.log('Instance collection:%s class:%s name:%s context:%s', arg_collection, arg_class, arg_name, arg_log_context)
		
		// DEBUG STORE
		// console.log(store, 'store')
		// console.log(config, 'config')
		
		assert( T.isString(arg_collection) && arg_collection.length > 0, context + ':bad collection string')
		assert( (NOT_STORED_COLLECTIONS.indexOf(arg_collection) > -1) || store.has_collection(arg_collection), context + ':bad collection for ' + arg_collection)
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
			store.set_item( ['runtime', 'instances', this.$name], {'id':this.$id, 'name':this.$name, 'class':this.$class, 'type':this.$type} )
		}
		
		if ( ! this.is_runtime )
		{
			const logger = this.get_logger_manager()

			// console.log(context + ':constructor:logger settings', logger.$settings)

			// const traces = logger.get_setting('traces') // TODO
			// if ( T.isObject(logger.$settings) && T.isObject( logger.$settings.has('traces') ) )
			if ( T.isObject(logger.$settings) && T.isObject( logger.$settings['traces'] ) )
			{
				const traces = logger.$settings['traces']
				this.is_trace_enabled = this.should_trace(traces)
				// console.log(context + ':constructor:name=%s, is_trace_enabled', arg_name, this.is_trace_enabled)
			}
			// else
			// {
			// 	console.log(context + ':undefined logger settings for ' + this.get_descriptor_string())
			// }
		}
	}
	
	
	/**
	 * Should trace flag.
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
	 * @returns {boolean} - trace flag.
	 */
	should_trace(arg_traces_cfg)
	{
		if ( ! T.isObject(arg_traces_cfg) )
		{
			console.error(context + ':should_trace(instance):no traces cfg')
			return false
		}
		
		let should_trace = false
		
		// TRACES MODULE ?
		should_trace = should_trace || this.should_trace_module(arg_traces_cfg)
		should_trace = should_trace || this.should_trace_class(arg_traces_cfg)
		should_trace = should_trace || this.should_trace_name(arg_traces_cfg)
		
		if (should_trace)
		{
			console.log(context + ':should_trace(instance):name=' + this.get_name() + ',value=' + should_trace)
		}
		
		return should_trace
	}
	
	
	/**
	 * Should trace flag for classes.
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
	 * @returns {boolean} - trace flag.
	 */
	should_trace_class(arg_traces_cfg)
	{
		if ( ! T.isObject(arg_traces_cfg) )
		{
			return false
		}
		
		let should_trace = false
		
		// TRACES MODULE ?
		if ( T.isObject(arg_traces_cfg.classes) )
		{
			const class_name = this.$class
			
			if ( (class_name in arg_traces_cfg.classes) )
			{
				// console.log(context + ':class name found')
				should_trace = arg_traces_cfg.classes[class_name]
			}
			else
			{
				Object.keys(arg_traces_cfg.classes).forEach(
					function(arg_class_name)
					{
						const loop_value = arg_traces_cfg.classes[arg_class_name]
						
						// REGEX
						if (arg_class_name.indexOf('*') > -1 || arg_class_name.indexOf('.') > -1 || arg_class_name.indexOf('[') > -1 || arg_class_name.indexOf('{') > -1)
						{
							const re = new RegExp(arg_class_name, 'gi')
							const found = re.test(class_name)
							if (found)
							{
								should_trace = loop_value ? true : false
								return
							}
						}
					}
				)
			}
		}
		
		return should_trace
	}
	
	
	/**
	 * Should trace flag for instances names.
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
	 * @returns {boolean} - trace flag.
	 */
	should_trace_name(arg_traces_cfg)
	{
		if ( ! T.isObject(arg_traces_cfg) )
		{
			return false
		}
		
		let should_trace = false
		
		// TRACES MODULE ?
		if ( T.isObject(arg_traces_cfg.instances) )
		{
			const name = this.$name
			
			if ( (name in arg_traces_cfg.instances) )
			{
				should_trace = arg_traces_cfg.instances[name]
			}
			else
			{
				Object.keys(arg_traces_cfg.instances).forEach(
					function(arg_class_name)
					{
						const loop_value = arg_traces_cfg.instances[arg_class_name]
						
						// REGEX
						if (arg_class_name.indexOf('*') > -1 || arg_class_name.indexOf('.') > -1 || arg_class_name.indexOf('[') > -1 || arg_class_name.indexOf('{') > -1)
						{
							const re = new RegExp(arg_class_name, 'gi')
							const found = re.test(name)
							if (found)
							{
								should_trace = loop_value ? true : false
								return
							}
						}
					}
				)
			}
		}
		
		return should_trace
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
     * Get instance description string: $type:..., $class:..., $id:..., $name:....
     * @returns {string} - instance object description
     */
	get_descriptor_string()
	{
		return '{$type:' + this.get_type() + ', $class:' + this.get_class() + ', $id:' + this.get_id() + ', $name:' + this.get_name() + '}'
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
