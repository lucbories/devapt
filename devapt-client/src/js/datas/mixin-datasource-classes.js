/**
 * @file        datas/mixin-datasource-classes.js
 * @desc        Mixin for classes data source
 * @see			...
 * @ingroup     DEVAPT_CORE
 * @date        2014-11-02
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class', 'core/classes'],
function(Devapt, DevaptTypes, DevaptClass, DevaptClasses)
{
	/**
	 * @mixin				DevaptMixinDatasoureClasses
	 * @public
	 * @desc				Mixin for classes data source
	 */
	var DevaptMixinDatasoureClasses = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureClasses
		 * @desc				Init classes data source
		 * @return {nothing}
		 */
		init_data_source_classes: function(self)
		{
			// var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'init_data_source_classes()';
			self.enter(context, '');
			
			
			
			self.leave(context, self.msg_success);
			self.pop_trace();
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinDatasoureClasses
		 * @desc				Get items array for classes data source
		 * @return {promise}
		 */
		get_items_array_classes: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_datasource);
			var context = 'get_items_array_classes()';
			self.enter(context, '');
			
			
			// INIT PROMISE
			var deferred = $.Deferred();
			var items_promise = deferred.promise();
			
			// GET ITEMS FROM CLASSES SOURCE
			if ( self.items_source === 'classes' )
			{
				var items = [];
				var classes_array = DevaptClasses.get_classes_array();
				for(class_index in classes_array)
				{
					var class_record = classes_array[class_index];
					var record = {};
					record['name']			= class_record.name;
					record['author']		= class_record.author;
					record['updated']		= class_record.updated;
					record['description']	= class_record.description;
					items.push(record);
				}
				// console.log(items, 'resources');
				
				if ( self.items_source_format === 'json' )
				{
					var json_str = items.join(',');
					var json_obj = $.parseJSON(json_str);
					// console.log(json_obj);
					items = json_obj;
				}
				
				deferred.resolve(items);
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return items_promise;
			}
			
			// BAD SOURCE SOURCE
			deferred.reject();
			
			
			self.leave(context, self.msg_failure);
			self.pop_trace();
			return items_promise;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-10-15',
			'updated':'2014-12-06',
			'description':'Mixin methods for classes datas source.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinDatasoureClassesClass = new DevaptClass('DevaptMixinDatasoureClasses', null, class_settings);
	
	// METHODS
	// DevaptMixinDatasoureClassesClass.infos.ctor = DevaptMixinDatasoureClasses.init_data_source_classes;
	DevaptMixinDatasoureClassesClass.add_public_method('init_data_source_classes', {}, DevaptMixinDatasoureClasses.init_data_source_classes);
	DevaptMixinDatasoureClassesClass.add_public_method('get_items_array_classes', {}, DevaptMixinDatasoureClasses.get_items_array_classes);
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinDatasoureClassesClass.build_class();
	
	
	return DevaptMixinDatasoureClassesClass;
}
);