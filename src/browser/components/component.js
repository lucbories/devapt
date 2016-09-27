// NPM IMPORTS
import T from 'typr'
import assert from 'assert'

// BROWSER IMPORTS
import Bindable from './bindable'


const context = 'browser/components/component'



/**
 * @file UI component class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Component extends Bindable
{
	
	/**
	 * Creates an instance of Component.
	 * @extends Bindable
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
		
		this.is_component = true
		
		// console.info(context + ':constructor:creating component ' + this.get_name())
	}
	
	
	
	/**
	 * Load and apply a component configuration.
	 * 
	 * @param {Immutable.Map|undefined} arg_state - component state to load (optional).
	 * @returns {nothing} 
	 */
	load(arg_state)
	{
		// console.info(context + ':load:loading component ' + this.get_name())
		
		if (! this.store_unsubscribe)
		{
			this.store_unsubscribe = this.runtime.create_store_observer(this)
		}
		
		const state = arg_state ? arg_state : this.get_state()
		// console.log(state, 'load bindinds')
		
		if (! state)
		{
			return
		}
		
		const bindings = state.has('bindings') ? state.get('bindings').toJS() : undefined
		if ( T.isObject(bindings) )
		{
			if ( T.isArray(bindings.services) )
			{
				bindings.services.forEach(
					(bind_cfg) => {
						const svc_name = ('service' in bind_cfg) ? bind_cfg['service'] : undefined
						const svc_method = ('method' in bind_cfg) ? bind_cfg['method'] : undefined
						const xform = ('transform' in bind_cfg) ? bind_cfg['transform'] : undefined
						const timeline = ('timeline' in bind_cfg) ? bind_cfg['timeline'] : undefined
						const target_view = ('target_view' in bind_cfg) ? bind_cfg['target_view'] : undefined
						const target_views = ('target_views' in bind_cfg) ? bind_cfg['target_views'] : undefined
						const target_dom_selector = ('target_dom_selector' in bind_cfg) ? bind_cfg['target_dom_selector'] : undefined
						const target_dom_selectors = ('target_dom_selectors' in bind_cfg) ? bind_cfg['target_dom_selectors'] : undefined
						const target_method = ('target_method' in bind_cfg) ? bind_cfg['target_method'] : undefined
						const options = ('options' in bind_cfg) ? bind_cfg['options'] : undefined
						
						let target_object = this
						if ( T.isString(target_view) && target_view != 'this' )
						{
							target_object = this.runtime.ui.get(target_view)
						}
						else if ( T.isString(target_dom_selector) )
						{
							if (target_dom_selector == 'this')
							{
								target_object = $('#' + this.get_dom_id() )
							}
							else
							{
								target_object = $(target_dom_selector)
							}
						}
						
						
						if ( T.isString(timeline) && T.isArray(target_dom_selectors) )
						{
							// console.log(context + ':load:timeline bindings for ' + timeline)

							let timeline_objects = []
							target_dom_selectors.forEach(
								(dom_selector) => {
									timeline_objects.push( $(dom_selector) )
								}
							)
							this.bind_timeline(svc_name, svc_method, timeline, timeline_objects, target_method, options)
						}

						else if ( T.isString(timeline) && T.isArray(target_views) )
						{
							// console.log(context + ':load:timeline bindings for ' + timeline)

							let timeline_objects = []
							target_views.forEach(
								(view_name) => {
									const view = this.runtime.ui.get(view_name)
									if (view)
									{
										timeline_objects.push(view)
									}
								}
							)
							this.bind_timeline(svc_name, svc_method, timeline, timeline_objects, target_method, options)
						}

						else
						{
							this.bind_svc(svc_name, svc_method, xform, target_object, target_method, options)
						}
					}
				)
			}
			
			
			if ( T.isArray(bindings.dom) )
			{
				bindings.dom.forEach(
					(bind_cfg) => {
						const dom_selector = ('dom_selector' in bind_cfg) ? bind_cfg['dom_selector'] : undefined
						const dom_event = ('dom_event' in bind_cfg) ? bind_cfg['dom_event'] : undefined
						const xform = ('transform' in bind_cfg) ? bind_cfg['transform'] : undefined
						const target_view = ('target_view' in bind_cfg) ? bind_cfg['target_view'] : undefined
						const target_dom_selector = ('target_dom_selector' in bind_cfg) ? bind_cfg['target_dom_selector'] : undefined
						const target_method = ('target_method' in bind_cfg) ? bind_cfg['target_method'] : undefined
						const options = ('options' in bind_cfg) ? bind_cfg['options'] : undefined
						
						let target_object = this
						if ( T.isString(target_view) && target_view != 'this' )
						{
							target_object = this.runtime.ui.get(target_view)
						}
						else if ( T.isString(target_dom_selector) )
						{
							if (target_dom_selector == 'this')
							{
								target_object = $('#' + this.get_dom_id() )
							}
							else
							{
								target_object = $(target_dom_selector)
							}
						}
						const source_dom_selector = dom_selector == 'this' ? '#' + this.get_dom_id() : dom_selector
						this.bind_dom(source_dom_selector, dom_event, xform, target_object, target_method, options)
					}
				)
			}
		}
	}
	
	
	
	/**
	 * Unload a component configuration.
	 * 
	 * @returns {nothing} 
	 */
	unload()
	{
		assert( T.isFunction(this.store_unsubscribe), context + ':unload:bad store_unsubscribe function')
		
		this.store_unsubscribe()
	}
	
	
	
	/**
	 * Get DOM id
	 */
	get_dom_id()
	{
		return this.initial_state['dom_id']
	}
	
	
	
	/**
	 * Bind "this" DOM event on an object method through a stream.
	 * 
	 * @param {string} arg_dom_event - DOM event name string.
	 * @param {string|array|function} arg_values_xform - values transformation (optional).
	 * @param {object} arg_bound_object - target object instance (optional: this as default).
	 * @param {string} arg_bound_method - target object method string.
	 * 
	 * @returns {nothing}
	 */
	bind_this_dom(arg_dom_event, arg_values_xform, arg_bound_object, arg_bound_method)
	{
		this.bind_dom('#' + this.get_dom_id(), arg_dom_event, arg_values_xform, arg_bound_object, arg_bound_method)
	}



	/**
	 * Show component.
	 * 
	 * @returns {nothing}
	 */
	show()
	{
		$('#' + this.get_dom_id() ).show()
	}



	/**
	 * Hide component.
	 * 
	 * @returns {nothing}
	 */
	hide()
	{
		$('#' + this.get_dom_id() ).hide()
	}



	/**
	 * Render view on window.document element.
	 * 
	 * @returns {Promise}
	 */
	render()
	{
		const is_rendered = this.get_state_value('is_rendered', false)
		if (is_rendered)
		{
			return
		}

		// TODO: request rendering html on the server
		console.error('browser/component:render:not yet implemented')
	}
}
