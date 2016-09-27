// NPM IMPORTS
import {expect} from 'chai'

// COMMON IMPORTS
import LoggerManager from '../../../../common/loggers/logger_manager'
import Errorable from '../../../../common/base/errorable'

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


describe('Errorable', () => {
	let logger_manager = undefined
	let logger_mock = undefined
	let errorable = undefined


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


	describe('Create Errorable instances', () => {

		it('Create instances', () => {
			errorable = new Errorable('errorable context', logger_manager)

			expect(errorable.$has_error).equal(false)
			expect(errorable.$error_msg).equal(null)

			expect(errorable.has_error()).equal(false)
			expect(errorable.get_error_msg()).equal(null)

			expect(logger_mock.error_str).equal(undefined)
		} )

		it('error("my error")', () => {
			errorable.error('my error')

			expect(errorable.$has_error).equal(true)
			expect(errorable.$error_msg).equal('my error')

			expect(errorable.has_error()).equal(true)
			expect(errorable.get_error_msg()).equal('my error')

			expect(logger_mock.error_str).equal('errorable context:my error')
		} )
	} )
} )
