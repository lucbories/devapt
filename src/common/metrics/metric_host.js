
import Metric from '../base/metric'


export default class MetricHost extends Metric
{
    /**
     * MetricHost constructor
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