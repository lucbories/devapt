
// import T from 'typr'
// import assert from 'assert'

import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage5_executable'



/**
 * Runtime Stage 5 consists of:
 * 		- enable servers
*/
export default class RuntimeStage5Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
		this.$name = 'stage 5'
	}
	
	
	execute()
	{
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage5', 'enabled'], false)
		this.set_trace(has_trace)
		
		this.separate_level_1()
		this.enter_group('execute')
		
		if (this.runtime.is_master)
		{
			// BUILD MASTER RESOURCES
			this.info('Load master')
			
			this.runtime.node.start()
		}
		
		this.leave_group('execute')
		this.separate_level_1()
		this.set_trace(saved_trace)
		return Promise.resolve()
	}
}
