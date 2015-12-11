
import T from 'typr'
import assert from 'assert'
import express from 'express'

import Server from '../base/server'



let context = 'common/server/express_server'


export default class ExpressServer extends Server
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_express_server = true
	}
	
	
	build_server()
	{
		this.enter_group('build_server')
		
		
		assert( this.server_protocole == 'http' || this.server_protocole == 'https', context + ':bad protocole for express [' + this.server_protocole + ']')
		
		// CREATE SERVER
		this.server = express();
		
		
		this.leave_group('build_server')
	}
}
