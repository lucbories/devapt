
import T from 'typr'
import assert from 'assert'

import Component from './components/component'
import Table from './components/table'


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
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - UI components state.
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state)
	{
		this.is_ui = true
		this.runtime = arg_runtime
		this.state = arg_state
		this.cache = {}
	}
	
	
	
	/**
	 * Get a UI component by its name.
	 * @param {string} arg_name - component name.
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
	 * @param {string} arg_name - component name.
	 * @returns {object}
	 */
	create(arg_name)
	{
		const component_state = this.find_state(this.state, arg_name)
		assert( T.isObject(component_state), context + ':create:bad state object for ' + arg_name)
		
		const type = component_state.type
		assert( T.isString(type), context + ':create:bad type string for ' + arg_name)
		
		switch(type)
		{
			case 'Table':
				{
					const comp = new Table(this.runtime, component_state)
					this.cache[arg_name] = comp
					return comp
				}
			
			case 'Button':
			case 'Tree':
			case 'HBox':
			case 'VBox':
			case 'List':
			case 'Page':
			case 'Script':
			case 'Menubar':
			case 'Tabs':
			default:
				{
					const comp = new Component(this.runtime, component_state)
					this.cache[arg_name] = comp
					return comp
				}
		}
		
		// return undefined
	}
	
	
	
	/**
	 * Find a UI component state.
	 * @param {object} arg_state - state object.
	 * @param {string} arg_name - component name.
	 * @returns {object}
	 */
	find_state(arg_state, arg_name)
	{
		// console.log(arg_state, 'ui.find_state for ' + arg_name)
		
		if (! arg_state)
		{
			console.error('state is undefined for ' + arg_name)
			return undefined
		}
		
		if (arg_name in arg_state)
		{
			return arg_state[arg_name]
		}
		
		if (arg_state.children)
		{
			if (arg_name in arg_state.children)
			{
				return arg_state.children[arg_name]
			}
			
			if ( T.isObject(arg_state.children) )
			{
				const keys = Object.keys(arg_state.children)
				for(let key of keys)
				{
					const child_state = arg_state.children[key]
					const result = this.find_state(child_state, arg_name)
					if (result)
					{
						return result
					}
				}
			}
		}
		
		// console.error('state not found for ' + arg_name)
		return undefined
	}
}
