// COMMON IMPORTS
import Application from '../../common/topology/runtime/topology_runtime_application'

// SERVER IMPORTS
import RuntimeExecutable from './runtime_executable'


let context = 'server/runtime/runtime_stage4_executable'



/**
 * Runtime Stage 4 consists of:
 * 		- create applications
*/
export default class RuntimeStage4Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
		this.$name = 'stage 4'
	}
	
	
	execute()
	{
		// SAVE TRACES STATE
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage4', 'enabled'], false)
		if (has_trace)
		{
			this.enable_trace()
		}
		

		// EXECUTE ACTIONS
		this.separate_level_1()
		this.enter_group('execute')
		
		this.make_applications()
		
		this.leave_group('execute')
		this.separate_level_1()
		
		
		// RESTORE TRACES STATE
		if (! saved_trace && has_trace)
		{
			this.disable_trace()
		}
		
		return Promise.resolve()
	}
	
	
	make_applications()
	{
		this.enter_group('make_applications')
		
		let applications = this.runtime.get_registry().get_collection_names('applications')
		applications.forEach(
			(application_name) => {
				this.info('Create application:' + application_name)
				
				let application = new Application(application_name)
				
				application.load()
				
				this.runtime.get_topology().applications.add(application)
			}
		)
		
		this.leave_group('make_applications')
	}
}
