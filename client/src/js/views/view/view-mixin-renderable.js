/**
 * @file        views/view/view-mixin-renderable.js
 * @desc        Mixin of render methods for view rendering
 * 					API
 * 						STATIC STATE CONSTANTS
 * 							Devapt.STATE_NOT_RENDERED
 * 							Devapt.STATE_BEFORE_RENDERING: before_rendering is running
 * 							Devapt.STATE_RENDERING: render is running
 * 							Devapt.STATE_AFTER_RENDERING: after_rendering is running
 * 							Devapt.STATE_RENDERED: rendering process is finished
 * 						
 * 						STATE METHODS
 * 							get_render_state():string        -> get the render state
 * 							set_render_state(state):boolean  -> set render state
 * 							set_render_state_not():nothing   -> set not_rendered state
 * 							set_render_state_before()        -> set before_rendering state
 * 							set_render_state_rendering()     -> set rendering state
 * 							set_render_state_after()         -> set after_rendering state
 * 							set_render_state_rendered()      -> set rendered state
 * 							
 * 						RENDER METHODS
 * 							mixin_renderable_init(self):nothing -> mixin constructor
 * 							
 * 							render_before():promise
 * 							render_before_self():promise
 * 							
 * 							render():promise
 * 							render_content():promise
 * 							render_content_self():promise
 * 							
 * 							render_after():promise
 * 							render_after_self():promise
 * 						
 * @see			DevaptMixinRenderable
 * @ingroup     DEVAPT_VIEWS
 * @date        2015-02-11
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
	 * @mixin				DevaptMixinRenderable
	 * @public
	 * @desc				Mixin of render methods
	 */
	var DevaptMixinRenderable = 
	{
		/**
		 * @memberof			DevaptMixinRenderable
		 * @public
		 * @desc				mixin_renderable_state: State of the render process
		 * 							* not_rendered
		 * 							* before_rendering
		 * 							* rendering
		 * 							* after_rendering
		 * 							* rendered
		 */
		// mixin_renderable_state: 'not_rendered',
		
		
		/**
		 * @memberof			DevaptMixinRenderable
		 * @public
		 * @desc				mixin_renderable_render_count: Count of rendering runs
		 */
		// mixin_renderable_render_count: 0,
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Init mixin
		 * @return {nothing}
		 */
		mixin_renderable_init: function(self)
		{
			// DEBUG
			// self.trace=true;
			
			var context = 'mixin_renderable_init()';
			self.enter(context, '');
			
			
			self.set_render_state_not();
			self.mixin_renderable_count = 0;
			
			
			self.leave(context, '');
		},
		
		
		
		/* --------------------------------------------- RENDER STATE ------------------------------------------------ */
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Get render state string
		 * @return {string}
		 */
		get_render_state: function()
		{
			var self = this;
			var context = 'get_render_state()';
			self.enter(context, '');
			
			
			self.leave(context, self.mixin_renderable_state);
			return self.mixin_renderable_state;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Get render count
		 * @return {integer}
		 */
		// get_render_count: function()
		// {
			// var self = this;
			// var context = 'get_render_count()';
			// self.enter(context, '');
			
			
			// self.leave(context, self.mixin_renderable_count);
			// return self.mixin_renderable_count;
		// },
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Set render state
		 * @param {string}		arg_state		target state
		 * @return {boolean}
		 */
		set_render_state: function(arg_state)
		{
			var self = this;
			var context = 'set_render_state(state)';
			self.enter(context, '');
			
			switch(arg_state)
			{
				case Devapt.STATE_RENDERED:
				case Devapt.STATE_NOT_RENDERED:
				case Devapt.STATE_BEFORE_RENDERING:
				case Devapt.STATE_RENDERING:
				case Devapt.STATE_AFTER_RENDERING:
					self.mixin_renderable_state = arg_state;
					self.leave(context, self.mixin_renderable_state);
					return true;
			}
			
			self.error(context, 'bad state:' + arg_state);
			return false;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Set render state: not rendered
		 * @return {nothing}
		 */
		set_render_state_not: function()
		{
			var self = this;
			self.mixin_renderable_state = Devapt.STATE_NOT_RENDERED;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Test if the render state is not rendered
		 * @return {boolean}
		 */
		is_render_state_not: function()
		{
			var self = this;
			return self.mixin_renderable_state === Devapt.STATE_NOT_RENDERED;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Set render state: before rendering
		 * @return {nothing}
		 */
		set_render_state_before: function()
		{
			var self = this;
			self.mixin_renderable_state = Devapt.STATE_BEFORE_RENDERING;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Test if the render state is before rendering
		 * @return {boolean}
		 */
		is_render_state_before: function()
		{
			var self = this;
			return self.mixin_renderable_state === Devapt.STATE_BEFORE_RENDERING;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Set render state: rendering
		 * @return {nothing}
		 */
		set_render_state_rendering: function()
		{
			var self = this;
			self.mixin_renderable_state = Devapt.STATE_RENDERING;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Test if the render state is rendering
		 * @return {boolean}
		 */
		is_render_state_rendering: function()
		{
			var self = this;
			return self.mixin_renderable_state === Devapt.STATE_RENDERING;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Set render state: state_after_rendering
		 * @return {nothing}
		 */
		set_render_state_after: function()
		{
			var self = this;
			self.mixin_renderable_state = Devapt.STATE_AFTER_RENDERING;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Test if the render state is after rendering
		 * @return {boolean}
		 */
		is_render_state_after: function()
		{
			var self = this;
			return self.mixin_renderable_state === Devapt.STATE_AFTER_RENDERING;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Set render state: not rendered
		 * @return {nothing}
		 */
		set_render_state_rendered: function()
		{
			var self = this;
			self.mixin_renderable_state = Devapt.STATE_RENDERED;
		},
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Test if the render state is rendered
		 * @return {boolean}
		 */
		is_render_state_rendered: function()
		{
			var self = this;
			return self.mixin_renderable_state === Devapt.STATE_RENDERED;
		},
		
		
		
		/* --------------------------------------------- RENDER OPERATIONS ------------------------------------------------ */
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Do some operations before the rendering process begins.
		 * @return {object}		A promise object
		 */
		render_before: function()
		{
			var self = this;
			var context = 'render_before()';
			self.enter(context, '');
			
			
			var promise_self = null;
			try {
				self.set_render_state_before();
				promise_self = self.render_before_self();
			}
			catch(e)
			{
				self.error(context, e.toString());
				self.leave(context, Devapt.msg_failure_promise);
				return Devapt.promise_rejected();
			}
			
			
			self.leave(context, Devapt.msg_success_promise);
			return promise_self;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Do some operations before the rendering process begins (addon for child class).
		 * @return {object}		A promise object
		 */
		render_before_self: function()
		{
			var self = this;
			var context = 'render_before_self()';
			self.enter(context, '');
			
			
			// REMOVE EXISTING RENDERED NODES
			if ( DevaptTypes.is_object(self.content_jqo) )
			{
				self.content_jqo.children().remove();
			}
			
			// RUN IF IT EXISTS
			if ( self.template_enabled && DevaptTypes.is_function(self.render_begin) )
			{
				self.render_begin();
			}
			
			
			self.leave(context, Devapt.msg_default_promise);
			return Devapt.promise_resolved(self);
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Render full process
		 * @return {object}		A promise object with 'self' as resolved value
		 */
		render: function()
		{
			var self = this;
			var context = 'render()';
			self.enter(context, '');
			
			
			// INIT DEFER
			self.mixin_renderable_defer = Devapt.defer();
			
			
			// TEST IF ALREADY RENDERED
			if (self.is_render_state_rendered())
			{
				self.step(context, 'already rendered');
				
				self.mixin_renderable_defer.resolve(self);
				
				self.leave(context, Devapt.msg_success_promise);
				return Devapt.promise(self.mixin_renderable_defer);
			}
			
			// UPDATE STATE
			self.set_render_state_rendering();
			++self.mixin_renderable_count;
			
			// BEFORE RENDER
			var promise_before = self.render_before();
			
			// RENDER CONTENT
			var promise_content = promise_before.then(
				function()
				{
					console.log('render after before');
					return self.render_content();
				}
			);
			
			// AFTER RENDER
			var promise_after = promise_content.then(
				function()
				{
					return self.render_after();
				}
			);
			
			// UPDATE STATE
			self.set_render_state_rendered();
			
			
			promise_after.then(
				function()
				{
					self.mixin_renderable_defer.resolve(self);
				},
				function()
				{
					self.mixin_renderable_defer.reject();
				}
			);
			
			
			self.leave(context, Devapt.msg_success_promise);
			return Devapt.promise(self.mixin_renderable_defer);
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Render view content (addon for child class).
		 * @return {object}		A promise object
		 */
		render_content: function()
		{
			var self = this;
			var context = 'render_content()';
			self.enter(context, '');
			
			
			// RENDER WITHOUT TEMPLATE
			var promise_self = null;
			try {
				self.set_render_state_rendering();
				
				
				
				// RENDER WITH TEMPLATE
				// TODO INSERT INTO TRY...CATCH
				if ( self.template_enabled && DevaptTypes.is_function(self.render_template) )
				{
					self.step(context, 'render template');
					
					// INIT CONTENT NODE
					if ( ! DevaptTypes.is_object(self.content_jqo) )
					{
						self.step(context, 'has no content node');
						
						self.content_jqo = $('<div>');
						
						if ( DevaptTypes.is_object(self.parent_jqo) )
						{
							self.step(context, 'has parent node');
							
							self.parent_jqo.append(self.content_jqo);
						}
						
						if ( Devapt.is_function(self.get_view_id) )
						{
							self.content_jqo.attr('id', self.get_view_id());
						}
					}
					
					self.step(context, 'render template');
					// TODO CHANGE METHOD API
					var promise = self.render_template( Devapt.defer() );
					
					
					self.leave(context, Devapt.msg_success_promise);
					return promise;
				}
				
				
				if ( DevaptTypes.is_function(self.render_self) )
				{
					var defer = Devapt.defer()
					promise_self = self.render_self(defer);
				}
				else if ( DevaptTypes.is_function(self.render_content_self) )
				{
					promise_self = self.render_content_self();
				}
				else
				{
					self.error(context, 'no rendering function');
					self.leave(context, Devapt.msg_failure_promise);
					return Devapt.promise_rejected();
				}
			}
			catch(e)
			{
				self.error(context, e.toString());
				self.leave(context, Devapt.msg_failure_promise);
				return Devapt.promise_rejected();
			}
			
			
			self.leave(context, Devapt.msg_success_promise);
			return promise_self;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				Render view content (addon for child class).
		 * @return {object}		A promise object
		 */
		render_content_self: function()
		{
			var self = this;
			var context = 'render_content_self()';
			self.enter(context, '');
			
			self.leave(context, Devapt.msg_default_promise);
			return Devapt.promise_resolved(self);
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				After render operation.
		 * @return {object}		A promise object
		 */
		render_after: function()
		{
			var self = this;
			var context = 'render_after()';
			self.enter(context, '');
			
			
			var promise_self = null;
			try {
				self.set_render_state_after();
				promise_self = self.render_after_self();
			}
			catch(e)
			{
				self.error(context, e.toString());
				self.leave(context, Devapt.msg_failure_promise);
				return Devapt.promise_rejected();
			}
			
			
			self.leave(context, Devapt.msg_success_promise);
			return promise_self;
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinRenderable
		 * @desc				After render operation (addon for child class).
		 * @return {object}		A promise object
		 */
		render_after_self: function()
		{
			var self = this;
			var context = 'render_after_self()';
			self.enter(context, '');
			
			
			// TODO MOVE THIS FEATURE
			if ( DevaptTypes.is_function(self.applyCssOptions) )
			{
				self.step(context, 'apply CSS');
				self.applyCssOptions(null);
			}
			
			// SET VIEW ID
			if ( self.content_jqo && self.content_jqo !== {} && DevaptTypes.is_function(self.get_view_id) && ! self.content_jqo.attr('id'))
			{
				self.step(context, 'set content id');
				self.content_jqo.attr('id', self.get_view_id());
				// console.log(self.content_jqo, context + ':self.content_jqo');
			}
			
			self.leave(context, Devapt.msg_default_promise);
			return Devapt.promise_resolved(self);
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2015-02-11',
			'updated':'2015-02-12',
			'description':'Mixin methods for rendering process.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinRenderableClass
	 * @public
	 * @desc				Mixin of methods for rendering process
	 */
	var DevaptMixinRenderableClass = new DevaptClass('DevaptMixinRenderable', null, class_settings);
	
	// METHODS
	DevaptMixinRenderableClass.infos.ctor = DevaptMixinRenderable.mixin_renderable_init;
	
	DevaptMixinRenderableClass.add_public_method('get_render_state', {}, DevaptMixinRenderable.get_render_state);
	// DevaptMixinRenderableClass.add_public_method('get_render_count', {}, DevaptMixinRenderable.get_render_count);
	DevaptMixinRenderableClass.add_public_method('set_render_state', {}, DevaptMixinRenderable.set_render_state);
	
	DevaptMixinRenderableClass.add_public_method('set_render_state_not', {}, DevaptMixinRenderable.set_render_state_not);
	DevaptMixinRenderableClass.add_public_method('is_render_state_not', {}, DevaptMixinRenderable.is_render_state_not);
	
	DevaptMixinRenderableClass.add_public_method('set_render_state_before', {}, DevaptMixinRenderable.set_render_state_before);
	DevaptMixinRenderableClass.add_public_method('is_render_state_before', {}, DevaptMixinRenderable.is_render_state_before);
	
	DevaptMixinRenderableClass.add_public_method('set_render_state_rendering', {}, DevaptMixinRenderable.set_render_state_rendering);
	DevaptMixinRenderableClass.add_public_method('is_render_state_rendering', {}, DevaptMixinRenderable.is_render_state_rendering);
	
	DevaptMixinRenderableClass.add_public_method('set_render_state_after', {}, DevaptMixinRenderable.set_render_state_after);
	DevaptMixinRenderableClass.add_public_method('is_render_state_after', {}, DevaptMixinRenderable.is_render_state_after);
	
	DevaptMixinRenderableClass.add_public_method('set_render_state_rendered', {}, DevaptMixinRenderable.set_render_state_rendered);
	DevaptMixinRenderableClass.add_public_method('is_render_state_rendered', {}, DevaptMixinRenderable.set_render_state_rendered);
	
	
	DevaptMixinRenderableClass.add_public_method('render_before', {}, DevaptMixinRenderable.render_before);
	DevaptMixinRenderableClass.add_public_method('render_before_self', {}, DevaptMixinRenderable.render_before_self);
	
	DevaptMixinRenderableClass.add_public_method('render', {}, DevaptMixinRenderable.render);
	DevaptMixinRenderableClass.add_public_method('render_content', {}, DevaptMixinRenderable.render_content);
	DevaptMixinRenderableClass.add_public_method('render_content_self', {}, DevaptMixinRenderable.render_content_self);
	
	DevaptMixinRenderableClass.add_public_method('render_after', {}, DevaptMixinRenderable.render_after);
	DevaptMixinRenderableClass.add_public_method('render_after_self', {}, DevaptMixinRenderable.render_after_self);
	
	
	// PROPERTIES
	DevaptMixinRenderableClass.add_public_str_property('mixin_renderable_state',	'', Devapt.STATE_NOT_RENDERED, false, false, []);
	DevaptMixinRenderableClass.add_public_int_property('mixin_renderable_count',	'', 0, false, false, []);
	DevaptMixinRenderableClass.add_public_object_property('mixin_renderable_defer',	'', null, false, false, []);
	
	
	// BUILD MIXIN CLASS
	DevaptMixinRenderableClass.build_class();
	
	
	return DevaptMixinRenderableClass;
}
);