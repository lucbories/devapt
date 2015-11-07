
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'
import restify from 'restify'
import express from 'express'

import Instance from './instance'
// import runtime from './runtime'
import { store, config } from '../store/index'



let context = 'common/base/server'
let debug = debug_fn(context)


const SERVER_TYPE_EXPRESS = 'express'
const SERVER_TYPE_RESTIFY = 'restify'

export default class Server extends Instance
{
	constructor(arg_name, arg_settings)
	{
		super('servers', 'Server', arg_name, arg_settings, context)
		
		this.is_server = true
		this.server_host = null
		this.server_port = null
		this.server_protocole = null
		this.server_type = null
	}
	
	load()
	{
		this.enter_group('load')
		
		assert( T.isObject(this.$settings), context + ':bad settings object')
		
		const cfg = config()
		
		// SET SERVER HOST
		this.server_host = this.$settings.has('host') ? this.$settings.get('host') : null
		if ( ! this.server_host && cfg.hasIn(['servers', 'default', 'host']) )
		{
			this.server_host = cfg.getIn(['servers', 'default', 'host'])
		}
		assert( T.isString(this.server_host), context + ':bad server host string')
		
		// SET SERVER PORT
		this.server_port = this.$settings.has('port') ? this.$settings.get('port') : null
		if ( ! this.server_port && cfg.hasIn(['servers', 'default', 'port']) )
		{
			this.server_port = cfg.getIn(['servers', 'default', 'port'])
		}
		assert( T.isNumber(this.server_port), context + ':bad server port string')
		
		// SET SERVER PROTOCOLE
		this.server_protocole = this.$settings.has('protocole') ? this.$settings.get('protocole') : null
		if ( ! this.server_protocole && cfg.hasIn(['servers', 'default', 'protocole']) )
		{
			this.server_protocole = cfg.getIn(['servers', 'default', 'protocole'])
		}
		assert( T.isString(this.server_protocole), context + ':bad server protocole string')
		
		// SET SERVER TYPE
		this.server_type = this.$settings.has('type') ? this.$settings.get('type') : null
		if ( ! this.server_type && cfg.hasIn(['servers', 'default', 'type']) )
		{
			this.server_type = cfg.getIn(['servers', 'default', 'type'])
		}
		assert( T.isString(this.server_type), context + ':bad server type string')
		
		// BUILD SERVER
		switch(this.server_type)
		{
			case SERVER_TYPE_EXPRESS: {
				this.build_express_server()
				break
			}
			case SERVER_TYPE_RESTIFY: {
				this.build_restify_server()
				break
			}
			default:{
				assert(false, context + ':bad server type [' + this.server_type + ']')
			}
		}
		
		this.leave_group('load')
	}
	
	
	build_restify_server()
	{
		assert( this.server_protocole == 'http' || this.server_protocole == 'https', context + ':bad protocole for restify [' + this.server_protocole + ']')
		
		// CREATE REST SERVER
		this.server = restify.createServer();
		let server = this.server
		
		
		// SET MIDDLEWARES
		
		// TODO: LOAD MIDDLEWARES FROM SETTINGS
		
		// var acceptable = server.acceptable.concat(['application/x-es-module */*', 'application/x-es-module']);
		// console.log(acceptable, 'acceptable');
		// server.use(restify.acceptParser(acceptable));
		server.use(restify.acceptParser(server.acceptable));
		
		server.use(restify.authorizationParser());
		server.use(restify.queryParser());
		server.use(restify.jsonp());
		server.use(restify.gzipResponse());
		server.use(restify.bodyParser());
		server.use(restify.requestLogger());
		
		
		// ERROR HANDLING
		server.on('InternalServerError',
			function (req, res, err, cb)
			{
				console.error(err, 'Internal server error');
				err._customContent = 'something is wrong!';
				return cb();
			}
		)
		
		
		// SET URL
		this.server_url = this.server_protocole + '//' + this.server_host + ':' + this.server_port
	}
	
	
	build_express_server()
	{
		assert( this.server_protocole == 'http' || this.server_protocole == 'https', context + ':bad protocole for express [' + this.server_protocole + ']')
		
		// CREATE SERVER
		this.server = express();
		
		// TODO: BUILD EXPRESS SERVER
	}
	
	
	enable()
	{
		const name = this.$name
		const host = this.server_host
		const port = this.server_port
		let listener = this.server.listen(this.server_port,
			function()
			{
				// let host = listener.address().address;
				// let port = listener.address().port;
				console.info('%s listening at %s : %s', name, host, port);
			}
		)
	}
	
	
	disable()
	{
		
	}
}
