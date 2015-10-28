
import Service from './service'
import { store, config, runtime } from '../../common/store/index'



export default class RestApiModelsQueryService extends Service
{
	constructor(arg_app_name, arg_svc_name)
	{
		super(arg_app_name, arg_svc_name)
	}
	
	
	
	enable()
	{
		if ( ! super.enable() )
		{
			return false
		}
		
		// LOOP ON MODELS
		let applications = runtime.get_applications();
		applications.forEach(
			(app_name) => {
				let app_config = runtime.get_application(app_name)
				
				// LOOP ON MODELS
				let models_ids = app_config.getIn('instances', 'by_type')
				models_ids.forEach(
					(model_id) => {
						let model_instance = app_config.getIn('instances', 'by_id', model_id)
						// TO FINISH
					}
				)
			}
		)
		
		return true
	}
	
	
	disable()
	{
		if ( ! super.enable() )
		{
			return false
		}
		
		return true
	}
}
