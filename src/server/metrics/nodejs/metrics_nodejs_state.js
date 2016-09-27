// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import MetricsState from '../base/metrics_state'


const context = 'server/metrics/nodejs/metrics_nodejs_state'



/**
 * @file Node metrics state class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricNodeJsState extends MetricsState
{
    /**
     * Metrics node state constructor.
	 * @extends MetricsState
	 * 
	 * @returns {nothing}
     */
	constructor()
	{
		super('nodejs')
		
		this.is_metrics_node_state = true
	}
	
	
	
	/**
	 * Add nodename state values.
	 * 
	 * @param {string} arg_runtime_uid - nodejs runtime uid.
	 * 
	 * @returns {nothing}
	 */
	add_nodejs(arg_runtime_uid)
	{
		assert( T.isString(arg_runtime_uid) && arg_runtime_uid.length > 0, context + ':add_nodename: bad nodejs runtime uid string')
		
		if (arg_runtime_uid in this.values)
		{
			return
		}
		
		// CREATE HOSTNAME VALUES
		this.values[arg_runtime_uid] = {}
		
		// LAST SNAPSHOT
		this.values[arg_runtime_uid].last_metric = undefined
		
		
		// CONTINUOUS AGGREGATION
		const aggregated_init = {
			hostname:undefined,
			
			runtime_uid:undefined,
			
			count:0,
			
			process_arch:undefined,
			process_platform:undefined,
			
			process_uptime_sum:0,
			process_uptime_mean:undefined,
			
			process_pid:undefined,
			process_version:undefined,
			
			process_memory_shared_sum:0,
			process_memory_head_total_sum:0,
			process_memory_heap_used_sum:0,
			
			process_memory_shared_mean:undefined,
			process_memory_head_total_mean:undefined,
			process_memory_heap_used_mean:undefined
		}
		this.values[arg_runtime_uid].aggregated = Object.assign({}, aggregated_init)
	}
}
