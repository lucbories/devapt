
import T from 'typr'
import assert from 'assert'
import forge from 'node-forge'

import PluginsManager from '../base/plugins_manager'
import AuthenticationPluginPassportLocal from './authentication_plugin_passport_local'


let context = 'common/security/authentication_manager'



/**
 * Authentication class to manage authentication plugins.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationManager extends PluginsManager
{
    /**
     * Create an Authentication manager class.
     * @param {string|undefined} arg_log_context - optional.
     * @returns {nothing}
     */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_authentication_manager = true
        
        this.authentication_is_enabled = true
        this.authentication_mode = null
	}
    
    
    /**
     * Load security settings
     * @param {object} arg_settings - authentication settings (Immutable object)
     * @returns {nothing}
     */
    load(arg_settings)
    {
        assert(T.isObject(arg_settings), context + ':bad settings object')
        assert(T.isFunction(arg_settings.has), context + ':bad settings immutable')
        assert(arg_settings.has('enabled'), context + ':bad settings.enabled')
        assert(arg_settings.has('mode'), context + ':bad settings.mode')
        
        // LOAD AUTHENTICATION SETTINGS
        this.authentication_is_enabled = arg_settings.get('enabled')
        this.authentication_mode = arg_settings.get('mode')
        
        // LOAD PLUGIN
        switch(this.authentication_mode.toLocaleLowerCase())
        {
            case 'database':
            {
                const plugin = new AuthenticationPluginPassportLocal()
            }
            case 'none':
            default:
        }
    }
    
    
    /**
     * Authenticate a user with request credentials.
     * @param {object|undefined} arg_credentials - request credentials object
     * @returns {object} - a promise of boolean
     */
    authenticate(arg_credentials)
    {
        return Promise.resolved(false)
    }
    
	
    /**
     * Login current request (alias of authenticate).
     * @abstract
     * @returns {object} - a promise of boolean
     */
	login()
	{
        return Promise.resolved(false)
	}
	
    
    /**
     * Logout current authenticated user.
     * @abstract
     * @returns {object} - a promise of boolean
     */
	logout()
	{
        return Promise.resolved(false)
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
    
    
    /**
     * Hash a password.
     * @param {string} arg_password - password to hash
     * @param {string|undefined} arg_digest_method - digest method name (sha1,sha256,sha384,sha512,md5)
     * @param {string|undefined} arg_encoding_method - encoding method name (hex,utf8,utf16,binary,base64,hexstr)
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
            case 'md5':    md = forge.md.md5.create(); break
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
     *    Request format:
     *        req.username=...
     *        req.authorization={
     *            scheme: <Basic|Signature|...>,
     *            credentials: <Undecoded value of header>,
     *            basic: {
     *                username: $user
     *                password: $password
     *            }
     *        }
     * @param {object} arg_request - request object
     * @returns {object} - plain object as { 'user':..., 'password':... }
     */
    check_request(arg_request)
    {
        if ( !this.authentication_is_enabled )
        {
            return Promise.resolved(true)
        }
        
        const credentials = this.get_credentials(arg_request);
        
        
        if (!credentials.user || !credentials.password)
        {
            return Promise.resolved(false)
        }

        return this.authenticate(credentials);
    }
    
    
    /**
     * Get request credentials from headers.
     *    Request format:
     *        req.username=...
     *        req.authorization={
     *            scheme: <Basic|Signature|...>,
     *            credentials: <Undecoded value of header>,
     *            basic: {
     *                username: $user
     *                password: $password
     *            }
     *        }
     * @param {object} arg_request - request object
     * @returns {object} - plain object as { 'user':..., 'password':... }
     */
    get_credentials(arg_request)
    {
        let credentials = { 'user':null, 'password':null }
        if (!arg_request)
        {
            return credentials
        }
        
        if (arg_request && arg_request.params && arg_request.params.username && arg_request.params.password)
        {
            this.info('authentication with params args')
            
            credentials.user = arg_request.params.username
            credentials.password = arg_request.params.password
            return credentials;
        }

        if (arg_request.authorization)
        {
            this.info('authentication with basic auth header args')
            
            if (!arg_request.authorization.basic)
            {
                return credentials
            }
            
            credentials.user = arg_request.authorization.basic.username
            credentials.password = arg_request.authorization.basic.password
            return credentials
        }

        this.error_bad_credentials_format()
        return credentials
    }
    
    
    /**
	 * Error wrapper - unknow digest method
	 * @param {string} arg_digest_method - digest method name
	 * @returns {nothing}
	 */
    error_bad_digest_method(arg_digest_method)
    {
        this.error('bad digest method [' + arg_digest_method + ']')
    }
    
    
    /**
	 * Error wrapper - unknow encoding method
	 * @param {string} arg_encoding_method - encoding method name
	 * @returns {nothing}
	 */
    error_bad_encoding_method(arg_encoding_method)
    {
        this.error('bad encoding method [' + arg_encoding_method + ']')
    }
    
    
    /**
	 * Error wrapper - unknow request credentials format
	 * @returns {nothing}
	 */
    error_bad_credentials_format()
    {
        this.error('bad request credentials format')
    }
}
