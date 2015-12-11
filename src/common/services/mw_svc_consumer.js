
import T from 'typr'
import assert from 'assert'
import restify from 'restify'

import { is_browser, is_server } from '../utils/is_browser'
import { is_remote, is_locale } from '../utils/is_remote'

import ServiceConsumer from './service_consumer'


let context = 'common/services/mw_svc_consumer'



export default class MidlewareSvcConsumer extends ServiceConsumer
{
	// CONSTRUCTOR
	constructor(arg_consumer_name, arg_service_instance, arg_context)
	{
		super(arg_consumer_name, arg_service_instance, arg_context ? arg_context : context)
		
	}
	
	
	// CONSUME DATAS FROM SERVICE PRODUCERS
	consume()
	{
		this.info('consume()')
		
		// GET ARGS ROUTES
		let routes = []
		if (arguments.length > 0)
		{
			for(let key in arguments)
			{
				// console.log(key, context + ':consume.args.key')
				const arg_item = arguments[key]
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
		
		// SERVER
		if ( is_server() )
		{
			this.info('svc consumer is on a server')
			/*
			const host = this.service.provider.server.server_host
			const port = this.service.provider.server.server_port
			// const url = this.service.provider.application.url
			
			// LOCAL SAME SERVER
			if ( is_locale(host, port) )
			{
				this.info('svc consumer is on the same local server (host, port)')
				return Promise.resolve(undefined)
			}
			
			// LOCAL OTHER SERVER
			if ( is_locale(host) )
			{
				this.info('svc consumer is on an other local server (host, port)')
				return Promise.resolve(undefined)
			}
			
			// REMOTE SERVER
			if ( is_remote(host) )
			{
				this.info('svc consumer is on a remote server (host, port)')
				return Promise.resolve(undefined)
			}
			*/
		}
		
		
		// BROWSER
		if ( is_browser() )
		{
			this.info('svc consumer is on a browser')
			
			const host = this.service.provider.server.server_host
			const port = this.service.provider.server.server_port
			const url = this.service.provider.application.url
			let self = this
			
			let get_cb = function()
			{
				let client = restify.createJsonClient(
					{
						url: 'http://' + host + ':' + port,
						version: '~1.0'
					}
				)
				
				for(let key of routes)
				{
					const route = url + routes[key]
					self.info('svc consume route', route)
					
					client.get(route,
						function (err, req, res, obj)
						{
							assert.ifError(err);
							console.log('Server returned: %j', obj);
						}
					)
				}
			}
			return new Promise(get_cb)
		}
		
		
		return Promise.resolve(undefined)
	}
}
