// NPM IMPORTS
import T from 'typr'
import assert from 'assert'


const context = 'server/metrics/base/metrics_reducer'



/**
 * @file Reducer class for HTTP metrics collect.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsReducer
{
	/**
	 * Reducer for metrics class.
	 * 
	 * @params {string} arg_metrics_name - metrics series name ('http', 'host'...)
	 * 
	 * @returns {nothing}
	*/
	constructor(arg_metrics_name)
	{
		this.is_metrics_reducer = true
		
		this.name = arg_metrics_name
	}
	
	
	
	/**
	 * Reduce metrics records to a state.
	 * 
	 * @param {MetricsState} arg_state - metrics state.
	 * @param {object|array} arg_metrics_values - metrics records values.
	 * 
	 * @returns {object} - metrics state values.
	 */
	reduce(arg_state, arg_metrics_values)
	{
		assert( T.isObject(arg_state) && arg_state.is_metrics_state, context + ':reduce:bad state object')
		assert( T.isObject(arg_metrics_values) || T.isArray(arg_metrics_values), context + ':reduce:bad metrics values object or array' )
		
		arg_metrics_values = T.isArray(arg_metrics_values) ? arg_metrics_values : [arg_metrics_values]
		
		let state_values = arg_state.get_values()
		// console.log(state_values, context + ':reduce:state_values for ' + arg_state.get_name())
		
		// PROBLEM WITH NODEJS 0.10
		for(let loop_metric_index = 0 ; loop_metric_index < arg_metrics_values.length ; loop_metric_index++)
		{
			let loop_metric = arg_metrics_values[loop_metric_index]
		// for(let loop_metric of arg_metrics_values)
		// {
			// console.log(loop_metric, context + ':reduce:loop_metric for ' + arg_state.get_name())
			
			assert( T.isObject(loop_metric) && loop_metric.metric == arg_state.get_name(), context + ':reduce:bad metrics object')
			
			state_values = this.reduce_one_record(state_values, loop_metric, arg_state)
		}
		
		arg_state.set_values(state_values)
		
		// console.log('http reduce.state', arg_state)
		
		return arg_state
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
	reduce_one_record(arg_state_values/*, arg_metrics_values, arg_state*/)
	{
		return arg_state_values
	}
	
	
	
	/**
	 * Increment a state value.
	 * 
	 * @param {object} arg_state_values - values map object.
	 * @param {string} arg_state_key - metrics state values.
	 * @param {string} arg_metrics_values_key - metrics values key.
	 * 
	 * @returns {MetricsState} - a new metrics state instance.
	 */
	incr(arg_state_values, arg_state_key, arg_metrics_values_key)
	{
		arg_state_key = arg_state_key ? arg_state_key : 'unknow'
		
		if ( ! (arg_state_key in arg_state_values) )
		{
			arg_state_values[arg_state_key] = {}
		}
		
		if ( ! (arg_metrics_values_key in arg_state_values[arg_state_key]) )
		{
			arg_state_values[arg_state_key][arg_metrics_values_key] = 0
		}
		
		arg_state_values[arg_state_key][arg_metrics_values_key] += 1
	}
	
	
	
	/**
	 * Create a new state instance.
	 * 
	 * @returns {MetricsState} - a new metrics state instance.
	 */
	create_state()
	{
		return undefined
	}
}
