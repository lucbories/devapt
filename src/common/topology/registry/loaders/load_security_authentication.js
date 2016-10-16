

let context = 'common/topology/registry/loaders/load_security_authentication'



function load_security_authentication(logs, arg_auth_config/*, arg_base_dir*/)
{
	logs.info(context, 'loading config.security.load_security_authentication')
	
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
			// arg_security_config.datasources.forEach( (datasource)=> { assert(T.isString(datasource), error_msg_bad_datasource) } )
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

export default load_security_authentication
