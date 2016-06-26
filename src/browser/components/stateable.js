
import T from 'typr'
import assert from 'assert'

import Bindable from './bindable'


const context = 'browser/components/staeable'




/**
 * @file UI stateable base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Stateable extends Bindable
{
	
	/**
	 * Creates an instance of Component.
	 * @extends Bindable
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(log_context)
		
		this.is_component = true
		
		this.runtime = arg_runtime
		this.initial_state = arg_state
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
		
		return this.runtime.get_state().getIn(path)
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
		// NOT YET IMPLEMENTED
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
			$.extend(action, arg_options)
		}
		
		if ( !('component' in action) )
		{
			action.component = this.get_name()
		}
		
		// console.info(context + ':dispatch_action:type=' + action.type + ' for ' + action.component, action)
		
		this.runtime.dispatch_action(action)
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
