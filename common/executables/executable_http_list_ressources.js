import T from 'typr'
import assert from 'assert'

import ExecutableHttp from './executable_http'
// import authorization from '../../server/security/authorization'



let context = 'common/services/executable_http_list_resources'


export default class ExecutableHttpListResources extends ExecutableHttp
{
	constructor()
	{
		super(context)
	}
	
	
	exec_http(req, res, next, args) 
	{
		this.debug('Execute http request')
		
		
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