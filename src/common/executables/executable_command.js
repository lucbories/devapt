import T from 'typr'
import assert from 'assert'

import Executable from '../base/executable'


let context = 'common/executables/executable_command'


/**
 *  @file todo Executable command class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ExecutableCommand extends Executable
{
	constructor()
	{
		super(context)
	}
	
	
	prepare(arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':no given config')
		this.store_config = arg_settings
		
		assert(T.isObject(this.store_config), context + ':bad config object')
		
		assert(T.isObject(this.store_config.server), context + ':bad server object')
		assert(this.store_config.server.is_server, context + ':bad server instance')
		
		this.server = this.store_config.server
		
		// assert(T.isArray(this.store_config.server_types), context + ':bad server_types array')
		this.store_config.server_types = ['restify', 'express']
	}
	
	
	execute(arg_data)
	{
		// CHECK APPLICATION
		assert(T.isObject(arg_data), context + ':bad application object')
		assert(arg_data.is_application, context + ':bad application instance')
		const application = arg_data
		this.info('Execute: add server route for ' + application.$name)
		
		// CHECK SERVER
		const server_instance = this.server
		assert(T.isString(server_instance.server_type), context + ':bad server_instance.server_type string')
		assert(this.store_config.server_types.indexOf(server_instance.server_type) > -1, context + ':server_instance.server_type not valid')
		// console.log(server_instance, 'server_instance')
		// console.log(server_instance.server, 'server_instance.server')
		// assert(T.isObject(server_instance.server), context + ':bad server_instance.server object')
		assert(T.isObject(server_instance.server) || T.isFunction(server_instance.server), context + ':bad server_instance.server object or function')
		
        return Promise.resolve()
	}
}
