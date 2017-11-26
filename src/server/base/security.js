// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import Errorable from '../../common/base/errorable'

// SERVER IMPORTS
import AuthenticationManager from '../security/authentication_manager'
import AuthorizationManager from '../security/authorization_manager'


const context = 'server/base/security'



/**
 * @file Security class - main security features wrapper.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Security extends Errorable
{
	/**
	 * Create a Security instance.
	 * @extends Errorable
	 * 
	 * @param {string} arg_log_context - trace logging context string.
	 * @param {object} arg_settings - runtime settings.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_log_context, arg_settings)
	{
		const logger_manager = (arg_settings && arg_settings.logger_manager) ? arg_settings.logger_manager : undefined
		super(arg_log_context ? arg_log_context : context, logger_manager)
		
		this.is_security = true
		
		this.authentication_manager = new AuthenticationManager(context + '.authentication', logger_manager)
		this.authorization_manager = new AuthorizationManager(context + '.authorization', logger_manager)
		
		if (arg_settings)
		{
			const logger_manager_only = Object.keys(arg_settings).length == 1 && arg_settings.logger_manager
			if ( ! logger_manager_only)
			{
				if ( ! arg_settings.has )
				{
					arg_settings = fromJS(arg_settings)
				}
				this.load(arg_settings)
			}
		}
	}
	
	
	/**
	 * Load security settings.
	 * 
	 * @param {object} arg_settings - runtime settings (Immutable object).
	 * 
	 * @returns {nothing}
	 */
	load(arg_settings)
	{
		this.enter_group('load')
		// this.debug('settings', arg_settings)

		// console.log(context + '.load:arg_settings', arg_settings)
		
		assert(T.isObject(arg_settings), context + ':bad settings object')
		assert(T.isFunction(arg_settings.has), context + ':bad settings immutable')
		assert(arg_settings.has('authentication'), context + ':bad settings.authentication')
		assert(arg_settings.has('authorization'), context + ':bad settings.authorization')
		
		const authentication = arg_settings.get('authentication')
		const authorization = arg_settings.get('authorization')
		
		this.is_readonly = arg_settings.get('is_readonly')
		
		this.authentication_manager.load(authentication)
		this.authorization_manager.load(authorization)
		/*
		
			TODO
			https://gist.github.com/danwit/e0a7c5ad57c9ce5659d2
			https://github.com/OptimalBits/node_acl
			http://www.hamiltonchapman.com/blog/2014/3/25/user-accounts-using-sequelize-and-passport-in-nodejs
		*/

		this.leave_group('load')
	}
	
	
	
	/**
	 * Get authentication plugins manager.
	 * 
	 * @returns {object} - a PluginsManager instance
	 */
	get_authentication_manager()
	{
		return this.authentication_manager
	}
	
	
	
	/**
	 * Get authorization plugins manager.
	 * 
	 * @returns {object} - a PluginsManager instance.
	 */
	get_authorization_manager()
	{
		return this.authorization_manager
	}
	
	
	
	/**
	 * Get authentication plugins manager.
	 * 
	 * @returns {object} - a PluginsManager instance.
	 */
	authentication()
	{
		assert( T.isObject(this.authentication_manager) && this.authentication_manager.is_authentication_manager, context + ':bad authentication_manager object')
		return this.authentication_manager
	}
	
	
	
	/**
	 * Authenticate a user with giving credentials.
	 * 
	 * @param {Credentials} arg_credentials - credentials object.
	 * 
	 * @returns {Promise} - a promise of boolean.
	 */
	authenticate(arg_credentials)
	{
		this.enter_group('authenticate')
		
		const auth_mgr = this.authentication()
		
		let promise = Promise.resolve(true)
		if (auth_mgr.authentication_is_enabled)
		{
			promise = auth_mgr.authenticate(arg_credentials)
		}

		this.leave_group('authenticate')
		return promise
	}
	
	
	
	/**
	 * Get authorization plugins manager.
	 * 
	 * @returns {object} - a PluginsManager instance.
	 */
	authorization()
	{
		assert( T.isObject(this.authorization_manager) && this.authorization_manager.is_authorization_manager, context + ':bad authorization_manager object')
		return this.authorization_manager
	}
	
	
	
	/**
	 * Authenticate a user with giving credentials.
	 * 
	 * @param {object} arg_permission - permission plain object.
	 * @param {object} arg_credentials - credentials object.
	 * 
	 * @returns {Promise} - a promise of boolean.
	 */
	authorize(arg_permission, arg_credentials)
	{
		this.enter_group('authorize')
		
		const auth_mgr = this.authorization()

		let promise = Promise.resolve(true)
		if (auth_mgr.authorization_is_enabled)
		{
			promise = auth_mgr.authorize(arg_permission, arg_credentials)
		}

		// const promise = this.authorization().authorize(arg_permission, arg_credentials)
		
		this.leave_group('authorize')
		return promise
	}
	
	
	
	
	// PREDEFINED ERRORS
	
	/**
	 * Error wrapper - on bad user.
	 * 
	 * @returns {nothing}
	 */
	error_bad_user()
	{
		this.error('bad user')
	}
	
	
	/**
	 * Error wrapper - on bad credentials.
	 * 
	 * @returns {nothing}
	 */
	error_bad_credentials()
	{
		this.error('bad credentials')
	}
}

/*
	EXAMPLE OF CONFIGURATION
	
	"security":{
		"is_readonly":false,
		
		"connexions":["connexions.json"],
		
		"authentication": {
			"enabled":true,
			
			"expiration":60,
			"secret":"APPPPPPP449++((éç(à",
			
			"mode":"database",
			"model":"MODEL_AUTH_USERS",
			"username":"login",
			"password":"password",
			
			"alt": {
				"mode":"jsonfile",
				"file":"users.json",
				
				"login":"demo",
				"password":"demo"
			}
		},
		
		"authorization": {
			"enabled":true,
			"mode":"database",
			
			"model":"MODEL_AUTH_USERS_ROLES",
			"role":"label",
			"username":"users_login",
			
			"alt": {
				"mode":"jsonfile",
				"file":"users.json"
			},
			
			"roles":{
				"*": {
					"list_resources":"ROLE_RESOURCES_LIST",
					"get_resource":"ROLE_RESOURCE_GET"
				},
				"views": {
					"list_resources":"ROLE_RESOURCES_LIST",
					"get_resource":"ROLE_RESOURCE_GET"
				}
			}
		}
	}
*/


/*
	AUTHENTICATION
	
		"authentication": {
			"enabled":true,
			
			"expiration":60,
			"secret":"APPPPPPP449++((éç(à",
			
			"mode":"database",
			"model":"MODEL_AUTH_USERS",
			"username":"login",
			"password":"password",
			
			"alt": {
				"mode":"jsonfile",
				"file":"users.json",
				
				"login":"demo",
				"password":"demo"
			}
		},
	
	"authentication":
		mandatories:"enabled", "mode"
		mode:
			database:
				model:mandatory
				username:mandatory
				password:mandatory
			jsonfile:
				file:mandatory
				username:mandatory
				password:mandatory
		
*/