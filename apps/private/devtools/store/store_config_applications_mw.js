
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../../../../common/store/index'

// import { render_node } from '../lib/render_tree'
// import { html_tree_template } from '../lib/html_template'
import Tree from '../lib/tree'
import Page from '../lib/page'



export default function middleware(req, res)
{
	const state = config().get('applications').toJS()
	
	
	// DEFINE TREE COMPONENT
	const tree_state = { tree:state, label:'applications'}
	let component = new Tree({state:tree_state})
	
	// DEFINE PAGE COMPONENT
	const page_settings = {
		children:[component],
		label:'Devapt Devtools - Store / Config / Applications'
	}
	let page = new Page(page_settings)
	
	// RENDER PAGE
	const html = page.render()
	
	// let html_content = render_node(state, 1, 'applications')
	
	
	// const html = html_tree_template(html_content, 'Devapt Devtools - Store / Config / Applications')
	
	res.send(html)
}
