// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import Loggable from '../../common/base/loggable'

// BROWSER IMPORTS
import Component from '../base/component'
import Table from '../components/table'
import LogsTable from '../components/logs_table'
import Tabs from '../components/tabs'
import Tree from '../components/tree'
import TableTree from '../components/table_tree'
import Topology from '../components/topology'
import RecordsTable from '../components/records_table'
import InputField from '../components/input-field'
import Sparklines from '../components/sparklines'



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
	 * 		->render(arg_view_name):Promise(Component) - Render a view by its name.
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

		this.runtime = arg_runtime
		this.store = arg_store
		this.cache = {}
		this.state_by_path = {}
		
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
		if (arg_name in this.cache)
		{
			return this.cache[arg_name]
		}
		
		return this.create(arg_name)
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
		return (arg_name in this.cache)
	}
	
	
	
	/**
	 * Create a UI component.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {Component}
	 */
	create(arg_name)
	{
		// GET APPLICATION STATE AND INIT APPLICATION STATE PATH
		const current_app_state = this.store.get_state()
		this.debug('search in views for ' + arg_name)
		let state_path = ['views']

		// GET COMPONENT DESCRIPTION : { type:'...', name:'...', settings:{...}, state:{...}, children:{...} }
		let component_desc = this.find_component_desc(current_app_state, arg_name, state_path)
		if (! component_desc)
		{
			this.debug('search in menubars for ' + arg_name)
			state_path = ['menubars']
			component_desc = this.find_component_desc(current_app_state, arg_name, state_path)

			if (!component_desc)
			{
				this.debug('state not found for ' + arg_name)
				// console.log(current_app_state, 'current_app_state')
				this.debug('state_path', state_path)
			}
		}

		if ( ! (T.isObject(component_desc) && component_desc.has && component_desc.get) )
		{
			this.debug('create:bad component description Immutable for ' + arg_name)
			return undefined
		}

		if ( ! ( component_desc.has('type') && component_desc.has('state') /*&& component_desc.has('settings')*/ && component_desc.has('name') ) )
		{
			this.debug('create:bad component description for ' + arg_name)
			return undefined
		}

		// console.log('component_desc', component_desc)

		// assert( T.isObject(component_desc) && component_desc.has && component_desc.get, context + ':create:bad component description Immutable for ' + arg_name)
		// assert( component_desc.has('type') && component_desc.has('state') /*&& component_desc.has('settings')*/ && component_desc.has('name'), context + ':create:bad component description for ' + arg_name)

		// REGISTER COMPONENT APPLICATION STATE PATH
		this.state_by_path[arg_name] = state_path
		this.state_by_path[arg_name].push('state')

		// GET COMPONENT TYPE
		const type = component_desc.has('browser_type') ? component_desc.get('browser_type') : component_desc.get('type')
		assert( T.isString(type), context + ':create:bad component desctription type string for ' + arg_name)
		
		// GET COMPONENT STATE
		let comp_state = component_desc.get('state')
		comp_state = comp_state.set('name', arg_name)
		comp_state = comp_state.set('type', type)
		comp_state = comp_state.set('state_path', fromJS(state_path) )
		// console.log('ui:create:path,state:', state_path, comp_state)

		switch(type)
		{
			case 'input-field':
			case 'InputField':
				{
					const comp = new InputField(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			case 'LogsTable':
				{
					const comp = new LogsTable(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'Table':
				{
					const comp = new Table(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'Tabs':
				{
					const comp = new Tabs(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'TableTree':
				{
					const comp = new TableTree(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'Topology':
				{
					const comp = new Topology(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'RecordsTable':
				{
					const comp = new RecordsTable(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'Tree':
				{
					const comp = new Tree(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}

			case 'Sparklines':
				{
					const comp = new Sparklines(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}

			case 'Button':
			case 'HBox':
			case 'VBox':
			case 'List':
			case 'Page':
			case 'Script':
			case 'Menubar':
			case 'Tabs':
			default:
				{
					const comp = new Component(this.runtime, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
		}
		
		// return undefined
	}
	
	
	
	/**
	 * Find a UI component state.
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
}
