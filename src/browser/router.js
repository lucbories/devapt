// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import Crossroads from 'crossroads'
import Hasher from 'hasher'

// BROWSER IMPORTS
import RouterState from './router_state'


const context = 'browser/router'



/**
 * @file Browser navigation router class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Router extends RouterState
{
	/**
	 * Create a Router instance.
	 * @extends RouterState
	 * 
	 * A Router instance manages a navigation history and update the page on navigation change.
	 * Navigation history is an array stored into the Redux store.
	 * Actions are:
	 * 		* display_content(view name, menubar name): update page content with given view and menubar.
	 * 		* go_backward(): update page with history previous content if available.
	 * 		* go_forward(): update page with history next content if available.
	 * 		* clear_history(): reset history array.
	 * 
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		super(log_context)

		this.is_router = true
		this.router_engine = Crossroads

		// DEBUG
		// log all routes
		this.router_engine.routed.add(console.log, console)
		// log all requests that were bypassed / not matched
		this.router_engine.bypassed.add(console.log, console)

		assert( T.isObject(this.state_store), context + ':constructor:bad state_store object')
	}


	
	/**
	 * Init router.
	 * 
	 * @param {string} arg_home_view_name - Home view name.
	 * @param {string} arg_home_menubar_name - Home menubar name.
	 * 
	 * @returns {nothing}
	 */
	init(arg_home_view_name, arg_home_menubar_name)
	{
		// REGISTER HOME PAGE ROUTE
		this.add_handler('',
			() => {
				return this.do_action_display_content(arg_home_view_name, arg_home_menubar_name)
			}
		)
		
		// REGISTER A PAGE ROUTE (view, menubar)
		var route = 'view\={view}\,menubar\={menubar}'
		this.add_handler(route,
			(arg_view, arg_menubar) => {
				return this.do_action_display_content(arg_view, arg_menubar)
			}
		)
		
		
		// SETUP HASHER
		const parseHash = (arg_newHash, arg_oldHash) => {
			console.log('Hasher parse cb for new [%s] and old [%s]', arg_newHash, arg_oldHash)
			this.router_engine.parse(arg_newHash)
		}
		Hasher.prependHash = ''
		Hasher.initialized.add(parseHash) //parse initial hash
		Hasher.changed.add(parseHash) //parse hash changes
		Hasher.init() //start listening for history change
	}



	/**
	 * Add a route handler.
	 * 
	 * @param {string|RegExp} arg_route - route.
	 * @param {Function} arg_handler - f(args)
	 * 
	 * @returns {nothing}
	 */
	add_handler(arg_route, arg_handler)
	{
		console.log('Crossroads add route handler for route:', arg_route)

		this.router_engine.addRoute(arg_route,
			(...args) => {
				var hash = Hasher.getHash()
				
				console.log('Crossroads route cb with hash [%s] and args:', hash, args)

				return  arg_handler(args)
			}
		)
	}
	
	

	/**
	 * Update page url with given view and menubar (update only the hash).
	 * 
	 * @param {string} arg_view_name - view name.
	 * @param {string} arg_menubar_name - menubar name.
	 * 
	 * @returns {nothing}
	 */
	update_hash_self(arg_view_name, arg_menubar_name)
	{
		Hasher.changed.active = false
		Hasher.setHash('view=' + arg_view_name + ',menubar=' + arg_menubar_name)
		Hasher.changed.active = true
	}
	
	
	
	/**
	 * Display the page content with given view and menubar.
	 * 
	 * @param {string} arg_view_name - view name
	 * @param {string} arg_menubar_name - menubar name
	 * 
	 * @returns {Promise} - Resolved result is a boolean: success or failure
	 */
	display_content_self(arg_view_name, arg_menubar_name)
	{
		this.enter_group('display_content_self')

		let page_content = this.runtime.ui.page.content
		let page_menubar = this.runtime.ui.page.menubar
		const page_breadcrumbs = this.runtime.ui.page.breadcrumbs

		let promises = []

		// UDPATE CONTENT VIEW
		if (page_content)
		{
			this.debug('page content exists')
			if( page_content.get_name() === arg_view_name )
			{
				page_content.show()
			} else {
				page_content.hide()
				page_content = undefined
			}
		}
		if (! page_content && T.isString(arg_view_name) )
		{
			this.debug('page content doesn t exist and view name is valid:', arg_view_name)
			const page_content_promise = this.runtime.ui.render(arg_view_name)
			.then(
				(controller)=>{
					this.runtime.ui.page.content = controller
				}
			)
			promises.push(page_content_promise)
		}


		// UDPATE MENUBAR
		if (page_menubar)
		{
			this.debug('page menubar exists')
			if( page_menubar.get_name() === arg_menubar_name )
			{
				page_menubar.show()
			} else {
				page_menubar.hide()
				page_menubar = undefined
			}
		}
		if (! page_menubar && T.isString(arg_menubar_name) )
		{
			this.debug('page menubar doesn t exist and menubar name is valid:', arg_menubar_name)
			const page_menubar_promise  = this.runtime.ui.render(arg_menubar_name)
			.then(
				(controller)=>{
					this.runtime.ui.page.menubar = controller
				}
			)
			promises.push(page_menubar_promise)
		}


		// UPDATE BREADCRUMBS
		if (page_breadcrumbs) // TODO
		{
			// var state = {
			// 	content_label: Devapt.app.main_content.label ? Devapt.app.main_content.label : Devapt.app.main_breadcrumbs.name,
			// 	menubar_name: arg_menubar_name,
			// 	view_name: arg_view_name
			// }
			
			// page_breadcrumbs.add_history_item(state)

			// promises.push( page_breadcrumbs.render() )
			// page_breadcrumbs.show()
		}

		this.leave_group('display_content_self:async')
		return Promise.all(promises)
	}
}
