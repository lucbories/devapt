import { store, config, runtime } from '../../common/store/index'


// STATUS CONSTANTS
// unknow -> created -> enabled -> disabled -> enabled
const STATUS_UNKNOW = 'unknow'
const STATUS_ERROR = 'error'
const STATUS_CREATED = 'created'
const STATUS_ENABLED = 'enabled'
const STATUS_DISABLED = 'disabled'


export default class Service
{
	// STATIC CONST ACCESSORS
	static STATUS_UNKNOW()   { return STATUS_UNKNOW }
	static STATUS_ERROR()    { return STATUS_ERROR }
	static STATUS_CREATED()  { return STATUS_CREATED }
	static STATUS_ENABLED()  { return STATUS_ENABLED }
	static STATUS_DISABLED() { return STATUS_DISABLED }
	
	
	// CONSTRUCTOR
	constructor(arg_app_name, arg_svc_name)
	{
		this.status = STATUS_UNKNOW
		this.name = null
		this.app = null
		
		// CHECK APPLICATION NAME
		if (! runtime.has_application(arg_app_name))
		{
			this.status = Service.STATUS_ERROR
			return
		}
		
		this.app = runtime.get_application(arg_app_name)
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
}


/*
EXAMPLES
	"rest_api_models_query":["*"],
	"rest_api_models_modifier":["*"],
	"rest_api_resources_query":["*"],
	"rest_api_resources_modifier":["*"],
	"html_assets":false,
	"html_app":false
*/