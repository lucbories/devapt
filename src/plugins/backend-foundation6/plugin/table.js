
import T from 'typr'
import assert from 'assert'

import DefaultTable from '../../../common/rendering/default/table'



const context = 'plugins/backend-foundation6/plugin/table'


export default class Table extends DefaultTable
{
	constructor(arg_name, arg_settings)
	{
        super(arg_name, arg_settings)
		
        // this.set_css_classes_for_tag('table', 'f6_table', false)
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			headers: [],
			items: [],
            
            page_scripts_urls:['plugins/foundation6/js/vendor/jquery.min.js', 'plugins/foundation6/js/app.js', 'plugins/foundation6/js/foundation.js'],
            
			label:'no label'
		}
	}
}
