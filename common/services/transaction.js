import { store, config, runtime } from '../../common/store/index'

import Instance from '../utils/instance'



export default class Transaction extends Instance
{
	constructor(arg_app_name, arg_svc_name, arg_tx_name)
	{
		super('transactions', 'Transaction', arg_tx_name)
	}
	
	
	prepare()
	{
		
	}
	
	
	commit()
	{
		
	}
	
	
	rollback()
	{
		
	}
	
	
	get_descriptor()
	{
		let parent_desc = super.get_descriptor()
		return parent_desc
	}
}
