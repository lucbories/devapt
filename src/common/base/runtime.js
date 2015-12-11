import T from 'typr'
import assert from 'assert'
import path from 'path'

import { store, config } from '../store/index'
import * as exec from '../executables/index'

import Collection from './collection'
import Loggable from './loggable'
import Server from './server'
import Service from './service'
import Module from './module'
import Plugin from './plugin'
import Node from './node'
import Application from './application'
import Database from '../resources/database'

import MiddlewareService from '../services/mw_service'
import { dispatch_store_config_set_all } from '../store/config/actions'


let context = 'common/base/runtime'


// DEFAULT RUNTIME SETTINGS
const default_settings = {
	'node_name': null,
	'master':{
		'host':null,
		'port':null
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
	constructor(arg_settings)
	{
		super(context)
		
		this.settings = Object.assign(default_settings, arg_settings)
		
		this.is_runtime = true
		this.is_master = false
		
		this.node = null;
		
		this.nodes = new Collection()
		this.servers = new Collection()
		this.services = new Collection()
		
		this.modules = new Collection()
		this.plugins = new Collection()
		this.resources = new Collection()
		
		this.transactions = new Collection()
		this.applications = new Collection()
		
		this.info('Runtime is created')
	}
	
	
	load()
	{
		this.enter_group('load')
		
		// 1 - STORE (config and runtime) IS CREATED BY ../store/index WHICH CALL create_store()
				// LOAD apps.json
		if (this.is_master)
		{
			this.info('Node is master')
			if ( T.isString(this.settings.apps_settings_file) )
			{
				this.info('Node is master: load settings file [' + this.settings.apps_settings_file + ']')
				const json = require( path.joins('..', this.settings.apps_settings_file) )
				dispatch_store_config_set_all(json)
			}
		}
		
		// 2 - CREATE RUNTIME INSTANCES
			// create instances and fill runtime.*
			// 1 create nodes
			// 2 create services
			// 3 create applications
		
		this.make_nodes()
		this.make_services()
		
		this.make_connexions()
		this.make_modules()
		this.make_plugins()
		
		// this.activate_services()
		
		this.make_applications()
		
		this.leave_group('load')
	}
	
	
	make_nodes()
	{
		this.enter_group('make_nodes')
		
		// LOOP ON NODES
		let cfg_nodes= config.get_collection('nodes')
		// console.log(cfg_nodes, 'cfg_nodes')
		cfg_nodes.forEach(
			(node_cfg, node_name) => {
				this.info('Processing node creation of:' + node_name)
				
				
				// CREATE NODE
				const node = new Node(node_name, node_cfg)
				
				if (this.settings.node_name == node_name)
				{
					this.info('Setting runtime node:' + node_name + ' (is_master:' + (node.is_master ? 'true' : 'false') + ')')
					this.node = node
					this.is_master = node.is_master
				}
				/*
				node.load()
				
				this.nodes.add(node)
				node.enable()*/
				
				this.make_servers( node_cfg.get('servers'), node)
			}
		)
		
		this.leave_group('make_nodes')
	}
	
	
	make_servers(arg_node_servers_config, arg_node)
	{
		this.enter_group('make_servers')
		
		arg_node_servers_config.forEach(
			(server_cfg, server_name) => {
				this.info('Processing server creation of:' + server_name)
				
				const server_type = server_cfg.has('type') ? server_cfg.get('type') : null
				assert( T.isString(server_type), context + ':bad server type string for server name [' + server_name + ']')
				
				let server = Server.create(server_type, server_name, server_cfg)
				server.load()
				
				arg_node.servers.add(server)
				this.servers.add(server)
				server.enable()
			}
		)
		
		this.leave_group('make_servers')
	}
	
	
	make_services()
	{
		this.enter_group('make_services')
		
		let services = config.get_collection_names('services')
		services.forEach(
			(service_name) => {
				assert(T.isString(service_name), context + ':bad service namr')
				this.info('Processing service creation of:' + service_name)
				
				let cfg_service = config.get_collection_item('services', service_name)
				// console.log(cfg_service, 'cfg_svc')
				assert( T.isObject(cfg_service), context + ':bad service cfg for [' + service_name + ']')
				assert( T.isString(cfg_service.get('type')), context + ':bad service type [' + cfg_service.type + ']')
				// assert( T.isString(cfg_service.get('server')), context + ':bad service server [' + cfg_service.server + ']')
				
				let service = null
				
				switch( cfg_service.get('type') )
				{
					case "middleware":{
						service = new MiddlewareService(service_name, cfg_service)
						break
					}
					case "rest_api_models_query":{
						let locale_exec = new exec.ExecutableRouteModelCrud()
						let remote_exec = locale_exec
						service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "rest_api_models_modifier":{
						let locale_exec = new exec.ExecutableRouteModelCrud()
						let remote_exec = locale_exec
						service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "rest_api_resources_query":{
						let locale_exec = new exec.ExecutableRouteGetResource()
						let remote_exec = locale_exec
						service = new Service(service_name, locale_exec, remote_exec)
						break
					}
					case "rest_api_resources_modifier":{
						let locale_exec = null
						let remote_exec = null
						// service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
					case "html_assets":{
						let locale_exec = new exec.ExecutableRouteAssets()
						let remote_exec = locale_exec
						service = new Service(service_name, locale_exec, remote_exec)
						break
					}
					case "html_app":{
						let locale_exec = null
						let remote_exec = null
						// service = new Service(service_name, locale_exec, remote_exec) // TODO: create Real service
						break
					}
				}
				
				// assert( T.isObject(service), context + ':bad service type [' + cfg_service.get('type') + ']')
				
				if (service)
				{
					service.enable()
					this.services.add(service)
				}
			}
		)
		
		this.leave_group('make_services')
	}
	
	make_connexions()
	{
		this.enter_group('make_connexions')
		
		if ( config().hasIn( ['security', 'resources_by_name'] ) )
		{
			const cfg_all_cx = config().getIn( ['security', 'resources_by_name'] ).toArray()
			cfg_all_cx.forEach(
				(cfg_cx) => {
					const cx_name = cfg_cx.get('name')
					// this.info('Processing connexion creation of:' + cx_name)
					
					let cx = new Database(cx_name, cfg_cx)
					cx.load()
					this.resources.add(cx)
				}
			)
		}
		
		this.leave_group('make_connexions')
	}
	
	make_modules()
	{
		this.enter_group('make_modules')
		
		
		// CREATE MODULES
		let cfg_modules = config.get_collection('modules')
		cfg_modules.forEach(
			(module_cfg, module_name) => {
				if (module_name == 'error')
				{
					console.log(module_cfg, 'error')
					assert(false, context + ':an error occures in the modules loading process')	
				}
				this.info('Processing module creation of:' + module_name)
				
				let module_obj = new Module(module_name, module_cfg)
				
				module_obj.load()
				
				this.modules.add(module_obj)
			}
		)
		
		
		// LOOP MODULES RESOURCES AND LOAD MODELS ASSOCIATIONS AFTER ALL MODELS ARE CREATED
		for(let module_obj of this.modules)
		{
			this.info('make_modules for [' + module_obj.$name + ']')
			
			for(let res_obj of module_obj.resources)
			{
				this.resources.add(res_obj)
			}
			
			for(let res_obj of module_obj.resources)
			{
				if (res_obj.is_model)
				{
					// this.info('make_modules for [' + module_obj.$name + '] for model [' + res_obj.$name + ']')
					
					res_obj.load_associations()
					res_obj.load_includes()
				}
			}
		}
		
		
		this.leave_group('make_modules')
	}
	
	make_plugins()
	{
		this.enter_group('make_plugins')
		
		let cfg_plugins = config.get_collection('plugins')
		cfg_plugins.forEach(
			(plugin_cfg, plugin_name) => {
				this.info('Processing plugin creation of:' + plugin_name)
				
				let plugin = new Plugin(plugin_name, plugin_cfg)
				plugin.load()
				this.plugins.add(plugin)
			}
		)
		
		this.leave_group('make_plugins')
	}
	
	
	make_applications()
	{
		this.enter_group('make_applications')
		
		let applications = config.get_collection_names('applications')
		applications.forEach(
			(application_name) => {
				let application = new Application(application_name)
				
				application.load()
				
				this.applications.add(application)
			}
		)
		
		this.leave_group('make_applications')
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