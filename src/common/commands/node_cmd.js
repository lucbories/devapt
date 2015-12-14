
import T from 'typr'
import assert from 'assert'
import restify from 'restify'
import bunyan from 'bunyan'

import runtime from '../base/runtime'



let context = 'common/commands/node_command'


export default function(vantage, arg_node)
{
	assert( T.isObject(arg_node) && arg_node.is_node, context + ':bad node object')
	assert( T.isObject(arg_node.server) && arg_node.server.is_server, context + ':bad node.server object')
	assert( arg_node.server.is_vantage_server, context + ':bad node.server vantage object')
	
	
	vantage
	.command("node [name]")
	.alias("n")
	.option("-s, --status", "Get the node status.")
	.option("-l, --servers", "Get the node servers list.")
	.option("-r, --register", "Register the node.")
	.description("Node manipulation")
	.action(
		function(args, callback)
		{
			vantage.log('node command:')
			vantage.log(args)
			
			// GET OPTIONS
			const node_name = args.name ? args.name : arg_node.get_name()
			const options = {
				"status": (args.options.status === true) ? true : false,
				"servers": (args.options.servers === true) ? true : false,
				"register": (args.options.register === true) ? true : false
			}
			
			// GET NODE
			const node = (node_name == arg_node.get_name()) ? arg_node : runtime.nodes.find_by_name(node_name)
			if(!node)
			{
				vantage.log('bad node name [' + node_name + ']')
				callback()
				return
			}
			
			// DO CMD
			if (options.status)
			{
				vantage.log(node.state);
			}
			
			if (options.servers)
			{
				vantage.log(node.servers.get_all_names());
			}
			
			if (options.register)
			{
				const master_name = runtime.settings.master.name
				const master_host = runtime.settings.master.host == 'localhost' ? '127.0.0.1' : runtime.settings.master.host
				const master_port = runtime.settings.master.port
				
				vantage.log('registering to [' + master_name + '] at [' + master_host + ':' + master_port + ']')
				
				vantage.exec('vantage ' + master_host + ':' + master_port)
				vantage.exec('master -r <node>')
				vantage.exec('..')
			}
			
			callback();
		}
	)
}