/**
 * @file        libapt-action.js
 * @desc		Action class
 * @see			libapt-object.js
 * @ingroup     LIBAPT_CORE_JS
 * @date        2013-01-05
 * @version		0.9.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */


/**
 * @memberof	LibaptAction
 * @public
 * @static
 * @desc		Default options for the action class
 */
LibaptAction.default_options = {
	'label'				: null,
	'icon_size'			: 24,
	'is_enabled'		: true,
	
	'tooltip_label'		: '',
	'tooltip_template'	: null,
	'tooltip_icon_size'	: 128,
	
	'do_cb'				: null,
	'undo_cb'			: null,
	
	'icon_css_classes'	: null,
	
	'icon_url_16'		: null,
	'icon_url_24'		: null,
	'icon_url_32'		: null,
	'icon_url_48'		: null,
	'icon_url_64'		: null,
	'icon_url_96'		: null,
	'icon_url_128'		: null,
	
	'icon_name_16'		: null,
	'icon_name_24'		: null,
	'icon_name_32'		: null,
	'icon_name_48'		: null,
	'icon_name_64'		: null,
	'icon_name_96'		: null,
	'icon_name_128'		: null
}


/**
 * @public
 * @class					LibaptAction
 * @desc					Action class constructor
 * @param {string}			arg_name			action name
 * @param {object|null}		arg_options			associative array of name/value options
 */
function LibaptAction(arg_name, arg_options)
{
	var self = this;
	
	// INHERIT
	self.inheritFrom = LibaptObject;
	self.inheritFrom(arg_name, false, arg_options);
	
	// CONSTRUCTOR BEGIN
	self.trace			= false;
	self.class_name		= 'LibaptAction';
	var context			= self.class_name + '(' + arg_name + ')';
	self.enter(context, 'constructor');
	
	
	// ACTION ATTRIBUTES
	self.button_jqo		= null;
	self.span_jqo		= null;
	self.tooltip		= '';
	// if ( Libapt.is_null(arg_options) )
	// {
		// $.extend(this, LibaptAction.default_options);
	// }
	// else
	// {
		// $.extend(this, LibaptAction.default_options, arg_options);
	// }
	
	// INIT OPTIONS VALUES
	var init_option_result = Libapt.set_options_values(self, arg_options);
	
	
	// CONSTRUCTOR END
	self.leave(context, 'success');
	
	
	
	/**
	 * @public
	 * @method				do_action(arg_operands)
	 * @desc				Do the action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}
	 */
	this.do_action = function(arg_operands)
	{
		var context = 'do_action(operands)';
		this.enter(context, '');
		
		if ( this.do_cb && this.is_enabled )
		{
			this.assert(context, 'do_callback', this.do_callback(do_cb, arg_operands) );
		}
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @memberof	LibaptAction
	 * @public
	 * @method				undo_action(arg_operands)
	 * @desc				Undo the action
	 * @param {array}		arg_operands	array of action operands
	 * @return {boolean}
	 */
	this.undo_action = function(arg_operands)
	{
		var context = 'undo_action(operands)';
		this.enter(context, '');
		
		if ( this.undo_cb && this.is_enabled )
		{
			this.assert(context, 'do_callback', this.do_callback(undo_cb, arg_operands) );
		}
		
		this.leave(context, '');
		return true;
	}
	
	
	/**
	 * @memberof			LibaptAction
	 * @public
	 * @method				enable()
	 * @desc				Enable the action
	 * @return {object}		This
	 */
	this.enable = function()
	{
		var context = 'enable()';
		this.enter(context, '');
		
		// UPDATE ENABLED FLAG
		this.is_enabled = true;
		
		// BUTTON
		if (this.button_jqo)
		{
			this.button_jqo.removeAttr('disabled');
			this.button_jqo.attr('title', this.tooltip);
		}
		
		// SPAN
		if (this.span_jqo)
		{
			this.span_jqo.show();
		}
		
		this.leave(context, '');
		return this;
	}
	
	
	/**
	 * @memberof			LibaptAction
	 * @public
	 * @method				disable()
	 * @desc				Disable the action
	 * @return {object}		This
	 */
	this.disable = function()
	{
		var context = 'disable()';
		this.enter(context, '');
		
		// UPDATE ENABLED FLAG
		this.is_enabled = false;
		
		// BUTTON
		if (this.button_jqo)
		{
			this.button_jqo.attr('disabled', 'disabled');
			this.button_jqo.removeAttr('title');
		}
		
		// SPAN
		if (this.span_jqo)
		{
			this.span_jqo.hide();
		}
		
		this.leave(context, '');
		return this;
	}
	
	
	/**
	 * @memberof	LibaptAction
	 * @public
	 * @method				toggle_enabled()
	 * @desc				Toggle the enabled status of the action
	 * @return {object}		This
	 */
	this.toggle_enabled = function()
	{
		var context = 'toggle_enabled()';
		this.enter(context, '');
		
		if (this.is_enabled)
		{
			this.disable;
		}
		else
		{
			this.enable();
		}
		
		this.leave(context, '');
		return this;
	}
	
	
	/**
	 * @memberof			LibaptAction
	 * @public
	 * @method				draw_button(arg_jqo, arg_size_min, arg_size_max)
	 * @desc				Draw the action button
	 * @param {object}		arg_jqo			JQuery object container to draw in
	 * @param {integer}		arg_size_min	small size of the button image
	 * @param {integer}		arg_size_max	big size of the button image
	 * @return {nothing}
	 */
	this.draw_button = function(arg_jqo, arg_size_min, arg_size_max)
	{
		var context = 'draw_button(jqo, min_size, max_size)';
		this.enter(context, '');
		
		// CHECK ICON SIZES
		if ( Libapt.is_null(arg_size_min) )
		{
			arg_size_min = this.icon_size;
		}
		if ( Libapt.is_null(arg_size_max) )
		{
			arg_size_max = this.tooltip_icon_size;
		}
		
		// GET TOOLTIP
		this.tooltip = this.get_tooltip(arg_size_max);
		
		var icon_url = this.get_icon_url(arg_size_min);
		var icon_str = Libapt.is_null(icon_url) ? this.label : '<img src="' + icon_url + '" alt="' + this.label + '" width="' + arg_size_min + '" height="' + arg_size_min + '"></img>';
		
		this.button_jqo = $('<button class=\'libapt_toolbar_button\' title=\' ' + this.tooltip + '\'>' + icon_str + '</button>');
		this.button_jqo.data('action', this);
		
		// BUTTON CALLBACK
		this.button_jqo.click( this.do_action.bind(this) );
		
		arg_jqo.append(this.button_jqo);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @memberof			LibaptAction
	 * @public
	 * @method				draw_span(arg_jqo, arg_size_min, arg_size_max)
	 * @desc				Draw the action span
	 * @param {object}		arg_jqo			JQuery object container to draw in
	 * @param {integer}		arg_size_min	small size of the button image
	 * @param {integer}		arg_size_max	big size of the button image
	 * @return {nothing}
	 */
	this.draw_span = function(arg_jqo, arg_size_min, arg_size_max)
	{
		var context = 'draw_span(jqo, min_size, max_size)';
		this.enter(context, '');
		
		// CHECK ICON SIZES
		if ( Libapt.is_null(arg_size_min) )
		{
			arg_size_min = this.icon_size;
		}
		if ( Libapt.is_null(arg_size_max) )
		{
			arg_size_max = this.tooltip_icon_size;
		}
		
		// GET TOOLTIP
		this.tooltip = this.get_tooltip(arg_size_max);
		var tooltip_str = Libapt.is_null(this.tooltip) ? '' : ' title=\' ' + this.tooltip + '\''
		
		// GET ICON
		var icon_url = this.get_icon_url(arg_size_min);
		var icon_str = '';
		if ( ! Libapt.is_null(icon_url) )
		{
			icon_str = Libapt.is_null(icon_url) ? this.label : '<img src="' + icon_url + '" alt="' + this.label + '" width="' + arg_size_min + '" height="' + arg_size_min + '"></img>';
		}
		
		// GET CSS CLASSES
		var css_classes_str = Libapt.is_null(this.icon_css_classes) ? '' : ' class=\'' + this.icon_css_classes + '\'';
		
		// CREATE SPAN JQO
		this.span_jqo = $('<span ' + css_classes_str + tooltip_str + '>' + icon_str + '</span>');
		this.span_jqo.data('action', this);
		
		// BUTTON CALLBACK
		this.span_jqo.click( this.do_action.bind(this) );
		
		arg_jqo.append(this.span_jqo);
		
		this.leave(context, 'success');
		return true;
	}
	
	
	/**
	 * @memberof			LibaptAction
	 * @public
	 * @method				LibaptAction.get_tooltip(arg_size)
	 * @desc				Get the action tooltip
	 * @param {integer )	arg_size		size of the button image
	 * @return {string}
	 */
	this.get_tooltip = function(arg_size)
	{
		var context = 'get_tooltip(size)';
		this.enter(context, '');
		
		// TODO : use template
		
		// CHECK SIZE
		if ( Libapt.is_null(arg_size) )
		{
			arg_size = this.tooltip_icon_size;
		}
		
		// GET ICON AND TOOLTIP STRINGS
		var icon_url = this.get_icon_url(arg_size);
		var icon_str = Libapt.is_null(icon_url) ? '' : '<img src="' + icon_url + '" alt="' + this.tooltip_label + '" width="' + arg_size + '" height="' + arg_size + '"></img>';
		var tooltip_str	= Libapt.is_string(this.tooltip_label) ? '<p>' + this.tooltip_label + '</p>' : '';
		var tooltip = icon_str + tooltip_str;
		
		this.leave(context, '');
		return tooltip;
	}
	
	
	/**
	 * @memberof	LibaptAction
	 * @public
	 * @method				get_icon_url(arg_size)
	 * @desc				Get the action icon of the given size
	 * @param {integer}		arg_size		size of the button image
	 * @return {string}
	 */
	this.get_icon_url = function(arg_size)
	{
		var context = 'get_icon_url(size)';
		this.enter(context, '');
		
		var url = null;
		switch(arg_size)
		{
			case  16: url = Libapt.is_null(this.icon_url_16)  ? ( Libapt.is_null(this.icon_name_16)  ? null : Libapt.get_main_icon_url(this.icon_name_16) )  : this.icon_url_16; break;
			case  24: url = Libapt.is_null(this.icon_url_24)  ? ( Libapt.is_null(this.icon_name_24)  ? null : Libapt.get_main_icon_url(this.icon_name_24) )  : this.icon_url_24; break;
			case  32: url = Libapt.is_null(this.icon_url_32)  ? ( Libapt.is_null(this.icon_name_32)  ? null : Libapt.get_main_icon_url(this.icon_name_32) )  : this.icon_url_32; break;
			case  48: url = Libapt.is_null(this.icon_url_48)  ? ( Libapt.is_null(this.icon_name_48)  ? null : Libapt.get_main_icon_url(this.icon_name_48) )  : this.icon_url_48; break;
			case  64: url = Libapt.is_null(this.icon_url_64)  ? ( Libapt.is_null(this.icon_name_64)  ? null : Libapt.get_main_icon_url(this.icon_name_64) )  : this.icon_url_64; break;
			case  96: url = Libapt.is_null(this.icon_url_96)  ? ( Libapt.is_null(this.icon_name_96)  ? null : Libapt.get_main_icon_url(this.icon_name_96) )  : this.icon_url_96; break;
			case 128: url = Libapt.is_null(this.icon_url_128) ? ( Libapt.is_null(this.icon_name_128) ? null : Libapt.get_main_icon_url(this.icon_name_128) ) : this.icon_url_128; break;
		}
		
		this.leave(context, '');
		return url;
	}
	
	
	
	/**
	 * @memberof			LibaptAction
	 * @public
	 * @method				to_string_self()
	 * @desc				Child class specific to_string part
	 * @return {string}
	 */
	this.to_string_self = function()
	{
		return this.to_string_value('field.name', this.field.name)
			+ this.to_string_value('mode', this.mode)
			;
	}
}


// INTROSPETION : REGISTER CLASS
Libapt.register_class(LibaptAction, ['LibaptObject'], 'Luc BORIES', '2013-08-21', 'An action base class.');


// INTROSPETION : REGISTER OPTIONS
Libapt.register_str_option(LibaptAction, 'label',				null, true, []);
Libapt.register_int_option(LibaptAction, 'icon_size',			24, false, []);
Libapt.register_bool_option(LibaptAction, 'is_enabled',			true, false, []);

Libapt.register_str_option(LibaptAction, 'tooltip_label',		null, false, []);
Libapt.register_str_option(LibaptAction, 'tooltip_template',	null, false, []);
Libapt.register_int_option(LibaptAction, 'tooltip_icon_size',	128, false, []);

Libapt.register_cb_option(LibaptAction, 'do_cb',				null, false, []);
Libapt.register_cb_option(LibaptAction, 'undo_cb',				null, false, []);

Libapt.register_str_option(LibaptAction, 'icon_css_classes',	null, false, []);

Libapt.register_str_option(LibaptAction, 'icon_url_16',			null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_url_24',			null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_url_32',			null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_url_48',			null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_url_64',			null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_url_96',			null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_url_128',		null, false, []);

Libapt.register_str_option(LibaptAction, 'icon_name_16',		null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_name_24',		null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_name_32',		null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_name_48',		null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_name_64',		null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_name_96',		null, false, []);
Libapt.register_str_option(LibaptAction, 'icon_name_128',		null, false, []);
