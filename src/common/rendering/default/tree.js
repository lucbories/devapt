
import T from 'typr'
import assert from 'assert'

import { render_node } from '../base/render_tree'

import Component from '../base/component'



const context = 'common/rendering/default/tree'


export default class Tree extends Component
{
	constructor(arg_name, arg_settings)
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
        // const jquery_url = // TODO
		// arg_settings.page_scripts_urls = ["http://localhost:8081/assets/js/vendor/foundation/jquery.js"]
		arg_settings.page_scripts_urls = ["js/vendor/foundation/jquery.js"]
		
		super(arg_name, arg_settings)
		
		this.$type = 'Tree'
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
		
		return '<div id="' + this.get_dom_id() + '">' + render_node(this.state.tree, 1, this.state.label) + '</div>'
	}
}