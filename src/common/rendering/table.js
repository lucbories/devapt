// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import rendering_normalize from './rendering_normalize'
import uid from '../utils/uid'


let context = 'common/rendering/table'



// DEFAULT STATE
const default_state = {
	label:undefined,
	headers:undefined,  // array (rows) of array (th values)
	items:undefined,    // array (rows) of array (cells)
	footers:undefined   // array (rows) of array (th values)
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}



/**
 * Table rendering with given state, produce a rendering result.
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
	const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined
	
	// GET STATE ATTRIBUTES
	const label_value   = T.isString(state.label)  ? state.label : undefined
	const headers_value = T.isArray(state.headers) ? (label_value ? [[label_value]].concat(state.headers) : state.headers) : (label_value ? [[label_value]] : undefined)
	const items_value   = T.isArray(state.items)   ? state.items : undefined
	const footers_value = T.isArray(state.footers) ? state.footers : undefined

	// DEBUG
	rendering_context.trace_fn(state.headers, context + ':state.headers')
	rendering_context.trace_fn(state.items, context + ':state.items')
	rendering_context.trace_fn(headers_value, context + ':headers_value')
	rendering_context.trace_fn(items_value, context + ':items_value')

	// BUILD THEAD, TBODY, TFOOT
	const cell_fn = (cell) =>{
		return T.isFunction(rendering_factory) ? rendering_factory(cell, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : cell.toString()
	}
	const cell_content=(tag, cell_settings, index)=>{
		// CELL CONTENT SETTINGS IS AN OBJECT
		if ( T.isObject(cell_settings) )
		{
			// CELL CONTENT IS A VALUE
			if ( ! T.isString(cell_settings.type) && T.isString(cell_settings.value) )
			{
				if ( ! T.isString(cell_settings.key) )
				{
					cell_settings.key = uid()
				}
				
				return h(tag, { id:settings.id + '_' + cell_settings.key }, [ cell_settings.value ])
			}

			// CELL CONTENT IS A VIEW
			if ( ! T.isString(cell_settings.type) && T.isString(cell_settings.view) )
			{
				if ( ! T.isString(cell_settings.key) )
				{
					cell_settings.key = cell_settings.view
				}

				return h(tag, { id:settings.id + '_' + cell_settings.key }, [ cell_fn(cell_settings.view) ] )
			}

			// CELL IS A RENDERING SETTINGS
			if ( T.isString(cell_settings.type) )
			{
				return h(tag, { id:settings.id + '_' + tag + '_' + index }, [ cell_fn(cell_settings) ] )
			}

			const str_value = cell_settings.toString()
			return h(tag, { id:settings.id + '_' + tag + '_' + index }, [ str_value ] )
		}
		
		const str_value = T.isString(cell_settings) ? cell_settings : ( T.isFunction(cell_settings.toString) ? cell_settings.toString() : 'ERROR')
		return h(tag, { id:settings.id + '_' + tag + '_' + index }, [ str_value ] )
	}
	const th_fn = (content, index)=>cell_content('th', content, index)
	const td_fn = (content, index)=>cell_content('td', content, index)

	const tr_th_fn = (cells, index)  =>h('tr', { id:settings.id + '_head_row_' + index }, (T.isArray(cells) ? cells : [cells]).map(th_fn) )
	const tr_td_fn = (cells, index)  =>h('tr', { id:settings.id + '_body_row_' + index }, (T.isArray(cells) ? cells : [cells]).map(td_fn) )
	const tr_tf_fn = (cells, index)  =>h('tr', { id:settings.id + '_foot_row_' + index }, (T.isArray(cells) ? cells : [cells]).map(th_fn) )
	
	const thead_children = headers_value ? (T.isArray(headers_value) ? headers_value : [headers_value]).map(tr_th_fn) : undefined
	const tbody_children = items_value   ? (T.isArray(items_value)   ? items_value   : [items_value]).map(tr_td_fn)   : undefined
	const tfoot_children = footers_value ? (T.isArray(footers_value) ? footers_value : [footers_value]).map(tr_tf_fn) : undefined

	const thead = h('thead', undefined, thead_children)
	const tbody = h('tbody', undefined, tbody_children)
	const tfoot = h('tfoot', undefined, tfoot_children)

	// BUILD TAG
	const tag_id = settings.id
	const tag_children = [thead, tbody, tfoot]
	const tag_props = { id:tag_id, style:settings.style, class:settings.class }
	const tag = h('table', tag_props, tag_children)
	
	rendering_result.add_vtree(tag_id, tag)

	return rendering_result
}
