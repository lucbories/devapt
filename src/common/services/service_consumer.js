
import T from 'typr'
import assert from 'assert'

import Instance from '../base/instance'
import { is_browser, is_server } from '../utils/is_browser'
import { is_remote, is_locale } from '../utils/is_remote'


let context = 'common/services/service_consumer'



export default class ServiceConsumer extends Instance
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
		assert( T.isString(arg_consumer_name), context + ':bad consumer name string')
		assert( T.isObject(arg_service_instance) && arg_service_instance.is_service, context + ':bad service object')
		
		super('svc_consumers', 'ServiceConsumer', arg_consumer_name, arg_service_instance.get_settings(), arg_context ? arg_context : context)
		
        this.is_service_consumer = true
		this.service = arg_service_instance
	}
    
    
    get_service()
    {
        return (T.isObject(this.service) && this.service.is_service) ? this.service : null
    }
	
	
    /**
     * LOAD A SERVICE CONSUMER
     * {return} nothing
     */
	load()
	{
	}
	
    
    /**
     * ENHANCE ARGUMENTS IF NEEDED
     * {array} Variable list of operands
     * {return} an array of operands
     */
	prepare_args(arg_operands)
    {
        return arg_operands
    }
	
	
    /**
     * LOAD A SERVICE CONSUMER
     * {object} consumer operand to consume a service with an url
     * {return} nothing
     */
	get_url_for(arg_provider, arg_operands)
	{
        assert( T.isObject(arg_provider) && arg_provider.is_service_provider, context + ':get_url_for:bad provider object')
        assert( T.isObject(arg_operands) && T.isString(arg_operands.url), context + ':get_url_for:bad opds.url operands string')
        
        const opds_url = arg_operands.url
        
        const host = arg_provider.server.server_host
        const port = arg_provider.server.server_port
        const proto = arg_provider.server.server_protocole
        const app_url = arg_provider.application.url
        
        const url = proto + '://' + host + ':' + port + '/' + app_url + '/' + opds_url
        this.debug('get_url_for', url)
        // console.log(context + ':get_url_for', url)
        
        return url
	}
    
    
    /**
     * CONSUME DATAS FROM SERVICE PRODUCERS
     * {object} Variable list of route object
     * {return} a promise of results
     */
	consume(...args)
	{
		this.enter_group('consume')
		
        let promise = null
        
		try
        {
            args = this.prepare_args(args)
            
            // SERVER
            if ( is_server() )
            {
                this.info('svc consumer is on a server')
                
                const service = this.get_service()
                assert( T.isObject(service) && service.is_service, context + ':consume:bad service object')
                
                // TODO: QUESTION, should we always use the same producer for each consumer and register it to consumer.producer?
                // YES: less search, we need to work on the same producer during the step
                // NO: what about producer failure or overload
                const strategy = null
                const provider = service.get_a_provider(strategy)
                assert( T.isObject(provider), context + ':consume:bad service provider object')
                
                const host = provider.get_host()
                const port = provider.get_port()
                
                // LOCAL SAME SERVER
                if ( is_locale(host, port) )
                {
                    this.info('svc consumer is on the same local server (host, port)')
                    
                    return this.consume_same_local_server(provider, args)
                }
                
                // LOCAL OTHER SERVER
                if ( is_locale(host) )
                {
                    this.info('svc consumer is on an other local server (host, port)')
                    
                    promise = this.consume_other_local_server(provider, args)
                    this.leave_group('consume')
                    return promise
                }
                
                // REMOTE SERVER
                if ( is_remote(host) )
                {
                    this.info('svc consumer is on a remote server (host, port)')
                    
                    promise = this.consume_other_remote_server(provider, args)
                    this.leave_group('consume')
                    return promise
                }
            }
            
            
            // BROWSER
            if ( is_browser() )
            {
                this.info('svc consumer is on a browser')
                
                promise = this.consume_from_browser(args)
                this.leave_group('consume')
                return promise
            }
        }
        catch(e)
        {
            this.error(context + ':consume', e)
        }
		
        promise = Promise.resolve(undefined)
        this.leave_group('consume')
		return promise
	}
    
    
    /**
     * Consume a service on the same local server (same host, same port)
     * {object}  service provider
     * {array}  operands
     * {return} a promise of results
     */
    consume_same_local_server(arg_provider, arg_operands)
    {
        return this.consume_local(arg_operands)
    }
    
    
    /**
     * Consume a service on an other local server (same host, other port)
     * {object}  service provider
     * {array}  operands
     * {return} a promise of results
     */
    consume_other_local_server(arg_provider, arg_operands)
    {
        return this.consume_local(arg_operands)
    }
    
    
    /**
     * Consume a service on an other remote server (other host)
     * {object}  service provider
     * {array}  operands
     * {return} a promise of results
     */
    consume_other_remote_server(arg_provider, arg_operands)
    {
        return this.consume_remote(arg_provider, arg_operands)
    }
    
    
    /**
     * Consume a service from a browser
     * {array}  operands
     * {return} a promise of results
     */
    consume_from_browser(arg_operands)
    {
        return this.consume_remote(arg_operands)
    }
    
    
    /**
     * Consume a service on the same host
     * {object}  service provider
     * {array}  operands
     * {return} a promise of results
     */
    consume_local(arg_provider, arg_operands)
    {
        return Promise.resolve(undefined)
    }
    
    /**
     * Consume a service on a remote host
     * {object}  service provider
     * {array}  operands
     * {return} a promise of results
     */
    consume_remote(arg_provider, arg_operands)
    {
		return Promise.resolve(undefined)
    }
}
