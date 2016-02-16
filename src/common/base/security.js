
import Errorable from './errorable'



let context = 'common/base/security'


export default class Security extends Errorable
{
	constructor(arg_log_context)
	{
		super(arg_log_context ? arg_log_context : context)
		
		this.is_security = true
	}
    
    
    error_bad_user()
    {
        this.error('bad user')
    }
    
    error_bad_credentials()
    {
        this.error('bad credentials')
    }
}