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
		
		let resource_name = req.params.name;
		assert( T.isString(resource_name) && resource_name.length > 0, context + ':bad resource name [%s]', resource_name)
		
		
		// TODO: CHECK ACCESS TO RESOURCE FROM USER
		
		
		// GET RESOURCE
		let resource_is_valid = null
		let resource = null
		if (args.collection === '*')
		{
			resource_is_valid = this.store_config.has_resource_by_name(resource_name)
			resource = this.store_config.get_resource(resource_name)
		}
		else
		{
			resource_is_valid = this.store_config.has_resource_by_type(args.collection, resource_name)
			resource = this.store_config.get_resource_by_type(args.collection, resource_name)
		}
		assert( resource_is_valid, context + ':not found resource [%s]', resource_name)
		assert( T.isObject(resource), context + ':not found resource [%s]', resource_name)
		
		
		
		// TODO: SANITY CHECK OF RESOURCE CONFIG (connections...)
		
		
		
		// SEND OUTPUT
		res.contentType = 'json';
		res.send({ resource: resource });
		
		return next();
	}
}