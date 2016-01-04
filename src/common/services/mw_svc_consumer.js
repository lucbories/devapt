
import T from 'typr'
import assert from 'assert'
import restify from 'restify'

import { is_browser, is_server } from '../utils/is_browser'
import { is_remote, is_locale } from '../utils/is_remote'

import ServiceConsumer from './service_consumer'


let context = 'common/services/mw_svc_consumer'


/**
 * Service consumer class for middleware routes 
 */
export default class MidlewareSvcConsumer extends ServiceConsumer
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
     * ENHANCE ARGUMENTS IF NEEDED
     * {array} Variable list of operands
     * {return} an array of operands
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
        return [routes]
    }
    
    
    /**
     * Consume a service on the same host
     * {object}  service provider
     * {array}  Routes to request
     * {return} a promise of results
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
        
        const host = arg_provider.server.server_host
        const port = arg_provider.server.server_port
        const proto = arg_provider.server.server_protocole
        const url = arg_provider.application.url
        
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
                // console.log(context + ':route', route)
                
                let route_promise = client.get(route,
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
