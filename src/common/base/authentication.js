
import Errorable from './errorable'
import crypto from 'crypto'



let context = 'common/base/authentication'



/**
 * Authentication base class.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Authentication extends Errorable
{
    /**
     * Create an Authentication base class.
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
        self.error('should be implemented')
	}
    
    /**
     * Hash a password
     * @param {string} arg_password - password to hash
     * @returns {string} - hashed password
     */
	hash_password(arg_password)
    {
        return md5(arg_password);
    }
    
    
    get_credentials(arg_request)
    {
        /* AUTHENTICATION FROM HEADER
            req.username=...
            req.authorization={
                scheme: <Basic|Signature|...>,
                credentials: <Undecoded value of header>,
                basic: {
                    username: $user
                    password: $password
                }
            }
        */
        // console.log(arg_request.params, 'request.params');

        var credentials = { 'user':null, 'password':null };
        if (!arg_request) return credentials;


        if (arg_request && arg_request.params && arg_request.params.username && arg_request.params.password)
        {
            console.info('authentication with params args');
            credentials.user = arg_request.params.username;
            credentials.password = arg_request.params.password;
            return credentials;
        }

        if (arg_request.authorization)
        {
            console.info('authentication with basic auth header args');
            if (!arg_request.authorization.basic) return credentials;
            credentials.user = arg_request.authorization.basic.username;
            credentials.password = arg_request.authorization.basic.password;
            return credentials;
        }

        console.error('credentials failure without args');
        return credentials;
    }
    
    
    authenticate()
    {
        return new Promise()
    }
}
    
auth_api.enabled = cfg_auth.enabled;
auth_api.mode = cfg_auth.mode;




auth_api.;



auth_api.get_credentials = function(arg_request)
{
  /* AUTHENTICATION FROM HEADER
    req.username=...
    req.authorization={
      scheme: <Basic|Signature|...>,
      credentials: <Undecoded value of header>,
      basic: {
        username: $user
        password: $password
      }
    }
    */
  // console.log(arg_request.params, 'request.params');
  
  var credentials = { 'user':null, 'password':null };
  if (!arg_request) return credentials;
  
  
  if (arg_request && arg_request.params && arg_request.params.username && arg_request.params.password)
  {
    console.info('authentication with params args');
    credentials.user = arg_request.params.username;
    credentials.password = arg_request.params.password;
    return credentials;
  }
  
  if (arg_request.authorization)
  {
    console.info('authentication with basic auth header args');
    if (!arg_request.authorization.basic) return credentials;
    credentials.user = arg_request.authorization.basic.username;
    credentials.password = arg_request.authorization.basic.password;
    return credentials;
  }
  
  console.error('credentials failure without args');
  return credentials;
};



auth_api.check_request = function(arg_request)
{
  var self = this;
  var credentials = self.get_credentials(arg_request);
  console.log(credentials, 'credentials');
  console.log(self.enabled, 'enabled');
  
  if (!self.enabled) return Q(true);
  
  if (!credentials.user || !credentials.password) return Q(false);
  
  
  return self.authenticate(credentials.user, credentials.password);
};
	/**
     * Execution with contextual informations.
     * @abstract
     * @param {object} arg_data - execution datas.
     * @returns {object} promise
     */
	authenticate(arg_data)
	{
        return Promise.reject('not implemented')
	}
    
	
    /**
     * Finish (todo).
     * @abstract
     * @returns {nothing}
     */
	login()
	{
	}
	
    
    /**
     * On execution success (todo).
     * @abstract
     * @returns {nothing}
     */
	logout()
	{
	}
	
    
    /**
     * On execution failure (todo).
     * @abstract
     * @returns {nothing}
     */
	get_token()
	{
	}
	
    
    /**
     * On execution failure (todo).
     * @abstract
     * @returns {nothing}
     */
	renew_token()
	{
	}
	
    
    /**
     * On execution failure (todo).
     * @abstract
     * @returns {nothing}
     */
	check_token()
	{
	}
}