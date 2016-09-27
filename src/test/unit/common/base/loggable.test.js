// NPM IMPORTS
import {expect} from 'chai'

// COMMON IMPORTS
import LoggerManager from '../../../../common/loggers/logger_manager'
import Loggable from '../../../../common/base/loggable'

// TEST IMPORTS
import LoggerMock from './logger_mock'



class Loggable_1 extends Loggable
{
	constructor(arg_context, arg_logger_manager)
	{
		super(arg_context, arg_logger_manager)
	}
	get_class()
	{
		return 'Loggable_1'
	}
	get_name()
	{
		return 'loggable_1'
	}
}

class Loggable_2 extends Loggable
{
	constructor(arg_context, arg_logger_manager)
	{
		super(arg_context, arg_logger_manager)
	}
	get_class()
	{
		return 'Loggable_2'
	}
	get_name()
	{
		return 'loggable_2'
	}
}

class Loggable_3 extends Loggable
{
	constructor(arg_context, arg_logger_manager)
	{
		super(arg_context, arg_logger_manager)
	}
	get_class()
	{
		return 'Loggable_3'
	}
	get_name()
	{
		return 'loggable_3'
	}
}


const loggers_settings = {
	"loggers":{
		"winston":{
			"transports":{
				"file_1":{
					"type":"file",
					"level": "debug",
					"filename": "../../../../test/tmp/test_unit_loggable.log",
					"maxsize":100000,
					"maxFiles":2
				},
				"console_1":{
					"type":"console",
					"level":"debug"
				}
			}
		},
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


describe('Loggable', () => {
	let logger_manager = undefined
	let loggable = undefined
	let loggable_1 = undefined
	let loggable_2 = undefined
	let loggable_3 = undefined
	let logger_mock = undefined


	describe('Create LoggerManager and Logger instances', () => {

		it('new LoggerManager(settings)', () => {
			logger_manager = new LoggerManager(loggers_settings.loggers)
		} )

		it('TEST logger_manager.is_logger_manager', () => {
			expect(logger_manager).to.have.property('is_logger_manager')
			expect(logger_manager.is_logger_manager).equal(true)
		} )

		it('TEST logger_manager.loggers', () => {
			expect(logger_manager.loggers.length).equal(1)
		} )

		it('TEST logger_manager.*_trace()', () => {
			expect(logger_manager.get_trace()).equal(true)
			logger_manager.set_trace(false)
			expect(logger_manager.get_trace()).equal(false)
			logger_manager.toggle_trace()
			expect(logger_manager.get_trace()).equal(true)
		} )

		it('TEST LoggerMock', () => {
			logger_mock = new LoggerMock(false)
			logger_manager.loggers.push(logger_mock)
			expect(logger_manager.get_trace()).equal(false)
			logger_mock.enable_trace()
			expect(logger_manager.get_trace()).equal(true)
		} )
	} )


	describe('Create Loggable instances', () => {

		it('Create instances', () => {
			loggable   = new Loggable('loggable context', logger_manager)
			loggable_1 = new Loggable_1('loggable_1 context', logger_manager)
			loggable_2 = new Loggable_2('loggable_2 context', logger_manager)
			loggable_3 = new Loggable_3('loggable_3 context', logger_manager)
		} )

		it('TEST loggable.get_class', () => {
			expect(loggable.get_class()).equal('Loggable')
			expect(loggable_1.get_class()).equal('Loggable_1')
			expect(loggable_2.get_class()).equal('Loggable_2')
			expect(loggable_3.get_class()).equal('Loggable_3')
		} )

		it('TEST loggable.get_name', () => {
			expect(loggable.get_name()).equal('Loggable instance')
			expect(loggable_1.get_name()).equal('loggable_1')
			expect(loggable_2.get_name()).equal('loggable_2')
			expect(loggable_3.get_name()).equal('loggable_3')
		} )

		it('TEST loggable.is_loggable', () => {
			expect(loggable).to.contain.keys('is_loggable')
			expect(loggable.is_loggable).equal(true)
		} )

		it('TEST loggable_1.is_loggable', () => {
			expect(loggable_1).to.have.property('is_loggable')
			expect(loggable_1.is_loggable).equal(true)
		} )

		it('TEST loggable_1.$context', () => {
			expect(loggable_1).to.contain.keys('$context')
			expect(loggable_1.$context).equal('loggable_1 context')
		} )

		it('TEST loggable_1.logger_manager', () => {
			expect(loggable_1).to.have.property('logger_manager')
			expect(loggable_1.logger_manager).equal(logger_manager)
		} )
	} )


	describe('Loggable trace management', () => {
		it('TEST loggable.get_trace() at creation', () => {
			expect(loggable.get_trace()).equal(true)
		} )

		it('TEST loggable.disable_trace()', () => {
			loggable.disable_trace()
			expect(loggable.get_trace()).equal(false)
		} )

		it('TEST loggable.enable_trace()', () => {
			loggable.enable_trace()
			expect(loggable.get_trace()).equal(true)
		} )

		it('TEST loggable.toggle_trace()', () => {
			loggable.toggle_trace()
			expect(loggable.get_trace()).equal(false)
		} )

		it('TEST loggable.set_trace(true)', () => {
			loggable.set_trace(true)
			expect(loggable.get_trace()).equal(true)
		} )

		it('TEST loggable.set_trace(false)', () => {
			loggable.set_trace(false)
			expect(loggable.get_trace()).equal(false)
		} )

		it('TEST loggable.update_trace_enabled()', () => {
			loggable.update_trace_enabled()
			expect(loggable.get_trace()).equal(false)
		} )

		it('TEST Reset loggable.is_trace_enabled to true', () => {
			loggable.set_trace(true)
			expect(loggable.get_trace()).equal(true)
		} )
	} )


	describe('Should trace ?', () => {
		
		it('Should trace - step 1', () => {
			const traces_settings = {
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
			expect( loggable.should_trace(traces_settings)   ).equal(false)
			expect( loggable_1.should_trace(traces_settings) ).equal(false)
			expect( loggable_2.should_trace(traces_settings) ).equal(false)
			expect( loggable_3.should_trace(traces_settings) ).equal(false)
		} )
		
		it('Should trace - step 2', () => {
			const traces_settings = {
				"modules":{
					".*":true
				},
				
				"classes":{
					".*":false
				},
				
				"instances":{
					".*":false
				}
			}
			expect( loggable.should_trace(traces_settings)   ).equal(true)
			expect( loggable_1.should_trace(traces_settings) ).equal(true)
			expect( loggable_2.should_trace(traces_settings) ).equal(true)
			expect( loggable_3.should_trace(traces_settings) ).equal(true)
		} )
		
		it('Should trace - step 3',
			() => {
				const traces_settings = {
					"modules":{
						".*":false
					},
					
					"classes":{
						".*":true
					},
					
					"instances":{
						".*":false
					}
				}
				expect( loggable.should_trace(traces_settings)   ).equal(true)
				expect( loggable_1.should_trace(traces_settings) ).equal(true)
				expect( loggable_2.should_trace(traces_settings) ).equal(true)
				expect( loggable_3.should_trace(traces_settings) ).equal(true)
			}
		)
		
		it('Should trace - step 4',
			() => {
				const traces_settings = {
					"modules":{
						".*":false
					},
					
					"classes":{
						".*":false
					},
					
					"instances":{
						".*":true
					}
				}
				expect( loggable.should_trace(traces_settings)   ).equal(true)
				expect( loggable_1.should_trace(traces_settings) ).equal(true)
				expect( loggable_2.should_trace(traces_settings) ).equal(true)
				expect( loggable_3.should_trace(traces_settings) ).equal(true)
			}
		)
		
		it('Should trace - step 5',
			() => {
				const traces_settings = {
					"modules":{
						".*":true
					},
					
					"classes":{
						".*":false
					},
					
					"instances":{
						".*":true
					}
				}
				expect( loggable.should_trace(traces_settings)   ).equal(true)
				expect( loggable_1.should_trace(traces_settings) ).equal(true)
				expect( loggable_2.should_trace(traces_settings) ).equal(true)
				expect( loggable_3.should_trace(traces_settings) ).equal(true)
			}
		)
		
		it('Should trace - step 6',
			() => {
				const traces_settings = {
					"modules":{
						".*":true
					},
					
					"classes":{
						".*":true
					},
					
					"instances":{
						".*":true
					}
				}
				expect( loggable.should_trace(traces_settings)   ).equal(true)
				expect( loggable_1.should_trace(traces_settings) ).equal(true)
				expect( loggable_2.should_trace(traces_settings) ).equal(true)
				expect( loggable_3.should_trace(traces_settings) ).equal(true)
			}
		)
		
		it('Should trace - step 7',
			() => {
				const traces_settings = {
					"modules":{
						".*":true
					},
					
					"classes":{
						".*":true
					},
					
					"instances":{
						".*":false
					}
				}
				expect( loggable.should_trace(traces_settings)   ).equal(true)
				expect( loggable_1.should_trace(traces_settings) ).equal(true)
				expect( loggable_2.should_trace(traces_settings) ).equal(true)
				expect( loggable_3.should_trace(traces_settings) ).equal(true)
			}
		)
		
		it('Should trace - step 8',
			() => {
				const traces_settings = {
					"modules":{
						".*":false
					},
					
					"classes":{
						".*":true
					},
					
					"instances":{
						".*":true
					}
				}
				expect( loggable.should_trace(traces_settings)   ).equal(true)
				expect( loggable_1.should_trace(traces_settings) ).equal(true)
				expect( loggable_2.should_trace(traces_settings) ).equal(true)
				expect( loggable_3.should_trace(traces_settings) ).equal(true)
			}
		)
		
		it('Should trace - step 9',
			() => {
				const traces_settings = {
					"modules":{
						".*":false
					},
					
					"classes":{
						"Loggable_1":true,
						"Loggable_2":false,
						".*":false
					},
					
					"instances":{
						"loggable_3":true,
						".*":false
					}
				}
				expect( loggable.should_trace(traces_settings)   ).equal(false)
				expect( loggable_1.should_trace(traces_settings) ).equal(true)
				expect( loggable_2.should_trace(traces_settings) ).equal(false)
				expect( loggable_3.should_trace(traces_settings) ).equal(true)
			}
		)
		
		it('Should trace - step 10',
			() => {
				const traces_settings = {
					"modules":{
						".*":false
					},
					
					"classes":{
						"Loggable_2":true,
						"Loggable_1":false,
						".*":false
					},
					
					"instances":{
						"loggable_1":true,
						".*":false
					}
				}
				expect( loggable.should_trace(traces_settings)   ).equal(false)
				expect( loggable_1.should_trace(traces_settings) ).equal(true)
				expect( loggable_2.should_trace(traces_settings) ).equal(true)
				expect( loggable_3.should_trace(traces_settings) ).equal(false)
			}
		)
		
		it('Should trace - step 11',
			() => {
				const traces_settings = {
					"modules":{
						".*":false
					},
					
					"classes":{
						"Loggable_2":true,
						"Loggable_1":false,
						".*":true
					},
					
					"instances":{
						"loggable_1":true,
						".*":false
					}
				}
				expect( loggable.should_trace(traces_settings)   ).equal(true)
				expect( loggable_1.should_trace(traces_settings) ).equal(true)
				expect( loggable_2.should_trace(traces_settings) ).equal(true)
				expect( loggable_3.should_trace(traces_settings) ).equal(true)
			}
		)
	} )


	describe('LoggerMock trace management', () => {
		it('TEST logger_mock.debug(...)', () => {
			logger_mock.debug('test ABC')
			expect(logger_mock.debug_str).equal('test ABC')
		} )
		
		it('TEST logger_mock.info(...)', () => {
			logger_mock.info('test ABC')
			expect(logger_mock.info_str).equal('test ABC')
		} )
		
		it('TEST logger_mock.warn(...)', () => {
			logger_mock.warn('test ABC')
			expect(logger_mock.warn_str).equal('test ABC')
		} )
		
		it('TEST logger_mock.error(...)', () => {
			logger_mock.error('test ABC')
			expect(logger_mock.error_str).equal('test ABC')
		} )
	} )


	describe('Loggable trace management with 1 arg', () => {

		it('TEST loggable.debug(...)', () => {
			loggable.debug('test ABC')
			expect(logger_mock.debug_str).equal('loggable context' + ':' + 'test ABC')
		} )
		
		it('TEST loggable.info(...)', () => {
			loggable.info('test ABC')
			expect(logger_mock.info_str).equal('loggable context' + ':' + 'test ABC')
		} )
		
		it('TEST loggable.warn(...)', () => {
			loggable.warn('test ABC')
			expect(logger_mock.warn_str).equal('loggable context' + ':' + 'test ABC')
		} )
		
		it('TEST loggable.error(...)', () => {
			loggable.error('test ABC')
			expect(logger_mock.error_str).equal('loggable context' + ':' + 'test ABC')
		} )
	} )


	describe('Loggable trace management with 2 args', () => {

		it('TEST loggable.debug(...)', () => {
			loggable.debug('test ABC', 'test DEF')
			expect(logger_mock.debug_str).equal('loggable context' + ':' + 'test ABC' + ':' + 'test DEF')
		} )
		
		it('TEST loggable.info(...)', () => {
			loggable.info('test ABC', 'test DEF')
			expect(logger_mock.info_str).equal('loggable context' + ':' + 'test ABC' + ':' + 'test DEF')
		} )
		
		it('TEST loggable.warn(...)', () => {
			loggable.warn('test ABC', 'test DEF')
			expect(logger_mock.warn_str).equal('loggable context' + ':' + 'test ABC' + ':' + 'test DEF')
		} )
		
		it('TEST loggable.error(...)', () => {
			loggable.error('test ABC', 'test DEF')
			expect(logger_mock.error_str).equal('loggable context' + ':' + 'test ABC' + ':' + 'test DEF')
		} )
	} )


	describe('Loggable trace management for groups', () => {
		
		it('TEST loggable.enter_group(group)', () => {
			loggable.enter_group('test ABC')
			expect(logger_mock.info_str).equal('loggable context' + ':' + '[test ABC] ------- ENTER -------')
		} )
		
		it('TEST loggable.leave_group(group)', () => {
			loggable.leave_group('test ABC')
			expect(logger_mock.info_str).equal('loggable context' + ':' + '[test ABC] ------- LEAVE -------')
		} )
	} )


	describe('Loggable trace management for separators', () => {

		it('TEST loggable.separate_level_1()', () => {
			loggable.separate_level_1()
			expect(logger_mock.info_str).equal('loggable context' + ':' + '==========================================================================================================================')
		} )
		
		it('TEST loggable.separate_level_2()', () => {
			loggable.separate_level_2()
			expect(logger_mock.info_str).equal('loggable context' + ':' + '--------------------------------------------------------------------------------------------------------------------------')
		} )
		
		it('TEST loggable.separate_level_3()', () => {
			loggable.separate_level_3()
			expect(logger_mock.info_str).equal('loggable context' + ':' + '*************************************************************************************************************************')
		} )
	} )
} )
