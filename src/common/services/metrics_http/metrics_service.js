

// import T from 'typr'
// import assert from 'assert'

import BaseService from '../base/base_service'

import MetricsSvcProvider from './metrics_svc_provider'
import MetricsSvcConsumer from './metrics_svc_consumer'


let context = 'common/services/metrics_http/metrics_service'



/**
 * Service class for metrics datas.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsService extends BaseService
{
	/**
	 * Create a service.
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
		
		this.is_metrics_service = true
	}
	
	
	/**
	 * Create a service provider.
	 * 
	 * @param {string} arg_name - provider name.
	 * @param {Service} arg_service - service instance.
	 * 
	 * @returns {ServiceProvider} - service provider instance.
	 */
	create_provider(arg_name, arg_service)
	{
		// TODO: why not this in place of arg_service
		return new MetricsSvcProvider(arg_name, arg_service)
	}
	
	
	/**
	 * Create a service consumer.
	 * 
	 * @returns {ServiceConsumer} - service consumer instance
	 */
	create_consumer()
	{
		return new MetricsSvcConsumer(this.get_name() + '_consumer_' + this.get_id(), this)
	}
}
