
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../../../../common/store/index'

import { render_node } from '../lib/render_tree'
import { html_tree_template } from '../lib/html_template'



export default function middleware(req, res)
{
	const state = config().get('modules').toJS()
	
	
	let html_content = render_node(state, 1, 'modules')
	
	
	const html = html_tree_template(html_content, 'Devapt Devtools - Store / Config / Modules')
	
	res.send(html)
}
