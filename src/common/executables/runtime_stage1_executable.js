
import T from 'typr'
import assert from 'assert'
import fs from 'fs'
import path from 'path'
import immutable from 'immutable'

import { store, config } from '../store/index'
import { dispatch_store_config_set_all } from '../store/config/actions'

import Node from '../base/node'
import Provider from '../datas/providers/provider'
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
		if (this.runtime.is_master)
		{
			this.info('Node is master')
			
            const settings_provider = this.runtime.get_setting('settings_provider', null)
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
                        // console.log(arg_json, 'arg_json')
                        dispatch_store_config_set_all(store, arg_json)
                        return true
                    }
                )
                .catch(
                    // FAILURE
                    function(arg_reason)
                    {
                        self.error(context + ':settings loading failure')
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
		
		this.leave_group('execute')
		this.separate_level_1()
		this.set_trace(saved_trace)
        return promise
	}
}
