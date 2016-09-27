// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Settingsable from '../../common/base/settingsable'

// SERVER IMPORTS
import runtime from '../base/runtime'


let context = 'server/security/authentication_wrapper'



/**
 * @file Authentication wrapper class to interact with authentication plugins.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationWrapper extends Settingsable
{
	/**
	 * Create an Authentication wrapper class to interact with authentication plugins.
	 * @extends Settingsable
	 * 
	 * @param {string|undefined} arg_log_context - optional.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_authentication_wrapper = true
		this.authentication_is_enabled = true
		this.authentication_plugins = []
	}
	
	
	
	/**
	 * Load security settings.
	 * 
	 * @param {object} arg_settings - authentication settings (Immutable object).
	 * 
	 * @returns {nothing}
	 */
	load(arg_settings)
	{
		// console.log(arg_settings, context + ':load:arg_settings')
		
		const self = this
		assert(T.isObject(arg_settings), context + ':bad settings object')
		assert(T.isFunction(arg_settings.has), context + ':bad settings immutable')
		assert(arg_settings.has('enabled'), context + ':bad settings.enabled')
		assert(arg_settings.has('plugins'), context + ':bad settings.plugins')
		
		const auth_mgr = runtime.security().get_authentication_manager()
		
		
		// LOAD AUTHENTICATION SETTINGS
		this.authentication_is_enabled = arg_settings.get('enabled')
		this.authentication_plugins = []
		const plugins = arg_settings.get('plugins')
		
		// SEARCH PLUGINS
		plugins.forEach(
			(plugin_name) => {
				const plugin = auth_mgr.registered_plugins.find_by_name(plugin_name)
				if ( T.isObject(plugin) && plugin.is_authentication_plugin )
				{
					self.authentication_plugins.push(plugin)
					return
				}
				self.info('plugin not found for name [' + plugin_name + ']')
			}
		)
	}
	
	
	
	/**
	 * Apply all plugins authentication middleware on a Server instance.
	 * 
	 * @param {Server} arg_server - server instance.
	 * 
	 * @returns {boolean}
	 */
	apply_middlewares(arg_server)
	{
		this.enter_group('apply_middlewares')
		// assert( T.isObject(arg_server) && T.isObject(arg_server.server), context + ':apply_middlewares:bad arg_server.server object')
		// assert( T.isFunction(arg_server.server.use), context + ':apply_middlewares:bad arg_server.server.user function')
		
		// CHECK SERVER
		if (! arg_server || ! arg_server.server || ! T.isFunction(arg_server.server.use) )
		{
			this.leave_group('apply_middlewares:bad server')
			return false
		}
		
		const plugins = this.authentication_plugins
		const auth_mgr = runtime.security().get_authentication_manager()
		
		// LAST MIDDLEWARE
		const last_mw = (req, res, next) => {
			// AUTHENTICATION IS VALID
			if ( ! this.authentication_is_enabled || auth_mgr.check_request_authentication(req) )
			{
				// console.log('apply_middlewares:last_mw:auth success')
				next()
				return
			}
			
			// SEND ERROR OUTPUT
			res.status(401)
			res.contentType = 'json'
			res.send({ message: 'Authentication failure' })
			
			// console.log('apply_middlewares:last_mw:auth failure', req.originalUrl)
			next('Authentication failure')
		}
		
		
		// LOOP ON PLUGINS
		const should_send_error_on_failure = false
		for(let plugin of plugins)
		{
			if ( T.isFunction(plugin.create_middleware) )
			{
				// self.debug('apply_middlewares:get_mw:call plugin.create_middleware()')
				// console.log('apply_middlewares:loop on plugin:' + plugin.get_name())
				
				const mw = plugin.create_middleware(should_send_error_on_failure)
				arg_server.server.use(mw)
			}
		}
		
		// ADD LAST MIDDLEWARE
		arg_server.server.use(last_mw)
		return true
	}
}
