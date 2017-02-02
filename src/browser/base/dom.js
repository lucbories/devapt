// NPM IMPORTS
// import assert from 'assert'
// import _ from 'lodash'

// COMMON IMPORTS
import T from '../../common/utils/types'
import uid from '../../common/utils/uid.js'

// BROWSER IMPORTS
import Stateable from '../../common/base/stateable'
import Rendering from './rendering'


const context = 'browser/base/dom'



/**
 * @file UI component class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Dom extends Stateable
{
	/**
	 * Creates an instance of Component.
	 * @extends Stateable
	 * 
	 * 	API
	 * 		->get_name():string - Get name.
	 * 		->get_dom_id():string - Get DOM id.
	 * 		
	 * 		->has_dom_element():boolean - Test DOM Element instance.
	 * 		->get_dom_element():Element - Get DOM element.
	 * 		->set_dom_element(arg_element):nothing -Set DOM element.
	 * 
	 * 		->has_dom_parent(arg_element):boolean - Test if component element has given parent element.
	 * 		->get_dom_parent():Element - Get parent element.
	 * 		->set_dom_parent(arg_parent_element):nothing - Set given parent element.
	 * 		->set_dom_parent_of(arg_component):nothing - Set given parent element.
	 * 
	 * 		->get_dom_attr(arg_attr_name):string - DOM element manipulation:get dom element attribute.
	 * 		->set_dom_attr(arg_attr_name, arg_attr_value):nothing - DOM element manipulation:set dom element attribute value.
	 * 
	 * 		->get_dom_text():string - DOM element manipulation:get dom element text.
	 * 		->set_dom_text(arg_text_value):nothing - DOM element manipulation:set dom element text value.
	 * 		->clear_dom_text():nothing - DOM element manipulation:clear dom element text value.
	 * 
	 * 		->get_dom_value():string - DOM element manipulation:get dom element value.
	 * 		->set_dom_value(arg_value):nothing - DOM element manipulation:set dom element value.
	 * 		->clear_dom_value():nothing - DOM element manipulation:clear dom element value.
	 * 
	 * 		->on_dom_event(arg_dom_event, arg_dom_selector, arg_handler, arg_data=undefined, arg_debug=true):nothing - Mount dom event handler with delegator.
	 * 		
	 * 		->has_dom_vnode():boolean - Test DOM Virtual Node.
	 * 		->get_dom_vnode():VNode - Get DOM Virtual Node.
	 * 		->set_dom_vnode(arg_vnode):nothing - Set DOM Virtual Node.
	 * 
	 * 		->is_visible(arg_check=false):boolean - Get visibility.
	 * 		->show():nothing - Show component.
	 * 		->hide():nothing - Hide component.
	 * 
	 * @param {RuntimeBase} arg_runtime - client runtime.
	 * @param {Immutable.Map} arg_state - component initial state.
	 * @param {string} arg_log_context - context of traces of this instance (optional).
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_state, arg_log_context)
	{
		const log_context = arg_log_context ? arg_log_context : context
		const default_settings = {}
		super(default_settings, arg_runtime, arg_state, log_context)
		
		this.is_dom   = true

		// SET NAME
		this._name = arg_state.get('name', undefined)
		if (!this._name)
		{
			this._name = 'component_' + uid()
		}

		this._is_visible = false
		this._visiblility = undefined
		
		this._rendering = new Rendering(this, arg_state.get('dom_id', this._name))
	}
	
	
	
	/**
	 * Get name.
	 * 
	 * @returns {string} - component name.
	 */
	get_name()
	{
		return this._name
	}
	
	
	
	/**
	 * Get DOM id.
	 * 
	 * @returns {string} - component DOM id.
	 */
	get_dom_id()
	{
		return this._rendering.get_dom_id()
	}
	
	
	
	/**
	 * Test DOM Element instance.
	 * 
	 * @returns {boolean}
	 */
	has_dom_element()
	{
		return this._rendering.has_dom_element()
	}
	
	
	
	/**
	 * Get DOM element.
	 * 
	 * @returns {Element}
	 */
	get_dom_element()
	{
		return this._rendering.get_dom_element()
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
		this._rendering.set_dom_element(arg_element)
	}



	/**
	 * Test if component element has given parent element.
	 * 
	 * @param {Element} arg_element - parent element to test.
	 * 
	 * @returns {boolean}
	 */
	has_dom_parent(arg_element)
	{
		const dom_elem = this.get_dom_element()
		if (!arg_element)
		{
			return !! dom_elem.parentElement
		}
		return dom_elem && dom_elem.parentElement == arg_element
	}
	


	/**
	 * Get parent element.
	 * 
	 * @returns {Element} - parent element.
	 */
	get_dom_parent()
	{
		const dom_elem = this.get_dom_element()
		return dom_elem ? dom_elem.parentElement : undefined
	}



	/**
	 * Set given parent element.
	 * 
	 * @param {Element} arg_parent_element - parent element.
	 * 
	 * @returns {nothing}
	 */
	set_dom_parent(arg_parent_element)
	{
		const dom_elem = this.get_dom_element()
		if (dom_elem && arg_parent_element)
		{
			arg_parent_element.appendChild(dom_elem)
		}
	}



	/**
	 * Set given parent element.
	 * 
	 * @param {Component} arg_component - parent element component.
	 * 
	 * @returns {nothing}
	 */
	set_dom_parent_of(arg_component)
	{
		const dom_elem = this.get_dom_element()
		if (dom_elem && arg_component && arg_component.has_dom_parent())
		{
			arg_component.get_dom_parent().appendChild(dom_elem)
		}
	}



	/**
	 * DOM element manipulation:get dom element attribute.
	 * 
	 * @param {string} arg_attr_name - dom attribute name.
	 * 
	 * @returns {string}
	 */
	get_dom_attr(arg_attr_name)
	{
		const dom_elem = this.get_dom_vnode()
		if (! dom_elem)
		{
			return undefined
		}

		return dom_elem.getAttribute ? dom_elem.getAttribute(arg_attr_name) : undefined
	}



	/**
	 * DOM element manipulation:set dom element attribute value.
	 * 
	 * @param {string} arg_attr_name - dom attribute name.
	 * @param {string} arg_attr_value - dom attribute value.
	 * 
	 * @returns {nothing}
	 */
	set_dom_attr(arg_attr_name, arg_attr_value)
	{
		const dom_elem = this.get_dom_vnode()
		if (! dom_elem)
		{
			return
		}

		if (dom_elem.setAttribute)
		{
			dom_elem.setAttribute(arg_attr_name, arg_attr_value)
		}
	}



	/**
	 * DOM element manipulation:get dom element text.
	 * 
	 * @returns {string}
	 */
	get_dom_text()
	{
		const dom_elem = this.get_dom_element()
		if (! dom_elem)
		{
			return undefined
		}

		return this._get_dom_text(dom_elem)
	}



	/**
	 * DOM element manipulation:set dom element text value.
	 * 
	 * @param {string} arg_text_value - dom text value.
	 * 
	 * @returns {nothing}
	 */
	set_dom_text(arg_text_value)
	{
		const dom_elem = this.get_dom_element()
		if (! dom_elem)
		{
			return
		}

		const node_type = dom_elem.nodeType

		if ( node_type === 1 || node_type === 9 || node_type === 11 )
		{
			dom_elem.textContent = '' + arg_text_value
		}
	}



	/**
	 * DOM element manipulation:clear dom element text value.
	 * 
	 * @returns {nothing}
	 */
	clear_dom_text()
	{
		const dom_elem = this.get_dom_element()
		if (! dom_elem)
		{
			return
		}

		const node_type = dom_elem.nodeType

		if ( node_type === 1 || node_type === 9 || node_type === 11 )
		{
			dom_elem.textContent = ''
		}
	}



	_get_dom_text(arg_element)
	{
		const node_type = arg_element.nodeType

		if ( node_type === 1 || node_type === 9 || node_type === 11 )
		{
			if ( T.isString(arg_element.type) && arg_element.type == 'textarea' && T.isString(arg_element.value) )
			{
				return arg_element.value
			}
			
			if ( T.isString(arg_element.textContent) )
			{
				return arg_element.textContent
			}

			// LOOP ON CHILDREN
			let child = arg_element.firstChild
			let str = ''
			while(child)
			{
				str += this._get_dom_text(child)
				child = child.nextSibling
			}

			return str
		}

		if ( node_type === 3 || node_type === 4 )
		{
			return arg_element.node_value
		}

		return undefined
	}



	/**
	 * DOM element manipulation:get dom element value.
	 * 
	 * @returns {string}
	 */
	get_dom_value()
	{
		const dom_elem = this.get_dom_element()
		if (! dom_elem || ! ('value' in dom_elem) )
		{
			return undefined
		}

		return dom_elem.value
	}



	/**
	 * DOM element manipulation:set dom element value.
	 * 
	 * @param {string} arg_value - dom value.
	 * 
	 * @returns {nothing}
	 */
	set_dom_value(arg_value)
	{
		const dom_elem = this.get_dom_element()
		if (! dom_elem || ! ('value' in dom_elem) )
		{
			return
		}

		dom_elem.value = arg_value
	}



	/**
	 * DOM element manipulation:clear dom element value.
	 * 
	 * @returns {nothing}
	 */
	clear_dom_value()
	{
		const dom_elem = this.get_dom_element()
		if (! dom_elem || ! ('value' in dom_elem) )
		{
			return
		}

		dom_elem.value = ''
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
	 * @returns {nothing}
	 */
	on_dom_event(arg_dom_event, arg_dom_selector, arg_handler, arg_data=undefined, arg_debug=true)
	{
		this._rendering.on_dom_event(arg_dom_event, arg_dom_selector, arg_handler, arg_data, arg_debug)
	}
	
	
	
	/**
	 * Test DOM Virtual Node.
	 * 
	 * @returns {boolean}
	 */
	has_dom_vnode()
	{
		return this._rendering.has_dom_vnode()
	}
	
	
	
	/**
	 * Get DOM Virtual Node.
	 * 
	 * @returns {VNode}
	 */
	get_dom_vnode()
	{
		return this._rendering.get_dom_vnode()
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
		this._rendering.set_dom_vnode(arg_vnode)
	}



	/**
	 * Get visibility.
	 * 
	 * @param {boolean} arg_check - if true, check style display value.
	 * 
	 * @returns {boolean}
	 */
	is_visible(arg_check=false)
	{
		if (arg_check)
		{
			const dom_elem = this.get_dom_element()
			this._is_visible = dom_elem && dom_elem.style.display != 'none'
		}
		return this._is_visible
	}



	/**
	 * Show component.
	 * 
	 * @returns {nothing}
	 */
	show()
	{
		const dom_elem = this.get_dom_element()
		if (dom_elem)
		{
			dom_elem.style.display = this._visiblility ? this._visiblility : 'block'
			
			// console.log(context + ':show:this._visiblility=%s, dom_elem.style.display=%s', this._visiblility, dom_elem.style.display)

			this._is_visible = true
		}
	}



	/**
	 * Hide component.
	 * 
	 * @returns {nothing}
	 */
	hide()
	{
		const dom_elem = this.get_dom_element()
		if (dom_elem)
		{
			this._visiblility = dom_elem.style.display == 'none' ? undefined : dom_elem.style.display
			dom_elem.style.display = 'none'
			this._is_visible = false
		}
	}
}
