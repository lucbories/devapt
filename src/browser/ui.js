
import T from 'typr'
import assert from 'assert'

import Component from './components/component'
import Table from './components/table'
import Tree from './components/tree'
import Topology from './components/topology'
import RecordsTable from './components/records_table'


const context = 'browser/ui'



/**
 * @file UI interaction class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class UI
{
	/**
	 * Create a UI instance.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_store - UI components state store.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_store)
	{
		this.is_ui = true
		this.runtime = arg_runtime
		this.store = arg_store
		this.cache = {}
		this.state_by_path = {}
	}
	
	
	
	/**
	 * Get a UI component by its name.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {object}
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
	 * Create a UI component.
	 * 
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {object}
	 */
	create(arg_name)
	{
		const current_state = this.store.getState()
		let state_path = []
		const component_state = this.find_state(current_state, arg_name, state_path)
		assert( T.isObject(component_state), context + ':create:bad state object for ' + arg_name)
		state_path.shift()
		this.state_by_path[arg_name] = state_path
		
		const type = component_state.has('browser_type') ? component_state.get('browser_type') : component_state.get('type')
		assert( T.isString(type), context + ':create:bad type string for ' + arg_name)
		
		switch(type)
		{
			case 'Table':
				{
					const comp_state = component_state.toJS()
					const comp = new Table(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'Topology':
				{
					const comp_state = component_state.toJS()
					const comp = new Topology(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'RecordsTable':
				{
					const comp_state = component_state.toJS()
					const comp = new RecordsTable(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
					this.cache[arg_name] = comp
					comp.load()
					return comp
				}
			
			case 'Tree':
				{
					const comp_state = component_state.toJS()
					const comp = new Tree(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
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
					const comp_state = component_state.toJS()
					const comp = new Component(this.runtime, comp_state)
					comp.state_path = state_path
					// console.log('ui:create:path', state_path, comp_state)
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
	 * @param {object} arg_state - state object.
	 * @param {string} arg_name - component name.
	 * 
	 * @returns {object}
	 */
	find_state(arg_state, arg_name, arg_state_path = [])
	{
		// const js_state = arg_state.toJS()
		// console.log('ui.find_state for ' + arg_name, arg_state_path, js_state)
		
		if (! arg_state)
		{
			console.error('state is undefined for ' + arg_name)
			return undefined
		}
		
		// FOUND ON ROOT
		arg_state_path.push( arg_state.get('name').toString() )
		if ( arg_state.has('name') )
		{
			if ( arg_state.get('name') == arg_name )
			{
				// console.log('ui.find_state FOUND 1 for ' + arg_name, arg_state_path)
				return arg_state
			}
		}
		
		// LOOKUP ON CHILDREN
		if ( arg_state.has('children') )
		{
			arg_state_path.push('children')
			
			if ( arg_state.hasIn( ['children', arg_name] ) )
			{
				arg_state_path.push(arg_name)
				// console.log('ui.find_state FOUND 2 for ' + arg_name, arg_state_path)
				return arg_state.getIn( ['children', arg_name] )
			}
			
			let result = undefined
			arg_state.get('children').forEach(
				(child_state/*, key*/) => {
					if (! result)
					{
						// console.log('ui.find_state loop on child ' + key + ' for ' + arg_name, arg_state_path)
						result = this.find_state(child_state, arg_name, arg_state_path)
						if (result)
						{
							// console.log('ui.find_state FOUND 3 for ' + arg_name, arg_state_path)
							return
						}
					}
				}
			)
			if (result)
			{
				// console.log('ui.find_state FOUND 4 for ' + arg_name, arg_state_path, result.toJS())
				return result
			}
			
			arg_state_path.pop() // CHILDREN
		}
		
		arg_state_path.pop() // NAME
		
		// console.error('state not found for ' + arg_name)
		return undefined
	}
}
