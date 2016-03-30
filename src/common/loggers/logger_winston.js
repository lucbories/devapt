
import T from 'typr'
import winston from 'winston'

import Logger from './logger'



const customLevels = {
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
}



/**
 * @file Winston logger class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LoggerConsole extends Logger
{
	/**
	 * Create a Console Logger instance.
	 * @param {string} arg_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_enabled, arg_settings)
	{
		super(arg_enabled)
		
		this.is_logger_console = true
		
		if ( T.isObject(arg_settings) )
		{
			if ( T.isObject(arg_settings.loggers.transports) )
			{
				// TODO: load from settings
			}
		}
		
		
		const console_transport = this.create_console_transport(undefined)
		const file_transport = this.create_file_transport(undefined)
		
		const logger_cfg = {
			levels: customLevels.levels,
			transports: [
				console_transport,
				file_transport
			]
		}
		
		this.logger = new (winston.Logger)(logger_cfg)

		winston.addColors(customLevels.colors)
	}
	
	
	
	/**
	 * Create a console transport for Winston logger.
	 * @param {object} arg_transport_cfg - console transport settings.
	 * @returns {winston.transports.Console}
	 */
	create_console_transport(/*arg_transport_cfg*/)
	{
		const transport_console_cfg = {
			level:'debug',
			
			timestamp: function()
			{
				return Date.now()
			},
			
			formatter: function(options)
			{
				// Return string will be passed to logger.
				return options.timestamp().toString().substr(-6) +' '+ process.pid +' '+ options.level.toUpperCase() +' '+ (undefined !== options.message ? options.message : '') +
				(options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' )
			},
			
			colorize:true
		}
		
		return new (winston.transports.Console)(transport_console_cfg)
	}
	
	
	/**
	 * Create a file transport for Winston logger.
	 * @param {object} arg_transport_cfg - file transport settings.
	 * @returns {winston.transports.File}
	 */
	create_file_transport(/*arg_transport_cfg*/)
	{
		const transport_file_cfg = {
			level: 'debug',
			
			filename: './tmp/debug.log',
			maxsize:100000,
			maxFiles:2
		}
		
		return new (winston.transports.File)(transport_file_cfg)
	}
	
	
	
	/**
	 * Logger DEBUG implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	debug_self(arg_msg)
	{
		this.logger.log('debug', arg_msg)
	}
	
	
	/**
	 * Logger INFO implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	info_self(arg_msg)
	{
		this.logger.log('info', arg_msg)
	}
	
	
	/**
	 * Logger WARN implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	warn_self(arg_msg)
	{
		this.logger.log('warn', arg_msg)
	}
	
	
	/**
	 * Logger ERROR implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	error_self(arg_msg)
	{
		this.logger.log('error', arg_msg)
	}
}
