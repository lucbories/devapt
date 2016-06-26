
import T from 'typr'
import assert from 'assert'

import { store } from '../store/index'
import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage5_executable'



/**
 * Runtime Stage 5 consists of:
 * 		- load rendering plugins
 * 		- enable servers
*/
export default class RuntimeStage5Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
		this.$name = 'stage 5'
	}
	

	
	execute()
	{
		// INIT TRACES STATE
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage5', 'enabled'], false)
		if (has_trace)
		{
			this.enable_trace()
		}
		

		this.separate_level_1()
		this.enter_group('execute')
		

		// LOAD RENDERING PLUGINS
		this.load_rendering_plugins()
		
		// START NODE AND ITS SERVERS
		this.runtime.node.start()
		
		
		this.leave_group('execute')
		this.separate_level_1()
		

		// RESTORE TRACES STATE
		if (! saved_trace && has_trace)
		{
			this.disable_trace()
		}
		
		return Promise.resolve()
	}



	load_rendering_plugins()
	{
		this.enter_group('load_rendering_plugins')

		const plugins_mgr = this.runtime.get_plugins_factory().get_rendering_manager()

		const rendering_plugins = store.get_plugins_set('rendering')
		//this.runtime.get_setting(['plugins', 'rendering'], undefined)
		console.log(context + ':load_rendering_plugins:rendering_plugins', rendering_plugins)

		rendering_plugins.forEach(
			(plugin_cfg) => {
				assert( T.isObject(plugin_cfg), context + ':load_rendering_plugins:bad plugin setting object')
				assert( T.isString(plugin_cfg.name), context + ':load_rendering_plugins:bad plugin name string')
				console.log(context + ':load_rendering_plugins:plugin=%s', plugin_cfg.name)

				let plugin_class = undefined
				if ( T.isString(plugin_cfg.package) )
				{
					// TODO : loading packages without full path?
					const file_path = this.runtime.context.get_absolute_path('../node_modules/', plugin_cfg.package)
					console.log(context + ':load_rendering_plugins:package=%s for plugin=%s at=%s', plugin_cfg.package, plugin_cfg.name, file_path)
					plugin_class = require(file_path)
				}
				else if ( T.isString(plugin_cfg.file) )
				{
					const file_path = this.runtime.context.get_absolute_path(plugin_cfg.file)
					console.log(context + ':load_rendering_plugins:file_path=%s for plugin=%s', file_path, plugin_cfg.name)

					plugin_class = require(file_path)
				}

				if (plugin_class)
				{
					if ( plugin_class.default )
					{
						plugin_class = plugin_class.default
					}

					const plugin = new plugin_class(plugins_mgr)
					plugins_mgr.load_at_first(plugin)

					console.log(context + ':load_rendering_plugins:plugin=%s is loaded', plugin_cfg.name)
				}
			}
		)
			
			
		this.leave_group('load_rendering_plugins')
	}
}
