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
['Devapt', 'core/traces', 'core/types', 'core/options', 'core/classes', 'core/resources', 'core/view', 'core/application', 'backend-foundation5/foundation-init'],
function(Devapt, DevaptTrace, DevaptTypes, DevaptOptions, DevaptClasses, DevaptResources, DevaptView, DevaptApplication, undefined)
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
		
		// INHERIT
		self.inheritFrom = DevaptView;
		self.inheritFrom(arg_name, arg_container_jqo, arg_options);
		
		// INIT
		self.trace				= true;
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
		 * @return {boolean}	true:success,false:failure
		 */
		self.render = function()
		{
			var self = this;
			var context = 'render()';
			self.enter(context, '');
			
			
			// GET NODES
			// console.log(self.container_jqo);
			self.assertNotNull(context, 'container_jqo', self.container_jqo);
			self.content_jqo = $('<nav>');
			self.container_jqo.prepend(self.content_jqo);
			
			// GET MENUBAR NAME
			self.assertNotEmptyString(context, 'self.menubar_name', self.menubar_name);
			
			// GET MENUBAR RESOURCE
			if ( ! DevaptTypes.is_object(self.menubar_declaration) )
			{
				self.menubar_declaration = DevaptResources.get_resource_declaration(self.menubar_name);
			}
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
						self.error(context, 'render top menubar failure');
						return false;
					}
					break;
				}
			}
			
			
			self.leave(context, 'success');
			return true;
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
			// self.value(context, 'menu_names', menu_names);
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
				self.assertTrue(context, 'render menu', self.render_top_menubar_menu(menu_declaration) );
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
		 * @return {boolean}	true:success,false:failure
		 */
		self.render_top_menubar_menu = function(arg_menu_declaration)
		{
			var self = this;
			var context = 'render_top_menubar_menu()';
			self.enter(context, '');
			
			
			// GET MENU ATTRIBUTES
			var position	= DevaptTypes.to_list_item(arg_menu_declaration['position'], ['left', 'right'], 'left');
			var index		= DevaptTypes.to_integer(arg_menu_declaration['index'], -1);
			var label		= DevaptTypes.to_string(arg_menu_declaration['label'], '');
			var tooltip		= DevaptTypes.to_string(arg_menu_declaration['tooltip'], '');
			
			var icon		= DevaptTypes.is_object(arg_menu_declaration['icon']) ? arg_menu_declaration['icon'] : {};
			var icon_url	= DevaptTypes.to_string(icon['url'], null);
			var icon_alt	= DevaptTypes.to_string(icon['alt'], null);
			
			var display		= DevaptTypes.is_object(arg_menu_declaration['display']) ? arg_menu_declaration['display'] : {};
			var display_url	= DevaptTypes.to_string(display['url'], null);
			var display_page= DevaptTypes.to_string(display['page'], null);
			var display_js	= DevaptTypes.to_string(display['js'], null);
			
			// GET CONTAINER NODE
			var menu_container_jqo = (position === 'left') ? $('section ul.left', self.content_jqo) : $('section ul.right', self.content_jqo);
			var menu_jqo	= $('<li>');
			// TODO : MOVE TO INDEX
			menu_container_jqo.append(menu_jqo);
			
			// DEFINE MENU NODE
			var menu_a_jqo = $('<a>');
			if (display_url !== '')
			{
				menu_a_jqo.attr('href', display_url);
			}
			else if (display_page !== '')
			{
				var url_base	= DevaptApplication.get_url_base(); 
				display_url = url_base + 'views/' + display_page + '/html_page';
				menu_a_jqo.attr('href', display_url);
			}
			
			if (display_js !== '')
			{
				menu_a_jqo.attr('onclick', display_js);
			}
			if ( DevaptTypes.is_not_empty_str(tooltip) )
			{
				menu_a_jqo.attr('title', tooltip);
			}
			menu_a_jqo.text(label);
			menu_jqo.append(menu_a_jqo);
			
			
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