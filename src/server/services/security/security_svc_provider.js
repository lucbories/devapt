// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import SocketIOServiceProvider from '../base/socketio_service_provider'
import runtime from '../../base/runtime'


let context = 'server/services/security/security_svc_provider'



/**
 * Security service provider class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class SecuritySvcProvider extends SocketIOServiceProvider
{
	/**
	 * Create a Security service provider.
	 * 
	 * @param {string} arg_provider_name - consumer name.
	 * @param {Service} arg_service_instance - service instance.
	 * @param {string} arg_context - logging context label.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_provider_name, arg_service_instance, arg_context)
	{
		super(arg_provider_name, arg_service_instance, arg_context ? arg_context : context)
		
		assert(this.service.is_security_service, context + ':bad Security service')
	}
	
	
	
	/**
	 * Process request and returns datas.
	 * 
	 * @param {string} arg_method - method name
	 * @param {array} arg_operands - request operands
	 * @param {object} arg_credentials - request credentials
	 * 
	 * @returns {Promise}
	 */
	process(arg_method, arg_operands, arg_credentials)
	{
		assert( T.isString(arg_method), context + ':process:bad method string')
		assert( T.isArray(arg_operands), context + ':process:bad operands array')
		assert( T.isObject(arg_credentials), context + ':process:bad credentials object')
		
		switch(arg_method)
		{
			case 'login': {
				// GET WITHOUT OPERANDS
				if ( arg_operands.length == 0)
				{
					const login_result = runtime.security().authenticate(arg_credentials)
					return Promise.resolve(login_result)
				}
				
				// GET WITH OPERANDS
				// const first_operand = arg_operands[0]
				break
			}
			
			case 'signup': {
				// TODO logout
				break
			}
			
			case 'logout': {
				// TODO logout
				break
			}
			
			case 'change_password': {
				// TODO logout
				break
			}
			
			case 'reset_password': {
				// TODO logout
				break
			}
			
			case 'renew': {
				// TODO logout
				break
			}
		}
		
		return Promise.reject('bad data request operation [' + arg_method + ']')
	}
}
