

export default class Errorable
{
	constructor()
	{
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