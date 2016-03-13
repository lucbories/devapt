
import T from 'typr'
import assert from 'assert'
import Express from 'express'
import Vantage from 'vantage'
import repl from 'vantage-repl-sandboxed'

import { store, config } from '../store/index'
import runtime from '../base/runtime'
import Server from '../base/server'
import node_cmd from '../commands/node_cmd'
import master_cmd from '../commands/master_cmd'



let context = 'common/servers/vantage_server'


export default class VantageServer extends Server
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_vantage_server = true
	}
	
	
	build_server()
	{
		this.enter_group('build_server')
		
		
		assert( this.server_protocole == 'http' || this.server_protocole == 'https', context + ':bad protocole for vantage [' + this.server_protocole + ']')
		
		// CREATE SERVER
		this.server = Vantage();
		
		
		this.leave_group('build_server')
	}
	
	
	enable()
	{
		this.enter_group('enable Vantage server')
		
		const name = this.$name
		const host = this.server_host
		const port = this.server_port
		const banner = this.get_setting('banner', '---------------- WELCOME ON [' + name + '] ----------------')
		const prompt = this.get_setting('prompt', '[' + name + ']>')
		
		let vantage = this.server
		
		const repl_cfg = {
			"context": {
				"vantage":vantage,
				"server":this,
				"runtime":runtime,
				"node":runtime.node,
				"config":config
			}
		}
		
		assert( T.isObject(this.node) && this.node.is_node, context + ':bad node object')
		
		vantage.banner(banner)
		vantage.delimiter(prompt)
		
		vantage.use(repl, repl_cfg)
		vantage.use(node_cmd, this.node)
		// if (this.node.is_master)
		// {
			vantage.use(master_cmd, this.node)
		// }
		
		const server = Express()
		
		vantage.listen(server, port,
			function(socket)
			{
				// let host = listener.address().address;
				// let port = listener.address().port;
				// console.info('%s listening at %s : %s accepting a connection', name, host, port);
				vantage.log('accepting a connection')
			}
		)
		
		this.leave_group('enable Vantage server')
		
		vantage.show()
		vantage.log(`Welcome on [${name}] host [${host}] port [${port}]`)
	}
	
	
	disable()
	{
		
	}
}
