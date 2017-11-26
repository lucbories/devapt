// NPM IMPORTS
import assert from 'assert'
import T from 'typr'


const context = 'common/topology/registry/loaders/load_nodes'



let error_msg_bad_config = context + ':bad config'
// let error_msg_bad_node = context + ':nodes.* should be an object'
let error_msg_bad_node_host = context + ':nodes.*.host should be a string'
// let error_msg_bad_node_port = context + ':nodes.*.port should be an integer'
let error_msg_bad_node_is_master = context + ':nodes.*.is_master should be a boolean'
let error_msg_bad_node_servers = context + ':nodes.*.servers should be an object'
let error_msg_bad_node_servers_server = context + ':nodes.*.servers.* should be an object'
let error_msg_bad_node_servers_server_port = context + ':nodes.*.servers.*.port should be an integer'
let error_msg_bad_node_servers_server_type = context + ':nodes.*.servers.*.type should be a string'
let error_msg_bad_node_servers_server_protocole = context + ':nodes.*.servers.*.protocole should be a string'



function load_nodes(logs, arg_nodes_config, arg_base_dir)
{
	logs.info(context, 'loading world.nodes from ' + arg_base_dir)
	
	try{
		// CHECK MODULES
		assert(T.isObject(arg_nodes_config), error_msg_bad_config)
		
		// LOOP ON PLUGINS
		Object.keys(arg_nodes_config).forEach(
			function(node_name)
			{
				let node_obj = arg_nodes_config[node_name]
				
				// CHECK ATTRIBUTES
				assert(T.isString(node_obj.host), error_msg_bad_node_host)
				// assert(T.isNumber(node_obj.port), error_msg_bad_node_port)
				assert(T.isBoolean(node_obj.is_master), error_msg_bad_node_is_master)
				assert(T.isObject(node_obj.servers), error_msg_bad_node_servers)
				
				load_node_servers(logs, node_obj.servers, node_name, node_obj.host, arg_base_dir)
			}
		)
	}
	catch(e)
	{
		arg_nodes_config = { error: { context:context, exception:e } }
	}
	
	return arg_nodes_config
}


function load_node_servers(logs, arg_servers_config, arg_node_name, arg_host/*, arg_base_dir*/)
{
	logs.info(context, 'loading config.nodes.' + arg_node_name + '.servers')
	
	try{
		// CHECK MODULES
		assert(T.isObject(arg_servers_config), error_msg_bad_config)
		
		// LOOP ON PLUGINS
		Object.keys(arg_servers_config).forEach(
			function(node_name)
			{
				logs.info(context, 'loading config.nodes.' + arg_node_name + '.servers.' + node_name)
				let server_obj = arg_servers_config[node_name]
				
				// CHECK ATTRIBUTES
				assert(T.isObject(server_obj), error_msg_bad_node_servers_server)
				assert(T.isNumber(server_obj.port), error_msg_bad_node_servers_server_port)
				assert(T.isString(server_obj.type), error_msg_bad_node_servers_server_type)
				assert(T.isString(server_obj.protocole), error_msg_bad_node_servers_server_protocole)
				
				// TODO: CHECK OTHER SERVER ATTRIBUTES
				
				server_obj.node = arg_node_name
				server_obj.host = arg_host
			}
		)
	}
	catch(e)
	{
		arg_servers_config = { error: { context:context + ':load servers for node [' + arg_node_name + ']', exception:e } }
	}
	
	return arg_servers_config
}


export default load_nodes
