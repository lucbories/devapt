
// var API = require('./logs_console');
import * as API_winston from './logs_winston'
import * as API_console from './logs_console'



const mw = API_winston


let API = {}
API.enabled = true


API.enable_trace = function()
{
	API.enabled = true
}


API.disable_trace = function()
{
	API.enabled = false
}
	
API.get_trace = function()
{
	return API.enabled
}

API.set_trace = function(arg_value)
{
	API.enabled = arg_value
}

API.toggle_trace = function()
{
	API.enabled = ! API.enabled
}


function should_trace(arg_level, arg_module)
{
	return API.enabled // && ! /executable_route/.test(arg_module)
}


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