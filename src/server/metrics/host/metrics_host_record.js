// NPM IMPORTS
import os from 'os'

// SERVER IMPORTS
import MetricsRecord from '../base/metrics_record'



// const context = 'server/metrics/host/metrics_host_record'



/**
 * @file Host information metric class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsHostRecord extends MetricsRecord
{
    /**
     * Metrics host record constructor.
	 * @extends MetricsRecord
	 * 
	 * @returns {nothing}
     */
	constructor()
	{
		super('host')
		
		this.is_metrics_record_host  = true
	}
	
	
	
	/**
     * Executed before request processing
     */
	before()
	{
		const cpus = os.cpus()
		
		const cpus_user_mean = cpus.reduce( (prev = 0, current/*, index, all*/) => prev + current.times.user, 0) / cpus.length
		const cpus_nice_mean = cpus.reduce( (prev = 0, current/*, index, all*/) => prev + current.times.nice, 0) / cpus.length
		const cpus_sys_mean = cpus.reduce(  (prev = 0, current/*, index, all*/) => prev + current.times.sys,  0) / cpus.length
		const cpus_idle_mean = cpus.reduce( (prev = 0, current/*, index, all*/) => prev + current.times.idle, 0) / cpus.length
		const cpus_irq_mean = cpus.reduce(  (prev = 0, current/*, index, all*/) => prev + current.times.irq,  0) / cpus.length
		
		this.values = {
			metric:'host',
			
			hostname:os.hostname(),
			ts:new Date().getTime(),
			
			cpus_arch:os.arch(),
			cpus_count:cpus.length,
			
			cpus_user:cpus_user_mean,
			cpus_nice:cpus_nice_mean,
			cpus_sys:cpus_sys_mean,
			cpus_idle:cpus_idle_mean,
			cpus_irq:cpus_irq_mean
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