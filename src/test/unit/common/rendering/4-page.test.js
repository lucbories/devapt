// NPM IMPORTS
import chai from 'chai'

const expect = chai.expect

// COMMON IMPORTS
import * as Rendering from '../../../../common/rendering/index'

const RenderingResult = Rendering.RenderingResult
const factory     = Rendering.rendering_factory
const page        = Rendering.page



describe('Rendering', () => {
	const erc = {
		topology_defined_application:undefined,
		credentials:undefined,
		rendering_factory:undefined,
		trace_fn: undefined //console.log
	}

	const ercf = {
		topology_defined_application:undefined,
		credentials:undefined,
		rendering_factory:factory,
		trace_fn: undefined //console.log
	}

	// DEFAULT STATE
	const default_state = {
		title:undefined,
		metas:undefined, 	 // array of head tags

		body_headers:undefined,   // array of tags
		body_contents:undefined,   // array of tags
		body_footers:undefined,   // array of tags
		
		head_styles:[],
		head_styles_urls:[],
		
		head_scripts:[],
		head_scripts_urls:[],

		body_styles:[],
		body_styles_urls:[],

		body_scripts:[],
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

		body_class:undefined
	}

	it('page(...)=>RenderingResult empty', () => {
		const r1 = page(default_settings, default_state, erc, undefined)

		expect(r1).to.be.an('object')
		expect(r1.is_rendering_result).equal(true)

		let page_html = '<html><head>'
		page_html += '<title>Devapt</title>'
		page_html += '<meta charSet="utf-8" />'
		page_html += '<meta name="viewport" content="width=device-width" />'
		page_html += '</head><body>'
		page_html += '<header>'
		page_html += '</header>'
		page_html += '<div id="content"></div>'
		page_html += '<footer></footer>'
		page_html += '</body></html>'

		expect( r1.get_final_vtree() ).to.be.an('object')
		expect( r1.get_final_html() ).equal(page_html)
	} )


	const state_1 = {
		title:'PAGE 1',
		metas:[
			{
				name:'meta1',
				content:'content_meta1'
			},
			{
				name:'meta2',
				content:'content_meta2'
			}
		],

		body_headers:[
			{
				type:'label',
				settings:{},
				state:{ label:'label_header' }
			}
		],
		body_contents:[
			{
				type:'label',
				settings:{},
				state:{ label:'label_content' }
			}
		],
		body_footers:[
			{
				type:'label',
				settings:{},
				state:{ label:'label_footer' }
			}
		],
		
		head_styles:[],
		head_styles_urls:[],
		
		head_scripts:[],
		head_scripts_urls:[],

		body_styles:[],
		body_styles_urls:[],

		body_scripts:[],
		body_scripts_urls:[]
	}

	const settings_1 = {
		html_lang:'fr-FR',
		html_class:'html_class',
		html_prefix:'/prefix1',

		head_charset:'utf-16',
		head_viewport:'viewport 1',
		head_description:'description 1',
		head_robots:'robots 1',

		body_class:'body_class'
	}

	it('page(...)=>RenderingResult with metas and content', () => {
		const r1 = page(settings_1, state_1, ercf, undefined)

		expect(r1).to.be.an('object')
		expect(r1.is_rendering_result).equal(true)

		let page_html = '<html lang="fr-FR" class="html_class" prefix="/prefix1">'
		page_html += '<head>'
		page_html += '<title>PAGE 1</title>'
		page_html += '<meta charSet="utf-16" />'
		page_html += '<meta name="viewport" content="viewport 1" />'
		page_html += '<meta name="description" content="description 1" />'
		page_html += '<meta name="robots" content="robots 1" />'
		page_html += '<meta name="meta1" content="content_meta1" />'
		page_html += '<meta name="meta2" content="content_meta2" />'
		page_html += '</head>'
		page_html += '<body class="body_class">'
		page_html += '<header>'
		page_html += '<span id="tag_4">label_header</span>'
		page_html += '</header>'
		page_html += '<div id="content">'
		page_html += '<span id="tag_5">label_content</span>'
		page_html += '</div>'
		page_html += '<footer>'
		page_html += '<span id="tag_6">label_footer</span>'
		page_html += '</footer>'
		page_html += '</body></html>'

		expect( r1.get_final_vtree() ).to.be.an('object')

		const html_result = r1.get_final_html()
		diff(html_result, page_html)
		expect(html_result).equal(page_html)
	} )
} )

const DEBUG = true
const diff = (h1, h2)=>{
	if (! DEBUG) return;

	const l1 = h1.length
	const l2 = h2.length
	let index = 0
	let diff_index = -1
	let diff_count = 0
	for( ; index < l1 ; index++) 
	{
		const c1 = h1[index]
		const c2 = index < l2 ? h2[index] : 'X'
		if (c1 != c2 || (diff_index >= 0 && diff_count <= 10))
		{
			if (diff_index == -1)
			{
				diff_index = index
			}
			console.log(c1 + ' - ' + (c1 == c2 ? '==' : '<>') + ' - ' + c2)
			diff_count++
		}

		if (diff_index >= 0 && diff_count == 10)
		{
			const sub1 = h1.substr(diff_index, diff_count)
			const sub2 = h2.substr(diff_index, diff_count)
			console.log(sub1)
			console.log(sub2)
			break
		}
	}
}