
import T from 'typr'
import assert from 'assert'
import restify from 'restify'
import bunyan from 'bunyan'

import runtime from '../base/runtime'



let context = 'common/commands/master_cmd'


export default function(vantage, arg_node)
{
	assert( T.isObject(arg_node) && arg_node.is_node, context + ':bad node object')
	assert( T.isObject(arg_node.server) && arg_node.server.is_server, context + ':bad node.server object')
	assert( arg_node.server.is_vantage_server, context + ':bad node.server vantage object')
	
	
	vantage
	.command("master")
	.alias("m")
	.option("-r <node>, --register <node>", "Register the given node.")
	.description("Master operations")
	.action(
		function(args, callback)
		{
			vantage.log('master command:')
			vantage.log(args)
			
			if ( ! arg_node.is_master )
			{
				vantage.log('current node isn t a master, nothing to do')
				callback()
				return
			}
			
			// GET OPTIONS
			// const node_name = args.name ? args.name : arg_node.get_name()
			const options = {
				"register": (args.options.r) ? args.options.r : false
			}
			
			// vantage.log(options, 'options')
			
			// GET NODE
			// const node = (node_name == arg_node.get_name()) ? arg_node : runtime.nodes.find_by_name(node_name)
			// if(!node)
			// {
			// 	vantage.log('bad node name [' + node_name + ']')
			// 	callback()
			// 	return
			// }
			
			// DO CMD
			if (options.register)
			{
				const node_parts = options.register.split(':')
				if (node_parts.length != 3)
				{
					vantage.log('bad registering format: -r name:host:port')
					callback()
					return
				}
				const node_name = node_parts[0]
				const node_host = node_parts[1]
				const node_port = node_parts[2]
				
				vantage.log('registering node [' + node_name + '] at [' + node_host + ':' + node_port + ']')
				
			}
			
			// if (options.servers)
			// {
			// 	vantage.log(node.servers.get_all_names());
			// }
			
			callback()
		}
	)
}