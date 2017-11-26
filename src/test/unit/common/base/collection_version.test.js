// NPM IMPORTS
import {expect} from 'chai'
import {fromJS} from 'immutable'

// COMMON IMPORTS
import Instance from '../../../../common/base/instance'
import CollectionVersion from '../../../../common/base/collection_version'
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

class InstanceVersion extends Instance {
	constructor(arg_version, arg_collection, arg_class, arg_name, arg_settings, arg_log_context, arg_logger_manager)
	{
		super(arg_collection, arg_class, arg_name, arg_settings, arg_log_context, arg_logger_manager)
		this.version = arg_version
	}
	get_version() { return this.version }
}

class InstanceVersion2 extends Instance {
	constructor(arg_version, arg_collection, arg_class, arg_name, arg_settings, arg_log_context, arg_logger_manager)
	{
		super(arg_collection, arg_class, arg_name, arg_settings, arg_log_context, arg_logger_manager)
		this.version = arg_version
	}
	get_version2() { return this.version }
}



describe('CollectionVersion', () => {
	let logger_manager = undefined
	let logger_mock = undefined

	let instance1 = undefined
	let instance2 = undefined
	let instance3 = undefined
	let instance4 = undefined
	let instance5 = undefined
	let instance6 = undefined


	describe('CollectionVersion: Create LoggerManager and Logger instances', () => {

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


	describe('CollectionVersion: Create instances v2', () => {
		it('new InstanceVersion2()', () => {
			instance1 = new InstanceVersion2('1.0.0', 'views', 'Car',     'instance1', {}, 'context instance1', logger_manager)
			instance2 = new InstanceVersion2('1.0.1', 'views', 'Car',     'instance2', {}, 'context instance2', logger_manager)
			instance3 = new InstanceVersion2('2.1.1', 'views', 'Bicycle', 'instance3', {}, 'context instance3', logger_manager)
			instance4 = new InstanceVersion2('2.2.2', 'views', 'Bicycle', 'instance4', {}, 'context instance4', logger_manager)
			instance5 = new InstanceVersion2('3.1.0', 'views', 'Truck',   'instance5', {}, 'context instance5', logger_manager)
			instance6 = new InstanceVersion2('3.5.0', 'views', 'Truck',   'instance6', {}, 'context instance6', logger_manager)

			expect(instance1.is_instance).equal(true)
			expect(instance2.is_instance).equal(true)
			expect(instance3.is_instance).equal(true)
			expect(instance4.is_instance).equal(true)
			expect(instance5.is_instance).equal(true)
			expect(instance6.is_instance).equal(true)

			expect(instance1.get_version2()).equal('1.0.0')
			expect(instance2.get_version2()).equal('1.0.1')
			expect(instance3.get_version2()).equal('2.1.1')
			expect(instance4.get_version2()).equal('2.2.2')
			expect(instance5.get_version2()).equal('3.1.0')
			expect(instance6.get_version2()).equal('3.5.0')
			
			let collection = new CollectionVersion([instance3, instance4, instance1, instance2, instance5, instance6])
			collection.set_version_getter( (instance)=>instance.get_version2() )

			expect( collection.get_version(instance1) ).equal('1.0.0')
			expect( collection.get_version(instance2) ).equal('1.0.1')
			expect( collection.get_version(instance3) ).equal('2.1.1')
			expect( collection.get_version(instance4) ).equal('2.2.2')
			expect( collection.get_version(instance5) ).equal('3.1.0')
			expect( collection.get_version(instance6) ).equal('3.5.0')
		} )

		it('CollectionVersion: Create instances', () => {
			instance1 = new InstanceVersion('1.0.0', 'views', 'Car',     'instance1', {}, 'context instance1', logger_manager)
			instance2 = new InstanceVersion('1.0.1', 'views', 'Car',     'instance2', {}, 'context instance2', logger_manager)
			instance3 = new InstanceVersion('2.1.1', 'views', 'Bicycle', 'instance3', {}, 'context instance3', logger_manager)
			instance4 = new InstanceVersion('2.2.2', 'views', 'Bicycle', 'instance4', {}, 'context instance4', logger_manager)
			instance5 = new InstanceVersion('3.1.0', 'views', 'Truck',   'instance5', {}, 'context instance5', logger_manager)
			instance6 = new InstanceVersion('3.5.0', 'views', 'Truck',   'instance6', {}, 'context instance6', logger_manager)
			
			expect(instance1.is_instance).equal(true)
			expect(instance2.is_instance).equal(true)
			expect(instance3.is_instance).equal(true)
			expect(instance4.is_instance).equal(true)
			expect(instance5.is_instance).equal(true)
			expect(instance6.is_instance).equal(true)

			expect(instance1.get_version()).equal('1.0.0')
			expect(instance2.get_version()).equal('1.0.1')
			expect(instance3.get_version()).equal('2.1.1')
			expect(instance4.get_version()).equal('2.2.2')
			expect(instance5.get_version()).equal('3.1.0')
			expect(instance6.get_version()).equal('3.5.0')
		} )
	} )


	describe('CollectionVersion: Create collections', () => {

		it('CollectionVersion: Create empty collection', () => {
			let collection = new CollectionVersion()

			expect(collection.is_collection_base).equal(true)
			expect(collection.is_collection_version).equal(true)
			expect(collection.get_count()    ).equal(0)
			expect(collection.get_first()    ).to.be.undefined
			expect(collection.get_last()     ).to.be.undefined
			expect(collection.has(instance1) ).equal(false)
			expect(collection.find_by_name('instance1') ).to.be.undefined
			expect(collection.find_by_id('id1')         ).to.be.undefined
			expect(collection.find_by_attr('$name', 'instance1') ).to.be.undefined
			expect(collection.find_by_filter((item)=>true)       ).to.be.undefined
		} )

		it('CollectionVersion: Create empty collection and fill it', () => {
			let collection = new CollectionVersion()
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

		it('CollectionVersion: Create filled collection', () => {
			let collection = new CollectionVersion(instance1, instance2, instance3, instance4)

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

		it('CollectionVersion: Create filled collection, add, remove, add_first', () => {
			let collection = new CollectionVersion([instance1, instance2, instance3, instance4])

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
			collection.add(instance6)
			expect( collection.get_count() ).equal(5)

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

		it('CollectionVersion: Create filled collection, get_first, get_last', () => {
			let collection = new CollectionVersion([instance1, instance2, instance3, instance4])

			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance3) ).equal(true)
			expect(collection.has(instance4) ).equal(true)

			expect(collection.get_first() ).equal(instance1)
			expect(collection.get_last() ).equal(instance4)
		} )

		it('CollectionVersion: Create filled collection, get_first, get_last (other order)', () => {
			let collection = new CollectionVersion([instance3, instance4, instance1, instance2])

			expect(collection.has(instance1) ).equal(true)
			expect(collection.has(instance2) ).equal(true)
			expect(collection.has(instance3) ).equal(true)
			expect(collection.has(instance4) ).equal(true)

			expect(collection.get_first() ).equal(instance3)
			expect(collection.get_last() ).equal(instance2)
		} )

		it('CollectionVersion: Create filled collection: get_version, compare_versions', () => {
			let collection = new CollectionVersion([instance3, instance4, instance1, instance2, instance5, instance6])

			expect(collection.compare_versions('1.0.0', '1.0.1') ).equal(-1)
			expect(collection.compare_versions('1.0.0', '1.1.0') ).equal(-1)
			expect(collection.compare_versions('1.0.0', '1.1.1') ).equal(-1)
			expect(collection.compare_versions('1.0.0', '2.0.0') ).equal(-1)
			expect(collection.compare_versions('1.0.0', '2.0.1') ).equal(-1)
			expect(collection.compare_versions('1.0.0', '2.1.1') ).equal(-1)

			expect(collection.compare_versions('1.0.0', '0.0.1') ).equal(1)
			expect(collection.compare_versions('1.0.0', '0.1.1') ).equal(1)
			expect(collection.compare_versions('2.0.0', '0.1.1') ).equal(1)
			expect(collection.compare_versions('2.1.2', '2.1.1') ).equal(1)

			expect(collection.compare_versions('0.0.0', '0.0.0') ).equal(0)
			expect(collection.compare_versions('0.0.1', '0.0.1') ).equal(0)
			expect(collection.compare_versions('0.1.0', '0.1.0') ).equal(0)
			expect(collection.compare_versions('1.1.0', '1.1.0') ).equal(0)
			
			expect( collection.get_version(instance1) ).equal('1.0.0')
			expect( collection.get_version(instance2) ).equal('1.0.1')
			expect( collection.get_version(instance3) ).equal('2.1.1')
			expect( collection.get_version(instance4) ).equal('2.2.2')
			expect( collection.get_version(instance5) ).equal('3.1.0')
			expect( collection.get_version(instance6) ).equal('3.5.0')
		} )

		it('CollectionVersion: Create filled collection: get_latest_item, get_item_of_version, has_version', () => {
			instance1 = new InstanceVersion('1.0.0', 'views', 'Car',     'instance1', {}, 'context instance1', logger_manager)
			instance2 = new InstanceVersion('1.0.1', 'views', 'Car',     'instance1', {}, 'context instance2', logger_manager)
			instance3 = new InstanceVersion('2.1.1', 'views', 'Bicycle', 'instance2', {}, 'context instance3', logger_manager)
			instance4 = new InstanceVersion('2.2.2', 'views', 'Bicycle', 'instance3', {}, 'context instance4', logger_manager)
			instance5 = new InstanceVersion('3.1.0', 'views', 'Truck',   'instance1', {}, 'context instance5', logger_manager)
			instance6 = new InstanceVersion('3.5.0', 'views', 'Truck',   'instance1', {}, 'context instance6', logger_manager)

			let collection = new CollectionVersion([instance3, instance4, instance1, instance2, instance5, instance6])
			
			expect(instance1.is_instance).equal(true)
			expect(instance2.is_instance).equal(true)
			expect(instance3.is_instance).equal(true)
			expect(instance4.is_instance).equal(true)
			expect(instance5.is_instance).equal(true)
			expect(instance6.is_instance).equal(true)

			expect(instance1.get_version()).equal('1.0.0')
			expect(instance2.get_version()).equal('1.0.1')
			expect(instance3.get_version()).equal('2.1.1')
			expect(instance4.get_version()).equal('2.2.2')
			expect(instance5.get_version()).equal('3.1.0')
			expect(instance6.get_version()).equal('3.5.0')

			expect( collection.get_latest_item('instance1').get_version() ).equal('3.5.0')
			expect( collection.get_latest_item('instance2').get_version() ).equal('2.1.1')
			expect( collection.get_latest_item('instance3').get_version() ).equal('2.2.2')

			expect( collection.get_item_of_version('instance1', '1.0.0') ).equal(instance1)
			expect( collection.get_item_of_version('instance1', '1.0.1') ).equal(instance2)
			expect( collection.get_item_of_version('instance1', '3.1.0') ).equal(instance5)
			expect( collection.get_item_of_version('instance1', '3.5.1') ).equal(undefined)
			expect( collection.get_item_of_version('instance1', '3.5.0') ).equal(instance6)

			expect( collection.has_version('instance1', '1.0.0') ).equal(true)
			expect( collection.has_version('instance1', '1.0.1') ).equal(true)
			expect( collection.has_version('instance1', '3.1.0') ).equal(true)
			expect( collection.has_version('instance1', '3.5.0') ).equal(true)
			expect( collection.has_version('instance1', '2.1.1') ).equal(false)
			
			expect( collection.has_version('instance2', '2.1.1') ).equal(true)
			expect( collection.has_version('instance3', '2.1.2') ).equal(false)
		} )
	} )
} )
