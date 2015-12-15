
import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import immutable from 'immutable'

import { store, config } from '../store/index'
import { dispatch_store_config_set_all } from '../store/config/actions'

import Node from '../base/node'
import RuntimeExecutable from './runtime_executable'


let context = 'common/executables/runtime_stage1_executable'



/**
 * Runtime Stage 1 consists of:
 * 		- load master apps settings
*/
export default class RuntimeStage1Executable extends RuntimeExecutable
{
	constructor()
	{
		super(context)
	}
	
	
	execute()
	{
		const saved_trace = this.get_trace()
		const has_trace = this.runtime.get_setting(['trace', 'stages', 'RuntimeStage1', 'enabled'], false)
		this.set_trace(has_trace)
		
		this.enter_group('execute')
		
		if (this.runtime.is_master)
		{
			this.info('Node is master')
			
			// LOAD MASTER SETTINGS
			const file_path = this.runtime.get_setting('apps_settings_file', null)
			if ( T.isString(file_path) )
			{
				this.info('Node is master: load settings file [' + file_path + ']')
				
				const json = require( path.join('../..', file_path) )
				dispatch_store_config_set_all(store, json)
			}
		}
		else
		{
			this.info('Node is not master')
		}
		
		this.leave_group('execute')
		this.set_trace(saved_trace)
	}
}
