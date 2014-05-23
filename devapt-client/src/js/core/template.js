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

define(
['Devapt', 'core/traces', 'core/types', 'mustache'],
function(Devapt, DevaptTrace, DevaptTypes, Mustache)
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
			'end_row':'</div>'
		};
	
	/**
	 * @memberof				DevaptTemplate
	 * @public
	 * @method					DevaptTemplate.render(arg_template_str, arg_template_tags)
	 * @desc					Render template string
	 * @param {string}			arg_template_str		text to render
	 * @param {object}			arg_template_tags		tags for substitution (optional)
	 * @return {string}			Rendered string
	 */
	DevaptTemplate.render = function(arg_template_str, arg_template_tags)
	{
		var context = 'DevaptTemplate.render(str,tags)';
		DevaptTrace.trace_enter(context, '', DevaptTemplate.template_trace);
		
		
		// SWITCH TAGS IF NEEDED
		var tags = DevaptTemplate.template_tags;
		if ( DevaptTypes.is_object(arg_template_tags) )
		{
			tags = arg_template_tags;
		}
		
		// RENDER TEMPLATE
		arg_template_str = arg_template_str.replace(/{#([a-zA-Z0-9_]+)}/gm, '@@@#$1@@@');
		arg_template_str = arg_template_str.replace(/{\/([a-zA-Z0-9_]+)}/gm, '@@@/$1@@@');
		arg_template_str = arg_template_str.replace(/{/gm, '{{{');
		arg_template_str = arg_template_str.replace(/}/gm, '}}}');
		arg_template_str = arg_template_str.replace(/@@@#([a-zA-Z0-9_]+)@@@/gm, '{{#$1}}');
		arg_template_str = arg_template_str.replace(/@@@\/([a-zA-Z0-9_]+)@@@/gm, '{{/$1}}');
		
		var str = Mustache.render(arg_template_str, tags);
		
		
		DevaptTrace.trace_leave(context, 'success', DevaptTemplate.template_trace);
		return str;
	}
	
	
	return DevaptTemplate;
} );