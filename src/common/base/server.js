
import T from 'typr'
import assert from 'assert'

import { config } from '../store/index'

import Collection from './collection'
import BusClientInstance from './bus_client_instance'

import AuthenticationWrapper from '../security/authentication_wrapper'
// import AuthorizationWrapper from '../security/authorization_wrapper'



const context = 'common/base/server'

export const ServerTypes = {
	SERVER_TYPE_EXPRESS : 'express',
	SERVER_TYPE_RESTIFY : 'restify',
	SERVER_TYPE_CLUSTER : 'cluster'
}


/**
 * @file Server base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Server extends BusClientInstance
{
	/**
	 * Create a server instance.
	 * @extends BusClientInstance
	 * @param {string} arg_name - plugin name
	 * @param {object} arg_settings - plugin settings map
	 * @param {string} arg_log_context - trace context string.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		super('servers', 'Server', arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_server = true
		this.is_build = false
		
		this.server_host = null
		this.server_port = null
		this.server_protocole = null
		this.server_type = null
		
		this.services_without_security = new Collection()
		this.services_with_security = new Collection()
		
		this.authentication = new AuthenticationWrapper(arg_log_context ? arg_log_context : context)
		// this.authorization = new AuthorizationWrapper(arg_log_context ? arg_log_context : context)
	}
	
	
	/**
	 * Load server settings.
	 * @returns {nothing}
	 */
	load()
	{
		this.enter_group('load')
		
		assert( T.isObject(this.$settings), context + ':bad settings object')
		
		const cfg = config()
		
		// SET SERVER HOST
		this.server_host = this.$settings.has('host') ? this.$settings.get('host') : null
		if ( ! this.server_host && cfg.hasIn(['servers', 'default', 'host']) )
		{
			this.server_host = cfg.getIn(['servers', 'default', 'host'])
		}
		assert( T.isString(this.server_host), context + ':bad server host string')
		
		// SET SERVER PORT
		this.server_port = this.$settings.has('port') ? this.$settings.get('port') : null
		if ( ! this.server_port && cfg.hasIn(['servers', 'default', 'port']) )
		{
			this.server_port = cfg.getIn(['servers', 'default', 'port'])
		}
		assert( T.isNumber(this.server_port), context + ':bad server port string')
		
		// SET SERVER PROTOCOLE
		this.server_protocole = this.$settings.has('protocole') ? this.$settings.get('protocole') : null
		if ( ! this.server_protocole && cfg.hasIn(['servers', 'default', 'protocole']) )
		{
			this.server_protocole = cfg.getIn(['servers', 'default', 'protocole'])
		}
		assert( T.isString(this.server_protocole), context + ':bad server protocole string')
		
		// SET SERVER TYPE
		this.server_type = this.$settings.has('type') ? this.$settings.get('type') : null
		if ( ! this.server_type && cfg.hasIn(['servers', 'default', 'type']) )
		{
			this.server_type = cfg.getIn(['servers', 'default', 'type'])
		}
		assert( T.isString(this.server_type), context + ':bad server type string')
		
		// AUTHENTICATION
		if ( cfg.hasIn(['security', 'authentication']) )
		{
			const auth_cfg = cfg.getIn(['security', 'authentication'])
			this.authentication.load(auth_cfg)
		}
		
		// AUTHORIZATION
		// if ( cfg.hasIn(['security', 'authorization']) )
		// {
		// 	const auth_cfg = cfg.getIn(['security', 'authorization'])
		// 	this.authorization.load(auth_cfg)
		// }
		
		// BUILD SERVER
		assert( T.isFunction(this.build_server), context + ':bad build_server function')
		this.build_server()
		this.is_build = true
		
		super.load()
		
		this.leave_group('load')
	}
	
	
	/**
	 * Enable server (start it).
	 * @returns {nothing}
	 */
	enable()
	{
		const name = this.$name
		const host = this.server_host
		const port = this.server_port
		
		let should_listen = true
		
		// ENABLE ERROR HANDLING
		if (this.finaly)
		{
			this.finaly()
		}
		
		// LISTENER
		if (should_listen)
		{
			/*let listener =*/ this.server.listen(this.server_port,
				function()
				{
					// let host = listener.address().address;
					// let port = listener.address().port;
					console.info('%s listening at %s : %s', name, host, port)
				}
			)
		}
	}
	
	
	/**
	 * Disable server (stop it).
	 * @returns {nothing}
	 */
	disable()
	{
		
	}
}

/*
		const has_cluster = this.$settings.has('workers')
		
		// CLUSTER
		if (has_cluster)
		{
			var cluster = require('cluster');
			var numCPUs = require('os').cpus().length;
			
			// const workers = this.$settings.get('workers')
			// const min_workers = this.workers.min || 1;
			// const max_workers = this.workers.max || 3;
			// const method_workers = this.workers.method || 'roundrobin';
			
			should_listen = ! cluster.isMaster
			
			if (cluster.isMaster)
			{
				// Fork workers.
				for(var i = 0; i < numCPUs; i++)
				{
					cluster.fork()
				}
				
				cluster.on('exit',
					function(worker, code, signal)
					{
						console.log('worker ' + worker.process.pid + ' died')
					}
				)
			}
		}
*/