/**
 * @file        views/remote.js
 * @desc        Remote view class
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-06-24
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/class', 'views/view', 'core/application'],
function(Devapt, DevaptClass, DevaptView, DevaptApplication)
{
	/**
	 * @public
	 * @class				DevaptRemote
	 * @desc				Remote view view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo		jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptRemote
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_self = function(arg_deferred)
	{
		var self = this;
		var context = 'render_self(deferred)';
		self.enter(context, '');
		
		
		// CHECK CONTAINER NODE
		self.assertNotNull(context, 'arg_deferred', arg_deferred);
		self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
		self.content_jqo = $('<div>');
		self.parent_jqo.append(self.content_jqo);
		
		// GET AND RENDER VIEW CONTENT
		var promise = arg_deferred.then(
			function(arg_url)
			{
				return $.get(arg_url);
			}
		)
		.then(
			function(arg_html)
			{
				self.content_jqo.html(arg_html);
			}
		);
		
		// GET APP BASE URL
		var url_base	= DevaptApplication.get_url_base();
		
		// GET VIEW CONTENT URL
		var view_content_url = url_base + 'views/' + self.name + '/html_view';
		
		// RESOLVE DEFERRED
		arg_deferred.resolve(view_content_url);
		
		
		self.leave(context, 'success: promise is resolved: async render');
		return promise;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-06-24',
			'updated':'2014-12-06',
			'description':'Remote view class.'
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptView;
	var DevaptRemoteClass = new DevaptClass('DevaptRemote', parent_class, class_settings);
	
	// METHODS
	DevaptRemoteClass.add_public_method('render_self', {}, cb_render_self);
	
	// PROPERTIES
	DevaptRemoteClass.add_public_str_property('include_file_path_name',	'',		null, false, false, []);
	
	
	return DevaptRemoteClass;
} );