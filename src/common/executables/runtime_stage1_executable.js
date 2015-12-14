
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
		this.enter_group('execute')
		
		if (this.runtime.is_master)
		{
			this.info('Node is master')
			
			// LOAD MASTER SETTINGS
			if ( T.isString(this.runtime.settings.apps_settings_file) )
			{
				this.info('Node is master: load settings file [' + this.runtime.settings.apps_settings_file + ']')
				
				const json = require( path.join('../..', this.runtime.settings.apps_settings_file) )
				dispatch_store_config_set_all(store, json)
			}
		}
		else
		{
			this.info('Node is not master')
		}
		
		this.leave_group('execute')
	}
}
