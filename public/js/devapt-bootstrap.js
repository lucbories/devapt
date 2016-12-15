
// DECORATE WINDOW WITH DEVAPT
var private_devapt = {
	runtime_created_listeners:[],
	content_rendered_listeners:[],
	content_rendered_persistent_listeners:[],
	runtime:undefined,
	ui:undefined,
	service:undefined,
	router:undefined,
	ajax:undefined
}

window.devapt = function() { return private_devapt }



// *********************************************************************************
// ON DOM LOADED HANDLER
function dom_loaded_listener(arg_callback, arg_operand)
{
	console.log('devapt-bootstrap:dom_loaded_listener')

	var cb = function()
	{
		console.log('devapt-bootstrap:dom_loaded_listener:cb')

		document.removeEventListener("DOMContentLoaded", cb, false);

		arg_callback(arg_operand);

		if (document.body.className.indexOf('javascript') == -1)
		{
			document.body.className += ' javascript';
		}
	}

	return cb
}


private_devapt.on_dom_loaded = function(arg_callback, arg_operand)
{
	console.log('devapt-bootstrap:on_dom_loaded')

	if (document.readyState != 'loading')
	{
		console.log('devapt-bootstrap:on_dom_loaded:loaded')
		arg_callback(arg_operand)
	} else {
		console.log('devapt-bootstrap:on_dom_loaded:not loaded')

		// Mozilla, Opera, Webkit, IE9+
		if (document.addEventListener)
		{
			var cb = dom_loaded_listener(arg_callback, arg_operand)
			document.addEventListener("DOMContentLoaded", cb, false)
		}
	}
}



// *********************************************************************************
// CREATE RUNTIME
private_devapt.create_runtime = function()
{
	console.log('devapt-bootstrap:create_runtime')
	
	function reducers(prev_state, action)
	{
		if (! prev_state)
		{
			prev_state = {}
		}
		if (! prev_state.counter)
		{
			prev_state.counter = 0
		}
		prev_state.counter++
		
		// console.log(prev_state, 'state')
		
		return prev_state
	}

	// CREATE RUNTIME
	var runtime_settings = {
		reducers:reducers,
		default_view:"${arg_default_view}",
		default_menubar:"${arg_default_menubar}"
	}
	var ClientRuntime = require('client_runtime').default
	var private_runtime = new ClientRuntime()
	
	// RUNTIME GETTER
	private_devapt.runtime = function() { return private_runtime }
	
	// LOAD RUNTIME
	private_runtime.load(runtime_settings)
	
	// ROUTER GETTER
	private_devapt.router = function() { return private_runtime._router }

	// UI GETTER
	var private_ui = private_runtime._ui
	private_devapt.ui = function(arg_name)
	{
		if (arg_name)
		{
			return private_ui.get(arg_name)
		}
		return private_ui
	}

	// SERVICE GETTER
	private_devapt.service = function(arg_name)
	{
		if (arg_name)
		{
			return private_runtime.service(arg_name)
		}
		return undefined
	}

	// COMMAND GETTER
	private_devapt.command = function(arg_name)
	{
		if (arg_name)
		{
			return private_runtime.command(arg_name)
		}
		return undefined
	}

	private_devapt.runtime_created()
}


private_devapt.on_runtime_created = function(arg_callback, arg_operand)
{
	console.log('devapt-bootstrap:on_runtime_created')

	private_devapt.runtime_created_listeners.push( { callback:arg_callback, operands:arg_operand})
}


private_devapt.runtime_created = function(arg_callback, arg_operand)
{
	console.log('devapt-bootstrap:runtime_created')

	private_devapt.runtime_created_listeners.forEach(
		function(cb_record)
		{
			cb_record.callback(cb_record.operands)
		}
	)
}



// *********************************************************************************
// RENDER PAGE CONTENTT
private_devapt.render_page_content = function(arg_operand)
{
	console.log('devapt-bootstrap:render_page_content')
	
	var json_result = arg_operand ? arg_operand : window.__INITIAL_CONTENT__ 
	console.log(json_result, 'js-devapt-init-content')

	window.devapt().ui().process_rendering_result(json_result)
	window.devapt().router().set_hash_if_empty('/')
}


// ON RUNTIME CREATED HANDLER
private_devapt.on_content_rendered = function(arg_callback, arg_operand, arg_persistent=false)
{
	console.log('devapt-bootstrap:on_content_rendered')

	if (arg_persistent)
	{
		private_devapt.content_rendered_persistent_listeners.push( { callback:arg_callback, operands:arg_operand})
		return
	}

	private_devapt.content_rendered_listeners.push( { callback:arg_callback, operands:arg_operand})
}


// ON RUNTIME CREATED HANDLER
private_devapt.content_rendered = function()
{
	console.log('devapt-bootstrap:content_rendered')

	private_devapt.content_rendered_listeners.forEach(
		function(cb_record)
		{
			cb_record.callback(cb_record.operands)
		}
	)

	private_devapt.content_rendered_listeners = []

	private_devapt.content_rendered_persistent_listeners.forEach(
		function(cb_record)
		{
			cb_record.callback(cb_record.operands)
		}
	)
}



// *********************************************************************************
// UPDATE ANCHORS WITH COMMANDS ATTRIBUTES
private_devapt.init_anchors_commands = function()
{
	console.log('devapt-bootstrap:init_anchors_commands')

	var label = undefined
	var href = undefined
	var cmd = undefined
	var cmd_name = undefined
	var anchors = document.querySelectorAll('a.devapt-command')
	anchors.forEach(
		function(anchor)
		{
			label = anchor.text

			href = anchor.getAttribute('href')
			cmd_name = anchor.getAttribute('data-devapt-command')
			cmd = window.devapt().command(cmd_name)
			if (cmd)
			{
				// UPDATE ANCHOR LABEL
				if (label == 'no label' && cmd.label && cmd.label.length > 0)
				{
					anchor.innerHTML = cmd.label
				}

				// UPDATE ANCHOR HREF
				if (href == '#' && cmd.url && cmd.url.length > 0)
				{
					anchor.setAttribute('href', '#' + cmd.url)
				}
			}
		}
	)
}



// *********************************************************************************
// AJAX
private_devapt.ajax = function() { return private_devapt.private_ajax }
private_devapt.private_ajax = {}

private_devapt.private_ajax.get_html = function (arg_url, arg_callback)
{
	console.log('devapt-bootstrap:ajax_get')

	var xhr = new XMLHttpRequest();
	xhr.open('GET', arg_url);
	xhr.send(null);

	xhr.onreadystatechange = function ()
	{
		var DONE = 4;
		var OK   = 200;
		if (xhr.readyState === DONE)
		{
			if (xhr.status === OK) 
			{
				console.log(xhr.responseText);
				arg_callback(xhr.responseText);
			} else {
				console.error('Error: ' + xhr.status);
			}
		}
	}
}

private_devapt.private_ajax.get_json = private_devapt.private_ajax.get_html


window.devapt().on_dom_loaded( window.devapt().create_runtime )
window.devapt().on_runtime_created( window.devapt().render_page_content )
window.devapt().on_content_rendered( window.devapt().init_anchors_commands )
