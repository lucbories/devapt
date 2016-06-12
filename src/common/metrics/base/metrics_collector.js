
import T from 'typr'
import assert from 'assert'

import runtime from '../../base/runtime'
import Settingsable from '../../base/settingsable'


const context = 'common/metrics/base/metrics_collector'


/**
 * Metrics collector status.
 */
const STATUS_CREATED = 'CREATED'
const STATUS_INITIALIZED = 'INITIALIZED'
const STATUS_CLOSED = 'CLOSED'



/**
 * Metrics collector base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsCollector extends Settingsable
{
    /**
     * Metrics collector constructor.
	 * @extends Settingsable
	 * @param {Immutable.Map} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * @returns {nothing}
     */
	constructor(arg_settings, arg_log_context)
	{
		super(arg_settings, (arg_log_context ? arg_log_context : context))
		
		this.is_metrics_collector = true
		
		this.$state = STATUS_CREATED
		
		this.metrics_server_name = undefined

		this.metrics_reducer = undefined
		this.metrics_state = undefined
	}
	
	
    
	/**
     * Initialize metrics collector.
	 * 
	 * @returns {nothing}
     */
	init()
	{
		this.$state = STATUS_INITIALIZED
	}



	/**
	 * Send metrics message.
	 * 
	 * @param {string} arg_type - metrics type string.
	 * @param {array} arg_values - metrics values array.
	 * 
	 * @returns {boolean}
	 */
	send_metrics(arg_type, arg_values)
	{
		if (!this.metrics_server_name)
		{
			this.metrics_server_name = runtime.node.get_metrics_server().get_name()
			// console.log(context + ':send_metrics:metrics_server_name:type=%s srv=%s', arg_type, this.metrics_server_name)
		}

		// console.log(context + ':send_metrics:type=%s srv=%s', arg_type, this.metrics_server_name)
		return runtime.node.send_metrics(this.metrics_server_name, arg_type, arg_values)
	}
	
    
	/**
     * Flush pending metrics records.
	 * 
	 * @returns {nothing}
     */
	flush()
	{
	}
	
	
    
	/**
     * Flush and close the metrics collector.
	 * 
	 * @returns {nothing}
     */
	close()
	{
		this.flush()
		this.$state = STATUS_CLOSED
		
		delete this.metric_reducer
		delete this.metrics_state
		
		this.metric_reducer = undefined
		this.metrics_state = undefined
	}
	
	
    
	/**
     * Get the metrics collector status: CREATED, INITIALIZED, CLOSED.
	 * 
	 * @returns {string} _ status string
     */
	get_status()
	{
		return this.$state
	}
	
	
    
	/**
     * Get the metrics collector status: CREATED, INITIALIZED, CLOSED.
	 * 
	 * @returns {string} _ status string
     */
	get_state_values()
	{
		assert( T.isObject(this.metrics_state) && this.metrics_state.is_metrics_state, context + ':get_state_values:bad state object')
		return this.metrics_state.get_values()
	}
	
	
	
	/**
     * Process a metrics record.
	 * 
	 * @param {MetricsRecord} arg_metrics_record - metrics record.
	 * 
	 * @returns {nothing}
     */
	process_record(arg_metrics_record)
	{
		assert( T.isObject(arg_metrics_record) && arg_metrics_record.is_metrics_record, context + ':get_state_values:bad state object')
		
		if (arg_metrics_record.get_name() == this.get_name())
		{
			this.process_values(arg_metrics_record.get_values())
		}
	}
	
	
	
	/**
     * Process metrics record values.
	 * 
	 * @param {object} arg_metrics_values - metrics record values.
	 * 
	 * @returns {nothing}
     */
	process_values(arg_metrics_values)
	{
		this.metrics_state = this.metrics_reducer.reduce(this.metrics_state, arg_metrics_values)
	}
}
