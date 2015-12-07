
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../store/index'

import Instance from './instance'



let context = 'common/base/node'


export default class Node extends Instance
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('nodes', 'Node', arg_name, arg_settings)
		
		this.is_node = true
		this.is_master = this.get_setting('is_master', false)
		this.master = this.is_master ? this : this.find_master()
	}
	
	
	// MASTER METHODS
	find_master()
	{
		
	}
	
	
	promote_master()
	{
		
	}
	
	
	revoke_master()
	{
		
	}
}
