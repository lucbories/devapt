/**
 * @file        views/container/container-mixin-model-crud.js
 * @desc        Mixin for CRUD feature for containers
 * @see			DevaptContainer
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-01-24
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
['Devapt', 'core/types', 'object/class'],
function(Devapt, DevaptTypes, DevaptClass)
{
	/**
	 * @mixin				DevaptMixinModelCrud
	 * @public
	 * @desc				Mixin of methods for CRUD operations feature for containers
	 */
	var DevaptMixinModelCrud = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinModelCrud
		 * @desc				Add a record to a model datas
		 * @param {object}		arg_record			created record
		 * @param {object}		arg_model_promise	optional model promise (for non standard model)
		 * @return {object}		model engine promise
		 */
		mixin_model_create: function(arg_record, arg_model_promise)
		{
			var self = this;
			var context = 'mixin_model_create(record,model)';
			self.enter(context, '');
			
			
			// GET MODEL PROMISE
			var promise = DevaptTypes.is_object(arg_model_promise) ? arg_model_promise : self.get_items_model();
			
			// GET ENGINE PROMISE
			promise.then(
				function(model)
				{
					self.step(context, 'model is found');
					self.assert_not_null(context, 'model', model);
					
					return model.get_engine();
				},
				function()
				{
					console.error('model promise failed', context);
				}
			)
			
			// GET OPERATION PROMISE
			.then(
				// SEND ENGINE READ REQUEST
				function(engine)
				{
					self.step(context, 'engine is found');
					self.assert_not_null(context, 'engine', engine);
					
					return engine.create_records([arg_record]);
				},
				function()
				{
					console.error('engine promise failed', context);
				}
			);
			
			
			self.leave(context, '');
			return promise;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinModelCrud
		 * @desc				Remove a record from a model datas
		 * @param {object}		arg_record			deleted record
		 * @param {object}		arg_model_promise	optional model promise (for non standard model)
		 * @return {object}		model engine promise
		 */
		mixin_model_delete: function(arg_record, arg_model_promise)
		{
			var self = this;
			var context = 'mixin_model_delete(record,model)';
			self.enter(context, '');
			
			
			// GET MODEL PROMISE
			var promise = DevaptTypes.is_object(arg_model_promise) ? arg_model_promise : self.get_items_model();
			
			// GET ENGINE PROMISE
			promise.then(
				function(model)
				{
					self.step(context, 'model is found');
					self.assert_not_null(context, 'model', model);
					
					return model.get_engine();
				},
				function()
				{
					console.error('model promise failed', context);
				}
			)
			
			// GET OPERATION PROMISE
			.then(
				// SEND ENGINE READ REQUEST
				function(engine)
				{
					self.step(context, 'engine is found');
					self.assert_not_null(context, 'engine', engine);
					
					return engine.delete_records( [arg_record] );
				},
				function()
				{
					console.error('engine promise failed', context);
				}
			);
			
			
			self.leave(context, '');
			return promise;
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-01-26',
			'updated':'2015-01-26',
			'description':'Mixin methods for CRUD operations feature for containers.'
		}
	};
	var DevaptMixinModelCrudClass = new DevaptClass('DevaptMixinModelCrud', null, class_settings);
	
	// METHODS
	// DevaptMixinModelCrudClass.infos.ctor = DevaptMixinModelCrud.mixin_init_select_item;
	DevaptMixinModelCrudClass.add_public_method('mixin_model_create', {}, DevaptMixinModelCrud.mixin_model_create);
	DevaptMixinModelCrudClass.add_public_method('mixin_model_delete', {}, DevaptMixinModelCrud.mixin_model_delete);
	
	// PROPERTIES
	
	// BUILD MIXIN CLASS
	DevaptMixinModelCrudClass.build_class();
	
	
	return DevaptMixinModelCrudClass;
}
);