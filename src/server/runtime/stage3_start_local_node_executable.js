// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// SERVER IMPORTS
import RuntimeExecutable from './runtime_executable'


let context = 'server/runtime/stage3_start_local_node_executable'



/**
 * Runtime Stage 3 consists of:
 * 		- start local node: start all node features (serves...)
*/
export default class RuntimeStage3Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
		this.$name = 'stage 5'
	}
	

	
	execute()
	{
		// SAVE TRACES STATE
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage3', 'enabled'], false)
		if (has_trace)
		{
			this.enable_trace()
		}
		
		
		// EXECUTE ACTIONS
		this.separate_level_1()
		this.enter_group('execute')

		
		// START NODE AND ITS SERVERS
		this.runtime.node.start()
		
		
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
