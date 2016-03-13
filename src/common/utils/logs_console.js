

var API = {};


var trace = function(arg_trace_cb, arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	if (arg_val_1 && arg_val_2 && arg_val_3)
	{
		return arg_trace_cb(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3);
	}
	
	if (arg_val_1 && arg_val_2)
	{
		return arg_trace_cb(arg_module, arg_msg, arg_val_1, arg_val_2);
	}
	
	if (arg_val_1)
	{
		return arg_trace_cb(arg_module, arg_msg, arg_val_1);
	}
	
	return arg_trace_cb(arg_module, arg_msg);
}


API.debug = function(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	return trace(console.debug, arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3);
}


API.info = function(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	return trace(console.info, arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3);
}


API.warn = function(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	return trace(console.warn, arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3);
}


API.error = function(arg_module, arg_msg)
{
	return trace(console.error, arg_module, arg_msg);
}


module.exports = API;
