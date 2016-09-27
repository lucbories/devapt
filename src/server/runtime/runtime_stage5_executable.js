// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import fs from 'fs'

// SERVER IMPORTS
import RuntimeExecutable from './runtime_executable'


let context = 'server/runtime/runtime_stage5_executable'



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
		// SAVE TRACES STATE
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage5', 'enabled'], false)
		if (has_trace)
		{
			this.enable_trace()
		}
		
		
		// EXECUTE ACTIONS
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
		const self = this
		self.enter_group('load_rendering_plugins')

		const plugins_mgr = self.runtime.get_plugins_factory().get_rendering_manager()

		const rendering_plugins = this.runtime.get_registry().get_plugin_js('rendering')
		//self.runtime.get_setting(['plugins', 'rendering'], undefined)
		console.log(context + ':load_rendering_plugins:rendering_plugins', rendering_plugins)

		const rendering_plugins_array = (rendering_plugins ? rendering_plugins : [])
		rendering_plugins_array.forEach(
			(plugin_cfg) => {
				assert( T.isObject(plugin_cfg), context + ':load_rendering_plugins:bad plugin setting object')
				assert( T.isString(plugin_cfg.name), context + ':load_rendering_plugins:bad plugin name string')
				console.log(context + ':load_rendering_plugins:plugin=%s', plugin_cfg.name)

				let plugin_class = undefined
				if ( T.isString(plugin_cfg.package) )
				{
					// TODO : loading packages without full path?
					let file_path = undefined

					file_path = self.runtime.context.get_absolute_path('./node_modules/', plugin_cfg.package)
					let file_path_stats = file_path ? fs.statSync(file_path) : undefined
					if ( ! file_path_stats || ! file_path_stats.isDirectory())
					{
						file_path = self.runtime.context.get_absolute_path('../node_modules/', plugin_cfg.package)
						file_path_stats = file_path ? fs.statSync(file_path) : undefined
						if ( ! file_path_stats || ! file_path_stats.isDirectory())
						{
							file_path = self.runtime.context.get_absolute_path('../../node_modules/', plugin_cfg.package)
							file_path_stats = file_path ? fs.statSync(file_path) : undefined
							if ( ! file_path_stats || ! file_path_stats.isDirectory())
							{
								file_path = self.runtime.context.get_absolute_path('../../../node_modules/', plugin_cfg.package)
								file_path_stats = file_path ? fs.statSync(file_path) : undefined
								if ( ! file_path_stats || ! file_path_stats.isDirectory())
								{
									file_path = undefined
								}
							}
						}
					}

					if (file_path)
					{
						console.log(context + ':load_rendering_plugins:package=%s for plugin=%s at=%s', plugin_cfg.package, plugin_cfg.name, file_path)
						plugin_class = require(file_path)
					}
					else
					{
						file_path = undefined
						console.error(context + ':load_rendering_plugins:not found package=%s for plugin=%s at=%s', plugin_cfg.package, plugin_cfg.name)
					}
				}
				else if ( T.isString(plugin_cfg.file) )
				{
					const file_path = self.runtime.context.get_absolute_path(plugin_cfg.file)
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
			
			
		self.leave_group('load_rendering_plugins')
	}
}
