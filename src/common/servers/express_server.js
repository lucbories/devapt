
// import T from 'typr'
import assert from 'assert'
import express from 'express'
// import helmet from 'helmet'
import favicon from 'express-favicon'

import runtime from '../base/runtime'
import Server from '../base/server'
import MetricsMiddleware from '../metrics/metric_http'



let context = 'common/servers/express_server'


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
		
		
		// USE SECURITY MIDDLEWARE (https://www.npmjs.com/package/helmet)
		// this.server.use(helmet)
		
		 
		// USE METRICS MIDDLEWARE
		this.server.use( MetricsMiddleware.create_middleware(this) )
		
		
		// USE AUTHENTICATION MIDDLEWARE
		// runtime.security.get_authentication_manager().apply_on_server(this)
		this.server.use( runtime.security.get_authentication_manager().create_middleware(this) )
		// this.server.use( runtime.security.get_authentication_manager().create_auth_middleware(this) )
		
		
		// TODO: USE AUTHORIZATION MIDDLEWARE
		// AuthorizationManager.apply_on_server(this)
		
		
		// DEFAULT VIEW ENGINE
		// this.server.use( express.bodyParser() )
		const favicon_path = runtime.context.get_absolute_path('../public/assets/img/favico.png')
		console.log(favicon_path, 'favicon_path')
		this.server.use( favicon(favicon_path) )
		// this.server.set('view engine', 'html')
		
		
		this.leave_group('build_server')
	}
	
	finaly()
	{
		// USE BAD REQUEST MIDDLEWARE
		this.server.use(
			function(err, req, res, next)
			{
				if (req.xhr)
				{
					res.status(500).send( { error: 'Something failed!' } );
				}
				else
				{
					next(err)
				}
			}
		)
		
		
		// USE ERROR MIDDLEWARE
		this.server.use(
			function(err, req, res/*, next*/)
			{
				console.error(err.stack)
				res.status(500)
				res.render('error', { error: err } )
			}
		)
		
	}
}
