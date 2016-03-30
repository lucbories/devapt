
import assert from 'assert'
import T from 'typr'
import path from 'path'

import logs from '../../../utils/logs'
import parser from '../../../parser/parser'

import load_config_security_authorization from './load_config_security_authorization'
import load_config_security_authentication from './load_config_security_authentication'



let context = 'common/store/config/loaders/load_config_security'
let error_msg_bad_config = context + ':bad config'
let error_msg_bad_is_readonly = context + ':security.is_readonly should be a boolean'
let error_msg_bad_connexions = context + ':security.connexions should be an array'
let error_msg_bad_authentication = context + ':security.authentication should be an object'
let error_msg_bad_authorization = context + ':security.authorization should be an object'
let error_msg_bad_connexion = context + ':security.connexions.* should be a string'
let error_msg_bad_cx_config = context + ':security.connexions.*.* should be a valid connexion'

// const apps_dir = '../../../../apps/'
	

function load_config_security(arg_security_config, arg_base_dir)
{
	// console.log('LOADING CONFIG SECURITY', arg_security_config)
	logs.info(context, 'loading config.security')
    
	try
    {
		// CHECK SECURITY
		assert(T.isObject(arg_security_config), error_msg_bad_config)
		assert(T.isBoolean(arg_security_config.is_readonly), error_msg_bad_is_readonly)
		assert(T.isArray(arg_security_config.connexions), error_msg_bad_connexions)
		assert(T.isObject(arg_security_config.authentication), error_msg_bad_authentication)
		assert(T.isObject(arg_security_config.authorization), error_msg_bad_authorization)
		
		// LOAD CONNEXIONS
		arg_security_config.files = {}
		arg_security_config.resources_by_name = {}
		arg_security_config.resources_by_file = {}
		arg_security_config.connexions.forEach(
			(file_name)=> {
				// CHECK CONNEXIONS
				assert(T.isString(file_name), error_msg_bad_connexion)
				
				let file_path_name = path.join(arg_base_dir, 'resources', file_name)
				// console.log(file_path_name, 'connexions file_path_name')
				
				let config = parser.read(file_path_name, 'utf8')
				// console.log(config, 'config')
				
				arg_security_config.files[file_name] = config
				arg_security_config.resources_by_file[file_name] = {}
				
				// LOOP ON CONNEXIONS
				Object.keys(config).forEach(
					(res_name) => {
						let res_obj = config[res_name]
						res_obj.name = res_name
						res_obj.type = 'connexions'
						
						// CHECK CONNEXION
						assert(T.isString(res_obj.engine),        error_msg_bad_cx_config + '(engine) for file ' + file_name)
						assert(T.isString(res_obj.host),          error_msg_bad_cx_config + '(host) for file ' + file_name)
						assert(T.isString(res_obj.port),          error_msg_bad_cx_config + '(port) for file ' + file_name)
						assert(T.isString(res_obj.database_name), error_msg_bad_cx_config + '(database_name) for file ' + file_name)
						assert(T.isString(res_obj.user_name),     error_msg_bad_cx_config + '(user_name) for file ' + file_name)
						assert(T.isString(res_obj.user_pwd),      error_msg_bad_cx_config + '(user_pwd) for file ' + file_name)
						// OPTS: options, charset
						
						arg_security_config.resources_by_name[res_name] = res_obj
						arg_security_config.resources_by_file[file_name][res_name] = res_obj
					}
				)
			}
		)
		
		// CHECK AUTHENTICATION
		arg_security_config.authentication = load_config_security_authentication(arg_security_config.authentication, arg_base_dir)

		// CHECK AUTHORIZATION
		arg_security_config.authorization = load_config_security_authorization(arg_security_config.authorization, arg_base_dir)
	}
	catch(e)
	{
		arg_security_config = { error: { context:context, exception:e } }
	}
	
	return arg_security_config
}

export default load_config_security
