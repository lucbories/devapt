// NPM IMPORTS
import assert from 'assert'

// SERVER IMPORTS
import Node from '../nodes/node'
import RuntimeExecutable from './runtime_executable'


let context = 'server/runtime/runtime_stage0_executable'



/**
 * Runtime Stage 0 consists of:
 * 		- create node
 * 		- create bus or connect to bus
*/
export default class RuntimeStage0Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
		this.$name = 'stage 0'
	}
	
	
	execute()
	{
		// SAVE TRACES STATE
		const saved_trace = this.get_trace()
		const has_trace = true || this.runtime.get_setting(['trace', 'stages', 'RuntimeStage0', 'enabled'], false)
		if (has_trace)
		{
			this.enable_trace()
		}


		// EXECUTES ACTIONS
		this.separate_level_1()
		this.enter_group('execute')
		
		const node_name = this.runtime.get_setting('name', null)
		const master_name = this.runtime.get_setting(['master','name'])
		
		if (this.runtime.is_master)
		{
			this.info('Node is master')
			// console.log(context + ':execute:Node is master')
			assert(node_name == master_name, context + ':node name [' + node_name + '] not equals master name [' + master_name + ']')
			
			// CREATE MASTER NODE
		}
		else
		{
			this.info('Node is not master')
			// console.log(context + ':execute:Node is not master')
		}

		// CREATE NODE
		this.info('Create Node and load it')
		this.runtime.node = new Node(node_name, this.runtime.get_settings())
		this.runtime.node.load()
		
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
