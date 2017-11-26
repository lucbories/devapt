// NPM IMPORTS
import chai from 'chai'

const expect = chai.expect

// COMMON IMPORTS
import * as Rendering from '../../../../common/rendering/index'

const RenderingResult = Rendering.RenderingResult
const factory     = Rendering.rendering_factory
const f           = Rendering.rendering_function
const input_field = Rendering.input_field
const button      = Rendering.button
const table       = Rendering.table
const anchor      = Rendering.anchor
const list        = Rendering.list
const image       = Rendering.image
const label       = Rendering.label
const hbox        = Rendering.hbox
const vbox        = Rendering.vbox
const menubar     = Rendering.menubar
const script      = Rendering.script
const page        = Rendering.page
const tabs        = Rendering.tabs
const container   = Rendering.container



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
		const html1 = '<input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" />'
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
		const html1 = '<input style="border:3px;color:red;" type="number" id="id1" value="456" placeholder="hello!!" class="class1 class2" />'
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
} )
