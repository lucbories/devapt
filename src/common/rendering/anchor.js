// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import rendering_normalize from './rendering_normalize'


let context = 'common/rendering/anchor'



// DEFAULT STATE
const default_state = {
	label:undefined,
	command:undefined
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined,
	href:undefined,
	blank:false
}



/**
 * Anchor rendering with given state, produce a rendering result.
 * 
 * @param {object} arg_settings - rendering item settings.
 * @param {object} arg_state - component state.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., resolver:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	
	// GET SETTINGS ATTRIBUTES
	const href_value = (T.isString(settings.href) && settings.href.length > 0) ? settings.href : '#'

	// GET STATE ATTRIBUTES
	const label_value = state.label ? rendering_context.rendering_factory(state.label, arg_rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : 'no label'
	const cmd_value = (T.isString(state.command) && state.command.length > 0) ? state.command : undefined
	const url = (T.isString(state.url) && state.url.length > 0) ? state.url : ''
	if (cmd_value)
	{
		settings.class = settings.class ? settings.class + ' devapt-command' : 'devapt-command'
	}

	// BUILD TAG
	const tag_id = settings.id ? settings.id : 'tag_' + uid()
	const tag_children = label_value
	let tag_props = { id:tag_id, style:settings.style, className:settings.class, href:href_value && href_value != '#' ? href_value : '#' + url, attributes:{ 'data-devapt-command':cmd_value } }
	if (settings.blank)
	{
		tag_props._blank = ''
	}
	const tag = h('a', tag_props, tag_children)
	
	rendering_result.add_vtree(tag_id, tag)

	return rendering_result
}
