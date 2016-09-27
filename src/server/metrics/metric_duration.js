// SERVER IMPORTS
import MetricsRecord from './base/metrics_record'


/**
 * @file Duration metric class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricDuration extends MetricsRecord
{
    /**
     * MetricDuration constructor.
	 * @extends Metric
	 * @returns {nothing}
     */
	constructor()
	{
		super()
	}
	
	
	/**
     * Executed before request processing
     */
	before()
	{
		this.ts_before = Date.now()
	}
	
	
	/**
     * Executed at each request processing iteration
     */
	iteration()
	{
		this.ts_at = this.ts_at ? this.ts_at : []
		this.ts_at.push(Date.now())
	}
	
	
	/**
     * Executed after request processing
     */
	after()
	{
		this.ts_after = Date.now()
	}
	
	
	/**
     * Returns metrics values plain object
     */
	get_values()
	{
		if (! this.ts_at)
		{
			return { metric:'duration', start:this.ts_before, duration:(this.ts_after - this.ts_before) }
		}
		
		let at = []
		let prev = this.ts_before
		this.ts_at.forEach(
			(ts) => {
				at.push(ts - prev)
				prev = ts
			}
		)
		
		return { metric:'duration', start:this.ts_before, duration:(this.ts_after - this.ts_before), iterations:at }
	}
}