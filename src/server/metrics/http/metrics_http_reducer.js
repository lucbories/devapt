// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import MetricsReducer from '../base/metrics_reducer'
import MetricHttpState from './metrics_http_state'


const context = 'server/metrics/http/metric_hhtp_reducer'



/**
 * @file Reducer class for HTTP metrics collect.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricHttpReducer extends MetricsReducer
{
	/**
	 * Reducer for HTTP metric class.
	 * @extends MetricsReducer
	 * 
	 * @returns {nothing}
	*/
	constructor()
	{
		super('http')
	}
	
	
	
	/**
	 * Reduce metrics records into a state.
	 * 
	 * @param {object} arg_state_values - metrics state values.
	 * @param {object} arg_metrics_values - metrics records values.
	 * @param {MetricsState} arg_state - metrics state.
	 * 
	 * @returns {object} - metrics state values.
	 */
	reduce_one_record(arg_state_values, arg_metrics_values/*, arg_state*/)
	{
		assert( T.isObject(arg_metrics_values) && arg_metrics_values.metric == 'http', context + ':reduce:bad metric object')
		
		// VERSIONS
		this.incr(arg_state_values, 'version_counters', arg_metrics_values.version)
		
		// REQUEST UUID
		arg_state_values.id_counter += 1
		this.incr(arg_state_values, 'pid_counters', arg_metrics_values.pid)
		
		// DURATIONS
		arg_state_values.latency_counter += 1
		arg_state_values.latency_sum += arg_metrics_values.latency
		arg_state_values.latency_mean = arg_state_values.latency_sum / arg_state_values.latency_counter
		arg_state_values.latency_min = (arg_metrics_values.latency < arg_state_values.latency_min) ? arg_metrics_values.latency : arg_state_values.latency_min
		arg_state_values.latency_max = (arg_metrics_values.latency > arg_state_values.latency_max) ? arg_metrics_values.latency : arg_state_values.latency_max
		
		// SERVICE IDENTIFICATION
		this.incr(arg_state_values, 'service_name_counters', arg_metrics_values.service.name)
		this.incr(arg_state_values, 'service_url_counters', arg_metrics_values.service.url)
		this.incr(arg_state_values, 'service_method_counters', arg_metrics_values.service.method)
		this.incr(arg_state_values, 'service_http_version_counters', arg_metrics_values.service.http_version)
		this.incr(arg_state_values, 'service_route_counters', arg_metrics_values.service.route)
		
		// SERVER IDENTIFICATION
		this.incr(arg_state_values, 'server_node_name_counters', arg_metrics_values.server.node_name)
		this.incr(arg_state_values, 'server_server_name_counters', arg_metrics_values.server.server_name)
		
		// CLIENT IDENTIFICATION
		this.incr(arg_state_values, 'client_user_name_counters', arg_metrics_values.client.user_name)
		this.incr(arg_state_values, 'client_user_id_counters', arg_metrics_values.client.user_id)
		this.incr(arg_state_values, 'client_browser_counters', arg_metrics_values.client.browser)
		this.incr(arg_state_values, 'client_referrer_counters', arg_metrics_values.client.referrer)
	
		// RESPONSE
		this.incr(arg_state_values, 'response_status_counters', arg_metrics_values.response.status)
		
		return arg_state_values
	}
	
	
	/**
	 * Create a new state instance.
	 * 
	 * @returns {MetricsHttpState} - a new host metrics state instance.
	 */
	create_state()
	{
		return new MetricHttpState()
	}
}
