
import T from 'typr'
import assert from 'assert'

import Instance from '../../base/instance'
import { is_browser, is_server } from '../../utils/is_browser'
// import { is_remote, is_locale } from '../../utils/is_remote'


let context = 'common/services/base/service_consumer_base'



/**
 * Service consumer base class.
 * @abstract
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ServiceConsumerBase extends Instance
{
	/**
	 * Create a service consumer.
	 * 
	 * @param {string} arg_consumer_name - consumer name.
	 * @param {Service} arg_service_instance - service instance.
	 * @param {string} arg_context - logging context label.
	 * 
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
	 * 
	 * @returns {Service}
	 */
	get_service()
	{
		return (T.isObject(this.service) && this.service.is_service) ? this.service : null
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
	 * Consume datas from service producer.
	 * 
	 * @params {...objects} args - Variable list of operands object.
	 * 
	 * @returns {Promise} - promise of results.
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
	 * Is requested service on the same Node ?
	 * 
	 * @returns {boolean}
	 */
	is_service_on_same_node()
	{
		return true
	}


	
	/**
	 * Consume service on a server.
	 * 
	 * @params {array} arg_operands - operands object array.
	 * 
	 * @returns {Promise} - promise of results.
	 */
	consume_from_server(arg_operands)
	{
		this.enter_group('consume_on_server')
		

		if ( this.is_service_on_same_node() )
		{
			const service = this.get_service()
			assert( T.isObject(service) && service.is_service, context + ':consume_from_server:bad service object')
			
			const provider = service.get_provider()
			const promise = this.consume_local(provider, arg_operands)

			this.leave_group('consume_on_server:consume on the same Node')
			return promise
		}


		const promise = this.consume_remote(arg_operands)
		this.leave_group('consume_on_server:consume not on the same Node')
		return promise
	}

	
	
	/**
	 * Consume a service from a browser.
	 * 
	 * @param {array} arg_operands - consumer operands.
	 * 
	 * @returns {Promise} - promise of service results.
	 */
	consume_from_browser(arg_operands)
	{
		return this.consume_remote(arg_operands)
	}
	
	

	/**
	 * Consume a service on the same host.
	 * @abstract
	 * 
	 * @param {object} arg_provider - service provider.
	 * @param {array} arg_operands - consumer operands.
	 * 
	 * @returns {Promise} - promise of service results.
	 */
	consume_local(/*arg_provider, arg_operands*/)
	{
		return Promise.resolve(undefined)
	}
	


	/**
	 * Consume a service on a remote host
	 * @abstract
	 * 
	 * @param {array} arg_operands - consumer operands.
	 * 
	 * @returns {Promise} - promise of service results.
	 */
	consume_remote(/*arg_operands*/)
	{
		return Promise.resolve(undefined)
	}
}
