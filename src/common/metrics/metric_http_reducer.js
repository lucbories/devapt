
import T from 'typr'
import assert from 'assert'

import MetricHttp from './metric_http'
import MetricHttpState from './metric_http_state'


const context = 'common/metrics/metric_hhtp_reducer'



export default class MetricHttpReducer
{
	constructor()
	{
	}
	
	
	reduce(arg_state, arg_metric)
	{
		assert( T.isObject(arg_state) && arg_state.is_metric_http_state, context + ':reduce:bad state object')
		assert( T.isObject(arg_metric) || T.isArray(arg_metric), context + ':reduce:bad metric object or array' )
        
        arg_metric = T.isArray(arg_metric) ? arg_metric : [arg_metric]
        
        for(let loop_metric of arg_metric)
        {
            assert( T.isObject(loop_metric) && loop_metric.metric == 'http', context + ':reduce:bad metric object')
            
            // VERSIONS
            this.incr(arg_state, 'version_counters', loop_metric.version)
            
            // REQUEST UUID
            arg_state.metrics.id_counter += 1
            this.incr(arg_state, 'pid_counters', loop_metric.pid)
            
            // DURATIONS
            arg_state.metrics.latency_counter += 1
            arg_state.metrics.latency_sum += loop_metric.latency
            arg_state.metrics.latency_mean = arg_state.metrics.latency_sum / arg_state.metrics.latency_counter
            arg_state.metrics.latency_min = (loop_metric.latency < arg_state.metrics.latency_min) ? loop_metric.latency : arg_state.metrics.latency_min
            arg_state.metrics.latency_max = (loop_metric.latency > arg_state.metrics.latency_max) ? loop_metric.latency : arg_state.metrics.latency_max
            
            // SERVICE IDENTIFICATION
            this.incr(arg_state, 'service_name_counters', loop_metric.service.name)
            this.incr(arg_state, 'service_url_counters', loop_metric.service.url)
            this.incr(arg_state, 'service_method_counters', loop_metric.service.method)
            this.incr(arg_state, 'service_http_version_counters', loop_metric.service.http_version)
            this.incr(arg_state, 'service_route_counters', loop_metric.service.route)
            
            // SERVER IDENTIFICATION
            this.incr(arg_state, 'server_node_name_counters', loop_metric.server.node_name)
            this.incr(arg_state, 'server_server_name_counters', loop_metric.server.server_name)
            
            // CLIENT IDENTIFICATION
            this.incr(arg_state, 'client_user_name_counters', loop_metric.client.user_name)
            this.incr(arg_state, 'client_user_id_counters', loop_metric.client.user_id)
            this.incr(arg_state, 'client_browser_counters', loop_metric.client.browser)
            this.incr(arg_state, 'client_referrer_counters', loop_metric.client.referrer)
        
            // RESPONSE
            this.incr(arg_state, 'response_status_counters', loop_metric.response.status)
        }
        
		return arg_state
	}
    
    
    incr(arg_state, arg_state_key, arg_metric_key)
    {
        arg_state_key = arg_state_key ? arg_state_key : 'unknow'
        
        if ( ! (arg_state_key in arg_state.metrics) )
        {
            arg_state.metrics[arg_state_key] = {}
        }
        
        if ( ! (arg_metric_key in arg_state.metrics[arg_state_key]) )
        {
            arg_state.metrics[arg_state_key][arg_metric_key] = 0
        }
        
        arg_state.metrics[arg_state_key][arg_metric_key] += 1
    }
    
	
	create_state()
	{
		return new MetricHttpState()
	}
}

/*
		arg_state.metrics.versions = {}
		
		// REQUEST UUID
		arg_state.metrics.id_counter = 0
		arg_state.metrics.pid_counters = {} // { pid1:counter1, pid2:counter2 }
		
		// DURATIONS
		arg_state.metrics.latency_min = undefined
		arg_state.metrics.latency_counter = 0
		arg_state.metrics.latency_sum = 0
		arg_state.metrics.latency_mean = undefined
		arg_state.metrics.latency_max = undefined
		
		// SERVICE IDENTIFICATION
		arg_state.metrics.service_name_counters = {}
		arg_state.metrics.service_url_counters = {}
		arg_state.metrics.service_method_counters = {}
		arg_state.metrics.service_http_version_counters = {} 
		arg_state.metrics.service_route_counters = {}
		
		// SERVER IDENTIFICATION
		arg_state.metrics.server_node_name_counters = {}
		
		// CLIENT IDENTIFICATION
		arg_state.metrics.client_user_name_counters = {}
		arg_state.metrics.client_user_id_counters = {}
		arg_state.metrics.client_browser_counters = {}
		arg_state.metrics.client_referrer_counters = {}
	
		// RESPONSE
		arg_state.metrics.response_status_counters = {}
*/