// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import Bacon from 'baconjs'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import Credentials from '../common/base/credentials'
import ReduxStore from '../common/state_store/redux_store'
import RuntimeBase from '../common/base/runtime_base'
// import LoggerManager from '../common/loggers/logger_manager'

// BROWSER IMPORTS
import ConsoleLogger from './console_logger'
import StreamLogger from './stream_logger'
import Service from './service'
import UI from './ui'
import Router from './router'


let context = 'browser/runtime'



/**
 * @file client runtime class - main library interface.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class ClientRuntime extends RuntimeBase
{
	/**
	 * Create a client Runtime instance.
	 * @extends Loggable
	 * 
	 * @returns {nothing}
	 */
	constructor()
	{
		super(context)

		// INIT LOGGING FEATURE ON BROWSER
		const console_logger = new ConsoleLogger(true)
		this.get_logger_manager().loggers.push(console_logger)
		
		const stream_logger = new StreamLogger(undefined, true)
		this.get_logger_manager().loggers.push(stream_logger)
		
		
		this.is_browser_runtime = true
		
		this.services = {}
		this.services_promises = {}
		this.ui = undefined
		this._router = undefined
		
		this.info('Client Runtime is created')
	}
	
	
	
	/**
	 * Load runtime settings.
	 * 
	 * @param {object} arg_settings - runtime settings.
	 * 
	 * @returns {nothing}
	 */
	load(arg_settings)
	{
		this.separate_level_1()
		this.enter_group('load')

		// SET DEFAULT REMOTE LOGGING
		// const svc_logger_settings = ('default' in arg_settings) ? arg_settings['default'] : {}
		// this.loggers.push( new LoggerSvc(true, svc_logger_settings) )
		
		// GET INITIAL STATE
		const initial_state = window ? window.__INITIAL_STATE__ : {error:'no browser window object'}
		console.log(initial_state, 'initialState')
		
		// GET DEFAULT REDUCER
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
		
		// CREATE STATE STORE
		const reducer = this.get_store_reducers()
		const self = this
		this.state_store = new ReduxStore(reducer, initial_state, context, this.logger_manager)
		this.state_store_unsubscribe = this.state_store.subscribe( self.handle_store_change.bind(self) )
		this.state_store.dispatch( {type:'store_created'} )
		
		// CREATE CREDENTIALS INSTANCE
		const credentials_settings = this.state_store.get_state().get('credentials', undefined)
		// console.log('credentials_settings', credentials_settings)
		const credentials_update_handler = (arg_credentials_map)=>{
			this.state_store.dispatch( {type:'SET_CREDENTIALS', credentials:arg_credentials_map } )
		}
		const credentials_datas = credentials_settings ? credentials_settings.toJS() : Credentials.get_empty_credentials()
		this.session_credentials = new Credentials(credentials_datas, credentials_update_handler)

		// CREATE UI WRAPPER
		this.ui = new UI(this, this.state_store)
		
		// CREATE NAVIGATION ROUTER
		this._router = new Router()
		this._router.init()

		// ADD COMMANDS ROUTE
		const app_url = this.state_store.get_state().get('app_url', undefined)
		const commands = this.state_store.get_state().get('commands', {}).toJS()
		Object.keys(commands).forEach(
			(cmd_name)=>{
				const cmd = commands[cmd_name]
				if ( T.isString(cmd.url) )
				{
					const route = T.isString(app_url) ? '/' + app_url + cmd.url : cmd.url

					// VIEW RENDERING
					if ( T.isString(cmd.view) )
					{
						console.log(context + ':load:add route handler for cmd [' + cmd_name + '] with view:' + cmd.view)

						const menubar = T.isString(cmd.menubar) ? cmd.menubar : undefined
						this._router.add_handler(route, ()=>this._router.display_content(cmd.view, menubar) )
						return
					}
					
					// MIDDLEWARE RENDERING
					const middleware = cmd.middleware
					if ( T.isString(middleware) )
					{
						console.log(context + ':load:add route handler for cmd [' + cmd_name + '] with middleware:' + middleware)

						this._router.add_handler(route, ()=>this.ui.render_with_middleware(cmd, route, this.session_credentials) )
						return
					}

					console.error(context + ':load:no route handler for cmd [' + cmd_name + ']:unknow cmd bad view/middleware')
				}
			}
		)

		this.leave_group('load')
		this.separate_level_1()
	}
	
	
	
	/**
	 * Register a remote service.
	 * 
	 * @param {string} arg_svc_name - service name.
	 * @param {object} arg_svc_settings - service settings.
	 * 
	 * @returns {Promise} - Promise(Service)
	 */
	register_service(arg_svc_name, arg_svc_settings)
	{
		const self = this
		this.enter_group('register_service:' + arg_svc_name)
		
		if (arg_svc_name in this.services_promises)
		{
			console.log(this.services_promises[arg_svc_name], 'this.services_promises[arg_svc_name]')
			this.leave_group('register_service:svc promise found for ' + arg_svc_name)
			return this.services_promises[arg_svc_name]
		}

		this.debug('register_service:create svc promise:' + arg_svc_name)
		this.services_promises[arg_svc_name] = new Promise(
			function(resolve, reject)
			{
				self.register_service_self(resolve, reject, arg_svc_name, arg_svc_settings)
			}
		)
		.then(
			(service)=>{
				this.leave_group('register_service:svc promise created for ' + arg_svc_name)
				return service
			}
		)
		
		this.info('Client Service is created (async):' + arg_svc_name)
	
		this.leave_group('register_service:async')
		return this.services_promises[arg_svc_name]
	}

	
	
	/**
	 * Register a remote service.
	 * 
	 * @param {string} arg_svc_name - service name.
	 * @param {object} arg_svc_settings - service settings.
	 * @param {Function} arg_resolve_cb - function to call when promise is resolved.
	 * @param {Function} arg_reject_cb - function to call when promise is rejected.
	 * 
	 * @returns {nothing}
	 */
	register_service_self(arg_resolve_cb, arg_reject_cb, arg_svc_name, arg_svc_settings)
	{
		const self = this

		// this.enter_group('register_service_self')
		

		// const app_credentials = this.state_store.get_state().get('credentials')
		const app_credentials = this.session_credentials.get_credentials()
		const request_svc_settings = 'request_settings'
		const reply_svc_settings = 'reply_settings'

		// CHECK SERVICE NAME
		if ( ! T.isString(arg_svc_name) )
		{
			this.error('register_service:svc promise rejected:' + arg_svc_name)
			arg_reject_cb(context + ':register_service:bad service name string [' + arg_svc_name + ']')
			return
		}

		// TEST IF SERVICE IS ALREADY REGISTERED
		if (this.services && (arg_svc_name in this.services) )
		{
			this.debug('register_service_self:SERVICE IS ALREADY REGISTERED for ' + arg_svc_name)

			const svc = this.services[arg_svc_name]
			// console.log(context + ':register_service_self:SERVICE IS ALREADY REGISTERED:svc', svc)
			this.debug('register_service:svc promise resolved:' + arg_svc_name)
			arg_resolve_cb(svc)
			// this.leave_group('register_service_self')
			return
		}

		// GET SERVICE SETTINGS FROM GIVEN SETTINGS
		if ( T.isObject(arg_svc_settings) )
		{
			this.debug('register_service_self:SERVICE FROM GIVEN SETTINGS for ' + arg_svc_name)
			// console.log(context + ':register_service_self:SERVICE FROM GIVEN SETTINGS:arg_svc_settings', arg_svc_settings)

			// GET APPLICATION CREDENTIALS
			// TODO CHECK CREDENTIAL FORMAT STRING -> MAP ?
			arg_svc_settings.credentials = app_credentials
			// console.log(context + ':register_service_self:credentials', arg_svc_settings.credentials = app_credentials)
			assert( T.isObject(arg_svc_settings), context + ':register_service:bad service settings object')
			
			if ( T.isString(arg_svc_settings.credentials ) )
			{
				arg_svc_settings.credentials = JSON.parse(arg_svc_settings.credentials)
			}
			const svc = new Service(arg_svc_name, arg_svc_settings)
			// console.log(context + ':register_service_self:SERVICE FROM GIVEN SETTINGS:svc', svc)
			self.services[arg_svc_name] = svc
			this.debug('register_service:svc promise resolved:' + arg_svc_name)
			arg_resolve_cb(svc)

			// this.leave_group('register_service_self')
			return
		}

		// GET SERVICE SETTINGS FROM SERVER SETTINGS: PROCESS RESPONSE
		
		const svc_path = '/' + arg_svc_name
		const svc_socket = io(svc_path)
		const get_settings_stream = Bacon.fromEvent(svc_socket, reply_svc_settings)
		
		this.debug('register_service_self:SERVICE FROM SERVER SETTINGS for ' + arg_svc_name)
		get_settings_stream.onValue(
			(response) => {
				// console.log(context + ':register_service_self:SERVICE FROM SERVER SETTINGS:response', response)
				arg_svc_settings = response.settings
				assert( T.isObject(arg_svc_settings), context + ':register_service:bad service settings object')
				console.log(context + ':register_service_self:SERVICE FROM SERVER SETTINGS:arg_svc_settings', arg_svc_settings)

				// GET APPLICATION CREDENTIALS
				// TODO CHECK CREDENTIAL FORMAT STRING -> MAP ?
				arg_svc_settings.credentials = app_credentials
				if ( T.isString(arg_svc_settings.credentials ) )
				{
					arg_svc_settings.credentials = JSON.parse(arg_svc_settings.credentials)
				}

				const svc = new Service(arg_svc_name, arg_svc_settings)
				console.log(context + ':register_service_self:SERVICE FROM SERVER SETTINGS:svc', svc)

				self.services[arg_svc_name] = svc
				delete self.services_promises[arg_svc_name]

				self.debug('register_service:svc promise resolved:' + arg_svc_name)
				arg_resolve_cb(svc)
			}
		)

		get_settings_stream.onError(
			(error) => {
				console.error(context + ':register_service:error:' + error)
				self.error('register_service:svc promise rejected:' + arg_svc_name + ' with error:' + error)
				arg_reject_cb(context + ':register_service:request error for  [' + arg_svc_name + '] error=' + error)
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
		this.debug('register_service_self:emit with path=' + request_svc_settings + ' and payload', payload.request.operation, payload.credentials)
		svc_socket.emit(request_svc_settings, payload)


		// this.leave_group('register_service_self')
	}
	
	
	
	/**
	 * Get a service by its name.
	 * 
	 * @param {string} arg_name - service name.
	 * 
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
	 * Get store reducers.
	 * 
	 * @returns {function} - reducer pure function: (previous state, action) => new state
	 */
	get_store_reducers()
	{
		return (arg_previous_state, arg_action) => {
			console.info(context + ':reducer 1:type=' + arg_action.type + ' for ' + arg_action.component)
			
			// ADD JSON RESOURCE SETTINGS
			if ( T.isString(arg_action.type) && arg_action.type == 'ADD_JSON_RESOURCE' && T.isString(arg_action.resource) && T.isObject(arg_action.json) )
			{
				console.log(context + ':reducer:ADD_JSON_RESOURCE', arg_action.resource, arg_action.json)
				return arg_previous_state.setIn(['children', arg_action.resource], fromJS(arg_action.json) )
			}

			// SET SESSION CREDENTIALS
			if ( T.isString(arg_action.type) && arg_action.type == 'SET_CREDENTIALS' && T.isObject(arg_action.credentials) )
			{
				console.log(context + ':reducer:SET_CREDENTIALS', arg_action.credentials)
				return arg_previous_state.set('credentials', arg_action.credentials)
			}

			// DISPATCH TO COMPONENTS REDUCERS
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
						
						let state = this.state_store.get_state()
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
		// this.current_state = this.state_store.get_state()
		
		/// TODO
		
		console.info(context + ':handle_store_change:global', this.state_store.get_state())
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
		
		let unsubscribe = this.state_store.subscribe(handle_change)
		
		handle_change()
		
		return unsubscribe
	}



	/**
	 * Get runtime router.
	 * 
	 * @returns {Router}
	 */
	router()
	{
		assert( T.isObject(this._router), context + ':router:bad router object')
		return this._router
	}
}
