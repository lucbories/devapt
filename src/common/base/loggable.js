
import T from 'typr'
import assert from 'assert'



let context = 'common/base/loggable'


/**
 * @file Base class to deal with traces.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Loggable
{
	/**
	 * Create an Loggable instance.
	 * @param {string} arg_context - trace context.
	 * @returns {nothing}
	 */
	constructor(arg_context, arg_logger_manager)
	{
		this.is_loggable = true
		this.$context = arg_context
		
		// this.is_trace_enabled = true
		
		if ( T.isObject(arg_logger_manager) && arg_logger_manager.is_logger_manager )
		{
			this.logger_manager = arg_logger_manager
		}
		
		// TO SET IN SUB CLASSES
		// if ( ! this.is_runtime )
		// {
		// 	this.update_trace_enabled()
		// }
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
		return 'Loggable instance'
	}

	
	
	/**
	 * Should trace flag.
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
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
		
		// TRACES MODULE ?
		should_trace = should_trace || this.should_trace_module(arg_traces_cfg)
		should_trace = should_trace || this.should_trace_class(arg_traces_cfg)
		should_trace = should_trace || this.should_trace_name(arg_traces_cfg)
		
		// if (should_trace)
		// {
		// 	console.log(context + ':should_trace(instance):name=' + this.get_name() + ',value=' + should_trace)
		// }
		
		return should_trace
	}
	
	
	/**
	 * Should trace flag for classes.
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
	 * @returns {boolean} - trace flag.
	 */
	should_trace_class(arg_traces_cfg)
	{
		if ( ! T.isObject(arg_traces_cfg) )
		{
			return false
		}
		
		let should_trace = false
		
		// TRACES MODULE ?
		if ( T.isObject(arg_traces_cfg.classes) )
		{
			const class_name = this.get_class()
			
			if ( (class_name in arg_traces_cfg.classes) )
			{
				// console.log(context + ':should_trace_class:class name found for %s', class_name)
				should_trace = arg_traces_cfg.classes[class_name]
			}
			else
			{
				Object.keys(arg_traces_cfg.classes).forEach(
					function(arg_class_name)
					{
						const loop_value = arg_traces_cfg.classes[arg_class_name]
						
						// REGEX
						if (arg_class_name.indexOf('*') > -1 || arg_class_name.indexOf('.') > -1 || arg_class_name.indexOf('[') > -1 || arg_class_name.indexOf('{') > -1)
						{
							const re = new RegExp(arg_class_name, 'gi')
							const found = re.test(class_name)
							if (found)
							{
								// console.log(context + ':should_trace_class:class name found for %s', class_name)
								should_trace = loop_value ? true : false
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
	 * Should trace flag for instances names.
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
	 * @returns {boolean} - trace flag.
	 */
	should_trace_name(arg_traces_cfg)
	{
		if ( ! T.isObject(arg_traces_cfg) )
		{
			return false
		}
		
		let should_trace = false
		
		// TRACES MODULE ?
		if ( T.isObject(arg_traces_cfg.instances) )
		{
			const name = this.get_name()
			
			if ( (name in arg_traces_cfg.instances) )
			{
				// console.log(context + ':should_trace_name/instance name found for %s', name)
				should_trace = arg_traces_cfg.instances[name]
			}
			else
			{
				Object.keys(arg_traces_cfg.instances).forEach(
					function(arg_instance_name)
					{
						const loop_value = arg_traces_cfg.instances[arg_instance_name]
						
						// REGEX
						if (arg_instance_name.indexOf('*') > -1 || arg_instance_name.indexOf('.') > -1 || arg_instance_name.indexOf('[') > -1 || arg_instance_name.indexOf('{') > -1)
						{
							const re = new RegExp(arg_instance_name, 'gi')
							const found = re.test(name)
							if (found)
							{
								// console.log(context + ':should_trace_name:	instance name found for %s', name)
								should_trace = loop_value ? true : false
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
	 * Should trace flag for modules.
	 * @param {object} arg_traces_cfg - traces settings object as { modules:{}, classes:{}, instances:{} }
	 * @returns {boolean} - trace flag.
	 */
	should_trace_module(arg_traces_cfg)
	{
		if ( ! T.isObject(arg_traces_cfg) )
		{
			return false
		}
		
		let should_trace = false
		
		// TRACES MODULE ?
		if ( T.isObject(arg_traces_cfg.modules) )
		{
			if ( (context in arg_traces_cfg.modules) )
			{
				// console.log(context + ':should_trace_module:module name found for %s', context)
				should_trace = arg_traces_cfg.modules[context]
			}
			else
			{
				Object.keys(arg_traces_cfg.modules).forEach(
					function(arg_module_name)
					{
						const loop_module = arg_traces_cfg.modules[arg_module_name]
						
						// REGEX
						if (arg_module_name.indexOf('*') > -1 || arg_module_name.indexOf('.') > -1 || arg_module_name.indexOf('[') > -1 || arg_module_name.indexOf('{') > -1)
						{
							const re = new RegExp(arg_module_name, 'gi')
							const found = re.test(context)
							if (found)
							{
								// console.log(context + ':should_trace_module:module name found for %s', arg_module_name)
								should_trace = loop_module ? true : false
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
		if (! this.logger_manager && ! this.is_runtime && ! this.is_client_runtime)
		{
			const runtime = require('./runtime').default
			this.logger_manager = runtime.logger_manager
			
		}
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
		const logger = this.get_logger_manager()
		const traces_settings = logger.get_traces_settings()
		if (traces_settings)
		{
			const traces_enabled = this.should_trace(traces_settings)
			// this.set_trace(traces_enabled)

			if (traces_enabled)
			{
				this.enable_trace()
				// console.log(context + ':update_trace_enabled:name=%s, is_trace_enabled', this.get_name(), this.is_trace_enabled)
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
			this.get_logger_manager().debug(this.$context, args)
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
			this.get_logger_manager().info(this.$context, args)
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
			this.get_logger_manager().warn(this.$context, args)
		}
	}
	
	
	/**
	 * Trace ERROR formatted message.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	error(...args)
	{
		if(this.is_trace_enabled)
		{
			this.get_logger_manager().error(this.$context, args)
		}
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
			this.get_logger_manager().info(this.$context, '[' + arg_group + '] ------- ENTER -------')
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
			this.get_logger_manager().info(this.$context, '[' + arg_group + '] ------- LEAVE -------')
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
			this.get_logger_manager().info(this.$context, '==========================================================================================================================')
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
			this.get_logger_manager().info(this.$context, '--------------------------------------------------------------------------------------------------------------------------')
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
			this.get_logger_manager().info(this.$context, '*************************************************************************************************************************')
		}
	}
	
	
	
	// STATIC METHODS
	
	/**
	 * Trace DEBUG formatted message.
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	// static static_debug(arg_context, ...arg_msg)
	// {
	// 	this.get_logger_manager().debug(arg_context, Loggable.format(arg_msg))
	// }
	
	
	/**
	 * Trace INFO formatted message.
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	// static static_info(arg_context, ...arg_msg)
	// {
	// 	this.get_logger_manager().info(arg_context, Loggable.format(arg_msg))
	// }
	
	
	/**
	 * Trace ERROR formatted message.
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	// static static_error(arg_context, ...arg_msg)
	// {
	// 	this.get_logger_manager().error(arg_context, Loggable.format(arg_msg))
	// }
	
	
	/**
	 * Trace INFO formatted message on "enter trace group".
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	// static static_enter_group(arg_context, arg_group)
	// {
	// 	this.get_logger_manager().info(arg_context, '[' + arg_group + '] ------- ENTER -------')
	// }
	
	
	/**
	 * Trace INFO formatted message on "leave trace group".
	 * @static
	 * @param {string} arg_context - trace context string.
	 * @param {string|array} args - variadic messages to format.
	 * @returns {nothing}
	 */
	// static static_leave_group(arg_context, arg_group)
	// {
	// 	this.get_logger_manager().info(arg_context, '[' + arg_group + '] ------- LEAVE -------')
	// }
}
