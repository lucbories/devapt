// SERVER IMPORTS
import MetricsReducer from '../base/metrics_reducer'
import MetricsNodeJsState from './metrics_nodejs_state'


// const context = 'server/metrics/nodejs/metrics_nodejs_reducer'



/**
 * @file Reducer class for NodeJs metrics collect.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsNodeReducer extends MetricsReducer
{
	/**
	 * Reducer for NodeJs metric class.
	 * @extends MetricsReducer
	 * 
	 * @returns {nothing}
	*/
	constructor()
	{
		super('nodejs')
	}
	
	
	
	/**
	 * Reduce NodeJs metrics records into a state.
	 * 
	 * @param {object} arg_state_values - metrics state values.
	 * @param {object} arg_metrics_values - metrics records values.
	 * @param {MetricsNodeJsState} arg_state - metrics state.
	 * 
	 * @returns {object} - metrics state values.
	 */
	reduce_one_record(arg_state_values, arg_metrics_values, arg_state)
	{
		const runtime_uid = arg_metrics_values.runtime_uid
		arg_state.add_nodejs(runtime_uid)
		
		arg_state_values = arg_state.get_values()[runtime_uid]
		
		const count = arg_state_values.aggregated.count + 1
		
		const new_values = {
			last_metric:arg_metrics_values,
			aggregated:{
				count:count,
				
				hostname:arg_metrics_values.hostname,
				
				runtime_uid:arg_metrics_values.runtime_uid,
				
				ts:new Date().getTime(),
				
				process_arch:arg_metrics_values.process_arch,
				process_platform:arg_metrics_values.process_platform,
				
				process_uptime_sum:arg_state_values.aggregated.process_uptime_sum + arg_metrics_values.process_uptime,
				process_uptime_mean:(arg_state_values.aggregated.process_uptime_sum + arg_metrics_values.process_uptime)/count,
				
				process_pid:arg_metrics_values.process_pid,
				process_version:arg_metrics_values.process_version,
				
				process_memory_shared_sum:arg_state_values.aggregated.process_memory_shared_sum + arg_metrics_values.process_memory_shared,
				process_memory_head_total_sum:arg_state_values.aggregated.process_memory_head_total_sum + arg_metrics_values.process_memory_head_total,
				process_memory_heap_used_sum:arg_state_values.aggregated.process_memory_heap_used_sum + arg_metrics_values.process_memory_heap_used,
				
				process_memory_shared_mean:(arg_state_values.aggregated.process_memory_shared_sum + arg_metrics_values.process_memory_shared)/count,
				process_memory_head_total_mean:(arg_state_values.aggregated.process_memory_head_total_sum + arg_metrics_values.process_memory_head_total)/count,
				process_memory_heap_used_mean:(arg_state_values.aggregated.process_memory_heap_used_sum + arg_metrics_values.process_memory_heap_used)/count
			}
		}
		
		let state_values = arg_state.get_values()
		state_values[runtime_uid] = new_values
		return state_values
	}
	
	
	
	/**
	 * Create a new state instance.
	 * 
	 * @returns {MetricsNodeJsState} - a new node metrics state instance.
	 */
	create_state()
	{
		return new MetricsNodeJsState()
	}
}
