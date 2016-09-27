// SERVER IMPORTS
import MetricsRecord from '../base/metrics_record'



// const context = 'server/metrics/bus/metrics_bus_record'



/**
 * @file Bus information metric class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsBusRecord extends MetricsRecord
{
    /**
     * Metrics bus record constructor.
	 * @extends MetricsRecord
	 * 
	 * @returns {nothing}
     */
	constructor(arg_bus_name, arg_bus)
	{
		super('bus')
		
		this.is_metrics_record_bus  = true
		
		this.bus_name = arg_bus_name
		this.bus = arg_bus
	}
	
	
	
	/**
     * Executed before request processing
     */
	before()
	{
		this.values = {
			metric:'bus',
			
			bus_name:this.bus_name,
			ts:new Date().getTime(),
			
			msg_count:0,
			msg_count_sum:0,
			
			msg_size:0,
			msg_size_sum:0,
			
			errors_count:0,
			errors_count_sum:0,
			
			subscribers_count:0,
			subscribers_count_sum:0
		}
	}
	
	
	/**
     * Executed at each request processing iteration
     */
	iteration()
	{
		if (! this.bus)
		{
			return
		}
		
		const counters = this.bus.get_input_stream().get_and_reset_counters_snapshot()
		
		this.values.ts = new Date().getTime()
		
		this.values.msg_count         = counters.msg_count
		this.values.msg_size          = counters.msg_size
		this.values.errors_count      = counters.errors_count
		this.values.subscribers_count = counters.subscribers_count
		
		this.values.msg_count_sum         += this.values.msg_count
		this.values.msg_size_sum          += this.values.msg_size
		this.values.errors_count_sum      += this.values.errors_count
		this.values.subscribers_count_sum += this.values.subscribers_count
	}
	
	
	/**
     * Executed after request processing
     */
	after()
	{
	}
}