
import T from 'typr'
import assert from 'assert'
import { Map as IMap } from 'immutable'

// import { store, config, runtime } from '../store/index'
import BusClientInstance from './bus_client_instance'



let context = 'common/base/bus_server_instance'



export default class BusServerInstance extends BusClientInstance
{
	constructor(arg_collection, arg_class, arg_name, arg_settings, arg_context)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_collection, arg_class, arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_bus_instance = true
	}
	
	
	init_bus_server(arg_host, arg_port)
	{
		this.enter_group('init_bus_server')
		
		let BusServer = require('../servers/bus_server').default
		// console.log(BusServer)

		const self = this
		const node_server_cfg = {
			"type":"bus",
			"host":arg_host,
			"port":arg_port,
			"protocole":"msg",
			"middlewares":[]
		}
		
		this.bus_server = new BusServer(this.get_name() + '_bus_server', new IMap(node_server_cfg) )
		this.bus_server.load()
		this.bus_server.enable()
		this.bus_server.bus.subscribe( { "target": this.get_name() },
			function(arg_msg)
			{
				assert( T.isObject(arg_msg) && T.isObject(arg_msg.payload), context + ':subscribe:bad payload object')
				self.receive_msg(arg_msg.sender, arg_msg.payload)
			}
		)
		this.info('Messages bus server is started')
		
		this.leave_group('init_bus_server')
	}
}
