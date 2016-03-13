
/**
 * Metric base class
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
 */
export default class Metric
{
    /**
     * Metric constructor (base class for all metric classes)
     */
	constructor()
	{
		this.is_metric = true
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
		return undefined
	}
}