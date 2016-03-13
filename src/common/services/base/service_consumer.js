
import T from 'typr'
import assert from 'assert'

import Instance from '../../base/instance'
import { is_browser, is_server } from '../../utils/is_browser'
import { is_remote, is_locale } from '../../utils/is_remote'


let context = 'common/services/base/service_consumer'



/**
 * Service consumer base class.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ServiceConsumer extends Instance
{
	/**
	 * Create a service consumer.
	 * @param {string} arg_consumer_name - consumer name
	 * @param {Service} arg_service_instance - service instance
	 * @param {string} arg_context - logging context label
	 * @returns {nothing}
	 */
	constructor(arg_consumer_name, arg_service_instance, arg_context)
	{
		assert( T.isString(arg_consumer_name), context + ':bad consumer name string')
		assert( T.isObject(arg_service_instance) && arg_service_instance.is_service, context + ':bad service object')
		
		super('svc_consumers', 'ServiceConsumer', arg_consumer_name, arg_service_instance.get_settings(), arg_context ? arg_context : context)
		
		this.is_service_consumer = true
		this.service = arg_service_instance
	}
	
	
	/**
	 * Get service instance.
	 * @returns {Service}
	 */
	get_service()
	{
		return (T.isObject(this.service) && this.service.is_service) ? this.service : null
	}
	
	
	/**
	 * Load settings
	 * @abstract
	 * @returns {nothing}
	 */
	load()
	{
	}
	
	
	/**
	 * Enhance operands if needed
	 * @abstract
	 * @params {array} arg_operands - Variable list of operands
	 * @returns {array} - array of operands
	 */
	prepare_args(arg_operands)
	{
		return arg_operands
	}
	
	
	/**
	 * Get consumed service server url.
	 * @param {object} arg_provider - service provider
	 * @returns {string} - server url
	 */
	get_server_url_for(arg_provider)
	{
		assert( T.isObject(arg_provider) && arg_provider.is_service_provider, context + ':get_url_for:bad provider object')

		const host = arg_provider.server.server_host
		const port = arg_provider.server.server_port
		const proto = arg_provider.server.server_protocole

		const url = proto + '://' + host + ':' + port
		this.debug('get_server_url_for', url)
		// console.log(context + ':get_url_for', url)

		return url
	}
	
	
	/**
	 * Get consumed service application url.
	 * @param {object} arg_provider - service provider
	 * @returns {string} - service url
	 */
	get_app_url_for(arg_provider)
	{
		let url = this.get_server_url_for(arg_provider)
		const app_url = arg_provider.application.url
		
		return url + '/' + app_url
	}
	
	
	/**
	 * Get consumed service url.
	 * @param {object} arg_provider - service provider
	 * @param {string|object} arg_operands - consumer operands as {url:...} (to consume a service with an url)
	 * @returns {string} - service url
	 */
	get_url_for(arg_provider, arg_operands)
	{
		let url = this.get_app_url_for(arg_provider)
		const opds_url = T.isString(arg_operands) ? arg_operands : (T.isObject(arg_operands) ? arg_operands.url : null)
		
		return url + (opds_url ? '/' + opds_url : '')
	}
	
	
	/**
	 * Consume datas from service producer.
	 * @params {...objects} args - Variable list of operands object
	 * @returns {Promise} - promise of results
	 */
	consume(...args)
	{
		this.enter_group('consume')
		
		let promise = null
		
		try
		{
			const operands = this.prepare_args(args)

			// SERVER
			if ( is_server() )
			{
				this.info('svc consumer is on a server')

				promise = this.consume_from_server(operands)
				
				this.leave_group('consume')
				return promise
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
	 * Consume service on a server
	 * @params {array} arg_operands - operands object array
	 * @returns {Promise} - promise of results
	 */
	consume_from_server(arg_operands)
	{
		this.enter_group('consume_on_server')
		
		let promise = null
		
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

			promise = this.consume_same_local_server(provider, arg_operands)
			
			this.leave_group('consume_on_server')
			return promise
		}

		// LOCAL OTHER SERVER
		if ( is_locale(host) )
		{
			this.info('svc consumer is on an other local server (host, port)')

			promise = this.consume_other_local_server(provider, arg_operands)
			
			this.leave_group('consume_on_server')
			return promise
		}

		// REMOTE SERVER
		if ( is_remote(host) )
		{
			this.info('svc consumer is on a remote server (host, port)')

			promise = this.consume_other_remote_server(provider, arg_operands)
			
			this.leave_group('consume_on_server')
			return promise
		}
		
		promise = Promise.resolve(undefined)
		this.leave_group('consume_on_server: failure')
		return promise
	}
	
	
	/**
	 * Consume a service on the same local server (same host, same port)
	 * @param {object} arg_provider - service provider
	 * @param {array} arg_operands - consumer operands
	 * @returns {Promise} - promise of service results
	 */
	consume_same_local_server(arg_provider, arg_operands)
	{
		return this.consume_local(arg_operands)
	}
	
	
	/**
	 * Consume a service on an other local server (same host, other port)
	 * @param {object} arg_provider - service provider
	 * @param {array} arg_operands - consumer operands
	 * @returns {Promise} - promise of service results
	 */
	consume_other_local_server(arg_provider, arg_operands)
	{
		return this.consume_local(arg_operands)
	}
	
	
	/**
	 * Consume a service on an other remote server (other host)
	 * @param {object} arg_provider - service provider
	 * @param {array} arg_operands - consumer operands
	 * @returns {Promise} - promise of service results
	 */
	consume_other_remote_server(arg_provider, arg_operands)
	{
		return this.consume_remote(arg_provider, arg_operands)
	}
	
	
	/**
	 * Consume a service from a browser
	 * @param {array} arg_operands - consumer operands
	 * @returns {Promise} - promise of service results
	 */
	consume_from_browser(arg_operands)
	{
		return this.consume_remote(arg_operands)
	}
	
	
	/**
	 * Consume a service on the same host
	 * @abstract
	 * @param {object} arg_provider - service provider
	 * @param {array} arg_operands - consumer operands
	 * @returns {Promise} - promise of service results
	 */
	consume_local(arg_provider, arg_operands)
	{
		return Promise.resolve(undefined)
	}
	
	/**
	 * Consume a service on a remote host
	 * @abstract
	 * @param {object} arg_provider - service provider
	 * @param {array} arg_operands - consumer operands
	 * @returns {Promise} - promise of service results
	 */
	consume_remote(arg_provider, arg_operands)
	{
		return Promise.resolve(undefined)
	}
}
