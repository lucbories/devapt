// NPM IMPORTS
import { createStore/*, combineReducers*/ } from 'redux'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import StateStore from './state_store'


let context = 'common/state_store/redux_store'



/**
 * @file Redux class to deal with state storing and mutations.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class ReduxStore extends StateStore
{
	/**
	 * Create a Redux state Store instance.
	 * @extends StateStore
	 * 
	 * @param {function} arg_reducer - state reducer.
	 * @param {object} arg_initial_state - initial state.
	 * @param {string} arg_log_context - trace context.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_reducer, arg_initial_state, arg_log_context, arg_logger_manager)
	{
		const my_context = arg_log_context ? arg_log_context : context
		super(my_context, arg_logger_manager)

		this.is_mutable = true
		this.use_immutable = true

		this.store = createStore(arg_reducer, fromJS(arg_initial_state) )
	}
	

	
	/**
	 * Get current state.
	 * 
	 * @returns {Immutable}
	 */
	get_state()
	{
		return this.store.getState()
	}
	

	
	/**
	 * Set/Replace current state.
	 * 
	 * @param {object} arg_state - new state.
	 * 
	 * @returns {Immutable}
	 */
	set_state(/*arg_state*/)
	{
		throw Error('Redux store does not permit to set a state directly')
	}
	
	

	/**
	 * Dispatch a requested action to mutate current state.
	 * 
	 * @param {object} arg_action - action record: { type:'...', ... }.
	 * 
	 * @returns {nothing}
	 */
	dispatch(arg_action)
	{
		console.log(context + ':dispatch:action', arg_action)
		this.store.dispatch(arg_action)
	}
	
	
	
	/**
	 * Register a handle on state mutations.
	 * 
	 * @param {function} arg_handle - state changes handle as f(old_state, new_state).
	 * 
	 * @returns {function} - unsubscribe function
	 */
	subscribe(arg_handle)
	{
		return this.store.subscribe(arg_handle)
	}
}