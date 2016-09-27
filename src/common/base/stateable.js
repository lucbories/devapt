
import T from 'typr'
import assert from 'assert'

import Settingsable from '../../common/base/settingsable'


const context = 'browser/components/stateable'




/**
 * @file UI stateable base class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Stateable extends Settingsable
{
	
	/**
	 * Creates an instance of Stateable: an object with an observable mutable state.
	 * @extends Settingsable
	 * 
	 * API:
	 * 		->get_initial_state():plain object - get state at creation.
	 * 		->get_state():plain object - get current state.
	 * 		->get_state_store():object - get state store.
	 * 		->get_state_path():array|string - get state path into store.
	 * 		->get_state_value(arg_key_or_path, arg_default_value=undefined):any - get a state value at path.
	 * 		->handle_state_change(arg_previous_state, arg_new_state):nothing - handle state changes (to be implemented in sub classes)
	 * 		->dispatch_action(arg_action_type, arg_options):nothing - dispatch state changes actions.
	 * 		->get_name():string - get instance name.
	 * 
	 * @param {object} arg_settings - settings plain object
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_settings, arg_runtime, arg_state, arg_log_context, arg_logger_manager)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_settings, log_context, arg_logger_manager)
		
		this.is_component = true
		
		this.runtime = arg_runtime
		this.initial_state = arg_state
		this.state_store = this.runtime.get_state_store()
		this.state_path = undefined
		
		// console.info(context + ':constructor:creating component ' + this.get_name())
	}
	
	
	
	/**
	 * Get initial state, an immutable object from a Redux data store.
	 * 
	 * @returns {object} - component state.
	 */
	get_initial_state()
	{
		return this.initial_state
	}
	
	
	
	/**
	 * Get current state, an immutable object from a Redux data store.
	 * 
	 * @returns {object} - component state.
	 */
	get_state()
	{
		const path = this.state_path
		
		// console.log('component:get_state', this.runtime.get_state().toJS())
		// console.log('component:state_path', this.state_path)
		// console.log('component:state', this.runtime.get_state().getIn(path).toJS())
		
		return this.state_store.get_state().getIn(path)
	}
	
	
	
	/**
	 * Get state store.
	 * 
	 * @returns {object} - State store.
	 */
	get_state_store()
	{
		return this.state_store
	}
	
	
	
	/**
	 * Get state path into a Redux data store.
	 * 
	 * @returns {array} - component state path.
	 */
	get_state_path()
	{
		return this.state_path
	}



	/**
	 * Get a state entry.
	 * 
	 * @param {string|array} arg_key_or_path - key string or strings path array.
	 * @param {any} arg_default_value - returned value on not found value result (optional)(default:undefined). 
	 * 
	 * @returns {any} - js value (plain object, number, string, array, boolean)
	 */
	get_state_value(arg_key_or_path, arg_default_value=undefined)
	{
		const state = this.get_state()

		if ( T.isString(arg_key_or_path) )
		{
			const value = state.has(arg_key_or_path) ? state.get(arg_key_or_path) : arg_default_value
			return T.isFunction(value.toJS) ? value.toJS() : value
		}

		if ( T.isArray(arg_key_or_path) )
		{
			const value = state.hasIn(arg_key_or_path) ? state.getIn(arg_key_or_path) : arg_default_value
			return value && T.isFunction(value.toJS) ? value.toJS() : value
		}

		return arg_default_value
	}
	
	
	
	/**
	 * Handle component state changes.
	 * @abstract
	 * 
	 * @param {Immutable.Map} arg_previous_state - previous state map.
	 * @param {Immutable.Map} arg_new_state - new state map.
	 * 
	 * @returns {nothing}
	 */
	handle_state_change(/*arg_previous_state, arg_new_state*/)
	{
		// IMPLEMENTED IN SUB CLASSES
	}
	
	
	
	/**
	 * Dispatch a state action.
	 * 
	 * @param {string|object} arg_action_type - action type string or action object.
	 * @param {object|undefined} arg_options - action options object (optional).
	 * 
	 * @returns {nothing}
	 */
	dispatch_action(arg_action_type, arg_options)
	{
		let action = undefined
		
		if ( T.isString(arg_action_type) )
		{
			action = { type:arg_action_type }
		}
		else if ( T.isString(arg_action_type) && T.isString(arg_action_type.type) )
		{
			action = arg_action_type
		}
		else
		{
			assert(false, context + ':dispatch_action:bad action object')
		}
		
		if ( T.isObject(arg_options) )
		{
			action = Object.assign(action, arg_options)
		}
		
		if ( !('component' in action) )
		{
			action.component = this.get_name()
		}
		
		// console.info(context + ':dispatch_action:type=' + action.type + ' for ' + action.component, action)
		
		this.state_store.dispatch_action(action)
	}
	
	
	
	/**
	 * Get name.
	 * 
	 * @returns {string} - component name.
	 */
	get_name()
	{
		return this.initial_state['name']
	}
}
