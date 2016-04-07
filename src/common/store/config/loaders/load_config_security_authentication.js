
// import assert from 'assert'
// import T from 'typr'



let context = 'common/store/config/loaders/load_config_security_authentication'
// let error_msg_bad_config = context + ':bad config'
// let error_msg_bad_enabled = context + ':authentication.enabled should be a boolean'
// let error_msg_bad_plugins = context + ':authentication.plugins should be an array'
// let error_msg_bad_mode = context + ':authentication.mode should be a string in [database]'
// let error_msg_bad_alt = context + ':authentication.alt should be an object'

// let error_msg_bad_authentication = context + ':authentication should be an object'



function load_config_security_authentication(logs, arg_auth_config/*, arg_base_dir*/)
{
	logs.info(context, 'loading config.security.load_config_security_authentication')
	
	try{
		// CHECK SECURITY
		/*assert(T.isObject(arg_auth_config), error_msg_bad_config)
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
		}*/
	}
	catch(e)
	{
		arg_auth_config = { error: { context:context, exception:e } }
	}
	
	return arg_auth_config
}

export default load_config_security_authentication
