// NPM IMPORTS
import {expect} from 'chai'
import {fromJS} from 'immutable'

// COMMON IMPORTS
import Instance from '../../../../common/base/instance'
import Collection from '../../../../common/base/collection'
import LoggerManager from '../../../../common/loggers/logger_manager'

// TEST IMPORTS
import LoggerMock from './logger_mock'


const loggers_settings = {
	"loggers":{
		"traces":{
			"modules":{
				".*":false
			},
			
			"classes":{
				".*":false
			},
			
			"instances":{
				".*":false
			}
		}
	}
}



describe('Collection', () => {
	let logger_manager = undefined
	let logger_mock = undefined

	let instance1 = undefined
	let instance2 = undefined
	let instance3 = undefined
	let instance4 = undefined
	let instance5 = undefined
	let instance6 = undefined


	describe('Create LoggerManager and Logger instances', () => {

		it('new LoggerManager(settings)', () => {
			logger_manager = new LoggerManager(loggers_settings.loggers)
		} )

		it('new LoggerMock()', () => {
			logger_mock = new LoggerMock(false)
			logger_manager.loggers.push(logger_mock)
			expect(logger_manager.get_trace()).equal(false)
			logger_mock.enable_trace()
			expect(logger_manager.get_trace()).equal(true)
		} )
	} )


	describe('Create instances', () => {
		it('new Instance()', () => {
			instance1 = new Instance('views', 'Car',     'instance1', {}, 'context instance1', logger_manager)
			instance2 = new Instance('views', 'Car',     'instance2', {}, 'context instance2', logger_manager)
			instance3 = new Instance('views', 'Bicycle', 'instance3', {}, 'context instance3', logger_manager)
			instance4 = new Instance('views', 'Bicycle', 'instance4', {}, 'context instance4', logger_manager)
			instance5 = new Instance('views', 'Truck',   'instance5', {}, 'context instance5', logger_manager)
			instance6 = new Instance('views', 'Truck',   'instance6', {}, 'context instance6', logger_manager)
			
			expect(instance1.is_instance).equal(true)
			expect(instance2.is_instance).equal(true)
			expect(instance3.is_instance).equal(true)
			expect(instance4.is_instance).equal(true)
			expect(instance5.is_instance).equal(true)
			expect(instance6.is_instance).equal(true)
		} )
	} )


	describe('Create collections', () => {

		it('Create empty collection', () => {
			let collection = new Collection()

			expect(collection.is_collection_base).equal(true)
			expect(collection.is_collection  ).equal(true)
			expect(collection.get_count()    ).equal(0)
			expect(collection.get_first()    ).to.be.undefined
			expect(collection.get_last()     ).to.be.undefined
			expect(collection.has(instance1) ).equal(false)
			expect(collection.find_by_name('instance1') ).to.be.undefined
			expect(collection.find_by_id('id1')         ).to.be.undefined
			expect(collection.find_by_attr('$name', 'instance1') ).to.be.undefined
			expect(collection.find_by_filter((item)=>true)       ).to.be.undefined
		} )

		it('Create empty collection and fill it', () => {
			let collection = new Collection()
			collection.set_all([instance1, instance2])

			expect(collection.get_count()    ).equal(2)
			expect(collection.get_first()    ).equal(instance1)
			expect(collection.get_last()     ).equal(instance2)

			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance3) ).equal(false)

			expect(collection.find_by_name('instance1') ).equal(instance1)
			expect(collection.find_by_name('instance2') ).not.equal(instance1)
			expect(collection.find_by_name('instance9') ).to.be.undefined

			expect(collection.find_by_id(instance1.get_id())     ).equal(instance1)
			expect(collection.find_by_id(instance2.get_id())     ).equal(instance2)
			expect(collection.find_by_id('id1')         ).to.be.undefined

			expect(collection.find_by_attr('$name', 'instance1') ).equal(instance1)
			expect(collection.find_by_attr('$class', 'Cars') ).to.be.undefined
			expect(collection.find_by_attr('$class', 'Car') ).equal(instance1)
			expect(collection.find_by_attr('badattribute', 'test') ).to.be.undefined

			expect(collection.find_by_filter((item)=>true)       ).equal(instance1)

			expect(collection.filter_by_attr('$class', 'Cars') ).to.be.empty
			expect(collection.filter_by_attr('$class', 'Car')  ).to.have.lengthOf(2)

			expect(collection.filter_by_filter((item)=>false)   ).to.be.empty
			expect(collection.filter_by_filter((item)=>true)   ).to.have.lengthOf(2)
		} )

		it('Create filled collection', () => {
			let collection = new Collection(instance1, instance2, instance3, instance4)

			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance3) ).equal(true)
			expect(collection.has(instance4) ).equal(true)
			expect(collection.has(instance5) ).equal(false)
			
			expect(collection.find_by_attr('$class', 'Cars') ).to.be.undefined
			expect(collection.find_by_attr('$class', 'Car') ).equal(instance1)
			expect(collection.find_by_attr('$class', 'Bicycle') ).equal(instance3)
			expect(collection.find_by_attr('$class', 'Truck') ).to.be.undefined

			expect(collection.filter_by_attr('$class', 'Cars') ).to.be.empty
			expect(collection.filter_by_attr('$class', 'Car')  ).to.have.lengthOf(2)
			expect(collection.filter_by_attr('$class', 'Bicycle')  ).to.have.lengthOf(2)
			expect(collection.filter_by_attr('$class', 'Truck')  ).to.have.lengthOf(0)
		} )

		it('Create filled collection, add, remove, add_first', () => {
			let collection = new Collection([instance1, instance2, instance3, instance4])

			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance3) ).equal(true)
			expect(collection.has(instance4) ).equal(true)
			expect(collection.has(instance5) ).equal(false)
			
			expect(collection.find_by_attr('$class', 'Car') ).equal(instance1)

			expect(collection.filter_by_attr('$class', 'Cars') ).to.be.empty
			expect(collection.filter_by_attr('$class', 'Car')  ).to.have.lengthOf(2)
			expect(collection.filter_by_attr('$class', 'Bicycle')  ).to.have.lengthOf(2)
			expect(collection.filter_by_attr('$class', 'Truck')  ).to.have.lengthOf(0)

			collection.remove(instance3)

			expect(collection.find_by_attr('$class', 'Car') ).equal(instance1)

			expect(collection.filter_by_attr('$class', 'Cars') ).to.be.empty
			expect(collection.filter_by_attr('$class', 'Car')  ).to.have.lengthOf(2)
			expect(collection.filter_by_attr('$class', 'Bicycle')  ).to.have.lengthOf(1)
			expect(collection.filter_by_attr('$class', 'Truck')  ).to.have.lengthOf(0)

			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance3) ).equal(false)
			expect(collection.has(instance4) ).equal(true)
			expect(collection.has(instance5) ).equal(false)

			collection.add(instance5)
			collection.add(instance5)
			expect( collection.get_count() ).equal(4)

			expect(collection.filter_by_attr('$class', 'Cars') ).to.be.empty
			expect(collection.filter_by_attr('$class', 'Car')  ).to.have.lengthOf(2)
			expect(collection.filter_by_attr('$class', 'Bicycle')  ).to.have.lengthOf(1)
			expect(collection.filter_by_attr('$class', 'Truck')  ).to.have.lengthOf(1)

			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance3) ).equal(false)
			expect(collection.has(instance4) ).equal(true)
			expect(collection.has(instance5) ).equal(true)

			collection.add_first(instance6)

			expect(collection.filter_by_attr('$class', 'Cars') ).to.be.empty
			expect(collection.filter_by_attr('$class', 'Car')  ).to.have.lengthOf(2)
			expect(collection.filter_by_attr('$class', 'Bicycle')  ).to.have.lengthOf(1)
			expect(collection.filter_by_attr('$class', 'Truck')  ).to.have.lengthOf(2)

			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance3) ).equal(false)
			expect(collection.has(instance4) ).equal(true)
			expect(collection.has(instance5) ).equal(true)
			expect(collection.has(instance6) ).equal(true)

			expect(collection.find_by_attr('$class', 'Truck') ).equal(instance6)
		} )

		it('Create filled collection, get_first, get_last', () => {
			let collection = new Collection([instance1, instance2, instance3, instance4])

			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance3) ).equal(true)
			expect(collection.has(instance4) ).equal(true)

			expect(collection.get_first() ).equal(instance1)
			expect(collection.get_last() ).equal(instance4)
		} )

		it('Create filled collection, get_first, get_last (other order)', () => {
			let collection = new Collection([instance3, instance4, instance1, instance2])

			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance3) ).equal(true)
			expect(collection.has(instance4) ).equal(true)

			expect(collection.get_first() ).equal(instance3)
			expect(collection.get_last() ).equal(instance2)
		} )
	} )
} )
