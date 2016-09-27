// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import forge from 'node-forge'

// SERVER IMPORTS
import PluginsManager from '../plugins/plugins_manager'

// import AuthenticationPluginPassportLocalDb from './authentication_plugin_passport_local_db'
// import AuthenticationPluginPassportLocalFile from './authentication_plugin_passport_local_file'
import AuthenticationLowDbPlugin from './authentication_plugin_lowdb'


let context = 'server/security/authentication_manager'



/**
 * Authentication class to manage authentication plugins.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationManager extends PluginsManager
{
	/**
	 * Create an Authentication manager class: load and create all authentication plugins.
	 * AuthenticationWrapper use created plugins.
	 * @extends PluginsManager
	 * 
	 * @param {string|undefined} arg_log_context - optional.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_log_context, arg_logger_manager)
	{
		super(arg_log_context ? arg_log_context : context, arg_logger_manager)
		
		this.is_authentication_manager = true
		
		this.authentication_is_enabled = true
		this.authentication_mode = null
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
		this.enter_group('load')
		
		assert(T.isObject(arg_settings), context + ':load:bad settings object')
		assert(T.isFunction(arg_settings.has), context + ':load:bad settings immutable')
		assert(arg_settings.has('enabled'), context + ':load:bad settings.enabled')
		assert(arg_settings.has('plugins'), context + ':load:bad settings.plugins')
		assert(arg_settings.has('default_plugins'), context + ':load:bad settings.default_plugins')
		
		// LOAD AUTHENTICATION SETTINGS
		this.authentication_is_enabled = arg_settings.get('enabled')
		this.authentication_plugins = arg_settings.get('plugins')
		this.authentication_default_plugins = arg_settings.get('default_plugins')
		
		// LOAD PLUGINS
		const keys = this.authentication_plugins.toMap().keySeq().toArray()
		keys.forEach(
			(key) => {
				const plugin_cfg = this.authentication_plugins.get(key)
				plugin_cfg.name = key
				const result = this.load_plugin(plugin_cfg)
				if (! result)
				{
					this.error_bad_plugin(this.authentication_mode)
				}
			}
		)
		
		
		// TODO: default security plugin ?
		// TODO: alt plugin settings ?
		
		this.leave_group('load')
	}
	
	
	
	/**
	 * Load security plugin from settings.
	 * 
	 * @param {object} arg_settings - authentication settings (Immutable object).
	 * 
	 * @returns {boolean}
	 */
	load_plugin(arg_settings)
	{
		this.enter_group('load_plugin')
		// console.log(arg_settings, context + ':load_plugin:arg_settings')
		
		const self = this
		
		assert( T.isObject(arg_settings), context + ':load_plugin:bad settings object')
		assert( T.isFunction(arg_settings.has), context + ':load_plugin:bad settings immutable')
		assert( arg_settings.has('mode'), context + ':load_plugin:bad settings.mode')
		assert( T.isString(arg_settings.name) && arg_settings.name.length > 0, context + ':load_plugin:bad settings.name')
		
		// console.log(arg_settings.name, context + ':load_plugin:arg_settings.name')
		
		// LOAD PLUGIN
		const mode = arg_settings.get('mode').toLocaleLowerCase()
		switch(mode)
		{
			case 'database':
			// {
			//	 const plugin = new AuthenticationPluginPassportLocalDb(context)
			//	 this.register_plugin(plugin)
			//	 plugin.enable(arg_settings)
			//	 return true
			// }
			case 'jsonfile': {
			//	 const plugin = new AuthenticationPluginPassportLocalFile(context)
			//	 this.register_plugin(plugin)
			//	 plugin.enable(arg_settings)
			//	 return true
			// }
			// default: {
				const plugin = new AuthenticationLowDbPlugin(this, arg_settings.name, context)
				// self.info(context + ':load_plugin:create plugin for mode [' + mode + '] for name [' + plugin.get_name() + ']')
				
				this.register_plugin(plugin)
				.then(
					(result) => {
						if (result)
						{
							plugin.enable(arg_settings)
							self.info(context + ':load_plugin:success for mode [' + mode + '] for name [' + plugin.get_name() + ']')
						}
						else
						{
							self.error(context + ':load_plugin:failure for mode [' + mode + '] for name [' + plugin.get_name() + ']')
						}
					}
				)
				.catch(
					(reason) => {
						self.error(context + ':load_plugin:failure for mode [' + mode + '] for name [' + plugin.get_name() + ']:' + reason)
					}
				)
				
				this.leave_group('load:jsonfile or database')
				return true
			}
			case 'token': {
				this.leave_group('load:token')
				return true // TODO: plugin auth token
			}
		}
		
		this.leave_group('load_plugin:error')
		return false
	}
	
	
	
	/**
	 * Authenticate a user with giving credentials.
	 * 
	 * @param {object} arg_credentials - credentials object.
	 * 
	 * @returns {Promise} - a promise of boolean.
	 */
	authenticate(arg_credentials)
	{
		this.enter_group('authenticate')
		
		// console.log(context + ':authenticate:arg_credentials', arg_credentials)
		
		let all_promises = []
		this.registered_plugins.forEach(
			(plugin) => {
				const promise = plugin.authenticate(arg_credentials)
				all_promises.push(promise)
			}
		)
		
		const promise = Promise.all(all_promises).then(
			(promise_results) => {
				for(let result of promise_results)
				{
					if (result)
					{
						return true
					}
				}
				return false
			}
		)
		
		this.leave_group('authenticate')
		return promise
	}
	
	
	
	/**
	 * Hash a password.
	 * 
	 * @param {string} arg_password - password to hash.
	 * @param {string|undefined} arg_digest_method - digest method name (sha1,sha256,sha384,sha512,md5)
	 * @param {string|undefined} arg_encoding_method - encoding method name (hex,utf8,utf16,binary,base64,hexstr)
	 * 
	 * @returns {string} - hashed password
	 */
	hash_password(arg_password, arg_digest_method, arg_encoding_method)
	{
		assert(T.isString(arg_password), context + ':bad password string')
		arg_digest_method = T.isString(arg_digest_method) ? arg_digest_method : 'sha1'
		arg_encoding_method = T.isString(arg_encoding_method) ? arg_encoding_method : 'hex'
		
		// GET MESSAGE DIGEST FUNCTION
		let md = null
		switch(arg_digest_method.toLocaleLowerCase())
		{
			case 'sha1':   md = forge.md.sha1.create(); break
			case 'sha256': md = forge.md.sha256.create(); break
			case 'sha384': md = forge.md.sha384.create(); break
			case 'sha512': md = forge.md.sha512.create(); break
			case 'md5':	md = forge.md.md5.create(); break
			default: this.error_bad_digest_method(arg_digest_method); return null
		}
		assert(md, context + ':bad message digest object')
		md.update(arg_password)
		
		// GET ENCODED MESSAGE
		let encoded = null
		switch(arg_encoding_method.toLocaleLowerCase())
		{
			case 'hex':
				encoded = md.digest().toHex(); break
			case 'utf8':
			case 'utf-8':
				encoded = md.digest().toString('utf8'); break
			case 'utf16':
			case 'utf-16':
				encoded = md.digest().toString('utf16'); break
			case 'binary':
				encoded = md.digest().toString('binary'); break
			case 'base64':
				encoded = md.digest().toString('base64'); break
			case 'hexstr':
				encoded = md.digest().toString('hex'); break
			default: this.error_bad_encoding_method(arg_encoding_method); return null
		}
		assert(encoded, context + ':bad message encoding result')
		
		return encoded
	}
	
	
	
	/**
	 * Check request credentials authentication.
	 *	Request format:
	 *		req.username=...
	 *		req.authorization={
	 *			scheme: <Basic|Signature|...>,
	 *			credentials: <Undecoded value of header>,
	 *			basic: {
	 *				username: $user
	 *				password: $password
	 *			}
	 *		}
	 *
	 * @param {object} arg_request - request object.
	 * 
	 * @returns {boolean}
	 */
	check_request_authentication(arg_request)
	{
		if ( !this.authentication_is_enabled )
		{
			return true
		}
		
		const credentials = this.get_credentials(arg_request)
		
		if (arg_request.is_authenticated && credentials.username && credentials.password)
		{
			return true
		}
		
		return false
	}
	
	
	
	/**
	 * Get request credentials from headers.
	 *	Request format:
	 *		req.username=...
	 *		req.authorization={
	 *			scheme: <Basic|Signature|...>,
	 *			credentials: <Undecoded value of header>,
	 *			basic: {
	 *				username: $user
	 *				password: $password
	 *			}
	 *		}
	 * 
	 * @param {object} arg_request - request object.
	 * 
	 * @returns {object} - plain object as { 'user':..., 'password':... }
	 */
	get_credentials(arg_request)
	{
		this.info('get_credentials')
		
		// DEBUG
		// console.log(arg_request.url, 'arg_request.url')
		// console.log(arg_request.queries, 'arg_request.queries')
		// console.log(arg_request.password, 'arg_request')
		// console.log(arg_request.query(), 'arg_request.query')
		// console.log(arg_request.params, 'arg_request.params')
		
		
		// CHECK REQUEST
		let credentials = { 'username':null, 'password':null, 'token':null, 'expire':null }
		if (!arg_request)
		{
			return credentials
		}
		
		
		// REQUEST ALREADY HAVE PROCESSED CREDENTIAL
		if ( T.isObject(arg_request.devapt_credentials) )
		{
			this.info('get_credentials:authentication from cache')
			return arg_request.devapt_credentials
		}
		
		
		// EXPRESS REQUEST
		if (arg_request && arg_request.query && arg_request.query.username && arg_request.query.password)
		{
			this.info('get_credentials:authentication with query map')
			
			credentials.username = arg_request.query.username
			credentials.password = arg_request.query.password
			arg_request.devapt_credentials = credentials
			
			return credentials
		}
		
		
		// RESTIFY WITH QUERY STRING
		let query_str = null
		if (arg_request && T.isString(arg_request.query) )
		{
			this.info('get_credentials:authentication with query string')
			query_str = arg_request.query
		}
		if (arg_request && T.isFunction(arg_request.query) )
		{
			this.info('get_credentials:authentication with query function')
			query_str = arg_request.query()
		}
		if ( T.isString(query_str) )
		{
			const queries = query_str.split('&')
			// console.log(queries, 'queries part')
			
			queries.forEach(
				(item/*, index, arr*/) => {
					const parts = item.split('=')
					if ( T.isArray(parts) && parts.length == 2 )
					{
						const key = parts[0]
						const value = parts[1]
						if (key == 'username')
						{
							credentials.username = value
							return
						}
						if (key == 'password')
						{
							credentials.password = value
							return
						}
					}
				}
			)
			
			if (credentials.username && credentials.password)
			{
				arg_request.devapt_credentials = credentials
				return credentials
			}
		}
		
		
		// RESTIFY QUERY PARSER PLUGIN (NOT WORKING YET)
		if (arg_request && arg_request.params && arg_request.params.username && arg_request.params.password)
		{
			this.info('get_credentials:authentication with params args')
			
			credentials.username = arg_request.params.username
			credentials.password = arg_request.params.password
			arg_request.devapt_credentials = credentials
			
			return credentials
		}
		
		
		// RESTIFY AUTHORIZATION PLUGIN
		if (arg_request && arg_request.authorization)
		{
			this.info('get_credentials:authentication with basic auth header args')
			
			if (!arg_request.authorization.basic)
			{
				return credentials
			}
			
			credentials.username = arg_request.authorization.basic.username
			credentials.password = arg_request.authorization.basic.password
			arg_request.devapt_credentials = credentials
			
			return credentials
		}
		
		this.error_bad_credentials_format()
		return credentials
	}
	
	
	
	/**
	 * Error wrapper - error during plugin loading.
	 * 
	 * @param {string} arg_plugin_mode - plugin mode.
	 * 
	 * @returns {nothing}
	 */
	error_bad_plugin(arg_plugin_mode)
	{
		this.error('bad plugin [' + arg_plugin_mode + ']')
	}
	
	
	
	/**
	 * Error wrapper - unknow digest method.
	 * 
	 * @param {string} arg_digest_method - digest method name.
	 * 
	 * @returns {nothing}
	 */
	error_bad_digest_method(arg_digest_method)
	{
		this.error('bad digest method [' + arg_digest_method + ']')
	}
	
	
	
	/**
	 * Error wrapper - unknow encoding method.
	 * 
	 * @param {string} arg_encoding_method - encoding method name.
	 * 
	 * @returns {nothing}
	 */
	error_bad_encoding_method(arg_encoding_method)
	{
		this.error('bad encoding method [' + arg_encoding_method + ']')
	}
	
	
	/**
	 * Error wrapper - unknow request credentials format.
	 * 
	 * @returns {nothing}
	 */
	error_bad_credentials_format()
	{
		this.error('bad request credentials format')
	}
}
