
import T from 'typr'
import assert from 'assert'

import Errorable from './errorable'
import AuthenticationManager from '../security/authentication_manager'
import AuthorizationManager from '../security/authorization_manager'



let context = 'common/base/security'



/**
 * Security class - main security features wrapper.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Security extends Errorable
{
    /**
     * Create a Security instance.
     * @param {string} arg_log_context - optional logging context
     * @param {object} arg_settings - runtime settings
     * @returns {nothing}
     */
	constructor(arg_log_context, arg_settings)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_security = true
        
        this.authentication_manager = new AuthenticationManager(context + '.authentication')
        this.authorization_manager = new AuthorizationManager(context + '.authorization')
        
        // this.authentication_is_enabled = true
        // this.authentication_mode = null
        
        // this.authorization_is_enabled = true
        // this.authorization_mode = null
        
        if (arg_settings)
        {
            this.load(arg_settings)
        }
	}
    
    
    /**
     * Load security settings
     * 
     * @param {object} arg_settings - runtime settings (Immutable object)
     * @returns {nothing}
     */
    load(arg_settings)
    {
        assert(T.isObject(arg_settings), context + ':bad settings object')
        assert(T.isFunction(arg_settings.has), context + ':bad settings immutable')
        assert(arg_settings.has('authentication'), context + ':bad settings.authentication')
        assert(arg_settings.has('authorization'), context + ':bad settings.authorization')
        
        const authentication = arg_settings.get('authentication')
        const authorization = arg_settings.get('authorization')
        
        this.is_readonly = arg_settings.get('is_readonly')
        this.authentication_manager.load(authentication)
        this.authorization_manager.load(authorization)
        /*
        
            TODO
            https://gist.github.com/danwit/e0a7c5ad57c9ce5659d2
            https://github.com/OptimalBits/node_acl
            http://www.hamiltonchapman.com/blog/2014/3/25/user-accounts-using-sequelize-and-passport-in-nodejs
        */
    }
    
    
    /**
     * Get authentication plugins manager
     * @returns {object} - a PluginsManager instance
     */
    get_authentication_manager()
    {
        return this.authentication_manager
    }
    
    
    /**
     * Get authorization plugins manager
     * @returns {object} - a PluginsManager instance
     */
    get_authorization_manager()
    {
        return this.authorization_manager
    }
    
    
    
    
    // PREDEFINED ERRORS
    
    /**
	 * Error wrapper - on bad user
	 * @returns {nothing}
	 */
    error_bad_user()
    {
        this.error('bad user')
    }
    
    
    /**
	 * Error wrapper - on bad credentials
	 * @returns {nothing}
	 */
    error_bad_credentials()
    {
        this.error('bad credentials')
    }
}

/*
    EXAMPLE OF CONFIGURATION
    
	"security":{
		"is_readonly":false,
		
		"connexions":["connexions.json"],
		
		"authentication": {
			"enabled":true,
			
			"expiration":60,
			"secret":"APPPPPPP449++((éç(à",
			
			"mode":"database",
			"model":"MODEL_AUTH_USERS",
			"username":"login",
			"password":"password",
			
			"alt": {
				"mode":"jsonfile",
				"file":"users.json",
				
				"login":"demo",
				"password":"demo"
			}
		},
		
		"authorization": {
			"enabled":true,
			"mode":"database",
			
			"model":"MODEL_AUTH_USERS_ROLES",
			"role":"label",
			"username":"users_login",
			
			"alt": {
				"mode":"jsonfile",
				"file":"users.json"
			},
			
			"roles":{
				"*": {
					"list_resources":"ROLE_RESOURCES_LIST",
					"get_resource":"ROLE_RESOURCE_GET"
				},
				"views": {
					"list_resources":"ROLE_RESOURCES_LIST",
					"get_resource":"ROLE_RESOURCE_GET"
				}
			}
		}
	}
*/


/*
    AUTHENTICATION
    
		"authentication": {
			"enabled":true,
			
			"expiration":60,
			"secret":"APPPPPPP449++((éç(à",
			
			"mode":"database",
			"model":"MODEL_AUTH_USERS",
			"username":"login",
			"password":"password",
			
			"alt": {
				"mode":"jsonfile",
				"file":"users.json",
				
				"login":"demo",
				"password":"demo"
			}
		},
    
    "authentication":
        mandatories:"enabled", "mode"
        mode:
            database:
                model:mandatory
                username:mandatory
                password:mandatory
            jsonfile:
                file:mandatory
                username:mandatory
                password:mandatory
        
*/