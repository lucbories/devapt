
import Metric from '../base/metric'


/**
 * @file Host information metric class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricHost extends Metric
{
    /**
     * MetricHost constructor.
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
	}
	
	
	/**
     * Executed at each request processing iteration
     */
	iteration()
	{
	}
	
	
	/**
     * Executed after request processing
     */
	after()
	{
	}
	
	
	/**
     * Returns metrics values plain object
     */
	get_values()
	{
		return { metric:'host', os:'os', engine:'engine' }
	}
}