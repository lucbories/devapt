// NPM IMPORTS
import chai from 'chai'

const expect = chai.expect

// COMMON IMPORTS
import RenderingResult from '../../../../common/rendering/rendering_result'
import factory         from '../../../../common/rendering/rendering_factory'
import f               from '../../../../common/rendering/rendering_function'
import input_field     from '../../../../common/rendering/input_field'
import button          from '../../../../common/rendering/button'
import table           from '../../../../common/rendering/table'
import anchor          from '../../../../common/rendering/anchor'
import list            from '../../../../common/rendering/list'
import image           from '../../../../common/rendering/image'
import label           from '../../../../common/rendering/label'
import hbox            from '../../../../common/rendering/hbox'
import vbox            from '../../../../common/rendering/vbox'
import menubar         from '../../../../common/rendering/menubar'
import script          from '../../../../common/rendering/script'
// import page            from '../../../../common/rendering/page'
// import tabs            from '../../../../common/rendering/tabs'



describe('Rendering', () => {
	
	describe('Rendering function f', () => {
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
		
		it('f(...)=>RenderingResult', () => {
			const r1 = f({}, {}, erc, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)
			
			const rr = new RenderingResult()
			const r2 = f({}, {}, erc, rr)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)
			expect(r2).equal(rr)
		} )


		it('input_field(...)=>RenderingResult', () => {
			const r1 = input_field({ id:'id1' }, {}, erc, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<input type="text" id="id1" value="" placeholder="enter a string value" />')
			

			const r2 = input_field({ id:'id1', format:'integer', style:{ border:'3px' }, class:'class1' }, {}, erc, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<input style="border:3px;" type="text" id="id1" value="" placeholder="enter a string value" class="class1" />')
			

			const r3 = input_field({ id:'id1', format:'number', style:{ border:'3px', color:'red' }, class:'class1 class2' }, {placeholder:'hello!!', default:'456'}, erc, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" />')
			

			const r4 = input_field({ id:'id1', format:'number', style:{ border:'3px', color:'red' }, class:'class1 class2' }, {label:'my input', placeholder:'hello!!', default:'456'}, erc, undefined)
			expect(r4).to.be.an('object')
			expect(r4.is_rendering_result).equal(true)

			expect( r4.get_vtree('id1') ).to.be.an('object')
			expect( r4.get_html('id1') ).equal('<label for="id1" value="my input"><input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" /></label>')
		} )


		it('button(...)=>RenderingResult', () => {
			const r1 = button({ id:'id1' }, {}, erc, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<button id="id1" type="button"></button>')
			

			const r2 = button({ id:'id1', type:'button', style:{ border:'3px' }, class:'class1' }, {}, erc, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<button style="border:3px;" id="id1" type="button" class="class1"></button>')
			

			const r3 = button({ id:'id1', type:'submit', style:{ border:'3px', color:'red' }, class:'class1 class2' }, {label:'HELLO'}, erc, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<button style="border:3px;color:red;" id="id1" type="submit" class="class1 class2">HELLO</button>')
		} )


		it('table(...)=>RenderingResult', () => {
			const r1 = table({ id:'id1' }, {}, erc, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<table id="id1"><thead></thead><tbody></tbody><tfoot></tfoot></table>')
			

			const r2 = table({ id:'id1', style:{ border:'3px' }, class:'class1' }, {}, erc, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<table style="border:3px;" id="id1" class="class1"><thead></thead><tbody></tbody><tfoot></tfoot></table>')
			
			const headers = [
				['a', 'b']
			]
			const rows = [
				['a1', 'b1'],
				['a2', 'b2']
			]
			const td_fn = (cell)=>'<td>' + cell + '</td>'
			const tr_fn = (row)=>'<tr>' + row.map(td_fn).join('') + '</tr>'
			const tbody_content = rows.map(tr_fn).join('')
			const table_content = '<thead><tr><th>a</th><th>b</th></tr></thead><tbody>' + tbody_content + '</tbody><tfoot></tfoot>'

			const r3 = table({ id:'id1', style:{ border:'3px', color:'red' }, class:'class1 class2' }, { items:rows, columns:headers }, erc, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<table style="border:3px;color:red;" id="id1" class="class1 class2">' + table_content + '</table>')
		} )


		it('table(...)=>RenderingResult with factory', () => {
			const r1 = table({ id:'id1' }, {}, ercf, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<table id="id1"><thead></thead><tbody></tbody><tfoot></tfoot></table>')
			

			const r2 = table({ id:'id1', style:{ border:'3px' }, class:'class1' }, {}, ercf, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<table style="border:3px;" id="id1" class="class1"><thead></thead><tbody></tbody><tfoot></tfoot></table>')
			
			const headers = [
				['a', 'b']
			]
			const rows = [
				['a1', {v:'b1'}],
				['a2', 'b2']
			]
			const td_fn = (cell)=>'<td>' + cell.toString() + '</td>'
			const tr_fn = (row)=>'<tr>' + row.map(td_fn).join('') + '</tr>'
			const tbody_content = rows.map(tr_fn).join('')
			const table_content = '<thead><tr><th>a</th><th>b</th></tr></thead><tbody>' + tbody_content + '</tbody><tfoot></tfoot>'

			const r3 = table({ id:'id1', style:{ border:'3px', color:'red' }, class:'class1 class2' }, { items:rows, columns:headers }, ercf, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<table style="border:3px;color:red;" id="id1" class="class1 class2">' + table_content + '</table>')
		} )


		it('table(...)=>RenderingResult with factory and sub rendering', () => {
			const settings1 = { id:'id1', format:'number', style:{ border:'3px', color:'red' }, class:'class1 class2' }
			const state1 = { default:456, placeholder:'hello!!' }
			const html1 = '<div><input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" /></div>'
			const input1 = {type:'input', state:state1, settings:settings1}
			input1.toString = ()=>html1

			const headers = [
				['a', 'b']
			]
			const footers = [
				['fa', 'fb']
			]
			const rows = [
				['a1', input1],
				['a2', 'b2']
			]
			const td_fn = (cell)=>'<td>' + cell.toString() + '</td>'
			const tr_fn = (row)=>'<tr>' + row.map(td_fn).join('') + '</tr>'
			const tbody_content = rows.map(tr_fn).join('')
			const table_content = '<thead><tr><th>my table</th></tr><tr><th>a</th><th>b</th></tr></thead><tbody>' + tbody_content + '</tbody><tfoot><tr><th>fa</th><th>fb</th></tr></tfoot>'

			const r3 = table({ id:'id1', style:{ border:'3px', color:'red' }, class:'class1 class2' }, { label:'my table', items:rows, columns:headers, footers:footers }, ercf, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<table style="border:3px;color:red;" id="id1" class="class1 class2">' + table_content + '</table>')
		} )


		it('anchor(...)=>RenderingResult with factory and sub rendering', () => {
			const r1 = anchor({ id:'id1' }, {}, erc, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<a id="id1" href="#"></a>')
			

			const r2 = anchor({ id:'id1', href:'#', style:{ border:'3px' }, class:'class1' }, {}, erc, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<a style="border:3px;" id="id1" class="class1" href="#"></a>')
			

			const r3 = anchor({ id:'id1', href:'/myapp/route1', style:{ border:'3px', color:'red' }, class:'class1 class2' }, {label:'HELLO'}, erc, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<a style="border:3px;color:red;" id="id1" class="class1 class2" href="/myapp/route1">HELLO</a>')
			
			const settings1 = { id:'id1', format:'number', style:{ border:'3px', color:'red' }, class:'class1 class2' }
			const state1 = { default:456, placeholder:'hello!!' }
			const html1 = '<div><input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" /></div>'
			const input1 = {type:'input', state:state1, settings:settings1}
			input1.toString = ()=>html1

			const r4 = anchor({ id:'id1', href:'/myapp/route1', command:'mycmd', style:{ border:'3px', color:'red' }, class:'class1 class2' }, {label:input1}, ercf, undefined)
			expect(r4).to.be.an('object')
			expect(r4.is_rendering_result).equal(true)

			expect( r4.get_vtree('id1') ).to.be.an('object')
			expect( r4.get_html('id1') ).equal('<a style="border:3px;color:red;" id="id1" class="class1 class2 devapt-command" href="/myapp/route1" data-devapt-command="mycmd">' + input1.toString() + '</a>')
			

			const r5 = anchor({ id:'id1', blank:true, href:'/myapp/route1', style:{ border:'3px', color:'red' }, class:'class1 class2' }, {label:'HELLO'}, erc, undefined)
			expect(r5).to.be.an('object')
			expect(r5.is_rendering_result).equal(true)

			expect( r5.get_vtree('id1') ).to.be.an('object')
			expect( r5.get_html('id1') ).equal('<a style="border:3px;color:red;" id="id1" class="class1 class2" href="/myapp/route1" _blank="">HELLO</a>')
		} )


		it('list(...)=>RenderingResult with factory and sub rendering (type=ul)', () => {
			const r1 = list({ id:'id1' }, {}, ercf, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<ul id="id1"></ul>')


			const r2 = list({ id:'id1', class:'class1 class2' }, {items:[], label:'HELLO!!'}, ercf, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<ul id="id1" class="class1 class2">HELLO!!</ul>')


			const settings1 = { id:'id1', format:'date', style:{ border:'3px', color:'red' }, class:'class1 class2' }
			const state1 = { default:789, placeholder:'hello!!' }
			const html1 = '<div><input style="border:3px;color:red;" type="date" id="id1" value="789" placeholder="hello!!" class="class1 class2" /></div>'
			const input1 = {type:'input', state:state1, settings:settings1}
			input1.toString = ()=>html1

			const rows = ['a1', input1, 'a2', 'b2']
			const li_fn = (cell)=>'<li>' + cell.toString() + '</li>'
			const ul_content = rows.map(li_fn).join('')

			const r3 = list({ id:'id1', type:'ul', style:{ border:'3px', color:'red' }, class:'class1 class2' }, { items:rows, label:'HELLO' }, ercf, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<ul style="border:3px;color:red;" id="id1" class="class1 class2">HELLO' + ul_content + '</ul>')
		} )


		it('list(...)=>RenderingResult with factory and sub rendering (type=ol)', () => {
			const r1 = list({ id:'id1', type:'ol' }, {}, ercf, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<ol id="id1"></ol>')


			const r2 = list({ id:'id1', type:'ol', class:'class1 class2' }, {items:[], label:'HELLO!!'}, ercf, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<ol id="id1" class="class1 class2">HELLO!!</ol>')


			const settings1 = { id:'id1', format:'number', style:{ border:'3px', color:'red' }, class:'class1 class2' }
			const state1 = { default:456, placeholder:'hello!!' }
			const html1 = '<div><input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" /></div>'
			const input1 = {type:'input', state:state1, settings:settings1}
			input1.toString = ()=>html1

			const rows = ['a1', input1, 'a2', 'b2']
			const li_fn = (cell)=>'<li>' + cell.toString() + '</li>'
			const ul_content = rows.map(li_fn).join('')

			const r3 = list({ id:'id1', type:'ol', style:{ border:'3px', color:'red' }, class:'class1 class2' }, { items:rows, label:'HELLO' }, ercf, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<ol style="border:3px;color:red;" id="id1" class="class1 class2">HELLO' + ul_content + '</ol>')
		} )


		it('image(...)=>RenderingResult', () => {
			const r1 = image({ id:'id1' }, {}, erc, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<img id="id1" />')
			

			const r2 = image({ id:'id1', source:'/myapp/myimg.jpg', alt:'my image', style:{ border:'3px' }, class:'class1' }, {}, erc, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<img style="border:3px;" id="id1" src="/myapp/myimg.jpg" alt="my image" class="class1" />')
			

			const r3 = image({ id:'id1', source:'/myapp/myimg.jpg', alt:'my image', style:{ border:'3px', color:'red' }, class:'class1 class2' }, {label:'HELLO'}, erc, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<img style="border:3px;color:red;" id="id1" src="/myapp/myimg.jpg" alt="my image" class="class1 class2" />')
		} )


		it('label(...)=>RenderingResult', () => {
			const r1 = label({ id:'id1' }, {}, erc, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<span id="id1"></span>')
			

			const r2 = label({ id:'id1', style:{ border:'3px' }, class:'class1' }, { label:'HELLO' }, erc, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<span style="border:3px;" id="id1" class="class1">HELLO</span>')
		} )


		it('hbox(...)=>RenderingResult with factory', () => {
			const r1 = hbox({ id:'id1' }, {}, ercf, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<table id="id1"><thead></thead><tbody></tbody><tfoot></tfoot></table>')
			

			const r2 = hbox({ id:'id1', style:{ border:'3px' }, class:'class1' }, {}, ercf, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<table style="border:3px;" id="id1" class="class1"><thead></thead><tbody></tbody><tfoot></tfoot></table>')
			
			const headers = [
				['a', 'b']
			]
			const rows = [
				['a1', {v:'b1'}],
				['a2', 'b2']
			]
			const td_fn = (cell)=>'<td>' + cell.toString() + '</td>'
			const tr_fn = (row)=>'<tr>' + row.map(td_fn).join('') + '</tr>'
			const tbody_content = rows.map(tr_fn).join('')
			const table_content = '<thead></thead><tbody>' + tbody_content + '</tbody><tfoot></tfoot>'

			const r3 = hbox({ id:'id1', style:{ border:'3px', color:'red' }, class:'class1 class2' }, { items:rows, columns:headers }, ercf, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<table style="border:3px;color:red;" id="id1" class="class1 class2">' + table_content + '</table>')
		} )


		it('hbox(...)=>RenderingResult with factory and sub rendering', () => {
			const settings1 = { id:'id1', format:'number', style:{ border:'3px', color:'red' }, class:'class1 class2' }
			const state1 = { default:456, placeholder:'hello!!' }
			const html1 = '<div><input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" /></div>'
			const input1 = {type:'input', state:state1, settings:settings1}
			input1.toString = ()=>html1

			const headers = [
				['a', 'b']
			]
			const footers = [
				['fa', 'fb']
			]
			const rows = [
				['a1', input1],
				['a2', 'b2']
			]
			const td_fn = (cell)=>'<td>' + cell.toString() + '</td>'
			const tr_fn = (row)=>'<tr>' + row.map(td_fn).join('') + '</tr>'
			const tbody_content = rows.map(tr_fn).join('')
			const table_content = '<thead><tr><th>my table</th></tr></thead><tbody>' + tbody_content + '</tbody><tfoot></tfoot>'

			const r3 = hbox({ id:'id1', style:{ border:'3px', color:'red' }, class:'class1 class2' }, { label:'my table', items:rows, columns:headers, footers:footers }, ercf, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<table style="border:3px;color:red;" id="id1" class="class1 class2">' + table_content + '</table>')
		} )


		it('vbox(...)=>RenderingResult with factory and sub rendering', () => {
			const settings1 = { id:'id1', format:'number', style:{ border:'3px', color:'red' }, class:'class1 class2' }
			const state1 = { default:456, placeholder:'hello!!' }
			const html1 = '<div><input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" /></div>'
			const input1 = {type:'input', state:state1, settings:settings1}
			input1.toString = ()=>html1

			const headers = [
				['a', 'b']
			]
			const footers = [
				['fa', 'fb']
			]
			const rows = [
				['a1', input1],
				['a2', 'b2']
			]
			const td_fn = (cell)=>'<td>' + cell.toString() + '</td>'
			const tr_fn = (row)=>'<tr>' + row.map(td_fn).join('') + '</tr>'
			const tbody_content = rows.map(tr_fn).join('')
			const table_content = '<thead><tr><th>my table</th></tr></thead><tbody>' + tbody_content + '</tbody><tfoot></tfoot>'

			const r3 = vbox({ id:'id1', style:{ border:'3px', color:'red' }, class:'class1 class2' }, { label:'my table', items:rows, columns:headers, footers:footers }, ercf, undefined)
			expect(r3).to.be.an('object')
			expect(r3.is_rendering_result).equal(true)

			expect( r3.get_vtree('id1') ).to.be.an('object')
			expect( r3.get_html('id1') ).equal('<table style="border:3px;color:red;" id="id1" class="class1 class2">' + table_content + '</table>')
		} )


		it('script(...)=>RenderingResult', () => {
			const r1 = script({ id:'id1' }, {}, erc, undefined)
			expect(r1).to.be.an('object')
			expect(r1.is_rendering_result).equal(true)

			expect( r1.get_vtree('id1') ).to.be.an('object')
			expect( r1.get_html('id1') ).equal('<script id="id1" type="javascript"></script>')
			

			const r2 = script({ id:'id1', language:'javascript' }, { code:'HELLO' }, erc, undefined)
			expect(r2).to.be.an('object')
			expect(r2.is_rendering_result).equal(true)

			expect( r2.get_vtree('id1') ).to.be.an('object')
			expect( r2.get_html('id1') ).equal('<script id="id1" type="javascript">HELLO</script>')
		} )
	} )
} )
