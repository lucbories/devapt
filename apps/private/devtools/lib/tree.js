
import T from 'typr'
import assert from 'assert'

import { render_node } from '../lib/render_tree'

import Component from './component'



const context = 'apps/devtools/lib/tree'


export default class Tree extends Component
{
	constructor(arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : {}
		
		arg_settings.page_styles = [
					'#content      { margin-left: 50px; }',
					'.node         { cursor: default; }',
					'.node_a       { position: relative; cursor: pointer; }',
					'.node_content { margin-left: 10px; }',
					'.node_opened  { position: absolute;left: -0.7em; }',
					'.node_closed  { position: absolute;left: -0.7em; }']
		
		arg_settings.page_headers = ['<meta keywords="tree" />']
		arg_settings.page_scripts = [`
			$('.node_closed').hide()
			$('a.node_a').click(
				function(ev)
				{
					var node = $(ev.currentTarget).parent();
					
					$('div.node_content', node).toggle()
					$('span.node_opened', node).toggle()
					$('span.node_closed', node).toggle()
				}
			)`]
		arg_settings.page_scripts_urls = ["http://localhost:8080/assets/js/vendor/jquery.js"]
		
		super(arg_settings)
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			// page_headers:['<meta keywords="tree" />'],
			// page_styles:[
			// 		'#content      { margin-left: 50px; }',
			// 		'.node         { cursor: default; }',
			// 		'.node_a       { position: relative; cursor: pointer; }',
			// 		'.node_content { margin-left: 10px; }',
			// 		'.node_opened  { position: absolute;left: -0.7em; }',
			// 		'.node_closed  { position: absolute;left: -0.7em; }'],
			// page_scripts:[],
			
			tree:{},
			label:"no label"
		}
	}
	
	
	// RENDERING
	render()
	{
		assert( T.isObject(this.state), context + ':bad state object')
		assert( T.isObject(this.state.tree), context + ':bad state tree object')
		assert( T.isString(this.state.label), context + ':bad state label string')
		
		return render_node(this.state.tree, 1, this.state.label)
	}
}
