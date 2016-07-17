
import T from 'typr'
import assert from 'assert'

import Container from '../base/container'


const context = 'common/rendering/default/tabs'



export default class Tabs extends Container
{
	constructor(arg_name, arg_settings)
	{
		// UPDATE SETTINGS
		arg_settings = Container.normalize_settings(arg_settings)
		const animation_delay = 0
		const contents_id = arg_name + '_contents'
		const func_name = arg_name + '_on_tab_click'
		const func1 = `
		function ${func_name}(arg_tab_label_id, arg_tab_content_id)
		{
			$("#" + arg_tab_label_id).fadeToggle()
			setTimeout( function() { $("#" + arg_tab_label_id).fadeToggle() }, ${animation_delay})
			
			$(".tabs_content", "#${contents_id}").hide()
			$("#" + arg_tab_content_id).show()
		}
		`
		arg_settings.scripts.push(func1)
		
		super(arg_name, arg_settings)
		
		this.$type = 'Tabs'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			items: [],
			label:'no label'
		}
	}
	
	
	// RENDERING
	render_main()
	{
		console.log(context + ':render_main:children count=%i, state.items.count=%i', this.get_children().length, this.state.items.length)
		
		assert( T.isObject(this.state), context + ':render_main:bad state object')
		assert( T.isArray(this.state.items), context + ':render_main:bad state items array')
		assert( T.isString(this.state.label), context + ':render_main:bad state label string')
		
		const func_name = this.get_name() + '_on_tab_click'
		const tab_labels_id = this.get_name() + '_labels'
		const tab_contents_id = this.get_name() + '_contents'
		
		let html_tabs_labels = `<table id="${tab_labels_id}"><thead><tr>`
		let html_tabs_contents = `<div id="${tab_contents_id}">\n`
		
		this.state.items.forEach(
			(tab_cfg, index) => {
				if ( T.isObject(tab_cfg) && T.isString(tab_cfg.label) )
				{
					
					const tab_label_id = this.get_name() + '_tab_label_' + index
					const tab_label_value = tab_cfg.label ? tab_cfg.label : '- ' + index + ' -'
					
					const tab_content_id = this.get_name() + '_tab_content_' + index
					const tab_content_value = this.render_tab_content(tab_cfg)
					const js = `onclick="${func_name}('${tab_label_id}', '${tab_content_id}')"`
					const display = index == 0 ? 'block' : 'none'
					
					html_tabs_labels += `<th id="${tab_label_id}" ${js}>${tab_label_value}</th>`
					html_tabs_contents += `<div id="${tab_content_id}" style="display:${display};" class="tabs_content">\n${tab_content_value}\n</div>\n`
				}
				else
				{
					console.error(context + ':render:bad tabs item object')
				}
			}
		)
		html_tabs_labels += '</tr></thead></table>\n'
		html_tabs_contents += '</div>\n'
		
		return html_tabs_labels + html_tabs_contents
	}
	
	
	
	/**
	 * Render a tab child.
	 * 
	 * Tab settings :
	 * 	{ content_html:'...' } for a tab with a HTML content.
	 * 	{ content_view:'...' } for a tab with a Component.
	 * 
	 * @param {object} arg_tab_cfg - tab settings
	 * 
	 * @returns {string} - html rendering string
	 */
	render_tab_content(arg_tab_cfg)
	{
		assert( T.isObject(arg_tab_cfg), context + ':render_tab_content:bad tab cfg object')
		
		// HTML CONTENT
		if ( T.isString(arg_tab_cfg.content_html) )
		{
			return arg_tab_cfg.content_html
		}
		
		// VIEW
		if ( T.isString(arg_tab_cfg.content_view) )
		{
			// CREATE A VIEW
			if ( ! this.has_child(arg_tab_cfg.content_view) )
			{
				this.create_and_add_child(arg_tab_cfg.content_view)
			}
			
			const view = this.get_child(arg_tab_cfg.content_view)
			
			if ( ! T.isObject(view) || ! view.is_component )
			{
				return ''
			}
			
			return view.render()
		}
		
		return ''
	}
}
