// SERVER IMPORTS
import MetricsReducer from '../base/metrics_reducer'
import MetricsHostState from './metrics_host_state'


// const context = 'server/metrics/host/metrics_host_reducer'



/**
 * @file Reducer class for Host metrics collect.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsHostReducer extends MetricsReducer
{
	/**
	 * Reducer for Host metric class.
	 * @extends MetricsReducer
	 * 
	 * @returns {nothing}
	*/
	constructor()
	{
		super('host')
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
	reduce_one_record(arg_state_values, arg_metrics_values, arg_state)
	{
		const hostname = arg_metrics_values.hostname
		arg_state.add_hostname(hostname)
		
		arg_state_values = arg_state.get_values()[hostname]
		
		const count = arg_state_values.aggregated.count + 1
		
		const new_hostname_values = {
			last_metric:arg_metrics_values,
			aggregated:{
				count:count,
				
				hostname:arg_metrics_values.hostname,
				ts:new Date().getTime(),
				
				cpus_arch:arg_metrics_values.cpus_arch,
				cpus_count:arg_metrics_values.cpus_count,
				
				cpus_user_sum:arg_state_values.aggregated.cpus_user_sum + arg_metrics_values.cpus_user,
				cpus_nice_sum:arg_state_values.aggregated.cpus_nice_sum + arg_metrics_values.cpus_nice,
				cpus_sys_sum :arg_state_values.aggregated.cpus_sys_sum  + arg_metrics_values.cpus_sys,
				cpus_idle_sum:arg_state_values.aggregated.cpus_idle_sum + arg_metrics_values.cpus_idle,
				cpus_irq_sum :arg_state_values.aggregated.cpus_irq_sum  + arg_metrics_values.cpus_irq,
				
				cpus_user_mean:(arg_state_values.aggregated.cpus_user_sum + arg_metrics_values.cpus_user)/count,
				cpus_nice_mean:(arg_state_values.aggregated.cpus_nice_sum + arg_metrics_values.cpus_nice)/count,
				cpus_sys_mean :(arg_state_values.aggregated.cpus_sys_sum  + arg_metrics_values.cpus_sys)/count,
				cpus_idle_mean:(arg_state_values.aggregated.cpus_idle_sum + arg_metrics_values.cpus_idle)/count,
				cpus_irq_mean :(arg_state_values.aggregated.cpus_irq_sum  + arg_metrics_values.cpus_irq)/count
			}
		}
		
		let state_values = arg_state.get_values()
		state_values[hostname] = new_hostname_values
		return state_values
	}
	
	
	
	/**
	 * Create a new state instance.
	 * 
	 * @returns {MetricsHostState} - a new host metrics state instance.
	 */
	create_state()
	{
		return new MetricsHostState()
	}
}
