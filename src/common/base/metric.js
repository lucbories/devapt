
/**
 * @file Metric base class.
 * 
 * Attributes:
 *  is_metric:true (boolean, invariant)
 * 
 * Methods:
 *  before
 *  after
 *  iteration
 *  get_values
 * 
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class Metric
{
    /**
     * Metric constructor (base class for all metric classes).
	 * @returns {nothing}
     */
	constructor()
	{
		this.is_metric = true
	}
	
	
	/**
     * Executed before request processing.
	 * @returns {nothing}
     */
	before()
	{
	}
	
    
	/**
     * Executed at each request processing iteration.
	 * @returns {nothing}
     */
	iteration()
	{
	}
	
    
	/**
     * Executed after request processing.
	 * @returns {nothing}
     */
	after()
	{
	}
	
    
	/**
     * Returns metrics values plain object.
	 * @returns {array}
     */
	get_values()
	{
		return undefined
	}
}
