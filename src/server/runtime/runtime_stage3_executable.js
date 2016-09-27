// NPM IMPORTS
import assert from 'assert'

// COMMON IMPORTS
import Module from '../../common/topology/runtime/topology_runtime_module'
import Database from '../../common/topology/runtime/topology_runtime_database'

// SERVER IMPORTS
import RuntimeExecutable from './runtime_executable'


let context = 'server/runtime/runtime_stage3_executable'



/**
 * Runtime Stage 3 consists of:
 * 		- create connexions, modules and plugins
*/
export default class RuntimeStage3Executable extends RuntimeExecutable
{
	constructor(arg_logger_manager)
	{
		super(context, arg_logger_manager)
		this.$name = 'stage 3'
	}
	
	
	execute()
	{
		// SAVE TRACES STATE
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage3', 'enabled'], false)
		if (has_trace)
		{
			this.enable_trace()
		}
		
		
		// EXECUTE ACTIONS
		this.separate_level_1()
		this.enter_group('execute')
		
		this.make_connexions()
		this.make_modules()
		this.make_plugins()
		
		this.leave_group('execute')
		this.separate_level_1()
		
		
		// RESTORE TRACES STATE
		if (! saved_trace && has_trace)
		{
			this.disable_trace()
		}
		
		return Promise.resolve()
	}
	
	
	make_connexions()
	{
		this.enter_group('make_connexions')
		
		if ( this.runtime.get_registry().root.hasIn( ['security', 'resources_by_name'] ) )
		{
			const cfg_all_cx = this.runtime.get_registry().root.getIn( ['security', 'resources_by_name'] ).toArray()
			cfg_all_cx.forEach(
				(cfg_cx) => {
					const cx_name = cfg_cx.get('name')
					this.info('Processing connexion creation of:' + cx_name)
					
					let cx = new Database(cx_name, cfg_cx)
					cx.load()
					this.runtime.get_topology().resources.add(cx)
				}
			)
		}
		
		this.leave_group('make_connexions')
	}
	
	
	make_modules()
	{
		this.enter_group('make_modules')
		
		
		// CREATE MODULES
		let cfg_modules = this.runtime.get_registry().get_collection('modules')
		cfg_modules.forEach(
			(module_cfg, module_name) => {
				if (module_name == 'error')
				{
					console.log(module_cfg, 'error')
					assert(false, context + ':an error occures in the modules loading process')	
				}
				this.info('Processing module creation of:' + module_name)
				
				let module_obj = new Module(module_name, module_cfg)
				this.info('Module created:' + module_name)

				module_obj.load()
				this.info('Module loaded:' + module_name)

				this.runtime.get_topology().modules.add(module_obj)
				this.info('Module added to runtime topology:' + module_name)
			}
		)
		
		
		// LOOP MODULES RESOURCES AND LOAD MODELS ASSOCIATIONS AFTER ALL MODELS ARE CREATED
		for(let module_obj of this.runtime.get_topology().modules.get_all())
		{
			this.info('make_modules for [' + module_obj.$name + ']')
			
			for(let res_obj of module_obj.resources.get_all() )
			{
				this.runtime.get_topology().resources.add(res_obj)
			}
			
			for(let res_obj of module_obj.resources.get_all() )
			{
				if (res_obj.is_topology_model)
				{
					// this.info('make_modules for [' + module_obj.$name + '] for model [' + res_obj.$name + ']')
					
					res_obj.load_associations()
					res_obj.load_includes()
				}
			}
		}
		
		
		this.leave_group('make_modules')
	}
	
	
	make_plugins()
	{
		this.enter_group('make_plugins')
		
		// TODO
		/*
		let cfg_plugins = store.get_collection('plugins')
		cfg_plugins.forEach(
			(plugin_cfg, plugin_name) => {
				this.info('Processing plugin creation of:' + plugin_name)
				
				let plugin = new Plugin(plugin_name, plugin_cfg)
				plugin.load()
				this.runtime.get_topology().plugins.add(plugin)
			}
		)*/
		
		this.leave_group('make_plugins')
	}
}
