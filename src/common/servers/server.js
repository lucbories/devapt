
import T from 'typr'
import assert from 'assert'
import { fromJS } from 'immutable'

import { config } from '../store/index'
import Collection from '../base/collection'
import BusClientInstance from './bus_client_instance'

import AuthenticationWrapper from '../security/authentication_wrapper'



const context = 'common/servers/server'

/**
 * @public
 * Type of servers.
 */
export const ServerTypes = {
	SERVER_TYPE_EXPRESS : 'express',
	SERVER_TYPE_RESTIFY : 'restify',
	SERVER_TYPE_SOCKETIO : 'socketio',
	SERVER_TYPE_FEATHER : 'feather',
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
	 * @param {string} arg_name - server name
	 * @param {string} arg_class - server class name
	 * @param {object} arg_settings - plugin settings map
	 * @param {string} arg_log_context - trace context string.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_class, arg_settings, arg_log_context)
	{
		if (! T.isObject(arg_settings))
		{
			console.error(arg_class, arg_name, arg_settings, arg_log_context, 'arg_class, arg_name, arg_settings, arg_context')
		}
		super('servers', (arg_class ? arg_class.toString() : 'Server'), arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
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
	 * Get security settings object into the server.
	 * @returns {object} - security settings
	 */
	get_server_security_settings()
	{
		this.enter_group('get_security_settings')
		
		const security_settings = this.get_setting('security', null)
		
		this.leave_group('get_security_settings')
		return security_settings
	}
	
	
	/**
	 * Get security settings from server or runtime.
	 * @returns {Immutable.Map} - security settings
	 */
	get_security_settings()
	{
		const self = this
		self.enter_group('get_security_settings')
		
		// DEFAULT SECURITY SETTINGS
		const default_security = {
			'authentication': {
				'enabled': true,
				'plugins': []
			},
			'authorization': {
				'enabled': true,
				'plugins': []
			}
		}
		
		// TARGET SECURITY SETTINGS
		let security_settings = fromJS(default_security)
		
		// GET SERVER SECURITY SETTINGS
		const srv_security_settings = self.get_setting('security', null)
		// console.log(context + '.get_security_settings:srv_security_settings', srv_security_settings)
		
		if (srv_security_settings && srv_security_settings.has('authentication'))
		{
			// AUTHENTICATION IS ENABLED ?
			if ( srv_security_settings.hasIn(['authentication', 'enabled']) )
			{
				const enabled = srv_security_settings.getIn(['authentication', 'enabled'])
				security_settings = security_settings.setIn(['authentication', 'enabled'], enabled)
			}
			else
			{
				self.error('get_security_settings:bad server.settings.security.authentication.enabled')
				self.leave_group('get_security_settings:from server with error')
				return security_settings
			}
			
			// AUTHENTICATION PLUGINS
			if ( srv_security_settings.hasIn(['authentication', 'plugins']) )
			{
				const plugins = srv_security_settings.getIn(['authentication', 'plugins'])
				security_settings = security_settings.setIn(['authentication', 'plugins'], plugins.toArray())
				if (plugins.size == 0)
				{
					self.error('bad server.settings.security.authentication.plugins.size')
					self.leave_group('get_security_settings:from server with error')
					return security_settings
				}
			}
			else
			{
				self.error('get_security_settings:bad server.settings.security.authentication.plugins')
				self.leave_group('get_security_settings:from server with error')
				return security_settings
			}
			
			// console.log(context + '.get_security_settings:from server:security_settings', security_settings)
			self.leave_group('get_security_settings:from server')
			return security_settings
		}
		
		
		
		// GET RUNTIME SECURITY SETTINGS
		const rt_security_settings = config().get('security')
		if ( rt_security_settings.has('enabled') )
		{
			const enabled = rt_security_settings.get('enabled')
			security_settings = security_settings.set('enabled', enabled)
		}
		else
		{
			self.error('get_security_settings:bad runtime.settings.security.enabled')
			self.leave_group('get_security_settings:from runtime with error')
			return security_settings
		}
		
		// GET RUNTIME AUTHENTICATION SECURITY SETTINGS
		if (rt_security_settings && rt_security_settings.has('authentication'))
		{
			// AUTHENTICATION IS ENABLED ?
			if ( rt_security_settings.hasIn(['authentication', 'enabled']) )
			{
				const enabled = rt_security_settings.getIn(['authentication', 'enabled'])
				security_settings = security_settings.setIn(['authentication', 'enabled'], enabled)
			}
			else
			{
				self.error('get_security_settings:bad runtime.settings.security.authentication.enabled')
				self.leave_group('get_security_settings:from runtime with error')
				return security_settings
			}
			
			// AUTHENTICATION PLUGINS
			if ( rt_security_settings.hasIn(['authentication', 'default_plugins']) )
			{
				const plugins = rt_security_settings.getIn(['authentication', 'default_plugins'])
				security_settings = security_settings.setIn(['authentication', 'plugins'], plugins.toArray())
				if (plugins.size == 0)
				{
					self.error('bad runtime.settings.security.authentication.plugins.size')
					self.leave_group('get_security_settings:from runtime with error')
					return security_settings
				}
			}
			else
			{
				self.error('get_security_settings:bad runtime.settings.security.authentication.default_plugins')
				self.leave_group('get_security_settings:from runtime with error')
				return security_settings
			}
			
			self.leave_group('get_security_settings:from runtime')
			return security_settings
		}
		
		
		// console.error(context + ':no security settings found')
		self.error(context + ':no security settings found')
		self.leave_group('get_security_settings:not found')
		return null
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
		
		// SECURITY (could be null for Bus Server...)
		const security_settings = this.get_security_settings()
		// console.log(context + '.load:security_settings', security_settings)
		
		// AUTHENTICATION
		if ( security_settings && security_settings.hasIn(['authentication', 'enabled']) && security_settings.hasIn(['authentication', 'plugins']) )
		{
			this.authentication.load(security_settings.get('authentication'))
		}
		
		// AUTHORIZATION
		// TODO
		
		
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
https://engineering.gosquared.com/making-dashboard-faster
function parallel(middlewares) {
  return function (req, res, next) {
    async.each(middlewares, function (mw, cb) {
      mw(req, res, cb);
    }, next);
  };
}

app.use(parallel([
  getUser,
  getSiteList,
  getCurrentSite,
  getSubscription
]));


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