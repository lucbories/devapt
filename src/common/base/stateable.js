// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import Immutable from 'immutable'

// COMMON IMPORTS
import Settingsable from './settingsable'


const context = 'common/base/stateable'



/**
 * @file Stateable base class.
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
	 * 
	 * 		->handle_state_change(arg_previous_state, arg_new_state):nothing - handle state changes (to be implemented in sub classes)
	 * 		->register_state_value_change_handle(arg_path, arg_listener):nothing - Register a state value change listener.
	 * 
	 * 		->dispatch_action(arg_action_type, arg_options):nothing - dispatch state changes actions.
	 * 
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
		
		this.is_stateable = true
		
		this._runtime = arg_runtime
		this._initial_state = arg_state
		this._state_store = this._runtime.get_state_store()
		assert( T.isObject(this._state_store), context + ':constructor:bad state_store object')
		
		// SET STATE PATH
		this.state_path = undefined
		if ( arg_state && T.isFunction(arg_state.has) && T.isFunction(arg_state.get) && arg_state.has('state_path') )
		{
			this.state_path = arg_state.get('state_path').toArray()
		}

		this._state_value_listeners = []

		// console.info(context + ':constructor:creating component ' + this.get_name())
	}



	/**
	 * Get runtime instance.
	 * 
	 * @returns {RuntimeBase}
	 */
	get_runtime()
	{
		return this._runtime
	}
	
	
	
	/**
	 * Get initial state, an immutable object from a Redux data store.
	 * 
	 * @returns {Immutable.Map} - component state.
	 */
	get_initial_state()
	{
		return this._initial_state
	}
	
	
	
	/**
	 * Get current state, an immutable object from a Redux data store.
	 * 
	 * @returns {Immutable.Map} - component state.
	 */
	get_state()
	{
		const path = this.state_path
		
		// console.log(context + ':get_state', this._state_store.get_state().toJS())
		// console.log(context + ':state_path', this.state_path)
		// console.log(context + ':state', this._state_store.get_state().getIn(path))
		// console.log(context + ':state js', this._state_store.get_state().getIn(path).toJS())
		
		return this._state_store.get_state().getIn(path)
	}
	
	
	
	/**
	 * Get current state, an immutable object from a Redux data store.
	 * 
	 * @returns {object} - component state.
	 */
	get_state_js()
	{
		const state = this.get_state()
		return state && state.toJS ? state.toJS() : {}
	}
	
	
	
	/**
	 * Get state store.
	 * 
	 * @returns {object} - State store.
	 */
	get_state_store()
	{
		return this._state_store
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
			return value && T.isFunction(value.toJS) ? value.toJS() : value
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
	 * 
	 * @param {Immutable.Map} arg_previous_state - previous state map.
	 * @param {Immutable.Map} arg_new_state - new state map.
	 * 
	 * @returns {nothing}
	 */
	handle_state_change(arg_previous_state, arg_new_state)
	{
		if (! arg_previous_state)
		{
			return
		}
		
		if ( T.isArray(this._state_value_listeners) && this._state_value_listeners.length > 0 )
		{
			this._state_value_listeners.forEach(
				(handle)=>{
					const prev_value = arg_previous_state.getIn(handle.path)
					const new_value = arg_new_state.getIn(handle.path)

					// console.log(context + ':handle_state_change', prev_value, new_value)

					if ( ! Immutable.is(prev_value, new_value) )
					{
						handle.listener(handle.path, prev_value, new_value)
					}
				}
			)
		}
	}



	/**
	 * Register a state value change listener.
	 * 
	 * @param {string|array} arg_path - component state value path array or string with a dot separator.
	 * @param {string|function} arg_listener - state value change listener, function or method name.
	 * 
	 * @returns {nothing}
	 */
	register_state_value_change_handle(arg_path, arg_listener)
	{
		// CHECK PATH
		if ( T.isString(arg_path) )
		{
			arg_path = arg_path.split('.')
		}
		assert( T.isArray(arg_path), context + ':handle_state_path_change:bad path array')

		// CHECK LISTENER
		if ( T.isString(arg_listener) )
		{
			assert( arg_listener in (this), context + ':handle_state_path_change:listerner method string not found')
			arg_listener = this[arg_listener].bind(this)
		}
		assert( T.isFunction(arg_listener), context + ':handle_state_path_change:bad listener function')
		
		this._state_value_listeners.push( { path:arg_path, listener:arg_listener })
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
		
		// assert( T.isObject(this._state_store), context + ':dispatch_action:bad state_store object')
		this._state_store.dispatch_action(action)
	}
	
	
	
	/**
	 * Get name.
	 * 
	 * @returns {string} - instance name.
	 */
	get_name()
	{
		return this.get_state_value('name', undefined)
	}
}
