
import T from 'typr'
import assert from 'assert'
import { Map as IMap } from 'immutable'

import { store, config, runtime } from '../store/index'

import Instance from './instance'
import Server from './server'
import { ServerTypes } from './server'
import Collection from './collection'
import RestifyServer from '../servers/restify_server'
import ExpressServer from '../servers/express_server'
import VantageServer from '../servers/vantage_server'
import BusServer from '../servers/bus_server'



let context = 'common/base/node'
const STATE_CREATED = 'NODE_IS_CREATED'
const STATE_REGISTERING = 'NODE_IS_REGISTERING_TO_MASTER'
const STATE_WAITING = 'NODE_IS_WAITING_ITS_SETTINGS'
const STATE_LOADING = 'NODE_IS_LOADING_ITS_SETTINGS'
const STATE_LOADED = 'NODE_HAS_LOADED_ITS_SETTINGS'
const STATE_STARTING = 'NODE_IS_STARTING'
const STATE_STARTED = 'NODE_IS_STARTED'
const STATE_STOPPING = 'NODE_IS_STOPPING'
const STATE_STOPPED = 'NODE_IS_STOPPED'
const STATE_UNREGISTERING = 'NODE_IS_UNREGISTERING_TO_MASTER'



export default class Node extends Instance
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('nodes', 'Node', arg_name, arg_settings)
		
		this.is_node = true
		this.is_master = this.get_setting('is_master', false)
		this.master_name = null
		
		this.servers = new Collection()
		
		this.switch_state(STATE_CREATED)
	}
	
	
	load()
	{
		this.enter_group('load()')
		
		super.load()
		
		// const master_cfg = this.is_master ? this.get_settings().toJS() : this.get_setting('master')
		// const host = master_cfg.host
		// const port = master_cfg.port
		// const node_server_cfg = {
		// 	"type":"bus",
		// 	"host":host,
		// 	"port":port,
		// 	"protocole":"msg",
		// 	"middlewares":[]
		// }
		
		// CREATE MASTER MESSAGE BUS
		/*if (this.is_master)
		{
			this.master_name = this.get_name()
			
			const self = this
			this.bus_server = new BusServer(this.get_name() + '_server', new IMap(node_server_cfg) )
			this.bus_server.load()
			this.bus_server.enable()
			this.bus_server.bus.subscribe( { "target": this.get_name() },
				function(arg_msg)
				{
					assert( T.isObject(arg_msg) && T.isObject(arg_msg.payload), context + ':subscribe:bad payload object')
					self.receive_msg(arg_msg.payload)
				}
			)
			this.info('Messages bus server is started')
			
			this.bus_server.node = this
		}
		// CONNECT TO MASTER MESSAGE BUS
		else
		{
			this.bus_client = BusServer.create_client(host, port)
			
			const self = this
			const client = this.bus_client
			const node_name = this.get_name()
			
			this.master_name = master_cfg.name
			
			client.start(
				function ()
				{
					client.subscribe( { "target": node_name },
						function(arg_msg)
						{
							assert( T.isObject(arg_msg) && T.isObject(arg_msg.payload), context + ':subscribe:bad payload object')
							self.receive_msg(arg_msg.payload)
						}
					)
					
					this.info('Messages bus client is started')
					
					this.register_to_master()
				}
			)
		}*/
		
		this.leave_group('load()')
	}
	
	
	switch_state(arg_state)
	{
		this.state = arg_state
		this.info(arg_state)
	}
	
	
	// MESSAGING
	send_msg(arg_node_name, arg_payload)
	{
		assert( T.isString(arg_node_name), context + ':send_msg:bad node name string')
		assert( T.isObject(arg_payload), context + ':send_msg:bad payload object')
		
		this.info('sending a message to [' + arg_node_name + ']')
		
		if (this.is_master)
		{
			this.bus_server.post( { "target":arg_node_name, "sender":this.get_name(), "payload":arg_payload } )
		}
		else
		{
			this.bus_client.post( { "target":arg_node_name, "sender":this.get_name(), "payload":arg_payload } )
		}
	}
	
	receive_msg(arg_payload)
	{
		this.info('receiving a message')
	}
	
	send_msg_to_master(arg_payload)
	{
		this.send_msg(this.master_name, arg_payload)
	}
	
	
	// REGISTER NODE TO MASTER
	register_to_master()
	{
		this.switch_state(STATE_REGISTERING)
		
		this.send_msg_to_master( { "action":"NODE_ACTION_REGISTERING" } )
		
		this.switch_state(STATE_WAITING)
	}
	
	
	// NODE IS LOADING ITS SETTINGS
	load_master_settings(arg_settings)
	{
		this.enter_group('loading_master_settings')
		this.switch_state(STATE_LOADING)
		
		// GET NODE SERVERS SETTINGS
		assert( T.isObject(arg_settings), context + ':bad settings object')
		assert( arg_settings.has('servers'), context + ':unknow settings.servers')
		const servers = arg_settings.get('servers')
		assert( T.isObject(servers), context + ':bad settings.servers object')
		
		// UDPATE NODE SETTINGS WITH SERVERS
		this.$settings = this.$settings.set('servers', servers)
		
		// CREATE NODE SERVERS
		this.load_servers()
		
		this.switch_state(STATE_LOADED)
	}
	
	
	// NODE IS STARTING
	start()
	{
		this.enter_group('start')
		this.switch_state(STATE_STARTING)
		
		
		this.servers.forEach(
			(server) => {
				const server_name = server.get_name()
				
				this.info('Starting server [' + server_name + ']')
				
				server.enable()
				
				this.info('server is started [' + server_name + ']')
			}
		)
		
		
		this.switch_state(STATE_STARTED)
		this.leave_group('start')
	}
	
	
	// NODE IS STOPPING
	stop()
	{
		this.enter_group('stop')
		this.switch_state(STATE_STOPPING)
		
		
		this.servers.forEach(
			(server) => {
				const server_name = server.get_name()
				
				this.info('Stopping server [' + server_name + ']')
				
				server.disable()
				
				this.info('server is stopped [' + server_name + ']')
			}
		)
		
		
		this.switch_state(STATE_STOPPED)
		this.leave_group('stop')
	}
	
	
	// REGISTER NODE TO MASTER
	unregister_to_master()
	{
		this.switch_state(STATE_UNREGISTERING)
		
		if (this.is_master)
		{
			
		} else{
			
		}
		
		this.switch_state(STATE_CREATED)
	}
	
	
	// MASTER METHODS
	find_master()
	{
		
	}
	
	
	promote_master()
	{
		
	}
	
	
	revoke_master()
	{
		
	}
	
	
	get_assets_file(arg_file_name)
	{
		return new Promise()
	}
	
	
	load_servers()
	{
		this.enter_group('load_servers')
		
		const servers = this.get_setting('servers')
		// console.log(servers, 'servers')
		
		servers.forEach(
			(server_cfg, server_name) => {
				this.info('Processing server creation of:' + server_name)
				
				const server_type = server_cfg.has('type') ? server_cfg.get('type') : null
				assert( T.isString(server_type), context + ':bad server type string for server name [' + server_name + ']')
				
				let server = this.create_server(server_type, server_name, server_cfg)
				server.load()
				server.node = this
				
				this.servers.add(server)
				
				// server.enable()
				
				this.info('server is created [' + server_name + ']')
			}
		)
		
		this.leave_group('load_servers')
	}
	
	
	create_server(arg_type, arg_name, arg_settings)
	{
		// BUILD SERVER
		switch(arg_type)
		{
			case ServerTypes.SERVER_TYPE_EXPRESS: {
				// const ExpressServer = require('../servers/express_server')
				return new ExpressServer(arg_name, arg_settings)
			}
			case ServerTypes.SERVER_TYPE_RESTIFY: {
				// const RestifyServer = require('../servers/restify_server')
				return new RestifyServer(arg_name, arg_settings)
			}
			case ServerTypes.SERVER_TYPE_CLUSTER: {
				// const ExpressServer = require('../servers/express_server')
				return new ExpressServer(arg_name, arg_settings)
			}
			default:{
				assert(false, context + ':bad server type [' + arg_type + '] for name [' + arg_name + ']')
			}
		}
	}
}
