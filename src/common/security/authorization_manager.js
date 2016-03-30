
import T from 'typr'
import assert from 'assert'
import forge from 'node-forge'

import PluginsManager from '../base/plugins_manager'
// import AuthorizationPluginPassportLocalDb from './authorization_plugin_passport_local_db'
// import AuthorizationPluginPassportLocalFile from './authorization_plugin_passport_local_file'


let context = 'common/security/authorization_manager'



/**
 * Authorization class to manage authorization plugins.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthorizationManager extends PluginsManager
{
    /**
     * Create an Authorization manager class.
     * @param {string|undefined} arg_log_context - optional.
	 * @param {LoggerManager} arg_logger_manager - logger manager object (optional).
     * @returns {nothing}
     */
	constructor(arg_log_context, arg_logger_manager)
	{
		super(arg_log_context ? arg_log_context : context, arg_logger_manager)
		
		this.is_authorization_manager = true
        
		this.authorization_is_enabled = true
		this.authorization_mode = null
	}
    
    
    /**
     * Load security settings
     * @param {object} arg_settings - authorization settings (Immutable object)
     * @returns {nothing}
     */
    load(arg_settings)
    {
        assert(T.isObject(arg_settings), context + ':bad settings object')
        assert(T.isFunction(arg_settings.has), context + ':bad settings immutable')
        assert(arg_settings.has('enabled'), context + ':bad settings.enabled')
        assert(arg_settings.has('mode'), context + ':bad settings.mode')
        
        // LOAD AUTHORIZATION SETTINGS
        this.authorization_is_enabled = arg_settings.get('enabled')
        this.authorization_mode = arg_settings.get('mode')
        
        // LOAD PLUGIN
        const result = this.load_plugin(arg_settings)
        if (! result)
        {
            this.error_bad_plugin(this.authorization_mode)
        }
        
        // TODO: default security plugin ?
        // TODO: alt plugin settings ?
    }
    
    
    /**
     * Load security plugin from settings
     * @param {object} arg_settings - authorization settings (Immutable object)
     * @returns {boolean}
     */
    load_plugin(arg_settings)
    {
        assert(T.isObject(arg_settings), context + ':bad settings object')
        assert(T.isFunction(arg_settings.has), context + ':bad settings immutable')
        assert(arg_settings.has('mode'), context + ':bad settings.mode')
        
        // LOAD PLUGIN
        const mode = arg_settings.get('mode').toLocaleLowerCase()
        switch(mode)
        {
            case 'database':
            {
                // const plugin = new AuthorizationPluginPassportLocalDb(context)
                // this.register_plugin(plugin)
                // plugin.enable(arg_settings)
                return true
            }
            case 'jsonfile':
            {
                // const plugin = new AuthorizationPluginPassportLocalFile(context)
                // this.register_plugin(plugin)
                // plugin.enable(arg_settings)
                return true
            }
        }
        
        return false
    }
    
    
    /**
     * Authenticate a user with request credentials.
     * @param {object|undefined} arg_credentials - request credentials object
     * @returns {object} - a promise of boolean
     */
    authenticate(arg_credentials)
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
	 * Error wrapper - error during plugin loading.
	 * @param {string} arg_plugin_mode - plugin mode
	 * @returns {nothing}
	 */
    error_bad_plugin(arg_plugin_mode)
    {
        this.error('bad plugin [' + arg_plugin_mode + ']')
    }
}
