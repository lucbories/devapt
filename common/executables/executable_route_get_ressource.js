import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'

import { store, config } from '../store/index'

import ExecutableRoute from './executable_route'


let context = 'common/services/executable_route_get_resources'



export default class ExecutableRouteGetResources extends ExecutableRoute
{
	constructor()
	{
		super(context)
	}
	
	
	get_route_cb(arg_cfg_route)
	{
		let self = this
		
		return function exec_http(req, res, next)
		{
			// CHECK ARGS
			assert(T.isString(arg_cfg_route.collection), context + ':bad collection name')
			
			
			
			// TODO: CHECK ACCESS TO RESOURCE FROM USER
			
			
			
			// LIST RESOURCES
			if (! arg_cfg_route.item)
			{
				// GET RESOURCES LIST
				const resources_list = config.get_resources(arg_cfg_route.collection)
				
				// SEND OUTPUT
				res.contentType = 'json';
				res.send({ resources: resources_list });
				
				return next()
			}
			
			
			// GET ONE RESOURCE
			let resource_is_valid = null
			let resource = null
			
			assert( T.isString(arg_cfg_route.item), context + ':bad collection item string')
			let resource_name = req.params[arg_cfg_route.item];
			assert( T.isString(resource_name) && resource_name.length > 0, context + ':bad resource name [%s]', resource_name)
			
			if (arg_cfg_route.collection === '*')
			{
				resource_is_valid = config.has_resource_by_name(resource_name)
				resource = config.get_resource(resource_name)
			}
			else
			{
				resource_is_valid = config.has_resource_by_type(arg_cfg_route.collection, resource_name)
				resource = config.get_resource_by_type(arg_cfg_route.collection, resource_name)
			}
			assert( resource_is_valid, context + ':not found resource [%s]', resource_name)
			assert( T.isObject(resource), context + ':not found resource [%s]', resource_name)
			
			
			// TODO: SANITY CHECK OF RESOURCE CONFIG (connections...)
			
			// SANITY CHECK OF CONNEXIONS
			if (arg_cfg_route.collection === 'connexions' || resource.type === 'connexions')
			{
				resource.host = 'host';
				resource.port = 'port';
				resource.user_name = 'user';
				resource.user_pwd = '******';
			}
			
			
			// WRAP INCLUDED FILE
			if ( T.isString(resource.include_file_path_name) )
			{
				self.debug('Process resource.include_file_path_name [%s]', resource.include_file_path_name)
				
				resource.include_file_content = self.include_file(resource_name, resource.include_file_path_name)
			}
			
			
			// SEND OUTPUT
			res.contentType = 'json'
			res.send({ resource: resource })
			
			return next()
		}
	}
	
	
	include_file(arg_resource_name, arg_file_path_name)
	{
		const file_path = path.join(__dirname, '../../apps/private/', arg_file_path_name)
		this.debug('Process file_path [%s]', file_path)
		// console.log(file_path, 'file_path')
		
		let content = null
		fs.readFile(file_path, {encoding: 'utf-8'},
			function(err, data)
			{
				if (err)
				{
					var error_msg = context + ':resource include file not found [%s] for resource [%s]'
					throw new Error(error_msg, arg_resource_name, file_path);
				}
				
				this.debug('file is read');
				content = data
			}
		)
		
		return content
	}
}
