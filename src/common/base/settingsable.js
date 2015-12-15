
import T from 'typr'
import assert from 'assert'

import Loggable from './loggable'



let context = 'common/base/settingsable'


export default class Settingsable extends Loggable
{
	constructor(arg_settings, arg_log_context)
	{
		const my_context = arg_log_context ? arg_log_context : context
		
		super(my_context)
		
		this.set_settings(arg_settings)
	}
	
	
	set_settings(arg_settings)
	{
		this.$settings = arg_settings
	}
	
	
	get_settings()
	{
		return this.$settings
	}
	
	
	get_setting(arg_name, arg_default)
	{
		if ( T.isArray(arg_name) )
		{
			return this.$settings.hasIn(arg_name) ? this.$settings.getIn(arg_name) : (arg_default ? arg_default : null)
		}
		return this.$settings.has(arg_name) ? this.$settings.get(arg_name) : (arg_default ? arg_default : null)
	}
}
