// SERVER IMPORTS
import runtime from '../../base/runtime'
import MetricsCollector from '../base/metrics_collector'
import MetricsBusRecord from './metrics_bus_record'
import MetricsBusState from './metrics_bus_state'
import MetricsBusReducer from './metrics_bus_reducer'


const context = 'server/metrics/bus/metrics_bus_collector'



/**
 * Metrics Bus collector class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsBusCollector extends MetricsCollector
{
    /**
     * Metrics collector constructor.
	 * @extends MetricsCollector
	 * @param {Immutable.Map} arg_settings - instance settings map.
	 * @param {string} arg_log_context - trace context string.
	 * @returns {nothing}
     */
	constructor(arg_settings, arg_log_context)
	{
		super(arg_settings, (arg_log_context ? arg_log_context : context))
		
		this.is_metrics_bus_collector = true
		
		this.scheduler = undefined
		
		this.metrics_msg_bus = new MetricsBusRecord('msg_bus', runtime.node.get_msg_bus())
		this.metrics_metrics_bus = new MetricsBusRecord('metrics_bus', runtime.node.get_metrics_bus())
		this.metrics_logs_bus = new MetricsBusRecord('logs_bus', runtime.node.get_logs_bus())
	}
	
	
    
	/**
     * Initialize metrics collector.
	 * 
	 * @returns {nothing}
     */
	init()
	{
		super.init()
		
		// CREATE REDUCER
		this.metrics_reducer = new MetricsBusReducer()
		this.metrics_state = new MetricsBusState()
		
		// SCHEDULE HOST METRICS
		const self = this
		const delay_in_sec = 3
		
		this.metrics_msg_bus.before()
		this.metrics_metrics_bus.before()
		this.metrics_logs_bus.before()
		
		const handler = () => {
			self.metrics_msg_bus.iteration()
			self.metrics_metrics_bus.iteration()
			self.metrics_logs_bus.iteration()
			
			self.send_metrics(self.metrics_msg_bus.get_name(),     [self.metrics_msg_bus.get_values()])
			self.send_metrics(self.metrics_metrics_bus.get_name(), [self.metrics_metrics_bus.get_values()])
			self.send_metrics(self.metrics_logs_bus.get_name(),    [self.metrics_logs_bus.get_values()])
			
			// console.log(this.metrics_msg_bus.get_values(), 'metrics_msg_bus')
			// console.log(this.metrics_metrics_bus.get_values(), 'metrics_metrics_bus')
			// console.log(this.metrics_logs_bus.get_values(), 'metrics_logs_bus')
		}
		
		this.scheduler = setInterval(handler, delay_in_sec * 1000)
	}
	
	
    
	/**
     * Flush pending metrics records.
	 * 
	 * @returns {nothing}
     */
	flush()
	{
		super.flush()
	}
	
	
    
	/**
     * Flush and close the metrics collector.
	 * 
	 * @returns {nothing}
     */
	close()
	{
		this.metrics_msg_bus.after()
		this.metrics_metrics_bus.after()
		this.metrics_logs_bus.after()
		
		clearInterval(this.scheduler)
		super.close()
	}
}
