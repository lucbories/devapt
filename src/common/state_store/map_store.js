// NPM IMPORTS
import { Map, fromJS } from 'immutable'

// COMMON IMPORTS
import StateStore from './state_store'


let context = 'common/state_store/redux_store'



/**
 * @file Immutable.Map class to deal with state storing and mutations.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class MapStore extends StateStore
{
	/**
	 * Create a Immutable.Map state Store instance.
	 * @extends StateStore
	 * 
	 * @param {object} arg_initial_state - initial state.
	 * @param {string} arg_log_context - trace context.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_initial_state, arg_log_context, arg_logger_manager)
	{
		const my_context = arg_log_context ? arg_log_context : context
		super(my_context, arg_logger_manager)

		this.is_mutable = true
		this.use_immutable = true

		this.root = arg_initial_state ? fromJS(arg_initial_state).toMap() : new Map()
	}
	
	

	/**
	 * Get current state.
	 * 
	 * @returns {Immutable}
	 */
	get_state()
	{
		return this.root
	}
	
	

	/**
	 * Set/Replace current state.
	 * 
	 * @param {object} arg_state - new state.
	 * 
	 * @returns {Immutable}
	 */
	set_state(arg_state)
	{
		this.root = arg_state ? fromJS(arg_state).toMap() : new Map()
	}
	

	
	/**
	 * Dispatch a requested action to mutate current state.
	 * 
	 * @param {object} arg_action - action record: { type:'...', ... }.
	 * 
	 * @returns {nothing}
	 */
	dispatch(/*arg_action*/)
	{
		throw Error('Map store does not implement dispatch method')
	}
	

	
	/**
	 * Register a handle on state mutations.
	 * 
	 * @param {function} arg_handle - state changes handle as f(old_state, new_state).
	 * 
	 * @returns {function} - unsubscribe function
	 */
	subscribe(/*arg_handle*/)
	{
		throw Error('Map store does not implement subscribe method')
	}
}