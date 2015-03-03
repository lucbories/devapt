/**
 * @file        views/container/container-mixin-render-view.js
 * @desc        Mixin for datas items rendering feature for containers
 * @see			DevaptMixinRenderView
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-02-23
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
	 * @mixin				DevaptMixinRenderView
	 * @public
	 * @desc				Mixin of methods for datas items rendering features
	 */
	var DevaptMixinRenderView = 
	{
		/**
		 * @public
		 * @memberof			DevaptMixinRenderView
		 * @desc				Render an item VIEW content
		 * @param {object}		arg_deferred		deferred object
		 * @param {object}		arg_item_jqo		
		 * @param {string}		arg_item_content
		 * @return {object}		Promise
		 */
		render_item_view: function(arg_deferred, arg_item_jqo, arg_item_content)
		{
			var self = this;
			var context = 'render_item_view(deferred,jqo,content)';
			self.enter(context, '');
			self.value(context, 'arg_item_content', arg_item_content);
			
			
			// CHECK ARGS
			self.step(context, 'check args');
			self.assert_not_null(context, 'arg_item_jqo', arg_item_jqo);
			self.assert_not_null(context, 'arg_item_content', arg_item_content);
			// console.log(arg_item_jqo, context + ':jqo:' + self.name + ' for item [' + arg_item_content + ']');
			
			
			// GET CURRENT BACKEND AND RENDER VIEW
			self.step(context, 'get current backend');
			var backend = Devapt.get_current_backend();
			self.assert_not_null(context, 'backend', backend);
			var backend_promise = backend.render_view(arg_item_jqo, arg_item_content);
			
			// SET LABEL
			backend_promise.then(
				function(view)
				{
					self.step(context, 'view is rendered, set label');
					
					arg_item_jqo.attr('devapt-label', view.label);
					
					return view;
				}
			);
			
			
			self.leave(context, self.msg_success);
			return backend_promise;
		}
	}
	
	
	
	/* --------------------------------------------- CREATE CLASS ------------------------------------------------ */
	
	// CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-02-23',
			'updated':'2015-02-23',
			'description':'Mixin methods for datas items rendering feature for containers.'
		}
	};
	var DevaptMixinRenderViewClass = new DevaptClass('DevaptMixinRenderView', null, class_settings);
	
	// METHODS
	DevaptMixinRenderViewClass.add_public_method('render_item_view', {}, DevaptMixinRenderView.render_item_view);
	
	// PROPERTIES
	
	// BUILD MIXIN CLASS
	DevaptMixinRenderViewClass.build_class();
	
	
	return DevaptMixinRenderViewClass;
}
);