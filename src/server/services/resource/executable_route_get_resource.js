// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import fs from 'fs'

// SERVER IMPORTS
import runtime from '../../base/runtime'
import ExecutableRoute from '../../executables/executable_route'


let context = 'server/services/base/executable_route_get_resources'



/**
 * @file Get resource route registering class.
 * @todo check resources accesses
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ExecutableRouteGetResources extends ExecutableRoute
{
    /**
     * Create a ExecutableRouteGetResources instance.
	 * @extends ExecutableRoute
	 * 
	 * @param {ServiceProvider} arg_provider - service provider.
	 * 
	 * @returns {nothing}
     */
	constructor(arg_provider)
	{
		super(context)

		// this.provider = arg_provider
	}
	
	
	
    /**
     * Get a collection resources list.
	 * 
     * @param {object} res - response instance
     * @param {object} arg_application - Application instance.
     * @param {object} arg_cfg_route - plain object route configuration.
	 * 
     * @returns {nothing}
     */
	send_resources_list(res, arg_application, arg_cfg_route)
	{
		this.info('LIST resources')
				
		// GET RESOURCES LIST
		const resources_list = arg_application.get_resources_names(arg_cfg_route.collection)
		
		// SEND OUTPUT
		res.contentType = 'json';
		res.send({ resources: resources_list });
	}
	
	
	/**
     * Callback for route handling.
     * @override
     * @param {object} arg_application - Application instance.
     * @param {object} arg_cfg_route - plain object route configuration.
     * @param {object} arg_data - plain object contextual datas.
     * @param {function} route handler.
     */
	get_route_cb(arg_application, arg_cfg_route, arg_data)
	{
		let self = this
		
		return function exec_http(req, res, next)
		{
			// self.enable_trace()
			
			self.enter_group('ExecutableRouteGetResources.exec_http')
			
			// CHECK ARGS
			assert(T.isString(arg_cfg_route.collection), context + ':bad collection name')
			// console.log(arg_cfg_route, 'arg_cfg_route')
			
			
			// TODO: CHECK ACCESS TO RESOURCE FROM USER
			
			
			
			// LIST RESOURCES
			if (! arg_cfg_route.item)
			{
				self.send_resources_list(res, arg_application, arg_cfg_route)
				
				self.leave_group('ExecutableRouteGetResources.exec_http')
				return
			}
			assert( T.isString(arg_cfg_route.item), context + ':bad collection item string')
			
			
			// GET RESOURCE NAME
			let resource = null
			let resource_name = req.params[arg_cfg_route.item];
			assert( T.isString(resource_name), context + ':bad resource name [%s]', resource_name)
			
			if (resource_name.length == 0)
			{
				self.send_resources_list(res, arg_application, arg_cfg_route)
				
				self.leave_group('ExecutableRouteGetResources.exec_http')
				return
			}
			
			
			// GET ONE RESOURCE
			self.info('GET one resource')
			if (arg_cfg_route.collection === '*')
			{
				self.info('GET one resource [' + resource_name + '] of any collection')
				
				resource = arg_application.find_resource(resource_name)
			}
			else
			{
				self.info('GET one resource [' + resource_name + '] of one collection [' + arg_cfg_route.collection + ']')
				
				// LOOKUP RESOURCE
				resource = arg_application.find_resource(resource_name, arg_cfg_route.collection)
				if ( ! resource)
				{
					self.debug('resource not found [' + resource_name + ']')
					console.error('bad resource type')
					console.log(resource.$type, 'resource.$type')
					console.log(arg_cfg_route.collection, 'arg_cfg_route.collection')
					resource = null
				}
				
				// CHECK RESOURCE TYPE
				// if (resource && resource.$type != arg_cfg_route.collection)
				// {
				// }
			}
			
			// RESOURCE NOT FOUND ?
			if ( ! T.isObject(resource) )
			{
				// SEND OUTPUT
				res.status(404)
				res.contentType = 'json'
				res.send({ error: 'Resource not found [' + resource_name + ']' })
				
				// next( new Error('Resource not found [' + resource_name + ']') )
				return
			}
			
			
			// TODO: SANITY CHECK OF RESOURCE CONFIG (connections...)
			
			
			
			// WRAP INCLUDED FILE
			if ( resource.has_setting('include_file_path_name') )
			{
				self.debug('Process resource.include_file_path_name [%s]', resource.include_file_path_name)
				
				const file_path = resource.get_setting('include_file_path_name')
				if ( T.isString(file_path) )
				{
					try
					{
						const file_content = self.include_file(self, resource_name, file_path)
						resource.set_setting('include_file_content', file_content)
					}
					catch(e)
					{
						const error_msg = 'an error occures when loading file [' + e.toString() + ']'
						resource.set_setting('include_file_content', error_msg)
						self.error(error_msg)
						console.error(error_msg)
					}
				}
			}
			
			
			// SEND OUTPUT
			res.contentType = 'json'
			res.send({ resource: resource.export_settings() })
			
			self.leave_group('ExecutableRouteGetResources.exec_http')
			return
		}
	}
	
	
    /**
     * Load an asset file for a resource
     * @param {object} self - this class instance
     * @param {string} arg_resource_name - resource name
     * @param {string} arg_file_path_name - file path name
     * @returns {string} file content
     */
	include_file(self, arg_resource_name, arg_file_path_name)
	{
		const file_path = runtime.context.get_absolute_path(arg_file_path_name)
		self.debug('Process file_path [%s]', file_path)
		
		
		let content = fs.readFileSync(file_path, {encoding: 'utf-8'} )
		
		if (! content)
		{
			var error_msg = context + ':resource include file not found [' + arg_resource_name + '] for resource [' + file_path + ']'
			console.error('loading resource include file')
			throw new Error(error_msg);
		}
		
		
		console.log('loading resource include file: return')
		return content
	}
}
