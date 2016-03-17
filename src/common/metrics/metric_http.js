
import T from 'typr'
import assert from 'assert'
import uuid from 'node-uuid'

import Metric from '../base/metric'


/**
 * Metric class for HTTP servers.
 * @author Luc BORIES
 * @license Apache-2.0
 */
export default class MetricHttp extends Metric
{
    /**
     * MetricHttp constructor.
	 * @extends Metric
     * @param {object}  Http request object (Request class instance)
     * @param {object}  Http response object (Response class instance)
	 * @returns {nothing}
     */
	constructor(arg_request, arg_response)
	{
		super()
		
		this.is_metric_http  =true
		
		this.metrics = {}
		this.req = arg_request
		this.res = arg_response
		this.req.devapt_metrics = this
		this.res.devapt_metrics = this
	}
	
    
	/**
     * Executed before request processing
     */
	before()
	{
		// REQUEST VERSION
		this.metrics.version = require('../../../package.json').version
	
		// IDENTIFICATION
		this.metrics.metric = 'http'
		this.metrics.id = this.get_id()
		this.metrics.pid = this.get_pid()
		
		// DURATION
		this.metrics.ts_begin = Date.now()
		this.metrics.ts_end = null
		this.metrics.latency = null
	
		// SERVICE IDENTIFICATION
		this.metrics.service = {}
		this.metrics.service.name = null
		this.metrics.service.url = this.req.originalUrl || this.req.url
		this.metrics.service.method = this.req.method
		this.metrics.service.http_version = this.req.httpVersion 
		this.metrics.service.route = this.req.route ? this.req.route.path : 'unknown route'
		
		// SERVER IDENTIFICATION
		this.metrics.server = {}
		this.metrics.server.node_name = null
		this.metrics.server.server_name = null
	
		// CLIENT IDENTIFICATION
		this.metrics.client = {}
		this.metrics.client.ip = this.get_ip()
		this.metrics.client.port = this.get_port()
		this.metrics.client.security_token = null
		this.metrics.client.user_name = this.req.user_name || null
		this.metrics.client.user_id = null
		this.metrics.client.browser = this.req.headers['user-agent']
		this.metrics.client.referrer = this.req.headers['referer'] || this.req.headers['referrer']
	
		// RESPONSE
		this.metrics.response = {}
		this.metrics.response.status = null
	}
	
	
	/**
     * Executed at each request processing iteration
     */
	iteration()
	{
	}
	
	
	/**
     * Executed after request processing
     */
	after()
	{
		this.metrics.ts_end = Date.now()
		
		this.metrics.response.status = this.res.statusCode

		this.metrics.latency = this.get_latency()
		
		this.metrics.server.node_name = this.server.get_name()
		this.metrics.server.server_name = this.server.node.get_name()
        
        this.server.send_metrics(this.metrics.metric, this.metrics)
        
		// console.log(this.metrics, 'request metrics')
	}
	
    
	/**
     * Returns metrics values plain object
     */
	get_values()
	{
		return this.metrics
	}
	
	
	/**
     * Executed before main request processing
     * {object}   server object (Server base class instance)
     */
	static create_middleware(arg_server)
	{
        // HANDLE END OF REQUEST PROCESSING FOR RESTIFY SERVER
		if (arg_server.is_restify_server)
		{
			arg_server.server.on('after',
				function (req, res)
				{
					// console.log('MetricHttp middleware on finish')
					
					let metric = req.devapt_metrics
                    // console.log(metric, 'metric')
                    
                    if (metric)
                    {
					   metric.after()
                    }
                    
                    // console.log('MetricHttp middleware on finish, leave')
				}
			)
		}
		
        
        // MIDDLEWARE FUNCTION
		return function(req, res, next)
		{
			// console.log('MetricHttp middleware created')
			
			let metric = new MetricHttp(req, res)
            metric.server = arg_server
			metric.before()
			
			// HANDLE END OF REQUEST PROCESSING FOR EXPRESS SERVER
			if (arg_server.is_express_server)
			{
				res.on('finish',
					function ()
					{
						// console.log('MetricHttp middleware on finish')
						
						let metric = res.devapt_metrics
                        // console.log(metric, 'metric')
                        
                        if (metric)
                        {
						  metric.after()
                        }
					}
				)
			}
			
			return next()
		}
	}
    
	
	/**
     * Returns process id
     */
	get_pid()
	{
		return process.pid
	}
	
	
	/**
     * Returns request id or a self generated unique id
     */
	get_id()
	{
		return ( T.isFunction(this.req.getId) && this.req.getId() )
			|| ( this.req.id && T.isFunction(this.req.id) && this.req.id() )
			|| this.req.id
			|| uuid.v1()
	}
	
	
	/**
     * Returns client ip address or undefined
     */
	get_ip()
	{
		return this.req.ip
			|| this.req._remoteAddress
			|| (this.req.connection && this.req.connection.remoteAddress)
			|| undefined
	}
	
	
	/**
     * Returns client port or undefined
     */
	get_port()
	{
		return (this.req.connection && this.req.connection.remotePort)
			|| undefined
	}
	
	
	/**
     * Returns client security token or undefined
     */
	get_token()
	{
		return this.req.secure
			|| undefined
	}
	
	/**
     * Returns processing latency (response time)
     */
	get_latency()
	{
		var latency = this.res.get('Response-Time');
		if ( typeof (latency) !== 'number' )
			latency = this.metrics.ts_end - this.metrics.ts_begin;
		
		return latency
	}
}





// RESTIFY AUDIT FORMAT
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
			"accept":'*/*'
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
