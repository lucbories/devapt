// NPM IMPORTS
import assert from 'assert'
import restify from 'restify'

// SERVER IMPORTS
import Server from './server'
import MetricsMiddleware from '../metrics/http/metrics_http_collector'


let context = 'server/servers/restify_server'



/**
 * @file Restify server class.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class RestifyServer extends Server
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super(arg_name, 'RestifyServer', arg_settings, arg_context ? arg_context : context)
		
		this.is_restify_server = true
	}
	
	
	build_server()
	{
		this.enter_group('build_server')
		
		assert( this.server_protocole == 'http' || this.server_protocole == 'https', context + ':bad protocole for restify [' + this.server_protocole + ']')
		
		// CREATE REST SERVER
		const server_settings = {}
		this.server = restify.createServer(server_settings)
		let server = this.server

		
		// METRICS MIDDLEWARE
		server.use( MetricsMiddleware.create_middleware(this) )


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
		
        
        
		
		// TODO: LOAD MIDDLEWARES FROM SETTINGS
		
		
		// SET MIDDLEWARES
		const throttle_settings = {
			burst: 100,
			rate: 50,
			ip: true,
			overrides: {
				'192.168.1.1': {
					rate: 0,        // unlimited
					burst: 0
				}
			}
		}
		
		// var acceptable = server.acceptable.concat(['application/x-es-module */*', 'application/x-es-module']);
		// console.log(acceptable, 'acceptable');
		// server.use(restify.acceptParser(acceptable));
		server.use( restify.acceptParser(server.acceptable) )
		
		server.use( restify.authorizationParser()) 
		server.use( restify.queryParser() )
		server.use( restify.jsonp() )
		server.use( restify.gzipResponse() )
		server.use( restify.bodyParser() )
		server.use( restify.requestLogger() )
		server.use( restify.throttle(throttle_settings) )
		
        
		// ERROR HANDLING
		server.on('InternalServerError',
			function (req, res, err, cb)
			{
				console.error(err, 'Internal server error');
				err._customContent = 'something is wrong!';
				return cb();
			}
		)
		
        
		// ENABLE / DISABLE AUDIT LOGS
		// const audit_settings = {
		// 	log: bunyan.createLogger(
		// 		{
		// 			name: 'audit',
		// 			stream: process.stdout
		// 		}
		// 	)
		// }
		// server.on('after', restify.auditLogger(audit_settings) )
		
		
		// SET URL
		this.server_url = this.server_protocole + '//' + this.server_host + ':' + this.server_port
		
		
		this.leave_group('build_server')
	}
}
