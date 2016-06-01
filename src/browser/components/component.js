
import T from 'typr'
import assert from 'assert'

import Stateable from './stateable'


const context = 'browser/components/component'




/**
 * @file UI component class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Component extends Stateable
{
	
	/**
	 * Creates an instance of Component.
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_state - component state.
	 */
	constructor(arg_runtime, arg_state)
	{
		super(arg_runtime, arg_state)
		
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
		
		this.store_unsubscribe = this.runtime.create_store_observer(this)
		
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
						const target_view = ('target_view' in bind_cfg) ? bind_cfg['target_view'] : undefined
						const target_method = ('target_method' in bind_cfg) ? bind_cfg['target_method'] : undefined
						const options = ('options' in bind_cfg) ? bind_cfg['options'] : undefined
						
						const target_object = T.isString(target_view) ? this.runtime.ui.get(target_view) : this
						
						this.bind_svc(svc_name, svc_method, xform, target_object, target_method, options)
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
						if ( T.isString(target_view) )
						{
							if (target_view == 'this')
							{
								target_object = this
							}
							else
							{
								target_object = this.runtime.ui.get(target_view)
							}
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
}
