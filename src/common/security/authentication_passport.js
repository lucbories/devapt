
import Authentication from '../base/authentication'
import passport from 'passport'



let context = 'common/security/authentication_passport'



/**
 * Authentication base class for Passport strategies.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class AuthenticationPassport extends Authentication
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
	}
	
    
	/**
     * Prepare an authentication with contextual informations.
     * @abstract
     * @param {object} arg_settings - execution settings.
     * @returns {nothing}
     */
	init(arg_settings)
	{
        super.init(arg_settings)
        
        // SET FIELD NAMES FOR USER NAME
        if (arg_settings && arg_settings.username_fieldname)
        {
            this.username_fieldname = arg_settings.username_fieldname
        }
        
        // SET FIELD NAMES FOR PASSWORD
        if (arg_settings && arg_settings.password_fieldname)
        {
            this.password_fieldname = arg_settings.password_fieldname
        }
        
        // SET REDIRECTION ROUTE ON SUCCESS
        if (arg_settings && arg_settings.success_redirect)
        {
            this.success_redirect = arg_settings.success_redirect
        }
        
        // SET REDIRECTION ROUTE ON FAILURE
        if (arg_settings && arg_settings.failure_redirect)
        {
            this.failure_redirect = arg_settings.failure_redirect
        }
        
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
     * @abstract
     * @returns {object} - Passport strategy instance
     */
    get_passport_strategy()
    {
        this.error_not_implemented()
        return null
    }
}
