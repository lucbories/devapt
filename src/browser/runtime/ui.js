// NPM IMPORTS
import T from 'typr/lib/typr'
// import assert from 'assert'
import _ from 'lodash'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import Loggable from '../../common/base/loggable'
import DefaultRenderingPlugin from '../../common/default_plugins/rendering_default_plugin'
import RenderingBuilder from '../../common/rendering/rendering_builder'
import RenderingPlugin from '../../common/plugins/rendering_plugin'
import Stream from '../../common/messaging/stream'

// BROWSER IMPORTS
import UIFactory from './ui_factory'
import UIRendering from './ui_rendering'
import Page from '../components/page'
import LayoutSimple from '../base/layout_simple'
import DisplayCommand from '../commands/display_command'


const context = 'browser/runtime/ui'



/**
 * @file UI interaction class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class UI extends Loggable
{
	/**
	 * Create a UI instance.
	 * 
	 * 	API:
	 * 		->constructor(arg_runtime, arg_store)
	 * 
	 * 		->is_loaded():boolean - Test if UI is loaded and is ready to process display commands.
	 * 		
	 * 		->create_display_command(arg_cmd_settings):DisplayCommand - Create a DisplayCommand instance.
	 * 		->pipe_display_command(arg_display_command):nothing - Append a display command to the UI commands pipe.
	 * 
	 * 		->get_current_layout():Layout - Get current application layout.
	 * 		->get_resource_description_resolver():function - Get a resolver function to find UI component description.
	 * 		->get_rendering_function_resolver():function - Get a resolver function to find UI rendering function.
	 * 		->get_rendering_class_resolver():Class - Get a resolver function to find UI component class.
	 * 		
	 * 		->load():nothing - Load plugins.
	 * 
	 * 		->get(arg_name):Component - Get a UI component by its name.
	 * 		->create(arg_name):Promise - Create a UI component.
	 * 		->create_local(arg_name, arg_component_desc):Component - Create a UI component.
	 * 		
	 * 		->register_rendering_plugin(arg_plugin_class):nothing - Register a browser rendering plugin.
	 * 		->request_middleware(arg_middleware, arg_svc_route):Promise - Request server about middleware rendering.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_store - UI components state store.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_store)
	{
		super(context)

		this.is_ui = true

		this._runtime = arg_runtime
		this.store = arg_store

		this.classes = {}
		this.classes.RenderingPlugin = RenderingPlugin
		this.classes.DefaultRenderingPlugin = DefaultRenderingPlugin
		
		this._ui_factory = new UIFactory(arg_runtime, arg_store)
		this._ui_rendering = new UIRendering(arg_runtime, this)
		this._ui_builder = new RenderingBuilder(arg_runtime, this._ui_rendering._assets_urls_templates, undefined)
		// this._ui_layout = undefined
		this._ui_layout = new LayoutSimple(this._runtime, {name:'main layout', type:'simple'})
		this._ui_layout._ui = this

		this._rendering_plugins = []
		this._rendering_plugins_counter = 0
		this._rendering_plugins_map = {}
		this._ordered_used_plugins_name = []

		this.page = {
			menubar:undefined,
			header:undefined,
			breadcrumbs:undefined,
			content:undefined,
			footer:undefined
		}

		this.body_page = new Page()

		this._display_command_waiting = []
		this._display_command_timer = undefined
		this._display_commands_pipe = new Stream()
		this._display_commands_pipe.subscribe(
			(cmd)=>{
				console.log(context + ':pipe_display_command.subscribe:do', cmd.get_name(), cmd)
				cmd.do()
			}
		)

		// this.enable_trace()
	}



	/**
	 * Test if UI is loaded and is ready to process display commands.
	 * 
	 * @returns {boolean} - true:UI is ready to process display commands,false:UI isn't ready.
	 */
	is_loaded()
	{
		return this._rendering_plugins_counter > 0 && this._rendering_plugins_counter == this._rendering_plugins.length
	}


	/**
	 * Create a DisplayCommand instance.
	 * 
	 * @param {object} arg_cmd_settings - command settings.
	 * 
	 * @returns {DisplayCommand}
	 */
	create_display_command(arg_cmd_settings)
	{
		return new DisplayCommand(this._runtime, arg_cmd_settings)
	}



	/**
	 * Append a display command to the UI commands pipe.
	 * If UI isn't ready to process display command, delay append.
	 * Commands are pushed into a stream.
	 * 
	 * @param {DisplayCommand} arg_display_command - display command to pipe.
	 * 
	 * @returns {nothing}
	 */
	pipe_display_command(arg_display_command)
	{
		if ( ! (T.isObject(arg_display_command) && arg_display_command.is_display_command) )
		{
			console.warn(context + ':pipe_display_command:bad display command', arg_display_command)
			return
		}

		if ( ! this.is_loaded() )
		{
			console.log(context + ':pipe_display_command:UI is not loaded')

			this._display_command_waiting.push(arg_display_command)

			if (! this._display_command_timer)
			{
				console.log(context + ':pipe_display_command:create a timer')

				const max_loops = 100
				let loop_counter = 0
				const finished_cb = ()=>{
					++loop_counter
					if (loop_counter > max_loops)
					{
						console.log(context + ':pipe_display_command:UI is not loaded, delay of 50ms, max loops is reached=', max_loops)
						return
					}

					if (! this.is_loaded())
					{
						console.log(context + ':pipe_display_command:UI is not loaded, delay of 50ms')

						this._display_command_timer = setTimeout(finished_cb, 50)
						return
					}

					console.log(context + ':pipe_display_command:UI is loaded')
					this._display_command_timer = undefined
					let cmd = this._display_command_waiting.shift()
					while(cmd)
					{
						console.log(context + ':pipe_display_command:shift cmd=', cmd.get_name(), cmd)
						this._display_commands_pipe.push(cmd)
						cmd = this._display_command_waiting.shift()
					}
				}

				this._display_command_timer = setTimeout(finished_cb, 50)
			}
			return
		}

		console.log(context + ':pipe_display_command:UI is already loaded', arg_display_command.get_name(), arg_display_command)
		this._display_commands_pipe.push(arg_display_command)
	}



	/**
	 * Get current application layout.
	 * 
	 * @returns {Layout}
	 */
	get_current_layout()
	{
		return this._ui_layout
	}

	
	
	/**
	 * Get a resolver function to find UI component description.
	 * 
	 * @returns {function} - (string)=>Immutable.Map|undefined.
	 */
	get_resource_description_resolver()
	{
		return (arg_name, arg_collection=undefined)=>{
			if ( T.isString(arg_collection) )
			{
				const result = this._ui_factory.find_component_desc(this.store.get_state(), arg_name, [arg_collection])
				// console.log('get_resource_description_resolver:name=%s,collection=%s', arg_name, arg_collection, result)
				return result.toJS()
			}

			const collections = ['views', 'menubars']
			let index = 0
			while(collections.length > index)
			{
				const result = this._ui_factory.find_component_desc(this.store.get_state(), arg_name, [collections[index]])
				if (result)
				{
					// console.log('get_resource_description_resolver:name=%s,collection=%s', arg_name, collections[index], result)
					return result.toJS()
				}
				index++
			}
			return undefined
		}
	}

	
	
	/**
	 * Get a resolver function to find UI rendering function.
	 * 
	 * @returns {function} - (string)=>function.
	 */
	get_rendering_function_resolver()
	{
		return (arg_type)=>{
			// console.log(context + ':get_rendering_function_resolver():type=' + arg_type, this._ordered_used_plugins_name, this._rendering_plugins_map)

			let not_found = true
			let index = 0
			let plugin = undefined
			let f = undefined
			while(this._ordered_used_plugins_name.length > index && not_found)
			{
				const plugin_name = this._ordered_used_plugins_name[index]
				if (plugin_name in this._rendering_plugins_map)
				{
					plugin = this._rendering_plugins_map[plugin_name]
					
					f = plugin.find_rendering_function(arg_type)
					if ( T.isFunction(f) )
					{
						not_found = false
					}

					// console.log(context + ':get_rendering_function_resolver():type=' + arg_type + ' iterate on plugin=%s, found=%b, function=', plugin.get_name(), not_found, f)
				}
				index++
			}
			return f
		}
	}

	
	
	/**
	 * Get a resolver function to find UI component class.
	 * 
	 * @returns {Class} - (string)=>Class.
	 */
	get_rendering_class_resolver()
	{
		return (arg_type)=>{
			// console.log(context + ':get_rendering_class_resolver():type=' + arg_type, this._ordered_used_plugins_name, this._rendering_plugins_map)
			
			let not_found = true
			let index = 0
			let plugin = undefined
			let c = undefined
			while(this._ordered_used_plugins_name.length > index && not_found)
			{
				const plugin_name = this._ordered_used_plugins_name[index]
				if (plugin_name in this._rendering_plugins_map)
				{
					plugin = this._rendering_plugins_map[plugin_name]

					c = plugin.get_feature_class(arg_type)
					if ( T.isFunction(c) )
					{
						not_found = false
					}
					
					// console.log(context + ':get_rendering_class_resolver():type=' + arg_type + ' iterate on plugin=%s, found=%b, class=', plugin.get_name(), not_found, c)
				}
				index++
			}
			return c
		}
	}


	/**
	 * Load plugins.
	 * 
	 * @returns {nothing}
	 */
	load()
	{
		// this._ui_layout = new LayoutSimple(this._runtime, {name:'main layout', type:'simple'})

		// LOAD PLUGINS CLASSES
		// console.log('LOAD PLUGINS CLASSES:name=DefaultRenderingPlugin')
		this.register_rendering_plugin(DefaultRenderingPlugin)
		this._rendering_plugins_counter += 1

		const plugins_urls = this.store.get_state().get('plugins_urls', fromJS({})).toJS()
		const ordered_plugins = this.store.get_state().get('used_plugins', fromJS([])).toJS()
		this._ordered_used_plugins_name = ordered_plugins

		_.forEach(ordered_plugins,
			(plugin_name)=>{
				if (plugin_name in plugins_urls)
				{
					this._rendering_plugins_counter += 1

					const url = plugins_urls[plugin_name]
					const url_src = this._ui_rendering.get_asset_url('plugins/' + url, 'script', this._runtime.session_credentials)
					
					// console.log('LOAD PLUGINS CLASSES:name=%s,url=%s', plugin_name, url_src)

					this._ui_rendering.create_dom_url_element(document.body, 'script', 'js-' + plugin_name, url_src, 'text/javascript')
				}
			}
		)
	}
	
	
	
	/**
	 * Get a UI component by its name.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Component}
	 */
	get(arg_name)
	{
		return this._ui_factory.get(arg_name)
	}
	
	
	
	/**
	 * Test a UI component by its name.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {boolean}
	 */
	has(arg_name)
	{
		return this._ui_factory.has(arg_name)
	}
	
	
	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Promise} - Promise of a Component instance.
	 */
	create(arg_name)
	{
		const component_promise = this._ui_factory.create(arg_name)
		return component_promise
	}
	
	
	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_name - component name.
	 * @param {object} arg_component_desc - component description.
	 * 
	 * @returns {Component} - Component instance.
	 */
	create_local(arg_name, arg_component_desc)
	{
		const component = this._ui_factory.create_local(arg_name, arg_component_desc)
		return component
	}



	/**
	 * Register a browser rendering plugin.
	 * 
	 * @param{RenderingPlugin} arg_plugin - rendering plugin.
	 * 
	 * @returns {nothing}
	 */
	register_rendering_plugin(arg_plugin_class)
	{
		if ( ! arg_plugin_class)
		{
			console.warn(context + ':register_rendering_browser:bad plugin class', arg_plugin_class)
			return
		}

		const manager= {
			is_plugins_manager:true
		}
		const plugin = new arg_plugin_class(this._runtime, manager)
		plugin.find_rendering_function = (type)=>{
			const f =  arg_plugin_class.find_rendering_function(type)
			return f
		}

		console.log(context + ':register_rendering_browser:plugin=' + plugin.get_name())
		
		this._rendering_plugins.push(plugin)
		this._rendering_plugins_map[plugin.get_name()] = plugin
	}



	/**
	 * Request server about middleware rendering.
	 * 
	 * @param {string} arg_middleware - middleware name.
	 * @param {string} arg_svc_route  - requested route.
	 * 
	 * @returns {Promise} - Promise of a RenderingResult instance.
	 */
	request_middleware(arg_middleware, arg_svc_route)
	{
		this.enter_group('request_middleware:middleware=' + arg_middleware + ' route=' + arg_svc_route)

		const promise = this._runtime.register_service(arg_middleware)
		.then(
			(service)=>{
				// console.log(context + ':render_with_middleware:get rendering for ' + arg_cmd.url)
				return service.get( { route:arg_svc_route } )
			},
			
			(reason)=>{
				console.error(context + ':render_with_middleware:error 0', reason)
			}
		)
		.then(
			(stream)=>{
				// console.log(context + ':render_with_middleware:get listen stream for ' + arg_cmd.url)
				return new Promise(
					function(resolve, reject)
					{
						stream.onValue(
							(response)=>{
								resolve(response.datas)
							}
						)
						stream.onError(
							(reason)=>{
								reject(reason)
							}
						)
					}
				)
			},

			(reason)=>{
				console.error(context + ':render_with_middleware:error 1 for ' + arg_svc_route, reason)
			}
		)
		.catch(
			(reason)=>{
				console.error(context + ':render_with_middleware:error for ' + arg_svc_route, reason)
			}
		)

		this.leave_group('request_middleware:async')
		return promise
	}
}
