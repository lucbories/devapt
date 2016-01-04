
import T from 'typr'
import assert from 'assert'

import { is_browser, is_server } from '../utils/is_browser'
import { store, config } from '../store/index'

import Instance from './instance'
import Collection from './collection'
import runtime from './runtime'

import ServiceConsumer from '../services/service_consumer'
import ProducerConsumer from '../services/service_provider'



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
		this.registered_nodes = new Collection()
		
		this.locale_exec = arg_locale_exec
		this.remote_exec = arg_remote_exec
        
		this.providers = new Collection()
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
		// this.info('servers ' + arg_app_svc_cfg.servers.length)
		
		for(let i in arg_app_svc_cfg.servers)
		{
			const server_name = arg_app_svc_cfg.servers[i]
			assert(T.isString(server_name), context + ':bad server name string')
			// this.info('server_name ' + server_name)
			
			const server = runtime.node.servers.find_by_name(server_name)
			if ( T.isObject(server) )
			{
				this.activate_on_server(arg_application, server, arg_app_svc_cfg)
			}
			else
			{
				this.info('server_name not found ' + server_name)
			}
		}
	}
	
	
	// ACTIVATE A SERVICE FEATURE FOR AN APPLICATION ON A SERVER
	activate_on_server(arg_application, arg_server, arg_app_svc_cfg)
	{
		this.info('activate_on_server [' + arg_server.get_name() + '] for application [' + arg_application.get_name() + ']')
		
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
        
		let provider = this.get_provider_by_app_server(arg_application.get_name(), arg_server.get_name())
		
		provider.activate(arg_application, arg_server, arg_app_svc_cfg)
	}
	
	
	get_providers()
	{
		return this.providers
	}
    
    
    get_a_provider(arg_strategy)
    {
        let provider = null
        
        if (! arg_strategy)
        {
            // USE THE FIRST ITEM OF THE LIST OR THE WEAKED LIST IF ENABLED
            provider = this.providers.get_first()
        }
        
        // TODO: define metrics on the provider and update the weak at each turn
        // TODO: define Strategy class with: bablance, round
        
        if (! provider)
		{
            // const key = 'app' + '-' + 'name'
			// provider = this.create_provider(this.get_name() + '_provider_for_' + key, this)
			// this.providers.add(provider)
		}
        
        return provider
    }
	
	
	get_provider_by_app_server(arg_app_name, arg_server_name)
	{
		const key = arg_app_name + '-' + arg_server_name
		let provider = this.providers.find_by_attr('application_server', key)
		assert(! provider, context + ':service provider already activated')
		
		if (! provider)
		{
			provider = this.create_provider(this.get_name() + '_provider_for_' + key, this)
			this.providers.add(provider)
		}
		
		return provider
	}
	
	
	create_provider(arg_name, arg_service)
	{
        // this.error('create_provider is not implemented')
		return new ProducerConsumer(arg_name, arg_service)
	}
	
	
	create_consumer()
	{
        // this.error('create_consumer is not implemented')
		return new ServiceConsumer(this.get_name() + '_consumer_' + this.get_id(), this)
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