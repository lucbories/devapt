import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import ExecutableHttp from './executable_http'


let context = 'common/services/executable_http_list_resources'
let debug = debug_fn(context)



export default class ExecutableHttpListResources extends ExecutableHttp
{
	constructor()
	{
		super()
	}
	
	
	exec_http(req, res, next, args) 
	{
		debug('Execute http request')
		
		
		// CHECK ARGS
		assert(args && T.isString(args.collection), context + ':bad collection name')
		
		// GET RESOURCES LIST
		var resources_list = this.store_config.get_resources(args.collection)
		
		// SEND OUTPUT
		res.contentType = 'json';
		res.send({ resources: resources_list });
		
		return next();
	}
}