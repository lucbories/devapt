import T from 'typr'
import assert from 'assert'
import { fromJS } from 'immutable'
import os from 'os'

import * as exec from '../runtime/index'
import {SOURCE_LOCAL_FILE} from '../datas/providers/json_provider'

import Context from './context'
import Transaction from './transaction'
import Collection from './collection'
import Security from './security'
import Settingsable from './settingsable'
import RegisteredService from './registered_service'
import LoggerManager from '../loggers/logger_manager'


let context = 'common/base/runtime'



/**
 * DEFAULT RUNTIME SETTINGS
 */
const default_settings = {
	'is_master':false,
	
	'master':{
		'name': null,
		'host':'localhost',
		'port':5000
	},
	
	'node':{
		'name': null/*,
		'host':"localhost",
		'port':5001*/
	},
	
	'settings_provider': {
		'source':SOURCE_LOCAL_FILE,
		'relative_path':'apps/world.json'
	}
}



/**
 * @file Runtime class - main library interface.
 * @author Luc BORIES
 * @license Apache-2.0
 */
class Runtime extends Settingsable
{
	/**
	 * Create a Runtime instance.
	 * @extends Settingsable
	 * @returns {nothing}
	 */
	constructor()
	{
		const settings = fromJS( default_settings )
		const loggers_settings = undefined
		settings.logger_manager = new LoggerManager(loggers_settings)
		super(settings, context)
		
		// this.$settings = fromJS( default_settings )
		
		this.is_runtime = true
		this.is_master = this.get_setting('is_master', false)
		
		this.uid = os.hostname() + '_' + process.pid
		
		this.node = null
		
		this.context = new Context(this)
		
		this.nodes = new Collection()
		this.servers = new Collection()
		this.services = new Collection()
		this.registered_services = new Collection()
		this.socketio_servers = {}
		
		this.modules = new Collection()
		this.plugins = new Collection()
		this.resources = new Collection()
		
		this.transactions = new Collection()
		this.applications = new Collection()
		
		this.security_mgr = new Security(context, { 'logger_manager':this.logger_manager } )
		
		// this.logger_manager = new LoggerManager()
		
		this.info('Runtime is created')
	}
	
	
	
	/**
	 * Get runtime unique identifier.
	 * 
	 * @returns {string}
	 */
	get_uid()
	{
		return this.uid
	}
	
	
	
	/**
	 * Load runtime settings.
	 * @param {object} arg_settings - runtime settings
	 * @returns {object} promise
	 */
	load(arg_settings)
	{
		this.separate_level_1()
		this.enter_group('load')
		
		const runtime_settings = Object.assign(default_settings, arg_settings)
		
		runtime_settings.logger_manager = this.logger_manager
		this.$settings = fromJS(runtime_settings)
		// console.log(this.$settings, 'runtime.$settings')
		
		this.is_master = this.get_setting('is_master', false)
		
		const stage0 = new exec.RuntimeStage0Executable(this.logger_manager)
		const stage1 = new exec.RuntimeStage1Executable(this.logger_manager)
		const stage2 = new exec.RuntimeStage2Executable(this.logger_manager)
		const stage3 = new exec.RuntimeStage3Executable(this.logger_manager)
		const stage4 = new exec.RuntimeStage4Executable(this.logger_manager)
		const stage5 = new exec.RuntimeStage5Executable(this.logger_manager)
		const execs = [stage0, stage1, stage2, stage3, stage4, stage5]
		const tx = new Transaction('runtime', 'startup', 'loading', { logger_manager:this.logger_manager }, execs, Transaction.SEQUENCE)
		tx.prepare({runtime:this})
		const tx_promise = tx.execute(null)
		
		this.leave_group('load')
		this.separate_level_1()
		return tx_promise
	}
	
	
	/**
	 * Register a running service.
	 * @param {string} arg_node_name - node name
	 * @param {string} arg_svc_name - service name
	 * @param {string} arg_server_name - server name
	 * @param {string} arg_server_host - server host name
	 * @param {string|number} arg_server_port - server host port
	 * @returns {nothing}
	 */
	register_service(arg_node_name, arg_svc_name, arg_server_name, arg_server_host, arg_server_port)
	{
		this.enter_group('register_service')
		
		assert( T.isString(arg_node_name), context + ':register_service:bad node name string')
		assert( T.isString(arg_svc_name), context + ':register_service:bad service name string')
		
		const cfg = {
			'node_name':arg_node_name,
			'service_name':arg_svc_name,
			'server_name':arg_server_name,
			'server_host':arg_server_host,
			'server_port':arg_server_port
		}
		const svc = new RegisteredService(cfg)
		this.register_services.add(svc)
		
		this.leave_group('register_service')
	}
	
	
	/**
	 * Get a node by its name.
	 * @param {string} arg_name - node name
	 * @returns {Node}
	 */
	node(arg_name)
	{
		return this.nodes.item(arg_name)
	}
	
	
	/**
	 * Get a server by its name.
	 * @param {string} arg_name - server name
	 * @returns {Server}
	 */
	server(arg_name)
	{
		return this.servers.item(arg_name)
	}
	
	
	/**
	 * Get a service by its name.
	 * @param {string} arg_name - service name
	 * @returns {Service}
	 */
	service(arg_name)
	{
		return this.services.item(arg_name)
	}
	
	
	/**
	 * Get a registered service by its name.
	 * @param {string} arg_name - registered service name
	 * @returns {Service}
	 */
	registered_service(arg_name)
	{
		return this.registered_services.item(arg_name)
	}
	
	
	/**
	 * Get a module by its name.
	 * @param {string} arg_name - module name
	 * @returns {Module}
	 */
	module(arg_name)
	{
		return this.modules.item(arg_name)
	}
	
	
	/**
	 * Get a plugin by its name.
	 * @param {string} arg_name - plugin name
	 * @returns {Plugin}
	 */
	plugin(arg_name)
	{
		return this.plugins.item(arg_name)
	}
	
	
	/**
	 * Get a resource by its name.
	 * @param {string} arg_name - resource name
	 * @returns {Resource}
	 */
	resource(arg_name)
	{
		return this.resources.item(arg_name)
	}
	
	
	/**
	 * Get a transaction by its name.
	 * @param {string} arg_name - transaction name
	 * @returns {Transaction}
	 */
	transaction(arg_name)
	{
		return this.transactions.item(arg_name)
	}
	
	
	/**
	 * Get a application by its name.
	 * @param {string} arg_name - application name
	 * @returns {Application}
	 */
	application(arg_name)
	{
		return this.applications.item(arg_name)
	}
	
	
	/**
	 * Get security object.
	 * @returns {Security}
	 */
	security()
	{
		assert( T.isObject(this.security_mgr) && this.security_mgr.is_security, context + ':bad security object')
		return this.security_mgr
	}
	
	
	/**
	 * Get plugins factory object.
	 * @returns {PluginsFactory}
	 */
	get_plugins_factory()
	{
		assert( T.isObject(this.plugins_factory) && this.plugins_factory.is_plugins_factory, context + ':bad plugins factory object')
		return this.plugins_factory
	}
	
	
	
	/**
	 * Register and configure a socketio server.
	 * @param {string} arg_server_name - bound server name
	 * @param {object} arg_socketio - socketio server
	 * @returns {nothing}
	 */
	add_socketio(arg_server_name, arg_socketio)
	{
		const self = this
		assert( T.isString(arg_server_name), context + ':add_socketio:bad server name')
		assert( T.isObject(arg_socketio) && arg_socketio.emit && arg_socketio.on, context + ':add_socketio:bad socketio server')
		
		self.socketio_servers[arg_server_name] = arg_socketio
		
		arg_socketio.on('connection',
			function (socket)
			{
				console.info(context + ':add_socketio:new connection on /')
				
				// ROOT
				socket.on('disconnect',
					function()
					{
						self.on_socketio_disconnect()
					}
				)
				
				self.on_socketio_connect(arg_socketio, socket)
			}
		)
	}
	
	
	/**
	 * On socketio server connect event.
	 * @param {object} arg_socketio - socketio server.
	 * @param {object} arg_socket - client socket.
	 * @returns {nothing}
	 */
	on_socketio_connect(arg_socketio, arg_socket)
	{
		// const self = this
		console.info(context + ':on_socketio_connect:socket connected')
		
		arg_socket.emit('welcome on /', { from: 'server runtime' })
		
		// ON PING
		arg_socket.on('ping',
			function(data)
			{
				console.info(context + ':on_socketio_connect:socket receives ping', data)
				arg_socket.emit('pong', { from: 'server runtime' })
			}
		)
	}
	
	
	/**
	 * On socketio server disconnect event.
	 * @returns {nothing}
	 */
	on_socketio_disconnect()
	{
		console.info(context + ':on_socketio_disconnect:socket disconnected')
	}
}


let runtime_singleton = new Runtime()

export default runtime_singleton
