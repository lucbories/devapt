/**
 * @file        object/plugin-manager.js
 * @desc        Plugin manager class
 * @ingroup     DEVAPT_CORE
 * @date        2015-02-28
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
	 * @class				DevaptPluginManager
	 * @desc				Plugin manager class
	 */
	
	
	/**
	 * @public
	 * @memberof			DevaptPluginManager
	 * @desc				Get plugin classes factory
	 * @param {string}		arg_name		plugin name
	 * @param {string}		arg_url			plugin url
	 * @return {object}		A factory object
	 */
	var cb_declare_plugin_url = function(arg_name, arg_url)
	{
		var self = this;
		// self.trace=true;
		var context = 'declare_plugin_url(name,url)';
		self.assert_not_empty_string(context, 'plugin name', arg_name);
		self.assert_not_empty_string(context, 'plugin url', arg_url);
		self.enter(context, arg_name, arg_url);
		
		
		self.plugins_urls_map[arg_name] = arg_url;
		
		
		self.leave(context, Devapt.msg_succcess);
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptPluginManager
	 * @desc				Load a plugin or return an already loaded plugin
	 * @param {string}		arg_name		plugin name
	 * @return {object}		A promise of a Plugin instance
	 */
	var cb_load_plugin = function(arg_name)
	{
		var self = this;
		// self.trace=true;
		var context = 'load_plugin(name)';
		self.assert_not_empty_string(context, 'plugin name', arg_name);
		self.enter(context, arg_name);
		
		
		// PLUGIN IS ALREADY LOADED
		if (self.plugins_map[arg_name])
		{
			self.leave(context, Devapt.msg_success_promise);
			return Devapt.promise_resolved( self.plugins_map[arg_name] );
		}
		
		// PLUGIN URL IS NOT DECLARED
		if (! (arg_name in self.plugins_urls_map) )
		{
			self.value(context, 'arg_name', arg_name);
			self.value(context, 'self.plugins_urls_map', self.plugins_urls_map);
			
			self.leave(context, Devapt.msg_failure_promise);
			return Devapt.promise_rejected();
		}
		
		// CHECK PLUGIN NAME
		var plugin_url = self.plugins_urls_map[arg_name];
		if ( ! plugin_url )
		{
			self.value(context, 'plugin_url', plugin_url);
			self.value(context, 'arg_name', arg_name);
			self.value(context, 'self.plugins_urls_map', self.plugins_urls_map);
			
			self.leave(context, Devapt.msg_failure_promise);
			return Devapt.promise_rejected();
		}
		
		// LOAD A PLUGIN URL
		var defer = Devapt.defer();
		// console.log(arg_name, 'arg_name');
		// console.log(self.plugins_urls_map, 'self.plugins_urls_map');
		
		require([plugin_url],
			function(plugin_class)
			{
				self.step(context, 'plugin is loaded');
				
				var plugin = plugin_class.create(arg_name);
				self.step(context, 'plugin object is created');
				
				self.set_plugin(plugin);
				self.step(context, 'plugin object is registered');
				
				defer.resolve(plugin);
			}
		);
		
		
		self.leave(context, Devapt.msg_default_implementation);
		return Devapt.promise(defer);
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptPluginManager
	 * @desc				Get an already loaded plugin
	 * @param {string}		arg_name		plugin name
	 * @return {object}		A promise of a Plugin instance
	 */
	var cb_get_plugin = function(arg_name)
	{
		var self = this;
		var context = 'get_plugin(name)';
		self.assert_not_empty_string(context, 'plugin name', arg_name);
		self.enter(context, arg_name);
		
		
		// PLUGIN IS NOT ALREADY LOADED
		if (! self.plugins_map[arg_name])
		{
			self.leave(context, Devapt.msg_failure_promise);
			return Devapt.promise_rejected();
		}
		
		
		self.leave(context, Devapt.msg_success_promise);
		return Devapt.promise_resolved( self.plugins_map[arg_name] );
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptPluginManager
	 * @desc				Register a plugin object
	 * @param {object}		arg_plugin		plugin instance
	 * @return {nothing}
	 */
	var cb_set_plugin = function(arg_plugin)
	{
		var self = this;
		var context = 'set_plugin(plugin)';
		self.assert_object(context, 'plugin', arg_plugin);
		self.enter(context, arg_plugin.name);
		
		
		self.plugins_map[arg_plugin.name] = arg_plugin;
		self.plugins_array.push(arg_plugin);
		
		
		self.leave(context, Devapt.msg_success);
	};
	
	
	/**
	 * @public
	 * @memberof			DevaptPluginManager
	 * @desc				Get a class required url
	 * @param {string}		arg_class_name		class name
	 * @return {object}		A promise of a class required urls
	 */
	var cb_get_class_requires = function(arg_class_name)
	{
		var self = this;
		var context = 'get_class_requires(class name)';
		self.assert_not_empty_string(context, 'class name', arg_class_name);
		self.enter(context, arg_class_name);
		
		
		// LOOP ON LOADED PLUGINS
		for(var plugin_index in self.plugins_array)
		{
			self.value(context, 'plugin index', plugin_index);
			
			var plugin = self.plugins_array[plugin_index];
			self.value(context, 'plugin name', plugin.name);
			
			if ( plugin.has_class_depds(arg_class_name) )
			{
				var dependancies = plugin.get_class_depds(arg_class_name);
				
				self.leave(context, Devapt.msg_success_promise);
				return Devapt.promise_resolved(dependancies);
			}
		}
		
		
		self.leave(context, Devapt.msg_failure_promise);
		return Devapt.promise_resolved([]);
	};
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-02-28',
			'updated':'2015-02-28',
			'description':'Plugins manager for Devapt applications.',
			'is_abstract':false,
			'is_singleton':true
		}
	};
	
	// CLASS CREATION
	var parent_class = DevaptObject;
	var DevaptPluginManagerClass = new DevaptClass('DevaptPluginManager', parent_class, class_settings);
	
	// METHODS
	DevaptPluginManagerClass.add_public_method('declare_plugin_url', {}, cb_declare_plugin_url);
	DevaptPluginManagerClass.add_public_method('load_plugin', {}, cb_load_plugin);
	DevaptPluginManagerClass.add_public_method('get_plugin', {}, cb_get_plugin);
	DevaptPluginManagerClass.add_public_method('set_plugin', {}, cb_set_plugin);
	DevaptPluginManagerClass.add_public_method('get_class_requires', {}, cb_get_class_requires);
	
	// PROPERTIES
	DevaptPluginManagerClass.add_public_array_property('plugins_array',	'Ordered list of loaded plugins',	[], false, false, []);
	DevaptPluginManagerClass.add_public_obj_property('plugins_map',		'Map of loaded plugins',			{}, false, false, []);
	DevaptPluginManagerClass.add_public_obj_property('plugins_urls_map',	'Map of not loaded plugins urls',	{}, false, false, []);
	
	
	return DevaptPluginManagerClass;
} );