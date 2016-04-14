// import T from 'typr'
// import assert from 'assert'

import Bacon from 'baconjs'


// let context = 'browser/service'



const DEFAULT_OPS = [
	{
		name:'get',
		operands:[]
	},
	{
		name:'subscribe',
		operands:[]
	},
	
	// REMOTE LOGGERS
	{
		name:'debug',
		operands:[]
	},
	{
		name:'info',
		operands:[]
	},
	{
		name:'warn',
		operands:[]
	},
	{
		name:'error',
		operands:[]
	},
	
	// CRUD
	{
		name:'read',
		operands:[]
	},
	{
		name:'update',
		operands:[]
	},
	{
		name:'delete',
		operands:[]
	},
	{
		name:'create',
		operands:[]
	},
	{
		name:'patch',
		operands:[]
	},
	{
		name:'list',
		operands:[]
	}
]



/**
 * @file client Service class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Service
{
	/**
	 * Create a client Runtime instance.
	 * @param {string} arg_svc_name - service name
	 * @param {object} arg_svc_settings - service settiings
	 * @returns {nothing}
	 */
	constructor(arg_svc_name, arg_svc_settings)
	{
		this.$name = arg_svc_name
		this.is_service = true
		
		this.load(arg_svc_settings)
	}
	
	
	/**
	 * Load runtime settings.
	 * @param {object} arg_settings - runtime settings
	 * @returns {object} promise
	 */
	load(arg_settings)
	{
		// this.separate_level_1()
		// this.enter_group('load')
		
		let ops = DEFAULT_OPS
		
		if ('operations' in arg_settings)
		{
			ops = arg_settings['operations']
		}
		
		this.$ops = ops
		const self = this
		const svc_path = '/' + this.$name
		const svc_socket = io(svc_path)
		self.socket = svc_socket
		
		this.$ops.forEach(
			(operation) => {
				const op_name = operation.name
				
				self[op_name] = (value) => {
					const payload = {
						request: {
							operation:op_name,
							operands:[value]
						}
					}
					svc_socket.emit(op_name, payload)
					return self[op_name].in
				}
				
				self[op_name].in = Bacon.fromEvent(svc_socket, op_name)
			}
		)
		
		
		// this.leave_group('load')
		// this.separate_level_1()
	}
}
