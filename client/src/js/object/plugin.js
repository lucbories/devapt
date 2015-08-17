/**
 * @file        object/plugin.js
 * @desc        Base plugin class
 * @ingroup     DEVAPT_CORE
 * @date        2015-02-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'object/object'],
function(Devapt, DevaptTypes, DevaptClass, DevaptObject)
{
	/**
	 * @public
	 * @class				DevaptPlugin
	 * @desc				Plugin base class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptPlugin
	 * @desc				Has class dependancies ?
	 * @param {string}		arg_class_name	class name
	 * @return {boolean}
	 */
	var cb_has_class_depds = function(arg_class_name)
	{
		var self = this;
		var context = 'has_class_depds(class name)';
		self.enter(context, '');
		
		
		
		self.leave(context, Devapt.msg_default_implementation);
		return false;
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptPlugin
	 * @desc				Get plugin classes dependancies
	 * @param {string}		arg_class_name	class name
	 * @return {array}		Requires urls strings
	 */
	var cb_get_class_depds = function(arg_class_name)
	{
		var self = this;
		var context = 'get_class_depds(class name)';
		self.enter(context, '');
		
		
		
		self.leave(context, Devapt.msg_default_implementation);
		return null;
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-02-23',
			'updated':'2015-02-23',
			'description':'Plugin features for Devapt applications.',
			'is_abstract':true
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptObject;
	var DevaptPluginClass = new DevaptClass('DevaptPlugin', parent_class, class_settings);
	
	// METHODS
	DevaptPluginClass.add_public_method('has_class_depds', {}, cb_has_class_depds);
	DevaptPluginClass.add_public_method('get_class_depds', {}, cb_get_class_depds);
	
	// PROPERTIES
	DevaptPluginClass.add_public_bool_property('is_plugin',	'flag to determine if current instance is a plugin',	true, false, true, []);
	
	
	return DevaptPluginClass;
} );