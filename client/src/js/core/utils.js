/**
 * @file       core/ utils.js
 * @desc        Devapt static utils features
 * @ingroup     DEVAPT_CORE
 * @date        2013-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt'], function(Devapt)
{
	/**
	 * @memberof	DevaptUtils
	 * @public
	 * @class
	 * @desc		Devapt utils features container
	 */
	var DevaptUtils = function() {};

	/**
	 * @memberof			DevaptUtils
	 * @public
	 * @static
	 * @method				DevaptUtils.get_main_icon_url(arg_icon_relative_path_name)
	 * @desc				Get the standard icon url
	 * @param {string}		arg_icon_relative_path_name		relative path name of the icon
	 * @return {string}		icon url
	 */
	// DevaptUtils.get_main_icon_url = function(arg_icon_relative_path_name)
	// {
	// 	return APT_IMAGES_URL + arg_icon_relative_path_name;
	// }


	/**
	 * @memberof			DevaptUtils
	 * @public
	 * @static
	 * @method				DevaptUtils.go_to_view(arg_view, arg_options)
	 * @desc				Go to the given view page
	 * @param {string}		arg_view			view name
	 * @param {object}		arg_options			view options
	 * @return {nothing}
	 */
	/*DevaptUtils.go_to_view = function(arg_view, arg_options)
	{
		// GET VIEW OBJECT
		var view_obj = arg_view;
		if ( LibaptTypes.is_string(arg_view) )
		{
			view_obj = LibaptViews.get(arg_view);
		}
		
		// CHECK VIEW OBJECT
		if (! view_obj.is_view)
		{
			LibaptTraces.error( {context:'DevaptUtils.go_to_view', step:'check view', text:'View object is not a LibaptView subclass'} );
			return;
		}
		
		// GET URL BASE
		var url = 'index.php?viewAction=displayHtmlPage' + view_obj.name;
		
		// GET URL QUERY OPTIONS
		if (arg_options instanceof LibaptQuery)
		{
			url += '&' + arg_options.get_url_string();
		}
		else
		// GET URL STRING OPTIONS
		if ( LibaptTypes.is_string(arg_options) )
		{
			url += '&' + arg_options;
		}
		
		// GOTO URL
		window.location.assign(url);
	}*/


	/**
	 * @public
	 * @static
	 * @method				jQuery.serializeJSON()
	 * @desc				Register the json serialization of jQuery if needed
	 * @return {string}		a json string
	 */
	/*if (typeof $.fn.serializeJSON == 'undefined')
	{
		$.fn.serializeJSON=function()
		{
			var json = {};
			jQuery.map(
				$(this).serializeArray(),
				function(n, i)
				{
					json[n['name']] = n['value'];
				}
			);
			return json;
		};
	}*/
	
	return DevaptUtils;
} );