
import Loggable from './loggable'



let context = 'common/base/errorable'


export default class Errorable extends Loggable
{
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.$has_error = false
		this.$error_msg = null
	}
	
	
	error(arg_msg)
	{
		this.$has_error = true
		this.$error_msg = arg_msg
	}
	
	has_error()
	{
		return this.$has_error
	}
	
	get_error_msg()
	{
		return this.$error_msg
	}
}