
import T from 'typr'
import assert from 'assert'

import Container from '../base/container'



const context = 'common/rendering/default/table_base'


export default class TableBase extends Container
{
	constructor(arg_name, arg_settings)
	{
		super(arg_name, arg_settings)
		
		this.$type = 'Table'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			type:'Table',
			max_rows:1000,
			items: []
		}
	}
	
	
	
	/**
	 * Render table header.
	 * 
	 * @returns {string} - html
	 */
	render_thead()
	{
		// console.info(context + ':render_thead')
		
		if (! this.state)
		{
			return '<thead></thead>'
		}
		
		this.state.headers = this.state.headers ? this.state.headers : []
		
		if (this.state.headers.length == 0)
		{
			if (this.state.items.length == 0)
			{
				return '<thead></thead>'
			}
			
			const row = this.state.items[0]
			if ( ! T.isObject(row) )
			{
				return '<thead></thead>'
			}
			
			this.state.headers = this.state.headers ? this.state.headers : []
			const keys = Object.keys(row)
			for(let key of keys)
			{
				const value = row[key]
				this.state.headers.push(value)
			}
		}
		
		if (this.state.headers.length == 0)
		{
			return '<thead></thead>'
		}
		
		const html_thead_content = this.render_thead_content()
		
		return `<thead>\n${html_thead_content}</thead>\n`
	}
	
	
	/**
	 * Render table header content.
	 * 
	 * @returns {string} - html
	 */
	render_thead_content()
	{
		let html_thead_content = ''
		for(let i = 0 ; i < this.state.headers.length ; i++)
		{
			html_thead_content += this.render_thead_item( this.state.headers[i] )
		}
		return html_thead_content
	}
	
	
	
	/**
	 * Render table header item.
	 * 
	 * @param {string} arg_item - header item.
	 * 
	 * @returns {string} - html
	 */
	render_thead_item(arg_item)
	{
		return '<th>' + (T.isString(arg_item) ? arg_item : arg_item.toString()) + '</th>'
	}
	
	
	
	/**
	 * Render table body.
	 * 
	 * @returns {string} - html
	 */
	render_tbody()
	{
		// console.info(context + ':render_tbody')
		
		let html_tbody_content = ''
		
		// BUILD HTML ROWS
		const max = T.isNumber(this.state.max_rows) ? Math.min(this.state.max_rows, this.state.items.length) : this.state.items.length
		for(let i = 0 ; i < max ; i++)
		{
			const row = this.state.items[i]
			html_tbody_content += this.render_tbody_row(i, row)
		}
		
		return `<tbody>\n${html_tbody_content}</tbody/>\n`
	}
	
	
	
	/**
	 * Render table body row.
	 * 
	 * @param {number} arg_index - body row index.
	 * @param {string} arg_row - body row html.
	 * 
	 * @returns {string} - html
	 */
	render_tbody_row(arg_index, arg_row)
	{
		// console.log('render_tbody_row:index=%s row=%s', arg_index, arg_row)

		let row_content = ''
		const row_id = this.get_dom_id() + '_body_row_' + arg_index
		
		if ( T.isObject(arg_row) )
		{
			const keys = Object.keys(arg_row)
			for(let key of keys)
			{
				const value = arg_row[key]
				// row_content += '<td id="' + this.get_dom_id() + '_' + key + '">' + value + '</td>\n'
				row_content += this.render_tbody_item(value, this.get_dom_id() + '_' + key)
			}
		}
		else if ( T.isArray(arg_row) )
		{
			for(let i = 0 ; i < arg_row.length ; i++)
			{
				const value = arg_row[i]
				// row_content += '<td id="' + row_id + '_column_' + i + '">' + value + '</td>\n'
				row_content += this.render_tbody_item(value, row_id + '_column_' + i)
			}
		}
		
		return '<tr id="' + row_id + '">' + row_content + '</tr>'
	}
	
	
	
	/**
	 * Render table body item.
	 * 
	 * @param {string|object} arg_item - body row item.
	 * @param {string} arg_item_id - body row item id.
	 * 
	 * @returns {string} - html
	 */
	render_tbody_item(arg_item, arg_item_id)
	{
		// console.log('render_tbody_item:id=%s item=', arg_item_id, arg_item)
		
		let item_id = arg_item_id
		let item_value = arg_item

		// ITEM IS A RECORD WITH A KEY AND A VALUE
		if ( T.isObject(arg_item) && T.isString(arg_item.key) )
		{
			item_id = this.get_dom_id() + '_' + arg_item.key
			item_value = arg_item.value
		}

		let html = T.isString(item_value) ? item_value : undefined

		if ( T.isObject(item_value) )
		{
			if ( T.isString(item_value.view) )
			{
				let view = undefined
				if ( ! this.has_child(item_value.view))
				{
					this.create_and_add_child(item_value.view)
				}
				view = this.get_child(item_value.view)
				// console.log('render_tbody_item:id=%s view=%s', arg_item_id, arg_item.view, view)
				html = view.render()
			}
		}

		if ( ! html)
		{
			html = item_value.toString()
		}
		
		return '<td id="' + item_id + '">' + html + '</td>\n'
	}
	
	
	
	/**
	 * Render table footer.
	 * 
	 * @returns {string} - html
	 */
	render_tfoot()
	{
		// console.info(context + ':render_tfoot')
		
		let html_tfoot_content = ''
		return `<tfoot>\n${html_tfoot_content}</tfoot/>`
	}
	
	
	
	/**
	 * Render table.
	 * 
	 * @returns {string} - html
	 */
	render_main()
	{
		// console.info(context + ':render_main')
		
		assert( T.isObject(this.state), context + ':render:bad state object')
		assert( T.isArray(this.state.headers), context + ':render:bad state headers array')
		assert( T.isArray(this.state.items), context + ':render:bad state items array')
		
		// GET ATTRIBUTES
		const css_class1 = T.isString(this.state.css_class) ? this.state.css_class : undefined
		const css_class2 = this.get_css_classes_for_tag('button')
		const css_class = (css_class1 ? css_class1 + ' ' : '') + (css_class2 ? css_class2 : '')
		
		const css_attributes1 = T.isString(this.state.css_attributes) ? this.state.css_attributes : undefined
		const css_attributes2 = this.get_css_attributes_for_tag('button')
		const css_attributes = (css_attributes1 ? css_attributes1 + ' ' : '') + (css_class2 ? css_attributes2 : '')
		
		// BUILD HTML ELEMENT
		const html_id = 'id="' + this.get_dom_id() + '"'
		const html_css_class = (css_class && css_class != '') ? `class="${css_class}"` : ''
		const html_css_attributes = (css_attributes && css_attributes != '') ? `class="${css_attributes}"` : ''
		
		const html_thead = this.render_thead()
		const html_tbody = this.render_tbody()
		const html_tfoot = this.render_tfoot()
		
		const html = `<table ${html_id} ${html_css_class} ${html_css_attributes}>\n${html_thead}\n${html_tbody}\n${html_tfoot}\n</table>\n`
		// console.info(context + ':render:html', html)
		
		return html
	}
}
