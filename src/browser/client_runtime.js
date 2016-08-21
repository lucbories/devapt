import T from 'typr'
import assert from 'assert'
import { createStore/*, combineReducers*/ } from 'redux'
import { fromJS } from 'immutable'
import Bacon from 'baconjs'

import Loggable from '../common/base/loggable'
import LoggerManager from '../common/loggers/logger_manager'

import ConsoleLogger from './console_logger'
import StreamLogger from './stream_logger'
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
		// INIT LOGGING FEATURE ON BROWSER
		const loggers_settings = undefined
		const logger_manager = new LoggerManager(loggers_settings)
		
		const console_logger = new ConsoleLogger(true)
		logger_manager.loggers.push(console_logger)
		
		const stream_logger = new StreamLogger(undefined, true)
		logger_manager.loggers.push(stream_logger)
		
		
		super(context, logger_manager)
		
		this.is_browser_runtime = true
		
		this.services = {}
		this.services_promises = {}
		this.store = undefined
		this.ui = undefined
		this.current_state = undefined
		
		if ( ! this.is_runtime )
		{
			this.update_trace_enabled()
		}
		
		this.info('Client Runtime is created')
	}
	
	
	
	/**
	 * Get runtime logger manager.
	 * 
	 * @returns {LoggerManager}
	 */
	get_logger_manager()
	{
		return this.logger_manager
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
		// const svc_logger_settings = ('default' in arg_settings) ? arg_settings['default'] : {}
		// this.loggers.push( new LoggerSvc(true, svc_logger_settings) )
		
		const initial_state = window ? window.__INITIAL_STATE__ : {error:'no browser window object'}
		// console.log(initial_state, 'initialState')
		
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
	 * @param {object} arg_svc_settings - service settings
	 * @returns {Promise}
	 */
	register_service(arg_svc_name, arg_svc_settings)
	{
		const self = this
		// this.enter_group('register_service')
		
		if (arg_svc_name in this.services_promises)
		{
			return this.services_promises[arg_svc_name]
		}

		this.services_promises[arg_svc_name] = new Promise(
			function(resolve, reject)
			{
				self.register_service_self(resolve, reject, arg_svc_name, arg_svc_settings)
			}
		)
		
		this.info('Client Service is created (async):' + arg_svc_name)
	
		// this.leave_group('register_service')
		return this.services_promises[arg_svc_name]
	}

	
	
	/**
	 * Register a remote service.
	 * @param {string} arg_svc_name - service name
	 * @param {object} arg_svc_settings - service settings
	 * @param {Function} arg_resolve_cb - function to call when promise is resolved
	 * @param {Function} arg_reject_cb - function to call when promise is rejected
	 * @returns {nothing}
	 */
	register_service_self(arg_resolve_cb, arg_reject_cb, arg_svc_name, arg_svc_settings)
	{
		const self = this

		// this.enter_group('register_service_self')
		

		const app_credentials = this.store.getState().get('credentials')
		const request_svc_settings = 'request_settings'
		const reply_svc_settings = 'reply_settings'

		// CHECK SERVICE NAME
		if ( ! T.isString(arg_svc_name) )
		{
			arg_reject_cb(context + ':register_service:bad service name string [' + arg_svc_name + ']')
			return
		}

		// TEST IF SERVICE IS ALREADY REGISTERED
		if (this.services && (arg_svc_name in this.services) )
		{
			const svc = this.services[arg_svc_name]
			// console.log(context + ':register_service_self:SERVICE IS ALREADY REGISTERED:svc', svc)
			arg_resolve_cb(svc)
			// this.leave_group('register_service_self')
			return
		}

		// GET SERVICE SETTINGS FROM GIVEN SETTINGS
		if ( T.isObject(arg_svc_settings) )
		{
			// console.log(context + ':register_service_self:SERVICE FROM GIVEN SETTINGS:arg_svc_settings', arg_svc_settings)

			// GET APPLICATION CREDENTIALS
			// TODO CHECK CREDENTIAL FORMAT STRING -> MAP ?
			arg_svc_settings.credentials = app_credentials
			assert( T.isObject(arg_svc_settings), context + ':register_service:bad service settings object')
			
			if ( T.isString(arg_svc_settings.credentials ) )
			{
				arg_svc_settings.credentials = JSON.parse(arg_svc_settings.credentials)
			}
			const svc = new Service(arg_svc_name, arg_svc_settings)
			// console.log(context + ':register_service_self:SERVICE FROM GIVEN SETTINGS:svc', svc)
			self.services[arg_svc_name] = svc
			arg_resolve_cb(svc)

			// this.leave_group('register_service_self')
			return
		}

		// GET SERVICE SETTINGS FROM SERVER SETTINGS: PROCESS RESPONSE
		
		const svc_path = '/' + arg_svc_name
		const svc_socket = io(svc_path)
		const get_settings_stream = Bacon.fromEvent(svc_socket, reply_svc_settings)
		
		get_settings_stream.onValue(
			(response) => {
				// console.log(context + ':register_service_self:SERVICE FROM SERVER SETTINGS:response', response)
				arg_svc_settings = response.settings
				assert( T.isObject(arg_svc_settings), context + ':register_service:bad service settings object')
				
				// GET APPLICATION CREDENTIALS
				// TODO CHECK CREDENTIAL FORMAT STRING -> MAP ?
				arg_svc_settings.credentials = app_credentials
				if ( T.isString(arg_svc_settings.credentials ) )
				{
					arg_svc_settings.credentials = JSON.parse(arg_svc_settings.credentials)
				}

				const svc = new Service(arg_svc_name, arg_svc_settings)
				// console.log(context + ':register_service_self:SERVICE FROM SERVER SETTINGS:svc', svc)

				self.services[arg_svc_name] = svc
				delete this.services_promises[arg_svc_name]

				arg_resolve_cb(svc)
			}
		)

		get_settings_stream.onError(
			(error) => {
				console.error(context + ':register_service:error:' + error)
			}
		)

		// GET SERVICE SETTINGS FROM SERVER SETTINGS: REQUEST SETTINGS
		const payload = {
			request: {
				operation:request_svc_settings,
				operands:[]
			},
			credentials:app_credentials
		}
		svc_socket.emit(request_svc_settings, payload)


		// this.leave_group('register_service_self')
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
