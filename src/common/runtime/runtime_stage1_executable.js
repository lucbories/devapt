
import T from 'typr'
// import assert from 'assert'

import { store, config } from '../store/index'
import { dispatch_store_config_set_all } from '../store/config/actions'

import Provider from '../datas/providers/json_provider'
import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage1_executable'



/**
 * Runtime Stage 1 consists of:
 * 	  - load master apps settings
 *	  - load security settings
*/
export default class RuntimeStage1Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
	}
	
	// TODO MONITOR EXECUTE PROMISE !!!
	execute()
	{
		const self = this
		
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage1', 'enabled'], false)
		this.set_trace(has_trace)
		
		this.separate_level_1()
		this.enter_group('execute')
		
		let promise = null
		const runtime = this.runtime
		if (runtime.is_master)
		{
			this.info('Node is master')
			
			const settings_provider = runtime.get_setting('settings_provider', null)
			// console.log(settings_provider, 'settings_provider')
			
			if ( T.isObject(settings_provider) )
			{
				this.info('Settings provider found for master')
				
				const provider = new Provider(settings_provider)
				promise = provider.provide_json()
				.then(
					// SUCCESS
					function(arg_json)
					{
						self.info('Dispatching master settings into store')
						// console.log(arg_json, 'arg_json')
						dispatch_store_config_set_all(store, arg_json)
						return true
					}
				)
				.catch(
					// FAILURE
					function(arg_reason)
					{
						self.error(context + ':Master settings loading failure:' + arg_reason)
						return false
					}
				)
			}
			else
			{
				this.error('Settings provider not found')
				promise = Promise.reject('Settings provider not found for master')
			}
		}
		else
		{
			this.info('Node is not master')
			promise = Promise.resolve(true)
		}
		
		// LOAD LOGGERS SETTINGS
		this.info('LOAD LOGGERS SETTINGS')
		promise = promise.then(
			function()
			{
				self.info('Loading Loggers settings')
				
				const loggers_settings = config().get('loggers').toJS()
				const traces_settings = config().get('traces').toJS()
				
				loggers_settings.traces = traces_settings
				runtime.logger_manager.load(loggers_settings)
				
				// console.log(loggers_settings, context + '.execute:loggers_settings')
				
				return true
			}
		)
		.catch(
			// FAILURE
			function(arg_reason)
			{
				self.error(context + ':Loggers settings loading failure:' + arg_reason)
				return false
			}
		)
		
		// LOAD SECURITY SETTINGS
		this.info('LOAD SECURITY SETTINGS')
		promise = promise.then(
			function()
			{
				self.info('Loading Security settings')
				
				const security_settings = config().get('security')
				// console.log(security_settings, context + '.execute:security_settings')
				
				runtime.security().load(security_settings)
				
				return true
			}
		)
		.catch(
			// FAILURE
			function(arg_reason)
			{
				self.error(context + ':Security settings loading failure:' + arg_reason)
				return false
			}
		)
		
		this.leave_group('execute')
		this.separate_level_1()
		this.set_trace(saved_trace)
		return promise
	}
}
