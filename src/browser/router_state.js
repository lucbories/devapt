// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
import { fromJS } from 'immutable'

// COMMON IMPORTS
import Stateable from '../common/base/stateable'


const context = 'browser/router_state'



/**
 * Initial route state
 */
const initial_state_js = {
	history:{
		items:[],
		index:-1
	}
}



/**
 * @file Browser navigation router class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class RouterState extends Stateable
{
	/**
	 * Create a RouterState instance.
	 * @extends Stateable
	 * @abstract
	 * 
	 * A RouterState instance manages a navigation history state and update the page on navigation change.
	 * 
	 * Navigation history is an array stored into the Redux store.
	 * 
	 * Actions are:
	 * 		* display_content(view name, menubar name): update page content with given view and menubar.
	 * 		* go_backward(): update page with history previous content if available.
	 * 		* go_forward(): update page with history next content if available.
	 * 		* update_history(arg_history_values): replace history array.
	 * 		* clear_history(): reset history array.
	 * 
	 * Corresponding method to subclass are:
	 * 		* display_content_self(view name, menubar name):Promise
	 * 		* go_backward_self():Promise
	 * 		* go_forward_self():Promise
	 * 
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_log_context)
	{
		const runtime = window.devapt().runtime()
		const log_context = arg_log_context ? arg_log_context : context
		const default_settings = {}
		super(default_settings, runtime, initial_state_js, log_context)

		this.is_router_state = true
		this.state_path = ['router']
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
			this.error('load:no available state')
			return
		}
	}
	
	
	
	/**
	 * Handle state changes.
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
			this.do_action_clear_history()
			return
		}
		
		if ( arg_previous_state && arg_new_state && arg_previous_state.has('history') && arg_new_state.has('history') )
		{
			if ( arg_previous_state.hasIn(['history', 'items']) && arg_new_state.hasIn(['history', 'items'] ) )
			{
				const previous_history_items = arg_previous_state.getIn(['history', 'items'])
				const new_history_items = arg_new_state.getIn(['history', 'items'])
				if ( ! previous_history_items.equals(new_history_items) )
				{
					const new_items = new_history_items.toArray().toJS()
					
					if (new_items.length == 0)
					{
						this.do_action_clear_history()
						return
					}

					this.do_action_update_history(new_items)
				}
			}
			
			if ( arg_previous_state.hasIn(['history', 'index']) && arg_new_state.hasIn(['history', 'index'] ) )
			{
				const previous_history_index = arg_previous_state.getIn(['history', 'index'])
				const new_history_index = arg_new_state.getIn(['history', 'index'])
				// TODO CHECK IMMUTABLE RETURNS A NUMBER
				if ( previous_history_index != new_history_index )
				{
					this.do_action_move_history(new_history_index)
				}
			}
		}
	}


	
	/**
	 * Goto the page content with given view (update only the hash).
	 * 	
	 * @param {string} arg_view_name - view name.
	 * @param {string} arg_menubar_name - menubar name.
	 * 
	 * @returns {nothing}
	 */
	do_action_display_content(arg_view_name, arg_menubar_name)
	{
		this.enter_group('do_action_display_content')
		
		this.debug('arg_view_name', arg_view_name)
		this.debug('arg_menubar_name', arg_menubar_name)
		
		this.dispatch_action('display_content', { view:arg_view_name, menubar:arg_menubar_name } )
		
		this.leave_group('do_action_display_content')
	}



	/**
	 * Display history previous content if available.
	 *
	 * @returns {nothing}
	 */
	do_action_go_backward()
	{
		this.enter_group('do_action_go_backward')
		
		this.dispatch_action('go_backward', {} )
		
		this.leave_group('do_action_go_backward')
	}



	/**
	 * Display history next content if available.
	 *
	 * @returns {nothing}
	 */
	do_action_go_forward()
	{
		this.enter_group('do_action_go_forward')
		
		this.dispatch_action('go_forward', {} )
		
		this.leave_group('do_action_go_forward')
	}
	


	/**
	 * Clear history.
	 *
	 * @returns {nothing}
	 */
	do_action_clear_history()
	{
		this.enter_group('do_action_go_forward')
		
		this.dispatch_action('clear_history', {} )
		
		this.leave_group('do_action_go_forward')
	}



	/**
	 * Update history.
	 *
	 * @param {array} arg_new_items - history array items.
	 * 
	 * @returns {nothing}
	 */
	do_action_update_history(arg_new_items)
	{
		this.enter_group('do_action_go_forward')
		
		this.debug('arg_new_items', arg_new_items)

		this.dispatch_action('update_history', { values: arg_new_items } )
		
		this.leave_group('do_action_go_forward')
	}



	/**
	 * Move history current position.
	 *
	 * @param{Number} arg_new_index - history position index.
	 * 
	 * @returns {nothing}
	 */
	do_action_move_history(arg_new_index)
	{
		this.enter_group('do_action_move_history')
		
		this.debug('arg_new_index', arg_new_index)

		this.dispatch_action('update_history', { index: arg_new_index } )
		
		this.leave_group('do_action_move_history')
	}

	
	
	/**
	 * Store actions reducer pure function.
	 * 
	 * @param {object} arg_previous_state - previous state.
	 * @param {object} arg_action - store action: { type:'', component:'', ...}
	 * 
	 * @returns {object} - new state
	 */
	reduce_action(arg_previous_state, arg_action)
	{
		const initial_state_js = {

		}

		if (! arg_previous_state)
		{
			arg_previous_state = fromJS(initial_state_js)
		}

		// console.log(context + ':reduce_action:prev state', arg_previous_state.toJS())
		
		switch(arg_action.type)
		{
			case 'display_content': {
				if ( ! T.isString(arg_action.view) || ! T.isString(arg_action.menubar) )
				{
					return arg_previous_state
				}

				// UPDATE PAGE URL
				this.update_hash(arg_action.view, arg_action.menubar)
				
				// UPDATE ROUTER STORED STATE
				const history = arg_previous_state.get('history')
				let next_state = history.get('items').push( { view:arg_action.view_name, menubar:arg_action.menubar_name } )
				next_state = history.set('index', history.get('index') )
				
				// UPDATE PAGE CONTENT
				this.display_content(arg_action.view, arg_action.menubar)
				
				return next_state
			}

			case 'go_backward': {
				const history = arg_previous_state.get('history')
				const previous_index = history.get('index')
				if (previous_index > 0)
				{
					const new_index = previous_index - 1
					const item = history.get('items').get(new_index, undefined)
					if (item)
					{
						this.display_content(item.view, item.menubar)

						const next_state = history.set('index', new_index)
						return next_state
					}
				}
				
				return arg_previous_state
			}

			case 'go_forward': {
				const history = arg_previous_state.get('history')
				const previous_index = history.get('index')
				if (previous_index + 1 < history.get('items').count() )
				{
					const new_index = previous_index + 1
					const item = history.get('items').get(new_index, undefined)
					if (item)
					{
						this.display_content(item.view, item.menubar)

						const next_state = history.set('index', new_index)
						return next_state
					}
				}

				return arg_previous_state
			}

			case 'clear_history': {
				const next_state = arg_previous_state.set('history', fromJS([]) )
				return next_state
			}

			case 'update_history': {
				let items = arg_previous_state.get('history').concat(arg_action.values)
				const next_state = arg_previous_state.set('history', items)
				return next_state
			}

			case 'move_history': {
				const history = arg_previous_state.get('history')
				const new_index = arg_action.index
				if (new_index > 0 && new_index < history.get('items').count() )
				{
					const item = history.get('items').get(new_index, undefined)
					if (item)
					{
						this.display_content(item.view, item.menubar)

						const next_state = history.set('index', new_index)
						return next_state
					}
				}
			}
		}

		
		return arg_previous_state
	}
	
	
	
	/**
	 * Display the page content with given view and menubar.
	 * 
	 * @param {string} arg_view_name - view name
	 * @param {string} arg_menubar_name - menubar name
	 * 
	 * @returns {Promise} - Resolved result is a boolean: success or failure
	 */
	display_content(arg_view_name, arg_menubar_name)
	{
		this.enter_group('display_content')
		
		this.debug('arg_view_name', arg_view_name)
		this.debug('arg_menubar_name', arg_menubar_name)
		

		let promise = null
		try
		{
			if ( T.isFunction(this.display_content_self) )
			{
				promise = this.display_content_self(arg_view_name, arg_menubar_name)
			}
		}
		catch(e)
		{
			console.error(e, context)
			promise = Promise.resolve(false)
		}
		

		this.leave_group('display_content')
		return promise
	}
	
	

	/**
	 * Update page url with given view and menubar (update only the hash).
	 * 
	 * @param {string} arg_view_name - view name.
	 * @param {string} arg_menubar_name - menubar name.
	 * 
	 * @returns {nothing}
	 */
	update_hash(arg_view_name, arg_menubar_name)
	{
		this.enter_group('update_hash')
		
		this.debug('arg_view_name', arg_view_name)
		this.debug('arg_menubar_name', arg_menubar_name)
		
		try
		{
			if ( T.isFunction(this.update_hash_self) )
			{
				this.update_hash_self(arg_view_name, arg_menubar_name)
			}
		}
		catch(e)
		{
			console.error(e, context)
			this.error(e)
		}
		
		this.leave_group('update_hash')
	}
}
