
import T from 'typr'
import assert from 'assert'

import AuthenticationPluginPassportLocal from './authentication_plugin_passport_local'


let context = 'common/security/authentication_plugin_passport_local_db'



/**
 * Authentication class for Passport Local database strategy.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationPluginPassportLocalDb extends AuthenticationPluginPassportLocal
{
    /**
     * Create an Authentication plugin class based on passport local database strategy.
     * @param {string|undefined} arg_log_context - optional.
     * @returns {nothing}
     */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_authentication_passport_local_db = true
	}
    
    
	/**
     * Enable authentication plugin with contextual informations.
     * @param {object|undefined} arg_settings - optional contextual settings.
     * @returns {object} - a promise object of a boolean result (success:true, failure:false)
     */
	enable(arg_settings)
	{
        const resolved_promise = super.enable(arg_settings)
        
        // SET MODEL NAME
        this.model_name = null
        if (arg_settings && T.isString(arg_settings.model_name) )
        {
            this.model_name = arg_settings.model_name
        }
        
        return resolved_promise
    }
    
    
    /**
     * Authenticate a user with a database giving request credentials.
     * @param {object|undefined} arg_credentials - request credentials object
     * @returns {object} - a promise of boolean
     */
    authenticate(arg_credentials)
    {
        assert( T.isObject(this.model), context + ':authenticate:bad model object')
        assert( T.isObject(arg_credentials), context + ':authenticate:bad credentials object')
        assert( T.isString(arg_credentials.username), context + ':authenticate:bad credentials.username string')
        assert( T.isString(arg_credentials.password), context + ':authenticate:bad credentials.password string')
        /*
        User.findOne({ username: arg_username },
                    function(err, user)
                    {
                        if (err) { return arg_done_cb(err); }
                        
                        if (!user)
                        {
                            return arg_done_cb(null, false, { message: 'Incorrect username.' });
                        }
                        
                        if (!user.validPassword(arg_password))
                        {
                            return arg_done_cb(null, false, { message: 'Incorrect password.' });
                        }
                        
                        return arg_done_cb(null, user);
                    }
                )
        */
        
        let resolved_promise = Promise.resolve(true)
        if (arg_credentials.done_cb)
        {
            resolved_promise.then(arg_credentials.done_cb)
        }
        
        return resolved_promise
    }
}
