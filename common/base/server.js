
import T from 'typr'
import assert from 'assert'
import debug_fn from 'debug'
import restify from 'restify'
import express from 'express'
import fs from 'fs'
import path from 'path'
import bunyan from 'bunyan'

import Instance from './instance'

import { store, config } from '../store/index'



let context = 'common/base/server'
let debug = debug_fn(context)


const SERVER_TYPE_EXPRESS = 'express'
const SERVER_TYPE_RESTIFY = 'restify'

export default class Server extends Instance
{
	constructor(arg_name, arg_settings, arg_context)
	{
		super('servers', 'Server', arg_name, arg_settings, arg_context ? arg_context : context)
		
		this.is_server = true
		this.is_build = false
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
		// console.log(this.build_server)
		// console.log(typeof (this.build_server) )
		assert( T.isFunction(this.build_server), context + ':bad build_server function')
		this.build_server()
		this.is_build = true
		
		super.load()
		
		
		this.leave_group('load')
	}
	
	
	enable()
	{
		const name = this.$name
		const host = this.server_host
		const port = this.server_port
		
		let should_listen = true
		
		// LISTENER
		if (should_listen)
		{
			/*let listener =*/ this.server.listen(this.server_port,
				function()
				{
					// let host = listener.address().address;
					// let port = listener.address().port;
					console.info('%s listening at %s : %s', name, host, port);
				}
			)
		}
	}
	
	
	disable()
	{
		
	}
	
	
	static create(arg_type, arg_name, arg_settings)
	{
		// BUILD SERVER
		switch(arg_type)
		{
			case SERVER_TYPE_EXPRESS: {
				const ExpressServer = require('../servers/express_server')
				return new ExpressServer(arg_name, arg_settings)
			}
			case SERVER_TYPE_RESTIFY: {
				const RestifyServer = require('../servers/restify_server')
				return new RestifyServer(arg_name, arg_settings)
			}
			default:{
				assert(false, context + ':bad server type [' + arg_type + '] for name [' + arg_name + ']')
			}
		}
	}
}

/*
		const has_cluster = this.$settings.has('workers')
		
		// CLUSTER
		if (has_cluster)
		{
			var cluster = require('cluster');
			var numCPUs = require('os').cpus().length;
			
			// const workers = this.$settings.get('workers')
			// const min_workers = this.workers.min || 1;
			// const max_workers = this.workers.max || 3;
			// const method_workers = this.workers.method || 'roundrobin';
			
			should_listen = ! cluster.isMaster
			
			if (cluster.isMaster)
			{
				// Fork workers.
				for(var i = 0; i < numCPUs; i++)
				{
					cluster.fork()
				}
				
				cluster.on('exit',
					function(worker, code, signal)
					{
						console.log('worker ' + worker.process.pid + ' died')
					}
				)
			}
		}
*/