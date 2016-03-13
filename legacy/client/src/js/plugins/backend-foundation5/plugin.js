/**
 * @file        plugins/backend-foundation5/plugin.js
 * @desc        Foundation 5 plugin class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2015-02-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class', 'object/plugin',
	'plugins/backend-foundation5/backend'],
function(Devapt, DevaptTypes, DevaptClass, DevaptPlugin,
	DevaptFoundation5Backend)
{
	/**
	 * @public
	 * @class				DevaptFoundation5Plugin
	 * @desc				Devapt Foundation5 Plugin class
	 */
	
	
	var classes_map = {
		'Label':['plugins/backend-foundation5/views/label'],
		'Button':['plugins/backend-foundation5/views/button'],
		'ButtonGroup':['plugins/backend-foundation5/views/button-group'],
		'ButtonBar':['plugins/backend-foundation5/views/button-bar'],
		'Image':['plugins/backend-foundation5/views/image'],
		'Breadcrumbs':['plugins/backend-foundation5/views/breadcrumbs'],
		'Panel':['plugins/backend-foundation5/views/panel'],
		'DevaptMenu':['plugins/backend-foundation5/views/menu'],
		'Menu':['plugins/backend-foundation5/views/menu'],
		'Menubar':['plugins/backend-foundation5/views/menubar'],
		'Pagination':['plugins/backend-foundation5/views/pagination'],
		'Row':['plugins/backend-foundation5/containers/row'],
		'Select':['plugins/backend-foundation5/containers/list'],
		'List':['plugins/backend-foundation5/containers/list'],
		'NavMenu':['plugins/backend-foundation5/containers/navmenu'],
		
		'Dropdown':['plugins/backend-foundation5/containers/dropdown'],
		'Tabs':['plugins/backend-foundation5/containers/tabs'],
		'Accordion':['plugins/backend-foundation5/containers/accordion'],
		'Table':['plugins/backend-foundation5/containers/table'],
		'HBox':['plugins/backend-foundation5/containers/hbox'],
		'VBox':['plugins/backend-foundation5/containers/vbox'],
		'PGrid':['plugins/backend-foundation5/containers/pgrid'],
		'RCGrid':['plugins/backend-foundation5/containers/rcgrid']
	};
	
	
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
		self.enter(context, arg_class_name);
		
		var found = arg_class_name in classes_map;
		
		self.leave(context, Devapt.msg_success + '[' + found + ']');
		return found;
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
		self.enter(context, arg_class_name);
		
		var depds = arg_class_name in classes_map ? classes_map[arg_class_name] : [];
		
		self.leave(context, Devapt.msg_success + ' count[' + depds.length + ']');
		return depds;
	}
	
	/**
	 * @public
	 * @memberof			DevaptFoundation5Plugin
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
			'created':'2015-02-23',
			'updated':'2015-02-23',
			'description':'Foundation 5 features for Devapt applications.',
			'is_singleton':true
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptPlugin;
	var DevaptFoundation5PluginClass = new DevaptClass('DevaptFoundation5Plugin', parent_class, class_settings);
	
	// METHODS
	DevaptFoundation5PluginClass.add_public_method('has_class_depds', {}, cb_has_class_depds);
	DevaptFoundation5PluginClass.add_public_method('get_class_depds', {}, cb_get_class_depds);
	DevaptFoundation5PluginClass.add_public_method('get_backend', {}, cb_get_backend);
	
	// PROPERTIES
	
	
	return DevaptFoundation5PluginClass;
} );