
import T from 'typr'
import assert from 'assert'

import Instance from './instance'



let context = 'common/base/registered_service'


export default class RegisteredService extends Instance
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		assert( T.isString(arg_settings.service_name), context + ':bad settings.service_name string')
		assert( T.isString(arg_settings.node_name), context + ':bad settings.node_name string')
		assert( T.isString(arg_settings.server_name), context + ':bad settings.server_name string')
		assert( T.isString(arg_settings.server_host), context + ':bad settings.server_host string')
		assert( T.isNumber(arg_settings.server_port), context + ':bad settings.server_port number')
		
		super('registered_services', 'RegisteredService', arg_name, arg_settings)
		
		this.is_registered_services = true
	}
	
	get_service_name()
	{
		return this.get_setting('service_name', null)
	}
	
	get_node_name()
	{
		return this.get_setting('node_name', null)
	}
	
	get_server_name()
	{
		return this.get_setting('server_name', null)
	}
	
	get_server_host()
	{
		return this.get_setting('server_host', null)
	}
	
	get_server_port()
	{
		return this.get_setting('server_port', null)
	}
}
