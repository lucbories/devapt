

import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import Instance from '../utils/instance'
import { store, config, runtime } from '../store/index'



let context = 'common/base/service'
let debug = debug_fn(context)


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
	// TODO: A SERVICE(Name) PER APPLICATION OR PER RUNTIME OR PER SERVICE ?
	constructor(arg_svc_name)
	{
		this.status = STATUS_UNKNOW
		
		assert( config.has_collection('services'), context + ':not found config.services')
		let settings = config.hasIn(['services', arg_svc_name]) ? config.getIn(['services', arg_svc_name]) : {}
		
		super('services', 'Service', arg_svc_name, settings)
		
		/*this.app = null
		
		// CHECK APPLICATION NAME
		if (! runtime.has_application(arg_app_name))
		{
			this.status = Service.STATUS_ERROR
			return
		}
		
		// GET APPLICATION
		this.app = runtime.get_application(arg_app_name)
		*/
		this.status = Service.STATUS_CREATED
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
	activate(arg_app_obj)
	{
		
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