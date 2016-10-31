// NPM IMPORTS
// import T from 'typr'
// import assert from 'assert'
import virtualize from 'vdom-virtualize'
// import document from 'global/document'

import diff from 'virtual-dom/diff'
import patch from 'virtual-dom/patch'
import create_element from 'virtual-dom/create-element'

import VNode from 'virtual-dom/vnode/vnode'
import VText from 'virtual-dom/vnode/vtext'
import html_to_vdom from 'html-to-vdom'

// COMMON IMPORTS
// import Credentials from '../../common/base/credentials'

const convertHTML = html_to_vdom({
    VNode: VNode,
    VText: VText
})


let context = 'browser/components/page'



/**
 * @file client page class.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */
export default class Page
{
	/**
	 * Create a Page instance.
	 * 
	 * @returns {nothing}
	 */
	constructor()
	{
		this.target_elem_head = window.document.head
		this.target_elem_body = window.document.body
		this.target_tree_head = undefined
		this.target_tree_body = undefined
		this.target_node_head = undefined
		this.target_node_body = undefined
	}


	/**
	 * Render a page.
	 */
	render_html(arg_html)
	{
		console.log('Page.render_html')
		$(document.body).html(arg_html)
		// this.render_html_with_vdom(arg_html)
	}



	/**
	 * Render a page.
	 */
	render_html_with_vdom(arg_html)
	{
		console.log('Page.render_html_with_vdom')

		if (! this.target_tree)
		{
			console.log('Page.render_html_with_vdom:init')

			this.target_tree_head = virtualize(this.target_elem_head)
			this.target_tree_body = virtualize(this.target_elem_body)

			this.target_node_head = create_element(this.target_tree_head)
			this.target_node_body = create_element(this.target_tree_body)

			// console.log('Page.render_html:init:target_node', this.target_node)
			// console.log('Page.render_html:init:target_node', this.target_node)
		}

		const new_tree = convertHTML(arg_html)

		const new_tree_head = new_tree.children[0]
		const new_tree_body = new_tree.children[2]

		const patches_head = diff(this.target_tree_head, new_tree_head)
		const patches_body = diff(this.target_tree_body, new_tree_body)

		console.log('Page.render_html:new_tree_body', new_tree_body)
		console.log('Page.render_html:patches_body', patches_body)

		this.target_node_head = patch(this.target_node_head, patches_head)
		this.target_node_body = patch(this.target_node_body, patches_body)

		this.target_tree_head = new_tree_head
		this.target_tree_body = new_tree_body

		console.log('Page.render_html:target_node_body', this.target_node_body)
		// console.log('Page.render_html:target_tree_body', this.target_tree_body)
		
		// $(document.body).html(arg_html)
	}
}
