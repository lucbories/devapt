
import passport_local from 'passport-local'



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
     * Prepare an authentication with contextual informations.
     * @param {object} arg_settings - execution settings.
     * @returns {nothing}
     */
	init(arg_settings)
	{
        const local_strategy = this.get_passport_strategy()
        passport.use(local_strategy)
	}
    
    
    authenticate(arg_identifier, arg_password)
    {
        return new Promise()
    }
    
    
    get_middleware()
    {
        return passport.authenticate('local', 
        )
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
            }
        )
    }
}
