
// import T from 'typr'
import assert from 'assert'

import Node from '../base/node'
import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage0_executable'



/**
 * Runtime Stage 0 consists of:
 * 		- create node
 * 		- create bus or connect to bus
*/
export default class RuntimeStage0Executable extends RuntimeExecutable
{
	constructor()
	{
		super(context)
	}
	
	
	execute()
	{
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage0', 'enabled'], false)
		this.set_trace(has_trace)
		
		this.separate_level_1()
		this.enter_group('execute')
		
		const node_name = this.runtime.get_setting('name', null)
		const master_name = this.runtime.get_setting(['master','name'])
		
		if (this.runtime.is_master)
		{
			this.info('Node is master')
			assert(node_name == master_name, context + ':node name [' + node_name + '] not equals master name [' + master_name + ']')
			
			// CREATE MASTER NODE
			this.info('Create Node and load it')
			this.runtime.node = new Node(node_name, this.runtime.get_settings())
			this.runtime.node.load()
		}
		else
		{
			this.info('Node is not master')
			
			// CREATE SIMPLE NODE
			this.runtime.node = new Node(node_name, this.runtime.get_settings())
			this.runtime.node.load()
		}
		
		this.leave_group('execute')
		this.separate_level_1()
		this.set_trace(saved_trace)
		return Promise.resolve()
	}
}
