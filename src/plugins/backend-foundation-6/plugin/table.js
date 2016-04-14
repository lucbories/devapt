
// import T from 'typr'
// import assert from 'assert'

import DefaultTable from '../../../common/rendering/default/table'



// const context = 'plugins/backend-foundation6/plugin/table'


export default class Table extends DefaultTable
{
	constructor(arg_name, arg_settings)
	{
		super(arg_name, arg_settings)
		
		this.set_css_classes_for_tag('table', 'f6_table', false)
		
		const scripts_urls = [
			'plugins/foundation-6/js/vendor/jquery.min.js',
			'plugins/foundation-6/js/foundation.js',
			'plugins/foundation-6/js/app.js']
		this.add_scripts_urls(scripts_urls)
		
		const styles_urls = [
			'plugins/foundation-6/css/foundation.min.css',
			'plugins/foundation-6/css/app.css']
		this.add_styles_urls(styles_urls)
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			headers: [],
			items: [],
            
			label:'no label'
		}
	}
}
