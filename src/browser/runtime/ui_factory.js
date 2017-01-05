// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'
// import _ from 'lodash'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import Loggable from '../../common/base/loggable'

// BROWSER IMPORTS
import Component from '../base/component'
import Container from '../base/container'
import Table from '../components/table'
import LogsTable from '../components/logs_table'
import Tabs from '../components/tabs'
import Tree from '../components/tree'
import TableTree from '../components/table_tree'
import Topology from '../components/topology'
import RecordsTable from '../components/records_table'
import InputField from '../components/input-field'
// import Sparklines from '../components/sparklines'



const context = 'browser/runtime/ui_factory'
const DEBUG_TRACE_FIND_STATE=false



/**
 * @file UI factory class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class UIFactory extends Loggable
{
	/**
	 * Create a UI factory instance.
	 * 
	 * 	API:
	 * 		->constructor(arg_runtime, arg_store)
	 * 		->get(arg_name):Component - Get a UI component by its name.
	 * 		->create(arg_name):Component - Create a UI component.
	 * 		->find_component_desc(arg_state, arg_name, arg_state_path = []):Immutable.Map|undefined - Find a UI component state.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_store - UI components state store.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_store)
	{
		super(context)

		this.is_ui_factory = true

		this._runtime = arg_runtime
		this._store = arg_store
		this._cache = {}
		this._state_by_path = {}
		
		// this.update_trace_enabled()
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
		if (arg_name in this._cache)
		{
			return this._cache[arg_name]
		}
		
		return this.create_local(arg_name)
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
		return (arg_name in this._cache)
	}
	
	
	
	/**
	 * Create a UI component with local cache and state.
	 * 
	 * @param {string} arg_component_name - component name.
	 * @param {object} arg_component_desc - component description (optional, default:undefined).
	 * 
	 * @returns {Component} - Component instance
	 */
	create_local(arg_component_name, arg_component_desc=undefined)
	{
		this.enter_group('create_local:component name=' + arg_component_name)

		let state_path = undefined
		let component_desc = arg_component_desc

		// SEARCH DESCRIPTION INTO CACHE
		if (! component_desc)
		{
			// GET APPLICATION STATE AND INIT APPLICATION STATE PATH
			const current_app_state = this._store.get_state()
			state_path = ['views']
			this.debug('create_local:search in views for ' + arg_component_name)
			
			component_desc = this.find_component_desc(current_app_state, arg_component_name, state_path)
			if (! component_desc)
			{
				this.debug('create_local:search in menubars for ' + arg_component_name)
				state_path = ['menubars']
				component_desc = this.find_component_desc(current_app_state, arg_component_name, state_path)

				if (! component_desc)
				{
					this.debug('create_local:state not found in views/menubars for ' + arg_component_name)
					this.debug('create_local:state_path', state_path)

					this.leave_group('create_local:component description not found name=' + arg_component_name)
					return undefined
				}
			}
		}

		const component = this.create_instance(arg_component_name, component_desc, state_path)

		this.leave_group('create_local:component created for name=' + arg_component_name)
		return component
	}

	
	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_component_name - component name.
	 * @param {object} arg_component_desc - component description.
	 * @param {array}  arg_state_path     - component state path.
	 * 
	 * @returns {Component|undefined} - Component instance
	 */
	create_instance(arg_component_name, arg_component_desc, arg_state_path)
	{
		this.enter_group('create_instance:component name=' + arg_component_name)

		const mix = this.create_instance_mix(arg_component_name, arg_component_desc, arg_state_path)

		this.leave_group('create_instance:component created for name=' + arg_component_name)
		return mix.component
	}

	
	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_component_name - component name.
	 * @param {object} arg_component_desc - component description.
	 * @param {array}  arg_state_path     - component state path.
	 * 
	 * @returns {Promise} - Component instance
	 */
	create_instance_promise(arg_component_name, arg_component_desc, arg_state_path)
	{
		this.enter_group('create_instance_promise:component name=' + arg_component_name)

		const mix = this.create_instance_mix(arg_component_name, arg_component_desc, arg_state_path)

		this.leave_group('create_instance_promise:component created for name=' + arg_component_name)
		return mix.promise
	}


	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_component_name - component name.
	 * @param {object} arg_component_desc - component description.
	 * @param {array}  arg_state_path     - component state path.
	 * 
	 * @returns {object} - { component:Component, promise:Promise}
	 */
	create_instance_mix(arg_component_name, arg_component_desc, arg_state_path)
	{
		this.enter_group('create_instance_mix:component name=' + arg_component_name)

		// REGISTER COMPONENT APPLICATION STATE PATH
		const state_path = arg_state_path ? arg_state_path : ( arg_component_desc.get('type') == 'menubar' ? ['menubars'] : ['views'] )
		this._state_by_path[arg_component_name] = state_path
		this._state_by_path[arg_component_name].push('state')

		// GET COMPONENT TYPE
		const type = arg_component_desc.has('browser_type') ? arg_component_desc.get('browser_type') : arg_component_desc.get('type')
		assert( T.isString(type), context + ':create:bad component desctription type string for ' + arg_component_name)
		
		// GET COMPONENT STATE
		let comp_state = arg_component_desc.get('state')
		comp_state = comp_state.set('name', arg_component_name)
		comp_state = comp_state.set('type', type)
		comp_state = comp_state.set('state_path', fromJS(state_path) )
		// console.log('ui:create:path,state:', state_path, comp_state)
		
		// CREATE COMPONENT INSTANCE
		let component_class = this._runtime.ui().get_rendering_class_resolver()(type)
		if (!component_class)
		{
			component_class = this.get_component_class(type)
		}
		if ( ! component_class)
		{
			const msg = 'create:error:bad found component class for ' + arg_component_name + ' type=' + type
			this.error(msg)
			this.leave_group(msg)
			return { component:undefined, promise:Promise.reject(context + msg) }
		}

		const component = new component_class(this._runtime, comp_state)
		this._cache[arg_component_name] = component
		const promise = component.render()
		promise.then(
			()=>component.load(),

			(reason)=>{
				this.error(reason)
			}
		)

		this.leave_group('create_instance_mix:component created for name=' + arg_component_name)
		return { component:component, promise:promise }
	}

	
	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_component_name - component name.
	 * 
	 * @returns {Promise} - promise of Component instance
	 */
	create(arg_component_name, arg_component_desc=undefined)
	{
		this.enter_group('create:component name=' + arg_component_name)

		// SEARCH DESCRIPTION INTO CACHE
		const component = this.create_local(arg_component_name, arg_component_desc)
		if (component)
		{
			this.leave_group('create:async:found:component name=' + arg_component_name)
			return Promise.resolve(component)
		}


		let component_desc_promise = arg_component_desc ? Promise.resolve(arg_component_desc) : undefined

		// REQUEST DESCRIPTION FROM SERVER
		if (! component_desc_promise)
		{
			component_desc_promise = this.request_component_desc(arg_component_name)
		}

		// DESCRIPTION PROMISE NOT FOUND
		if (! component_desc_promise)
		{
			this.leave_group('create:error:bad promise for component name=' + arg_component_name)
			return Promise.reject(context + ':create:bad promise')
		}

		const component_promise = component_desc_promise.then(
			(component_desc)=>{
				this.debug('create:found:component description for ' + arg_component_name)

				// CHECK COMPONENT DESCRIPTION
				if ( ! (T.isObject(component_desc) && component_desc.has && component_desc.get) )
				{
					this.error('create:found:bad Immutable component description for ' + arg_component_name)
					this.leave_group('create:error bad description for ' + arg_component_name)
					return Promise.reject(context + 'create:found:bad Immutable component description for ' + arg_component_name)
				}
				
				const promise = this.create_instance_promise(arg_component_name, component_desc)
				return promise
			},

			(reason)=>{
				this.error('create:error:promise exception for ' + arg_component_name + ' reason=' + reason)
				this.leave_group('create:error promise exception for ' + arg_component_name + ' reason=' + reason)
				return Promise.reject(context + 'create:error promise exception for ' + arg_component_name + ' reason=' + reason)
			}
		)

		this.leave_group('create:async:component name=' + arg_component_name)
		return component_promise
	}

	
	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Component}
	 */
	get_component_class(arg_type)
	{
		switch(arg_type.toLocaleLowerCase())
		{
			case 'component':    return Component
			case 'container':    return Container

			case 'input-field':
			case 'inputfield':   return InputField
			
			case 'logstable':    return LogsTable
			case 'table':        return Table
			case 'tabs':         return Tabs
			
			case 'tabletree':    return TableTree
			case 'topology':     return Topology
			case 'recordstable': return RecordsTable
			case 'tree':         return Tree
			// case 'sparklines':   return Sparklines

			case 'button':
			case 'hbox':
			case 'vbox':
			case 'list':
			case 'page':
			case 'script':
			case 'menubar':
			default:             return Component
		}
		
		// return undefined
	}
	
	
	
	/**
	 * Find UI component description.
	 * 
	 * @param {Immutable.Map} arg_state - registry global state object.
	 * @param {string} arg_name - component name.
	 * @param {array} arg_state_path - state path (optional, default=[])
	 * 
	 * @returns {Immutable.Map|undefined} - component state object.
	 */
	find_component_desc(arg_state, arg_name, arg_state_path = [])
	{
		const js_state = arg_state && arg_state.toJS ? arg_state.toJS() : arg_state
		DEBUG_TRACE_FIND_STATE && this.debug('ui.find_component_desc for ' + arg_name, arg_state_path, js_state)
		
		if (! arg_state)
		{
			console.error('state is undefined for ' + arg_name)
			return undefined
		}

		if (! T.isFunction(arg_state.get) )
		{
			// GLOBAL STATE IS NOT AN IMMUTABLE.MAP
			console.error(context + ':find_component_desc:state is not an Immutable for ' + arg_name, arg_state)
			this.error(context + ':find_component_desc:state is not an Immutable for ' + arg_name, arg_state)
			return undefined
		}
		
		// FOUND ON ROOT
		if ( arg_state.has('name') )
		{
			const name = arg_state.get('name').toString()
			arg_state_path.push(name)
			if ( name == arg_name )
			{
				DEBUG_TRACE_FIND_STATE && this.debug('ui.find_component_desc FOUND 1 for ' + arg_name, arg_state_path)
				return arg_state
			}
		}
		
		// LOOKUP ON VIEWS CHILDREN
		let children_key = 'children'
		if (arg_state_path.length == 1 && arg_state_path[0] == 'views')
		{
			children_key = 'views'
			arg_state_path.pop()
		}
		if (arg_state_path.length == 1 && arg_state_path[0] == 'menubars')
		{
			children_key = 'menubars'
			arg_state_path.pop()
		}
		if (arg_state_path.length == 1 && arg_state_path[0] == 'menus')
		{
			children_key = 'menus'
			arg_state_path.pop()
		}
		if (arg_state_path.length == 1 && arg_state_path[0] == 'models')
		{
			children_key = 'models'
			arg_state_path.pop()
		}
		if ( arg_state.has(children_key) )
		{
			arg_state_path.push(children_key)
			
			if ( arg_state.hasIn( [children_key, arg_name] ) )
			{
				arg_state_path.push(arg_name)
				DEBUG_TRACE_FIND_STATE && this.debug('ui.find_component_desc FOUND 2 for ' + arg_name, arg_state_path)
				return arg_state.getIn( [children_key, arg_name] )
			}
			
			let result = undefined
			arg_state.get(children_key).forEach(
				(child_state, key) => {
					if (! result)
					{
						DEBUG_TRACE_FIND_STATE && this.debug('ui.find_component_desc loop on child ' + key + ' for ' + arg_name, arg_state_path)
						result = this.find_component_desc(child_state, arg_name, arg_state_path)
						if (result)
						{
							DEBUG_TRACE_FIND_STATE && this.debug('ui.find_component_desc FOUND 3 for ' + arg_name, arg_state_path)
							return result
						}
					}
				}
			)
			if (result)
			{
				DEBUG_TRACE_FIND_STATE && this.debug('ui.find_component_desc FOUND 4 for ' + arg_name, arg_state_path, result && result.toJS ? result.toJS() : result)
				return result
			}
			
			arg_state_path.pop() // CHILDREN
		}
		
		if ( arg_state.has('name') )
		{
			arg_state_path.pop() // NAME
		}

		// console.error('state not found for ' + arg_name)
		return undefined
	}


	request_component_desc(arg_component_name)
	{
		this.enter_group('request_component_desc')

		this.leave_group('request_component_desc:async')
		
		return this._runtime.register_service('rest_api_resources_query_1')
		.then(
			(service)=>{
				// console.log(context + ':request_component_desc:get service for ' + arg_view_name)
				return service.get( {collection:'*', 'resource':arg_component_name} )
			},
			
			(reason)=>{
				console.error(context + ':request_component_desc:error 1 for ' + arg_component_name, reason)
			}
		)
		.then(
			(stream)=>{
				// console.log(context + ':request_component_desc:get listen stream for ' + arg_view_name)
				return new Promise(
					function(resolve, reject)
					{
						stream.onValue(
							(response)=>{
								resolve(response)
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
				console.error(context + ':request_component_desc:error 2 for ' + arg_component_name, reason)
			}
		)
		.then(
			(response)=>{
				// console.log(context + ':request_component_desc:get response for ' + arg_view_name, response)

				if (response.result == 'done')
				{
					// console.log(context + ':request_component_desc:dispatch ADD_JSON_RESOURCE action for ' + arg_view_name)
					const action = { type:'ADD_JSON_RESOURCE', resource:arg_component_name, collection:'views', json:response.datas }
					this._store.dispatch(action)
					return response.datas
				}

				return undefined
			},
			
			(reason)=>{
				console.error(context + ':request_component_desc:error 3 for ' + arg_component_name, reason)
			}
		)
	}
}
