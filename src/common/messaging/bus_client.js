
// import T from 'typr'
// import assert from 'assert'

import BusGateway from './bus_gateway'


let context = 'common/messaging/bus_client'



/**
 * @file Base class for message bus client.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class BusClient extends BusGateway
{
	/**
	 * Create a remote bus client.
	 * @extends BusGateway
	 * @abstract
	 * @param {string} arg_class - class name.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings.
	 * @param {string} arg_log_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_class, arg_name, arg_settings, arg_log_context)
	{
		super(arg_class, arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_remote_bus_client = true
	}
	
	
	/**
	 * Load settings.
	 * @returns {nothing}
	 */
	load()
	{
		this.enter_group('load')
		
		// GET REMOTE SERVER SETTINGS
		this.server_host = this.get_setting('host', undefined)
		this.server_port = this.get_setting('port', undefined)
		
		super.load()
		
		this.leave_group('load')
	}
	
	
	
	/**
	 * Test if a target is on the remote bus.
	 * @abstract
	 * @protected
	 * @param {string} arg_target - target name.
	 * @returns {boolean}
	 */
	has_remote_target(/*arg_target*/)
	{
		this.error(context + ':has_remote_target:not yet implemented')
	}
	
	
	
	/**
	 * Send a value to a remote recipient.
	 * @abstract
	 * @protected
	 * @param {object} arg_value - value to send.
	 * @returns {nothing}
	 */
	post_to_remote(/*arg_value*/)
	{
		this.error(context + ':post_to_remote:not yet implementend')
	}
	
	
	
	/**
	 * Enable client (start it).
	 * @returns {nothing}
	 */
	enable()
	{
		this.enter_group('enable Bus client')
		
		this.error(context + ':enable:not yet implemented')
		
		this.leave_group('enable Bus client')
	}
	
	
	/**
	 * Disable client (stop it).
	 * @returns {nothing}
	 */
	disable()
	{
		this.enter_group('disable Bus client')
		
		this.error(context + ':disable:not yet implemented')
		
		this.leave_group('disable Bus client')
	}
}
