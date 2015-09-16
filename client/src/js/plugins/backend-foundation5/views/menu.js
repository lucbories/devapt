/**
 * @file        plugins/backend-foundation5/views/menu.js
 * @desc        Foundation 5 menubar class
 * 		API
 * 			PUBLIC METHODS
 * 				constructor(self):nothing
 * 				render_self(arg_deferred):promise
 * 				
 * 			PRIVATE METHODS
 * 				
 * 			ATTRIBUTES
 * 				
 * 				
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2015-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
	[
		'Devapt', 'core/types', 'core/resources',
		'core/navigation',
		'object/class', 'object/classes',
		'views/view',
		'plugins/backend-foundation5/foundation-init'
	],
function(
	Devapt, DevaptTypes, DevaptResources,
	DevaptNavigation,
	DevaptClass, DevaptClasses,
	DevaptView,
	undefined)
{
	/**
	 * @public
	 * @class				DevaptMenu
	 * @desc				Menubar view class
	 */
	
	var $ = window.$;
	
	/**
	 * @public
	 * @memberof			DevaptMenu
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		// DEBUG
		// self.trace = true;
		
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'Menu constructor');
		
		
		// INIT ATTRIBUTES
		self.nav_jqo = null;
		
		
		self.leave(context, 'success');
	};
	
	
	
	/*
		Example:
			application.menus.menu1.access_role=ROLE_HELP_READ
			application.menus.menu1.label=Page 1
			application.menus.menu1.tooltip=Tooltip Page 1
			application.menus.menu1.icon.url=
			application.menus.menu1.icon.alt=
			application.menus.menu1.display.url=
			application.menus.menu1.display.page=VIEW_CONTENT_1
			application.menus.menu1.display.js=
			application.menus.menu1.position=left
			application.menus.menu1.index=
	*/
	
	/**
	 * @public
	 * @memberof			DevaptMenu
	 * @desc				Render view
	 * @return {object}		deferred promise object
	 */
	var cb_render_content_self = function()
	{
		var self = this;
		var context = 'render_content_self()';
		self.enter(context, '');
		
		
		var promise = DevaptResources.get_resource_declaration(self.name);
		
		promise = promise.then(
			function(arg_menu_declaration)
			{
				try
				{
					var menu_jqo	= $('<li>');
					self.content_jqo = menu_jqo;
					
					// ADJUST MENU POSITION INTO MENUBAR
					var position	= DevaptTypes.to_list_item(arg_menu_declaration['position'], ['left', 'right'], 'left');
					if (position === 'right' && self.parent_right_jqo)
					{
						self.set_parent(self.parent_right_jqo);
					}
					
					// GET MENU ATTRIBUTES
					self.step(context, 'get menu attributes');
					var menu_type	= DevaptTypes.to_string(arg_menu_declaration['type'], '');
					
					var menu_name	= DevaptTypes.to_string(arg_menu_declaration['name'], '');
					var menu_id		= menu_name + '_id';
					
					
					
					// GET CONTAINER NODE
					self.step(context, 'get container node');
					
					menu_jqo.attr('id', menu_id);
					
					// TODO : MOVE TO INDEX
					self.parent_jqo.append(menu_jqo);
					
					
					var render_promise = null;
					
					// OPTION: TYPE IS SEPARATOR
					if (menu_type === 'separator')
					{
						self.step(context, 'type is separator');
						menu_jqo.addClass('divider');
						
						return Devapt.promise_resolved(true);
					}
					
					
					// OPTION: TYPE IS SEARCH
					if (menu_type === 'button')
					{
						self.step(context, 'type is button');
						
						render_promise = self.render_menu_button(menu_jqo, arg_menu_declaration);
						
						return render_promise;
					}
					
					
					// OPTION: TYPE IS SEARCH
					if (menu_type === 'search')
					{
						self.step(context, 'type is search');
						
						render_promise = self.render_menu_button(menu_jqo, arg_menu_declaration);
						
						return render_promise;
					}
					
					
					// DEFAULT MENU
					self.step(context, 'type is default');
						
					render_promise = self.render_menu_default(menu_jqo, arg_menu_declaration);
					
					return render_promise;
				}
				catch(e)
				{
					return Devapt.promise_rejected(e);
				}
			}
		);
		
		
		self.leave(context, Devapt.msg_success_promise);
		return promise;
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptMenu
	 * @desc				Render view
	 * @return {object}		deferred promise object
	 */
	var cb_render_menu_button = function(menu_jqo, arg_menu_declaration)
	{
		var self = this;
		// self.trace=true;
		var context = 'render_menu_button()';
		self.enter(context, '');
		
		menu_jqo.addClass('has-form');
		
		
		// MENU BUTTON
		var div_button_jqo = $('<a>');
		menu_jqo.append(div_button_jqo);
		div_button_jqo.addClass('button');
		
		// MENU BUTTON OPTION: LABEL
		var label = DevaptTypes.to_string(arg_menu_declaration['label'], '');
		div_button_jqo.text(label);
		
		// MENU BUTTON OPTION: URL
		var option_button_url = DevaptTypes.to_string(arg_menu_declaration['menu_button_url'], '#');
		div_button_jqo.attr('href', option_button_url);
		
		// MENU BUTTON OPTION: ONCLICK
		var option_button_onclick = DevaptTypes.to_string(arg_menu_declaration['menu_button_onclick'], '#');
		div_button_jqo.attr('onclick', option_button_onclick);
		
		
		self.leave(context, 'success: button');
		return Devapt.promise_resolved(true);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptMenu
	 * @desc				Render view
	 * @return {object}		deferred promise object
	 */
	var cb_render_menu_search = function(menu_jqo, arg_menu_declaration)
	{
		var self = this;
		// self.trace=true;
		var context = 'render_menu_search()';
		self.enter(context, '');
		
		
		menu_jqo.addClass('has-form');
		
		// SEARCH INPUT ROW
		var div_input_row_jqo = $('<div>');
		menu_jqo.append(div_input_row_jqo);
		div_input_row_jqo.addClass('row collapse');
		
		// SEARCH INPUT COLUMN
		var div_input_col_jqo = $('<div>');
		div_input_row_jqo.append(div_input_col_jqo);
		
		// SEARCH INPUT
		var div_input_jqo = $('<input type="text">');
		div_input_col_jqo.append(div_input_jqo);
		
		// SEARCH BUTTON COLUMN
		var div_button_col_jqo = $('<div>');
		div_input_row_jqo.append(div_button_col_jqo);
		
		// SEARCH BUTTON
		var div_button_jqo = $('<a>');
		div_button_col_jqo.append(div_button_jqo);
		div_button_jqo.addClass('button expand');
		
		
		// SEARCH INPUT OPTION: PLACEHOLDER
		var option_placeholder = DevaptTypes.to_string(arg_menu_declaration['search_placeholder'], '');
		if (option_placeholder !== '')
		{
			div_input_jqo.attr('placeholder', option_placeholder);
		}
		
		// SEARCH BUTTON OPTION: LABEL
		var option_button_label = DevaptTypes.to_string(arg_menu_declaration['search_button_label'], 'Search');
		div_button_jqo.text(option_button_label);
		
		// SEARCH BUTTON OPTION: URL
		var option_button_url = DevaptTypes.to_string(arg_menu_declaration['search_button_url'], '#');
		div_button_jqo.attr('href', option_button_url);
		
		// SEARCH BUTTON OPTION: ONCLICK
		var option_button_onclick = DevaptTypes.to_string(arg_menu_declaration['search_button_onclick'], '#');
		div_button_jqo.attr('onclick', option_button_onclick);
		
		// SEARCH INPUT OPTION: WIDTH
		var option_input_width_large = DevaptTypes.to_number(arg_menu_declaration['search_input_width_large'], '8');
		var option_input_width_small = DevaptTypes.to_number(arg_menu_declaration['search_input_width_small'], '9');
		div_input_col_jqo.addClass('large-' + option_input_width_large + ' small-' + option_input_width_small + ' columns');
		
		// SEARCH BUTTON OPTION: WIDTH
		var option_button_width_large = DevaptTypes.to_number(arg_menu_declaration['search_button_width_large'], '8');
		var option_button_width_small = DevaptTypes.to_number(arg_menu_declaration['search_button_width_small'], '9');
		div_button_col_jqo.addClass('large-' + option_button_width_large + ' small-' + option_button_width_small + ' columns');
		
		
		self.leave(context, 'success: search');
		return Devapt.promise_resolved(true);
	}
	
	
	/**
	 * @public
	 * @memberof			DevaptMenu
	 * @desc				Render view
	 * @return {object}		deferred promise object
	 */
	var cb_render_menu_default = function(menu_jqo, arg_menu_declaration)
	{
		var self = this;
		// self.trace=true;
		var context = 'render_menu_default()';
		self.enter(context, '');
		
		
		// GET MENU ATTRIBUTES
		// var position	= DevaptTypes.to_list_item(arg_menu_declaration['position'], ['left', 'right'], 'left');
		// var index		= DevaptTypes.to_integer(arg_menu_declaration['index'], -1);
		var label		= DevaptTypes.to_string(arg_menu_declaration['label'], '');
		var tooltip		= DevaptTypes.to_string(arg_menu_declaration['tooltip'], '');
		
		// var icon		= DevaptTypes.is_object(arg_menu_declaration['icon']) ? arg_menu_declaration['icon'] : {};
		// var icon_url	= DevaptTypes.to_string(icon['url'], null);
		// var icon_alt	= DevaptTypes.to_string(icon['alt'], null);
		
		var display		= DevaptTypes.is_object(arg_menu_declaration['display']) ? arg_menu_declaration['display'] : {};
		var display_url	= DevaptTypes.to_string(display['url'], null);
		var display_page= DevaptTypes.to_string(display['page'], null);
		var display_view= DevaptTypes.to_string(display['view'], null);
		var display_cont= DevaptTypes.to_string(display['container'], display_view);
		var display_js	= DevaptTypes.to_string(display['js'], null);
		var default_menubar_name = Devapt.app.main_menubar ? Devapt.app.main_menubar.name : Devapt.app.get_menubar_name()
		var display_menubar	= DevaptTypes.to_string(display['menubar'], default_menubar_name);
		
		
		// MENUBAR CASE
		var is_menubar = ('class_name' in arg_menu_declaration) && arg_menu_declaration['class_name'].toLocaleLowerCase() === 'menubar';
		if (is_menubar)
		{
			console.log(arg_menu_declaration, "menubar declaration");
			
			// var id = menu_jqo.attr('id') + '_alias';
			// menu_jqo.attr('id', id);
			
			if ('default_view' in arg_menu_declaration)
			{
				display_view = arg_menu_declaration['default_view'];
			}
			if ('default_container' in arg_menu_declaration)
			{
				display_cont = arg_menu_declaration['default_container'];
			}
			if ('default_label' in arg_menu_declaration)
			{
				label = arg_menu_declaration['default_label'];
			}
		}
		
		
		// CREATE MENU NODE
		var menu_a_jqo = $('<a>');
		
		
		// SET MENU ACTION
		if ( DevaptTypes.is_not_empty_str(display_url) )
		{
			self.step(context, 'menu has url');
			
			display_url = Devapt.url(display_url, Devapt.app.get_security_token());
			menu_a_jqo.attr('href', display_url);
		}
		else if ( DevaptTypes.is_not_empty_str(display_view) )
		{
			self.step(context, 'menu has view');
			var view_jqo = $('#' + display_cont);
			if (view_jqo)
			{
				self.step(context, 'menu has container');
				
				var update_view_cb = (
					function(arg_view_name, arg_menubar_name)
					{
						return function(event)
						{
							self.step(context, 'menu callback for view [' + arg_view_name + ']');
							// console.log(context, 'menu callback for view [%s]', arg_view_name);
							
							DevaptNavigation.goto_view(arg_view_name, arg_menubar_name);
						};
					}
				)(display_view, display_menubar);
				
				menu_a_jqo.click(update_view_cb);
			}
		}
		else if ( DevaptTypes.is_not_empty_str(display_page) )
		{
			self.step(context, 'menu has page');
			var url_base	= Devapt.app.get_url_base(); 
			display_url = url_base + 'views/' + display_page + '/html_page' + '?security_token=' + Devapt.app.get_security_token();
			menu_a_jqo.attr('href', display_url);
		}
		else
		{
			self.step(context, 'menu has no url/view/page');
			menu_a_jqo.attr('href', '#');
		}
		
		// SET MENU JS
		if ( DevaptTypes.is_not_empty_str(display_js) )
		{
			self.step(context, 'menu has js');
			menu_a_jqo.attr('onclick', display_js);
		}
		
		// SET MENU TOOLTIP
		if ( DevaptTypes.is_not_empty_str(tooltip) )
		{
			self.step(context, 'menu has tooltip');
			menu_jqo.attr('title', tooltip);
		}
		
		// SET MENU LABEL AND ATTACH IT TO ITS MENU ITEM
		menu_a_jqo.text(label);
		menu_jqo.append(menu_a_jqo);
		
		
		// RENDER MENU ITEMS
		self.step(context, 'render menu items ?');
		var items = null;
		if ( DevaptTypes.is_array(arg_menu_declaration['items']) )
		{
			self.step(context, 'arg declaration items is an array');
			items = arg_menu_declaration['items'];
		}
		else if ( DevaptTypes.is_not_empty_str(arg_menu_declaration['items']) )
		{
			self.step(context, 'arg declaration items is a string');
			items = arg_menu_declaration['items'].split(',');
		}
		
		
		// PROMISE RESULT
		var all_promises = [Devapt.promise_resolved(true)];
		
		
		// self.value(context, 'items', items);
		// console.log('menu [%s] items [%o]', self.name, items);
		if (! is_menubar && items)
		{
			// CREATE DROPDOWN
			menu_jqo.addClass('has-dropdown');
			var ul_jqo = $('<ul class="dropdown">');
			menu_jqo.append(ul_jqo);
			
			items.forEach(
				function(arg_menu_name, arg_menu_index, arg_menu_array)
				{
					// console.log('lookup for menu item [%s]', arg_menu_name);
					
					self.value(context, 'loop.menu_name', arg_menu_name);
					
					var menu_settings = {
						name: arg_menu_name,
						parent_jqo: ul_jqo,
						parent_left_jqo: ul_jqo,
						parent_right_jqo: ul_jqo
					};
					
					
					var menu_object = DevaptClasses.get_instance(arg_menu_name);
					
					if (menu_object)
					{
						// console.log('menu item instance is found for [%s]', arg_menu_name);
						self.menus.push(menu_object);
					}
					else
					{
						var menu_promise = Devapt.create('DevaptMenu', menu_settings);
						menu_promise = menu_promise.then(
							function(arg_menu)
							{
								// console.log('menu item created [%s]', arg_menu_name);
								self.menus.push(arg_menu);
								
								return arg_menu.render();
							}
						);
						all_promises.push(menu_promise);
					}
				}
			);
		}
		
		
		self.leave(context, 'success');
		return Devapt.promise_all(all_promises);
	};
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2015-08-15',
			updated:'2015-09-03',
			description:'Menu View class.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptView;
	var DevaptMenuClass = new DevaptClass('DevaptMenu', parent_class, class_settings);
	
	// METHODS
	DevaptMenuClass.infos.ctor = cb_constructor;
	DevaptMenuClass.add_public_method('render_content_self', {}, cb_render_content_self);
	DevaptMenuClass.add_public_method('render_menu_button', {}, cb_render_menu_button);
	DevaptMenuClass.add_public_method('render_menu_search', {}, cb_render_menu_search);
	DevaptMenuClass.add_public_method('render_menu_default', {}, cb_render_menu_default);
	
	// DevaptMenuClass.add_public_method('render_top_menubar', {}, cb_render_top_menubar);
	// DevaptMenuClass.add_public_method('render_top_menubar_title', {}, cb_render_top_menubar_title);
	// DevaptMenuClass.add_public_method('switch_top_menubar', {}, cb_switch_top_menubar);
	// DevaptMenuClass.add_public_method('render_top_menubar_switch', {}, cb_render_top_menubar_switch);
	// DevaptMenuClass.add_public_method('render_top_menubar_menu', {}, cb_render_top_menubar_menu);
	// DevaptMenuClass.add_public_method('render_nav_menubar', {}, cb_render_nav_menubar);
	
	// PROPERTIES
	// DevaptMenuClass.add_public_str_property('menubar_name',			'',		null, true, false, []);
	// DevaptMenuClass.add_public_str_property('menubar_format',		'',		null, false, false, []); // top, nav
	// DevaptMenuClass.add_public_obj_property('menubar_declaration',	'',		null, false, false, []);
	
	// DevaptMenuClass.add_public_str_property('default_view',			'',	false, false, false, []);
	// DevaptMenuClass.add_public_str_property('default_container',		'',	false, false, false, []);
	// DevaptMenuClass.add_public_str_property('default_label',			'',	false, false, false, []);
	
	// DevaptMenuClass.add_public_str_property('format',				'',	false, false, false, []);
	// DevaptMenuClass.add_public_str_property('orientation',			'',	false, false, false, []);
	// DevaptMenuClass.add_public_bool_property('display_on_landscape',	'',	false, false, false, []);
	// DevaptMenuClass.add_public_bool_property('display_on_portrait',	'',	false, false, false, []);
	
	// DevaptMenuClass.add_public_bool_property('fixed',			'',	false, false, false, []);
	// DevaptMenuClass.add_public_bool_property('ongrid',			'',	false, false, false, []);
	// DevaptMenuClass.add_public_bool_property('float',			'',	false, false, false, []);
	// DevaptMenuClass.add_public_bool_property('clickable',		'',	false, false, false, []);
	
	DevaptMenuClass.add_public_array_property('menus',				'',	[], false, false, []);
	DevaptMenuClass.add_public_obj_property('parent_left_jqo',		'',	null, false, false, []);
	DevaptMenuClass.add_public_obj_property('parent_right_jqo',		'',	null, false, false, []);
	// DevaptMenuClass.add_public_array_property('items_resources',	'',	null, false, false, []);
	
	// MIXINS
	
	// BUILD
	DevaptMenuClass.build_class();
	
	
	return DevaptMenuClass;
} );