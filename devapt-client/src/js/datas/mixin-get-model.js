/**
 * @file        views/mixin-get-model.js
 * @desc        Mixin for model attribute feature
 * @see			DevaptField
 * @ingroup     DEVAPT_CORE
 * @date        2014-08-23
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/class', 'core/resources'],
function(Devapt, DevaptTypes, DevaptClass, DevaptResources)
{
	/**
	 * @mixin				DevaptMixinGetModel
	 * @public
	 * @desc				Mixin of template methods
	 */
	var DevaptMixinGetModel = 
	{
		/**
		 * @memberof			DevaptMixinGetModel
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_trace_get_model: false,
		
		
		
		/**
		 * @public
		 * @memberof				DevaptMixinGetModel
		 * @desc					Get a model object
		 * @param {string}			arg_model_name_attr		model name attribute
		 * @param {string}			arg_model_name			model attribute
		 * @return {promise}
		 */
		get_model: function(arg_model_name_attr, arg_model_attr)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_trace_get_model);
			var context = 'get_model()';
			self.enter(context, '');
			
			// GET MODEL
			var model_attr = arg_model_attr ? arg_model_attr : 'model';
			var model_promise_attr = model_attr + '_promise';
			var model = self[model_attr];
			var model_promise = self[model_promise_attr];
//			console.log(model_attr, 'model_attr');
//			console.log(model, 'model');

			// GET MODEL NAME
			var model_name_attr = arg_model_name_attr ? arg_model_name_attr : 'model_name';
			var model_name = self[model_name_attr];
//			console.log(model_name_attr, 'model_name_attr');
//			console.log(model_name, 'model_name');
			
			
			// MODEL ATTRIBUTE IS A VALID MODEL OBJECT
//			if ( DevaptTypes.is_object(model) && DevaptInheritance.test_inheritance(model, DevaptModel) )
//			{
//				self.step(context, 'model attribute is a valid model object');
//				
//				var deferred = $.Deferred();
//				deferred.resolve(model);
//				console.log(model, 'model');
//				console.log(self[model_attr], 'self[model_attr]');
//				
//				self.leave(context, self.msg_success_promise);
//				self.pop_trace();
//				return deferred.promise();
//			}
			
			
			// MODEL ATTRIBUTE IS A PROMISE
			if ( DevaptTypes.is_object(model_promise) )
			{
				self.step(context, 'model is a valid model promise object');
				
				self.leave(context, self.msg_success_promise);
				self.pop_trace();
				return model_promise;
			}
			
			
			// MODEL ATTRIBUTE IS NOT AN OBJECT AND MODEL NAME IS NOT A STRING
			if ( ! DevaptTypes.is_string(model_name) )
			{
				self.step(context, 'model attribute is not a valid model object and model name is not a string');
				
				self[model_name_attr] = null;
				var deferred = $.Deferred();
				deferred.reject();
				self[model_promise_attr] = deferred.promise();
					
				self.leave(context, self.msg_failure);
				self.pop_trace();
				return self[model_promise_attr];
			}
			
			
			// MODEL SEARCH
			self.step(context, 'search model');
			var cb = function(model)
				{
					self.step(context, 'model is found and model attribute is set');
					
					self[model_attr] = model;
					self[model_promise_attr] = null;
					
					// console.log(model, 'model');
					// console.log(self[model_attr], 'self[model_attr]');
					
					// return model;
				};
			var promise = DevaptResources.get_resource_instance(model_name);
			promise.done(cb);
			self[model_promise_attr] = promise;
			
			
			self.leave(context, self.msg_success_promise);
			self.pop_trace();
			return promise;
		}
		
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-10-15',
			'updated':'2014-12-06',
			'description':'Mixin methods for datas model search.'
		}
	};
	
	// CREATE CLASS
	var DevaptMixinGetModelClass = new DevaptClass('DevaptMixinGetModel', null, class_settings);
	
	// METHODS
	DevaptMixinGetModelClass.add_public_method('get_model', {}, DevaptMixinGetModel.get_model);
	
	// PROPERTIES
	
	
	// BUILD CLASS
	DevaptMixinGetModelClass.build_class();
	
	
	
	return DevaptMixinGetModelClass;
}
);