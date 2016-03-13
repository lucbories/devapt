
import assert from 'assert'
import T from 'typr'

import logs from '../../../utils/logs'



let context = 'common/store/config/loaders/load_config_security_authorization'
let error_msg_bad_config = context + ':bad config'
let error_msg_bad_enabled = context + ':authorization.enabled should be a boolean'
let error_msg_bad_mode = context + ':authorization.mode should be a string in [database]'
let error_msg_bad_alt = context + ':authorization.alt should be an object'

let error_msg_bad_model = context + ':authorization.model should be a string'
let error_msg_bad_role = context + ':authorization.role should be a string'
let error_msg_bad_username = context + ':authorization.username should be a string'

// let error_msg_bad_authorization = context + ':authorization should be an object'



function load_config_security_authorization(arg_auth_config, arg_base_dir)
{
	logs.info(context, 'loading config.security')
	
	try{
		// CHECK SECURITY
		assert(T.isObject(arg_auth_config), error_msg_bad_config)
		assert(T.isBoolean(arg_auth_config.enabled), error_msg_bad_enabled)
		assert(T.isString(arg_auth_config.mode), error_msg_bad_mode)
		assert(T.isObject(arg_auth_config.alt), error_msg_bad_alt)
		
		// CHECK SECURITY
		if (arg_auth_config.mode === 'database')
		{
			assert(T.isString(arg_auth_config.model), error_msg_bad_model)
			assert(T.isString(arg_auth_config.role), error_msg_bad_role)
			assert(T.isString(arg_auth_config.username), error_msg_bad_username)
			
			// CHECK CONNEXIONS
			// arg_security_config.connexions.forEach( (connexion)=> { assert(T.isString(connexion), error_msg_bad_connexion) } )
		}
		else
		{
			assert(false, error_msg_bad_mode)
		}
	}
	catch(e)
	{
		arg_auth_config = { error: { context:context, exception:e } }
	}
	
	return arg_auth_config
}

export default load_config_security_authorization
