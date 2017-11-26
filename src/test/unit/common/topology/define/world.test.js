// NPM IMPORTS
import {expect} from 'chai'

// COMMON IMPORTS
import runtime from '../../../../../server/base/runtime'
import TopologyDefineWorld from '../../../../../common/topology/define/topology_define_world'



const empty_world = {
	"nodes":{},
	
	"tenants":{},

	"security":{},

	"plugins":{},
	
	"loggers":{},
	
	"traces":{}
}

const plain_world = require('./world.test.json')


describe('TopologyDefineWorld', () => {
	let world_item = undefined
	let logger_mock = undefined
	let errorable = undefined


	describe('Create world', () => {

		it('new TopologyDefineWorld(...): empty world', () => {
			world_item = new TopologyDefineWorld('myworld', empty_world, runtime)
			expect(world_item).to.be.a('object')
			expect(world_item.is_topology_define_world).equal(true)
			expect(world_item.get_name()).equal('myworld')
		} )

		it('new TopologyDefineWorld(...): world from plain object', () => {
			world_item = new TopologyDefineWorld('myworld2', plain_world, runtime)
			expect(world_item).to.be.a('object')
			expect(world_item.is_topology_define_world).equal(true)
			expect(world_item.get_name()).equal('myworld2')
		} )
			
		it('world.nodes() before load', () => {
			expect(world_item.nodes()).is.an('object')
			expect(world_item.nodes().single).is.a('string')
			expect(world_item.nodes().plural).is.a('string')
			expect(world_item.nodes().item_class).is.a('function')
			expect(world_item.nodes().latest).is.an('object')
			expect(world_item.nodes().versions).is.an('object')
			
			expect(world_item.nodes().latest.get_count()).equal(0)
			expect(world_item.nodes().versions.get_count()).equal(0)
			expect(world_item.nodes().latest.is_collection).equal(true)
			expect(world_item.nodes().versions.is_collection).equal(true)
		} )
			
		it('world.load()', () => {
			return world_item.load()
		} )
			
		it('world.nodes() after load', () => {
			expect(world_item.nodes().latest.get_count()).equal(1)
			expect(world_item.nodes().versions.get_count()).equal(1)

			let first = world_item.nodes().latest.get_first()
			expect(first).is.an('object')
			expect(first.get_name()).equal('NodeA')
			expect(first.servers()).is.an('object')
			expect(first.servers().latest.is_collection).equal(true)
			expect(first.servers().versions.is_collection).equal(true)

			first = world_item.nodes().versions.get_first()
			expect(first).is.an('object')
			expect(first.get_name()).equal('NodeA')
			expect(first.servers()).is.an('object')
			expect(first.servers().latest.is_collection).equal(true)
			expect(first.servers().versions.is_collection).equal(true)
		} )
			
		it('world.tenants() after load', () => {
			expect(world_item.tenants().latest.get_count()).equal(2)
			expect(world_item.tenants().versions.get_count()).equal(2)

			let first = world_item.tenants().latest.get_first()
			expect(first).is.an('object')

			expect(first.get_name()).equal('TenantA')
			expect(first.applications()).is.an('object')
			expect(first.applications().latest.is_collection).equal(true)
			expect(first.applications().versions.is_collection).equal(true)
			expect(first.applications().latest.get_count()).equal(0)

			expect(first.packages()).is.an('object')
			expect(first.packages().latest.is_collection).equal(true)
			expect(first.packages().versions.is_collection).equal(true)
			expect(first.packages().latest.get_count()).equal(0)

			let second = world_item.tenants().latest.get_last()
			expect(second).is.an('object')
			expect(second.get_name()).equal('TenantB')

			expect(second.applications()).is.an('object')
			expect(second.applications().latest.is_collection).equal(true)
			expect(second.applications().versions.is_collection).equal(true)
			expect(second.applications().latest.get_count()).equal(1)
			expect(second.applications().latest.get_first().get_name()).equal('ApplicationA')

			expect(second.packages()).is.an('object')
			expect(second.packages().latest.is_collection).equal(true)
			expect(second.packages().versions.is_collection).equal(true)
			expect(second.packages().latest.get_count()).equal(1)
			expect(second.packages().latest.get_first().get_name()).equal('PackageA')
		} )
			
		it('world.get_topology_info()', () => {
			const info = world_item.get_topology_info(true)
			world_item.dump_topology_info(info, '  ', '', console.info)
		} )
	} )
} )
