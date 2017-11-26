// NPM IMPORTS
import assert from 'assert'
import express from 'express'
import http from 'http'
import socketio from 'socket.io'
import compression from 'compression'
// import helmet from 'helmet'
import favicon from 'express-favicon'

// SERVER IMPORTS
import runtime from '../base/runtime'
import Server from './server'
import MetricsMiddleware from '../metrics/http/metrics_http_collector'


let context = 'server/servers/express_server'



/**
 * @file Express server class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class ExpressServer extends Server
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, 'ExpressServer', arg_settings, arg_context ? arg_context : context)
		
		this.is_express_server = true
		
		this.serverio = null
	}
	
	
	build_server()
	{
		this.enter_group('build_server')
		
		
		assert( this.server_protocole == 'http' || this.server_protocole == 'https', context + ':bad protocole for express [' + this.server_protocole + ']')
		
		// CREATE SERVER
		this.server = express()
		
		// USE COMPRESSED RESPONSE WITH GZIP
		this.server.use(compression())
		
		// USE SECURITY MIDDLEWARE (https://www.npmjs.com/package/helmet)
		// this.server.use(helmet)
		this.server.disable('x-powered-by')
		
		
		// USE METRICS MIDDLEWARE
		this.server.use( MetricsMiddleware.create_middleware(this) )
		
		
		// USE FAVICON MIDDLEWARE
		const favicon_path = runtime.context.get_absolute_path('../public/assets/img/favico.png')
		// console.log(favicon_path, 'favicon_path')
		this.server.use( favicon(favicon_path) )
		
		
		// BUILD SOCKETIO
		const use_socketio = this.get_setting('use_socketio', false)
		
		if (use_socketio)
		{
			// console.log(context + ':creating socket io')
			
			this.server_http = http.Server(this.server)
			this.serverio = socketio(this.server_http)
			
			runtime.add_socketio(this.get_name(), this.serverio)
		}

		
		// USE ALL MIDDLEWARES WITHOUT SECURITY
		this.services_without_security.forEach(
			(arg_record) => {
				arg_record.svc.activate_on_server(arg_record.app, this, arg_record.cfg)
			}
		)


		// USE AUTHENTICATION MIDDLEWARES
		this.authentication.apply_middlewares(this)
		
		
		// TODO: USE AUTHORIZATION MIDDLEWARE
		// this.server.use( this.authorization.create_middleware() )
		

		// USE ALL MIDDLEWARES WITH SECURITY
		this.services_with_security.forEach(
			(arg_record) => {
				arg_record.svc.activate_on_server(arg_record.app, this, arg_record.cfg)
			}
		)

		
		// DEFAULT VIEW ENGINE
		// this.server.use( express.bodyParser() )
		this.server.set('views', runtime.context.get_absolute_path('jade'))
		this.server.set('view engine', 'jade')
		
		
		this.leave_group('build_server')
	}
	
	finaly()
	{
		// USE FILE NOT FOUND MIDDLEWARE
		this.server.use(
			function(req, res/*, next*/)
			{
				console.log('EXPRESS: FILE NOT FOUND', req.url)
				
				res.status(404)

				// SEND HTML RESPONSE
				if (req.accepts('html'))
				{
					res.render('404', { url: req.url })
					return
				}

				// SEND JSON RESPONSE
				if (req.accepts('json'))
				{
					res.send({ error: 'Not found' })
					return
				}

				// SEND PLAIN TEXT RESPONSE
				res.type('txt').send('Not found')
			}
		)
		
		
		// USE BAD REQUEST MIDDLEWARE
		this.server.use(
			function(err, req, res, next)
			{
				// !!! RES COULD BE A http.ServerResponse AND NOT A Express.Response INSTANCE
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
				console.log(req.url, 'request.url')
				console.error(err.stack)
				res.status(500)
				res.render('error', { error: err } )
			}
		)
		
	}
}
