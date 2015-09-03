/**
 * @file     	Devapt.js
 * @desc     	Devapt static common features: Devapt static class, traces, errors, types, inheritance, modules, resources, utils
 * 				API
 * 					Devapt.trace:(boolean)
 * 					Devapt.jQuery:(object)
 * 					
 * 					START
 * 						Devapt.start(arg_app_name): (promise)
 * 					
 * 					AJAX
 * 						Devapt.url(url,token): (string)
 * 						Devapt.ajaxt(method,url,datas,options): (promise)
 * 						Devapt.ajax_get(url,datas,options): (promise)
 * 						Devapt.ajax_post(url,datas,options): (promise)
 * 						Devapt.ajax_put(url,datas,options): (promise)
 * 						Devapt.ajax_delete(url,datas,options): (promise)
 * 						
 * 					PLUGINS
 * 						Devapt.plugins_requires: (array)
 * 						Devapt.plugins_map: (object)
 * 						Devapt.get_plugins(): (object)
 * 						Devapt.set_plugins(plugins): (object)
 * 						Devapt.add_plugin(plugin): (nothing)
 * 						Devapt.get_plugin(name): (object)
 * 						
 * 					BACKEND
 * 						Devapt.current_backend: (object)
 * 						Devapt.get_current_backend(): (object)
 * 						Devapt.has_current_backend(): (boolean)
 * 						Devapt.set_current_backend(backend object): (boolean)
 * 						Devapt.is_valid_backend(backend object): (boolean)
 * 						
 * 					UTILS
 * 						Devapt.get_prototype_name()
 * 						Devapt.use_css(url)
 * 						Devapt.use_assets(urls)
 * 						
 * 					UID
 * 						Devapt.uid()
 * 						Devapt.get_unique_name(arg_prefix)
 * 						 
 * 					HASH
 * 						Devapt.hash(arg_method_name, arg_value)
 * 						
 * 					PROMISES
 * 						Devapt.is_defer(value): boolean
 * 						Devapt.is_promise(value): boolean
 * 						Devapt.defer(defer): deffered object
 * 						Devapt.promise(value): promise object
 * 						Devapt.promise_resolved(value): resolved promise object
 * 						Devapt.promise_rejected(value): rejected promise object
 * 						Devapt.promise_all(promises): promise object
 * 						
 * 					FACTORY
 * 						Devapt.require(urls_array): promise object
 * 						Devapt.get_requires(class_name): promise object of a depds urls array
 * 						Devapt.create(class_name, settings): promise object
 * 						
 * 					GARBAGE COLLECTOR
 * 						Devapt.gc_use(arg_using_object, arg_used_object)
 * 						
 * 					ASSERTION
 * 						Devapt.assert(arg_context, arg_label, arg_boolean)
 * 						
 * @ingroup     DEVAPT_CORE
 * @date        2013-05-16
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';

define('Devapt',
	[
		'jquery',
		'core/init',
		'md5',
		'sha1',
		'Q',
		'factory'
	],
function($, DevaptInit, CryptoMD5, CryptoSHA1, Q, DevaptFactory)
{
	console.info('Loading Devapt bootstrap');
	
	
	/**
	 * @ingroup    			LIBAPT_MAIN_JS
	 * @public
	 * @static
	 * @class				Devapt
	 * @desc				Provide common features : types test, modules repository, classes inheritance
	 */
	var Devapt = function()
	{
	};
	
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @desc				Trace flag
	 */
	Devapt.trace = true;
	
	
	
	/**
	 * @memberof     		Devapt
	 * @public
	 * @static
	 * @method				Devapt
	 * @desc				Provide jQuery object
	 * @return {object}		jQuery object
	 */
	Devapt.jQuery = function()
	{
		return $;
	};
	
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @desc				Application static class
	 */
	Devapt.app = null;
	
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @desc				Application ready promise
	 */
	Devapt.app_ready_promise = null;
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.start(arg_app_name)
	 * @desc				Init framework and start application
	 * @param {string}		arg_app_name	application resource name
	 * @return {object}		A promise
	 */
	Devapt.start = function(arg_app_name)
	{
		Devapt.app_ready_promise = Devapt.require(['core/application']).then(
			function(requires_array)
			{
				var DevaptApplication = requires_array[0];
				var ajax_promise = $.get('/resources/applications/' + arg_app_name).then(
					function(json_app_cfg)
					{
						// var json_app_cfg = JSON.parse(json_app_text);
						var result = DevaptApplication.set_config(json_app_cfg);
						// console.log(result, 'app_config result');
						// console.log(DevaptApplication.app_config, 'app_config');
						if (!result)
						{
							// console.error(json_app_text, 'json_app_text');
							console.error(json_app_cfg, 'json_app_cfg');
							return;
						}
						
						return DevaptApplication.run();
					}
				);
				
				return Devapt.promise(ajax_promise);
			}
		);
		
		return Devapt.app_ready_promise;
	}
	
	
	
	// -------------------------------------------------- MESSAGES ---------------------------------------------------------
	
	// STATIC RESULT MESSAGE
	Devapt.msg_default_empty_implementation = 'default empty implementation';
	
	Devapt.msg_success = 'success';
	Devapt.msg_failure = 'failure';
	
	Devapt.msg_found = 'found';
	Devapt.msg_not_found = 'not found';
	
	Devapt.msg_default_promise = 'default implementation: returns promise';
	Devapt.msg_success_promise = 'success: returns promise';
	Devapt.msg_failure_promise = 'failure: returns promise';
	
	Devapt.msg_success_require = 'success: a requirejs request is processing';
	Devapt.msg_failure_require = 'failure: a requirejs request is processing';
	
	// TASK STATES LABELS
	// CREATED -> STARTED -> RUNNING -> SUSPENDED -> RUNNING
	// CREATED -> STARTED -> RUNNING -> STOPPED -> DESTROYED
	// CREATED -> STARTED -> RUNNING -> STOPPED -> STARTED
	Devapt.STATE_CREATED = 'CREATED';
	Devapt.STATE_READY = 'READY';
	Devapt.STATE_STARTED = 'STARTED';
	Devapt.STATE_SUSPENDED = 'SUSPENDED';
	Devapt.STATE_RUNNING = 'RUNNING';
	Devapt.STATE_STOPPED = 'STOPPED';
	Devapt.STATE_DESTROYED = 'DESTROYED';
	
	// RENDERING PROCESS STATES LABELS
	Devapt.STATE_NOT_RENDERED = 'not_rendered';
	Devapt.STATE_BEFORE_RENDERING = 'before_rendering';
	Devapt.STATE_RENDERING = 'rendering';
	Devapt.STATE_AFTER_RENDERING = 'after_rendering';
	Devapt.STATE_RENDERED = 'rendered';
	
	
	
	// -------------------------------------------------- AJAX ---------------------------------------------------------
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.url(url,token)
	 * @desc				Check and format URL
	 * @param {string}		arg_url			URL string
	 * @param {string}		arg_token		security token string
	 * @return {object}		A promise
	 */
	Devapt.url = function(arg_url, arg_token)
	{
		if (arg_url)
		{
			if ( ! arg_token)
			{
				return arg_url;
			}
			
			if ( arg_url.indexOf('?') > 0 )
			{
				return arg_url + '&security_token=' + arg_token;
			}
			
			return arg_url + '?security_token=' + arg_token;
		}
		
		return null;
	};
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.ajax(method,url,datas,options)
	 * @desc				Send an ajax request
	 * @param {string}		arg_method		GET, PUT, POST, DELETE
	 * @param {string}		arg_url			URL string
	 * @param {object}		arg_datas		request datas
	 * @param {object}		arg_options		AJAX options
	 * @param {string}		arg_token		security token string
	 * @return {object}		A promise
	 */
	Devapt.ajax = function(arg_method, arg_url, arg_datas, arg_options, arg_token)
	{
		// CHECK AJAX METHOD
		if (arg_method !== 'GET' && arg_method !== 'PUT' && arg_method !== 'POST' && arg_method !== 'DELETE')
		{
			console.error(arg_method, 'Devapt.ajax failure: bad method');
			return Devapt.promise_rejected();
		}
		
		// APPEND SECURITY TOKEN
		if (arg_token)
		{
			arg_url = Devapt.url(arg_url, arg_token);
		}
		else
		{
			if (Devapt.app)
			{
				var credentials = Devapt.app.get_logged_user();
				if (credentials && credentials.login && credentials.password)
				{
					arg_token = 'username=' + credentials.login + '&password=' + credentials.password;
					var link = ( arg_url.indexOf('?') > 0 ) ? '&' : '?';
					arg_url = arg_url + link + arg_token;
				}
			}
		}
		
		// DEFAULT AJAX OPTIONS
		var default_options = {
			async		: true,
			cache		: true,
			type		: arg_method,
			dataType	: 'json',
			// contentType	: 'json',
			url			: arg_url,
			timeout		: 5000,
			data		: arg_datas,
			
			success: function(datas, textStatus, jqXHR)
				{
					return datas;
				},
			
			error: function(jqXHR, textStatus, errorThrown)
				{
					console.log(arg_options, 'Devapt.ajax failure: arg_options');
					console.log(textStatus, 'Devapt.ajax failure: textStatus');
					console.log(jqXHR, 'Devapt.ajax failure: jqXHR');
					console.error(errorThrown, 'Devapt.ajax failure: errorThrown');
					return null;
				}
		};
		
		// MERGE AJAX OPTIONS
		var options = window.$.extend(default_options, arg_options);
		// console.log(options, 'Devapt.ajax: options');
		
		// SEND AJAX REQUEST
		var jq_promise = $.ajax(options);
		var ajax_promise = Devapt.promise(jq_promise);
		
		// PROCESS RESPONSE
		// var success_cb = undefined;
		var success_cb = function(arg)
		{
//			console.info(arg, 'Devapt.ajax: success');
		};
		var failure_cb = function(response)
		{
			console.error(response, 'Devapt.ajax: failure');
			if (response.status == '401')
			{
				if (! Devapt.current_backend)
				{
					console.error('no backend', 'Devapt.ajax: failure');
					return;
				}
				return Devapt.current_backend.render_login();
			}
		};
		ajax_promise.then(success_cb, failure_cb);
		
		return ajax_promise;
	};
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.ajax_get(url,datas,options)
	 * @desc				Send a GET ajax request
	 * @param {string}		arg_url			URL string
	 * @param {object}		arg_datas		request datas
	 * @param {object}		arg_options		AJAX options
	 * @param {string}		arg_token		security token string
	 * @return {object}		A promise
	 */
	Devapt.ajax_get = function(arg_url, arg_datas, arg_options, arg_token)
	{
		return Devapt.ajax('GET', arg_url, arg_datas, arg_options, arg_token);
	};
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.ajax_put(url,datas,options)
	 * @desc				Send a PUT ajax request
	 * @param {string}		arg_url			URL string
	 * @param {object}		arg_datas		request datas
	 * @param {object}		arg_options		AJAX options
	 * @param {string}		arg_token		security token string
	 * @return {object}		A promise
	 */
	Devapt.ajax_put = function(arg_url, arg_datas, arg_options, arg_token)
	{
		return Devapt.ajax('PUT', arg_url, arg_datas, arg_options, arg_token);
	};
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.ajax_post(url,datas,options)
	 * @desc				Send a POST ajax request
	 * @param {string}		arg_url			URL string
	 * @param {object}		arg_datas		request datas
	 * @param {object}		arg_options		AJAX options
	 * @param {string}		arg_token		security token string
	 * @return {object}		A promise
	 */
	Devapt.ajax_post = function(arg_url, arg_datas, arg_options, arg_token)
	{
		return Devapt.ajax('POST', arg_url, arg_datas, arg_options, arg_token);
	};
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.ajax_delete(url,datas,options)
	 * @desc				Send a DELETE ajax request
	 * @param {string}		arg_url			URL string
	 * @param {object}		arg_datas		request datas
	 * @param {object}		arg_options		AJAX options
	 * @return {object}		A promise
	 */
	Devapt.ajax_delete = function(arg_url, arg_datas, arg_options, arg_token)
	{
		return Devapt.ajax('DELETE', arg_url, arg_datas, arg_options, arg_token);
	};
	
	
	
	// -------------------------------------------------- PLUGINS ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @desc				Application manager
	 */
	Devapt.plugin_manager = null;
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.get_plugins()
	 * @desc				Get application plugins
	 * @return {object}		Plugins map
	 */
	Devapt.get_plugin_manager = function()
	{
		return Devapt.plugin_manager;
	};
	
	
	
	// -------------------------------------------------- BACKEND ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @desc				current backend
	 */
	Devapt.current_backend = null;
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.get_current_backend()
	 * @desc				Get the current backend
	 * @return {object}		A backend object
	 */
	Devapt.get_current_backend = function()
	{
		return Devapt.current_backend;
	};
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.has_current_backend()
	 * @desc				Test if a current backend exists
	 * @return {boolean}	Has a backend ?
	 */
	Devapt.has_current_backend = function()
	{
		return Devapt.current_backend !== null;
	};
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.set_current_backend(arg_current_backend)
	 * @desc				set the current backend
	 * @param {object}		arg_current_backend		backend object
	 * @return {boolean}	success or failure
	 */
	Devapt.set_current_backend = function(arg_current_backend)
	{
		if ( Devapt.is_valid_backend(arg_current_backend) )
		{
			Devapt.current_backend = arg_current_backend;
			return true;
		}
		
		console.error('Devapt.set_current_backend : bad backend object');
		return false;
	};
	
	
	/**
	 * @memberof  			Devapt
	 * @public
	 * @static
	 * @method				Devapt.is_valid_backend(arg_backend)
	 * @desc				Test if the given backend is valid
	 * @param {object}		arg_backend		backend object
	 * @return {boolean}	success or failure
	 */
	Devapt.is_valid_backend = function(arg_backend)
	{
		if ( ! arg_backend.get_infos )
		{
			console.log('Devapt.is_valid_backend: no "get_infos" function');
			return false;
		}
		
		// if ( ! arg_backend.build_from_declaration )
		// {
			// console.log('Devapt.is_valid_backend: no "build_from_declaration" function');
			// return false;
		// }
		
		if ( ! arg_backend.render_page )
		{
			console.log('Devapt.is_valid_backend: no "render_page" function');
			return false;
		}
		
		if ( ! arg_backend.render_view )
		{
			console.log('Devapt.is_valid_backend: no "render_view" function');
			return false;
		}
		
		if ( ! arg_backend.render_login )
		{
			console.log('Devapt.is_valid_backend: no "render_login" function');
			return false;
		}
		
		if ( ! arg_backend.render_logout )
		{
			console.log('Devapt.is_valid_backend: no "render_logout" function');
			return false;
		}
		
		if ( ! arg_backend.render_error )
		{
			console.log('Devapt.is_valid_backend: no "render_error" function');
			return false;
		}
		
		return true;
	};
	
	
	
	// -------------------------------------------------- UTILS ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.register(arg_modules)
	 * @desc				Register a module definition
	 * @param {object}		arg_modules			module object to register
	 * @return {nothing}
	 */
	Devapt.get_prototype_name = function(arg_prototype)
	{
		if (arg_prototype.name === undefined)
		{
			var funcNameRegex = /function\s+(.{1,})\s*\(/;
			var results = funcNameRegex.exec(arg_prototype.toString());
			return (results && results.length > 1) ? results[1] : null;
		}
		
		return arg_prototype.name;
	};
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.use_css(arg_css_files)
	 * @desc				Register a list of css files
	 * @param {array}		arg_css_files	css files array
	 * @return {nothing}
	 */
	Devapt.use_css = function(arg_css_files)
	{
		console.info('Devapt.use_css [' + arg_css_files + ']');
		
		// LOAD MODULE CSS FILES
		if (arg_css_files)
		{
			// CHECK ARRAY
			var css_files = arg_css_files;
			var arg_is_string = (typeof arg_css_files) == 'string' || (typeof arg_css_files) == 'String';
			if (arg_is_string)
			{
				css_files = [ arg_css_files ];
			}
			
			// LOOP ON MODULE CSS FILES
			for(var css_file_index in css_files)
			{
				var url = css_files[css_file_index];
				
				$('head').append('<link>');
				var css = $('head').children(':last');
				css.attr(
					{
						rel:  "stylesheet",
						type: "text/css",
						href: url,
						media: 'all'
					}
				);
			}
		}
	};
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.use_assets(arg_assets_urls)
	 * @desc				Register a list of assets url
	 * @param {array}		arg_assets_urls		assets url array
	 * @return {nothing}
	 */
	Devapt.use_assets = function(arg_assets_urls)
	{
		console.info('Devapt.use_assets:', arg_assets_urls);
		
		// LOAD MODULE CSS FILES
		if (arg_assets_urls)
		{
			// CHECK ARRAY
			var is_string = (typeof arg_assets_urls) == 'string' || (typeof arg_assets_urls) == 'String';
			if (is_string)
			{
				arg_assets_urls = [ arg_assets_urls ];
			}
			
			// LOOP ON MODULE CSS FILES
			for(var asset_index in arg_assets_urls)
			{
				var url = arg_assets_urls[asset_index];
				
				var link_jqo = $('<link>');
				$('head').append(link_jqo);
				link_jqo.attr(
					{
						rel:  "import",
						type: "unknow",
						href: url,
						media: 'all'
					}
				);
			}
		}
	};
	
	
	// -------------------------------------------------- UID ---------------------------------------------------------
	var private_uid = 1000000;
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.uid()
	 * @desc				Get a unique id
	 * @return {integer}
	 */
	Devapt.uid = function()
	{
		private_uid++;
		return private_uid;
	};
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.get_unique_name()
	 * @desc				Get a unique name
	 * @param {string}		arg_prefix		name begin
	 * @return {integer}
	 */
	Devapt.get_unique_name = function(arg_prefix)
	{
		return arg_prefix + '_' + Devapt.uid();
	};
	
	
	
	// -------------------------------------------------- GARBAGE COLLECTOR ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.gc_use(using,used)
	 * @desc				Register a used object by a using object
	 * @param {object}		arg_using_object		using object
	 * @param {object}		arg_used_object			used object
	 * @return {boolean}
	 */
	Devapt.gc_use = function(arg_using_object, arg_used_object)
	{
		if (! arg_using_object || ! arg_used_object || ! arg_using_object.gc_use || ! arg_used_object.gc_uses_counter)
		{
			return false;
		}
		
		arg_using_object.gc_use(arg_used_object);
		
		return null;
	};
	
	
	
	// -------------------------------------------------- GARBAGE COLLECTOR ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.assert(arg_context, arg_label, arg_boolean)
	 * @desc				Assert a boolean value and throw an error if not true
	 * @param {string}		arg_context			assertion context
	 * @param {string}		arg_label			assertion label
	 * @param {boolean}		arg_boolean			boolean value
	 * @return {nothing}
	 */
	Devapt.assert = function(arg_context, arg_label, arg_boolean)
	{
		if (! arg_boolean)
		{
			throw new Error(arg_context + ':' + arg_label + '->assertion failed')
		}
	};
	
	
	
	// -------------------------------------------------- HASH ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.hash()
	 * @desc				Hash a value with a method
	 * @param {string}		arg_method_name		hash method name
	 * @param {string}		arg_value			value to hash
	 * @return {string}
	 */
	Devapt.hash = function(arg_method_name, arg_value)
	{
		if (! arg_method_name)
		{
			return null;
		}
		
		// console.log(CryptoJS, 'CryptoJS');
		switch(arg_method_name.toLocaleLowerCase())
		{
			case 'md5':		return window.CryptoJS.MD5(arg_value).toString();
			case 'sha1':	return window.CryptoJS.SHA1(arg_value).toString();
		}
		
		return null;
	};
	
	
	
	// -------------------------------------------------- PROMISE ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.is_defer(value)
	 * @desc				Test if a value is a deferred object
	 * @param {object}		arg_value		value to test
	 * @return {boolean}
	 */
	Devapt.is_defer = function(arg_value)
	{
		return arg_value ? !!arg_value.resolve : false;
	};
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.is_promise(value)
	 * @desc				Test if a value is a promise object
	 * @param {object}		arg_value		value to test
	 * @return {boolean}
	 */
	Devapt.is_promise = function(arg_value)
	{
		return Q.isPromise(arg_value);
	};
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.defer(value)
	 * @desc				Create a deferred object
	 * @param {object}		arg_value		external deferred (optional)
	 * @return {object}
	 */
	Devapt.defer = function(arg_value)
	{
		if(arg_value)
		{
			return Q(arg_value);
		}
		return Q.defer();
	};
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.promise()
	 * @desc				Create a promise object
	 * @param {object}		arg_value		external deferred
	 * @return {object}
	 */
	Devapt.promise = function(arg_value)
	{
		if (arg_value.makeNodeResolver && arg_value.promise)
		{
			return arg_value.promise;
		}
		return Q(arg_value);
	};
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.promise_resolved(arg_resolved_value)
	 * @desc				Create a resolved promise object with a resolved value
	 * @param {anything}	arg_resolved_value		resolved value
	 * @return {promise}
	 */
	Devapt.promise_resolved = function(arg_resolved_value)
	{
		// var defer = Q.defer();
		// defer.resolve(arg_resolved_value);
		// return defer.promise;
		return Q(arg_resolved_value);
	};
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.promise_resolved(arg_resolved_value)
	 * @desc				Create a rejected promise object with a reason
	 * @param {anything}	arg_reject_reason		reject reason
	 * @return {promise}
	 */
	Devapt.promise_rejected = function(arg_reject_reason)
	{
		// var defer = Q.defer();
		// defer.reject(arg_reject_reason);
		// return defer.promise;
		return Q.reject(arg_reject_reason);
	};
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.defer()
	 * @desc				Create a deferred object which is resolved when all given promises are resolved or rejected
	 * @param {array}		arg_promises		all promises
	 * @return {object}
	 */
	Devapt.promise_all = function(arg_promises)
	{
		return Q.all(arg_promises);
	};
	
	
	
	// -------------------------------------------------- FACTORY ---------------------------------------------------------
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.require(arg_required_urls)
	 * @desc				Load all required urls
	 * @param {array}		arg_required_urls		required urls
	 * @return {object}		A promise which is resolved when all dependancies are loaded
	 */
	Devapt.require = function(arg_required_urls)
	{
		// CHECK DEPENDANCIES
		if ( ! (arg_required_urls && arg_required_urls.length > 0) )
		{
			console.error(arg_required_urls, 'Devapt.require:failure: bad urls');
			return Devapt.promise_rejected('Devapt.require: bad given dependancies array');
		}
		
		// INIT PROMISE
		var defer = Devapt.defer();
		
		// LOAD REQUIRED URLS WITH COMMONJS
		if ( typeof require === 'function' && typeof define === 'function')
		{
			require(arg_required_urls,
				function() 
				{
					// console.log(arg_required_urls, 'Devapt.require:success:urls');
					// console.log(arguments, 'Devapt.require:success:arguments');
					defer.resolve(arguments);
				}
			);
		}
		else
		{
			console.error(arg_required_urls, 'Devapt.require:failure: bad AMD loader');
			defer.reject('Devapt.require: module loader not found');
		}
		
		return Devapt.promise(defer);
	};
	
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.get_requires(arg_class_name)
	 * @desc				Get class dependancies path names
	 * @param {string}		arg_class_name		class name to instanciate
	 * @return {object}		A promise of class urls dependancies array
	 */
	Devapt.get_requires = function(arg_class_name)
	{
		// var dependancies = [];
		
		
		// LOOKUP DEPENDANCIES
		var plugins_promise = Devapt.get_plugin_manager().get_class_requires(arg_class_name);
		var lookup_promise = plugins_promise.then(
			function(depds)
			{
				// console.info('Devapt.get_requires: plugins promise is resolved', depds);
				
				// LOOKUP CLASS DEPENDANCIES IN PLUGINS
				if ( depds && depds.length > 0 )
				{
					// console.info('Devapt.get_requires: dependancies found in plugins for ', arg_class_name);
					return depds;
				}

				// LOOKUP CLASS DEPENDANCIES IN DEFAULT FACTORY
				// console.info('Devapt.get_requires: lookup in default factory');
				var dependancies = DevaptFactory.get_class_require(arg_class_name, '');
				if ( dependancies && dependancies.length > 0 )
				{
					// console.info('Devapt.get_requires: dependancies found in default factory for ', arg_class_name);
					return dependancies;
				}
				
				// NOT FOUND
				// console.info('Devapt.get_requires: dependancies not found for ', arg_class_name);
				return [];
			},
			
			function()
			{
				console.error('Devapt.get_requires: dependancies not found for ', arg_class_name);
				return [];
			}
		);
		
		// console.info('Devapt.get_requires: lookup_promise');
		return lookup_promise;
	};
	
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.create(arg_class_name, arg_settings)
	 * @desc				Create an object from a class name and a settings map
	 * @param {string}		arg_class_name		class name to instanciate
	 * @param {object}		arg_settings		class instance settings
	 * @return {promise}
	 */
	Devapt.create = function(arg_class_name, arg_settings)
	{
		// console.log(arg_class_name, 'Devapt.create enter');
		
		// CHECK CLASS NAME
		if (! arg_class_name || arg_class_name.length === 0)
		{
			console.error(arg_class_name, 'Devapt.create: bad class name');
			return Devapt.promise_rejected('bad class name');
		}
		
		// CHECK CLASS SETTINGS
		if (! arg_settings || arg_settings.length === 0)
		{
			console.error(arg_settings, 'Devapt.create: bad class settings');
			return Devapt.promise_rejected('bad class settings');
		}
		
		
		// GET CLASS DEPENDANCIES
		// console.log('Devapt.create get class depds');
		var depds_promise = Devapt.get_requires(arg_class_name);
		
		var promise = depds_promise.then(
			function(dependancies)
			{
				// console.log('Devapt.create depds found', dependancies);
				
				// CREATE INSTANCE
				if (dependancies && dependancies.length > 0)
				{
					var require_promise = Devapt.require(dependancies);
					
					var create_promise = require_promise.then(
						function(args)
						{
							var ObjectClass = args[0];
							
							// CREATE MODEL
							var instance = ObjectClass.create(arg_settings);
							
							// RESOLVE DEFERRED
							if (instance)
							{
								// console.info(instance, 'instance creation success');
								return instance;
							}
							else
							{
								console.error(ObjectClass, 'instance creation failure');
								return null;
							}
						}
					);
					
					return create_promise;
				}
				
				return Devapt.promise_rejected('class dependancies failure');
			}
		);
		
		
		return promise;
	};
	
	
	return Devapt;
} );
