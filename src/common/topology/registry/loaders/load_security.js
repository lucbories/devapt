// NPM IMPORTS
import assert from 'assert'
import T from 'typr'
import path from 'path'

// COMMON IMPORTS
import parser from '../../../utils/parser/parser'

// SERVER IMPORTS
import load_security_authorization from './load_security_authorization'
import load_security_authentication from './load_security_authentication'


const context = 'common/topology/registry/loaders/load_security'



let error_msg_bad_config = context + ':bad config'
let error_msg_bad_is_readonly = context + ':security.is_readonly should be a boolean'
let error_msg_bad_datasources = context + ':security.datasources should be an array'
let error_msg_bad_authentication = context + ':security.authentication should be an object'
let error_msg_bad_authorization = context + ':security.authorization should be an object'
let error_msg_bad_datasource = context + ':security.datasources.* should be a string'
let error_msg_bad_cx_config = context + ':security.datasources.*.* should be a valid datasource'

// const apps_dir = '../../../../apps/'
	

function load_security(logs, arg_security_config, arg_base_dir)
{
	// console.log('LOADING CONFIG SECURITY', arg_security_config)
	logs.info(context, 'loading config.security')
    
	try
    {
		// CHECK SECURITY
		assert(T.isObject(arg_security_config), error_msg_bad_config)
		assert(T.isBoolean(arg_security_config.is_readonly), error_msg_bad_is_readonly)
		assert(T.isArray(arg_security_config.datasources), error_msg_bad_datasources)
		assert(T.isObject(arg_security_config.authentication), error_msg_bad_authentication)
		assert(T.isObject(arg_security_config.authorization), error_msg_bad_authorization)

		// LOAD DATASOURCES
		arg_security_config.files = {}
		arg_security_config.resources_by_name = {}
		arg_security_config.resources_by_file = {}
		arg_security_config.datasources.forEach(
			(file_name)=> {
				// CHECK DATASOURCES
				assert(T.isString(file_name), error_msg_bad_datasource)
				
				let file_path_name = path.join(arg_base_dir, 'resources', file_name)
				// console.log(file_path_name, 'datasources file_path_name')
				
				let config = parser.read(file_path_name, 'utf8')
				// console.log(config, 'config')
				
				arg_security_config.files[file_name] = config
				arg_security_config.resources_by_file[file_name] = {}
				
				// LOOP ON CONNEXIONS
				Object.keys(config).forEach(
					(res_name) => {
						let res_obj = config[res_name]
						res_obj.name = res_name
						res_obj.type = 'datasources'
						
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
		arg_security_config.authentication = load_security_authentication(logs, arg_security_config.authentication, arg_base_dir)

		// CHECK AUTHORIZATION
		arg_security_config.authorization = load_security_authorization(logs, arg_security_config.authorization, arg_base_dir)
	}
	catch(e)
	{
		arg_security_config = { error: { context:context, exception:e } }
	}
	
	return arg_security_config
}

export default load_security
