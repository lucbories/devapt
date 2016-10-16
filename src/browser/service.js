import T from 'typr'
import assert from 'assert'

import Bacon from 'baconjs'
import { transform } from '../common/utils/transform'


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
		name:'render',
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
	 * Get service name.
	 * 
	 * @returns {string}
	 */
	get_name()
	{
		return this.$name
	}


	
	/**
	 * Create a timer.
	 * 
	 * @param {string}	arg_timer_name - timer unique name.
	 * @param {function} arg_timer_cb - timer callback function.
	 * @param {integer} arg_delay - timer interval integer in milliseconds.
	 * @param {boolean} arg_force_create - if true delete existing timer and recreate it (default=false).
	 * 
	 * @returns {nothing}
	 */
	create_timer(arg_timer_name, arg_timer_cb, arg_delay, arg_force_create = false)
	{
		assert( T.isString(arg_timer_name), context + ':create_timer:bad timer name string')
		assert( T.isFunction(arg_timer_cb), context + ':create_timer:bad timer callback function')
		assert( T.isNumber(arg_delay), context + ':create_timer:bad timer delay integer')
		assert( T.isBoolean(arg_force_create), context + ':create_timer:bad force create boolean')
		
		// console.log('create_timer', arg_timer_name, this.timers)
		
		if (arg_timer_name in this.timers)
		{
			// console.log(context + ':create_timer:timer exists name=' + arg_timer_name)
			if (! arg_force_create)
			{
				return
			}

			// DELETE EXISTING TIMER
			// console.log(context + ':create_timer:delete existing timer name=' + arg_timer_name)
			this.delete_timer( this.timers[arg_timer_name] )
			delete this.timers[arg_timer_name]
		}
		
		// CREATE TIMER
		// console.log(context + ':create_timer:create timer name=' + arg_timer_name)
		this.timers[arg_timer_name] = setInterval(
			arg_timer_cb,
			arg_delay
		)
	}
	
	

	/**
	 * Create a poller for the given socket operation.
	 * 
	 * @param {object} arg_poller_settings - poller settings { name:'...', interval_seconds|interval_milliseconds:number }.
	 * @param {object} arg_op_name - service operation name.
	 * @param {object} arg_credentials - session credentials.
	 * @param {object} arg_socket - service socket.
	 * @param {array} arg_op_opds - operation operands (optional)(default=[]).
	 * 
	 * @returns {nothing}
	 */
	create_poller(arg_poller_settings, arg_op_name, arg_credentials, arg_socket, arg_op_opds=[])
	{
		const self = this

		if ( T.isObject(arg_poller_settings) )
		{
			const interval_ms = T.isNumber(arg_poller_settings.interval_seconds) ? arg_poller_settings.interval_seconds * 1000 : arg_poller_settings.interval_milliseconds
			if ( T.isNumber(interval_ms) && T.isString(arg_poller_settings.name) )
			{
				console.log('create poller for operation:' + arg_op_name, arg_poller_settings.name, interval_ms)
				
				const payload = {
					request: {
						operation:arg_op_name,
						operands:arg_op_opds
					},
					credentials:arg_credentials
				}

				self.create_timer(
					arg_poller_settings.name,
					() => {
						// console.log('GLOBAL SETTINGS:create_timer svc_socket.emit', svc_path, op_name)
						arg_socket.emit(arg_op_name, payload)
					},
					interval_ms,
					false
				)
			}
		}
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
		clearInterval(arg_timer_id)
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
		const self = this
		
		// this.separate_level_1()
		// this.enter_group('load')
		
		// console.log(context + ':load: name=' + this.$name + ' settings=', arg_settings)

		let ops = DEFAULT_OPS
		
		if ('operations' in arg_settings)
		{
			ops = arg_settings['operations']
		}
		
		const pollers_settings = ('pollers' in arg_settings) ? arg_settings.pollers : undefined
		const timeline_settings = ('timeline' in arg_settings) ? arg_settings.timeline : undefined
		// console.log(context + ':load:settings.pollers=', pollers_settings)

		this.$ops = ops
		const svc_path = '/' + this.$name
		const svc_socket = io(svc_path)
		self.socket = svc_socket
		
		this.$ops.forEach(
			(operation) => {
				const op_name = operation.name
				
				
				// REPEAT EVERY xxx MILLISECONDS FOR GLOBAL SETTINGS
				if (pollers_settings && (op_name in pollers_settings))
				{
					const pollers_op_settings = pollers_settings[op_name]
					// console.log('service has poller for operation:' + op_name, pollers_op_settings)

					this.create_poller(pollers_op_settings, op_name, arg_settings.credentials, svc_socket, [])
				}

				self[op_name] = (method_cfg) => {
					// console.log(context + ':op:%s:%s:cfg=', this.get_name(), op_name, method_cfg)

					// DEFINE REQUEST PAYLOAD
					const payload = {
						request: {
							operation:op_name,
							operands: [method_cfg]
						},
						credentials:arg_settings.credentials
					}
					
					// REPEAT EVERY xxx MILLISECONDS FOR LOCAL SETTINGS
					if ( T.isObject(method_cfg) && T.isObject(method_cfg.poller) )
					{
						const poller_settings = method_cfg.poller
						this.create_poller(poller_settings, op_name, arg_settings.credentials, svc_socket, [method_cfg])
					}
					
					let stream = Bacon.fromEvent(svc_socket, op_name)

					// DEBOUNCE STREAM
					if ( T.isObject(method_cfg) && T.isNumber(method_cfg.debounce_milliseconds) )
					{
						stream = stream.debounceImmediate(method_cfg.debounce_milliseconds)
					}
					// self[op_name].in = stream

					stream.onError(
						(error) => {
							console.error(context + 'svc=' + svc_path + ':op_name=' + op_name + ':error=', error)
						}
					)

					// SEND REQUEST
					svc_socket.emit(op_name, payload)

					
					// RETURN RESPONSE STREAM
					return stream
				}

				self[op_name].timelines = {}
				// self[op_name].in = undefined


				// HAS HISTORY
				if (timeline_settings && (op_name in timeline_settings))
				{
					let timeline_op_settings_array = timeline_settings[op_name]
					if( T.isObject(timeline_op_settings_array) )
					{
						timeline_op_settings_array = [timeline_op_settings_array]
					}
					// console.log('service has poller for operation:' + op_name, pollers_op_settings)
					
					let stream = Bacon.fromEvent(svc_socket, op_name)

					timeline_op_settings_array.forEach(
						(timeline_op_settings) => {
							if ( T.isObject(timeline_op_settings) && timeline_op_settings.transform && T.isNumber(timeline_op_settings.max) && T.isString(timeline_op_settings.name) && T.isNumber(timeline_op_settings.interval_seconds))
							{
								self[op_name].timelines[timeline_op_settings.name] = {
									values:[],
									previous_ts:undefined,
									stream:new Bacon.Bus()
								}
								stream.onValue(
									(value) => {
										value = value.datas ? value.datas : value

										if ( T.isString( timeline_op_settings.transform ) || T.isNumber( timeline_op_settings.transform ) )
										{
											const field_name = timeline_op_settings.transform
											timeline_op_settings.transform = {
												"result_type":"single",
												"fields":[
													{
														"name":field_name,
														"path":field_name
													}
												]
											}
										}

										const extracted_value = transform(timeline_op_settings.transform)(value)
										// console.log(context + ':load:timeline extracted_value=', extracted_value)
										
										const timeline = self[op_name].timelines[timeline_op_settings.name]
										const ts = Date.now()
										const prev_ts = timeline.previous_ts
										
										if (!prev_ts)
										{
											timeline.previous_ts = ts
											timeline.values = [{ts:ts, value:extracted_value}]
											timeline.stream.push(timeline.values)
										}
										else if ( (ts - prev_ts) > (timeline_op_settings.interval_seconds * 1000) )
										{
											timeline.values.push({ts:ts, value:extracted_value})
											timeline.previous_ts = ts
											
											if (timeline.values.length > timeline_op_settings.max)
											{
												const too_many = timeline.values.length - timeline_op_settings.max
												timeline.values = timeline.values.slice(too_many)
											}

											timeline.stream.push(timeline.values)
										}
									}
								)
							}
						}
					)
				}
			}
		)
		
		// this.leave_group('load')
		// this.separate_level_1()
	}
}
