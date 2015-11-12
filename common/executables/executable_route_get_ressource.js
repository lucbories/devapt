import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'

import { store, config } from '../store/index'
// import runtime from '../base/runtime'

import ExecutableRoute from './executable_route'


let context = 'common/services/executable_route_get_resources'



export default class ExecutableRouteGetResources extends ExecutableRoute
{
	constructor()
	{
		super(context)
	}
	
	
	get_route_cb(arg_application, arg_cfg_route, arg_data)
	{
		let self = this
		
		return function exec_http(req, res, next)
		{
			self.enter_group('ExecutableRouteGetResources.exec_http')
			
			// CHECK ARGS
			assert(T.isString(arg_cfg_route.collection), context + ':bad collection name')
			
			
			
			// TODO: CHECK ACCESS TO RESOURCE FROM USER
			
			
			
			// LIST RESOURCES
			if (! arg_cfg_route.item)
			{
				self.info('LIST resources')
				
				// GET RESOURCES LIST
				// const resources_list = config.get_resources(arg_cfg_route.collection)
				const resources_list = arg_application.resources.get_all_names(arg_cfg_route.collection)
				
				// SEND OUTPUT
				res.contentType = 'json';
				res.send({ resources: resources_list });
				
				self.leave_group('ExecutableRouteGetResources.exec_http')
				return next()
			}
			
			
			// GET ONE RESOURCE
			self.info('GET one resource')
			// let resource_is_valid = null
			let resource = null
			
			assert( T.isString(arg_cfg_route.item), context + ':bad collection item string')
			let resource_name = req.params[arg_cfg_route.item];
			assert( T.isString(resource_name) && resource_name.length > 0, context + ':bad resource name [%s]', resource_name)
			
			if (arg_cfg_route.collection === '*')
			{
				self.info('GET one resource [' + resource_name + '] of any collection')
				
				resource = arg_application.resources.find_by_name(resource_name)
			}
			else
			{
				self.info('GET one resource [' + resource_name + '] of one collection [' + arg_cfg_route.collection + ']')
				
				resource = arg_application.resources.find_by_name(resource_name)
				if (resource)
				{
					self.debug('resource found but test collection name')
					assert(resource.$type == arg_cfg_route.collection, context + ':bad type [' + resource.$type + '] for resource [' + resource_name + ']')
				}
				else
				{
					self.debug('resource not found [' + resource_name + ']')
					const resources = arg_application.resources.get_all_names()
					console.log(resources, 'arg_application.resources')
				}
				// if (resource && resource.$type != arg_cfg_route.collection)
				// {
				// 	resource = null
				// }
			}
			// assert( resource_is_valid, context + ':not found valid resource [%s]', resource_name)
			assert( T.isObject(resource), context + ':not found resource [' + resource_name + ']')
			
			
			// TODO: SANITY CHECK OF RESOURCE CONFIG (connections...)
			
			
			// WRAP INCLUDED FILE
			if ( T.isString(resource.include_file_path_name) )
			{
				self.debug('Process resource.include_file_path_name [%s]', resource.include_file_path_name)
				
				resource.include_file_content = self.include_file(resource_name, resource.include_file_path_name)
			}
			
			
			// SEND OUTPUT
			res.contentType = 'json'
			res.send({ resource: resource.export_settings() })
			
			self.leave_group('ExecutableRouteGetResources.exec_http')
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
