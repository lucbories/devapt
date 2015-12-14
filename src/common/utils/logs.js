
// var API = require('./logs_console');
import * as API_winston from './logs_winston'
import * as API_console from './logs_console'



const mw = API_winston



function should_trace(arg_level, arg_module)
{
	return true && ! /executable_route/.test(arg_module)
}


let API = {}
API.debug = function(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	if ( should_trace('debug', arg_module) )
	{
		mw.debug(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
	}
}


API.info = function(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	if ( should_trace('info', arg_module) )
	{
		mw.info(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
	}
}


API.warn = function(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	if ( should_trace('warn', arg_module) )
	{
		mw.warn(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
	}
}


API.error = function(arg_module, arg_msg)
{
	if ( should_trace('error', arg_module) )
	{
		mw.error(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
	}
}

module.exports = API
export default API