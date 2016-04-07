
// import T from 'typr'
import assert from 'assert'
// import socketio from 'socket.io'

import Server from './server'



let context = 'common/servers/socketio_server'


export default class SocketIOServer extends Server
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, 'SocketIOServer', arg_settings, arg_context ? arg_context : context)
		
		this.is_socketio_server = true
	}
	
	
	build_server()
	{
		this.enter_group('build_server')
		
		
		assert( this.server_protocole == 'http' || this.server_protocole == 'https', context + ':bad protocole for socketio [' + this.server_protocole + ']')
		
		// CREATE SERVER
		// this.server = express(); //TODO 
		
		
		this.leave_group('build_server')
	}
}
