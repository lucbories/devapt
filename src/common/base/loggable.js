// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// COMMON IMPORTS
import {is_browser, is_server} from '../utils/is_browser'


let context = 'common/base/loggable'



const server_runtime_file = '../../server/base/runtime'
// const browser_runtime_file = 'see window.devapt().runtime()'


/**
 * @file Base class to deal with traces.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Loggable
{
	/**
	 * Create a Loggable instance.
	 * 
	 * API:
	 * 		get_context():string - get instance context.
	 * 		get_class):string - get instance class.
	 * 		get_name():string - get instance name.
	 * 
	 * 		should_trace(arg_traces_cfg:plain object):boolean - test if loggers should trace this instance.
	 * 
	 * 		get_logger_manager():LoggerManager
	 * 		update_trace_enabled():nothing
	 * 
	 * 		enable_trace():nothing
	 * 		disable_trace():nothing
	 * 		get_trace():boolean
	 * 		set_trace(arg_value):nothing
	 * 		toggle_trace():nothing
	 * 
	 * 		debug(...args):nothing
	 * 		info(...args):nothing
	 * 		warn(...args):nothing
	 * 		error(...args):nothing
	 * 
	 * 		enter_group(arg_group) leave_group(arg_group):nothing
	 * 		separate_level_1():nothing
	 * 		separate_level_2():nothing
	 * 		separate_level_3():nothing
	 * 
	 * @param {string} arg_log_context - trace context.
	 * @param {LoggerManager} arg_logger_manager - logger manager instance.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_log_context, arg_logger_manager)
	{
		this.is_loggable = true
		this.$context = T.isString(arg_log_context) ? arg_log_context : context
		
		this.is_trace_enabled = true
		
		if ( T.isObject(arg_logger_manager) && arg_logger_manager.is_logger_manager )
		{
			this.logger_manager = arg_logger_manager
		}
		
		// TO SET IN SUB CLASSES
		// if ( ! this.is_server_runtime )
		// {
		// 	this.update_trace_enabled()
		// }
	}


	/**
	 * Get instance context.
	 * 
	 * @returns {string}
	 */
	get_context()
	{
		return this.$context
	}


	/**
	 * Define get instance name method for non Instance classes.
	 * 
	 * @returns {string}
	 */
	get_name()
	{
		return 'Loggable instance'
	}


	/**
	 * Define get class name method for non Instance classes.
	 * 
	 * @returns {string}
	 */
	get_class()
	{
		return 'Loggable'
	}

	
	
	/**
	 * Calculate should trace flag.
	 * 
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{ 'pattern':boolean }, classes:{ 'pattern':boolean }, instances:{ 'pattern':boolean } }.
	 * 
	 * @returns {boolean} - trace flag.
	 */
	should_trace(arg_traces_cfg)
	{
		if ( ! T.isObject(arg_traces_cfg) )
		{
			console.error(context + ':should_trace(instance):no traces cfg')
			return false
		}
		
		let should_trace = false
		
		// CALCULATE TRACE FLAG
		should_trace = should_trace || this.should_trace_module(arg_traces_cfg)
		should_trace = should_trace || this.should_trace_class(arg_traces_cfg)
		should_trace = should_trace || this.should_trace_name(arg_traces_cfg)
		
		return should_trace
	}
	
	
	
	/**
	 * Calculate should trace flag for modules.
	 * 
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
	 * 
	 * @returns {boolean} - trace flag.
	 */
	should_trace_module(arg_traces_cfg)
	{
		return this.should_trace_collection_item(arg_traces_cfg, 'modules', 'get_context')
	}
	
	
	/**
	 * Calculate should trace flag for classes.
	 * 
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
	 * 
	 * @returns {boolean} - trace flag.
	 */
	should_trace_class(arg_traces_cfg)
	{
		return this.should_trace_collection_item(arg_traces_cfg, 'classes', 'get_class')
	}

	
	
	/**
	 * Calculate should trace flag for instances names.
	 * 
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
	 * 
	 * @returns {boolean} - trace flag.
	 */
	should_trace_name(arg_traces_cfg)
	{
		return this.should_trace_collection_item(arg_traces_cfg, 'instances', 'get_name')
	}

	
	
	/**
	 * Calculate should trace flag for given collection of names or patterns.
	 * 
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{ 'pattern':boolean }, classes:{}, instances:{} }.
	 * @param {string} arg_collection_name - 'modules' or 'classes' or 'instances'
	 * @param {string} arg_this_item_accessor - this method name to access attribute value.
	 * 
	 * @returns {boolean} - trace flag.
	 */
	should_trace_collection_item(arg_traces_cfg, arg_collection_name, arg_this_item_accessor)
	{
		// console.log(context + ':should_trace_collection_item: collection=%s this.aceessor=%s', arg_collection_name, arg_this_item_accessor, arg_traces_cfg)

		if ( ! T.isObject(arg_traces_cfg) )
		{
			return false
		}
		
		let should_trace = false
		
		// TRACES MODULE ?
		if ( T.isObject(arg_traces_cfg) && (arg_collection_name in arg_traces_cfg) )
		{
			const collection = arg_traces_cfg[arg_collection_name]
			const attribute = this[arg_this_item_accessor]()
			
			if ( (attribute in collection) )
			{
				should_trace = collection[attribute]
				// console.log(context + ':should_trace_collection_item: collection=%s attribute=%s should_trace=%b', arg_collection_name, attribute, should_trace)
			}
			else
			{
				// console.log(context + ':should_trace_collection_item: test patterns')

				Object.keys(collection).forEach(
					function(arg_item_pattern)
					{
						if (should_trace)
						{
							return
						}

						// console.log(context + ':should_trace_collection_item: collection=%s attribute=%s loop on pattern=%s should_trace=%n', arg_collection_name, attribute, arg_item_pattern, should_trace)

						// CHECK PATTERN STRING
						if ( ! T.isString(arg_item_pattern) || arg_item_pattern.length < 1 )
						{
							// console.log(context + ':should_trace_collection_item: bad pattern=%s', arg_item_pattern)
							return
						}

						// REGEX
						if (arg_item_pattern.indexOf('*') > -1 || arg_item_pattern.indexOf('[') > -1 || arg_item_pattern.indexOf('{') > -1)
						{
							// console.log(context + ':should_trace_collection_item: good pattern=%s this.attribute=%s', arg_item_pattern, attribute)

							// NPORMALIZE PATTERN
							arg_item_pattern = arg_item_pattern == '*' ? '.*' : arg_item_pattern
							// console.log(context + ':should_trace_collection_item: noarmalized pattern=%s', arg_item_pattern)

							// CREATE REGEX AND TEST MATCHING
							const re = new RegExp(arg_item_pattern, 'gi')
							const found = re.test(attribute)
							if (found)
							{
								const should_trace_pattern = collection[arg_item_pattern]
								should_trace = should_trace_pattern ? true : false
								// console.log(context + ':should_trace_collection_item: collection=%s pattern=%s this.attribute=%s should_trace_pattern=%b should_trace=%b', arg_collection_name, arg_item_pattern, attribute, should_trace_pattern, should_trace)
								return
							}
						}
					}
				)
			}
		}
		
		return should_trace
	}
	
	
	
	/**
	 * Get logger manager.
	 * @returns {LoggerManager}
	 */
	get_logger_manager()
	{
		if (! this.logger_manager && ! this.is_server_runtime && ! this.is_client_runtime)
		{
			if (is_server())
			{
				// console.log(context + ':get_logger_manager:name=%s is server', this.get_name())
				this.logger_manager = require(server_runtime_file).default.logger_manager
			}

			else if (is_browser())
			{
				// console.log(context + ':get_logger_manager:name=%s is browser', this.get_name())
				const runtime = window.devapt().runtime()
				this.logger_manager = runtime.get_logger_manager()
			}
		}
		// else
		// {
		// 	console.log(context + ':get_logger_manager:name=%s is runtime', this.get_name())
		// }

		assert( T.isObject(this.logger_manager) && this.logger_manager.is_logger_manager, context + ':get_logger_manager:bad logger manager object')
		return this.logger_manager
	}



	/**
	 * Update trace enabled flag.
	 * 
	 * @returns {nothing}
	 */
	update_trace_enabled()
	{
		const logger_mgr = this.get_logger_manager()
		const traces_settings = logger_mgr.get_traces_settings()
		if (traces_settings)
		{
			const traces_enabled = this.should_trace(traces_settings)

			if (traces_enabled)
			{
				this.enable_trace()
				// console.log(context + ':update_trace_enabled:name=%s, is_trace_enabled', this.get_name(), this.is_trace_enabled)
			} else {
				this.disable_trace()
			}
		}
	}
	
	
	
	/**
	 * Enable traces.
	 * @returns {nothing}
	 */
	enable_trace()
	{
		this.is_trace_enabled = true
		this.get_logger_manager().enable_trace()
	}
	
	
	
	/**
	 * Disable traces.
	 * @returns {nothing}
	 */
	disable_trace()
	{
		this.is_trace_enabled = false
		this.get_logger_manager().disable_trace()
	}
	
	
	
	/**
	 * Get trace flag.
	 * @returns {boolean}
	 */
	get_trace()
	{
		return this.get_logger_manager().get_trace() && this.is_trace_enabled
	}
	
	
	
	/**
	 * Set trace flag.
	 * @param {boolean} arg_value - trace flag.
	 * @returns {nothing}
	 */
	set_trace(arg_value)
	{
		this.is_trace_enabled = arg_value ? true : false
		if (this.is_trace_enabled)
		{
			this.get_logger_manager().enable_trace()
		}
	}
	
	
	
	/**
	 * Toggle trace flag.
	 * @returns {boolean}
	 */
	toggle_trace()
	{
		this.is_trace_enabled = ! this.is_trace_enabled
		this.get_logger_manager().toggle_trace()
	}
	
	
	
	/**
	 * Trace DEBUG formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	debug(...args)
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().debug( [this.$context].concat(args) )
		}
	}
	
	
	
	/**
	 * Trace INFO formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	info(...args)
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().info( [this.$context].concat(args) )
		}
	}
	
	
	/**
	 * Trace WARN formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	warn(...args)
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().warn( [this.$context].concat(args) )
		}
	}
	
	
	/**
	 * Trace ERROR formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	error(...args)
	{
		// if(this.is_trace_enabled)
		// {
			this.get_logger_manager().error( [this.$context].concat(args) )
			console.error( [this.$context].concat(args) )
		// }
	}
	
	
	/**
	 * Trace INFO message on "enter trace group".
	 * @param {string} arg_group - trace group name.
	 * @returns {nothing}
	 */
	enter_group(arg_group)
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().debug(this.$context, '[' + arg_group + '] ------- ENTER -------')
		}
	}
	
	
	/**
	 * Trace INFO message on "leave trace group".
	 * @param {string} arg_group - trace group name.
	 * @returns {nothing}
	 */
	leave_group(arg_group)
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().debug(this.$context, '[' + arg_group + '] ------- LEAVE -------')
		}
	}
	
	
	/**
	 * Trace INFO trace level 1 separator.
	 * @returns {nothing}
	 */
	separate_level_1()
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().debug(this.$context, '==========================================================================================================================')
		}
	}
	
	
	/**
	 * Trace INFO trace level 2 separator.
	 * @returns {nothing}
	 */
	separate_level_2()
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().debug([this.$context, '--------------------------------------------------------------------------------------------------------------------------'])
		}
	}
	
	
	/**
	 * Trace INFO trace level 3 separator.
	 * @returns {nothing}
	 */
	separate_level_3()
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().debug([this.$context, '*************************************************************************************************************************'])
		}
	}
}
