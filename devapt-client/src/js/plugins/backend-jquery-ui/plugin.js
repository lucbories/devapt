/**
 * @file        plugins/backend-jquery-ui/plugin.js
 * @desc        JQUERY UI plugin class
 * @ingroup     DEVAPT_JQUERY_UI
 * @date        2015-02-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'object/plugin',
	'jquery-ui'],
function(Devapt, DevaptTypes, DevaptClass, DevaptPlugin,
	undefined)
{
	/**
	 * @public
	 * @class				DevapJQueryUIPlugin
	 * @desc				Devapt jQuery UI Plugin class
	 */
	
	
	var classes_map = {
		'Window':['plugins/backend-jquery-ui/views/window'],
		'JsonTree':['plugins/backend-jquery-ui/views/jsontree']
	};
	
	
	/**
	 * @public
	 * @memberof			DevapJQueryUIPlugin
	 * @desc				Has class dependancies ?
	 * @param {string}		arg_class_name	class name
	 * @return {boolean}
	 */
	var cb_has_class_depds = function(arg_class_name)
	{
		var self = this;
		var context = 'has_class_depds(class name)';
		self.enter(context, arg_class_name);
		
		var found = arg_class_name in classes_map;
		
		self.leave(context, Devapt.msg_success + '[' + found + ']');
		return found;
	}
	
	
	/**
	 * @public
	 * @memberof			DevapJQueryUIPlugin
	 * @desc				Get plugin classes dependancies
	 * @param {string}		arg_class_name	class name
	 * @return {array}		Requires urls strings
	 */
	var cb_get_class_depds = function(arg_class_name)
	{
		var self = this;
		var context = 'get_class_depds(class name)';
		self.enter(context, arg_class_name);
		
		var depds = arg_class_name in classes_map ? classes_map[arg_class_name] : [];
		
		self.leave(context, Devapt.msg_success + ' count[' + depds.length + ']');
		return depds;
	}
	
	/**
	 * @public
	 * @memberof			DevapJQueryUIPlugin
	 * @desc				Get plugin backend
	 * @return {object}		A backend object
	 */
	var cb_get_backend = function()
	{
		var self = this;
		var context = 'get_backend()';
		self.enter(context, '');
		
		// console.log(DevaptFoundation5Backend, context);
		
		self.leave(context, Devapt.msg_success);
		return DevaptFoundation5Backend;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-04-04',
			'updated':'2015-04-04',
			'description':'jQuery UI features for Devapt applications.',
			'is_singleton':true
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptPlugin;
	var DevapJQueryUIPluginClass = new DevaptClass('DevapJQueryUIPlugin', parent_class, class_settings);
	
	// METHODS
	DevapJQueryUIPluginClass.add_public_method('has_class_depds', {}, cb_has_class_depds);
	DevapJQueryUIPluginClass.add_public_method('get_class_depds', {}, cb_get_class_depds);
	DevapJQueryUIPluginClass.add_public_method('get_backend', {}, cb_get_backend);
	
	// PROPERTIES
	
	
	return DevapJQueryUIPluginClass;
} );