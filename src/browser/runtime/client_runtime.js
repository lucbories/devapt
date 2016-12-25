// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'
import Bacon from 'baconjs'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import Credentials from '../../common/base/credentials'
import ReduxStore from '../../common/state_store/redux_store'
import RuntimeBase from '../../common/base/runtime_base'

// BROWSER IMPORTS
import ConsoleLogger from '../loggers/console_logger'
import StreamLogger from '../loggers/stream_logger'
import Service from './service'
import UI from './ui'
import Router from './router'


let context = 'browser/runtime/client_runtime'



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
	 * @extends RuntimeBase
	 * 
	 * 	API:
	 * 		->constructor()
	 * 		->load(arg_settings):nothing - Load runtime settings.
	 * 
	 * 		->register_service(arg_svc_name, arg_svc_settings):Promise(Service) - Register a remote service.
	 * 		->service(arg_name):Service - Get a service by its name.
	 * 
	 * 		->command(arg_name):object - Get a command by its name.
	 * 
	 * 		->ping():nothing - Emit a ping request through SocketIO.
	 * 
	 * 		->get_state_store():object - Get state store, a Redux data store.(INHERITED)
	 * 		->get_store_reducers():function - Get reducer pure function: (previous state, action) => new state.
	 * 		->handle_store_change():nothing - Handle Redux store changes.
	 * 		->create_store_observer(arg_component):unsubscribe function - Create a store change observer.
	 * 
	 * 		->router():Router - Get runtime router.
	 * 
	 * @returns {nothing}
	 */
	constructor()
	{
		super(context)

		// INIT LOGGING FEATURE ON BROWSER
		// const console_logger = new ConsoleLogger(true)
		// this.get_logger_manager().loggers.push(console_logger)
		
		const stream_logger = new StreamLogger(undefined, true)
		this.get_logger_manager().loggers.push(stream_logger)

		stream_logger.get_stream().subscribe(
			(arg_log)=>{
				// console.log(context + ':stream_logger:logs', arg_log)
				if (this._state_store)
				{
					const action = {
						type:'ADD_JSON_LOGS',
						logs:arg_log.logs
					}
					this._state_store.dispatch(action)
				}
			}
		)

		this.logs_stream = stream_logger.get_stream()
		
		this.is_browser_runtime = true
		
		this._services = {}
		this._services_promises = {}
		this._ui = undefined
		this._router = undefined
		this._commands = undefined
		
		this.info('Client Runtime is created')

		this.disable_trace()
		// this.update_trace_enabled()
	}



	/**
	 * 
	 */
	shoud_log_bindingd_stream()
	{
		return false
	}



	/**
	 * Get application initial state: from browser cache or from DOM script.
	 * 	State strategy is {
	 * 		source:'browser' or 'session' or 'html',
	 * 		save_period: 5000, milliseconds between two state saves, 0 to disable save
	 * 		state_key: '...' name of the store key which corresponding value contains the key name of the application state.
	 * 	}
	 * 
	 * @param {object} arg_app_state_strategy - strategy to manage application state.
	 * 
	 * @returns {object}
	 */
	get_app_initial_state(arg_app_state_strategy)
	{
		const browser_supports_storage = (typeof(Storage) !== "undefined")
		const source = ( T.isObject(arg_app_state_strategy) && browser_supports_storage) ? arg_app_state_strategy.source : 'html'
		const app_state_key = T.isObject(arg_app_state_strategy) && T.isString(arg_app_state_strategy.state_key) ? arg_app_state_strategy.state_key : '__DEVAPT_APP_STATE_KEY__'
		
		let state = undefined
		const window_state = window ? window.__INITIAL_STATE__ : {error:'no browser window object'}
		switch(source) {
			case 'browser':{
				const store_key = localStorage.getItem(app_state_key)
				if (! T.isString(store_key) )
				{
					state = window_state
					break
				}
				const state_str = localStorage.getItem(store_key)
				console.log('get_app_initial_state:state_str', typeof state_str)
				state = T.isString(state_str) ? JSON.parse(state_str) : window_state
				break
			}
			case 'session':{
				const store_key = sessionStorage.getItem(app_state_key)
				if (! T.isString(store_key) )
				{
					state = window_state
					break
				}
				const state_str = sessionStorage.getItem(store_key)
				console.log('get_app_initial_state:state_str', typeof state_str)
				state = T.isString(state_str)  ? JSON.parse(state_str) : window_state
				break
			}
			case 'html':{
				state = window_state
				break
			}
		}

		return state ? state : {error:'no app state found'}
	}
	


	/**
	 * Configure application state save: to browser local or session storage.
	 * 	State strategy is {
	 * 		source:'browser' or 'session' or 'html',
	 * 		save_period: 5000, milliseconds between two state saves, 0 to disable save
	 * 		state_key: '...' name of the store key which corresponding value contains the key name of the application state.
	 * 	}
	 * 
	 * @returns {nothing}
	 */
	init_app_state_save()
	{
		this.enter_group('init_app_state_save')
		
		// GET AND CHECK PERIOD
		let period = this.app_state_strategy.save_period
		if (period == 0 || ! T.isNumber(period) )
		{
			this.leave_group('init_app_state_save:disabled with not period > 0')
			return
		}
		if (period < 3000)
		{
			period = 3000
		}

		// CHECK STORAGE BROWSER SUPPORT
		const browser_supports_storage = (typeof(Storage) !== "undefined")
		if (! browser_supports_storage)
		{
			this.error('init_app_state_save:no storage support')
			this.leave_group('init_app_state_save:error')
			return
		}

		// CHECK STRATEGY
		if (! T.isObject(this.app_state_strategy) )
		{
			this.error('init_app_state_save:no state save strategy')
			this.leave_group('init_app_state_save:error')
			return
		}
		
		// GET ATTRIBUTES
		const source = this.app_state_strategy.source
		const app_state_key = T.isString(this.app_state_strategy.state_key) ? this.app_state_strategy.state_key : '__DEVAPT_APP_STATE_KEY__'
		
		const state = this._state_store.get_state()
		const state_app = T.isObject(state) && state.getIn ? state.getIn(['credentials', 'application'], undefined) : undefined
		const app = T.isString(state_app) ? state_app.toLocaleUpperCase() : 'NO_APP_NAME'
		const default_store_key = '__DEVAPT_APP_STATE_' + app + '__'

		// GET SAVE CALLBACK
		let save_cb = undefined
		switch(source) {
			case 'browser':{
				let store_key = localStorage.getItem(app_state_key)
				if (! T.isString(store_key) )
				{
					store_key = default_store_key
					localStorage.setItem(app_state_key, store_key)
				}
				save_cb = ()=>{
					const state_str = JSON.stringify(this._state_store.get_state().toJS())
					localStorage.setItem(store_key, state_str)
				}
				break
			}
			case 'session':{
				let store_key = sessionStorage.getItem(app_state_key)
				if (! T.isString(store_key) )
				{
					store_key = default_store_key
					sessionStorage.setItem(app_state_key, store_key)
				}
				save_cb = ()=>{
					const state_str = JSON.stringify(this._state_store.get_state().toJS())
					sessionStorage.setItem(store_key, state_str)
				}
				break
			}
		}

		// REGISTER PERIODICAL SAVES
		if (save_cb)
		{
			this.info('init_app_state_save:register saves with period=%s', period)
			setTimeout(save_cb, period)
		}

		this.leave_group('init_app_state_save')
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
		const initial_app_state = this.get_app_initial_state(arg_settings.app_state_strategy)
		this.debug(initial_app_state, 'initialState')
		this.app_state_strategy = arg_settings.app_state_strategy
		
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
		this._state_store = new ReduxStore(reducer, initial_app_state, context, this.logger_manager)
		this._state_store_unsubscribe = this._state_store.subscribe( self.handle_store_change.bind(self) )
		this._state_store.dispatch( {type:'store_created'} )
		
		// CREATE CREDENTIALS INSTANCE
		const credentials_settings = this._state_store.get_state().get('credentials', undefined)
		this.debug('credentials_settings', credentials_settings)

		const credentials_update_handler = (arg_credentials_map)=>{
			this._state_store.dispatch( {type:'SET_CREDENTIALS', credentials:arg_credentials_map } )
		}
		const credentials_datas = credentials_settings ? credentials_settings.toJS() : Credentials.get_empty_credentials()
		this.session_credentials = new Credentials(credentials_datas, credentials_update_handler)

		// CREATE UI WRAPPER
		this._ui = new UI(this, this._state_store)
		
		// CREATE NAVIGATION ROUTER
		this._router = new Router()

		// ADD COMMANDS ROUTE
		this._commands = this._state_store.get_state().get('commands', {}).toJS()
		Object.keys(this._commands).forEach(
			(cmd_name)=>{
				const cmd = this._commands[cmd_name]
				if ( T.isString(cmd.url) )
				{
					// MIDDLEWARE RENDERING
					const middleware = cmd.middleware
					if ( T.isString(middleware) )
					{
						this.debug('load:add route handler for cmd [' + cmd_name + '] with middleware:' + middleware)
						
						const app_url = this._state_store.get_state().get('app_url', undefined)
						const mw_route = T.isString(app_url) ? '/' + app_url + cmd.url : cmd.url
						this._router.add_handler(cmd.url, ()=>this._ui.render_with_middleware(cmd, mw_route, this.session_credentials) )
						return
					}

					// VIEW RENDERING
					if ( T.isString(cmd.view) )
					{
						this.debug('load:add route handler for cmd [' + cmd_name + '] with view:' + cmd.view)

						const route = cmd.url
						const menubar = T.isString(cmd.menubar) ? cmd.menubar : undefined
						this._router.add_handler(route, ()=>this._router.display_content(cmd.view, menubar) )
						return
					}
					
					this.error('load:no route handler for cmd [' + cmd_name + ']:unknow cmd bad view/middleware')
				}
			}
		)

		// ENABLE HASH HANDLING
		this._router.init()

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
		
		if (arg_svc_name in this._services_promises)
		{
			this.leave_group('register_service:svc promise found for ' + arg_svc_name)
			return this._services_promises[arg_svc_name]
		}

		this.debug('register_service:create svc promise:' + arg_svc_name)
		this._services_promises[arg_svc_name] = new Promise(
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
		return this._services_promises[arg_svc_name]
	}

	
	
	/**
	 * Register a remote service (end of process).
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
		

		// const app_credentials = this._state_store.get_state().get('credentials')
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
		if (this._services && (arg_svc_name in this._services) )
		{
			this.debug('register_service_self:SERVICE IS ALREADY REGISTERED for ' + arg_svc_name)

			const svc = this._services[arg_svc_name]
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
			self._services[arg_svc_name] = svc
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
				self.debug('register_service_self:SERVICE FROM SERVER SETTINGS:arg_svc_settings', arg_svc_settings)

				// GET APPLICATION CREDENTIALS
				// TODO CHECK CREDENTIAL FORMAT STRING -> MAP ?
				arg_svc_settings.credentials = app_credentials
				if ( T.isString(arg_svc_settings.credentials ) )
				{
					arg_svc_settings.credentials = JSON.parse(arg_svc_settings.credentials)
				}

				const svc = new Service(arg_svc_name, arg_svc_settings)
				self.debug('register_service_self:SERVICE FROM SERVER SETTINGS:svc', svc)

				self._services[arg_svc_name] = svc
				delete self._services_promises[arg_svc_name]

				self.debug('register_service:svc promise resolved:' + arg_svc_name)
				arg_resolve_cb(svc)
			}
		)

		get_settings_stream.onError(
			(error) => {
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
		return (arg_name in this._services) ? this._services[arg_name] : undefined
	}
	
	
	
	/**
	 * Get a command by its name.
	 * 
	 * @param {string} arg_name - command name.
	 * 
	 * @returns {object}
	 */
	command(arg_name)
	{
		// console.info('getting/creating service', arg_name)
		return (arg_name in this._commands) ? this._commands[arg_name] : undefined
	}
	

	
	/**
	 * Emit a ping request through SocketIO.
	 * 
	 * @returns {nothing}
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
			this.info('reducer 1:type=' + arg_action.type + ' for ' + arg_action.component)
			
			// ADD LOG RECORD
			if ( T.isString(arg_action.type) && arg_action.type == 'ADD_JSON_LOGS' && T.isArray(arg_action.logs) )
			{
				const path = ['logs', 'state', 'items']
				const logs = arg_previous_state.getIn(path, []).concat(arg_action.logs)
				return arg_previous_state.setIn(path, logs)
			}

			// ADD JSON RESOURCE SETTINGS
			if ( T.isString(arg_action.type) && arg_action.type == 'ADD_JSON_RESOURCE' && T.isString(arg_action.resource) && T.isObject(arg_action.json) )
			{
				this.debug('reducer:ADD_JSON_RESOURCE', arg_action.resource, arg_action.json)

				if ( T.isString(arg_action.collection) )
				{
					if ( T.isArray(arg_action.path) )
					{
						return arg_previous_state.setIn([arg_action.collection, arg_action.resource].concat(arg_action.path), fromJS(arg_action.json) )
					}

					return arg_previous_state.setIn([arg_action.collection, arg_action.resource], fromJS(arg_action.json) )
				}

				if ( T.isArray(arg_action.path) )
				{
					return arg_previous_state.setIn(arg_action.path, fromJS(arg_action.json) )
				}
			}

			// SET SESSION CREDENTIALS
			if ( T.isString(arg_action.type) && arg_action.type == 'SET_CREDENTIALS' && T.isObject(arg_action.credentials) )
			{
				this.debug('reducer:SET_CREDENTIALS', arg_action.credentials)
				return arg_previous_state.set('credentials', arg_action.credentials)
			}

			// DISPATCH TO COMPONENTS REDUCERS
			if ( T.isString(arg_action.component) )
			{
				// console.info(context + ':reducer 2:type=' + arg_action.type + ' for ' + arg_action.component)
				const component = this._ui.get(arg_action.component)
				
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
						
						let new_component_state = component.reduce_action(prev_component_state, arg_action)
						if (new_component_state != prev_component_state)
						{
							const prev_state_version = prev_component_state.get('state_version', 0)
							new_component_state = new_component_state.set('state_version', prev_state_version + 1)
						}

						// console.log(context + ':reducer 4:new_component_state', new_component_state.toJS())
						
						let state = this._state_store.get_state()
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
	 * 
	 * @returns {nothing}
	 */
	handle_store_change()
	{
		// let previous_state = this.current_state
		// this.current_state = this._state_store.get_state()
		
		/// TODO
		
		this.info('handle_store_change:global', this._state_store.get_state())
	}
	
	
	
	/**
	 * Create a store change observer.
	 * 
	 * @param {Component} arg_component - component instance.
	 * 
	 * @returns {function} - store unsubscribe function.
	 */
	create_store_observer(arg_component)
	{
		assert( T.isObject(arg_component) && arg_component.is_component, context + ':create_store_observer:bas component object')
		
		let current_state = undefined
		
		const handle_change = () => {
			let next_state = arg_component.get_state()
			// console.log(context + ':handle_change:arg_component', arg_component)
			// console.log(context + ':handle_change:next_state', next_state)

			if ( next_state && ! next_state.equals(current_state) )
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
		
		let unsubscribe = this._state_store.subscribe(handle_change)
		
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
