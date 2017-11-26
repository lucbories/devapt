// NPM IMPORTS
import T from 'typr'
// import assert from 'assert'
import _ from 'lodash'
import h from 'virtual-dom/h'

// COMMON IMPORTS
import rendering_normalize from './rendering_normalize'


let context = 'common/rendering/page'



// DEFAULT STATE
const default_state = {
	title:undefined,
	metas:undefined, 	 // array of head tags

	body_headers:undefined,   // array of tags
	body_contents:undefined,   // array of tags
	body_footers:undefined,   // array of tags
	
	head_styles_tags:[],
	head_styles_urls:[],
	
	head_scripts_tags:[],
	head_scripts_urls:[],

	body_styles_tags:[],
	body_styles_urls:[],

	body_scripts_tags:[],
	body_scripts_urls:[]
}

// DEFAULT SETTINGS
const default_settings = {
	html_lang:undefined,
	html_class:undefined,
	html_prefix:undefined,

	head_charset:'utf-8',
	head_viewport:undefined,
	head_description:undefined,
	head_robots:undefined,

	body_class:undefined,

	assets_urls_templates:{
		script:'{{url}}',
		style:'{{url}}',
		image:'{{url}}',
		html:'{{url}}'
	}
}


const get_url = (arg_template, arg_url, arg_absolute)=>arg_absolute ? arg_url : arg_template.replace('{{url}}', arg_url)



/**
 * Page rendering with given state, produce a rendering result.
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
	const html_lang_value    = T.isString(settings.html_lang)    ? settings.html_lang : undefined
	const html_class_value   = T.isString(settings.html_class)   ? settings.html_class : undefined
	const html_prefix_value  = T.isString(settings.html_prefix)  ? settings.html_prefix : undefined
	const head_charset_value = T.isString(settings.head_charset) ? settings.head_charset : 'UTF-8'
	const head_viewport_value= T.isString(settings.head_viewport)? settings.head_viewport : 'width=device-width'
	const head_description_value= T.isString(settings.head_description)? settings.head_description : undefined
	const head_robots_value  = T.isString(settings.head_robots)  ? settings.head_robots : undefined
	const body_class_value   = T.isString(settings.body_class)   ? settings.body_class : undefined

	// GET STATE ATTRIBUTES
	const title_value         = T.isString(state.title)       ? state.title : 'Devapt'
	const metas_value         = T.isArray(state.metas)        ? state.metas : []
	const body_headers_value  = T.isArray(state.body_headers) ? state.body_headers : undefined
	const body_contents_value = T.isArray(state.body_contents)? state.body_contents : undefined
	const body_footers_value  = T.isArray(state.body_footers) ? state.body_footers : undefined


	// BUILD CONTENT
	const render = (item) => {
		// console.log(item, context + ':render:item')
		return T.isFunction(rendering_factory) ? rendering_factory(item, rendering_context, settings.children).get_final_vtree(undefined, rendering_result) : item.toString()
	}


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

			return h('style', { id:item.id, type:type, media:media }, item.content)
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

			return h('link', { id:item.id, href:get_url(url_template, item.href, item.absolute), type:type, media:media, rel:rel, title:title })
		}
	}


	// BUILD HEAD SCRIPTS URLS
	const script_url = (item)=>{
		if ( T.isObject(item) && T.isString(item.src) && item.src.length > 0 && T.isString(item.id) && item.id.length > 0 )
		{
			const type = T.isString(item.type)  && item.type.length  > 0 ? item.type  : 'text/javascript'

			return h('script', { id:item.id, src:get_url(settings.assets_urls_templates.script, item.src, item.absolute), type:type })
		}
	}


	// BUILD TITLE TAG
	const title = h('title', undefined, title_value)


	// BUILD METAS TAG
	const meta_charset     = T.isString(head_charset_value)     ? h('meta', { charSet:head_charset_value }, undefined) : undefined
	const meta_viewport    = T.isString(head_viewport_value)    ? h('meta', { name:'viewport', content:head_viewport_value }) : undefined
	const meta_description = T.isString(head_description_value) ? h('meta', { name:'description', content:head_description_value }) : undefined
	const meta_robots      = T.isString(head_robots_value)      ? h('meta', { name:'robots', content:head_robots_value }) : undefined
	const meta = (item)=>{
		if ( T.isObject(item) && T.isString(item.name) && item.name.length > 0 && T.isString(item.content) )
		{
			return h('meta', { name:item.name, content:item.content})
		}
	}
	const metas = [meta_charset, meta_viewport, meta_description, meta_robots].concat( metas_value.map(meta) )


	// BUILD BODY TAG
	const headers_children = T.isArray(body_headers_value) ? body_headers_value.map(render) : undefined
	const headers = h('header', undefined, headers_children)
	
	const contents_children = T.isArray(body_contents_value) ? body_contents_value.map(render) : undefined
	const contents = h('div', { id:'content'}, contents_children)
	
	const footers_children = T.isArray(body_footers_value) ? body_footers_value.map(render) : undefined
	const footers = h('footer', undefined, footers_children)

	const body_styles_tags  = ( T.isArray(state.body_styles_tags)  ? _.concat(rendering_result.body_styles_tags,  state.body_styles_tags)  : rendering_result.body_styles_tags ).map(style)
	const body_styles_urls  = ( T.isArray(state.body_styles_urls)  ? _.concat(rendering_result.body_styles_urls,  state.body_styles_urls)  : rendering_result.body_styles_urls ).map(link)
	const body_scripts_tags = ( T.isArray(state.body_scripts_tags) ? _.concat(rendering_result.body_scripts_tags, state.body_scripts_tags) : rendering_result.body_scripts_tags).map(script)
	const body_scripts_urls = ( T.isArray(state.body_scripts_urls) ? _.concat(rendering_result.body_scripts_urls, state.body_scripts_urls) : rendering_result.body_scripts_urls).map(script_url)

	const body_children = [headers, contents, footers, body_styles_urls, body_styles_tags, body_scripts_urls, body_scripts_tags]
	const body_props = { class:body_class_value }
	const body = h('body', body_props, body_children)
	

	// BUILD ASSETS TAGS
	const head_styles_urls  = ( T.isArray(state.head_styles_urls)  ? _.concat(rendering_result.head_styles_urls,  state.head_styles_urls) : rendering_result.head_styles_urls  ).map(link)
	const head_links_urls   = ( T.isArray(state.head_links_urls)   ? _.concat(rendering_result.head_links_urls,   state.head_links_urls)  : rendering_result.head_links_urls   ).map(link)
	const head_scripts_urls = ( T.isArray(state.head_scripts_urls) ? _.concat(rendering_result.head_scripts_urls, state.head_scripts_urls): rendering_result.head_scripts_urls ).map(script_url)
	const head_scripts_tags = ( T.isArray(state.head_scripts_tags) ? _.concat(rendering_result.head_scripts_tags, state.head_scripts_tags): rendering_result.head_scripts_tags ).map(script)
	const head_styles_tags  = ( T.isArray(state.head_styles_tags)  ? _.concat(rendering_result.head_styles_tags,  state.head_styles_tags) : rendering_result.head_styles_tag   ).map(style)


	// BUILD HEAD TAG
	const head_children = [title].concat(metas, head_styles_urls, head_links_urls, head_scripts_urls, head_styles_tags, head_scripts_tags)
	const head_props = undefined
	const head = h('head', head_props, head_children)


	// BUILD HTML TAG
	const page_children = [head, body]
	const page_props = { lang:html_lang_value, class:html_class_value, prefix:html_prefix_value }
	const page = h('html', page_props, page_children)
	
	rendering_result.add_vtree('page', page)

	return rendering_result
}
