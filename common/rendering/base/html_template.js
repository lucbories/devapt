
import T from 'typr'
import assert from 'assert'


function render_menu(arg_app_url)
{
	return `
		<a href="/${arg_app_url}/store/config/all/">Config All</a>
		<a href="/${arg_app_url}/store/config/applications/">Config Applications</a>
		
		<a href="/${arg_app_url}/store/config/resources/">Config Resources</a>
		<a href="/${arg_app_url}/store/config/views/">Config Views</a>
		<a href="/${arg_app_url}/store/config/models/">Config Models</a>
		<a href="/${arg_app_url}/store/config/menubars/">Config Menubars</a>
		<a href="/${arg_app_url}/store/config/menus/">Config Menus</a>
		
		<a href="/${arg_app_url}/store/config/modules/">Config Modules</a>
		<a href="/${arg_app_url}/store/config/plugins/">Config Plugins</a>
		<a href="/${arg_app_url}/store/config/servers/">Config Servers</a>
		<a href="/${arg_app_url}/store/config/services/">Config Services</a>
		
		<a href="/${arg_app_url}/store/runtime/">Runtime</a>
	`
}


export function html_template(arg_html_content, arg_html_title, arg_html_styles, arg_html_js)
{
	const html = `
		<html lang="en-us">
			<head>
				<meta charSet="utf-8"/>
				<title>${arg_html_title}</title>
				
				<style type='text/css'>
					${arg_html_styles}
				</style>
			</head>
			
			<body>
				<div id="content">
					${arg_html_content}
				</div>
				<script type="text/javascript" src="http://localhost:8080/assets/js/vendor/jquery.js"> </script>
				
				<script type="text/javascript">
					${arg_html_js}
				</script>
			</body>
		</html>`
	
	return '<!doctype html>\n' + html
}


export function html_tree_template(html_content, arg_html_title)
{
	const html_menu = render_menu('devtools')
	const html = `
		<html lang="en-us">
			<head>
				<meta charSet="utf-8"/>
				<title>${arg_html_title}</title>
				
				<style type='text/css'>
					#content      { margin-left: 50px; }
					.node         { cursor: default; }
					.node_a       { position: relative; cursor: pointer; }
					.node_content { margin-left: 10px; }
					.node_opened  { position: absolute;left: -0.7em; }
					.node_closed  { position: absolute;left: -0.7em; }
				</style>
			</head>
			
			<body>
				<div id="menu">
					${html_menu}
				</div>
				<div id="content">
					${html_content}
				</div>
				<script type="text/javascript" src="http://localhost:8080/assets/js/vendor/jquery.js"> </script>
				
				<script type="text/javascript">
					$('.node_closed').hide()
					$('a.node_a').click(
						function(ev)
						{
							var node = $(ev.currentTarget).parent();
							
							$('div.node_content', node).toggle()
							$('span.node_opened', node).toggle()
							$('span.node_closed', node).toggle()
						}
					)
				</script>
			</body>
		</html>`
	
	return '<!doctype html>\n' + html
}

/*
export function html_table_template(arg_array, arg_html_title)
{
	assert( T.isArray(arg_array), 'html_table_template:bad array')
	
	// BUILD HTML ROWS
	let html_rows = ''
	let html_head = ''
	let html_head_filled = false
	let i = 0
	let row = null
	for( ; i < arg_array.length ; i++)
	{
		html_rows += '<tr>'
		row = arg_array[i]
		
		if (T.isObject(row))
		{
			const keys = Object.keys(row)
			for(let key of keys)
			{
				const value = row[key]
				if (! html_head_filled)
				{
					html_head += '<th>' + key + '</th>'
				}
				
				html_rows += '<td>' + value + '</td>'
			}
			
			if (! html_head_filled && html_head != '')
			{
				html_head_filled = true
			}
		}
		
		html_rows += '</tr>'
	}
	
	// BUILD HTML TABLE
	let html_table = '<table><thead>' + html_head + '<thead>'
	html_table += html_rows
	html_table += '<tfoot></tfoot></table>'
	
	return html_template(html_table, arg_html_title, '', '')
}*/



export default { html_template, html_tree_template }