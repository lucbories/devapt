
import Service from './service'
import { store, config, runtime } from '../../common/store/index'



export default class RestApiModelsQueryService extends Service {
	
	let status = Service.STATUS_UNKNOW // unknow -> created -> enabled -> disabled -> enabled
	let name = null
	let app = null
	
	constructor(arg_app_name, arg_svc_name) {
		this.name = arg_svc_name
		
		if (! runtime.has_application(arg_app_name))
		{
			this.status = Service.STATUS_ERROR
			return
		}
		
		this.app = runtime.get_application(arg_app_name)
		this.status = Service.STATUS_CREATED
		enabled()
	}
	
	
	
	enable() {
		this.status = Service.STATUS_ENABLED
	}
	
	
	disable() {
		this.status = Service.STATUS_DISABLED
		
	}
}