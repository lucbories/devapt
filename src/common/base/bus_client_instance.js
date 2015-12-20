
import T from 'typr'
import assert from 'assert'
import { Map as IMap } from 'immutable'

import { store, config, runtime } from '../store/index'
import Instance from './instance'



let context = 'common/base/bus_client_instance'



export default class BusClientInstance extends Instance
{
	constructor(arg_collection, arg_class, arg_name, arg_settings, arg_context)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_collection, arg_class, arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_bus_instance = true
	}
	
	
	init_bus_client(arg_host, arg_port)
	{
		this.enter_group('init_bus_client')
		
		let BusServer = require('../servers/bus_server').default
		this.bus_client = BusServer.create_client(this, arg_host, arg_port)
		
		this.leave_group('init_bus_client')
	}
	
	
	register_to_master()
	{
		this.enter_group('register_to_master')
		
		
		this.leave_group('register_to_master')
	}
	
	
	send_msg(arg_node_name, arg_payload)
	{
		if ( T.isString(arg_payload) )
		{
			arg_payload = { msg:arg_payload }
		}
		assert( T.isString(arg_node_name), context + ':send_msg:bad node name string')
		assert( T.isObject(arg_payload), context + ':send_msg:bad payload object')
		
		this.info('sending a message to [' + arg_node_name + ']')
		
		if (this.bus_server)
		{
			this.bus_server.post( { "target":arg_node_name, "sender":this.get_name(), "payload":arg_payload } )
		}
		else
		{
			if (this.bus_client)
			{
				this.bus_client.post( { "target":arg_node_name, "sender":this.get_name(), "payload":arg_payload } )
			}
		}
	}
    
    
	send_metrics(arg_metric_type, arg_metrics)
	{
        const metrics = T.isArray(arg_metrics) ? arg_metrics : [arg_metrics]
        const count = metrics.length
        
        // TODO Manage a buffer of metrics and send every N metrics
        
        this.send_msg('metrics_server', { is_metrics_message:true, "metric":arg_metric_type, "metrics": metrics, "metrics_count":count } )
    }
    
    
	receive_msg(arg_sender, arg_payload)
	{
		assert( T.isString(arg_sender), context + ':receive_msg:bad sender string')
		this.info('receiving a message from ' + arg_sender)
		console.log(arg_payload, 'arg_payload')
		
		if (this.bus_server && arg_sender != this.get_name())
		{
			this.send_msg(arg_sender, 'ACK msg reception')
		}
	}
}
