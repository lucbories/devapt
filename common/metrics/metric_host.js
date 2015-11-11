
import Metric from '../base/metric'


export default class MetricHost extends Metric
{
	constructor()
	{
		super()
	}
	
	
	before()
	{
	}
	
	
	iteration()
	{
	}
	
	
	after()
	{
	}
	
	
	get_values()
	{
		return { metric:'host', os:'os', engine:'engine' }
	}
}