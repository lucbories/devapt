// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
// import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import rendering_normalize from './rendering_normalize'
import uid from '../utils/uid'


let context = 'common/rendering/container'



// DEFAULT STATE
const default_state = {
	items:undefined    // array (rows)
}

// DEFAULT SETTINGS
const default_settings = {
	class:undefined,
	style:undefined,
	id:undefined
}




/**
 * container rendering with given state, produce a rendering result.
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

	// GET SETTINGS ATTRIBUTES

	// GET STATE ATTRIBUTES
	const items_value   = T.isArray(state.items)   ? state.items : undefined

	// BUILD CELL
	const cell_fn = (cell) => T.isFunction(rendering_factory) ? rendering_factory(cell, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : cell.toString()
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
	const child_content = (content, index)=>cell_content('div', content, index)

	// BUILD TAG
	const tag_id = settings.id
	const tag_children = items_value ? items_value.map(child_content) : undefined
	const tag_props = { id:tag_id, style:settings.style, className:settings.class }
	const tag = h('div', tag_props, tag_children )
	
	rendering_result.add_vtree(tag_id, tag)

	return rendering_result
}
