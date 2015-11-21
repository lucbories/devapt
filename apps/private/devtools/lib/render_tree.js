
import T from 'typr'
import assert from 'assert'



const MAX_DEPTH = 15


function render_safe_string(arg_value)
{
	arg_value = arg_value.replace('<script>', 'AscriptB').replace('A/scriptB', '\A/script\B')
	if (arg_value.indexOf('<') > -1)
	{
		return `<code>${arg_value}</code>`
	}
	
	return arg_value ? arg_value.toString().replace('<li>', '!lia!').replace('</li>', '!lib!').replace('<ul>', '!ula!').replace('</ul>', '!ulb!').replace('<', '!aaa!').replace('>', '!bbb!') : arg_value
}


function render_expandable_node(arg_label, arg_content)
{
	let str = '<div class="node"><a class="node_a">'
	str += '<span class="node_closed">\u25B9</span><span class="node_opened">\u25BF</span>'
	str += '<b>' + render_safe_string(arg_label) + '</b>'
	str += '</a><div class="node_content">'
	str += render_safe_string(arg_content)
	return str + '</div></div>'
}


export function render_node(arg_value, arg_depth, arg_label)
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
		return `<span>${arg_value}</span>\n`
	}
	
	if (T.isNumber(arg_value))
	{
		return render_safe_string(arg_label) + '=' + `<span>${arg_value}</span>\n`
	}
	
	if (T.isBoolean(arg_value))
	{
		const value = arg_value ? 'true' : 'false'
		return render_safe_string(arg_label) + '=' + `<span>${value}</span>\n`
	}
	
	if (T.isArray(arg_value))
	{
		if (arg_value.length == 0)
		{
			return render_safe_string(arg_label) + '=' + '[]'
		}
		
		if (arg_value.length == 1)
		{
			return render_safe_string(arg_label) + '=' + '[' + render_node(arg_value[0], arg_depth + 1, '0') + ']'
		}
		
		let str = ''
		try
		{
			arg_value.forEach( (value, index) =>
				{
					str += '<div>' + render_node(value, arg_depth + 1, index) + '</div>\n'
				}
			)
		}
		catch(e)
		{
		}
		return render_expandable_node(arg_label, str)
	}
	
	if (T.isObject(arg_value))
	{
		let str = ''
		try
		{
			Object.keys(arg_value).forEach( key =>
				{
					str += `<div>` + render_node(arg_value[key], arg_depth + 1, key) + '</div>\n'
				}
			)
		}
		catch(e)
		{
		}
		return render_expandable_node(arg_label, str)
	}
	
	
	console.log(arg_value, 'value is unknow')
	return '<p>unknow node of type [' + (typeof arg_value) + ']</p>\n'
}
