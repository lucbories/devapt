// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import vdom_parser from 'vdom-parser'
import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import create_element from 'virtual-dom/create-element'


// COMMON IMPORTS

// BROWSER IMPORTS


const context = 'browser/base/rendering'



/**
 * @file UI component rendering class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Rendering
{
	/**
	 * Creates an instance of Rendering.
	 * 
	 * @param {Component} arg_component - component instance.
	 * @param {string} arg_dom_id - component dom element id
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_component, arg_dom_id)
	{
		this.is_rendering = true

		this._component = arg_component

		this._dom_id = arg_dom_id
		this._event_delegator = undefined
		this.set_dom_element( document.getElementById(arg_dom_id) )
		this._dom_vnode = undefined

		// this.enable_trace()
	}
	
	
	
	/**
	 * Get DOM id.
	 * 
	 * @returns {string} - component DOM id.
	 */
	get_dom_id()
	{
		return this._dom_id
	}
	
	
	
	/**
	 * Test DOM Element instance.
	 * 
	 * @returns {boolean}
	 */
	has_dom_element()
	{
		return T.isObject(this._dom_element) // TODO ENHANCE ELEMENT TYPE CHECK
	}
	
	
	
	/**
	 * Get DOM element.
	 * 
	 * @returns {Element} - DOM Element instance.
	 */
	get_dom_element()
	{
		return this._dom_element
	}


	has_child_element(arg_parent_element, arg_child_element)
	{
		this._component.enter_group('has_child_element')

		const elements = arg_parent_element ? arg_parent_element.children : undefined

		if (elements && elements.length > 0)
		{
			let child = undefined
			let i = 0
			while(i < elements.length)
			{
				child = elements[i]
				if (child == arg_child_element)
				{
					this._component.leave_group('has_child_element:found')
					return true
				}
				++i
			}
		}

		this._component.leave_group('has_child_element:not found')
		return false
	}
	
	
	
	/**
	 * Set DOM element.
	 * 
	 * @param {Element} arg_element - element instance.
	 * 
	 * @returns {nothing}
	 */
	set_dom_element(arg_element)
	{
		this._component.enter_group('set_dom_element')

		assert( (typeof arg_element) == 'object', context + ':set_dom_element:bad element object')
		
		const new_elm = arg_element
		const prev_elm = this.get_dom_element()
		const parent_elm = prev_elm ? prev_elm.parentNode : undefined

		// console.log(prev_elm, context + ':set_dom_element:prev_elm')
		// console.log(new_elm,  context + ':set_dom_element:new_elm')
		// console.log(parent_elm,  context + ':set_dom_element:parent_elm')

		// REMOVE PREVIOUS NODE FROM ITS PARENT
		if (prev_elm != new_elm)
		{
			// console.log(context + ':set_dom_element:prev_elm <> new_elm')
			if (parent_elm)
			{
				parent_elm.removeChild(prev_elm)
			}

			// DISABLE EVENT DELEGATION
			if (this._event_delegator)
			{
				this._event_delegator.destroy()
			}
		}

		// APPEND DOM ELEMENT TO ITS PARENT
		if (parent_elm)
		{
			if ( ! this.has_child_element(parent_elm, new_elm) )
			{
				parent_elm.appendChild(new_elm)
			}
		}
		
		// SET DOM ELEMENT
		this._dom_element = new_elm
		
		// ENABLE EVENT DELEGATION FOR ALL DOM SUB ELEMENTS
		if (! this._event_delegator)
		{
			const EventDelegate = require('dom-delegate').Delegate
			this._event_delegator = new EventDelegate(this._dom_element)
		} else {
			this._event_delegator.root(this._dom_element)
		}

		this._component.leave_group('set_dom_element')
	}
	
	
	
	/**
	 * Mount dom event handler.
	 * 
	 * @{string}   arg_dom_event - dom event name.
	 * @{string}   arg_dom_selector - dom selector string ('tag_name.class1.class2').
	 * @{function} arg_handler - handler function f(component, event name, selection, event, target).
	 * @{any}      arg_data - handler datas, default undefined (optional).
	 * @{boolean}  arg_debug - trace flag, default true (optional).
	 * 
	 * @returns {boolean}
	 */
	on_dom_event(arg_dom_event, arg_dom_selector, arg_handler, arg_data=undefined, arg_debug=true)
	{
		assert( T.isObject(this._event_delegator), context + ':on_dom_event:bad event delegator object' )

		const name = this._component.get_name()
		this._event_delegator.on(arg_dom_event, arg_dom_selector,
			(event, target)=>{
				if (arg_debug)
				{
					console.log(context + ':dom event delegate:component=%s event=%s selector=%s target=', name, arg_dom_event, arg_dom_selector, target, event, arg_data)
				}

				if ( T.isFunction(arg_handler) )
				{
					arg_handler(this._component, arg_dom_event, arg_dom_selector, event, target, arg_data)
				}

				event.stopPropagation()
				return false
			}
		)
	}
	
	
	
	/**
	 * Test DOM Virtual Node.
	 * 
	 * @returns {boolean}
	 */
	has_dom_vnode()
	{
		return T.isObject(this._dom_vnode) // TODO ENHANCE VNODE TYPE CHECK
	}
	
	
	
	/**
	 * Get DOM Virtual Node.
	 * 
	 * @returns {VNode}
	 */
	get_dom_vnode()
	{
		return this._dom_vnode
	}
	
	
	
	/**
	 * Set DOM Virtual Node.
	 * 
	 * @param {VNode} arg_vnode - VNode instance.
	 * 
	 * @returns {nothing}
	 */
	set_dom_vnode(arg_vnode)
	{
		if ( T.isObject(arg_vnode) ) // TODO ENHANCE VNODE TYPE CHECK
		{
			this._dom_vnode = arg_vnode
		}
	}



	/**
	 * Render component DOM element.
	 * 
	 * @returns {Promise}
	 */
	render()
	{
		const is_rendered = this._component.get_state_value('is_rendered', false)
		if (is_rendered)
		{
			return Promise.resolve()
		}

		if ( ! this.has_vnode() )
		{
			return Promise.reject(context + ':render:no dom vnode to render for ' + this._component.get_name())
		}

		if ( ! this.has_dom_element() )
		{
			return Promise.reject(context + ':render:no dom element to render for ' + this._component.get_name())
		}

		// const vnode = this.get_dom_vnode()
		// const root_element = this.get_dom_element()
		// const vnode_element = create_element(vnode)
		// root_element.appendChild(vnode_element)
	}



	/**
	 * PROCESS RENDERING RESULT: CREATE OR UPDATE DOM ELEMENT.
	 */
	process_rendering_vnode(arg_vnode)
	{
		this._component.enter_group('process_rendering_vnode')
		// console.log(context + ':process_rendering_vnode:%s:vnode', this._component.get_name(), arg_vnode)
		

		// const ui = window.devapt().ui()


		// GET COMPONENT ATTRIBUTES
		const dom_id = this.get_dom_id()
		
		
		// GET PREVIOUS VNODE OR BUILD IT FROM EXISTING HTML DOM
		let prev_element = this.get_dom_element()
		let prev_vnode = this.get_dom_vnode()
		if ( ! prev_vnode && prev_element)
		{
			// console.log(context + ':process_rendering_vnode:no previous vnode and dom element')
			
			prev_vnode = vdom_parser(prev_element)
		}
		if (! prev_element)
		{
			// console.log(context + ':process_rendering_vnode:create dom element')
			
			prev_element = document.createElement('DIV')
			prev_element.setAttribute('id', dom_id)
			this.set_dom_element(prev_element)

			prev_vnode = undefined
		}


		// SET NEW VNODE FROM JSON RESULT
		let new_element = undefined
		let new_vnode = arg_vnode
		if (!new_vnode)
		{
			this._component.leave_group('process_rendering_vnode:new vnode not found')
			return Promise.reject(context + ':process_rendering_vnode:new vnode not found for ' + this._component.get_name())
		}
		this.set_dom_vnode(new_vnode)


		// PATCH EXISTING HTML DOM
		if (prev_vnode && new_vnode && prev_element)
		{
			// console.log(context + ':process_rendering_vnode:previous vnode and new vnode and dom element exist')

			// console.log(context + ':process_rendering_vnode:prev_element', prev_element )
			// console.log(context + ':process_rendering_vnode:prev_vnode', prev_vnode )
			// console.log(context + ':process_rendering_vnode:new_vnode', new_vnode )

			const patches = diff(prev_vnode, new_vnode)
			this._component.debug('patches', patches)
			// console.log(context + ':process_rendering_vnode:patches', patches)
			
			new_element = patch(prev_element, patches)
			this.set_dom_element(new_element)

			this._component.debug('process_rendering_vnode:new_element', new_element )
			// console.log(context + ':process_rendering_vnode:new_element', new_element)
		}


		// BUILD HTML DOM
		if (! prev_vnode && new_vnode)
		{
			// console.log(context + ':process_rendering_vnode:no previous vnode and new vnode')

			this.set_dom_element( create_element(new_vnode) )
		}


		this._component.leave_group('process_rendering_vnode')
		return Promise.resolve()
	}



	/**
	 * Save rendering virtul node. Update component VNode with current component HTML.
	 * 
	 * @returns {nothing}
	 */
	save_rendering()
	{
		const dom_element = this.get_dom_element()
		const vnode = vdom_parser(dom_element)
		console.log(context + ':save_rendering:vnode', vnode)
		this.set_dom_vnode(vnode)
	}
}
