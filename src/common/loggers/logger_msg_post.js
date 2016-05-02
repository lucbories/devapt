import T from 'typr'
import assert from 'assert'

import Logger from './logger'


const context = 'common/loggers/logger_msg_post'



/**
 * @file Message post logger class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LoggerMessagePost extends Logger
{
	/**
	 * Create a Console Logger instance.
	 * @param {string} arg_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_enabled)
	{
		super(arg_enabled)
		
		this.is_logger_message_post = true
		
		this.services_providers = []
		this.has_services_providers = false
	}
	
	
	
	/**
	 * Subscribe to logs.
	 * @param {ServiceProvider} arg_service_provider - message string.
	 * @returns {nothing}
	 */
	subscribe(arg_service_provider)
	{
		assert( T.isObject(arg_service_provider) && arg_service_provider.is_loggers_service_provider, context + ':subscribe:bad loggers service provider')
		
		this.services_providers.push(arg_service_provider)
		this.has_services_providers = true
	}
	
	
	
	/**
	 * Logger DEBUG implementation.
	 * @param {string} arg_level - log level string.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	process(arg_level, arg_msg)
	{
		if (this.has_services_providers)
		{
			this.services_providers.forEach(
				(provider) => {
					provider.post()
				}
			)
		}
	}
	
	
	/**
	 * Logger INFO implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	info_self(arg_msg)
	{
		console.info(arg_msg)
	}
	
	
	/**
	 * Logger WARN implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	warn_self(arg_msg)
	{
		console.warn(arg_msg)
	}
	
	
	/**
	 * Logger ERROR implementation.
	 * @param {string} arg_msg - message string.
	 * @returns {nothing}
	 */
	error_self(arg_msg)
	{
		console.error(arg_msg)
	}
}
