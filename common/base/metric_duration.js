
import Metric from './metric'


export default class MetricDuration extends Metric
{
	constructor()
	{
		super()
	}
	
	
	before()
	{
		this.ts_before = Date.now()
	}
	
	
	iteration()
	{
		this.ts_at = this.ts_at ? this.ts_at : []
		this.ts_at.push(Date.now())
	}
	
	
	after()
	{
		this.ts_after = Date.now()
	}
	
	
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