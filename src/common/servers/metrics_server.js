
import T from 'typr'
import assert from 'assert'
// import { Map as IMap } from 'immutable'

import Server from './server'
import MetricHttpReducer from '../metrics/metric_http_reducer'



const context = 'common/servers/metrics_server'



/**
 * @file Metrics server class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsServer extends Server
{
	/**
	 * Create MetricsServer instance to process metrics records.
	 * @param {string} arg_name - server instance name
	 * @param {Immutable.Map} arg_settings - server instance settings
	 * @param {string} arg_context - logging context
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, 'MetricsServer', arg_settings, arg_context ? arg_context : context)
		
		this.is_metric_server = true
        
		this.http_reducer = new MetricHttpReducer
		this.http_state = this.http_reducer.create_state()
	}
	
	
	/**
	 * Build server.
	 * @returns {nothing}
	 */
	build_server()
	{
		this.enter_group('build_server')
		console.log('MetricsServer:build_server')
		assert( this.server_protocole == 'bus', context + ':bad protocole for metric server [' + this.server_protocole + ']')
		
		const self = this
		
		this.node.metrics_bus.get_bus_stream().onValue(
			(arg_msg) => {
				assert( T.isObject(arg_msg) && T.isObject(arg_msg.payload), context + ':subscribe:bad payload object')
				// console.log('MetricsServer:new metrics bus msg from %s', arg_msg.sender)
				// self.receive_msg(arg_msg.sender, arg_msg.payload)
				try
				{
					self.process_metric(arg_msg.payload.metric, arg_msg.payload.metrics)
				}
				catch(e)
				{
					console.error(context + ':exception:' + e)
				}
			}
		)
		
		this.leave_group('build_server')
	}
	
	
	/**
	 * Process received message.
	 * @param {string} arg_sender - message emitter name.
	 * @param {object} arg_payload - message content.
	 * @returns {nothing}
	 */
	receive_msg(arg_sender, arg_payload)
	{
		this.enter_group('receive_msg')
        
        // DEBUG
		// console.log(arg_payload, 'arg_payload from ' + arg_sender)
        
        // CHECK SENDER
		assert( T.isString(arg_sender), context + ':receive_msg:bad sender string')
		this.info('receiving a message from ' + arg_sender)
		
        // CHECK PAYLOAD
		assert( T.isObject(arg_payload), context + ':receive_msg:bad payload object')
		if (! arg_payload.is_metrics_message)
		{
			console.error('bad metrics payload')
			this.leave_group('receive_msg')
			return
		}

		assert( T.isArray(arg_payload.metrics), context + ':receive_msg:bad payload.metrics object')

		try
		{
			this.process_metric(arg_payload.metric, arg_payload.metrics)
		}
		catch(e)
		{
			console.error(context + ':exception:' + e)
		}


		this.leave_group('receive_msg')
	}
    
    
    /**
     * Process received metrics
     * {array} Array of metrics plain objects
     */
	process_metric(arg_metric_type, arg_metrics)
	{
		this.enter_group('process_metric')
		this.info('metric type:' + arg_metric_type)

		switch(arg_metric_type)
		{
			case 'duration':
			case 'host':
				break
			case 'http': {
				this.info('processing metric type:' + arg_metric_type)
				this.http_state = this.http_reducer.reduce(this.http_state, arg_metrics)

				// console.log(this.http_state, 'http state')
				break
			}
		}

		this.leave_group('process_metric')
	}
	
	
	/**
	 * Get http state with all metrics.
	 * @returns {Object} - http state object.
	 */
	get_http_metrics()
	{
		return this.http_state // TODO: clone to obtain a immutable object
	}
}
