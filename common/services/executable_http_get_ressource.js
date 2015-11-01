import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'
import fs from 'fs'
import path from 'path'

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
		
		// SANITY CHECK OF CONNEXIONS
        if (args.collection === 'connexions' || resource.type === 'connexions')
        {
          resource.host = 'host';
          resource.port = 'port';
          resource.user_name = 'user';
          resource.user_pwd = '******';
        }
		
		
		// WRAP INCLUDED FILE
		if ( T.isString(resource.include_file_path_name) )
		{
			debug('Process resource.include_file_path_name [%s]', resource.include_file_path_name)
			
			resource.include_file_content = this.include_file(resource_name, resource.include_file_path_name)
		}
		
		
		// SEND OUTPUT
		res.contentType = 'json'
		res.send({ resource: resource })
		
		return next()
	}
	
	
	include_file(arg_resource_name, arg_file_path_name)
	{
		var file_path = path.join(__dirname, '../../apps/private/', arg_file_path_name)
		debug('Process file_path [%s]', file_path)
		
		let content = null
		fs.readFile(file_path, {encoding: 'utf-8'},
			function(err, data)
			{
				if (err)
				{
					var error_msg = context + ':resource include file not found [%s] for resource [%s]'
					throw new Error(error_msg, arg_resource_name, file_path);
				}
				
				debug('file is read');
				content = data
			}
		)
		
		return content
	}
}
