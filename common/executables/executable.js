
import Errorable from './errorable'



export default class Executable extends Errorable
{
	constructor()
	{
		super()
		this.is_executable = true
	}
	
	
	prepare(arg_context)
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