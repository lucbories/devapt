
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../../../../common/store/index'

import { render_node } from '../lib/render_tree'
import { html_tree_template } from '../lib/html_template'



export default function middleware(req, res)
{
	const state = config().getIn(['resources', 'by_name']).toJS()
	let selection = {}
	const names = Object.keys(state)
	for(let name of names)
	{
		const resource = state[name]
		if (resource && resource.type && resource.type == 'models')
		{
			selection[name] = resource
		}
	}
	
	let html_content = render_node(selection, 1, 'models')
	
	
	const html = html_tree_template(html_content, 'Devapt Devtools - Store / Config / Models')
	
	res.send(html)
}
