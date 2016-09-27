// SERVER IMPORTS
import MetricsReducer from '../base/metrics_reducer'
import MetricsBusState from './metrics_bus_state'


// const context = 'server/metrics/bus/metrics_bus_reducer'



/**
 * @file Reducer class for Bus metrics collect.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsBusReducer extends MetricsReducer
{
	/**
	 * Reducer for Bus metric class.
	 * @extends MetricsReducer
	 * 
	 * @returns {nothing}
	*/
	constructor()
	{
		super('bus')
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
		const bus_name = arg_metrics_values.bus_name
		arg_state.add_bus_name(bus_name)
		
		arg_state_values = arg_state.get_values()[bus_name]
		
		const count = arg_state_values.aggregated.count + 1
		
		const new_bus_name_values = {
			metric:'bus',
			
			last_metric:arg_metrics_values,
			
			aggregated:{
				count:count,
				
				bus_name:arg_metrics_values.bus_name,
				ts:new Date().getTime(),
				
				msg_count:arg_metrics_values.msg_count_sum,
				msg_size:arg_metrics_values.msg_size_sum,
				errors_count:arg_metrics_values.errors_count_sum,
				subscribers_count:arg_metrics_values.subscribers_count
			}
		}
		
		let state_values = arg_state.get_values()
		state_values[bus_name] = new_bus_name_values
		return state_values
	}
	
	
	
	/**
	 * Create a new state instance.
	 * 
	 * @returns {MetricsBusState} - a new bus metrics state instance.
	 */
	create_state()
	{
		return new MetricsBusState()
	}
}
