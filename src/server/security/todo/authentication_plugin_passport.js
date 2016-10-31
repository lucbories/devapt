
import T from 'typr'
import assert from 'assert'
import passport from 'passport'

// COMMON IMPORTS
import Credentials from '../../../common/base/credentials'

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
	 * @param {string} arg_name - plugin name.
	 * @param {string} arg_class - plugin class name.
     * @param {string|undefined} arg_log_context - optional.
     * @returns {nothing}
     */
	constructor(arg_name, arg_class, arg_log_context)
	{
		super(arg_name, 'AuthenticationPluginPassport', arg_log_context ? arg_log_context : context)
		
		this.is_authentication = true
		
		this.passport = passport
		this.strategies = {}
		this.strategies_names = []
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
        this.info('apply authentication on ' + arg_server.get_name())
        
        assert(T.isObject(arg_server), context + ':apply_on_server:bad server object')
        assert(arg_server.is_server, context + ':apply_on_server:bad server instance')
        
        // SERVER INIT MW: f(req,res,next)
        const mw_init = this.passport.initialize()
        assert(T.isFunction(mw_init), context + ':apply_on_server:bad middleware init function')
        arg_server.server.use(mw_init)
        
        // ENABLE PASSPORT SESSION
        if (this.use_session)
        {
            const mw_session = this.passport.session()
            assert(T.isFunction(mw_session), context + ':apply_on_server:bad middleware session function')
            arg_server.server.use(mw_session)
        }
    }
    
    
    /**
     * Get a authentication middleware to use on servers (see Connect/Express middleware signature).
     * @returns {function} - function(request,response,next){...}
     */
    create_middleware()
    {
        // USE PASSPORT STRATEGY
        const strategy = this.get_passport_strategy()
        assert(T.isObject(strategy), context + ':create_middleware:bad strategy object')
        this.passport.use(strategy)
        
        // STRATEGY NAME
        assert(T.isFunction(this.get_passport_strategy_name), context + ':create_middleware:bad strategy name function')
        const strategy_name = this.get_passport_strategy_name()
        assert(T.isString(strategy_name), context + ':create_middleware:bad stragegy name')
        
        const mw = passport.authenticate(strategy_name, { session: this.use_session })
        assert(T.isFunction(mw), context + ':create_middleware:bad middleware function')
        return mw
    }
    
    
    /**
     * Get a authentication route middleware to use on servers (see Connect/Express middleware signature).
     * @returns {function} - function(request,response){...}
     */
    create_route_middleware()
    {
        // USE PASSPORT STRATEGY
        const strategy = this.get_passport_strategy()
        assert(T.isObject(strategy), context + ':create_middleware:bad strategy object')
        this.passport.use(strategy)
        
        // STRATEGY NAME
        assert(T.isFunction(this.get_passport_strategy_name), context + ':create_middleware:bad strategy name function')
        const strategy_name = this.get_passport_strategy_name()
        assert(T.isString(strategy_name), context + ':create_middleware:bad stragegy name')
        
        // ROUTE MW: f(req,res)
        const mw = passport.authenticate(strategy_name, { session: this.use_session })
        assert(T.isFunction(mw), context + ':create_middleware:bad middleware function')
        
        return mw
    }
    
    
    /**
     * Get Passport strategy provided by this class.
     * @abstract
     * @returns {object} - Passport strategy instance
     */
    // get_passport_strategy()
    // {
    //     this.error_not_implemented()
    //     return null
    // }
    
    add_strategy(arg_name, arg_instance)
    {
        this.strategies_names.push('local')
    }
    
    
    add_local_strategy()
    {
        const self = this
        
        const LocalStrategy = passport_local.Strategy
        // const LocalStrategy = passport_local.BasicStrategy
        
        // BUILD LOCAL STRATEGY SETTINGS
        const settings = {}
        if (this.username_fieldname)
        {
            settings.usernameField = this.username_fieldname
        }
        if (this.password_fieldname)
        {
            settings.passwordField = this.password_fieldname
        }
        if (this.success_redirect)
        {
            settings.successRedirect = this.success_redirect
        }
        if (this.failure_redirect)
        {
            settings.failureRedirect = this.failure_redirect
        }
        settings.failureFlash = true
        
        // CREATE AND RETURN A LOCAL STRATEGY INSTANCE
        const strategy = new LocalStrategy(
            settings,
            function(arg_username, arg_password, arg_done_cb)
            {
                self.debug('LocalStrategy.authenticate')
                console.log(context + '.LocalStrategy:mw')
                
                const credentials = { 'user':arg_username, 'password':arg_password }
                const instance = new Credentials(credentials)
                instance.done_cb = arg_done_cb
                this.authenticate(instance)
            }
        )
        
        
        this.add_strategy('local', strategy)
    }
}
