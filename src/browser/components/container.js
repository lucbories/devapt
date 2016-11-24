
import T from 'typr'
import assert from 'assert'

import { fromJS } from 'immutable'
import Component from './component'


const context = 'browser/components/container'



/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Container extends Component
{
	
	/**
	 * Creates an instance of Container. A Container contains other Components through the 'children' property.
	 * @extends Component
	 * 
	 * Container state attributes:
	 * 	- strategy: Immutable.Map (how to manage UI updates with items changes)
	 * 		- update_mode: 'append' | 'prepend' | 'replace' | 'insert at'
	 * 		- update_index: integer (position for 'insert at' mode)
	 * 		- resize_mode: 'remove_last' | 'remove_first'
	 * 		- resize_max: integer (max items count)
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(arg_runtime, arg_state, log_context)
		
		this.is_container = true
		
		this.strategy = 
		
		this.strategy_update = undefined
		this.strategy_resize_ui = undefined
		this.strategy_resize_state = undefined
		this.max_size = undefined
	}
	
	
	
	/**
	 * Load and apply a container component configuration.
	 * 
	 * @param {Immutable.Map|undefined} arg_state - component state to load (optional).
	 * 
	 * @returns {nothing} 
	 */
	load(arg_state)
	{
		const state = arg_state ? arg_state : this.get_state()
		super.load(state)
		// console.info(context + ':load:loading ' + this.get_name())
		
		if (! state)
		{
			return
		}
		
		// GET CONTAINER STRATEGY: HOW TO UPDATE UI
		if (state.has('strategy'))
		{
			this.strategy = state.get('strategy')
			
			
			// DEFINE UPDATE FUNCTION
			
			this.strategy_update = undefined
			
			if (this.strategy.has('update_mode'))
			{
				const mode = this.strategy.get('update_mode')
				if (mode == 'append')
				{
					this.strategy_update = this.ui_items_append
				}
				else if (mode == 'prepend')
				{
					this.strategy_update = this.ui_items_prepend
				}
				else if (mode == 'replace')
				{
					this.strategy_update = this.ui_items_replace
				}
				else if (mode == 'insert at')
				{
					if ( this.strategy.has('update_index') )
					{
						const index = this.strategy.get('update_index')
						this.strategy_update = () => { this.ui_items_insert_at_index(index) }
					}
				}
			}
			
			if ( ! T.isFunction(this.strategy_update) )
			{
				this.strategy_update = this.ui_items_replace
			}
			
			
			// DEFINE RESIZE FUNCTION
			
			this.strategy_resize_ui = undefined
			this.strategy_resize_state = undefined
			this.max_size = undefined
			
			if (this.strategy.has('resize_mode'))
			{
				const mode = this.strategy.get('resize_mode')
				
				this.max_size = 100
				if ( this.strategy.has('resize_max') )
				{
					this.max_size = this.strategy.get('resize_max')
				}
				
				if (mode == 'remove_last')
				{
					this.strategy_resize_ui = () => {
						const count = this.ui_items_get_count() - this.max_size
						this.ui_items_remove_last(count)
					}
				}
				else /*if (mode == 'remove_first')*/
				{
					this.strategy_resize_ui = () => {
						const count = this.ui_items_get_count() - this.max_size
						this.ui_items_remove_first(count)
					}
				}
					
				this.strategy_resize_state = (arg_items, arg_next_state) => {
					if (this.max_size)
					{
						const count = arg_items.count() -  this.max_size
						if (count > 0)
						{
							const action = { type:mode, count:count }
							return this.reduce_action(arg_next_state, action)
						}
					}
					return arg_next_state
				}
				
				// console.log(context + ':load:resize_mode', mode)
				// console.log(context + ':load:resize_max', max_size)
			}
		}
	}
	
	
	// -----------------------------------------------------------------------------------------------------
	// DEFINE ACTION WRAPPERS (only dispatch an action to update the state)
	// -----------------------------------------------------------------------------------------------------
	
	/**
	 * Set max items value for the container.
	 * 
	 * @param {integer} arg_value - max items value.
	 * 
	 * @returns {nothing}
	 */
	do_action_set_resize_max(arg_value)
	{
		let value = T.isNumber(arg_value) ? arg_value : undefined
		if (!value)
		{
			if ( T.isObject(arg_value) )
			{
				if ( T.isNumber(arg_value.resize_max) )
				{
					value = arg_value.resize_max
				}
				else if ( T.isString(arg_value.resize_max) )
				{
					try {
						value = parseInt(arg_value.resize_max)
					}
					catch(e)
					{
						console.error(context + ':do_action_set_resize_max:bad integer value from string', arg_value)
					}
				}
			}
		}
		
		assert( T.isNumber(value), context + ':do_action_set_resize_max:bad value number')
		
		this.dispatch_action('set_resize_max', {resize_max:value})
	}
	
	
	
	/**
	 * Clear container items.
	 * 
	 * @returns {nothing}
	 */
	do_action_clear_items()
	{
		this.dispatch_action('clear_items')
	}
	
	
	
	/**
	 * Append rows to the container.
	 * 
	 * @param {array} arg_items_array - items array.
	 * 
	 * @returns {nothing}
	 */
	do_action_append(arg_items_array)
	{
		assert( T.isArray(arg_items_array), context + ':do_action_append:bad items array')
		
		this.dispatch_action('append', {values:arg_items_array})
	}
	
	
	
	/**
	 * Prepend a row.
	 * 
	 * @param {array} arg_items_array - rows array.
	 * 
	 * @returns {nothing}
	 */
	do_action_prepend(arg_items_array)
	{
		assert( T.isArray(arg_items_array), context + ':do_action_prepend:bad items array')
		
		// console.log(context + ':do_action_prepend:arg_items_array', arg_items_array)

		this.dispatch_action('prepend', {values:arg_items_array})
	}
	
	
	
	/**
	 * Remove a row at given position.
	 * 
	 * @param {number} arg_index - row index.
	 * 
	 * @returns {nothing}
	 */
	do_action_remove_at_index(arg_index)
	{
		assert( T.isNumber(arg_index), context + ':remove_at_index:bad index number' )
		
		this.dispatch_action( { type:'remove_at_index', index:arg_index } )
	}
	
	
	
	/**
	 * Remove a row at first position.
	 * 
	 * @returns {nothing}
	 */
	do_action_remove_first()
	{
		this.dispatch_action('remove_first')
	}
	
	
	
	/**
	 * Remove a row at last position.
	 *
	 * @param {number} arg_count - items count.
	 * 
	 * @returns {nothing}
	 */
	do_action_remove_last(arg_count)
	{
		this.dispatch_action('remove_last', { count:arg_count })
	}
	
	
	
	/**
	 * Store actions reducer pure function.
	 * 
	 * @param {Immutable.Map} arg_previous_state - previous state.
	 * @param {object} arg_action - store action: { type:'', component:'', ...}
	 * 
	 * @returns {Immutable.Map} - new state
	 */
	reduce_action(arg_previous_state, arg_action)
	{
		// console.log(context + ':reduce_action:prev state', arg_previous_state.toJS())
		
		switch(arg_action.type)
		{
			case 'set_resize_max': {
				if ( ! T.isNumber(arg_action.resize_max) && arg_action.resize_max > 0 )
				{
					return arg_previous_state
				}
				
				this.max_size = arg_action.resize_max
				const items = arg_previous_state.get('items')
				const next_state = arg_previous_state.setIn(['strategy', 'resize_max'], arg_action.resize_max)
				return this.strategy_resize_state(items, next_state)
			}
			
			case 'clear_items': {
				const next_state = arg_previous_state.set('items', fromJS([]))
				return next_state
			}
			
			case 'append': {
				const values = arg_action.values
				// console.log('container:reduce_action:append:values', values)
				
				let items = arg_previous_state.get('items').concat(values)
				const next_state = arg_previous_state.set('items', items)
				
				return this.strategy_resize_state(items, next_state)
			}
			
			case 'prepend': {
				const values = arg_action.values
				// console.log(context + ':reduce_action:prepend:values', values)
				
				let items = arg_previous_state.get('items')
				values.forEach(
					(value) => items = items.splice(0, 0, value)
				)
				const next_state = arg_previous_state.set('items', items)
				
				return this.strategy_resize_state(items, next_state)
			}
			
			case 'insert_at': {
				const index = arg_action.index
				const value = arg_action.value
				
				const items = arg_previous_state.get('items').insert(index, value)
				const next_state = arg_previous_state.set('items', items)
				
				return this.strategy_resize_state(items, next_state)
			}
			
			case 'remove_at': {
				const index = arg_action.index
				const items = arg_previous_state.get('items').delete(index)
				const next_state = arg_previous_state.set('items', items)
				return next_state
			}
			
			case 'remove_first': {
				const items = arg_previous_state.get('items').delete(0)
				const next_state = arg_previous_state.set('items', items)
				return next_state
			}
			
			case 'remove_last': {
				if ( T.isNumber(arg_action.count) )
				{
					const count = arg_action.count
					
					if (count <= 0)
					{
						return arg_previous_state
					}
					
					if ( ! arg_previous_state.has('items') )
					{
						return arg_previous_state
					}
					
					let items = arg_previous_state.get('items')
					const last = items.size
					if ( (last - count) < 0 )
					{
						return arg_previous_state.clear()
					}
					
					items = items.splice(last - count, count)
					return arg_previous_state.set('items', items)
				}
				
				let items = arg_previous_state.get('items')
				const index = items.size
				items = items.delete(index)
				
				const next_state = arg_previous_state.set('items', items)
				return next_state
			}
		}
		
		return arg_previous_state
	}
	
	
	
	/**
	 * Handle component state changes.
	 * 
	 * @param {Immutable.Map} arg_previous_state - previous state map.
	 * @param {Immutable.Map} arg_new_state - new state map.
	 * 
	 * @returns {nothing}
	 */
	handle_state_change(arg_previous_state, arg_new_state)
	{
		if (! arg_previous_state)
		{
			// console.info(context + ':handle_state_change:update initial items')
			
			if ( T.isFunction(this.strategy_update) )
			{
				const new_items = arg_new_state.get('items').toArray()
				
				this.strategy_update(new_items)
			}
			
			if ( T.isFunction(this.strategy_resize_ui) )
			{
				this.strategy_resize_ui()
			}
			return
		}
		
		if ( arg_previous_state && arg_new_state && arg_previous_state.has('items') && arg_new_state.has('items') )
		{
			// console.log(context + ':handle_state_change:arg_previous_state', arg_previous_state.get('items').toJS())
			// console.log(context + ':handle_state_change:arg_new_state', arg_new_state.get('items').toJS())
			
			if ( ! arg_previous_state.get('items').equals( arg_new_state.get('items') ) )
			{
				// console.info(context + ':handle_state_change:update items')
				
				const new_items = arg_new_state.get('items').toArray()
				
				if (new_items.length == 0)
				{
					this.ui_items_clear()
					return
				}
				
				if ( T.isFunction(this.strategy_update) )
				{
					// console.info(context + ':handle_state_change:strategy_update')
					this.strategy_update(new_items)
				}
				
				if ( T.isFunction(this.strategy_resize_ui) )
				{
					// console.info(context + ':handle_state_change:resize UI items')
					this.strategy_resize_ui()
				}
				
				return
			}
			
			if ( arg_previous_state.getIn(['strategy', 'resize_max']) != arg_new_state.getIn(['strategy', 'resize_max']) )
			{
				if ( T.isFunction(this.strategy_resize_ui) )
				{
					// console.info(context + ':handle_state_change:resize UI items')
					this.strategy_resize_ui()
				}
			}
		}
	}
	
	
	
	// -----------------------------------------------------------------------------------------------------
	// DEFINE UI HANDLERS FOR STATE UPDATE
	// -----------------------------------------------------------------------------------------------------
	
	/**
	 * Get container items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_get_count()
	{
		// NOT YET IMPLEMENTED
	}
	
	
	
	/**
	 * Erase container items.
	 * 
	 * @returns {nothing}
	 */
	ui_items_clear()
	{
		// NOT YET IMPLEMENTED
	}
	
	
	
	/**
	 * Append items to the container.
	 * 
	 * @param {array} arg_items_array - items array.
	 * 
	 * @returns {nothing}
	 */
	ui_items_append(arg_items_array)
	{
		assert( T.isArray(arg_items_array), context + ':ui_items_append:bad items array')
		
		// NOT YET IMPLEMENTED
	}
	
	
	
	/**
	 * Prepend tems to the container..
	 * 
	 * @param {array} arg_items_array - rows array.
	 * 
	 * @returns {nothing}
	 */
	ui_items_prepend(arg_items_array)
	{
		assert( T.isArray(arg_items_array), context + ':ui_items_prepend:bad items array')
		
		// NOT YET IMPLEMENTED
	}
	
	
	
	/**
	 * Remove an item at given position.
	 * 
	 * @param {number} arg_index - item index.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_at_index(arg_index)
	{
		assert( T.isNumber(arg_index), context + ':ui_items_remove_at_index:bad index number')
		
		// NOT YET IMPLEMENTED
	}
	
	
	
	/**
	 * Remove a item at first position.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_first()
	{
		// NOT YET IMPLEMENTED
	}
	
	
	
	/**
	 * Remove a item at last position.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_last()
	{
		// NOT YET IMPLEMENTED
	}
}
