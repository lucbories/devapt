
import T from 'typr'
import assert from 'assert'

import { store, config } from '../store/index'
import Module from '../base/module'
import Plugin from '../base/plugin'
import Database from '../resources/database'

import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage3_executable'



/**
 * Runtime Stage 3 consists of:
 * 		- create connexions, modules and plugins
*/
export default class RuntimeStage3Executable extends RuntimeExecutable
{
	constructor()
	{
		super(context)
	}
	
	
	execute()
	{
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage3', 'enabled'], false)
		this.set_trace(has_trace)
		
		this.separate_level_1()
		this.enter_group('execute')
		
		if (this.runtime.is_master)
		{
			// BUILD MASTER RESOURCES
			this.info('Load master')
			
			this.make_connexions()
			this.make_modules()
			this.make_plugins()
		}
		
		this.leave_group('execute')
		this.separate_level_1()
		this.set_trace(saved_trace)
        return Promise.resolve()
	}
	
	
	make_connexions()
	{
		this.enter_group('make_connexions')
		
		if ( config().hasIn( ['security', 'resources_by_name'] ) )
		{
			const cfg_all_cx = config().getIn( ['security', 'resources_by_name'] ).toArray()
			cfg_all_cx.forEach(
				(cfg_cx) => {
					const cx_name = cfg_cx.get('name')
					this.info('Processing connexion creation of:' + cx_name)
					
					let cx = new Database(cx_name, cfg_cx)
					cx.load()
					this.runtime.resources.add(cx)
				}
			)
		}
		
		this.leave_group('make_connexions')
	}
	
	
	make_modules()
	{
		this.enter_group('make_modules')
		
		
		// CREATE MODULES
		let cfg_modules = config.get_collection('modules')
		cfg_modules.forEach(
			(module_cfg, module_name) => {
				if (module_name == 'error')
				{
					console.log(module_cfg, 'error')
					assert(false, context + ':an error occures in the modules loading process')	
				}
				this.info('Processing module creation of:' + module_name)
				
				let module_obj = new Module(module_name, module_cfg)
				
				module_obj.load()
				
				this.runtime.modules.add(module_obj)
			}
		)
		
		
		// LOOP MODULES RESOURCES AND LOAD MODELS ASSOCIATIONS AFTER ALL MODELS ARE CREATED
		for(let module_obj of this.runtime.modules.get_all())
		{
			this.info('make_modules for [' + module_obj.$name + ']')
			
			for(let res_obj of module_obj.resources.get_all() )
			{
				this.runtime.resources.add(res_obj)
			}
			
			for(let res_obj of module_obj.resources.get_all() )
			{
				if (res_obj.is_model)
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
		
		let cfg_plugins = config.get_collection('plugins')
		cfg_plugins.forEach(
			(plugin_cfg, plugin_name) => {
				this.info('Processing plugin creation of:' + plugin_name)
				
				let plugin = new Plugin(plugin_name, plugin_cfg)
				plugin.load()
				this.runtime.plugins.add(plugin)
			}
		)
		
		this.leave_group('make_plugins')
	}
}
