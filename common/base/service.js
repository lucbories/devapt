

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
	constructor(arg_svc_name, arg_locale_exec, arg_remote_exec)
	{
		assert( config.has_collection('services'), context + ':not found config.services')
		let settings = config().hasIn(['services', arg_svc_name]) ? config().getIn(['services', arg_svc_name]) : {}
		
		super('services', 'Service', arg_svc_name, settings, context)
		this.status = STATUS_UNKNOW
		
		// CHECK EXECUTABLES
		assert( T.isObject(arg_locale_exec) && arg_locale_exec.is_executable, context + ':bad locale executable')
		assert( T.isObject(arg_remote_exec) && arg_remote_exec.is_executable, context + ':bad remote executable')
		
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
		const exec_cfg = this.get_settings().toJS()
		const server_name = exec_cfg.server
		const server = runtime.servers.find_by_name(server_name)
		assert(T.isObject(server), context + ':bad server object')
		
		exec_cfg.server = server
		exec_cfg.application = arg_application
		
		if (is_browser())
		{
			this.locale_exec.prepare(exec_cfg)
			this.locale_exec.execute()
		}
		else if (is_server())
		{
			this.remote_exec.prepare(exec_cfg)
			this.remote_exec.execute()
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