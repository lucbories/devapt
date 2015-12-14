
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
		this.enter_group('execute')
		
		const master_name = this.runtime.settings.master.name
		const master_host = this.runtime.settings.master.host
		const master_port = this.runtime.settings.master.port
		const master_cfg = {
			"is_master":true,
			"name":master_name,
			"host":master_host,
			"port":master_port
		}
		
		if (this.runtime.is_master)
		{
			this.info('Node is master')
			
			// LOAD MASTER SETTINGS
			// if ( T.isString(this.runtime.settings.apps_settings_file) )
			// {
			// 	this.info('Node is master: load settings file [' + this.runtime.settings.apps_settings_file + ']')
				
			// 	const json = require( path.join('../..', this.runtime.settings.apps_settings_file) )
			// 	dispatch_store_config_set_all(store, json)
			// }
			
			// CREATE MASTER NODE
			this.info('Create Node and load it')
			this.runtime.node = new Node(master_name, immutable.fromJS(master_cfg))
			this.runtime.node.load()
		}
		else
		{
			this.info('Node is not master')
			
			// CREATE SIMPLE NODE
			const node_name = this.runtime.settings.node.name
			const node_host = this.runtime.settings.node.host
			const node_port = this.runtime.settings.node.port
			const node_cfg = {
				"is_master":false,
				"host":node_host,
				"port":node_port,
				"master":master_cfg
			}
			this.runtime.node = new Node(node_name, immutable.fromJS(node_cfg))
			this.runtime.node.load()
		}
		
		this.leave_group('execute')
	}
}
