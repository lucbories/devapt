
import T from 'typr'
import assert from 'assert'
import passport from 'passport'

import AuthenticationPlugin from './authentication_plugin'



let context = 'common/security/authentication_plugin_passport'



/**
 * Authentication base class for Passport strategies.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationPluginPassport extends AuthenticationPlugin
{
    /**
     * Create an Authentication class for all Passport strategies.
     * @param {string|undefined} arg_log_context - optional.
     * @returns {nothing}
     */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_authentication = true
        this.passport = passport
	}
	
    
	/**
     * Enable authentication plugin with contextual informations.
     * @param {object|undefined} arg_settings - optional contextual settings.
     * @returns {object} - a promise object of a boolean result (success:true, failure:false)
     */
	enable(arg_settings)
	{
        const resolved_promise = super.enable(arg_settings)
        
        // SET FIELD NAMES FOR USER NAME
        if (arg_settings && T.isString(arg_settings.username_fieldname) )
        {
            this.username_fieldname = arg_settings.username_fieldname
        }
        
        // SET FIELD NAMES FOR PASSWORD
        if (arg_settings && T.isString(arg_settings.password_fieldname) )
        {
            this.password_fieldname = arg_settings.password_fieldname
        }
        
        // SET FIELD NAMES FOR ID
        if (arg_settings && T.isString(arg_settings.id_fieldname) )
        {
            this.id_fieldname = arg_settings.id_fieldname
        }
        
        // SET REDIRECTION ROUTE ON SUCCESS
        if (arg_settings && T.isString(arg_settings.success_redirect) )
        {
            this.success_redirect = arg_settings.success_redirect
        }
        
        // SET REDIRECTION ROUTE ON FAILURE
        if (arg_settings && T.isString(arg_settings.failure_redirect) )
        {
            this.failure_redirect = arg_settings.failure_redirect
        }
        
        // SET USE OF SESSION FLAG
        if (arg_settings && T.isBoolean(arg_settings.use_session) )
        {
            this.use_session = arg_settings.use_session
        }
        
        return resolved_promise
	}
    
    
	/**
     * Disable authentication plugin with contextual informations.
     * @param {object|undefined} arg_settings - optional contextual settings.
     * @returns {object} - a promise object of a boolean result (success:true, failure:false)
     */
	disable(arg_settings)
	{
        const resolved_promise = super.disable(arg_settings)
        return resolved_promise
	}
    
    
    /**
     * Apply authentication plugin io given server. Use a middleware.
     * @param {object} arg_server - Runtime server (Express/Restify server for example)
     * @returns {nothing}
     */
    apply_on_server(arg_server)
    {
        assert(T.isObject(arg_server), context + ':apply_on_server:bad server object')
        assert(arg_server.is_server, context + ':apply_on_server:bad server instance')
        
        // USE PASSPORT STRATEGY
        const strategy = this.get_passport_strategy()
        assert(T.isFunction(strategy), context + ':apply_on_server:bad strategy function')
        this.passport.use(strategy)
        
        const mw = this.passport.initialize()
        assert(T.isFunction(mw), context + ':apply_on_server:bad middleware function')
        arg_server.server.use(mw)
        
        // ENABLE PASSPORT SESSION
        if (this.use_session)
        {
            const mw_session = this.passport.session()
            assert(T.isFunction(mw_session), context + ':apply_on_server:bad middleware session function')
            arg_server.server.use(mw_session)
        }
    }
    
    
    /**
     * Get Passport strategy provided by this class.
     * @abstract
     * @returns {object} - Passport strategy instance
     */
    get_passport_strategy()
    {
        this.error_not_implemented()
        return null
    }
}
