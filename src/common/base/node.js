
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../store/index'

import Instance from './instance'
import Collection from './collection'



let context = 'common/base/node'
const STATE_CREATED = 'NODE_IS_CREATED'
const STATE_REGISTERING = 'NODE_IS_REGISTERING_TO_MASTER'
const STATE_WAITING = 'NODE_IS_WAITING_ITS_SETTINGS'
const STATE_LOADING = 'NODE_IS_LOADING_ITS_SETTINGS'
const STATE_LOADED = 'NODE_HAS_LOADED_ITS_SETTINGS'
const STATE_STARTING = 'NODE_IS_STARTING'
const STATE_STARTED = 'NODE_IS_STARTED'
const STATE_STOPPING = 'NODE_IS_STOPPING'
const STATE_STOPPED = 'NODE_IS_STOPPED'
const STATE_UNREGISTERING = 'NODE_IS_UNREGISTERING_TO_MASTER'


export default class Node extends Instance
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super('nodes', 'Node', arg_name, arg_settings)
		
		this.is_node = true
		this.is_master = this.get_setting('is_master', false)
		// this.master = this.is_master ? this : this.find_master()
		
		this.servers = new Collection()
		
		this.state = STATE_CREATED
	}
	
	
	// REGISTER NODE TO MASTER
	register_to_master()
	{
		this.state = STATE_REGISTERING
		
		if (this.is_master)
		{
			
		} else{
			
		}
		
		this.state = STATE_WAITING
	}
	
	
	// NODE IS LOADING ITS SETTINGS
	loading_settings(arg_settings)
	{
		this.state = STATE_LOADING
		
		this.state = STATE_LOADED
	}
	
	
	// NODE IS STARTING
	start()
	{
		this.state = STATE_STARTING
		
		this.state = STATE_STARTED
	}
	
	
	// NODE IS STOPPING
	stop()
	{
		this.state = STATE_STOPPING
		
		this.state = STATE_STOPPED
	}
	
	
	// REGISTER NODE TO MASTER
	unregister_to_master()
	{
		this.state = STATE_UNREGISTERING
		
		if (this.is_master)
		{
			
		} else{
			
		}
		
		this.state = STATE_CREATED
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
	
	
	get_assets_file(arg_file_name)
	{
		return new Promise()
	}
}
