
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../../../../common/store/index'

// import { render_node } from '../lib/render_tree'
// import { html_tree_template } from '../lib/html_template'
import Render from '../../../../common/rendering/render'


const context = 'apps/private/devtools/store/store_helper'


function get_menu_anchors(arg_app_url)
{
	return [
		`<a href="/${arg_app_url}/store/config/all/">Config All</a>`,
		`<a href="/${arg_app_url}/store/config/applications/">Config Applications</a>`,
		
		`<a href="/${arg_app_url}/store/config/resources/">Config Resources</a>`,
		`<a href="/${arg_app_url}/store/config/views/">Config Views</a>`,
		`<a href="/${arg_app_url}/store/config/models/">Config Models</a>`,
		`<a href="/${arg_app_url}/store/config/menubars/">Config Menubars</a>`,
		`<a href="/${arg_app_url}/store/config/menus/">Config Menus</a>`,
		
		`<a href="/${arg_app_url}/store/config/modules/">Config Modules</a>`,
		`<a href="/${arg_app_url}/store/config/plugins/">Config Plugins</a>`,
		`<a href="/${arg_app_url}/store/config/servers/">Config Servers</a>`,
		`<a href="/${arg_app_url}/store/config/services/">Config Services</a>`,
		
		`<a href="/${arg_app_url}/store/runtime/">Runtime</a>`
	]
}


export default function make_middleware(arg_collection, arg_label, arg_title, arg_sub_collection)
{
	return function(req, res)
	{
		assert( T.isString(arg_collection) || T.isArray(arg_collection), context + ':bad collection string|array')
		assert( T.isString(arg_label), context + ':bad label string')
		assert( T.isString(arg_title), context + ':bad title string')
		
		let state = T.isString(arg_collection) ? config().get(arg_collection).toJS() : config().getIn(arg_collection).toJS()
		assert( T.isObject(state), context + ':bad state object')
		
		if (T.isArray(arg_collection))
		{
			assert( T.isString(arg_sub_collection), context + ':bad sub collection string')
			
			let selection = {}
			
			const names = Object.keys(state)
			for(let name of names)
			{
				const resource = state[name]
				if (resource && resource.type && resource.type == arg_sub_collection)
				{
					selection[name] = resource
				}
			}
			
			state = selection
		}
		
		const html = new Render()
			.page({label:'Devapt Devtools - Store / Config / ' + arg_title})
			.hbox(null, {items:get_menu_anchors('devtools'), label:'menu'})
			.up()
			.tree(null, {tree:state, label:arg_label})
			.up()
			.render()
		
		res.send(html)
	}
}
