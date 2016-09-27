// NPM IMPORTS
import os from 'os'

// SERVER IMPORTS
import runtime from '../../base/runtime'
import MetricsRecord from '../base/metrics_record'



// const context = 'server/metrics/nodejs/metrics_nodejs_record'



/**
 * @file Node information metric class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsNodeJsRecord extends MetricsRecord
{
    /**
     * Metrics node record constructor.
	 * @extends MetricsRecord
	 * 
	 * @returns {nothing}
     */
	constructor()
	{
		super('nodejs')
		
		this.is_metrics_record_node  = true
	}
	
	
	
	/**
     * Executed before request processing
     */
	before()
	{
		const memory = process.memoryUsage()
		
		this.values = {
			metric:this.get_name(),
			
			hostname:os.hostname(),
			
			runtime_uid:runtime.get_uid(),
			
			ts:new Date().getTime(),
			
			process_arch:process.arch,
			process_platform:process.platform,
			
			process_uptime:process.uptime(),
			process_pid:process.pid,
			process_version:process.version,
			
			process_memory_shared:memory.rss,
			process_memory_head_total:memory.heapTotal,
			process_memory_heap_used:memory.heapUsed
		}
	}
	
	
	/**
     * Executed at each request processing iteration
     */
	iteration()
	{
		this.before()
	}
	
	
	/**
     * Executed after request processing
     */
	after()
	{
	}
}