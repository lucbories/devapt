import T from 'typr'
import assert from 'assert'
// import { fromJS } from 'immutable'
import { createStore/*, combineReducers*/ } from 'redux'
import { fromJS } from 'immutable'

import Loggable from '../common/base/loggable'
import LoggerManager from '../common/loggers/logger_manager'
import LoggerSvc from './logger_svc'
import Service from './service'
import UI from './ui'


let context = 'browser/runtime'



/**
 * @file client runtime class - main library interface.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ClientRuntime extends Loggable
{
	/**
	 * Create a client Runtime instance.
	 * @returns {nothing}
	 */
	constructor()
	{
		// const settings = fromJS( default_settings )
		const loggers_settings = undefined
		const logger_manager = new LoggerManager(loggers_settings)
		
		super(context, logger_manager)
		
		this.is_browser_runtime = true
		
		this.services = {}
		this.store = undefined
		this.loggers = []
		this.ui = undefined
		this.current_state = undefined
		
		this.info('Client Runtime is created')
	}
	
	
	
	/**
	 * Load runtime settings.
	 * @param {object} arg_settings - runtime settings
	 * @returns {object} promise
	 */
	load(arg_settings)
	{
		// this.separate_level_1()
		// this.enter_group('load')
		
		
		// SET DEFAULT REMOTE LOGGING
		const svc_logger_settings = ('default' in arg_settings) ? arg_settings['default'] : {}
		this.loggers.push( new LoggerSvc(true, svc_logger_settings) )
		
		const initial_state = window ? window.__INITIAL_STATE__ : {error:'no browser window object'}
		// console.log(initialState, 'initialState')
		
		if ( T.isFunction(arg_settings.reducers) )
		{
			this.default_reducer = arg_settings.reducers
		}
		else
		{
			this.default_reducer = (arg_previous_state/*, arg_action*/) => {
				return arg_previous_state
			}
		}
		
		const reducer = this.get_store_reducers()
		const self = this
		this.store = createStore(reducer, fromJS(initial_state) )
		this.store_unsubscribe = this.store.subscribe( self.handle_store_change.bind(self) )
		this.store.dispatch( {type:'store_created'} )
		
		this.ui = new UI(this, this.store)
		
		// this.leave_group('load')
		// this.separate_level_1()
	}
	
	
	
	/**
	 * Register a remote service.
	 * @param {string} arg_svc_name - service name
	 * @param {object} arg_svc_settings - service settiings
	 * @returns {nothing}
	 */
	register_service(arg_svc_name, arg_svc_settings)
	{
		// this.enter_group('register_service')
		
		
		assert( T.isString(arg_svc_name), context + ':register_service:bad service name string')
		assert( T.isObject(arg_svc_settings), context + ':register_service:bad service settings object')
		
		if (arg_svc_name in this.services)
		{
			return
		}
		
		const svc = new Service(arg_svc_name, arg_svc_settings)
		this.services[arg_svc_name] = svc
		
		this.info('Client Service is created:' + arg_svc_name)
		
		// this.leave_group('register_service')
	}
	
	
	
	/**
	 * Get a service by its name.
	 * @param {string} arg_name - service name
	 * @returns {Service}
	 */
	service(arg_name)
	{
		// console.info('getting/creating service', arg_name)
		return (arg_name in this.services) ? this.services[arg_name] : undefined
	}
	
	
	/**
	 * Emit a ping request through SocketIO
	 */
	ping()
	{
		const socketio = io()
		socketio.emit('ping')
	}
	
	
	
	/**
	 * Get current state, an immutable object from a Redux data store.
	 * @returns {object} - store state.
	 */
	get_state()
	{
		// TODO USE REDUX STORE
		return this.store.getState()
	}
	
	
	
	/**
	 * Dispatch a state action.
	 * 
	 * @param {object} arg_action - action object with a 'type' attribute.
	 * @returns {nothing}
	 */
	dispatch_action(arg_action)
	{
		assert( T.isObject(arg_action) && T.isString(arg_action.type), context + ':dispatch_action:bad action object')
		this.store.dispatch(arg_action)		
	}
	
	
	
	/**
	 * Get store reducers.
	 * 
	 * @returns {function} - reducer pure function: (previous state, action) => new state
	 */
	get_store_reducers()
	{
		return (arg_previous_state, arg_action) => {
			// console.info(context + ':reducer 1:type=' + arg_action.type + ' for ' + arg_action.component)
			
			if ( T.isString(arg_action.component) )
			{
				// console.info(context + ':reducer 2:type=' + arg_action.type + ' for ' + arg_action.component)
				const component = this.ui.get(arg_action.component)
				
				if ( T.isObject(component) && component.is_component )
				{
					// console.info(context + ':reducer 3:type=' + arg_action.type + ' for ' + arg_action.component, component)
					
					if ( T.isFunction(component.reduce_action) )
					{
						// console.info(context + ':reducer 4:type=' + arg_action.type + ' for ' + arg_action.component)
						
						// console.log(context + ':reducer 4:path', component.get_state_path())
						// console.log(context + ':reducer 4:arg_previous_state', arg_previous_state.toJS())
						
						const prev_component_state = arg_previous_state.getIn(component.get_state_path())
						
						// console.log(context + ':reducer 4:prev_component_state', prev_component_state.toJS())
						
						const new_component_state = component.reduce_action(prev_component_state, arg_action)
						
						// console.log(context + ':reducer 4:new_component_state', new_component_state.toJS())
						
						let state = this.store.getState()
						state = state.setIn(component.get_state_path(), new_component_state)
						// console.log(context + ':reducer 4:state', state.toJS())
						
						return state
					}
				}
			}
			return this.default_reducer(arg_previous_state, arg_action)
		}
	}
	
	
	
	/**
	 * Handle Redux store changes.
	 * @returns {nothing}
	 */
	handle_store_change()
	{
		// let previous_state = this.current_state
		// this.current_state = this.store.getState()
		
		/// TODO
		
		// console.info(context + ':handle_store_change:global')
	}
	
	
	
	/**
	 * Create a store change observer.
	 * 
	 * @param {Component} arg_component - component instance.
	 * @returns {function} - store unsubscribe function.
	 */
	create_store_observer(arg_component)
	{
		assert( T.isObject(arg_component) && arg_component.is_component, context + ':create_store_observer:bas component object')
		
		let current_state = undefined
		
		const handle_change = () => {
			let next_state = arg_component.get_state()
			
			if ( ! next_state.equals(current_state) )
			{
				// console.info(context + ':create_store_observer:state changes for ' + arg_component.get_name())
				
				arg_component.handle_state_change(current_state, next_state)
				current_state = next_state
			}
			// else
			// {
			// 	console.info(context + ':create_store_observer:no state change for ' + arg_component.get_name())
			// }
		}
		
		let unsubscribe = this.store.subscribe(handle_change)
		
		handle_change()
		
		return unsubscribe
	}
}
