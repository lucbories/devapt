
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import Executable from './executable'


let context = 'common/services/executable_http'
let debug = debug_fn(context)



export default class ExecutableHttp extends Executable
{
	constructor()
	{
		super()
	}
	
	
	prepare(arg_context)
	{
		assert( T.isObject(arg_context.store_config), context + ':no given config')
		this.store_config = arg_context.store_config
	}
	
	
	execute(arg_data)
	{
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
			
			debug('An error occures [%s]', error_msg)
			this.error(error_msg)
			
			// NOT FOUND
			arg_data.res.status(404);
			arg_data.res.send(error_msg);
			
			return arg_data.next(e)
		}
	}
	
	
	exec_http(req, res, next, args) 
	{
	}
}
