
// import T from 'typr'
import assert from 'assert'
import express from 'express'
// import helmet from 'helmet'
import favicon from 'express-favicon'

import runtime from '../base/runtime'
import Server from './server'
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
		this.server = express()
		
		
		// USE SECURITY MIDDLEWARE (https://www.npmjs.com/package/helmet)
		// this.server.use(helmet)
		
		
		// USE METRICS MIDDLEWARE
		this.server.use( MetricsMiddleware.create_middleware(this) )
		
		
		// USE FAVICON MIDDLEWARE
		const favicon_path = runtime.context.get_absolute_path('../public/assets/img/favico.png')
		// console.log(favicon_path, 'favicon_path')
		this.server.use( favicon(favicon_path) )
		
		
		// USE AUTHENTICATION MIDDLEWARES
		this.authentication.apply_middlewares(this)
		
		
		// TODO: USE AUTHORIZATION MIDDLEWARE
		// this.server.use( this.authorization.create_middleware() )
		
		
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
