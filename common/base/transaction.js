
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'

import { store, config, runtime } from '../store/index'

import Instance from '../utils/instance'
import MetricDuration from './metric_duration'
import MetricHost from './metric_host'


let context = 'common/base/transaction'
let debug = debug_fn(context)



const STATUS_CREATED  = 'CREATED'
const STATUS_PREPARED = 'PREPARED'
const STATUS_EXEC_OK  = 'EXEC_OK'
const STATUS_EXEC_KO  = 'EXEC_KO'


export default class Transaction extends Instance
{
	constructor(arg_app_name, arg_svc_name, arg_tx_name, arg_settings, arg_executables)
	{
		super('transactions', 'Transaction', arg_tx_name, arg_settings)
		
		this.is_transaction = true
		this.set_executables(arg_executables)
		this.metrics = [new MetricDuration(), new MetricHost()]
		this.status = STATUS_CREATED
	}
	
	
	set_executables(arg_executables)
	{
		// ASSUME AN ARRAY
		this.executables = T.isArray(arg_executables) ? arg_executables : [arg_executables]
		
		// CHECK ARRAY ITEMS
		this.executables.forEach(
			(executable, index) => {
				assert( T.isObject(executable) && executable.is_executable, context + ':bad executable type at [' + index + ']')
			}
		)
	}
	
	
	prepare(arg_context)
	{
		this.metrics.forEach( (metric)=>{ metric.before() } )
		
		this.executables.forEach(
			(executable) => {
				executable.prepare(arg_context)
			}
		)
		
		this.results = []
		this.status = STATUS_PREPARED
	}
	
	
	execute(arg_data)
	{
		let index = 0
		try
		{
			this.executables.forEach(
				(executable) => {
					let value = executable.execute(arg_data)
					let has_error = executable.has_error()
					this.results.push(
						{
							index:index,
							result:value,
							has_error:has_error,
							error_msg:executable.get_error_msg()
						}
					)
					this.metrics.forEach( (metric)=>{ metric.iteration() } )
					
					if (has_error)
					{
						this.rollback()
						return false
					}
					
					index++
				}
			)
			
			this.commit()
			return true
		}
		catch(e)
		{
			this.rollback()
			return false
		}
	}
	
	
	commit()
	{
		this.executables.forEach(
			(executable) => {
				executable.exec_ack()
			}
		)
		this.status = STATUS_EXEC_OK
	}
	
	
	rollback()
	{
		this.executables.forEach(
			(executable) => {
				executable.exec_fail()
			}
		)
		this.status = STATUS_EXEC_KO
	}
	
	
	finish()
	{
		this.executables.forEach(
			(executable) => {
				executable.finish()
			}
		)
		
		this.metrics.forEach( (metric)=>{ metric.after() } )
	}
	
	
	get_descriptor()
	{
		let parent_desc = super.get_descriptor()
		return parent_desc
	}
	
	
	get_metrics()
	{
		let values = []
		this.metrics.forEach( (metric)=>{ values.push( metric.getvalues() ) } )
		return { $id:this.$id, $status:this.status, metrics:values }
	}
	
	
	get_results()
	{
		return this.results
	}
	
	
	get_first_result()
	{
		return this.results && this.results.length > 0 ? this.results[0] : null
	}
	
	
	get_first_error()
	{
		if ( this.results && this.results.length > 0 )
		{
			return this.results.find( (result) => { return result.has_error } )
		}
		
		return undefined
	}
}
