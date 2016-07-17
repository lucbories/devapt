import T from 'typr'
import assert from 'assert'

import Bacon from 'baconjs'


let context = 'browser/service'


/**
 * Service operations.
 */
const DEFAULT_OPS = [
	{
		name:'ping',
		operands:[]
	},
	{
		name:'get',
		operands:[]
	},
	{
		name:'post',
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
	 * 
	 * @param {string} arg_svc_name - service name.
	 * @param {object} arg_svc_settings - service settiings.
	 * 
	 * @returns {nothing}
	 */
	constructor(arg_svc_name, arg_svc_settings)
	{
		this.$name = arg_svc_name
		this.is_service = true
		
		// MAP OF POLLING TIMERS: name => timer id
		this.timers = {}
		
		this.load(arg_svc_settings)
	}
	
	
	
	/**
	 * Create a timer.
	 * 
	 * @param {string}	arg_timer_name - timer unique name.
	 * @param {function} arg_timer_cb - timer callback function.
	 * @param {integer} arg_delay - timer interval integer.
	 * 
	 * @returns {nothing}
	 */
	create_timer(arg_timer_name, arg_timer_cb, arg_delay)
	{
		assert( T.isString(arg_timer_name), context + ':create_timer:bad timer name string')
		assert( T.isFunction(arg_timer_cb), context + ':create_timer:bad timer callback function')
		assert( T.isNumber(arg_delay), context + ':create_timer:bad timer delay integer')
		
		// console.log('create_timer', arg_timer_name)
		
		if (arg_timer_name in this.timers)
		{
			this.delete_timer( this.timers[arg_timer_name] )
		}
		
		this.timers[arg_timer_name] = setInterval(
			arg_timer_cb,
			arg_delay
		)
	}
	
	
	
	/**
	 * Delete a timer.
	 * 
	 * @param {any}	arg_timer_id.
	 * 
	 * @returns {nothing}
	 */
	delete_timer(arg_timer_id)
	{
		clearTimeout(arg_timer_id)
	}
	
	
	
	/**
	 * Load runtime settings.
	 * 
	 * @param {object} arg_settings - runtime settings.
	 * 
	 * @returns {object} promise
	 */
	load(arg_settings)
	{
		// this.separate_level_1()
		// this.enter_group('load')
		
		// console.log(context + ':load:settings=', arg_settings)

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
					// DEFINE REQUEST PAYLOD
					const payload = {
						request: {
							operation:op_name,
							operands:[value]
						},
						credentials:arg_settings.credentials
					}
					
					// SEND REQUEST
					svc_socket.emit(op_name, payload)
					
					// REPEAT EVERY xxx MILLISECONDS
					if ( T.isObject(value) && T.isNumber(value.poll_interval) && T.isString(value.poll_name) )
					{
						// console.log('create timer for operation:' + op_name, value.poll_name, value.poll_interval)
						this.create_timer(
							value.poll_name,
							() => {
								svc_socket.emit(op_name, payload)
								// console.log('create_timer svc_socket.emit', op_name)
							},
							value.poll_interval
						)
					}
					
					// RETURN RESPONSE STREAM
					return self[op_name].in
				}
				
				self[op_name].in = Bacon.fromEvent(svc_socket, op_name)
			}
		)
		
		// this.leave_group('load')
		// this.separate_level_1()
	}
}
