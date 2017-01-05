// NPM IMPORTS
import T from 'typr/lib/typr'
import assert from 'assert'
import Crossroads from 'crossroads'
import Hasher from 'hasher'

// BROWSER IMPORTS
import RouterState from './router_state'


const context = 'browser/runtime/router'



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
	 * 	API:
	 * 		->init(arg_home_view_name, arg_home_menubar_name)
	 * 		->add_handler(arg_route, arg_handler)
	 * 		->update_hash_self(arg_view_name, arg_menubar_name)
	 * 		->display_content_self(arg_view_name, arg_menubar_name)
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

		this._router_engine = Crossroads
		this._hasher = Hasher

		// DEBUG
		// log all routes
		// this._router_engine.routed.add( (request, data)=>{ console.log('route found', request, data) } ) 
		
		// log all requests that were bypassed / not matched
		this._router_engine.bypassed.add( (request)=>{ console.warn('route not found', request) } )

		assert( T.isObject(this._state_store), context + ':constructor:bad state_store object')
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

			// debugger

			this._router_engine.parse(arg_newHash)
		}
		Hasher.prependHash = ''
		Hasher.setHash('/')
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

		this._router_engine.addRoute(arg_route,
			(...args) => {
				var hash = Hasher.getHash()
				
				console.log('Crossroads route cb with hash [%s] and args:', hash, args)

				return arg_handler(args)
			}
		)
	}
	
	

	/**
	 * Parse an url and route it.
	 * 
	 * @param {string} arg_url - url to route.
	 * 
	 * @returns {nothing}
	 */
	parse(arg_url)
	{
		const app_url = this._state_store.get_state().get('app_url', undefined)
		arg_url = (app_url.length > 0 && app_url[0] == '/' ? '' : '/') + app_url + arg_url
		
		if ( arg_url.endsWith('/') )
		{
			arg_url = arg_url.substr(0, arg_url.length - 1)
		}

		this._router_engine.parse(arg_url)
	}

	

	/**
	 * Update page url with given view and menubar (update only the hash).
	 * 
	 * @param {string} arg_view_name - view name.
	 * @param {string} arg_menubar_name - menubar name.
	 * 
	 * @returns {nothing}
	 */
	// update_hash_self(arg_view_name, arg_menubar_name)
	// {
	// 	Hasher.changed.active = false
	// 	Hasher.setHash('view=' + arg_view_name + ',menubar=' + arg_menubar_name)
	// 	Hasher.changed.active = true
	// }



	set_hash_if_empty(arg_hash)
	{
		if ( Hasher.getHash() == '' )
		{
			Hasher.changed.active = false
			Hasher.setHash(arg_hash)
			Hasher.changed.active = true
		}
	}
}
