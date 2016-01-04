
import T from 'typr'
import assert from 'assert'
import restify from 'restify'

import { is_browser, is_server } from '../utils/is_browser'
import { is_remote, is_locale } from '../utils/is_remote'

import ServiceConsumer from './service_consumer'


let context = 'common/services/crud_svc_consumer'


/**
 * Service consumer class for crud routes 
 */
export default class CrudSvcConsumer extends ServiceConsumer
{
	/**
     * Constructor
     * {string} consumer name
     * {object} service instance
     * {string} logging context label
     * {return} nothing
     */
	constructor(arg_consumer_name, arg_service_instance, arg_context)
	{
		super(arg_consumer_name, arg_service_instance, arg_context ? arg_context : context)
		
	}
	
	
	/**
     * CONSUME DATAS FROM SERVICE PRODUCERS
     * {object} Variable list of route object
     * {return} a promise of results
     */
	consume()
	{
		this.enter_group('consume')
		
		// GET ARGS ROUTES
		let routes = []
        let promise = null
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
			
			const host = this.service.provider.server.server_host
			const port = this.service.provider.server.server_port
			// const url = this.service.provider.application.url
			
			// LOCAL SAME SERVER
			if ( is_locale(host, port) )
			{
				this.info('svc consumer is on the same local server (host, port)')
				
                return this.consume_remote(routes)
			}
			
			// LOCAL OTHER SERVER
			if ( is_locale(host) )
			{
				this.info('svc consumer is on an other local server (host, port)')
				
                promise = this.consume_remote(routes)
                this.leave_group('consume')
                return promise
			}
			
			// REMOTE SERVER
			if ( is_remote(host) )
			{
				this.info('svc consumer is on a remote server (host, port)')
				
                promise = this.consume_remote(routes)
                this.leave_group('consume')
                return promise
			}
		}
		
		
		// BROWSER
		if ( is_browser() )
		{
			this.info('svc consumer is on a browser')
			
            promise = this.consume_remote(routes)
            this.leave_group('consume')
            return promise
		}
		
		
        promise = Promise.resolve(undefined)
        this.leave_group('consume')
		return promise
	}
    
    
    /**
     * Consume a service on the same host
     * {array}  Routes to request
     * {return} a promise of results
     */
    consume_local(arg_routes)
    {
        return Promise.resolve(undefined)
    }
    
    
    /**
     * Consume a service on a remote host
     * {array}  Routes to request
     * {return} a promise of results
     */
    consume_remote(arg_routes)
    {
        this.enter_group('consume_remote')
        
        // GET ARGS
        const args = arguments.length > 1 ? arguments : null
        const host = this.service.provider.server.server_host
        const port = this.service.provider.server.server_port
        const proto = this.service.provider.server.server_protocole
        const url = this.service.provider.application.url
        let self = this
        let promises = []
        
        let get_cb = function()
        {
            let client = restify.createJsonClient(
                {
                    url: proto + '://' + host + ':' + port,
                    version: '~1.0'
                }
            )
            
            for(let key of arg_routes)
            {
                const route = url + arg_routes[key]
                self.info('svc consume route', route)
                
                let route_promise = client.get(route, // TODO use args
                    function (err, req, res, obj)
                    {
                        assert.ifError(err);
                        console.log('Server returned: %j', obj);
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
