
import T from 'typr'
import assert from 'assert'

import runtime from '../../base/runtime'
import HBox from './hbox'



const context = 'common/rendering/default/menubar'


export default class Menubar extends HBox
{
	constructor(arg_name, arg_settings)
	{
		if ( arg_settings && T.isObject(arg_settings.state) && T.isArray(arg_settings.state.items) )
		{
			let urls = []
			arg_settings.state.items.forEach(
				function(value)
				{
					const url = runtime.context.get_url_with_credentials(arg_settings.state.app_url + value.url, arg_settings.state.request)
					const anchor =  '<a href="/' + url + '">' + value.label + '</a>\n'
					urls.push(anchor)
				}
			)
			console.log(urls, 'Menubar: urls')
			arg_settings.state.items = urls
		}
		
		super(arg_name, arg_settings)
		
		this.$type = 'Menubar'
	}
}