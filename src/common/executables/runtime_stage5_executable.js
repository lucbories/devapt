
import T from 'typr'
import assert from 'assert'

import { store, config } from '../store/index'
import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage5_executable'



/**
 * Runtime Stage 5 consists of:
 * 		- enable servers
*/
export default class RuntimeStage5Executable extends RuntimeExecutable
{
	constructor()
	{
		super(context)
	}
	
	
	execute()
	{
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage5', 'enabled'], false)
		this.set_trace(has_trace)
		
		this.enter_group('execute')
		
		if (this.runtime.is_master)
		{
			// BUILD MASTER RESOURCES
			this.info('Load master')
			
			this.runtime.node.start()
		}
		
		this.leave_group('execute')
		this.set_trace(saved_trace)
	}
}
