// NPM IMPORTS
import T from 'typr'
import assert from 'assert'
import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import RenderingResult from './rendering_result'
import rendering_normalize from './rendering_normalize'


let context = 'common/rendering/page_body'



// DEFAULT STATE
const default_state = {
	body_headers:undefined,   // array of tags
	body_contents:undefined,   // array of tags
	body_footers:undefined   // array of tags
}

// DEFAULT SETTINGS
const default_settings = {
	body_class:undefined,
	assets_urls_templates:{
		script:'{{url}}',
		style:'{{url}}',
		image:'{{url}}',
		html:'{{url}}'
	}
}


const get_url = (arg_template, arg_url)=>arg_template.replace('{{url}}', arg_url)



/**
 * Page rendering with given state, produce a rendering result.
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
	const rendering_factory = rendering_context ? rendering_context.rendering_factory : undefined


	// GET SETTINGS ATTRIBUTES

	// GET STATE ATTRIBUTES
	const body_headers_value  = T.isArray(state.body_headers) ? state.body_headers : undefined
	const body_contents_value = T.isArray(state.body_contents)? state.body_contents : undefined
	const body_footers_value  = T.isArray(state.body_footers) ? state.body_footers : undefined


	// BUILD CONTENT
	const render = (item) => T.isFunction(rendering_factory) ? rendering_factory(item, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : item.toString()


	// BUILD SCRIPTS TAGS
	const script = (item)=>{
		if ( T.isObject(item) && T.isString(item.id) && item.id.length > 0 && T.isString(item.content) && item.content.length > 0 )
		{
			const type = T.isString(item.type)  && item.type.length  > 0 ? item.type  : 'text/javascript'

			return h('script', { id:item.id, type:type }, item.content)
		}
	}


	// BUILD STYLES TAGS
	const style = (item)=>{
		if ( T.isObject(item) && T.isString(item.id) && item.id.length > 0 && T.isString(item.content) && item.content.length > 0 )
		{
			const type  = T.isString(item.type)  && item.type.length  > 0 ? item.type  : 'text/css'
			const media = T.isString(item.media) && item.media.length > 0 ? item.media : 'all'

			return h('script', { id:item.id, type:type, media:media }, item.content)
		}
	}


	// BUILD HEAD STYLES/LINKS URLS
	const link = (item)=>{
		if ( T.isObject(item) && T.isString(item.href) && item.href.length > 0 && T.isString(item.id) && item.id.length > 0 )
		{
			const rel   = T.isString(item.rel)   && item.rel.length   > 0 ? item.rel   : 'stylesheet'
			const type  = T.isString(item.type)  && item.type.length  > 0 ? item.type  : 'text/css'
			const media = T.isString(item.media) && item.media.length > 0 ? item.media : 'all'
			const title = T.isString(item.title) && item.title.length > 0 ? item.title : undefined
			const url_template = rel == 'stylesheet' ? settings.assets_urls_templates.style : settings.assets_urls_templates.image

			return h('link', { id:item.id, href:get_url(url_template, item.href), type:type, media:media, rel:rel, title:title })
		}
	}


	// BUILD HEAD SCRIPTS URLS
	const script_url = (item)=>{
		if ( T.isObject(item) && T.isString(item.src) && item.src.length > 0 && T.isString(item.id) && item.id.length > 0 )
		{
			const type = T.isString(item.type)  && item.type.length  > 0 ? item.type  : 'text/javascript'

			return h('script', { id:item.id, src:get_url(settings.assets_urls_templates.script, item.src), type:type })
		}
	}


	// BUILD BODY TAG
	const headers_children = T.isArray(body_headers_value) ? body_headers_value.map(render) : undefined
	const headers = h('header', undefined, headers_children)
	
	const contents_children = T.isArray(body_contents_value) ? body_contents_value.map(render) : undefined
	const contents = h('div', { id:'content'}, contents_children)
	
	const footers_children = T.isArray(body_footers_value) ? body_footers_value.map(render) : undefined
	const footers = h('footer', undefined, footers_children)

	const body_styles_tags  = rendering_result.body_styles_tags.map(style)
	const body_styles_urls  = rendering_result.body_styles_urls.map(link)
	const body_scripts_tags = rendering_result.body_scripts_tags.map(script)
	const body_scripts_urls = rendering_result.body_scripts_urls.map(script_url)

	const body_children = [headers, contents, footers, body_styles_urls, body_styles_tags, body_scripts_urls, body_scripts_tags]
	const body_props = { class:body_class_value }
	const body = h('body', body_props, body_children)
	
	rendering_result.add_vtree('body', body)

	return rendering_result
}
