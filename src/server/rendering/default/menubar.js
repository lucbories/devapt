
import T from 'typr'
// import assert from 'assert'

import runtime from '../../base/runtime'
import HBox from './hbox'



// const context = 'common/rendering/default/menubar'


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
					// MENU ITEM IS A COMMAND NAME ?
					// if ( T.isString(value) )
					// {
					// 	const credentials = this.renderer.request.devapt_credentials
					// const defined_topology = devapt.runtime.get_defined_topology()
					// const application = defined_topology.find_application_with_credentials(credentials)
					// 	if(! application)
					// 	{
					// 		console.error('application not found [' + application_name + ']')
					// 		return
					// 	}

					// 	const cmd = application.find_resource(value, 'commands')
					// 	if ( T.isObject(cmd) )
					// 	{
					// 		value = {
					// 			url: cmd.command_url,
					// 			view: cmd.command_view,
					// 			menubar: cmd.command_menubar,
					// 			label: cmd.command_label
					// 		}
					// 	}
					// }

					if ( T.isObject(value) && T.isString(value.label) )
					{
						if ( T.isString(value.view) )
						{
							const url = arg_settings.state.app_url
							const anchor =  '<a href="#" class="menu_onclick" data-view="' + value.view + '" data-app_url="' + app_url + '">' + value.label + '</a>\n'
							urls.push(anchor)
							return
						}

						if ( T.isString(value.url) )
						{
							const url = runtime.context.get_url_with_credentials(arg_settings.state.app_url + value.url, this.renderer.request)
							const anchor =  '<a href="#' + url + '" target="_blank">' + value.label + '</a>\n'
							urls.push(anchor)
						}
					}
				}
			)

			console.log(urls, 'Menubar: urls')
			arg_settings.state.items = urls
		}
		
		arg_settings.scripts = [`
			$('a.menu_onclick').click(
				function(ev)
				{
					var menu = $(ev.currentTarget);
					var router = window.devapt().runtime().router()
					var view_name = menu.data('view')
					router.display_content(view_name, undefined)
				}
			)
		`]
		
		super(arg_name, arg_settings)
		
		this.$type = 'Menubar'
	}
}