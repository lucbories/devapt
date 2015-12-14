import T from 'typr'
import assert from 'assert'
import path from 'path'
import { Map } from 'immutable'

import { store, config } from '../store/index'
import * as exec from '../executables/index'
import MiddlewareService from '../services/mw_service'

import Collection from './collection'
import Loggable from './loggable'
import Service from './service'
import RegisteredService from './registered_service'



let context = 'common/base/runtime'


// DEFAULT RUNTIME SETTINGS
const default_settings = {
	'is_master':false,
	'master':{
		'name': null,
		'host':"localhost",
		'port':5000
	},
	'node':{
		'name': null,
		'host':"localhost",
		'port':5001
	},
	'apps_settings_file':null,
	'logs':{
		'enabled':true,
		'levels':['debug', 'info', 'warn', 'error'],
		'classes':null,
		'instances':null
	}
}


class Runtime extends Loggable
{
	constructor()
	{
		super(context)
		
		this.settings = default_settings
		
		this.is_runtime = true
		this.is_master = this.settings.is_master
		
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
		
		this.info('Runtime is created')
	}
	
	
	load(arg_settings)
	{
		this.enter_group('load')
		
		this.settings = Object.assign(default_settings, arg_settings)
		this.is_master = this.settings.is_master
		
		
		this.info('==========================================================================================================================')
		
		const stage0 = new exec.RuntimeStage0Executable()
		stage0.prepare({runtime:this})
		stage0.execute()
		
		this.info('==========================================================================================================================')
		const stage1 = new exec.RuntimeStage1Executable()
		stage1.prepare({runtime:this})
		stage1.execute()
		
		this.info('==========================================================================================================================')
		const stage2 = new exec.RuntimeStage2Executable()
		stage2.prepare({runtime:this})
		stage2.execute()
		
		this.info('==========================================================================================================================')
		const stage3 = new exec.RuntimeStage3Executable()
		stage3.prepare({runtime:this})
		stage3.execute()
		
		this.info('==========================================================================================================================')
		const stage4 = new exec.RuntimeStage4Executable()
		stage4.prepare({runtime:this})
		stage4.execute()
		
		this.info('==========================================================================================================================')
		const stage5 = new exec.RuntimeStage5Executable()
		stage5.prepare({runtime:this})
		stage5.execute()
		
		this.info('==========================================================================================================================')
		
		
		this.leave_group('load')
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
		const dir_to_watch = path.join(__dirname, '../../apps/private/devtools/lib/')
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