
import T from 'typr'

import LoggerMsgPost from './logger_msg_post'
4


// const context = 'common/loggers/logger_manager'



/**
 * @file Logger manager class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class LoggerManager
{
	/**
	 * Create a Logger manager instance.
	 * @param {object} arg_settings - loggers settings
	 * @returns {nothing}
	 */
	constructor(arg_settings)
	{
		this.is_logger_manager = true
		this.loggers = []
		
		if (arg_settings)
		{
			this.load(arg_settings)
		}
	}
	
	
	/**
	 * Load settings.
	 * @param {object} arg_settings - loggers settings
	 * @returns {nothing}
	 */
	load(arg_settings)
	{
		// console.log(arg_settings, context + ':arg_settings')
		
		if (! this.is_client_runtime)
		{
			const runtime = require('../base/runtime').default
			
			if (this.loggers.length > 0)
			{
				const old_loggers = this.loggers
				old_loggers.forEach(
					(logger, index) => {
						delete this.loggers[index]
					}
				)
				this.loggers = []
			}

			this.loggers.push( new LoggerMsgPost(true, runtime.node.get_logs_bus().get_input_stream()) )
			// this.info('msg logger created')
			
			if ( T.isObject(arg_settings) && ('console' in arg_settings) )
			{
				const LoggerConsole = require('./logger_console').default
				// console.log('add console logger')
				this.loggers.push( new LoggerConsole(true, arg_settings['console']) )
			}
			if ( T.isObject(arg_settings) && ('winston' in arg_settings) )
			{
				const LoggerWinston = require('./logger_winston').default
				// console.log('add winston logger')
				this.loggers.push( new LoggerWinston(true, arg_settings['winston']) )
			}
		}
		
		this.$settings = arg_settings
	}



	/**
	 * Get tracez settings for Loggable.should_trace.
	 */
	get_traces_settings()
	{
		if ( T.isObject(this.$settings) && T.isObject(this.$settings.traces) )
		{
			return this.$settings.traces
		}

		return undefined

		// TODO INHERIT FROM SETTINGSABLE
		// return this.get_setting('traces', undefined)
	}
	
	
	/**
	 * Enable traces.
	 * @returns {nothing}
	 */
	enable_trace()
	{
		this.loggers.forEach(
			(logger) => {
				logger.enable_trace()
			}
		)
	}
	
	
	/**
	 * Disable traces.
	 * @returns {nothing}
	 */
	disable_trace()
	{
		this.loggers.forEach(
			(logger) => {
				logger.disable_trace()
			}
		)
	}
	
	
	/**
	 * Get trace flag.
	 * @returns {boolean}
	 */
	get_trace()
	{
		let trace = true
		this.loggers.forEach(
			(logger) => {
				trace = trace && logger.get_trace()
			}
		)
		return trace
	}
	
	
	/**
	 * Set trace flag.
	 * @param {boolean} arg_value - trace flag.
	 * @returns {nothing}
	 */
	set_trace(arg_value)
	{
		this.loggers.forEach(
			(logger) => {
				logger.set_trace(arg_value)
			}
		)
	}
	
	
	/**
	 * Toggle trace flag.
	 * @returns {boolean}
	 */
	toggle_trace()
	{
		this.loggers.forEach(
			(logger) => {
				logger.toggle_trace()
			}
		)
	}
	
	
	/**
	 * Loggers DEBUG implementation.
	 * @param {string|array} arg_msg - messages strings.
	 * @returns {nothing}
	 */
	debug(...arg_msg)
	{
		this.loggers.forEach(
			(logger) => {
				logger.debug(arg_msg)
			}
		)
	}
	
	
	/**
	 * Loggers INFO implementation.
	 * @param {string|array} arg_msg - messages strings.
	 * @returns {nothing}
	 */
	info(...arg_msg)
	{
		this.loggers.forEach(
			(logger) => {
				logger.info(arg_msg)
			}
		)
	}
	
	
	/**
	 * Loggers WARN implementation.
	 * @param {string|array} arg_msg - messages strings.
	 * @returns {nothing}
	 */
	warn(...arg_msg)
	{
		this.loggers.forEach(
			(logger) => {
				logger.warn(arg_msg)
			}
		)
	}
	
	
	/**
	 * Loggers ERROR implementation.
	 * @param {string|array} arg_msg - messages strings.
	 * @returns {nothing}
	 */
	error(...arg_msg)
	{
		this.loggers.forEach(
			(logger) => {
				logger.error(arg_msg)
			}
		)
	}
}
