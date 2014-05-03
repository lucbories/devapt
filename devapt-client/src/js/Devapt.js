/**
 * @file        Devapt.js
 * @desc        Devapt static common features: Devapt static class, traces, errors, types, inheritance, modules, resources, utils
 * @ingroup     LIBAPT_MAIN_JS
 * @date        2013-05-16
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define('Devapt', ['jquery'], function($)
{
	console.info('Loading Devapt bootstrap');

	/**
	 * @ingroup     LIBAPT_MAIN_JS
	 * @public
	 * @static
	 * @class		Devapt
	 * @desc		Provide common features : types test, modules repository, classes inheritance
	 */
	var Devapt = function()
	{
	}
	
	
	/**
	 * @ingroup     LIBAPT_MAIN_JS
	 * @public
	 * @static
	 * @class		Devapt
	 * @desc		Provide jQuery object
	 */
	Devapt.jQuery = function()
	{
		return $;
	}
	
	// var $ = jQuery;
	
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
		
		return arg_prototype.name
	}
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.use_css(arg_css_files)
	 * @desc				Register a list of css files
	 * @param {object}		arg_css_files	css files array
	 * @return {nothing}
	 */
	Devapt.use_css = function(arg_css_files)
	{
		console.log('Devapt.use_css [' + arg_css_files + ']');
		
		// LOAD MODULE CSS FILES
		if (arg_css_files)
		{
			// CHECK ARRAY
			var css_files = arg_css_files;
			var arg_is_string = typeof arg_css_files == 'string' || typeof arg_css_files == 'String';
			if (arg_is_string)
			{
				css_files = [ arg_css_files ];
			}
			
			// LOOP ON MODULE CSS FILES
			for(css_file_index in css_files)
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
	}
	
	
	/**
	 * @memberof			Devapt
	 * @public
	 * @static
	 * @method				Devapt.run()
	 * @desc				Run application
	 * @return {nothing}
	 */
	Devapt.run = function()
	{
		console.log('Devapt.run');
		// init GUI Backend, cache, event
	}
	
	
	// Bootstrap
	// Devapt.use('addons-datatables-all');
	// Devapt.use('addons-dygraph-all');
	// Devapt.use('addons-flot-all');

	// console.info('Devapt: Update GUI translations');
	// Devapt.use('apps-i18n');
	// DevaptI18n.update_gui();

	// console.info('Devapt: Init editors');
	// Devapt.use('apps-editors');
	// DevaptEditors.init_mixins();
	
	return Devapt;
} );