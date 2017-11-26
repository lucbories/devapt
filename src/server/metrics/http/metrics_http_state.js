// SERVER IMPORTS
import MetricsState from '../base/metrics_state'



// const context = 'server/metrics/http/metrics_http_state'



/**
 * @file Metrics http state base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsHttpState extends MetricsState
{
    /**
     * Metrics http state constructor.
	 * @extends MetricsState
	 * 
	 * @returns {nothing}
     */
	constructor()
	{
		super('http')
		
		this.is_metrics_http_state = true
		
		// REQUEST VERSIONS
		this.values.version_counters = {}
		
		// REQUEST UUID
		this.values.id_counter = 0
		this.values.pid_counters = {} // { pid1:counter1, pid2:counter2 }
		
		// DURATIONS
		this.values.latency_min = 0
		this.values.latency_counter = 0
		this.values.latency_sum = 0
		this.values.latency_mean = 0
		this.values.latency_max = 0
		
		// SERVICE IDENTIFICATION
		this.values.service_name_counters = {}
		this.values.service_url_counters = {}
		this.values.service_method_counters = {}
		this.values.service_http_version_counters = {} 
		this.values.service_route_counters = {}
		
		// SERVER IDENTIFICATION
		this.values.server_node_name_counters = {}
		this.values.server_server_name_counters = {}
		
		// CLIENT IDENTIFICATION
		this.values.client_user_name_counters = {}
		this.values.client_user_id_counters = {}
		this.values.client_browser_counters = {}
		this.values.client_referrer_counters = {}
	
		// RESPONSE
		this.values.response_status_counters = {}
	}
}
