
import T from 'typr'
import assert from 'assert'



export default class MetricHttpState
{
	constructor()
	{
		this.is_metric_http_state = true
		
		this.metrics = {}
		
		// REQUEST VERSIONS
		this.metrics.version_counters = {}
		
		// REQUEST UUID
		this.metrics.id_counter = 0
		this.metrics.pid_counters = {} // { pid1:counter1, pid2:counter2 }
		
		// DURATIONS
		this.metrics.latency_min = 0
		this.metrics.latency_counter = 0
		this.metrics.latency_sum = 0
		this.metrics.latency_mean = 0
		this.metrics.latency_max = 0
		
		// SERVICE IDENTIFICATION
		this.metrics.service_name_counters = {}
		this.metrics.service_url_counters = {}
		this.metrics.service_method_counters = {}
		this.metrics.service_http_version_counters = {} 
		this.metrics.service_route_counters = {}
		
		// SERVER IDENTIFICATION
		this.metrics.server_node_name_counters = {}
		this.metrics.server_server_name_counters = {}
		
		// CLIENT IDENTIFICATION
		this.metrics.client_user_name_counters = {}
		this.metrics.client_user_id_counters = {}
		this.metrics.client_browser_counters = {}
		this.metrics.client_referrer_counters = {}
	
		// RESPONSE
		this.metrics.response_status_counters = {}
	}
    
    get_values()
    {
        return this.metrics
    }
}
