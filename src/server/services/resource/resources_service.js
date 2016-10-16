// SERVER IMPORTS
import BaseService from '../base/base_service'
import ResourcesSvcProvider from './resources_svc_provider'
import ResourcesSvcConsumer from './resources_svc_consumer'


let context = 'server/services/resources/resources_service'



/**
 * Resources service class for resources routes.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class ResourcesService extends BaseService
{
	/**
	 * Create a resources service.
	 * 
	 * CONFIGURATION FORMAT:
	 * 	services.json:
	 * 		"rest_api_resources_query_1":{
	 *			"type":"rest_api_resources_query",
	 *			"routes":[
	 *				{
	 *					"route":"/views",
	 *					"collection":"views" or "*"
	 *				},
	 *				{
	 *					"route":"/views/:name",
	 *					"collection":"views",
	 *					"item":"name"
	 *				}
	 * 
	 * URL REQUEST FORMAT:
	 * 		HTTP GET /.../views: get all views list.
	 * 		HTTP GET /.../views/view_a: get view_a definition.
	 * 
	 * LIST RESPONSE:         HTTP GET response with payload { resources: resources_list }
	 * ONE RESOURCE RESPONSE: HTTP GET response with payload { resource: resource.export_settings() }
	 * ERROR RESPONSE:        HTTP GET response with payload { error: 'Resource not found [' + resource_name + ']' }
	 * 
	 * WEBSOCKET REQUEST FORMAT:
	 * 		get: { resource:'', collection:'' }
	 * 		list: { collection:'' }
	 * 
	 * WEBSOCKET RESPONSE: on success { service:svc_name, operation:'get|list', result:'done', datas:'list of resources or one resource response' }
	 *                     on error   { service:svc_name, operation:'get|list', result:'error', datas:'error text' }
	 * 
	 * @param {string} arg_svc_name - service name.
	 * @param {object} arg_service_settings - service settings.
	 * @param {string} arg_context - logging context label.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_svc_name, arg_service_settings, arg_context)
	{
		super(arg_svc_name, arg_service_settings, arg_context ? arg_context : context)
		
		this.is_resources_service = true
	}
	
	
	/**
	 * Create a service provider.
	 * @param {string} arg_name - provider name
	 * @param {Service} arg_service - service instance
	 * @returns {ServiceProvider} - service provider instance
	 */
	create_provider(arg_name, arg_service)
	{
		// TODO: why not this in place of arg_service
		return new ResourcesSvcProvider(arg_name, arg_service)
	}
	
	
	/**
	 * Create a service consumer.
	 * @returns {ServiceConsumer} - service consumer instance
	 */
	create_consumer()
	{
		return new ResourcesSvcConsumer(this.get_name() + '_consumer_' + this.get_id(), this)
	}
}
