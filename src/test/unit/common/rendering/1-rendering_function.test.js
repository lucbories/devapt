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
} )
