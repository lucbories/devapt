

import T from 'typr'
import assert from 'assert'

import Instance from './instance'
import { is_browser, is_server } from '../utils/is_browser'
import { store, config } from '../store/index'
import runtime from './runtime'



let context = 'common/base/service'


// STATUS CONSTANTS
// unknow -> created -> enabled -> disabled -> enabled
const STATUS_UNKNOW = 'unknow'
const STATUS_ERROR = 'error'
const STATUS_CREATED = 'created'
const STATUS_ENABLED = 'enabled'
const STATUS_DISABLED = 'disabled'


export default class Service extends Instance
{
	// STATIC CONST ACCESSORS
	static STATUS_UNKNOW()   { return STATUS_UNKNOW }
	static STATUS_ERROR()    { return STATUS_ERROR }
	static STATUS_CREATED()  { return STATUS_CREATED }
	static STATUS_ENABLED()  { return STATUS_ENABLED }
	static STATUS_DISABLED() { return STATUS_DISABLED }
	
	
	// CONSTRUCTOR
	constructor(arg_svc_name, arg_locale_exec, arg_remote_exec, arg_context)
	{
		assert( config.has_collection('services'), context + ':not found config.services')
		let settings = config().hasIn(['services', arg_svc_name]) ? config().getIn(['services', arg_svc_name]) : {}
		
		super('services', 'Service', arg_svc_name, settings, arg_context ? arg_context : context)
		
		this.status = STATUS_UNKNOW
		
		// CHECK EXECUTABLES
		// assert( T.isObject(arg_locale_exec) && arg_locale_exec.is_executable, context + ':bad locale executable')
		// assert( T.isObject(arg_remote_exec) && arg_remote_exec.is_executable, context + ':bad remote executable')
		
		this.is_service = true
		
		this.status = Service.STATUS_CREATED
		this.locale_exec = arg_locale_exec
		this.remote_exec = arg_remote_exec
	}
	
	
	// STATUS TEST
	is_unknow()   { return this.status === STATUS_UNKNOW }
	is_error()    { return this.status === STATUS_ERROR }
	is_created()  { return this.status === STATUS_CREATED }
	is_enabled()  { return this.status === STATUS_ENABLED }
	is_disabled() { return this.status === STATUS_DISABLED }
	
	
	// ENABLE A SERVICE
	enable()
	{
		if (this.is_unknow() || this.is_error() || this.is_enabled())
		{
			return false;
		}
		
		this.status = Service.STATUS_ENABLED
		return true
	}
	
	
	// DISABLE A SERVICE
	disable()
	{
		if (this.is_unknow() || this.is_error() || this.is_disabled())
		{
			return false;
		}
		
		this.status = Service.STATUS_DISABLED
		return true
	}
	
	
	// ACTIVATE A SERVICE FEATURE FOR AN APPLICATION
	activate(arg_application, arg_app_svc_cfg)
	{
		// console.log(arg_app_svc_cfg, context + ':arg_app_svc_cfg')
		assert( T.isObject(arg_app_svc_cfg) , context + ":bad app svc settings object")
		assert( T.isArray(arg_app_svc_cfg.servers), context + ":bad app svc servers array")
		
		for(let i in arg_app_svc_cfg.servers)
		{
			const server_name = arg_app_svc_cfg.servers[i]
			assert(T.isString(server_name), context + ':bad server name string')
			
			const server = runtime.servers.find_by_name(server_name)
			assert(T.isObject(server), context + ':bad server object')
			
			this.activate_on_server(arg_application, server, arg_app_svc_cfg)
		}
	}
	
	
	// ACTIVATE A SERVICE FEATURE FOR AN APPLICATION ON A SERVER
	activate_on_server(arg_application, arg_server, arg_app_svc_cfg)
	{
		const exec_cfg = this.get_settings().toJS()
		exec_cfg.server = arg_server
		// console.log(exec_cfg, context + ':exec_cfg')
		
		if (is_browser())
		{
			this.locale_exec.prepare(exec_cfg)
			this.locale_exec.execute(arg_application)
		}
		else if (is_server())
		{
			this.remote_exec.prepare(exec_cfg)
			this.remote_exec.execute(arg_application)
		}
	}
}


/*
Loading:
	create rt = new Runtime()
	rt.load()
		load_config
			fill config.*
		load_runtime
			create instances and fill runtime.*
			1 create servers
			2 create services
			3 create applications

EXAMPLES
	"rest_api_models_query":["*"],
	"rest_api_models_modifier":["*"],
	"rest_api_resources_query":["*"],
	"rest_api_resources_modifier":["*"],
	"html_assets":false,
	"html_app":false
*/