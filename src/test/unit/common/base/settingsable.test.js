// NPM IMPORTS
import {expect} from 'chai'
import {fromJS} from 'immutable'

// COMMON IMPORTS
import LoggerManager from '../../../../common/loggers/logger_manager'
import Settingsable from '../../../../common/base/settingsable'

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


describe('Settingsable', () => {
	let logger_manager = undefined
	let logger_mock = undefined
	let instance = undefined


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


	describe('Create Settingsable instances', () => {

		it('Create instances with empty settings', () => {
			instance = new Settingsable({}, 'settingsable context', logger_manager)

			expect(instance.has_error()).equal(false)
			expect(instance.get_error_msg()).equal(null)

			expect(logger_mock.error_str).equal(undefined)

			const settings = instance.get_settings().toJS()
			expect(settings).to.be.an('object')
			expect( Object.keys(settings) ).to.be.an('array')
			expect( Object.keys(settings).length ).equal(0)
		} )

		it('Create instances with settings { a:123, b:"abc" }', () => {
			instance = new Settingsable({ a:123, b:"abc" }, 'settingsable context', logger_manager)

			expect(instance.has_error()).equal(false)
			expect(instance.get_error_msg()).equal(null)

			expect(logger_mock.error_str).equal(undefined)

			expect(instance.get_settings().has('a')).equal(true)
			expect(instance.get_settings().has('b')).equal(true)
			expect(instance.get_settings().has('c')).equal(false)

			expect(instance.get_settings().get('a')).equal(123)
			expect(instance.get_settings().get('b')).equal('abc')
		} )

		it('Create instances with settings { a:123, b:{c:"abc", d:456} }', () => {
			instance = new Settingsable({ a:123, b:{c:"abc", d:456} }, 'settingsable context', logger_manager)

			expect(instance.has_error()).equal(false)
			expect(instance.get_error_msg()).equal(null)

			expect(logger_mock.error_str).equal(undefined)

			expect(instance.get_settings().has('a')).equal(true)
			expect(instance.get_settings().has('b')).equal(true)
			expect(instance.get_settings().has('c')).equal(false)
			expect(instance.get_settings().hasIn(['b', 'c'])).equal(true)
			expect(instance.get_settings().hasIn(['b', 'd'])).equal(true)
			expect(instance.get_settings().hasIn(['b', 'e'])).equal(false)

			expect(instance.has_setting('a')).equal(true)
			expect(instance.has_setting('b')).equal(true)
			expect(instance.has_setting('c')).equal(false)
			expect(instance.has_setting(['b', 'c'])).equal(true)
			expect(instance.has_setting(['b', 'd'])).equal(true)
			expect(instance.has_setting(['b', 'e'])).equal(false)

			expect(instance.get_settings().get('a')).equal(123)
			// expect(instance.get_settings().get('b')).equal( fromJS({c:"abc", d:456}) )
			expect(instance.get_settings().getIn(['b', 'c'])).equal("abc")
			expect(instance.get_settings().getIn(['b', 'd'])).equal(456)

			expect(instance.get_setting('a')).equal(123)
			expect(instance.get_setting(['b', 'c'])).equal("abc")
			expect(instance.get_setting(['b', 'd'])).equal(456)
			expect(instance.get_setting(['b', 'e'], 789)).equal(789)

			instance.set_setting(['b', 'c'], 987)
			expect(instance.get_setting(['b', 'c'])).equal(987)
		} )
	} )
} )
