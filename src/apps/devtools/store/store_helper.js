
import T from 'typr'
import assert from 'assert'

import { store, config } from '../../../common/store/index'
import runtime from '../../../common/base/runtime'
import logs from '../../../common/utils/logs'

// import { render_node } from '../lib/render_tree'
// import { html_tree_template } from '../lib/html_template'
import Render from '../../../common/rendering/render'
// const Render = require('../../../common/rendering/render')

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
		`<a href="/${arg_app_url}/store/config/nodes/">Config Nodes</a>`,
		`<a href="/${arg_app_url}/store/config/services/">Config Services</a>`,
		
		`<a href="/${arg_app_url}/store/runtime/">Runtime</a>`,
		`<a href="/${arg_app_url}/metrics/">Metrics</a>`
	]
}


export default function make_middleware(arg_collection, arg_label, arg_title, arg_sub_collection)
{
	return function(req, res)
	{
		assert( T.isString(arg_collection) || T.isArray(arg_collection), context + ':bad collection string|array')
		assert( T.isString(arg_label), context + ':bad label string')
		assert( T.isString(arg_title), context + ':bad title string')
		
		let map = null
        
        if ( T.isString(arg_collection) )
        {
            logs.debug('given collection path is a string', arg_collection)
            map = arg_collection == '*' ? config() : config().get(arg_collection)
        }
        else if ( T.isArray(arg_collection) )
        {
            logs.debug('given collection path is an array', arg_collection)
            map = config().getIn(arg_collection)
        }
        else
        {
            logs.error('bad given collection path, not an array, not a string', arg_collection)
        }
        assert( T.isObject(map), context + ':bad collection map object for [' + arg_collection + ']')
        
        let state = map.toJS()
		assert( T.isObject(state), context + ':bad state object')
        
		if (T.isArray(arg_collection))
		{
			assert( T.isString(arg_sub_collection), context + ':bad sub collection string')
			
			let selection = {}
			
			const names = Object.keys(state)
			for(let name of names)
			{
				const resource = state[name]
                // console.log('resource type', resource.type, arg_sub_collection)
                
				if ( resource && resource.type && (resource.type == arg_sub_collection || arg_sub_collection == '*') )
				{
					selection[name] = resource
				}
			}
			
			state = selection
		}
		
		const get_script2 = `
			// let runtime = require('http://localhost:8080/assets/../../../common/base/runtime')
			
			// let svc = runtime.services.find_by_name('devtools_panel')
			// let consumer = svc.create_consumer()
			// console.log(consumer, 'consumer')
			
			// let result1 = consumer.consume()
			// console.log(result1, 'result1')
			
			// let result2 = consumer.consume({route:'/store/config/resources'})
			// console.log(result2, 'result2')
		`
		
		const html = new Render('html_assets_1', 'html_assets_1', 'html_assets_1')
			.page('main', {label:'Devapt Devtools - Store / Config / ' + arg_title})
				.hbox('menus', null, {items:get_menu_anchors('devtools'), label:'Devtools'})
					.up()
				// .vbox('content', null, {label:'content'})
					.button('button1', null, {label:'mybutton', action_url:'myurl'})
						.up()
					.tree('config', null, {tree:state, label:arg_label})
						.up()
				// .up()
			.script('test', {
					page_scripts:[get_script2],
					page_scripts_urls:[/*'http://localhost:8080/assets/js/vendor/require.js',*/ 'js/vendor/browser.min.js'] }, null)
				.up()
			.render()
		
		res.send(html)
	}
}
