
import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import immutable from 'immutable'

import { store, config } from '../store/index'
import { dispatch_store_config_set_all } from '../store/config/actions'

import Node from '../base/node'
import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage0_executable'



/**
 * Runtime Stage 0 consists of:
 * 		- create node
 * 		- create bus or connect to bus
*/
export default class RuntimeStage0Executable extends RuntimeExecutable
{
	constructor()
	{
		super(context)
	}
	
	
	execute()
	{
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage0', 'enabled'], false)
		this.set_trace(has_trace)
		
		this.enter_group('execute')
		
		const node_name = this.runtime.get_setting('name', null)
		const master_name = this.runtime.get_setting(['master','name'])
		// const master_host = this.runtime.get_setting(['master','host'])
		// const master_port = this.runtime.get_setting(['master','port'])
		
		// const master_cfg = {
		// 	"is_master":true,
			
		// 	"master":{
		// 		"name":master_name,
		// 		"host":master_host,
		// 		"port":master_port
		// 	}
		// }
		
		// const node_cfg = {
		// 	"is_master":false,
		// 	"master":master_cfg
		// }
		
		if (this.runtime.is_master)
		{
			this.info('Node is master')
			assert(node_name == master_name, context + ':node name [' + node_name + '] not equals master name [' + master_name + ']')
			
			// LOAD MASTER SETTINGS
			const apps_file_path = this.runtime.get_setting('apps_settings_file')
			if ( T.isString(apps_file_path) )
			{
				this.info('Node is master: load settings file [' + apps_file_path + ']')
				
				const json = require( path.join('../..', apps_file_path) )
				dispatch_store_config_set_all(store, json)
			}
			
			// CREATE MASTER NODE
			this.info('Create Node and load it')
			this.runtime.node = new Node(node_name, this.runtime.get_settings())
			this.runtime.node.load()
		}
		else
		{
			this.info('Node is not master')
			
			// CREATE SIMPLE NODE
			this.runtime.node = new Node(node_name, this.runtime.get_settings())
			this.runtime.node.load()
		}
		
		this.leave_group('execute')
		this.set_trace(saved_trace)
	}
}
