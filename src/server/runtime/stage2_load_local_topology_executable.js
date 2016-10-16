// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import RuntimeExecutable from './runtime_executable'
import TopologyDeployLocalNode from '../../common/topology/deploy/topology_deploy_local_node'


let context = 'server/runtime/runtime_stage2_executable'



/**
 * Runtime Stage 2 consists of:
 * 		- Process previous loading errors
 * 		- Get world topology deployment from registry
 * 		- Create, load and apply world topology deployment
*/
export default class RuntimeStage2Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
		this.$name = 'stage 2'
	}
	
	
	execute()
	{
		// SAVE TRACES STATE
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage2', 'enabled'], false)
		if (has_trace)
		{
			this.enable_trace()
		}
		

		// EXECUTE ACTIONS
		this.separate_level_1()
		this.enter_group('execute')


		// PROCESS ERROR
		this.info('Process nodes settings loading error')
		const nodes_cfg = this.runtime.get_registry().root.get('nodes')
		assert( T.isFunction(nodes_cfg.has), context + ':execute:bad nodes_cfg object')
		if ( nodes_cfg.has('error') )
		{
			this.info('local node settings loading failure', nodes_cfg.get('error'))
			this.error('local node settings loading failure')
			
			this.leave_group('execute:error')
			this.separate_level_1()
			this.set_trace(saved_trace)
			return Promise.reject('master settings loading failure')
		}
		

		// GET WORLD TOPOLOGY DEPLOYMENT FROM REGISTRY
		this.info('Get world topology deployment from registry')
		const node_settings = this.runtime.get_registry().get_collection_item('nodes', this.runtime.node.get_name())
		// console.log(context + ':node_settings', node_settings)
		this.runtime.node.load_topology_settings(node_settings)


		// CREATE, LOAD AND APPLY WORLD TOPOLOGY DEPLOYMENT
		this.info('Deploy local topology')
		const rt_factory = this.runtime.plugins_factory
		const svc_mgr = rt_factory.get_services_manager()
		const deploy_name = this.runtime.node.get_name()
		const defined_item = this.runtime.world_topology.node(deploy_name)
		const deploy_settings = this.runtime.get_registry().root.get('deployments', {}).toJS()
		const deploy_factory = {
			create:(arg_type, arg_name, arg_settings)=>{
				switch(arg_type) {
					case 'service':{
						const svc_type = arg_settings.get('type', undefined)
						if (svc_mgr.has(svc_type))
						{
							return svc_mgr.create(svc_type, arg_name, arg_settings, {})
						}
					}
				}

				console.error(context + ':DEPLOY LOCAL TOPOLOGY:deploy_factory.create:not found for type ' + arg_type)
				return undefined
			}
		}
		assert( T.isObject(defined_item) && defined_item.is_topology_define_node, context + ':DEPLOY LOCAL TOPOLOGY:defined topology node not found for ' + deploy_name)
		this.runtime.deployed_local_topology = new TopologyDeployLocalNode(deploy_name, defined_item, deploy_settings, deploy_factory)
		this.runtime.deployed_local_topology.load()
		this.runtime.deployed_local_topology.deploy()


		this.leave_group('execute')
		this.separate_level_1()
		
		
		// RESTORE TRACES STATE
		if (! saved_trace && has_trace)
		{
			this.disable_trace()
		}
		
		return Promise.resolve()
	}
}
