
// const context = 'server/metrics/base/metrics_record'



/**
 * @file Metrics record base class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsRecord
{
    /**
     * Metrics record constructor.
	 * 
	 * @params {string} arg_metrics_name - metrics series name ('http', 'host'...)
	 * 
	 * @returns {nothing}
     */
	constructor(arg_metrics_name)
	{
		this.is_metrics_record  = true
		
		this.name = arg_metrics_name
		this.values = {}
		
		// METRIC TYPE
		this.values.metric = this.get_name()
	}
	
	
	
	/**
     * Executed before request processing.
	 * 
	 * @returns {nothing}
     */
	before()
	{
	}
	
	
	
	/**
     * Executed at each request processing iteration.
	 * 
	 * @returns {nothing}
     */
	iteration()
	{
	}
	
	
	
	/**
     * Executed after request processing.
	 * 
	 * @returns {nothing}
     */
	after()
	{
	}
	
	
	
	/**
     * Returns metrics series name.
	 * 
	 * @returns {string} - name
     */
	get_name()
	{
		return this.name
	}
	
	
	
	/**
     * Returns metrics values plain object.
	 * 
	 * @returns {object} - values map plain object
     */
	get_values()
	{
		return this.values
	}
}