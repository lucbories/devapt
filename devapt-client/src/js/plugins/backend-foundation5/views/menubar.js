/**
 * @file        plugins/backend-foundation5/views/menubar.js
 * @desc        Foundation 5 menubar class
 * 		API
 * 			PUBLIC METHODS
 * 				constructor(self):nothing
 * 				render_self(arg_deferred):promise
 * 				render_top_menubar():boolean
 * 				render_top_menubar_title():boolean
 * 				switch_top_menubar(arg_menubar_name):boolean
 * 				render_top_menubar_menu(arg_menu_declaration, arg_parent_menu_jqo):boolean
 * 				render_nav_menubar():boolean
 * 				
 * 			PRIVATE METHODS
 * 				
 * 			ATTRIBUTES
 * 				
 * 				
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict'
define(
['Devapt', 'core/types', 'object/class', 'object/classes', 'core/resources', 'views/view', 'core/application', 'core/nav-history', 'plugins/backend-foundation5/foundation-init'],
function(Devapt, DevaptTypes, DevaptClass, DevaptClasses, DevaptResources, DevaptView, DevaptApplication, DevaptNavHistory, undefined)
{
	/**
	 * @public
	 * @class				DevaptMenubar
	 * @desc				Menubar view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_parent_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	
	/**
	 * @public
	 * @memberof			DevaptMenubar
	 * @desc				Constructor
	 * @return {nothing}
	 */
	var cb_constructor = function(self)
	{
		var context = self.class_name + '(' + self.name + ')';
		self.enter(context, 'constructor');
		
		
		// DEBUG
		// self.trace = true;
		// console.log('menubar created', context);
		
		self.nav_jqo = null;
		
		self._super_ctor();
		
		
		self.leave(context, 'success');
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptMenubar
	 * @desc				Render view
	 * @param {object}		arg_deferred	deferred object
	 * @return {object}		deferred promise object
	 */
	var cb_render_self = function(arg_deferred)
	{
		var self = this;
		// self.trace=true;
		var context = 'render_self(deferred)';
		self.enter(context, '');
		
		
		// GET MAIN PROMISE
		self.menubar_declaration = self;
		
		// MENUBAR DECLARATION IS NOT AN OBJECT
		self.step(context, 'menubar declaration is not an object');
		
		
		// RENDER MENUBAR
		
		// GET NODES
		self.assert_not_null(context, 'parent_jqo', self.parent_jqo);
		self.content_jqo = $('<div>');
		self.nav_jqo = $('<nav>');
		self.content_jqo.append(self.nav_jqo);
		// console.log(self.parent_jqo, 'self.parent_jqo');
		// console.log(self.content_jqo, 'self.content_jqo');
		self.parent_jqo.prepend(self.content_jqo);
		
		// GET MENUBAR NAME
		self.assert_not_empty_string(context, 'self.menubar_name', self.menubar_name);
		
		
		// CHECK MENUBAR DECLARATION
		// self.menubar_declaration = menubar_declaration;
		self.assert_not_empty_value(context, 'self.menubar_declaration', self.menubar_declaration);
		
		
		// GET MENUBAR FORMAT
		if ( DevaptTypes.is_not_empty_str(self.menubar_format) )
		{
			self.menubar_format = self.menubar_format.toLocaleLowerCase();
			self.menubar_format = DevaptTypes.to_list_item(self.menubar_format, ['top', 'nav'], 'nav');
			self.value(context, 'self.menubar_format', self.menubar_format);
		}
		else if ( DevaptTypes.is_not_empty_str(self.menubar_declaration['format']) )
		{
			self.value(context, 'self.menubar_declaration[format].toLocaleLowerCase()', self.menubar_declaration['format'].toLocaleLowerCase());
			self.menubar_format = DevaptTypes.to_list_item(self.menubar_declaration['format'].toLocaleLowerCase(), ['top', 'nav'], 'nav');
			self.value(context, 'self.menubar_format', self.menubar_format);
		}
		self.assert_not_empty_string(context, 'self.menubar_declaration', self.menubar_format);
		
		// self.trace=false;
		// RENDER TOP OR NAV MENUBAR
		switch (self.menubar_format)
		{
			case 'nav' :
			{
				break;
			}
			
			case 'top' :
			{
				if ( ! self.render_top_menubar() )
				{
					console.error('render top menubar failure');
					self.error(context, 'render top menubar failure');
					self.leave(context, 'failure: promise is rejected');
					return Devapt.promise_rejected('render top menubar failure');
				}
				
				// self.is_rendered = true;
				// console.info('menubar rendered', self.name);
				
				$(document).foundation('topbar');
				break;
			}
		}
		
		arg_deferred.resolve();
		
		
		self.leave(context, 'success: render promise is async');
		return Devapt.promise(arg_deferred);
	}
	
	
	
	/*
		Exemple : (source=http://foundation.zurb.com/docs/components/topbar.html)
		<nav class="top-bar" data-topbar>
		  <ul class="title-area">
			<li class="name">
			  <h1><a href="#">My Site</a></h1>
			</li>
			 <!-- Remove the class "menu-icon" to get rid of menu icon. Take out "Menu" to just have icon alone -->
			<li class="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
		  </ul>

		  <section class="top-bar-section">
			<!-- Right Nav Section -->
			<ul class="right">
			  <li class="active"><a href="#">Right Button Active</a></li>
			  <li class="has-dropdown">
				<a href="#">Right Button Dropdown</a>
				<ul class="dropdown">
				  <li><a href="#">First link in dropdown</a></li>
				</ul>
			  </li>
			</ul>

			<!-- Left Nav Section -->
			<ul class="left">
			  <li><a href="#">Left Nav Button</a></li>
			</ul>
		  </section>
		</nav>
	*/
	
	/**
	 * @public
	 * @memberof			DevaptMenubar
	 * @desc				Render top menu bar view
	 * @return {boolean}	true:success,false:failure
	 */
	var cb_render_top_menubar = function()
	{
		var self = this;
		var context = 'render_top_menubar()';
		self.enter(context, '');
		
		
		// DEBUG DECLARATION
		// console.log(self, 'self');
		// console.log(self.menubar_declaration, 'menubar_declaration');
		
		// CREATE NAV TAG
		self.content_jqo.attr('id', self.name + '_id');
		self.nav_jqo.addClass('top-bar');
		self.nav_jqo.attr('data-topbar', '');
		self.nav_jqo.attr('role', 'navigation');
		
		
		// OPTION: FIXED
		if ( DevaptTypes.to_boolean( self.menubar_declaration['fixed'] ) )
		{
			self.content_jqo.addClass('fixed');
		}
		
		// OPTION: ONGRID
		if ( DevaptTypes.to_boolean( self.menubar_declaration['ongrid'] ) )
		{
			self.content_jqo.addClass('contain-to-grid');
		}
		
		// OPTION: ONGRID
		if ( DevaptTypes.to_boolean( self.menubar_declaration['float'] ) )
		{
			self.content_jqo.addClass('sticky');
		}
		
		// OPTION: CLICKABLE
		if ( DevaptTypes.to_boolean( self.menubar_declaration['clickable'] ) )
		{
			self.nav_jqo.attr('data-options', 'is_hover: false');
		}
		
		
		// CREATE TITLE AREA
		self.render_top_menubar_title();
		
		// CREATE MENUS
		self.step(context, 'create section');
		var section_jqo = $('<section class="top-bar-section">');
		self.nav_jqo.append(section_jqo);
		
		self.step(context, 'create right');
		var right_jqo = $('<ul class="right">');
		section_jqo.append(right_jqo);
		
		self.step(context, 'create left');
		var left_jqo = $('<ul class="left">');
		section_jqo.append(left_jqo);
		
		self.step(context, 'get menus names');
		var menu_names = self.menubar_declaration['items'];
		
		// self.value(context, 'menu_names', menu_names);
		self.assert_true(context, 'menu_names is array', DevaptTypes.is_array(menu_names) );
		
		self.step(context, 'get menus resources');
		var menu_resources = self.menubar_declaration['items_resources'];
		// console.log(menu_resources, 'menu_resources');
		// self.value(context, 'menu_resources', menu_resources);
		self.assert_true(context, 'menu_resources is array', DevaptTypes.is_object(menu_resources) );
		
		self.step(context, 'loop on menu names');
		for(var menu_name_index in menu_names)
		{
			var menu_name = menu_names[menu_name_index];
			self.value(context, 'loop.menu_name', menu_name);
			
			var menu_declaration = menu_resources[menu_name];
			// self.value(context, 'menu_declaration', menu_declaration);
			self.assert_true(context, 'menu_declaration is object', DevaptTypes.is_object(menu_declaration) );
			
			menu_declaration['menu_name'] = menu_name;
			
			var position	= DevaptTypes.to_list_item(menu_declaration['position'], ['left', 'right'], 'left');
			var parent_jqo	= (position === 'left') ? left_jqo : right_jqo;
			var menu_render_result = self.render_top_menubar_menu(menu_declaration, parent_jqo);
			// console.log(menu_render_result, 'menu_render_result');
			self.assert_true(context, 'render menu', menu_render_result);
		}
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptMenubar
	 * @desc				Render top menu bar title
	 * @return {boolean}	true:success,false:failure
	 */
	var cb_render_top_menubar_title = function()
	{
		var self = this;
		var context = 'render_top_menubar_title()';
		self.enter(context, '');
		
		
		// CREATE TITLE TAG
		var title_jqo = $('<ul>');
		title_jqo.addClass('title-area');
		self.nav_jqo.append(title_jqo);
		
		// TITLE NAME
		var title = DevaptApplication.get_title();
		
		var title_name_jqo = $('<li>');
		title_name_jqo.addClass('name');
		title_jqo.append(title_name_jqo);
		
		var url = Devapt.url( DevaptApplication.get_url_base(), DevaptApplication.get_security_token() );
		var title_anchor_jqo = $('<a href="' + url + '">');
		title_anchor_jqo.text(title);
		
		var title_h1_jqo = $('<h1>');
		title_h1_jqo.append(title_anchor_jqo);
		title_name_jqo.append(title_h1_jqo);
		
		// TODO TITLE ICON
		
		
		// MOBILE MENU
		var toggle_li_jqo = $('<li class="toggle-topbar menu-icon">');
		title_jqo.append(toggle_li_jqo);
		toggle_li_jqo.append( $('<a href="#">').append( $('<span>').text('menu') ) );
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptMenubar
	 * @desc				Switch current top menu bar with the given menubar
	 * @param {object}		arg_menubar_object		target menubar object	
	 * @param {boolean}		arg_render_view			render default menubar view ?	
	 * @return {boolean}	true:success,false:failure
	 */
	var cb_switch_top_menubar = function(arg_menubar_object, arg_render_view)
	{
		var self = this;
		// self.trace=true;
		var context = 'switch_top_menubar(menubar,render)';
		self.enter(context, '');
		
		
		arg_render_view = arg_render_view ? arg_render_view : false;
		
		
		// DEBUG
		// console.log(self.name, 'self.name');
		// console.log(arg_menubar_object, 'arg_menubar_object');
		// console.log(arg_menubar_object.name, 'arg_menubar_object.name');
		
		
		// REMOVE CURRENT MENUBAR
		self.step(context, 'hide current menubar');
		self.content_jqo.hide();
		
		
		// SET TARGET PARENT IF NEEDED
		if ( arg_menubar_object.parent_jqo.attr('id') !== self.parent_jqo.attr('id') )
		{
			self.step(context, 'set menubar parent');
			// console.log(self.parent_jqo.attr('id'), 'self.parent_jqo.id');
			// console.log(arg_menubar_object.parent_jqo.attr('id'), 'arg_menubar_object.parent_jqo.id');
			
			arg_menubar_object.content_jqo = self.parent_jqo;
			self.parent_jqo.prepend(arg_menubar_object.content_jqo);
		}
		
		
		// SHOW TARGET MENUBAR
		self.step(context, 'show target menubar');
		arg_menubar_object.content_jqo.show();
		DevaptNavHistory.current_topbar_name = arg_menubar_object.name;
		
		
		// RENDER DEFAULT VIEW
		var view_name = arg_menubar_object['default_view'];
		var content_id = arg_menubar_object['default_container'];
		var content_label = arg_menubar_object['default_label'];
		self.value(context, 'view_name', view_name);
		if ( arg_render_view && DevaptTypes.is_not_empty_str(view_name) )
		{
			self.step(context, 'set menubar default view');
			
			var url_base = DevaptApplication.get_url_base(); 
			var display_url = url_base + 'views/' + view_name + '/html_page';
			var force_render = false;
			
			var promise = DevaptNavHistory.set_page_view_content(content_label, content_id, view_name, content_label, display_url, force_render, arg_menubar_object.name);
		}
		
		
		self.leave(context, 'success');
		// self.trace=false;
		return true;
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptMenubar
	 * @desc				Render top menu bar switch
	 * @param {object}		arg_menu_declaration	menu resource declaration (json object)
	 * @param {object}		arg_parent_menu_jqo		parent menu jQuery object	
	 * @return {boolean}	true:success,false:failure
	 */
	var cb_render_top_menubar_switch = function(arg_menu_declaration, arg_parent_menu_jqo)
	{
		var self = this;
		// self.trace=true;
		var context = 'render_top_menubar_switch(menubar name)';
		self.enter(context, '');
		
		
		// CREATE MENU NODE
		var menubar_name	= DevaptTypes.to_string(arg_menu_declaration['name'], '');
		var menu_id			= menubar_name + '_id';
		var label			= DevaptTypes.to_string(arg_menu_declaration['label'], '');
		var view_name		= DevaptTypes.to_string(arg_menu_declaration['default_view', '']);
		var view_label		= DevaptTypes.to_string(arg_menu_declaration['default_label'], '');
		// var page_hash		= '#view:' + view_name + ':' + view_label + ':' + view_label + ':' + menubar_name;
		
		var menu_jqo		= $('<li>');
		var menu_a_jqo = $('<a>');
		// menu_a_jqo.attr('href', page_hash);
		menu_jqo.attr('id', menu_id);
		menu_a_jqo.text(label);
		menu_jqo.append(menu_a_jqo);
		
		// TODO : MOVE TO INDEX
		arg_parent_menu_jqo.append(menu_jqo);
		
		var switch_cb = (
			function(arg_menubar_name, arg_declaration)
			{
				return function()
				{
					// self.trace=true;
					self.step(context, 'switch menubar callback');
					
					
					// NEW MENUBAR EXISTS
					var menubar_object = DevaptClasses.get_instance(arg_menubar_name);
					if (menubar_object && menubar_object.is_render_state_rendered())
					{
						self.step(context, 'menubar already exists and is rendered');
						
						self.switch_top_menubar(menubar_object, true);
						
						self.leave(context, 'success');
						// self.trace=false;
						return true;
					}
					
					
					// CREATE AND RENDER NEW MENUBAR
					self.step(context, 'create menubar and render it');
					var backend = Devapt.get_current_backend();
					var topmenubar_promise = backend.render_view( $('body header'), arg_menubar_name);
					topmenubar_promise.then(
						function()
						{
							self.step(context, 'menubar created and rendered');
							
							var menubar_object = DevaptClasses.get_instance(arg_menubar_name);
							self.value(context, 'menubar_object.name', menubar_object.name);
							self.value(context, 'menubar_object.is_rendered', menubar_object.is_rendered);
							
							self.switch_top_menubar(menubar_object, true);
							// self.trace=false;
						}
					);
				}
			}
		)(menubar_name, arg_menu_declaration);
		menu_a_jqo.click(switch_cb);
		
		
		self.leave(context, 'success');
		// self.trace=false;
		return true;
	}
	
		
	
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
	 * @memberof			DevaptMenubar
	 * @desc				Render top menu bar menu
	 * @param {object}		arg_menu_declaration	menu resource declaration (json object)
	 * @param {object}		arg_parent_menu_jqo		parent menu jQuery object	
	 * @return {boolean}	true:success,false:failure
	 */
	var cb_render_top_menubar_menu = function(arg_menu_declaration, arg_parent_menu_jqo)
	{
		var self = this;
		var context = 'render_top_menubar_menu(json,jqo)';
		self.enter(context, '');
		
		
		// DEBUG
		// self.value(context, 'arg_menu_declaration', arg_menu_declaration);
		// console.log(self, 'self');
		// console.log(arg_menu_declaration);
		// console.log(arg_parent_menu_jqo);
		
		// GET MENU TYPE
		var menu_type	= DevaptTypes.to_string(arg_menu_declaration['class_type'], '');
		if (menu_type === 'menubar')
		{
			self.step(context, 'menu type is menubar');
			var result = self.render_top_menubar_switch(arg_menu_declaration, arg_parent_menu_jqo);
			
			self.leave(context, 'top menubar switched');
			return result;
		}
		
		// GET MENU ATTRIBUTES
		self.step(context, 'get menu attributes');
		// var position	= DevaptTypes.to_list_item(arg_menu_declaration['position'], ['left', 'right'], 'left');
		var menu_name	= DevaptTypes.to_string(arg_menu_declaration['menu_name'], '');
		var index		= DevaptTypes.to_integer(arg_menu_declaration['index'], -1);
		var label		= DevaptTypes.to_string(arg_menu_declaration['label'], '');
		var tooltip		= DevaptTypes.to_string(arg_menu_declaration['tooltip'], '');
		var type		= DevaptTypes.to_string(arg_menu_declaration['type'], '');
		
		var icon		= DevaptTypes.is_object(arg_menu_declaration['icon']) ? arg_menu_declaration['icon'] : {};
		var icon_url	= DevaptTypes.to_string(icon['url'], null);
		var icon_alt	= DevaptTypes.to_string(icon['alt'], null);
		
		var display		= DevaptTypes.is_object(arg_menu_declaration['display']) ? arg_menu_declaration['display'] : {};
		var display_url	= DevaptTypes.to_string(display['url'], null);
		var display_page= DevaptTypes.to_string(display['page'], null);
		var display_view= DevaptTypes.to_string(display['view'], null);
		var display_cont= DevaptTypes.to_string(display['container'], display_view);
		var display_js	= DevaptTypes.to_string(display['js'], null);
		
		var menu_id		= menu_name + '_id';
		
		
		// GET CONTAINER NODE
		self.step(context, 'get container node');
		var menu_jqo	= $('<li>');
		menu_jqo.attr('id', menu_id);
		
		// TODO : MOVE TO INDEX
		arg_parent_menu_jqo.append(menu_jqo);
		
		
		// OPTION: TYPE IS SEPARATOR
		if (type === 'separator')
		{
			self.step(context, 'type is separator');
			menu_jqo.addClass('divider');
			
			self.leave(context, 'success: separator');
			return true;
		}
		
		
		// OPTION: TYPE IS SEARCH
		if (type === 'button')
		{
			self.step(context, 'type is button');
			menu_jqo.addClass('has-form');
			
			
			// MENU BUTTON
			var div_button_jqo = $('<a>');
			menu_jqo.append(div_button_jqo);
			div_button_jqo.addClass('button');
			
			// MENU BUTTON OPTION: LABEL
			div_button_jqo.text(label);
			
			// MENU BUTTON OPTION: URL
			var option_button_url = DevaptTypes.to_string(arg_menu_declaration['menu_button_url'], '#');
			div_button_jqo.attr('href', option_button_url);
			
			// MENU BUTTON OPTION: ONCLICK
			var option_button_onclick = DevaptTypes.to_string(arg_menu_declaration['menu_button_onclick'], '#');
			div_button_jqo.attr('onclick', option_button_onclick);
			
			
			self.leave(context, 'success: button');
			return true;
		}
		
		
		// OPTION: TYPE IS SEARCH
		if (type === 'search')
		{
			self.step(context, 'type is search');
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
			return true;
		}
		
		
		// DEFINE MENU NODE
		self.step(context, 'define menu node');
		var menu_a_jqo = $('<a>');
		if ( DevaptTypes.is_not_empty_str(display_url) )
		{
			self.step(context, 'menu has url');
			menu_a_jqo.attr('href', display_url);
		}
		else if ( DevaptTypes.is_not_empty_str(display_view) )
		{
			self.step(context, 'menu has view');
			var view_jqo = $('#' + display_cont);
			if (view_jqo)
			{
				var update_view_cb = (
					function(view_name, content_label, content_id)
					{
						return function()
						{
							var url_base	= DevaptApplication.get_url_base(); 
							display_url = url_base + 'views/' + view_name + '/html_page' + '?security_token=' + DevaptApplication.get_security_token();
							DevaptNavHistory.set_page_view_content(content_label, content_id, view_name, content_label, display_url, false);
						}
					}
				)(display_view, label, display_cont);
				menu_a_jqo.click(update_view_cb);
			}
		}
		else if ( DevaptTypes.is_not_empty_str(display_page) )
		{
			self.step(context, 'menu has page');
			var url_base	= DevaptApplication.get_url_base(); 
			display_url = url_base + 'views/' + display_page + '/html_page' + '?security_token=' + DevaptApplication.get_security_token();
			menu_a_jqo.attr('href', display_url);
		}
		else
		{
			self.step(context, 'menu has no url/view/page');
			menu_a_jqo.attr('href', '#');
		}
		
		if ( DevaptTypes.is_not_empty_str(display_js) )
		{
			self.step(context, 'menu has js');
			menu_a_jqo.attr('onclick', display_js);
		}
		if ( DevaptTypes.is_not_empty_str(tooltip) )
		{
			self.step(context, 'menu has tooltip');
			menu_a_jqo.attr('title', tooltip);
		}
		menu_a_jqo.text(label);
		menu_jqo.append(menu_a_jqo);
		
		
		// RENDER MENU ITEMS
		self.step(context, 'render menu items');
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
		
		// self.value(context, 'items', items);
		if (items)
		{
			// CREATE DROPDOWN
			menu_jqo.addClass('has-dropdown');
			var ul_jqo = $('<ul class="dropdown">');
			menu_jqo.append(ul_jqo);
			
			var menus_resources = self.menubar_declaration['items_resources'];
			
			for(var item_key in items)
			{
				var item_name = items[item_key];
				self.value(context, 'item menu at [' + item_key + ']', item_name);
				
				var item_json = menus_resources[item_name];
				if ( DevaptTypes.is_object(item_json) )
				{
					self.assert(context, 'render menu item', self.render_top_menubar_menu(item_json, ul_jqo) );
					continue;
				}
				self.error(context, 'bad item menu json declaration');
			}
		}
		
		
		self.leave(context, 'success');
		return true;
	}
	
	
	
	/**
	 * @public
	 * @memberof			DevaptMenubar
	 * @desc				Render top menu bar view
	 * @return {boolean}	true:success,false:failure
	 */
	var cb_render_nav_menubar = function()
	{
		var context = 'render_nav_menubar()';
		self.enter(context, '');
		
		
		
		self.leave(context, 'success');
		return true;
	}
	
	// TESTS
	/*
		var r = require(['core/object', 'backend-foundation5/views/menubar'],
			function(co, cv) {
				var options= {'class_name':'Menubar', 'class_type':'view', 'trace':true, 'name':'menus' , 'menubar_name':'HOME_MENUBAR'};
				var o = new cv('v1', $('body header'), options);
				console.log(o);
				o.render();
			}
		);
		
		require(['core/resources'],
			function(DevaptResources) {
				var app_declaration = DevaptResources.get_resource_declaration('application');
				console.log(app_declaration);
			}
		);
		
		var r = require(['core/resources'],
			function(DevaptResources) {
				console.log(DevaptResources.resources_providers);
				var menubar_declaration = DevaptResources.get_resource_declaration('HOME_MENUBAR');
				console.log(menubar_declaration);
			}
		);
		
		
	*/
	
	
	
	/* --------------------------------------------- CREATE OBJECT CLASS ------------------------------------------------ */
	
	// CREATE AND REGISTER CLASS
	var class_settings = {
		infos:{
			author:'Luc BORIES',
			created:'2013-08-21',
			updated:'2014-12-06',
			description:'Menubar View class.'
		},
		properties:{
			
		}
	};
	var parent_class = DevaptView;
	var DevaptMenubarClass = new DevaptClass('DevaptMenubar', parent_class, class_settings);
	
	// METHODS
	DevaptMenubarClass.infos.ctor = cb_constructor;
	DevaptMenubarClass.add_public_method('render_self', {}, cb_render_self);
	DevaptMenubarClass.add_public_method('render_top_menubar', {}, cb_render_top_menubar);
	DevaptMenubarClass.add_public_method('render_top_menubar_title', {}, cb_render_top_menubar_title);
	DevaptMenubarClass.add_public_method('switch_top_menubar', {}, cb_switch_top_menubar);
	DevaptMenubarClass.add_public_method('render_top_menubar_switch', {}, cb_render_top_menubar_switch);
	DevaptMenubarClass.add_public_method('render_top_menubar_menu', {}, cb_render_top_menubar_menu);
	DevaptMenubarClass.add_public_method('render_nav_menubar', {}, cb_render_nav_menubar);
	
	// PROPERTIES
	DevaptMenubarClass.add_public_str_property('menubar_name',			'',		null, true, false, []);
	DevaptMenubarClass.add_public_str_property('menubar_format',		'',		null, false, false, []); // top, nav
	DevaptMenubarClass.add_public_obj_property('menubar_declaration',	'',		null, false, false, []);
	
	DevaptMenubarClass.add_public_str_property('default_view',			'',	false, false, false, []);
	DevaptMenubarClass.add_public_str_property('default_container',		'',	false, false, false, []);
	DevaptMenubarClass.add_public_str_property('default_label',			'',	false, false, false, []);
	
	DevaptMenubarClass.add_public_str_property('format',				'',	false, false, false, []);
	DevaptMenubarClass.add_public_str_property('orientation',			'',	false, false, false, []);
	DevaptMenubarClass.add_public_bool_property('display_on_landscape',	'',	false, false, false, []);
	DevaptMenubarClass.add_public_bool_property('display_on_portrait',	'',	false, false, false, []);
	
	DevaptMenubarClass.add_public_bool_property('fixed',			'',	false, false, false, []);
	DevaptMenubarClass.add_public_bool_property('ongrid',			'',	false, false, false, []);
	DevaptMenubarClass.add_public_bool_property('float',			'',	false, false, false, []);
	DevaptMenubarClass.add_public_bool_property('clickable',		'',	false, false, false, []);
	
	DevaptMenubarClass.add_public_obj_property('items',				'',	null, false, false, []);
	DevaptMenubarClass.add_public_obj_property('items_resources',	'',	null, false, false, []);
	
	// MIXINS
	
	// BUILD
	DevaptMenubarClass.build_class();
	
	
	return DevaptMenubarClass;
} );