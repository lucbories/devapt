// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'

// SERVER IMPORTS
import Table from './table'


// const context = 'common/rendering/default/table'



export default class TableTree extends Table
{
	constructor(arg_name, arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : { state: { headers:[], label:'', items:[], tree:{} } }

		// PB: WORK ONLY ON SERVER RENDERING
		// arg_settings.styles = []
		// arg_settings.headers = ['<meta keywords="table_tree" />']
		// arg_settings.scripts = []
		
		super(arg_name, arg_settings)
		
		this.$type = 'TableTree'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {
			tree:{},
			label:'no label',
			headers:[],
			items:[],
			show_label:true,
			show_headers:false
		}
	}
}
