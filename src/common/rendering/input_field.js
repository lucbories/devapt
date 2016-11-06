// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import RenderingResult from './rendering_result'
import rendering_normalize from './rendering_normalize'


let context = 'common/rendering/input_field'



// INPUT FIELD
const default_state = {
	label:undefined,
	placeholder:'enter a string value',
	default:''
}

const default_settings = {
	format: 'text',
	class:undefined,
	style:undefined,
	id:undefined
}

const formats = ['text', 'number', 'date', 'datetime', 'datetime-local', 'email', 'month', 'password', 'search', 'tel', 'time', 'url', 'week']



/**
 * Input field rendering with given state, produce a rendering result.
 * 
 * @param {object} arg_settings - rendering item settings.
 * @param {object} arg_state - component state.
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., topology_defined_application:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	
	// GET SETTINGS ATTRIBUTES
	const format = (T.isString(settings.format) && formats.indexOf(settings.format) > -1) ? settings.format : 'text'
		
	// GET STATE ATTRIBUTES
	const placeholder_value = T.isString(state.placeholder) ? state.placeholder : undefined
	const default_value = ( T.isString(state.default) || T.isNumber(state.default) ) ? state.default : undefined
	const label_value = T.isString(state.label) ? state.label : undefined

	// BUILD INPUT TAG
	const input_id = settings.id
	const input_children = undefined
	const input_props = { id:input_id, type:format, value:default_value, placeholder:placeholder_value, style:settings.style, class:settings.class }
	const input = h('input', input_props, input_children)
	
	if (! label_value)
	{
		rendering_result.add_vtree(input_id, input)
		return rendering_result
	}

	// BUILD LABEL TAG
	const label_children = [input]
	const label_props = { for:input_id, value:label_value }
	const label = h('label', label_props, label_children)
	rendering_result.add_vtree(input_id, label)

	return rendering_result
}
