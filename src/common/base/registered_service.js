// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import Instance from './instance'



let context = 'common/base/registered_service'



/**
 * @file Registered service class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RegisteredService extends Instance
{
	/**
	 * Create a registered service instance.
	 * @extends Instance
	 * @param {string} arg_name - instance name
	 * @param {object} arg_settings - instance settings map
	 * @returns {nothing}
	 */
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
	
	
	/**
	 * Get service name.
	 * @returns {string}
	 */
	get_service_name()
	{
		return this.get_setting('service_name', null)
	}
	
	
	/**
	 * Get node name.
	 * @returns {string}
	 */
	get_node_name()
	{
		return this.get_setting('node_name', null)
	}
	
	
	/**
	 * Get server name.
	 * @returns {string}
	 */
	get_server_name()
	{
		return this.get_setting('server_name', null)
	}
	
	
	/**
	 * Get server host name.
	 * @returns {string}
	 */
	get_server_host()
	{
		return this.get_setting('server_host', null)
	}
	
	
	/**
	 * Get server port value.
	 * @returns {string|number}
	 */
	get_server_port()
	{
		return this.get_setting('server_port', null)
	}
}
