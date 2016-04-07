
import T from 'typr'
import assert from 'assert'
import simplebus from 'simplebus'

import Server from './server'



let context = 'common/servers/bus_server'


export default class BusServer extends Server
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, 'BusServer', arg_settings, arg_context ? arg_context : context)
		
		this.is_bus_server = true
	}
	
	
	build_server()
	{
		this.enter_group('build_server')
		
		const host = this.server_host
		const port = this.server_port
		const size = this.get_setting('size', 1000)
		
		console.log('BusServer.build_server %s:%s of size %s', host, port, size)
		
		this.bus = simplebus.createBus(size);
		this.server = simplebus.createServer(this.bus, port, host);
		
        // SET SOCKET SERVER HANDLERS
        // this.server.on('connection', BusServer.on_server_connection)
        // this.server.on('close', BusServer.on_client_close)
        // this.server.on('error', BusServer.on_client_error)
        // this.server.on('listening', BusServer.on_client_listening)
        
		this.leave_group('build_server')
	}
	
	
	enable()
	{
		this.enter_group('enable Bus server')
		
		this.server.start();
		
		this.leave_group('enable Bus server')
	}
	
	
	disable()
	{
		this.enter_group('disable Bus server')
		
		this.server.stop();
		
		this.leave_group('disable Bus server')
	}
	
	
	post(arg_msg)
	{
		this.bus.post(arg_msg)
	}
	
	
	static create_client(arg_node, arg_host, arg_port)
	{
		const node_name = arg_node.get_name()
		console.log('BusServer.create_client %s:%s for node %s', arg_host, arg_port, node_name)
		
		var client = simplebus.createClient(arg_port, arg_host)
		
		client.start(
			function ()
			{
				client.subscribe( { "target": node_name },
					function(arg_msg)
					{
                        console.log(arg_msg, context + ':client.on_msg:enter')
						
                        assert( T.isObject(arg_msg) && T.isObject(arg_msg.payload), context + ':subscribe:bad payload object')
						arg_node.receive_msg(arg_msg.sender, arg_msg.payload)
                        
                        console.log(context + ':client.on_msg:leave')
					}
				)
				
				arg_node.info('Messages bus client is started')
				
				arg_node.register_to_master()
			}
		)
        
        // SET SOCKET CLIENT HANDLERS
        client.on('connect', BusServer.on_client_connect)
        client.on('close', BusServer.on_client_close)
        client.on('data', BusServer.on_client_data)
        client.on('end', BusServer.on_client_end)
        client.on('error', BusServer.on_client_error)
        client.on('timeout', BusServer.on_client_timeout)
		
		return client
	}
    
    
    
    // SOCKET SERVER EVENT HANDLERS
    
    static on_server_connection()
    {
        console.log(context + ':connection on bus server')
    }
    
    
    static on_server_close()
    {
        console.log(context + ':close on bus server')
    }
    
    
    static on_server_error()
    {
        console.log(context + ':error on bus server')
    }
    
    
    static on_server_listening()
    {
        console.log(context + ':listening on bus server')
    }
    
    
    
    // SOCKET CLIENT EVENT HANDLERS
    
    static on_client_connect()
    {
        console.log(context + ':connect on bus client')
    }
    
    
    static on_client_data()
    {
        console.log(context + ':data on bus client')
    }
    
    
    static on_client_error(e)
    {
        console.log(context + ':error on bus client', e)
    }
    
    
    static on_client_close()
    {
        console.log(context + ':close on bus client')
    }
    
    
    static on_client_end()
    {
        console.log(context + ':end on bus client')
    }
    
    
    static on_client_timeout()
    {
        console.log(context + ':timeout on bus client')
    }
}
