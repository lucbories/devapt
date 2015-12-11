
import T from 'typr'
import assert from 'assert'

import Component from '../base/component'



const context = 'common/rendering/default/script'


export default class Script extends Component
{
	constructor(arg_name, arg_settings)
	{
		arg_settings = T.isObject(arg_settings) ? arg_settings : {}
		
		arg_settings.page_styles = []
		
		arg_settings.page_headers = ['<meta keywords="script" />']
		
		super(arg_name, arg_settings)
		
		this.$type = 'Script'
	}
	
	
	// MUTABLE STATE
	get_initial_state()
	{
		return {}
	}
	
	
	// RENDERING
	render()
	{
		return ''
	}
}
