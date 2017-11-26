// NPM IMPORTS
import T from 'typr'
<<<<<<< HEAD:src/common/metrics/http/metrics_http_record.js
// import assert from 'assert'
=======
>>>>>>> develop:src/server/metrics/http/metrics_http_record.js
import uuid from 'uuid'

// SERVER IMPORTS
import MetricsRecord from '../base/metrics_record'



// const context = 'server/metrics/http/metrics_http_record'



/**
 * Metric class for HTTP servers.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricsHttpRecord extends MetricsRecord
{
    /**
     * MetricsHttpRecord constructor.
	 * @extends Metric
	 * 
     * @param {object}  Http request object (Request class instance).
     * @param {object}  Http response object (Response class instance).
	 * 
	 * @returns {nothing}
     */
	constructor(arg_request, arg_response)
	{
		super('http')
		
		this.is_metrics_http_record  =true
		
		this.server = undefined
		
		this.req = arg_request
		this.res = arg_response
		
		this.req.devapt_metrics = this
		this.res.devapt_metrics = this
	}
	
    
	/**
     * Executed before request processing.
	 * 
	 * @returns {nothing}
     */
	before()
	{
		// REQUEST VERSION
		this.values.version = require('../../../../package.json').version
	
		// IDENTIFICATION
		this.values.metric = 'http'
		this.values.id = this.get_id()
		this.values.pid = this.get_pid()
		
		// DURATION
		this.values.ts_begin = Date.now()
		this.values.ts_end = null
		this.values.latency = null
	
		// SERVICE IDENTIFICATION
		this.values.service = {}
		this.values.service.name = 'unknow service'
		this.values.service.url = this.req.originalUrl || this.req.url
		this.values.service.method = this.req.method
		this.values.service.http_version = this.req.httpVersion 
		this.values.service.route = this.req.route ? this.req.route.path : 'unknown route'
		
		// SERVER IDENTIFICATION
		this.values.server = {}
		this.values.server.node_name = null
		this.values.server.server_name = null
	
		// CLIENT IDENTIFICATION
		this.values.client = {}
		this.values.client.ip = this.get_ip()
		this.values.client.port = this.get_port()
		this.values.client.security_token = null
		this.values.client.user_name = this.req.user_name || null
		this.values.client.user_id = null
		this.values.client.browser = this.req.headers['user-agent']
		this.values.client.referrer = this.req.headers['referer'] || this.req.headers['referrer']
	
		// RESPONSE
		this.values.response = {}
		this.values.response.status = null
	}
	
	
	/**
     * Executed at each request processing iteration.
	 * 
	 * @returns {nothing}
     */
	iteration()
	{
	}
	
	
	/**
     * Executed after request processing.
	 * 
	 * @returns {nothing}
     */
	after()
	{
		this.values.ts_end = Date.now()
		
		this.values.response.status = this.res.statusCode

		this.values.latency = this.get_latency()
		
		// this.values.server.node_name = this.server.node.get_name()
		// this.values.server.server_name = this.server.get_name()
	}
    
	
	/**
     * Returns process id.
	 * 
	 * @returns {string} - process PID.
     */
	get_pid()
	{
		return process.pid
	}
	
	
	/**
     * Returns request id or a self generated unique id.
	 * 
	 * @returns {string} - request ID.
     */
	get_id()
	{
		return ( T.isFunction(this.req.getId) && this.req.getId() )
			|| ( this.req.id && T.isFunction(this.req.id) && this.req.id() )
			|| this.req.id
			|| uuid.v1()
	}
	
	
	/**
     * Returns client ip address or undefined.
	 * 
	 * @returns {string} - server IP.
     */
	get_ip()
	{
		return this.req.ip
			|| this.req._remoteAddress
			|| (this.req.connection && this.req.connection.remoteAddress)
			|| undefined
	}
	
	
	/**
     * Returns client port or undefined.
	 * 
	 * @returns {string} - server port.
     */
	get_port()
	{
		return (this.req.connection && this.req.connection.remotePort)
			|| undefined
	}
	
	
	/**
     * Returns client security token or undefined.
	 * 
	 * @returns {string} - security token.
     */
	get_token()
	{
		return this.req.secure
			|| undefined
	}
	
	/**
     * Returns processing latency (response time).
	 * 
	 * @returns {string} - request processing latency.
     */
	get_latency()
	{
		var latency = this.res.get('Response-Time')
		if ( typeof (latency) !== 'number' )
			latency = this.values.ts_end - this.values.ts_begin
		
		return latency
	}
}



// RESTIFY AUDIT FORMAT
/*
const r = {
	"name":"audit","hostname":"LFR000867",
	"pid":6552,"audit":true,
	"level":30,
	"remoteAddress":"::ffff:127.0.0.1","remotePort":58229,
	"req_id":"8d407e4e-5ee7-4c46-b7e9-e046d268a4c7",
	"req":{
		"method":"GET","url":"/tutorial-rest/api/v1/views/",
		"headers":{
			"user-agent":"curl/7.30.0",
			"host":"localhost:8080",
			"accept":'* / *'
		},
		"httpVersion":"1.1",
		"trailers":{},
		"version":"* ",
		"timers":{
			"parseAccept":78,"parseAuthorization":5,"parseQueryString":19,"_jsonp":153,"gzip":43,"readBody":21,
			"parseBody":9,"bunyan":39,"rateLimit":175,"exec_http":1763
		}
	},
	"res":{
		"statusCode":200,
		"headers":{
			"content- type":"application/ json",
			"content- length":662
		},
		"trailer":false
	},
	"latency":0,
	"_audit":true,
	"msg":"handled: 200",
	"time":"2015- 12 - 17T16: 10:00.583Z",
	"v":0
}
*/