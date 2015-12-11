
import Errorable from './errorable'



let context = 'common/base/executable'


export default class Executable extends Errorable
{
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_executable = true
	}
	
	
	prepare(arg_settings)
	{
	}
	
	execute(arg_data)
	{
	}
	
	finish()
	{
	}
	
	exec_ack()
	{
	}
	
	exec_fail()
	{
	}
}