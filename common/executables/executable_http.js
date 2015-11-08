
import T from 'typr'
import assert from 'assert'

import Executable from '../base/executable'



let context = 'common/services/executable_http'


export default class ExecutableHttp extends Executable
{
	constructor()
	{
		super(context)
	}
	
	
	prepare(arg_context)
	{
		assert( T.isObject(arg_context.store_config), context + ':no given config')
		this.store_config = arg_context.store_config
	}
	
	
	execute(arg_data)
	{/*
		// CHECK SERVER
		const server_instance = this.store_config.server
		assert(T.isString(server_instance.server_type), context + ':bad server_instance.server_type string')
		assert(server_instance.server_type == 'restify', context + ':server_instance.server_type should be restify')
		assert(T.isObject(server_instance.server), context + ':bad server_instance.server object')
		
		assert( T.isObject(arg_data) && arg_data.req && arg_data.res && arg_data.next, context + ':bad args (req, res, next attempted)')
		assert( T.isObject(arg_data.req), context + ':bad request')
		assert( T.isObject(arg_data.res), context + ':bad result')
		assert( T.isFunction(arg_data.next), context + ':bad next')
		
		let args = null
		if (arg_data.length > 3)
		{
			args = {}
			Object.keys(arg_data).forEach(
				(key) => {
					if (key !== 'req' && key != 'res' && key != 'next')
					{
						args[key] = arg_data[key]
					}
				}
			)
		}
		
		try
		{
			return this.exec_http(arg_data.req, arg_data.res, arg_data.next, args)
		}
		catch(e)
		{
			let error_msg = e.toString()
			
			this.debug('An error occures [%s]', error_msg)
			this.error(error_msg)
			
			// NOT FOUND
			arg_data.res.status(404);
			arg_data.res.send(error_msg);
			
			return arg_data.next(e)
		}*/
	}
	
	
	// exec_http(req, res, next, args) 
	// {
	// }
	
}

/*
			const restify_server = server_instance.server
			const app_static_cb = restify.serveStatic(cb_arg)
			const app_route = T.isString(this.store_config.application.url) ? this.store_config.application.url : ''
			const route = app_route + cfg_route.route
			
			restify_server.get(route, app_static_cb)
			
			this.info('registering static route for application dev JS [%s] at url [%s]', cfg_route.directory, route)
var security_restify_cb = function(arg_resource_name, arg_role, arg_action_name)
{
  return function(arg_req, arg_res, arg_next)
  {
	  
  }
}*/
