
import passport_local from 'passport-local'

import AuthenticationPassport from './authentication_passport'


let context = 'common/security/authentication_passport_local'



/**
 * Authentication class for Passport Local strategy.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationPassportLocal extends AuthenticationPassport
{
    /**
     * Create an Authentication base class.
     * @param {string|undefined} arg_log_context - optional.
     * @returns {nothing}
     */
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_authentication_passport_local = true
	}
    
    
    /**
     * Authenticate a user with request credentials.
     * @param {object|undefined} arg_credentials - request credentials object
     * @returns {object} - a promise of boolean
     */
    authenticate(arg_credentials)
    {
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
        let resolved_promise = Promise.resolved(true)
        if (arg_credentials.done_cb)
        {
            resolved_promise.then(arg_credentials.done_cb)
        }
        return resolved_promise
    }
    
    
    get_middleware()
    {
        // return passport.authenticate('local', 
        // )
    }
    
    
    /**
     * Get Passport strategy provided by this class.
     * @returns {object} - Passport strategy instance
     */
    get_passport_strategy()
    {
        var LocalStrategy = passport_local.Strategy
        
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
        return new LocalStrategy(
            settings,
            function(arg_username, arg_password, arg_done_cb)
            {
                const credentials = { 'user':arg_username, 'password':arg_password, 'done_cb':arg_done_cb }
                this.authenticate(credentials)
            }
        )
    }
}
