// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'

// SERVER IMPORTS
import TableBase from './table_base'


// const context = 'common/rendering/default/table'



export default class Table extends TableBase
{
	/**
	 * Create a Table rendering component.
	 * 
	 * @param {string} arg_name - component name.
	 * @param {object} arg_settings - component settings.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_name, arg_settings)
	{
		super(arg_name, arg_settings)
		
		this.$type = 'Table'
	}
	
	
	
	/**
	 * Get initial state.
	 * 
	 * @returns {string} - html
	 */
	get_initial_state()
	{
		return {
			headers: [],
			items: [],
			label:'no label',
			type:'Table',
			show_label:true,
			show_headers:true
		}
	}
	
	
	
	/**
	 * Render table header.
	 * 
	 * @returns {string} - html
	 */
	render_thead_content()
	{
		let thead_content = ''
		if (this.state.show_label)
		{
			thead_content += '<tr><th>' + this.state.label + '</th></tr>'
		}
		
		if ( T.isBoolean(this.state.show_headers) && ! this.state.show_headers)
		{
			return thead_content
		}
		
		thead_content += super.render_thead_content()
		return thead_content
	}
}
