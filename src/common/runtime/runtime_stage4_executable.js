
import T from 'typr'
import assert from 'assert'

import { store, config } from '../store/index'
import Application from '../base/application'

import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage4_executable'



/**
 * Runtime Stage 4 consists of:
 * 		- create applications
*/
export default class RuntimeStage4Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
	}
	
	
	execute()
	{
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage4', 'enabled'], false)
		this.set_trace(has_trace)
		
		this.separate_level_1()
		this.enter_group('execute')
		
		if (this.runtime.is_master)
		{
			// BUILD MASTER RESOURCES
			this.info('Load master')
			
			this.make_applications()
		}
		
		this.leave_group('execute')
		this.separate_level_1()
		this.set_trace(saved_trace)
		return Promise.resolve()
	}
	
	
	make_applications()
	{
		this.enter_group('make_applications')
		
		let applications = config.get_collection_names('applications')
		applications.forEach(
			(application_name) => {
				let application = new Application(application_name)
				
				application.load()
				
				this.runtime.applications.add(application)
			}
		)
		
		this.leave_group('make_applications')
	}
}
