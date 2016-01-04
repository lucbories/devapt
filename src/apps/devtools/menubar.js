
export default function get_menubar_anchors(arg_app_url)
{
    return [
		`<a href="/${arg_app_url}/store/config/all/">Config All</a>`,
		`<a href="/${arg_app_url}/store/config/applications/">Config Applications</a>`,
		
		`<a href="/${arg_app_url}/store/config/resources/">Config Resources</a>`,
		`<a href="/${arg_app_url}/store/config/views/">Config Views</a>`,
		`<a href="/${arg_app_url}/store/config/models/">Config Models</a>`,
		`<a href="/${arg_app_url}/store/config/menubars/">Config Menubars</a>`,
		`<a href="/${arg_app_url}/store/config/menus/">Config Menus</a>`,
		
		`<a href="/${arg_app_url}/store/config/modules/">Config Modules</a>`,
		`<a href="/${arg_app_url}/store/config/plugins/">Config Plugins</a>`,
		`<a href="/${arg_app_url}/store/config/nodes/">Config Nodes</a>`,
		`<a href="/${arg_app_url}/store/config/services/">Config Services</a>`,
		
		`<a href="/${arg_app_url}/store/runtime/">Runtime</a>`,
		`<a href="/${arg_app_url}/metrics/">Metrics</a>`
	]
}
