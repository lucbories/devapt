
// import T from 'typr'
// import assert from 'assert'

import Bus from './bus'

let context = 'common/messaging/bus_client'



/**
 * @file Base class for message bus client.
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class BusClient extends Bus
{
	/**
	 * Create a bus client.
	 * @param {string} arg_name - instance name.
	 * @param {object} arg_settings - settings.
	 * @param {string} arg_log_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_log_context)
	{
		super('bus_clients', 'BusClient', arg_name, arg_settings, arg_log_context ? arg_log_context : context)
		
		this.is_bus_client = true
	}
}