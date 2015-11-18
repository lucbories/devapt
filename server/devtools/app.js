
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../../common/store/index'



const MAX_DEPTH = 15


function render_safe_string(arg_value)
{
	return arg_value ? arg_value.toString().replace('<li>', '!lia!').replace('</li>', '!lib!').replace('<ul>', '!ula!').replace('</ul>', '!ulb!').replace('<', '!aaa!').replace('>', '!bbb!') : arg_value
}

function render_node(arg_value, arg_depth, arg_label)
{
	arg_depth = arg_depth ? arg_depth : 1
	arg_label = arg_label == 0 ? '0' : arg_label
	arg_label = arg_label ? arg_label : 'no name'
	
	if (arg_depth > MAX_DEPTH)
	{
		console.log('MAX DEPTH ${MAX_DEPTH} is reached')
		return `<p>MAX DEPTH ${MAX_DEPTH} is reached</p>\n`
	}
	if (T.isString(arg_value))
	{
		arg_value = render_safe_string(arg_label) + '=' + render_safe_string(arg_value)
		// console.log('<p>${arg_value}<p>')
		return `<span>${arg_value}</span>\n`
	}
	if (T.isNumber(arg_value))
	{
		// console.log('<p>${arg_value}<p>')
		return render_safe_string(arg_label) + '=' + `<span>${arg_value}</span>\n`
	}
	
	if (T.isBoolean(arg_value))
	{
		// console.log('<p>${value}<p>')
		const value = arg_value ? 'true' : 'false'
		return render_safe_string(arg_label) + '=' + `<span>${value}</span>\n`
	}
	
	if (T.isArray(arg_value))
	{
		// console.log('value is an array')
		if (arg_value.length == 0)
		{
			return render_safe_string(arg_label) + '=' + '[]'
		}
		
		if (arg_value.length == 1)
		{
			return render_safe_string(arg_label) + '=' + '[' + render_node(arg_value[0], arg_depth + 1, '0') + ']'
		}
		
		let str = '<div><a class="node">' + render_safe_string(arg_label) + '</a><ul>'
		try
		{
			arg_value.forEach( (value, index) =>
				{
					str += '<li>' + render_node(value, arg_depth + 1, index) + '</li>\n'
				}
			)
		}
		catch(e)
		{
		}
		return str + '</ul></div>\n'
	}
	
	if (T.isObject(arg_value))
	{
		// console.log('value is an object')
		let str = '<div><a class="node">' + render_safe_string(arg_label) + '</a><ul>'
		try
		{
			Object.keys(arg_value).forEach( key =>
				{
					str += `<li>` + render_node(arg_value[key], arg_depth + 1, key) + '</li>\n'
				}
			)
		}
		catch(e)
		{
		}
		return str + '</ul></div>\n'
	}
	
	
	console.log(arg_value, 'value is unknow')
	return '<p>unknow node of type [' + (typeof arg_value) + ']</p>\n'
}


export default function middleware(req, res)
{
	const state = config().toJS()
	
	
	let html_content = render_node(state, 1, 'state')
	
	
	
	const html = `
		<html lang="en-us">
			<head>
				<meta charSet="utf-8"/>
				<title>Devapt Devtools</title>
			</head>
			
			<body>
				<div id="content">
					${html_content}
				</div>
				<script type="text/javascript" src="http://localhost:8080/assets/js/vendor/jquery.js"> </script>
				
				<script type="text/javascript">
					$('a.node').click(
						function(ev)
						{
							console.log(ev, 'ev');
							var div = $(ev.currentTarget).parent();
							div.children('div, ul, span').toggle()
						}
					)
				</script>
			</body>
		</html>`
	
	res.send('<!doctype html>\n' + html)
}
