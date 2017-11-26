// COMMON IMPORTS
import Logger from '../../../../common/loggers/logger'



export default class LoggerMock extends Logger
{
	/**
	 * Create a Console Logger instance.
	 * @param {string} arg_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_enabled)
	{
		super(arg_enabled)
		
		this.is_logger_mock = true

		this.debug_str = undefined
		this.info_str = undefined
		this.warn_str = undefined
		this.error_str = undefined
	}
	
	debug_self(arg_msg)
	{
		this.debug_str = arg_msg
	}
	
	info_self(arg_msg)
	{
		this.info_str = arg_msg
	}
	
	warn_self(arg_msg)
	{
		this.warn_str = arg_msg
	}
	
	error_self(arg_msg)
	{
		this.error_str = arg_msg
	}
}