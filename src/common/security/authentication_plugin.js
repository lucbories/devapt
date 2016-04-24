
// import T from 'typr'
// import assert from 'assert'
// import crypto from 'crypto'

import Plugin from '../plugins/plugin'



let context = 'common/security/authentication_plugin'



/**
 * Authentication plugin base class.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationPlugin extends Plugin
{
	/**
	 * Create an Authentication base class.
	 * @param {AuhtenticationManager} arg_manager - authentication plugins manager.
	 * @param {string} arg_name - plugin name.
	 * @param {string} arg_class - plugin class name.
	 * @param {string|undefined} arg_log_context - optional.
	 * @returns {nothing}
	 */
	constructor(arg_manager, arg_name, arg_class, arg_log_context)
	{
		super(arg_manager, arg_name, (arg_class ? arg_class.toString() : 'AuthenticationPlugin'), { version: '1.0.0' }, arg_log_context ? arg_log_context : context)
		
		this.is_authentication_plugin = true
	}
	
	
	/**
	 * Enable authentication plugin with contextual informations.
	 * @abstract
	 * @param {object|undefined} arg_settings - optional contextual settings.
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	enable(arg_settings)
	{
		this.info('enable')
		
		const resolved_promise = super.enable(arg_settings)
		return resolved_promise
	}
	
	
	/**
	 * Disable authentication plugin with contextual informations.
	 * @abstract
	 * @param {object|undefined} arg_settings - optional contextual settings.
	 * @returns {object} - a promise object of a boolean result (success:true, failure:false)
	 */
	disable(arg_settings)
	{
		this.info('disable')
		
		const resolved_promise = super.disable(arg_settings)
		return resolved_promise
	}
	
	
	/**
	 * Apply authentication plugin io given server. Use a middleware.
	 * @abstract
	 * @param {object} arg_server - Runtime server (Express/Restify server for example)
	 * @returns {nothing}
	 */
	apply_on_server(/*arg_server*/)
	{
	}
	
	
	/**
	 * Get a authentication middleware to use on servers (see Connect/Express middleware signature).
	 * @abstract
	 * @param {boolean} arg_should_401 - should send an 401 error on authentication failure.
	 * @param {Function} arg_next_auth_mw - next authentication middleware.
	 * @returns {Function} - function(request,response,next){...}
	 */
	create_middleware(/*arg_should_401, arg_next_auth_mw*/)
	{
		return undefined
	}
	
	
	/**
	 * Authenticate a user with request credentials.
	 * @abstract
	 * @param {object|undefined} arg_credentials - request credentials object
	 * @returns {object} - a promise of boolean
	 */
	authenticate(/*arg_credentials*/)
	{
		return Promise.resolve(false)
	}
	
	
	/**
	 * Login current request (alias of authenticate).
	 * @abstract
	 * @returns {object} - a promise of boolean
	 */
	login()
	{
		return Promise.resolve(false)
	}
	
	
	/**
	 * Logout current authenticated user.
	 * @abstract
	 * @returns {object} - a promise of boolean
	 */
	logout()
	{
		return Promise.resolve(false)
	}
	
	
	/**
	 * Get credentials token of authenticated user.
	 * @abstract
	 * @returns {string} - credentials token
	 */
	get_token()
	{
		return null
	}
	
	
	/**
	 * Create a new credentials token for authenticated user.
	 * @abstract
	 * @returns {string} - credentials token
	 */
	renew_token()
	{
		return null
	}
	
	
	/**
	 * Check a credentials token.
	 * @abstract
	 * @returns {boolean} - request token is valid
	 */
	check_token()
	{
		return false
	}
}
