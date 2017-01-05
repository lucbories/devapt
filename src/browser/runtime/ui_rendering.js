// NPM IMPORTS
import T from 'typr/lib/typr'
// import assert from 'assert'
// import _ from 'lodash'
// import vdom_as_json from 'vdom-as-json'
// const vdom_from_json = vdom_as_json.fromJson
// import VNode from 'virtual-dom/vnode/vnode'

// COMMON IMPORTS
import html_entities from '../../common/utils/html_entities'
import Loggable from '../../common/base/loggable'

// BROWSER IMPORTS


const context = 'browser/runtime/ui_rendering'



/**
 * @file UI rendering class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class UIRendering extends Loggable
{
	/**
	 * Create a UI rendering instance.
	 * 
	 * 	API:
	 * 		->constructor(arg_runtime, arg_ui)
	 * 
	 * 		->get_content_element():Element - Get page content element.
	 * 		->clear_content(arg_do_not_hide_components={}) - Hide content components.
	 * 
	 * 		->process_content(arg_id, arg_vnode, arg_rendering_result, arg_credentials): - .
	 * 
	 * @param {object} arg_runtime - client runtime.
	 * @param {object} arg_store - UI components state store.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_runtime, arg_ui)
	{
		super(context)

		this.is_ui_rendering = true

		this._runtime = arg_runtime
		this._ui = arg_ui

		this._content_id = 'content'
		this._content_element = undefined
		
		let assets_urls_templates = this._ui.store.get_state().get('assets_urls_templates', undefined)
		assets_urls_templates = assets_urls_templates ? assets_urls_templates.toJS() : undefined
		
		this.process_assets_urls_templates(assets_urls_templates)

		// this.enable_trace()
		// this.update_trace_enabled()
	}
	

	process_assets_urls_templates(arg_assets_urls_templates)
	{
		if (arg_assets_urls_templates)
		{
			this._assets_urls_templates = {
				script: html_entities.decode( arg_assets_urls_templates.script ),
				style:  html_entities.decode( arg_assets_urls_templates.style ),
				image:  html_entities.decode( arg_assets_urls_templates.image ),
				html:   html_entities.decode( arg_assets_urls_templates.html )
			}
		}
	}


	process_rendering_result_headers(arg_rendering_result_headers=[]/*, arg_credentials*/)
	{
		this.debug('process_rendering_result_headers:rendering headers', arg_rendering_result_headers)
		
		// TODO

		// arg_rendering_result_headers.forEach(
		// 	(header)=>{
		// 		const has_header = false // TODO
		// 		// const e = document.createElement(header)
		// 		// document.head.appendChild(e)// TODO
		// 	}
		// )
	}


	get_asset_url(arg_url, arg_type, arg_credentials=undefined)
	{
		const template = this._assets_urls_templates[arg_type]
		const url = T.isString(template) ? template.replace('{{url}}', arg_url) : arg_url
		const credentials_tag = '{{credentials_url}}'

		this.debug('get_asset_url:url', arg_url)
		this.debug('get_asset_url:type', arg_type)
		this.debug('get_asset_url:template', template)
		this.debug('get_asset_url:url', url)
		
		if ( url.indexOf('&token') > -1 && url.indexOf(credentials_tag) == -1 )
		{
			return url
		}

		if (! arg_credentials)
		{
			this.debug('get_asset_url:no credentials')
			// console.log('get_asset_url:arg_url=%s', arg_url)
			// console.log('get_asset_url:template=%s', template)
			// console.log('get_asset_url:url=%s', url)
			return url
		}


		if (url.indexOf(credentials_tag) >= 0)
		{
			const url2 = url.replace(credentials_tag, arg_credentials.get_url_part())
			this.debug('get_asset_url:url2', url2)
			return url2
		}

		const url3 = url + '?' + arg_credentials.get_url_part()
		this.debug('get_asset_url:url3', url3)
		return url3
	}


	create_dom_url_element(arg_dom_element, arg_tag, arg_id, arg_url, arg_type)
	{
		// SEARCH DEVAPT BOOTSTRAP SCRIPT TAG
		const devapt_bootstrap_element = document.getElementById('js-devapt-bootstrap')
		const has_bootstrap_element = devapt_bootstrap_element ? arg_dom_element == devapt_bootstrap_element.parentNode : false

		let e = document.getElementById(arg_id)
		if (e)
		{
			if (e.getAttribute('src') == arg_url)
			{
				return
			}
			e.parentNode.removeChild(e)
		}
		
		e = document.createElement(arg_tag)
		e.setAttribute('id', arg_id)
		e.setAttribute('src', arg_url)
		e.setAttribute('type', arg_type)

		e.onload = ()=>{
			console.log('ASSET loaded tag=%s, id=%s, url=%s', arg_tag, arg_id, arg_url)
		}

		e.onerror = ()=>{
			console.error('ASSET loading error tag=%s, id=%s, url=%s', arg_tag, arg_id, arg_url)
		}

		if (has_bootstrap_element)
		{
			arg_dom_element.insertBefore(e, devapt_bootstrap_element)

			return
		}
		arg_dom_element.appendChild(e)
	}


	process_rendering_result_scripts_urls(arg_dom_element, arg_rendering_result_scripts_urls=[], arg_credentials)
	{
		this.debug('process_rendering_result_scripts_urls:rendering body_scripts_urls', arg_rendering_result_scripts_urls)
		
		// SEARCH DEVAPT BOOTSTRAP SCRIPT TAG
		// const devapt_bootstrap_element = document.getElementById('js-devapt-bootstrap')
		// const has_bootstrap_element = devapt_bootstrap_element ? arg_dom_element == devapt_bootstrap_element.parentNode : false

		arg_rendering_result_scripts_urls.forEach(
			(url)=>{
				this.debug('process_rendering_result_scripts_urls:loop on url', url.id, url.src)

				const url_src = this.get_asset_url(url.src, 'script', arg_credentials ? arg_credentials : this._runtime.session_credentials)

				this.create_dom_url_element(arg_dom_element, 'script', url.id, url_src, 'text/javascript')
			}
		)
	}


	process_rendering_result_scripts_tags(arg_dom_element, arg_rendering_result_scripts_tags=[]/*, arg_credentials*/)
	{
		this.debug('process_rendering_result_scripts_tags:rendering body_scripts_tags', arg_rendering_result_scripts_tags)
		
		arg_rendering_result_scripts_tags.forEach(
			(tag)=>{
				this.debug('process_rendering_result_scripts_tags:loop on tag')

				let e = document.getElementById(tag.id)
				if (e)
				{
					if (e.text == tag.content)
					{
						return
					}
					e.parentNode.removeChild(e)
				}

				e = document.createElement('script')
				e.text = tag.content
				e.setAttribute('id', tag.id)
				e.setAttribute('type', 'text/javascript')
				arg_dom_element.appendChild(e)
			}
		)
	}


	process_rendering_result_styles_urls(arg_dom_element, arg_rendering_result_styles_urls=[], arg_credentials)
	{
		this.debug('process_rendering_result_styles_urls:rendering body_styles_urls', arg_rendering_result_styles_urls)
		
		arg_rendering_result_styles_urls.forEach(
			(url)=>{
				this.debug('process_rendering_result_styles_urls:loop on url', url.id, url.href)

				const url_href = this.get_asset_url(url.href, 'style', arg_credentials ? arg_credentials : this._runtime.session_credentials)
				
				let e = document.getElementById(url.id)
				if (e)
				{
					// console.log('e exists', e)
					if (e.getAttribute('href') == url_href)
					{
						return
					}
					// console.log('existing e is different', e, url_href)
					e.parentNode.removeChild(e)
				}
				
				e = document.createElement('link')
				e.setAttribute('id', url.id)
				e.setAttribute('href', url_href)
				e.setAttribute('media', url.media ? url.media : 'all')
				e.setAttribute('rel', 'stylesheet')
				arg_dom_element.appendChild(e)
			}
		)
	}


	process_rendering_result_styles_tags(arg_dom_element, arg_rendering_result_scripts_tags=[]/*, arg_credentials*/)
	{
		this.debug('process_rendering_result_styles_tags:rendering body_styles_tags', arg_rendering_result_scripts_tags)
		
		arg_rendering_result_scripts_tags.forEach(
			(tag)=>{
				this.debug('process_rendering_result_styles_tags:loop on tag')

				let e = document.getElementById(tag.id)
				if (e)
				{
					if (e.text == tag.content)
					{
						return
					}

					e.parentNode.removeChild(e)
				}

				e = document.createElement('style')
				e.text = tag.content
				e.setAttribute('id', tag.id)
				e.setAttribute('type', 'text/stylesheet')
				arg_dom_element.appendChild(e)
			}
		)
	}
}
