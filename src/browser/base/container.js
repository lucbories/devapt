// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import { fromJS } from 'immutable'

// BROWSER IMPORTS
import Component from './component'


const context = 'browser/base/container'



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
	 * 	API
	 * 		->load(arg_state):nothing - load configuration
	 * 
	 * 	API: DEFINE ACTION WRAPPERS (only dispatch an action to update the state)
	 * 		->do_action_set_resize_max(arg_value):nothing - Set max items value for the container.
	 * 		->do_action_clear_items():nothing - Clear container items.
	 * 
	 * 		->do_action_append(arg_items_array, arg_items_count):nothing  - Append items to the container (an item can be a string or an array or an object or ...).
	 * 		->do_action_prepend(arg_items_array, arg_items_count):nothing - Prepend an item (an item can be a string or an array or an object or ...).
	 * 		->do_action_replace(arg_items_array, arg_items_count):nothing - Replace items to the container (an item can be a string or an array or an object or ...).
	 * 		->do_action_insert_at(arg_index, arg_items_array, arg_items_count):nothing - Insert items at container position index (an item can be a string or an array or an object or ...).
	 * 
	 * 		->do_action_remove_at_index(arg_index):nothing - Remove an item at given position.
	 * 		->do_action_remove_first():nothing             - Remove an item at first position.
	 * 		->do_action_remove_last(arg_count):nothing     - Remove an item at last position.
	 * 
	 * 		->reduce_action(arg_previous_state, arg_action):Immutable.Map    - Store actions reducer pure function.
	 * 		->handle_state_change(arg_previous_state, arg_new_state):nothing - Handle component state changes.
	 * 
	 * 
	 * API: DEFINE UI HANDLERS FOR STATE UPDATE (only update UI)
	 * 		->ui_items_get_count():nothing - Get container items count.
	 * 		->ui_items_clear():nothing     - Erase container items.
	 * 
	 * 		->ui_items_append(arg_items_array):nothing  - Append tems to the container.
	 * 		->ui_items_prepend(arg_items_array):nothing - Prepend tems to the container.
	 * 		->ui_items_replace(arg_items_array, arg_items_count):nothing - Replace container items.
	 * 		->ui_items_insert_at(arg_index, arg_items_array, arg_items_count):nothing - Insert items at container position index.
	 * 
	 * 		->ui_items_remove_at_index(arg_index):nothing - Remove an item at given position.
	 * 		->ui_items_remove_first():nothing             - Remove a item at first position.
	 * 		->ui_items_remove_last():nothing              - Remove an item at last position.
	 * 
	 * API: state store actions
	 * 		* 'set_resize_max'
	 * 		* 'clear_items'
	 * 
	 * 		* 'append'
	 * 		* 'prepend'
	 * 		* 'replace'
	 * 		* 'insert_at'
	 * 
	 * 		* 'remove_at_index'
	 * 		* 'remove_first'
	 * 		* 'remove_last'
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
		
		this.strategy = undefined
		
		this.strategy_update = undefined
		this.strategy_resize_ui = undefined
		this.strategy_resize_state = undefined
		this.max_size = undefined

		this._state_action_index = 0
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
		
		// console.info(context + ':load:loading ' + this.get_name())
		
		if (! state)
		{
			return
		}
		
		if (this.is_loaded)
		{
			// console.info(context + ':load:already loaded component ' + this.get_name())
			return
		}

		if (! this.store_unsubscribe)
		{
			this.store_unsubscribe = this.get_runtime().create_store_observer(this)
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
						if (count > 0)
						{
							this.ui_items_remove_last(count)
						}
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

		// SET DEFAULT METHOD
		if (! this.strategy_resize_state)
		{
			this.strategy_resize_state = () => {}
		}
		if (! this.strategy_resize_ui)
		{
			this.strategy_resize_ui = () => {}
		}

		this.init_bindings()
		
		this.is_loaded = true
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
	 * Append items to the container (an item can be a string or an array or an object or ...).
	 * 
	 * @param {array}  arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	do_action_append(arg_items_array, arg_items_count)
	{
		if ( arguments.length == 2 && T.isNumber(arg_items_array) )
		{
			const tmp = arg_items_array
			arg_items_array = arg_items_count
			arg_items_count = tmp
		}
		if (! arg_items_count && T.isArray(arg_items_array) )
		{
			arg_items_count = arg_items_array.length
		}
		// console.log(context + ':do_action_append:%s:items,count:', this.get_name(), arg_items_array, arg_items_count)
		assert( T.isNumber(arg_items_count), context + ':do_action_append:bad items count')
		
		// if (arg_items_count == 1)
		// {
		// 	arg_items_array = [arg_items_array]
		// }
		assert( T.isArray(arg_items_array), context + ':do_action_append:bad items array')

		this.dispatch_action('append', {values:arg_items_array, count:arg_items_count } )
	}
	
	
	
	/**
	 * Prepend items to the container (an item can be a string or an array or an object or ...).
	 * 
	 * @param {array}  arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	do_action_prepend(arg_items_array, arg_items_count)
	{
		if ( arguments.length == 2 && T.isNumber(arg_items_array) )
		{
			const tmp = arg_items_array
			arg_items_array = arg_items_count
			arg_items_count = tmp
		}
		if (! arg_items_count && T.isArray(arg_items_array))
		{
			arg_items_count = arg_items_array.length
		}
		// console.log(context + ':do_action_prepend:%s:items,count:', this.get_name(), arg_items_array, arg_items_count)

		assert( T.isNumber(arg_items_count), context + ':do_action_prepend:bad items count')
		
		// if (arg_items_count == 1)
		// {
		// 	arg_items_array = [arg_items_array]
		// }

		assert( T.isArray(arg_items_array), context + ':do_action_prepend:bad items array')
		
		// console.log(context + ':do_action_prepend:arg_items_array', arg_items_array)

		this.dispatch_action('prepend', { values:arg_items_array, count:arg_items_count } )
	}
	
	
	
	/**
	 * Replace items to the container (an item can be a string or an array or an object or ...).
	 * 
	 * @param {array}  arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	do_action_replace(arg_items_array, arg_items_count)
	{
		if ( arguments.length == 2 && T.isNumber(arg_items_array) )
		{
			const tmp = arg_items_array
			arg_items_array = arg_items_count
			arg_items_count = tmp
		}
		// console.log(context + ':do_action_replace:%s:items,count:', this.get_name(), arg_items_array, arg_items_count)
		assert( T.isNumber(arg_items_count), context + ':do_action_replace:bad items count')
		
		// if (arg_items_count == 1)
		// {
		// 	arg_items_array = [arg_items_array]
		// }
		assert( T.isArray(arg_items_array), context + ':do_action_replace:bad items array')

		this.dispatch_action('replace', {values:arg_items_array, count:arg_items_count } )
	}
	
	
	
	/**
	 * Insert items at container position index (an item can be a string or an array or an object or ...).
	 * 
	 * @param {intege} arg_index       - position index.
	 * @param {array}  arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	do_action_insert_at(arg_index, arg_items_array, arg_items_count)
	{
		assert( T.isNumber(arg_index), context + ':do_action_replace:bad index number')
		assert( T.isNumber(arg_items_count), context + ':do_action_replace:bad items count')
		
		if (arg_items_count == 1)
		{
			arg_items_array = [arg_items_array]
		}
		assert( T.isArray(arg_items_array), context + ':do_action_insert_at:bad items array')

		this.dispatch_action('insert_at', {index:arg_index, values:arg_items_array, count:arg_items_count } )
	}
	
	
	
	/**
	 * Remove an item at given position.
	 * 
	 * @param {number} arg_index - item index.
	 * 
	 * @returns {nothing}
	 */
	do_action_remove_at_index(arg_index)
	{
		assert( T.isNumber(arg_index), context + ':remove_at_index:bad index number' )
		
		this.dispatch_action( { type:'remove_at_index', index:arg_index } )
	}
	
	
	
	/**
	 * Remove an item at first position.
	 * 
	 * @returns {nothing}
	 */
	do_action_remove_first()
	{
		this.dispatch_action('remove_first')
	}
	
	
	
	/**
	 * Remove an item at last position.
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
		
		// PUSH ACTION ON UI ACTIONS STACK
		let stack = arg_previous_state.get('ui_actions_stack')
		stack = stack ? stack.push(arg_action) : fromJS([arg_action])

		if (this._state_action_index >= stack.size - 1)
		{
			this._state_action_index = 0
			stack = fromJS([arg_action])
			// console.log(context + ':reduce_action:this._state_action_index(%s) >= stack.size(%s)', this._state_action_index, stack.size - 1)
		}
		
		let next_state = arg_previous_state.set('ui_actions_stack', stack)
		// console.log(context + ':reduce_action:stack', stack)

		switch(arg_action.type)
		{
			case 'set_resize_max': {
				if ( ! T.isNumber(arg_action.resize_max) && arg_action.resize_max > 0 )
				{
					return arg_previous_state
				}
				
				this.max_size = arg_action.resize_max
				const items = arg_previous_state.get('items')
				next_state = next_state.setIn(['strategy', 'resize_max'], arg_action.resize_max)
				return this.strategy_resize_state(items, next_state)
			}
			
			case 'clear_items': {
				next_state = next_state.set('items', fromJS([]))
				return next_state
			}
			
			case 'append': {
				const values = arg_action.values
				// console.log('container:reduce_action:append:values', values)
				
				let items = arg_previous_state.get('items').concat(values)
				next_state = next_state.set('items', items)
				
				return this.strategy_resize_state(items, next_state)
			}
			
			case 'prepend': {
				const values = arg_action.values
				// console.log(context + ':reduce_action:prepend:values', values)
				
				let items = arg_previous_state.get('items')
				values.forEach(
					(value) => items = items.splice(0, 0, value)
				)
				next_state = next_state.set('items', items)
				
				return this.strategy_resize_state(items, next_state)
			}
			
			case 'replace': {
				const values = arg_action.values
				// console.log(context + ':reduce_action:replace:values', values)
				
				next_state = next_state.set('items', values)
				
				return this.strategy_resize_state(values, next_state)
			}
			
			case 'insert_at': {
				const index = arg_action.index
				const value = arg_action.value
				
				const items = arg_previous_state.get('items').insert(index, value)
				next_state = next_state.set('items', items)
				
				return this.strategy_resize_state(items, next_state)
			}
			
			case 'remove_at_index': {
				const index = arg_action.index
				const items = arg_previous_state.get('items').delete(index)
				next_state = next_state.set('items', items)
				return next_state
			}
			
			case 'remove_first': {
				const items = arg_previous_state.get('items').delete(0)
				next_state = next_state.set('items', items)
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
					return next_state.set('items', items)
				}
				
				let items = arg_previous_state.get('items')
				const index = items.size
				items = items.delete(index)
				
				next_state = next_state.set('items', items)
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
		// console.log(context + ':handle_state_change')

		// GET WAITING UI STATE CHANGE ACTIONS
		let ui_actions_stack = arg_new_state.get('ui_actions_stack', [])
		ui_actions_stack = ui_actions_stack.toJS ? ui_actions_stack.toJS() : ui_actions_stack
		
		// LOOP ON WAITING ACTIONS
		let action = undefined
		while(this._state_action_index < ui_actions_stack.length)
		{
			action = ui_actions_stack[this._state_action_index]
			// console.log(context + ':handle_state_change:action', action, ui_actions_stack)
			this._state_action_index++

			this.handle_state_change_action(action, arg_previous_state, arg_new_state)
		}
	}



	/**
	 * Handle component state changes action.
	 * 
	 * @param {object}        arg_action         - state change action
	 * @param {Immutable.Map} arg_previous_state - previous state map.
	 * @param {Immutable.Map} arg_new_state      - new state map.
	 * 
	 * @returns {nothing}
	 */
	handle_state_change_action(arg_action, arg_previous_state, arg_new_state)
	{
		// console.log(context + ':handle_state_change_action:action', arg_action)

		switch(arg_action.type)
		{
			case 'clear_items': {
				this.ui_items_clear()
				break
			}
			
			case 'append': {
				this.ui_items_append(arg_action.values, arg_action.count)
				break
			}
			
			case 'prepend': {
				this.ui_items_prepend(arg_action.values, arg_action.count)
				return
			}
			
			case 'replace': {
				this.ui_items_replace(arg_action.values, arg_action.count)
				break
			}
			
			case 'insert_at': {
				this.ui_items_insert_at(arg_action.index, arg_action.values, arg_action.count)
				break
			}
			
			case 'remove_at_index': {
				this.ui_items_remove_at(arg_action.index)
				break
			}
			
			case 'remove_first': {
				this.ui_items_remove_first()
				break
			}
			
			case 'remove_last': {
				this.ui_items_remove_last(arg_action.count)
				break
			}
		}

		if ( T.isFunction(this.strategy_resize_ui) )
		{
			this.strategy_resize_ui()
		}
	}
		// if (! arg_previous_state)
		// {
		// 	// console.info(context + ':handle_state_change:update initial items')
			
		// 	if ( T.isFunction(this.strategy_update) )
		// 	{
		// 		const new_items = arg_new_state.get('items').toJS()
				
		// 		this.strategy_update(new_items, new_items.length)
		// 	}
			
		// 	if ( T.isFunction(this.strategy_resize_ui) )
		// 	{
		// 		this.strategy_resize_ui()
		// 	}
		// 	return
		// }
		
		/*if ( arg_previous_state && arg_new_state && arg_previous_state.has('items') && arg_new_state.has('items') )
		{
			// console.log(context + ':handle_state_change:arg_previous_state', arg_previous_state.get('items').toJS())
			// console.log(context + ':handle_state_change:arg_new_state', arg_new_state.get('items').toJS())
			
			if ( ! arg_previous_state.get('items').equals( arg_new_state.get('items') ) )
			{
				// console.info(context + ':handle_state_change:update items')
				
				const new_items = arg_new_state.get('items').toJS()
				
				if (new_items.length == 0)
				{
					this.ui_items_clear()
					return
				}
				
				if ( T.isFunction(this.strategy_update) )
				{
					// console.info(context + ':handle_state_change:strategy_update')
					this.strategy_update(new_items, new_items.length)
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
	}*/
	
	
	
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
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_append(arg_items_array, arg_items_count)
	{
		assert( T.isArray(arg_items_array), context + ':ui_items_append:bad items array')
		assert( T.isNumber(arg_items_count), context + ':ui_items_append:bad items count')
		
		// NOT YET IMPLEMENTED
	}
	
	
	
	/**
	 * Prepend items to the container.
	 * 
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_prepend(arg_items_array, arg_items_count)
	{
		assert( T.isArray(arg_items_array), context + ':ui_items_prepend:bad items array')
		assert( T.isNumber(arg_items_count), context + ':ui_items_prepend:bad items count')
		
		// NOT YET IMPLEMENTED
	}
	
	
	
	/**
	 * Replace container items.
	 * 
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_replace(arg_items_array, arg_items_count)
	{
		assert( T.isArray(arg_items_array), context + ':ui_items_replace:bad items array')
		assert( T.isNumber(arg_items_count), context + ':ui_items_replace:bad items count')
		
		// NOT YET IMPLEMENTED
	}
	
	
	
	/**
	 * Insert items at container position index.
	 * 
	 * @param {intege} arg_index - position index.
	 * @param {array} arg_items_array - items array.
	 * @param {intege} arg_items_count - items count.
	 * 
	 * @returns {nothing}
	 */
	ui_items_insert_at(arg_index, arg_items_array, arg_items_count)
	{
		assert( T.isArray(arg_items_array), context + ':ui_items_replace:bad items array')
		assert( T.isNumber(arg_items_count), context + ':ui_items_replace:bad items count')
		
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
	 * Remove an item at last position.
	 * 
	 * @returns {nothing}
	 */
	ui_items_remove_last()
	{
		// NOT YET IMPLEMENTED
	}
}
