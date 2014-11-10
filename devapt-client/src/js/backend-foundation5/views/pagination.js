/**
 * @file        backend-foundation5/views/pagination.js
 * @desc        Foundation 5 pagination class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/resources', 'views/view', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptView, undefined)
{
	/**
	 * @public
	 * @class				DevaptPagination
	 * @desc				Pagination view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptPagination(arg_name, arg_parent_jqo, arg_options)
	{
		var self = this;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_parent_jqo, arg_options);
		
		// INIT
		self.trace				= false;
		self.class_name			= 'DevaptPagination';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptPagination_contructor = function()
		{
			// CONSTRUCTOR BEGIN
			var self = this;
			var context = self.class_name + '(' + arg_name + ')';
			self.enter(context, 'constructor');
			
			
			// INIT OPTIONS
			var init_option_result = DevaptOptions.set_options_values(self, arg_options, false);
			if (! init_option_result)
			{
				self.error(context + ': init options failure');
			}
			
			
			// CONSTRUCTOR END
			self.leave(context, 'success');
		}
		
		
		// CONTRUCT INSTANCE
		self.DevaptPagination_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Init event handling
		 * @return {nothing}
		 */
		self.init_event_handling = function()
		{
			var self = this;
			var context = 'init_event_handling()';
			self.enter(context, '');
			
			
			// INIT PAGINATIONS
			var target_views = self.get_property('pagination_views');
			target_views.forEach(
				function(view_name)
				{
					var promise = DevaptResources.get_resource_instance(view_name);
					promise.done(
						function(view)
						{
							self.step(context, 'link with view [' + view.name + ']');
							
							if (view.on_pagination_previous_event)
							{
								self.add_event_callback('devapt.pagination.update_previous', [view, view.on_pagination_previous_event], false);
							}
							
							if (view.on_pagination_current_event)
							{
								self.add_event_callback('devapt.pagination.update_current', [view, view.on_pagination_current_event], false);
							}
							
							if (view.on_pagination_next_event)
							{
								self.add_event_callback('devapt.pagination.update_next', [view, view.on_pagination_next_event], false);
							}
							
							if (self.on_update_pagination)
							{
								view.add_event_callback('devapt.pagination.update_pagination', [self, self.on_update_pagination], false);
							}
						}
					);
				}
			);
			
			
			self.leave(context, 'success: promise is resolved');
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				On update pagination event
		 * @param {array}		arg_event_operands		event operands array
		 * @return {nothing}
		 */
		self.on_update_pagination = function(arg_event_operands)
		{
			var self = this;
			var context = 'on_update_pagination(opds)';
			self.enter(context, '');
			
			
			// TEST STATUS
			if (self.status === 'on_update_pagination')
			{
				self.leave(context, 'already processing event');
				return;
			}
			
			// CHANGE STATUS
			self.status = 'on_update_pagination';
			
			// console.log(arg_event_operands, context);
			
			var items_first_index = arg_event_operands[2];
			var items_last_index = arg_event_operands[3];
			
			self.pagination_first_page =  Math.floor(items_first_index / self.pagination_size);
			if (self.pagination_first_page*self.pagination_size < items_first_index)
			{
				self.pagination_first_page++; 
			}
			
			self.pagination_last_page = Math.floor(items_last_index / self.pagination_size);
			if (self.pagination_last_page*self.pagination_size < items_last_index)
			{
				self.pagination_last_page++; 
			}
			
			self.pagination_first_page =  Math.max(self.pagination_first_page, 1);
			self.pagination_last_page =  Math.max(self.pagination_last_page, 1);
			
			// console.log(self.pagination_first_page, context + '.pagination_first_page');
			// console.log(self.pagination_last_page, context + '.pagination_last_page');
			
			self.pagination_current_page = Math.min(self.pagination_current_page, self.pagination_last_page);
			self.pagination_current_page = Math.max(self.pagination_current_page, self.pagination_first_page);
			// console.log(self.pagination_current_page, context + '.pagination_current_page');
			// console.log(self.pagination_size, context + '.pagination_size');
			
			self.update_pagination_current(self.pagination_current_page);
			
			// var deferred = $.Deferred();
			// self.remove_items();
			// self.render_items(deferred);
			
			// CHANGE STATUS
			self.status = 'ready';
			
			
			self.leave(context, 'success');
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				On page choice
		 * @param {integer}		arg_current_page	new current index
		 * @return {boolean}	true:success,false:failure
		 */
		self.update_pagination_current = function(arg_current_page)
		{
			var self = this;
			var context = 'update_pagination_current(' + arg_current_page + ')';
			self.enter(context, '');
			
			
			// CHECK CURRENT INDEX
			if ( ! DevaptTypes.is_integer(arg_current_page) )
			{
				self.leave(context, 'bad index type');
				return false;
			}
			if ( arg_current_page > self.pagination_last_page || arg_current_page < self.pagination_first_page )
			{
				self.leave(context, 'bad index value');
				return false;
			}
			
			// GET ARROW TAGS
			var prev_arrow_jqo = $('li.arrow:first', self.parent_jqo);
			var next_arrow_jqo = $('li.arrow:last', self.parent_jqo);
			
			// UPDATE ARROWS
			if (self.pagination_current_page == self.pagination_first_page)
			{
				prev_arrow_jqo.removeClass('unavailable');
			}
			if (self.pagination_current_page == self.pagination_last_page)
			{
				next_arrow_jqo.removeClass('unavailable');
			}
			
			
			// WITHOUT PAGE SCROLLING
			if (self.pagination_last_page <= self.pagination_size)
			{
				// SHOW/HIDE NODES
				var nodes_jqo = $('li', self.ul_jqo);
				nodes_jqo = $('li', self.ul_jqo).show();
				for(var li_index = self.pagination_last_page + 1 ; li_index <= self.pagination_size ; li_index++)
				{
					nodes_jqo.eq(li_index).removeClass('current').hide();
				}
				
				self.update_pagination_current_without_scrolling(arg_current_page);
			}
			// WITH PAGE SCROLLING
			else
			{
				self.update_pagination_current_with_scrolling(arg_current_page);
			}
			
			
			// UPDATE ARROWS
			if (self.pagination_current_page == self.pagination_first_page)
			{
				prev_arrow_jqo.addClass('unavailable');
			}
			if (self.pagination_current_page == self.pagination_last_page)
			{
				next_arrow_jqo.addClass('unavailable');
			}
			
			
			// PROPAGATE EVENT
			self.fire_event('devapt.pagination.update_current', [arg_current_page]);
			
			
			self.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Update current page without pages scrolling
		 * @param {integer}		arg_current_page	new current index
		 * @return {boolean}	true:success,false:failure
		 */
		self.update_pagination_current_without_scrolling = function(arg_current_page)
		{
			var self = this;
			var context = 'update_pagination_current_without_scrolling(' + arg_current_page + ')';
			self.enter(context, '');
			
			
			// GET PREVIOUS INDEX TAGS
			var prev_li_jqo = $('[devapt-pagination-index=' + self.pagination_current_page + ']', self.parent_jqo)
			prev_li_jqo.removeClass('current');
			
			// SET NEW CURRENT INDEX
			self.pagination_current_page = arg_current_page;
			
			// GET INDEX TAG
			var li_jqo = $('[devapt-pagination-index=' + arg_current_page + ']', self.parent_jqo);
			// console.log(li_jqo);
			
			// UPDATE CURRENT PAGE TAG
			li_jqo.addClass('current');
			
			// SET OLD CURRENT INDEX
			// self.update_pagination_item(self.pagination_current_page, self.pagination_current_page, self.pagination_current_page, false, true);
			
			// SET NEW CURRENT INDEX
			// self.pagination_current_page = arg_current_page;
			// self.update_pagination_item(arg_current_page, arg_current_page, arg_current_page, true, true);
			
			
			self.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Update current page with pages scrolling
		 * @param {integer}		arg_current_page	new current index
		 * @return {boolean}	true:success,false:failure
		 */
		self.update_pagination_current_with_scrolling = function(arg_current_page)
		{
			var self = this;
			var context = 'update_pagination_current_with_scrolling(' + arg_current_page + ')';
			self.enter(context, '');
			
			
			// SET NEW CURRENT INDEX
			self.pagination_current_page = arg_current_page;
			
			// GET PAGES ATTRIBUTES
			var last_page = self.pagination_last_page > 0 ? self.pagination_last_page : 10;
			var first_page = (self.pagination_first_page >=0 && self.pagination_first_page <= last_page) ? self.pagination_first_page : 0;
			var current_page = (self.pagination_current_page >= first_page && self.pagination_current_page <= last_page) ? self.pagination_current_page : first_page;
			self.value(context, 'last_page', last_page);
			self.value(context, 'first_page', first_page);
			self.value(context, 'current_page', current_page);
			
			
			// GET SIZE ATTRIBUTES
			var size_index = self.pagination_size > 0 ? self.pagination_size - 1 : 10;
			var loop_size_index = Math.min(first_page + size_index, last_page);
			var size_half = Math.ceil(loop_size_index / 2);
			self.value(context, 'size_index', size_index);
			self.value(context, 'loop_size_index', loop_size_index);
			self.value(context, 'size_half', size_half);
			
			
			// GET PREFIX/SUFFIX ATTRIBUTES
			if (last_page > self.pagination_size)
			{
				if (self.pagination_prefix_size == 0)
				{
					self.pagination_prefix_size = 1;
				}
				if (self.pagination_suffix_size == 0)
				{
					self.pagination_suffix_size = 1;
				}
			}
			var prefix_size = self.pagination_prefix_size > 0 && self.pagination_prefix_size < (size_index / 2 - 1) ? self.pagination_prefix_size : 0;
			var suffix_size = self.pagination_suffix_size > 0 && self.pagination_suffix_size < (size_index / 2 - 1) ? self.pagination_suffix_size : 0;
			self.value(context, 'prefix_size', prefix_size);
			self.value(context, 'suffix_size', suffix_size);
			
			var prefix_first_index = 1;
			var prefix_first_page = first_page;
			var prefix_last_index = prefix_first_index + prefix_size - 1;
			var prefix_last_page = prefix_first_page + prefix_size - 1;
			self.value(context, 'prefix_first_index', prefix_first_index);
			self.value(context, 'prefix_first_page', prefix_first_page);
			self.value(context, 'prefix_last_index', prefix_last_index);
			self.value(context, 'prefix_last_page', prefix_last_page);
			
			var prefix_sep_index = prefix_last_index + 1;
			var prefix_sep_page = -1;
			self.value(context, 'prefix_sep_index', prefix_sep_index);
			self.value(context, 'prefix_sep_page', prefix_sep_page);
			
			
			var loop_first_index = prefix_sep_index + 1;
			var loop_last_index = loop_size_index - suffix_size - 1;
			var loop_first_page = current_page - size_half + prefix_size + 1;
			if (current_page >= last_page - suffix_size - 3)
			{
				loop_first_page = last_page - size_index + prefix_size + 1;
			}
			var loop_last_page = loop_first_page + (loop_last_index - loop_first_index);
			self.value(context, 'loop_first_index', loop_first_index);
			self.value(context, 'loop_last_index', loop_last_index);
			self.value(context, 'loop_first_page', loop_first_page);
			self.value(context, 'loop_last_page', loop_last_page);
			
			
			var suffix_sep_index = loop_last_index + 1;
			var suffix_sep_page = -1;
			self.value(context, 'suffix_sep_index', suffix_sep_index);
			self.value(context, 'suffix_sep_page', prefix_sep_page);
			
			
			var suffix_first_index = loop_size_index - suffix_size + 1;
			var suffix_first_page = last_page - suffix_size + 1;
			var suffix_last_index = suffix_first_index + suffix_size - 1;
			var suffix_last_page = suffix_first_page + suffix_size - 1;
			self.value(context, 'suffix_first_index', suffix_first_index);
			self.value(context, 'suffix_first_page', suffix_first_page);
			self.value(context, 'suffix_last_index', suffix_last_index);
			self.value(context, 'suffix_last_page', suffix_last_page);
			
			
			// LOOP ON PAGES TAGS PREFIX
			self.step(context, 'loop on prefix tags');
			var loop_page = prefix_first_page;
			for(var li_index = prefix_first_index ; li_index <= prefix_last_index ; li_index++)
			{
				self.value(context, 'loop_page', loop_page);
				self.value(context, 'li_index', li_index);
				
				var is_current = first_page + li_index - 1 === current_page;
				var is_available = true;
				var label = loop_page;
				self.update_pagination_item(li_index, loop_page, label, is_current, is_available);
				++loop_page;
			}
			
			
			// SUFFIX SEPARATOR TAG
			if (prefix_size > 0 && loop_first_page > prefix_last_page + 1)
			{
				self.update_pagination_item(prefix_sep_index, prefix_sep_page, '...', false, false);
			}
			else
			{
				loop_first_index = prefix_sep_index;
				loop_first_page = prefix_last_page + 1;
			}
			
			// LOOP ON PAGES TAGS
			self.step(context, 'loop on core tags');
			loop_page = loop_first_page;
			for(var li_index = loop_first_index ; li_index <= loop_last_index ; li_index++)
			{
				self.value(context, 'loop_page', loop_page);
				self.value(context, 'li_index', li_index);
				
				var is_current = loop_page == current_page;
				var is_available = true;
				var label = loop_page;
				self.update_pagination_item(li_index, loop_page, label, is_current, is_available);
				
				++loop_page;
			}
			
			
			// SUFFIX SEPARATOR TAG
			self.step(context, 'suffix separator');
			self.value(context, 'loop_page', loop_page);
			if (suffix_size > 0 && loop_page < suffix_first_page - 1)
			{
				self.update_pagination_item(suffix_sep_index, suffix_sep_page, '...', false, false);
			}
			else
			{
				suffix_first_index = suffix_sep_index;
				suffix_first_page = loop_page;
			}
			
			
			// LOOP ON PAGES TAGS SUFFIX
			self.step(context, 'loop on suffix tags');
			loop_page = suffix_first_page;
			for(var li_index = suffix_first_index ; li_index <= suffix_last_index ; li_index++)
			{
				self.value(context, 'loop_page', loop_page);
				self.value(context, 'li_index', li_index);
				
				var is_current = loop_page == current_page;
				var is_available = true;
				var label = loop_page;
				self.update_pagination_item(li_index, loop_page, label, is_current, is_available);
				
				++loop_page;
			}
			
			
			self.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Get page label
		 * @param {integer}		page index
		 * @return {string}		page label
		 */
		self.get_page_label = function(arg_page_index)
		{
			var self = this;
			var context = 'get_item_label(page_index)';
			// self.enter(context, '');
			
			var step = DevaptTypes.is_integer(self.pagination_range_step) ? self.pagination_range_step : 1;
			var type = self.pagination_type;
			var label = 'unknow';
			// console.log(step, 'step');
			// console.log(type, 'type');
			switch (type)
			{
				case 'alphabet':
				{
					var alphabet = 'abcdefghijklmnopqrstuvwxyz';
					label = DevaptTypes.is_integer(arg_page_index) && arg_page_index > 0 && arg_page_index <= 26 ? alphabet.charAt(arg_page_index - 1) : arg_page_index;
					break;
				}
				
				case 'range':
				{
					label = DevaptTypes.is_integer(arg_page_index) && arg_page_index > 0 ? ((arg_page_index - 1) * step) + '-' + (arg_page_index * step - 1) : arg_page_index;
					break;
				}
				
				case 'index':
				default:
				{
					label = arg_page_index;
					break;
				}
			}
			
			
			// self.leave(context, 'success');
			return label;
		}
			
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Update page item
		 * @param {integer}		list index
		 * @param {integer}		page index
		 * @param {string}		page label
		 * @param {boolean}		is current page ?
		 * @param {boolean}		is available page ?
		 * @return {boolean}	true:success,false:failure
		 */
		self.update_pagination_item = function(arg_item_index, arg_page_index, arg_page_label, arg_is_current, arg_is_available)
		{
			var self = this;
			var context = 'update_pagination_item(item_index,page_index,page_label,is_current,is_available)';
			// self.enter(context, '');
			
			
			// ADD NODE IF NEEDED
			var items_count = $('li', self.ul_jqo).length;
			var current_page = (arg_is_current ? arg_page_index : -1);
			while (arg_item_index >= items_count)
			{
				self.add_item(arg_item_index, current_page);
				++items_count;
			}
			
			// GET NODE
			var li_jqo = $('li:eq(' + arg_item_index + ')', self.parent_jqo)
			li_jqo.show();
			li_jqo.removeClass('current');
			
			// GET NODE ANCHOR
			var a_jqo = $('a', li_jqo);
			var label = self.get_page_label(arg_page_label);
			a_jqo.text(label);
			
			// UPDATE NODE
			li_jqo.attr('devapt-pagination-index', arg_page_index);
			
			if (arg_is_current)
			{
				li_jqo.addClass('current');
			}
			else
			{
				li_jqo.removeClass('current');
			}
			
			if ( arg_is_available )
			{
				li_jqo.removeClass('unavailable');
			}
			else
			{
				li_jqo.addClass('unavailable');
			}
			
			
			// self.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				On previous page
		 * @return {boolean}	true:success,false:failure
		 */
		self.update_pagination_previous = function()
		{
			var self = this;
			var context = 'update_pagination_previous()';
			self.enter(context, '');
			
			
			if (self.pagination_current_page == self.pagination_first_page)
			{
				self.leave(context, 'already at first page, nothing to do');
				return true;
			}
			
			// UPDATE CURRENT PAGE
			self.update_pagination_current(parseInt(self.pagination_current_page) - 1);
			
			// PROPAGATE EVENT
			self.fire_event('devapt.pagination.update_previous', self.pagination_current_page);
			
			
			self.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				On next page
		 * @return {boolean}	true:success,false:failure
		 */
		self.update_pagination_next = function()
		{
			var self = this;
			var context = 'update_pagination_next()';
			self.enter(context, '');
			
			
			// CHECK INDEX
			if (self.pagination_current_page == self.pagination_last_page)
			{
				self.leave(context, 'already at last page, nothing to do');
				return true;
			}
			
			// UPDATE CURRENT PAGE
			self.update_pagination_current(parseInt(self.pagination_current_page) + 1);
			
			// PROPAGATE EVENT
			self.fire_event('devapt.pagination.update_next', self.pagination_current_page);
			
			
			self.leave(context, 'success');
			return true;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Render view
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
			
			
			// CHECK CONTAINER
			self.assertNotNull(context, 'parent_jqo', self.parent_jqo);
			// console.log(self.parent_jqo);
			
			
			// CREATE MAIN NODE
			var div_jqo = $('<div>');
			self.parent_jqo.append(div_jqo);
			if ( self.get_property('pagination_centered') )
			{
				div_jqo.addClass('pagination-centered');
			}
			self.ul_jqo = $('<ul>');
			self.ul_jqo.addClass('pagination');
			div_jqo.append(self.ul_jqo);
			self.content_jqo = div_jqo;
			
			
			var promise = self.render_items(arg_deferred);
			
			
			self.leave(context, 'success: promise is resolved');
			return promise;
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Remove view items
		 * @return {nothing}
		 */
		self.remove_items = function()
		{
			var self = this;
			var context = 'remove_items()';
			self.enter(context, '');
			
			
			$('li', self.ul_jqo).remove();
			
			
			self.leave(context, self.msg_success);
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Render view items
		 * @param {integer}		arg_index			item index
		 * @param {integer}		arg_current_page	current page
		 * @return {nothing}
		 */
		self.add_item = function(arg_index, arg_current_page)
		{
			var self = this;
			var context = 'add_item(index,current)';
			self.enter(context, '');
			
			
			// CREATE LI TAG
			var li_jqo = $('<li>');
			self.ul_jqo.append(li_jqo);
			li_jqo.attr('devapt-pagination-index', arg_index);
			if (arg_index === arg_current_page)
			{
				li_jqo.addClass('current');
			}
			
			// CREATE A TAG
			var a_jqo = $('<a>');
			li_jqo.append(a_jqo);
			a_jqo.attr('href', '#');
			var label = self.get_page_label(arg_index);
			a_jqo.text(label);
			
			// ON CLICK
			a_jqo.click(
				function()
				{
					if ( ! $(this).parent().hasClass('unavailable') )
					{
						var index = $(this).parent().attr('devapt-pagination-index');
						self.update_pagination_current( parseInt(index) );
					}
				}
			);
			
			
			self.leave(context, self.msg_success);
		}
		
		
		/**
		 * @public
		 * @memberof			DevaptPagination
		 * @desc				Render view items
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_items = function(arg_deferred)
		{
			var self = this;
			var context = 'render_items(deferred)';
			self.enter(context, '');
			
			
			// GET ATTRIBUTES
			var size_index = self.pagination_size > 0 ? self.pagination_size - 1 : 10;
			var last_page = self.pagination_last_page > 0 ? self.pagination_last_page : 10;
			var first_page = (self.pagination_first_page >=0 && self.pagination_first_page <= last_page) ? self.pagination_first_page : 0;
			var current_page = (self.pagination_current_page >= first_page && self.pagination_current_page <= last_page) ? self.pagination_current_page : first_page;
			size_index = Math.min(first_page + size_index, last_page);
			self.value(context, 'size_index', size_index);
			self.value(context, 'last_page', last_page);
			self.value(context, 'first_page', first_page);
			self.value(context, 'current_page', current_page);
			
			
			// CREATE LEFT ARROW
			var left_arrow_li_jqo = $('<li class="arrow">');
			self.ul_jqo.append(left_arrow_li_jqo);
			if (current_page === first_page)
			{
				left_arrow_li_jqo.addClass('unavailable');
			}
			
			var left_arrow_a_jqo = $('<a href="#">&laquo;</a>');
			left_arrow_li_jqo.append(left_arrow_a_jqo);
			
			// ON CLICK
			left_arrow_a_jqo.click(
				function()
				{
					self.update_pagination_previous();
				}
			);
			
			// CREATE PAGES
			for(var loop_index = first_page ; loop_index <= size_index ; loop_index++)
			{
				self.value(context, 'loop_index', loop_index);
				
				self.add_item(loop_index, current_page);
			}
			
			
			// CREATE LEFT ARROW
			var right_arrow_li_jqo = $('<li class="arrow">');
			self.ul_jqo.append(right_arrow_li_jqo);
			if (current_page === last_page)
			{
				right_arrow_li_jqo.addClass('unavailable');
			}
			
			var right_arrow_a_jqo = $('<a href="#">&raquo;</a>');
			right_arrow_li_jqo.append(right_arrow_a_jqo);
			
			// ON CLICK
			right_arrow_a_jqo.click(
				function()
				{
					self.update_pagination_next();
				}
			);
			
			// RESOLVE AND GET PROMISE
			arg_deferred.resolve();
			var promise = arg_deferred.promise();
			
			
			self.leave(context, 'success: promise is resolved');
			return promise;
		}
		
		
		// INIT EVENT HANDLING
		self.init_event_handling();
		// console.log(self.name, 'init_event_handling');
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptPagination, ['DevaptView'], 'Luc BORIES', '2013-08-21', 'Split contents of a list within a grid.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptPagination, 'pagination_type',			'index', false, []); //  index / alphabet / range
	DevaptOptions.register_int_option(DevaptPagination, 'pagination_range_step',	1, false, []); //  page = index * range_step
	DevaptOptions.register_int_option(DevaptPagination, 'pagination_size',			10, false, []);
	DevaptOptions.register_int_option(DevaptPagination, 'pagination_first_page',	1, false, []);
	DevaptOptions.register_int_option(DevaptPagination, 'pagination_current_page',	5, false, []);
	DevaptOptions.register_int_option(DevaptPagination, 'pagination_last_page',		10, false, []);
	DevaptOptions.register_int_option(DevaptPagination, 'pagination_prefix_size',	0, false, []);
	DevaptOptions.register_int_option(DevaptPagination, 'pagination_suffix_size',	0, false, []);
	DevaptOptions.register_bool_option(DevaptPagination, 'pagination_centered',		true, false, []);
	DevaptOptions.register_array_option(DevaptPagination, 'pagination_views',		[], false, ',', 'String', []);
	
	
	return DevaptPagination;
} );