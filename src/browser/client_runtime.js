import T from 'typr'
import assert from 'assert'
// import { fromJS } from 'immutable'
import {createStore} from 'redux'

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
		
		const initialState = window ? window.__INITIAL_STATE__ : {error:'no browser window object'}
		// console.log(initialState, 'initialState')
		
		if (arg_settings.reducers)
		{
			this.store = createStore(arg_settings.reducers, initialState)
			this.store.dispatch( {type:'act1', text:'mmm'} )
		}
		
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
	
	ui(arg_state)
	{
		return new UI(this, arg_state)
	}
}

