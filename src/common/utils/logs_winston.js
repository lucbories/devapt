var winston = require('winston');

var myCustomLevels = {
	levels: {
		debug: 0,
		info: 1,
		warn: 2,
		error: 3
	},
	colors: {
		debug: 'blue',
		info: 'green',
		warn: 'yellow',
		error: 'red'
	}
};

var logger = new (winston.Logger)(
	{
		levels: myCustomLevels.levels,
		
		transports: [
			new (winston.transports.Console)(
				{
					level:'debug',
					
					timestamp: function()
                    {
						return Date.now();
					},
					
					formatter: function(options)
                    {
						// Return string will be passed to logger.
						return options.timestamp().toString().substr(-6) +' '+ process.pid +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
						  (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
					},
					
					colorize:true
				}
			),
			new (winston.transports.File)(
				{
					filename: './tmp/apps.log',
					level: 'debug',
					maxsize:100000,
					maxFiles:2
				}
			)
		]
	}
);

winston.addColors(myCustomLevels.colors);


var API = {};


var trace = function(arg_trace_level, arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	if (arg_val_1 && arg_val_2 && arg_val_3)
	{
		logger.log(arg_trace_level, arg_module + ':' + arg_msg + ':' + arg_val_1.toString() + ':' + arg_val_2.toString() + ':' + arg_val_3.toString());
		return;
	}
	
	if (arg_val_1 && arg_val_2)
	{
		logger.log(arg_trace_level, arg_module + ':' + arg_msg + ':' + arg_val_1.toString() + ':' + arg_val_2.toString());
		return;
	}
	
	if (arg_val_1)
	{
		logger.log(arg_trace_level, arg_module + ':' + arg_msg + ':' + arg_val_1.toString());
		return;
	}
	
	logger.log(arg_trace_level, arg_module + ':' + arg_msg);
}


API.debug = function(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	trace('debug', arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3);
	return API;
}


API.info = function(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	trace('info', arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3);
	// trace(logger.info, arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3);
	return API;
}


API.warn = function(arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3)
{
	trace('warn', arg_module, arg_msg, arg_val_1, arg_val_2, arg_val_3);
	return API;
}


API.error = function(arg_module, arg_msg)
{
	trace('error', arg_module, arg_msg);
	return API;
}


module.exports = API;
