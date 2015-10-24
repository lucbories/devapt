
import assert from 'assert'
import T from 'typr'

import logs from '../utils/logs'
import load_config_security_authorization from './load_config_security_authorization'
import load_config_security_authentication from './load_config_security_authentication'



let context = 'common/loaders/load_config_security'
let error_msg_bad_config = context + ':bad config'
let error_msg_bad_is_readonly = context + ':security.is_readonly should be a boolean'
let error_msg_bad_connexions = context + ':security.connexions should be an array'
let error_msg_bad_authentication = context + ':security.authentication should be an object'
let error_msg_bad_authorization = context + ':security.authorization should be an object'
let error_msg_bad_connexion = context + ':security.connexions.* should be a string'



function load_config_security(arg_security_config)
{
	logs.info(context, 'loading config.security')
	
	try{
		// CHECK SECURITY
		assert(T.isObject(arg_security_config), error_msg_bad_config)
		assert(T.isBoolean(arg_security_config.is_readonly), error_msg_bad_is_readonly)
		assert(T.isArray(arg_security_config.connexions), error_msg_bad_connexions)
		assert(T.isObject(arg_security_config.authentication), error_msg_bad_authentication)
		assert(T.isObject(arg_security_config.authorization), error_msg_bad_authorization)
		
		// CHECK CONNEXIONS
		arg_security_config.connexions.forEach( (connexion)=> { assert(T.isString(connexion), error_msg_bad_connexion) } )
		
		// CHECK AUTHENTICATION
		arg_security_config.authentication = load_config_security_authentication(arg_security_config.authentication)
		
		// CHECK AUTHORIZATION
		arg_security_config.authorization = load_config_security_authorization(arg_security_config.authorization)
	}
	catch(e)
	{
		arg_security_config = { error: { context:context, exception:e } }
	}
	
	return arg_security_config
}

export default load_config_security
