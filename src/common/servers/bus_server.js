
import T from 'typr'
import assert from 'assert'
import simplebus from 'simplebus'

import { store, config } from '../store/index'
import runtime from '../base/runtime'
import Server from '../base/server'



let context = 'common/servers/bus_server'


export default class BusServer extends Server
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, arg_settings, arg_context ? arg_context : context)
		
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
	
	
	static create_client(arg_host, arg_port)
	{
		console.log('BusServer.create_client %s:%s', arg_host, arg_port)
		var client = simplebus.createClient(arg_port, arg_host)
		
		return client
	}
}
