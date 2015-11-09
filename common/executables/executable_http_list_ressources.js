import T from 'typr'
import assert from 'assert'

import ExecutableRoute from './executable_route'
// import authorization from '../../server/security/authorization'


/*
let context = 'common/services/executable_http_list_resources'


export default class ExecutableHttpListResources extends ExecutableRoute
{
	constructor()
	{
		super(context)
	}
	
	
	get_route_cb(arg_cfg_route)
	{
		return function exec_http(req, res, next) 
		{
			// CHECK ARGS
			assert(arg_cfg_route && T.isString(arg_cfg_route.collection), context + ':bad collection name')
			
			// GET RESOURCES LIST
			var resources_list = this.store_config.get_resources(arg_cfg_route.collection)
			
			// SEND OUTPUT
			res.contentType = 'json';
			res.send({ resources: resources_list });
			
			return next();
		}
	}
}
*/