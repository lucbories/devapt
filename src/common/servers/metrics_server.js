
import T from 'typr'
import assert from 'assert'
import socketio from 'socket.io'

import Server from '../base/server'
import MetricHttpReducer from '../metrics/metric_http_reducer'



const context = 'common/servers/metrics_server'


export default class MetricsServer extends Server
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_metric_server = true
        
        this.http_reducer = new MetricHttpReducer
        this.http_state = this.http_reducer.create_state()
	}
	
	
	build_server()
	{
		this.enter_group('build_server')
		
		
		assert( this.server_protocole == 'bus', context + ':bad protocole for metric server [' + this.server_protocole + ']')
		
		
		this.leave_group('build_server')
	}
	
	
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
            case 'http':
            {
                this.info('processing metric type:' + arg_metric_type)
                this.http_state = this.http_reducer.reduce(this.http_state, arg_metrics)
                
                // console.log(this.http_state, 'http state')
            }
        }
        
        this.leave_group('process_metric')
    }
    
    get_http_metrics()
    {
        return this.http_state // TODO: clone to obtain a immutable object
    }
}
