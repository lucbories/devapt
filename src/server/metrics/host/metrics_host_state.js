// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import MetricsState from '../base/metrics_state'


const context = 'server/metrics/host/metrics_host_state'



/**
 * @file Host metrics state class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricHostState extends MetricsState
{
    /**
     * Metrics host state constructor.
	 * @extends MetricsState
	 * 
	 * @returns {nothing}
     */
	constructor()
	{
		super('host')
		
		this.is_metrics_host_state = true
	}
	
	
	
	/**
	 * Add hostname state values.
	 * 
	 * @param {string} arg_hostname - hostname valid string.
	 * 
	 * @returns {nothing}
	 */
	add_hostname(arg_hostname)
	{
		assert( T.isString(arg_hostname) && arg_hostname.length > 0, context + ':add_hostname: bad hostname string')
		
		if (arg_hostname in this.values)
		{
			return
		}
		
		// CREATE HOSTNAME VALUES
		this.values[arg_hostname] = {}
		
		// LAST SNAPSHOT
		this.values[arg_hostname].last_metric = undefined
		
		
		// CONTINUOUS AGGREGATION
		const aggregated_init = {
			hostname:undefined,
			
			count:0,
			
			cpus_arch:undefined,
			cpus_count:undefined,
			
			cpus_user_sum:0,
			cpus_nice_sum:0,
			cpus_sys_sum:0,
			cpus_idle_sum:0,
			cpus_irq_sum:0,
			
			cpus_user_mean:undefined,
			cpus_nice_mean:undefined,
			cpus_sys_mean:undefined,
			cpus_idle_mean:undefined,
			cpus_irq_mean:undefined
		}
		this.values[arg_hostname].aggregated = Object.assign({}, aggregated_init)
	}
}
