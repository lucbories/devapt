/**
 * @file        backend-foundation5/views/menubar.js
 * @desc        Foundation 5 menubar class
 * @ingroup     DEVAPT_FOUNDATION5
 * @date        2014-05-09
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/resources', 'core/view', 'core/application', 'core/nav-history', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptView, DevaptApplication, DevaptNavHistory, undefined)
{
	/**
	 * @public
	 * @class				DevaptMenubar
	 * @desc				Menubar view class
	 * @param {string}		arg_name			View name (string)
	 * @param {object}		arg_container_jqo	jQuery object to attach the view to
	 * @param {object|null}	arg_options			Associative array of options
	 * @return {nothing}
	 */
	function DevaptMenubar(arg_name, arg_container_jqo, arg_options)
	{
		var self = this;
		self.trace				= false;
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_container_jqo, arg_options);
		
		// INIT
		// self.trace				= false;
		self.class_name			= 'DevaptMenubar';
		self.is_view			= true;
		
		
		/**
		 * @public
		 * @memberof			DevaptMenubar
		 * @desc				Constructor
		 * @return {nothing}
		 */
		self.DevaptMenubar_contructor = function()
		{
			// CONSTRUCTOR BEGIN
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
		self.DevaptMenubar_contructor();
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMenubar
		 * @desc				Render view
		 * @param {object}		arg_deferred	deferred object
		 * @return {object}		deferred promise object
		 */
		self.render_self = function(arg_deferred)
		{
			var self = this;
			var context = 'render_self(deferred)';
			self.enter(context, '');
		
			
			// GET MAIN PROMISE
			var promise = arg_deferred.promise();
			
			
			// TEST MENUBAR DECLARATION OBJECT
			if ( ! DevaptTypes.is_object(self.menubar_declaration) )
			{
				// MENUBAR DECLARATION IS NOT AN OBJECT
				self.step(context, 'menubar declaration is not an object');
				promise = arg_deferred.then(
					function()
					{
						self.step(context, 'get menubar declaration object');
						self.value(context, 'self.menubar_name', self.menubar_name);
						return DevaptResources.get_resource_declaration(self.menubar_name);
					}
				);
				arg_deferred.resolve(null);
			}
			else
			{
				// MENUBAR DECLARATION IS AN OBJECT
				arg_deferred.resolve(self.menubar_declaration);
			}
			
			
			// RENDER MENUBAR
			promise = promise.then(
				function(promise_result)
				{
					self.enter(context, 'render_cb');
					self.value(context, 'promise_result', promise_result);
					
					
					// GET NODES
					self.assertNotNull(context, 'container_jqo', self.container_jqo);
					self.content_jqo = $('<nav>');
					self.container_jqo.prepend(self.content_jqo);
					
					
					// GET MENUBAR NAME
					self.assertNotEmptyString(context, 'self.menubar_name', self.menubar_name);
					
					
					// CHECK MENUBAR DECLARATION
					self.menubar_declaration = promise_result;
					self.assertNotEmptyValue(context, 'self.menubar_declaration', self.menubar_declaration);
					
					
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
					self.assertNotEmptyString(context, 'self.menubar_declaration', self.menubar_format);
					
					
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
								// REJECT AND GET PROMISE
								arg_deferred.reject();
								
								self.error(context, 'render top menubar failure');
								self.leave(context, 'failure: promise is rejected');
								return promise;
							}
							
							$(document).foundation('topbar');
							break;
						}
					}
					
					
					// RESOLVE AND GET PROMISE
					// arg_deferred.resolve();
					
					
					self.leave(context, 'success: promise is resolved');
					return promise;
				}
			);
			
			
			// RESOLVE PROMISE
			// arg_deferred.resolve();
			
			
			self.leave(context, 'success: render promise is async');
			return promise;
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
		self.render_top_menubar = function()
		{
			var self = this;
			var context = 'render_top_menubar()';
			self.enter(context, '');
			
			
			// DEBUG DECLARATION
			// console.log(self.menubar_declaration, 'menubar_declaration');
			
			// CREATE NAV TAG
			self.content_jqo.attr('id', self.name + '_id');
			self.content_jqo.addClass('top-bar');
			self.content_jqo.attr('data-topbar', '');
			
			
			// OPTION: FIXED
			if ( DevaptTypes.to_boolean( self.menubar_declaration['fixed'] ) )
			{
				self.content_jqo.addClass('fixed');
			}
			
			// OPTION: ONGRID
			if ( DevaptTypes.to_boolean( self.menubar_declaration['ongrid'] ) )
			{
				if ( self.container_jqo.tagName === 'DIV' )
				{
					self.content_jqo.addClass('contain-to-grid');
				}
			}
			
			// OPTION: ONGRID
			if ( DevaptTypes.to_boolean( self.menubar_declaration['float'] ) )
			{
				if ( self.container_jqo.tagName === 'DIV' )
				{
					self.content_jqo.addClass('sticky');
				}
			}
			
			// OPTION: CLICKABLE
			if ( DevaptTypes.to_boolean( self.menubar_declaration['clickable'] ) )
			{
				self.content_jqo.attr('data-options', 'is_hover: false');
			}
			
			
			// CREATE TITLE AREA
			self.render_top_menubar_title();
			
			// CREATE MENUS
			var section_jqo = $('<section class="top-bar-section">');
			self.content_jqo.append(section_jqo);
			
			var right_jqo = $('<ul class="right">');
			section_jqo.append(right_jqo);
			
			var left_jqo = $('<ul class="left">');
			section_jqo.append(left_jqo);
			
			var menu_names = self.menubar_declaration['items'];
			self.value(context, 'menu_names', menu_names);
			self.assertTrue(context, 'menu_names is array', DevaptTypes.is_array(menu_names) );
			
			var menu_resources = self.menubar_declaration['items_resources'];
			// self.value(context, 'menu_resources', menu_resources);
			self.assertTrue(context, 'menu_resources is array', DevaptTypes.is_object(menu_resources) );
			
			for(menu_name_index in menu_names)
			{
				var menu_name = menu_names[menu_name_index];
				self.value(context, 'loop.menu_name', menu_name);
				var menu_declaration = menu_resources[menu_name];
				// self.value(context, 'menu_declaration', menu_declaration);
				self.assertTrue(context, 'menu_declaration is object', DevaptTypes.is_object(menu_declaration) );
				
				menu_declaration['menu_name'] = menu_name;
				
				var position	= DevaptTypes.to_list_item(menu_declaration['position'], ['left', 'right'], 'left');
				var parent_jqo	= (position === 'left') ? left_jqo : right_jqo;
				self.assertTrue(context, 'render menu', self.render_top_menubar_menu(menu_declaration, parent_jqo) );
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
		self.render_top_menubar_title = function()
		{
			var self = this;
			var context = 'render_top_menubar_title()';
			self.enter(context, '');
			
			
			// CREATE TITLE TAG
			var title_jqo = $('<ul>');
			title_jqo.addClass('title-area');
			self.content_jqo.append(title_jqo);
			
			// TITLE NAME
			var title = 'Sample';
			
			var title_name_jqo = $('<li>');
			title_name_jqo.addClass('name');
			title_jqo.append(title_name_jqo);
			
			var title_anchor_jqo = $('<a href="' + DevaptApplication.get_url_base() + '">');
			title_anchor_jqo.text(title);
			
			var title_h1_jqo = $('<h1>');
			title_h1_jqo.append(title_anchor_jqo);
			title_name_jqo.append(title_h1_jqo);
			
			// TITLE ICON
			// TODO
			
			
			self.leave(context, 'success');
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
		self.render_top_menubar_menu = function(arg_menu_declaration, arg_parent_menu_jqo)
		{
			var self = this;
			var context = 'render_top_menubar_menu(json,jqo)';
			self.enter(context, '');
			
			
			// DEBUG
			// self.value(context, 'arg_menu_declaration', arg_menu_declaration);
			// console.log(arg_parent_menu_jqo);
			
			
			// GET MENU ATTRIBUTES
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
			var menu_jqo	= $('<li>');
			menu_jqo.attr('id', menu_id);
			
			// TODO : MOVE TO INDEX
			arg_parent_menu_jqo.append(menu_jqo);
			
			
			// OPTION: TYPE IS SEPARATOR
			if (type === 'separator')
			{
				menu_jqo.addClass('divider');
				
				self.leave(context, 'success: separator');
				return true;
			}
			
			
			// OPTION: TYPE IS SEARCH
			if (type === 'button')
			{
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
			var menu_a_jqo = $('<a>');
			if ( DevaptTypes.is_not_empty_str(display_url) )
			{
				menu_a_jqo.attr('href', display_url);
			}
			else if ( DevaptTypes.is_not_empty_str(display_view) )
			{
				var view_jqo = $('#' + display_cont);
				if (view_jqo)
				{
					var update_view_cb = (
						function(view_name, content_label, content_id)
						{
							return function()
							{
								var url_base	= DevaptApplication.get_url_base(); 
								display_url = url_base + 'views/' + view_name + '/html_page';
								DevaptNavHistory.set_page_view_content(content_label, content_id, view_name, content_label, display_url, false);
							}
						}
					)(display_view, label, display_cont);
					menu_a_jqo.click(update_view_cb);
				}
			}
			else if ( DevaptTypes.is_not_empty_str(display_page) )
			{
				var url_base	= DevaptApplication.get_url_base(); 
				display_url = url_base + 'views/' + display_page + '/html_page';
				menu_a_jqo.attr('href', display_url);
			}
			else
			{
				menu_a_jqo.attr('href', '#');
			}
			
			if ( DevaptTypes.is_not_empty_str(display_js) )
			{
				menu_a_jqo.attr('onclick', display_js);
			}
			if ( DevaptTypes.is_not_empty_str(tooltip) )
			{
				menu_a_jqo.attr('title', tooltip);
			}
			menu_a_jqo.text(label);
			menu_jqo.append(menu_a_jqo);
			
			// RENDER MENU ITEMS
			var items = null;
			if ( DevaptTypes.is_array(arg_menu_declaration['items']) )
			{
				items = arg_menu_declaration['items'];
			}
			else if ( DevaptTypes.is_not_empty_str(arg_menu_declaration['items']) )
			{
				items = arg_menu_declaration['items'].split(',');
			}
			
			self.value(context, 'items', items);
			if (items)
			{
				// CREATE DROPDOWN
				menu_jqo.addClass('has-dropdown');
				var ul_jqo = $('<ul class="dropdown">');
				menu_jqo.append(ul_jqo);
				
				var menus_resources = self.menubar_declaration['items_resources'];
				
				for(item_key in items)
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
		self.render_nav_menubar = function()
		{
			var context = 'render_nav_menubar()';
			self.enter(context, '');
			
			
			
			self.leave(context, 'success');
			return true;
		}
	}
	
	
	// INTROSPETION : REGISTER CLASS
	DevaptClasses.register_class(DevaptMenubar, ['DevaptView'], 'Luc BORIES', '2013-08-21', 'All views base class.');
	
	
	// INTROSPETION : REGISTER OPTIONS
	DevaptOptions.register_str_option(DevaptMenubar, 'menubar_name',			null, true, []);
	DevaptOptions.register_obj_option(DevaptMenubar, 'menubar_declaration',		null, false, []);
	DevaptOptions.register_str_option(DevaptMenubar, 'menubar_format',			null, false, []);
	
	
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
	
	return DevaptMenubar;
} );