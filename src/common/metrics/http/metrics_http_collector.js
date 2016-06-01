
// import T from 'typr'
// import assert from 'assert'

import MetricsCollector from '../base/metrics_collector'
import MetricsHttpRecord from './metrics_http_record'
import MetricsHttpState from './metrics_http_state'
import MetricsHttpReducer from './metrics_http_reducer'



const context = 'common/metrics/host/metrics_host_collector'



/**
 * Metrics Http collector class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsHttpCollector extends MetricsCollector
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
		
		this.is_metrics_http_collector = true
	}
	
	
    
	/**
     * Initialize metrics collector.
	 * 
	 * @returns {nothing}
     */
	init()
	{
		super.init()
		
		this.metrics_reducer = new MetricsHttpReducer()
		this.metrics_state = new MetricsHttpState()
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
		super.close()
	}
	
	
	
	/**
     * Executed before main request processing
     * {object}   server object (Server base class instance)
     */
	static create_middleware(arg_server)
	{
        // HANDLE END OF REQUEST PROCESSING FOR RESTIFY SERVER
		if (arg_server.is_restify_server)
		{
			arg_server.server.on('after',
				function (req/*, res*/)
				{
					// console.log('MetricHttp middleware on finish')
					
					let metric = req.devapt_metrics
                    // console.log(metric, 'metric')
                    
					if (metric)
                    {
						metric.after()
					}

					// console.log('MetricHttp middleware on finish, leave')
				}
			)
		}
		
        
        // MIDDLEWARE FUNCTION
		return function(req, res, next)
		{
			// console.log('MetricHttp middleware created')
			
			let metric = new MetricsHttpRecord(req, res)
			// metric.server = arg_server
			metric.before()
			
			// HANDLE END OF REQUEST PROCESSING FOR EXPRESS SERVER
			if (arg_server.is_express_server)
			{
				res.on('finish',
					function ()
					{
						// console.log('MetricHttp middleware on finish')
						
						let metric = res.devapt_metrics
                        // console.log(metric, 'metric')
                        
						if (metric)
						{
							metric.after()
							
							const values = metric.get_values()
							arg_server.send_metrics(values.metric, values)
						}
					}
				)
			}
			
			return next()
		}
	}
}
