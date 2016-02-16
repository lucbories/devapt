import T from 'typr'
import assert from 'assert'
import path from 'path'
import { Map, fromJS } from 'immutable'

import { store, config } from '../store/index'
import * as exec from '../executables/index'
import MiddlewareService from '../services/mw_service'
import {SOURCE_LOCAL_FILE} from '../datas/providers/provider'

import Collection from './collection'
import Security from './security'
import Settingsable from './settingsable'
import Service from './service'
import RegisteredService from './registered_service'



let context = 'common/base/runtime'



/**
 * DEFAULT RUNTIME SETTINGS
 */
const default_settings = {
	'is_master':false,
	
	'master':{
		'name': null,
		'host':"localhost",
		'port':5000
	},
	
	'node':{
		'name': null/*,
		'host':"localhost",
		'port':5001*/
	},
	
    "settings_provider": {
        'source':SOURCE_LOCAL_FILE,
        "relative_path":"apps/world.json"
    }
}



/**
 * Runtime class - main library interface.
 * @author Luc BORIES
 * @license Apache-2.0
 */
class Runtime extends Settingsable
{
    /**
     * Create a Runtime instance
     */
	constructor()
	{
		super( fromJS( default_settings ), context)
		
		// this.$settings = fromJS( default_settings )
		
		this.is_runtime = true
		this.is_master = this.get_setting('is_master', false)
		
		this.node = null;
		
		this.nodes = new Collection()
		this.servers = new Collection()
		this.services = new Collection()
		this.registered_services = new Collection()
		
		this.modules = new Collection()
		this.plugins = new Collection()
		this.resources = new Collection()
		
		this.transactions = new Collection()
		this.applications = new Collection()
		
        this.security = new Security()
        
		this.info('Runtime is created')
	}
	
    
	/**
     * Load runtime settings 
     * @param {object} arg_settings - runtime settings
     * @returns {object} promise
     */
	load(arg_settings)
	{
        const self = this
        
		this.separate_level_1()
		this.enter_group('load')
		
		this.$settings = fromJS( Object.assign(default_settings, arg_settings) )
		this.is_master = this.get_setting('is_master', false)
		
		
		const stage0 = new exec.RuntimeStage0Executable()
		stage0.prepare({runtime:this})
		stage0.execute()
		
		const stage1 = new exec.RuntimeStage1Executable()
		stage1.prepare({runtime:this})
        
		const promise_1 = stage1.execute()
        
        promise_1
        .catch(
            function(arg_reason)
            {
                console.log(arg_reason, 'promise 1 catch')
                self.error(context + ':stage 1 failure')
            }
        )
        .then(
		    function(arg_result)
            {
                // console.log(arg_result, 'promise 2 then')
                assert(arg_result, context + ':stage 2 promise failure')
                
                const stage2 = new exec.RuntimeStage2Executable()
                stage2.prepare({runtime:self})
                stage2.execute()
                return true
            }
        )
        .catch(
            function(arg_reason)
            {
                console.log(arg_reason, 'promise 2 catch')
                self.error(context + ':stage 2 failure')
            }
        )
        .then(
		    function(arg_result)
            {
                // console.log(arg_result, 'promise 3 then')
                assert(arg_result, context + ':stage 3 promise failure')
                
                const stage3 = new exec.RuntimeStage3Executable()
                stage3.prepare({runtime:self})
                stage3.execute()
                return true
            }
        )
        .catch(
            function(arg_reason)
            {
                console.log(arg_reason, 'promise 3 catch')
                self.error(context + ':stage 3 failure')
            }
        )
        .then(
		    function(arg_result)
            {
                // console.log(arg_result, 'promise 4 then')
                assert(arg_result, context + ':stage 4 promise failure')
                
                const stage4 = new exec.RuntimeStage4Executable()
                stage4.prepare({runtime:self})
                stage4.execute()
                return true
            }
        )
        .catch(
            function(arg_reason)
            {
                console.log(arg_reason, 'promise 4 catch')
                self.error(context + ':stage 4 failure')
            }
        )
        .then(
		    function(arg_result)
            {
                // console.log(arg_result, 'promise 5 then')
                assert(arg_result, context + ':stage 5 promise failure')
                
                const stage5 = new exec.RuntimeStage5Executable()
                stage5.prepare({runtime:self})
                stage5.execute()
                return true
            }
        )
        .catch(
            function(arg_reason)
            {
                console.log(arg_reason, 'promise 5 catch')
                self.error(context + ':stage 5 failure')
            }
        )
        
        
		this.leave_group('load')
		this.separate_level_1()
	}
	
	
	register_service(arg_node_name, arg_svc_name, arg_server_name, arg_server_host, arg_server_port)
	{
		this.enter_group('register_service')
		
		assert( T.isString(arg_node_name), context + ':register_service:bad node name string')
		assert( T.isString(arg_svc_name), context + ':register_service:bad service name string')
		
		const cfg = {
			"node_name":arg_node_name,
			"service_name":arg_svc_name,
			"server_name":arg_server_name,
			"server_host":arg_server_host,
			"server_port":arg_server_port
		}
		const svc = new RegisteredService(cfg)
		this.register_services.add(svc)
		
		this.leave_group('register_service')
	}
	
	
	watch_files()
	{
		/*let self = this
		const dir_to_watch = path.join(base_idr, '../../apps/private/devtools/lib/')
		fs.watch(dir_to_watch,
			function(event, target_file)
			{
				self.info('Reloading apps/private/devtools/lib/ file [' + target_file + ']')
				console.log(target_file, 'is', event)
				
				const file_path_name = path.join(dir_to_watch, target_file)
				delete require.cache[file_path_name]
				require(file_path_name)
			}
		)*/
	}
}


let runtime_singleton = new Runtime()

export default runtime_singleton