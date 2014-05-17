/**
 * @file        core/template.js
 * @desc        Devapt static template features
 * @ingroup     DEVAPT_CORE
 * @date        2014-05-10
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types'], function(Devapt, DevaptTrace, DevaptTypes)
{
	/**
	 * @memberof	DevaptTemplate
	 * @public
	 * @class
	 * @desc		Devapt cache features container
	 */
	var DevaptTemplate = function() {};
	
	
	/**
	 * @memberof	DevaptTemplate
	 * @public
	 * @static
	 * @desc		Trace flag
	 */
	DevaptTemplate.template_trace = false;
	
	
	/**
	 * @memberof	DevaptTemplate
	 * @public
	 * @static
	 * @desc		default template tags
	 */
	DevaptTemplate.template_tags =
		{
			'br':'<div>',
			'begin_row':'<div>',
			
			'er':'</div>',
			'end_row':'</div>',
			
			'':'',
			'':'',
			'':'',
			'':'',
			'':'',
		};
	
	/*
		var view = {
		  title: "Joe",
		  calc: function () {
			return 2 + 4;
		  }
		};

		var output = Mustache.render("{{title}} spends {{calc}}", view);
	*/
	
	/**
	 * @memberof				DevaptTemplate
	 * @public
	 * @method					DevaptTemplate.render()
	 * @desc					Append a new callback to call on each new event
	 * @param {function}		arg_callback_function
	 * @return {nothing}
	 */
	DevaptTemplate.render = function(arg_template_str, arg_template_tags)
	{
		if ( DevaptTypes.is_function(arg_callback_function) )
		{
			DevaptTemplate.add_event_callbacks.push(arg_callback_function);
		}
	}

	
	return DevaptTemplate;
} );