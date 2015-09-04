/**
 * @file        core/security.js
 * @desc        Devapt static security features
 * @ingroup     DEVAPT_CORE
 * @date        2015-03-14
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'jStorage'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptCache)
{
	console.info(DevaptCache, 'DevaptCache');
	
	
	/**
	 * @memberof	DevaptSecurity
	 * @public
	 * @class
	 * @desc		Devapt cache features container
	 */
	var DevaptSecurity = function() {};
	
	
	/**
	 * @memberof	DevaptSecurity
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptSecurity.security_trace = false;
	
	
	/**
	 * @memberof	DevaptSecurity
	 * @public
	 * @static
	 * @desc		default logged user informations
	 */
	DevaptSecurity.default_logged_user =
	{
		status:null,
		login:null,
		password:null,
		expire:null,
		token:null
	};
	
	
	/**
	 * @memberof	DevaptSecurity
	 * @public
	 * @static
	 * @desc		Logged user record key
	 */
	DevaptSecurity.logged_user_key = 'Devapt.security.user';
	
	
	
	/**
	 * @memberof				DevaptSecurity
	 * @public
	 * @method					DevaptSecurity.login(arg_login, arg_password)
	 * @desc					Login a user
	 * @param {string}			arg_login		user login
	 * @param {string}			arg_password	user password
	 * @return {object}			Promise of boolean result : Connection accepted or refused
	 */
	DevaptSecurity.login = function(arg_login, arg_password)
	{
		var context = 'DevaptSecurity.login(login,pwd)';
		DevaptTrace.trace_enter(context, arg_login, DevaptSecurity.security_trace);
		
		
	    var hashed_password = Devapt.hash('MD5', arg_password);
		DevaptTrace.trace_value(context, 'hashed_password', hashed_password, DevaptSecurity.security_trace);
		
		// var url_base = Devapt.app.get_url_base(); 
		var url = '/security/authenticate';
		
		var datas = {
			username:arg_login,
			password:hashed_password
		};
		// var json_datas = JSON.stringify(datas);
		
		var ajax_settings = {
			contentType	: 'application/x-www-form-urlencoded; charset=utf-8',
			dataType	: 'json',
			async		: true,
			cache		: false,
			timeout		: 3000
		};
		
		DevaptSecurity.delete_logged_user();
		
		var ajax_promise = Devapt.ajax_get(url, datas, ajax_settings, null);
		
		// ON SUCCESS
		ajax_promise.then(
			function(result)
			{
				console.info(arg_login, 'login success');
				console.log(result, 'login result');
				
				var record =
				{
					status: 'ok',
					login: arg_login,
					password: hashed_password,
					expire: Date.now() + 3600 * 1000, // TODO 3600 sec = 1 hour
					token: null
				};
				DevaptSecurity.set_logged_user(record);
				
				Devapt.get_current_backend().notify_info('login success for [' + arg_login + ']');
				
				try
				{
					// Devapt.app.render();
					Devapt.app.render_last();
				}
				catch(e)
				{
					console.error(e, context);
				}
			},
			function(request)
			{
				console.error(arg_login, 'login failure');
				console.log(request, 'request');
				
				Devapt.get_current_backend().notify_error('login failure for [' + arg_login + ']');
			}
		);
		
		
		DevaptTrace.trace_leave(context, Devapt.msg_success_promise, DevaptSecurity.security_trace);
		return ajax_promise;
	}
	
	
	/**
	 * @memberof				DevaptSecurity
	 * @public
	 * @method					DevaptSecurity.logout()
	 * @desc					Logout a connected user
	 * @return {nothing}
	 */
	DevaptSecurity.logout = function()
	{
		var context = 'DevaptSecurity.logout()';
		DevaptTrace.trace_enter(context, '', DevaptSecurity.security_trace);
		
		try
		{
			// REMOVE CURRENT LOGGED USER RECORD
			DevaptSecurity.delete_logged_user();
			
			// GET CURRENT BACKEND
			var backend = Devapt.get_current_backend();
			
			// CHECK AUTHENTICATION
			/*var logout_promise = */backend.render_logout();
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptSecurity.security_trace);
	}
	
	
	/**
	 * @memberof				DevaptSecurity
	 * @public
	 * @method					DevaptSecurity.login(arg_login, arg_password)
	 * @desc					Login a user
	 * @param {string}			arg_login		user login
	 * @param {string}			arg_password	user password
	 * @return {object}			Promise of boolean result : Connection accepted or refused
	 */
	DevaptSecurity.set_logged_user = function(arg_user_record)
	{
		var context = 'DevaptSecurity.set_logged_user(record)';
		DevaptTrace.trace_enter(context, '', DevaptSecurity.security_trace);
		
		try
		{
			var record = window.$.extend(DevaptSecurity.default_logged_user, arg_user_record);
			// console.log(record, 'DevaptSecurity.set_logged_user: record');
			
			DevaptCache.set(DevaptSecurity.logged_user_key, record);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptSecurity.security_trace);
	}
	
	
	/**
	 * @memberof				DevaptSecurity
	 * @public
	 * @method					DevaptSecurity.get_logged_user()
	 * @desc					Get a logged user record
	 * @return {object}			{ status:..., login:..., password:..., expire:..., token:... }
	 */
	DevaptSecurity.get_logged_user = function()
	{
		var context = 'DevaptSecurity.get_logged_user()';
		DevaptTrace.trace_enter(context, '', DevaptSecurity.security_trace);
		
		try
		{
			var record = DevaptCache.get(DevaptSecurity.logged_user_key, DevaptSecurity.default_logged_user);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptSecurity.security_trace);
		return record;
	}
	
	
	/**
	 * @memberof				DevaptSecurity
	 * @public
	 * @method					DevaptSecurity.delete_logged_user()
	 * @desc					Get a logged user record
	 * @return {nothing}
	 */
	DevaptSecurity.delete_logged_user = function()
	{
		var context = 'DevaptSecurity.delete_logged_user()';
		DevaptTrace.trace_enter(context, '', DevaptSecurity.security_trace);
		
		
		try
		{
			// var DevaptCache = window.$.jStorage;
			DevaptCache.deleteKey(DevaptSecurity.logged_user_key);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptSecurity.security_trace);
	}
	
	
	/**
	 * @memberof				DevaptSecurity
	 * @public
	 * @method					DevaptSecurity.get_token()
	 * @desc					Get security token
	 * @return {string}	
	 */
	DevaptSecurity.get_token = function()
	{
		var context = 'DevaptSecurity.get_token()';
		DevaptTrace.trace_enter(context, '', DevaptSecurity.security_trace);
		
		try
		{
			var record = DevaptCache.get(DevaptSecurity.logged_user_key, DevaptSecurity.default_logged_user);
			
			DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptSecurity.security_trace);
			return record.token;
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		DevaptTrace.trace_leave(context, Devapt.msg_failure, DevaptSecurity.security_trace);
		return null;
	}
	
	
	/**
	 * @memberof				DevaptSecurity
	 * @public
	 * @method					DevaptSecurity.check_expiration()
	 * @desc					Check security token expiration
	 * @return {boolean}	
	 */
	DevaptSecurity.check_expiration = function()
	{
		var context = 'DevaptSecurity.check_expiration()';
		DevaptTrace.trace_enter(context, '', DevaptSecurity.security_trace);
		
		try
		{
			var record = DevaptCache.get(DevaptSecurity.logged_user_key, DevaptSecurity.default_logged_user);
		}
		catch(e)
		{
			console.error(e, context);
		}
		
		DevaptTrace.trace_leave(context, Devapt.msg_success, DevaptSecurity.security_trace);
		return record.expire*1000 > Date.now();
	}
	
	
	// SET GLOBAL
	Devapt.security = DevaptSecurity;
	
	
	return DevaptSecurity;
} );