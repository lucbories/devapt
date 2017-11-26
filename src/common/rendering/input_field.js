// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
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
 * @param {object} arg_rendering_context - rendering context: { trace_fn:..., resolver:..., credentials:..., rendering_factory:... }.
 * @param {RenderingResult} arg_rendering_result - rendering result to update.
 * 
 * @returns {RenderingResult} - updated Rendering result: VNode or Html text, headers.
 */
export default (arg_settings, arg_state={}, arg_rendering_context, arg_rendering_result)=>{
	// NORMALIZE ARGS
	const { settings, state, rendering_context, rendering_result } = rendering_normalize(default_settings, default_state, arg_settings, arg_state, arg_rendering_context, arg_rendering_result, context)
	
	// GET SETTINGS ATTRIBUTES
	const format = (T.isString(settings.format) && formats.indexOf(settings.format) > -1) ? settings.format : 'text'
	const css_label_class = T.isString(settings.css_class_label) ? settings.css_class_label : undefined
		
	// GET STATE ATTRIBUTES
	const placeholder_value = T.isString(state.placeholder) ? state.placeholder : undefined
	const default_value  = ( T.isString(state.default) || T.isNumber(state.default) ) ? state.default : undefined
	const label_value    = T.isString(state.label)          ? state.label : undefined
	const label_position = T.isString(state.label_position) ? state.label_position : 'top'
	const label_style    = T.isObject(state.label_style)    ? state.label_style : undefined
	const label_class    = T.isString(state.label_class)    ? state.label_class : ''
	const label_size     = T.isNumber(state.label_size) && state.label_size > 0 ? (state.label_size < 12 ? state.label_size : 11) : 3

	// BUILD INPUT TAG
	// const input_id = label_value ? settings.id : settings.id
	const input_id = label_value ? settings.id + '_input' : settings.id
	const input_children = undefined
	const input_props = { id:input_id, type:format, value:default_value, placeholder:placeholder_value, style:settings.style, class:settings.class }
	const input = h('input', input_props, input_children)
	
	if (! label_value)
	{
		rendering_result.add_vtree(input_id, input)
		return rendering_result
	}

	// BUILD LABEL TAG
	const label_id = input_id + '_label'
	const label_props = { id:label_id, attributes:{ for:input_id } }
	if (label_style)
	{
		label_props.style = label_style
	}
	if (css_label_class)
	{
		label_props.class = css_label_class
	}
	if (label_class)
	{
		label_props.class = label_props.class ? label_props.class + label_class : label_class
	}
	let label = undefined
	if (label_position == 'top')
	{
		label = h('label', label_props, [label_value, input])
	}
	else if (label_position == 'left')
	{
		const left  = h('div', { style:'float:left;width:' + label_size * (100/12) + '%;' }, [ h('label', label_props, [label_value]) ] )
		const right = h('div', { style:'float:right;width:' + (12 - label_size) * (100/12) + '%;' }, [input] )
		label = h('div', { className:'' }, [left, right] )
	}
	else if (label_position == 'right')
	{
		const left = h('div', { style:'float:right;width:' + (12 - label_size) * (100/12) + '%;' }, [input] )
		const right  = h('div', { style:'float:left;width:' + label_size * (100/12) + '%;' }, [ h('label', label_props, [label_value]) ] )
		label = h('div', { className:'' }, [left, right] )
	}
	else
	{
		label = h('label', label_props, [label_value, input])
	}
	

	const div = h('div', { id:settings.id }, [label])
	rendering_result.add_vtree(settings.id, div)

	return rendering_result
}
