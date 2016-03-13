
import T from 'typr'
import assert from 'assert'
import restify from 'restify'

import ServiceConsumer from './service_consumer'


let context = 'common/services/base/routes_svc_consumer'



/**
 * Routes service consumer class for middleware routes.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RoutesSvcConsumer extends ServiceConsumer
{
	/**
	 * Create a service consumer for routes.
	 * @param {string} arg_consumer_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_consumer_name, arg_service_instance, arg_context)
	{
		super(arg_consumer_name, arg_service_instance, arg_context ? arg_context : context)
	}
	
	
	/**
	 * Enhance operands if needed
	 * @params {array} arg_operands - Variable list of operands
	 * @returns {array} - array of routes to consume
	 */
	prepare_args(arg_operands)
	{
		this.enter_group('prepare_args')
		
		// GET ARGS ROUTES
		let routes = []
		if (arg_operands.length > 0)
		{
			for(let key in arg_operands)
			{
				// console.log(key, context + ':consume.args.key')
				const arg_item = arg_operands[key]
				// console.log(arg_item, context + ':consume.args.item')
				if ( T.isObject(arg_item) && T.isString(arg_item.route) )
				{
					routes.push(arg_item.route)
				}
			}
		}
		
		// GET DEFAULT ROUTES IF NO ARGS
		if (routes.length == 0)
		{
			const routes_cfg = this.service.get_setting('routes').toJS()
			for(let key in routes_cfg)
			{
				// console.log(key, context + ':consume.args.key')
				const route_cfg = routes_cfg[key]
				// console.log(route_cfg, context + ':consume.args.route_cfg')
				if ( T.isObject(route_cfg) && T.isString(route_cfg.route) )
				{
					routes.push(route_cfg.route)
				}
			}
		}
		this.info(routes, 'routes')
		
		this.leave_group('prepare_args')
		return routes
	}
	
	
	/**
	 * Consume a service on the same host.
	 * @param {object} arg_provider - service provider
	 * @param {array} arg_routes - Routes to request
	 * @return {object} a promise of results
	 */
	consume_local(arg_provider, arg_routes)
	{
		return Promise.resolve(undefined)
	}
	
	
	/**
	 * Consume a service on a remote host
	 * @param {object} arg_provider - service provider
	 * @param {array} arg_routes - Routes to request
	 * @return {object} a promise of results
	 */
	consume_remote(arg_provider, arg_routes)
	{
		this.enter_group('consume_remote')
		
		
		assert( T.isObject(arg_provider) && arg_provider.is_service_provider, context + ':consume_remote:bad service provider')
		assert( T.isArray(arg_routes), context + ':consume_remote:bad routes array')
		
		const app_url = arg_provider.application.url
		const provider_url = this.get_server_url_for(arg_provider)
		
		let self = this
		let promises = []
		
		let get_cb = function()
		{
			let client = restify.createJsonClient(
				{
					url: provider_url,
					version: '~1.0'
				}
			)
			
			for(let key of arg_routes)
			{
				const route = arg_routes[key]
				assert( T.isString(route) && route != '', context + ':consume_remote:bad route string')
				
				const route_app_url = app_url + (route[0] == '/' ? '' : '/') + route
				self.info('svc consume route', route_app_url)
				
				let route_promise = client.get(route_app_url,
					function (err, req, res, obj)
					{
						assert.ifError(err)
						console.log('Server returned: %j', obj)
					}
				)
				
				promises.push(route_promise)
			}
			
			return Promise.all(promises)
		}
		
		
		let promise = new Promise(get_cb)
		this.leave_group('consume_remote')
		return promise
	}
}
