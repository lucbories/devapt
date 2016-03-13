/**
 * @file        views/view/view-mixin-options-css.js
 * @desc        Mixin for CSS rendering options
 * @see			DevaptView
 * @ingroup     DEVAPT_VIEWS
 * @date        2014-07-14
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
	 * @mixin				DevaptMixinOptionsCSS
	 * @public
	 * @desc				Mixin of template methods
	 */
	var DevaptMixinOptionsCSS = 
	{
		/**
		 * @memberof			DevaptMixinOptionsCSS
		 * @public
		 * @desc				Enable/disable trace for mixin operations
		 */
		mixin_options_css_trace: false,
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinOptionsCSS
		 * @desc				Init mixin (register options)
		 * @return {nothing}
		 */
		mixin_init: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_options_css_trace);
			var context = 'mixin_init()';
			self.enter(context, '');
			
			
			
			self.leave(context, '');
			self.pop_trace();
		},
		
		
		
		/**
		 * @public
		 * @memberof			DevaptMixinOptionsCSS
		 * @desc				Render CSS options to the view
		 * @param {object}		arg_deferred	deferred object
		 * @return {nothing}
		 */
		applyCssOptions: function()
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_options_css_trace);
			var context = 'applyCssOptions()';
			self.enter(context, '');
			
			
			// CSS PARENT STYLES
			if ( DevaptTypes.is_not_empty_str(self.parent_css_styles) )
			{
				// GET TARGET NODE
				var target_jqo = self.parent_jqo;
				self.value(context, 'CSS options parent styles', self.parent_css_styles);
				self.assert_not_null(context, 'target_jqo', target_jqo);
				
				// APPEND NODE STYLES
				var style = target_jqo.attr('style');
				style = (style ? style : '') + self.css_styles;
				target_jqo.attr('style', style);
			}
			
			
			// CSS PARENT CLASSES
			if ( DevaptTypes.is_not_empty_str(self.parent_css_classes) )
			{
				// GET TARGET NODE
				var target_jqo = self.parent_jqo;
				self.value(context, 'CSS options parent classes', self.parent_css_classes);
				self.assert_not_null(context, 'target_jqo', target_jqo);
				
				// APPEND OR REMOVE NODE CLASSES
				var classes = self.parent_css_classes.split(',');
				classes.forEach(
					function(css_class, index, array)
					{
						if (css_class && css_class.length > 0)
						{
							if (css_class.slice(0, 1) === '-')
							{
								target_jqo.removeClass(css_class);
								return;
							}
							target_jqo.addClass(css_class);
						}
					}
				);
			}
			
			
			// GET TARGET NODE
			var target_jqo = self.content_jqo ? self.content_jqo : self.parent_jqo;
			self.assert_not_null(context, 'target_jqo', target_jqo);
			
			
			// CSS CONTENT STYLES
			if ( DevaptTypes.is_not_empty_str(self.css_styles) )
			{
				// APPEND NODE STYLES
				self.value(context, 'set css_styles', self.css_styles);
				var style = target_jqo.attr('style');
				style = (style ? style : '') + self.css_styles;
				target_jqo.attr('style', style);
			}
			
			
			// CSS CONTENT CLASSES
			if ( DevaptTypes.is_not_empty_str(self.css_classes) )
			{
				// APPEND OR REMOVE NODE CLASSES
				var classes = self.css_classes.split(',');
				classes.forEach(
					function(css_class, index, array)
					{
						if (css_class && css_class.length > 0)
						{
							if (css_class.slice(0, 1) === '-')
							{
								self.value(context, 'remove css_class', css_class);
								target_jqo.removeClass(css_class);
								return;
							}
							self.value(context, 'add css_class', css_class);
							target_jqo.addClass(css_class);
						}
					}
				);
			}
			
			
			// CSS CONTENT WIDTH
			if ( DevaptTypes.is_not_empty_str(self.width) )
			{
				self.value(context, 'set width', self.width);
				target_jqo.css('width', self.width);
			}
			
			
			// CSS CONTENT WIDTH MIN
			if ( DevaptTypes.is_not_empty_str(self.width_min) )
			{
				self.value(context, 'set width_min', self.width_min);
				target_jqo.css('min-width', self.width_min);
			}
			
			
			// CSS CONTENT WIDTH MAX
			if ( DevaptTypes.is_not_empty_str(self.width_max) )
			{
				self.value(context, 'set width_max', self.width_max);
				target_jqo.css('max-width', self.width_max);
			}
			
			
			// CSS CONTENT HEIGHT
			if ( DevaptTypes.is_not_empty_str(self.height) )
			{
				self.value(context, 'set height', self.height);
				target_jqo.css('height', self.height);
			}
			
			
			// CSS CONTENT HEIGHT MIN
			if ( DevaptTypes.is_not_empty_str(self.height_min) )
			{
				self.value(context, 'set height_min', self.height_min);
				target_jqo.css('min-height', self.height_min);
			}
			
			
			// CSS CONTENT HEIGHT MAX
			if ( DevaptTypes.is_not_empty_str(self.height_max) )
			{
				self.value(context, 'set height_max', self.height_max);
				target_jqo.css('max-height', self.height_max);
			}
			
			
			// CSS CONTENT PADDING
			if ( DevaptTypes.is_not_empty_str(self.css_padding) )
			{
				self.value(context, 'set css_padding', self.css_padding);
				target_jqo.css('padding', self.css_padding);
			}
			
			
			// CSS CONTENT MARGIN
			if ( DevaptTypes.is_not_empty_str(self.css_margin) )
			{
				self.value(context, 'set css_margin', self.css_margin);
				target_jqo.css('margin', self.css_margin);
			}
			
			
			// DISPLAY
			var display_class = null;
			
			// DISPLAY ONLY ON SMALL
			if (self.display_on_small && ! self.display_on_medium && ! self.display_on_large)
			{
				display_class = 'show-for-small-only';
			}
			
			// DISPLAY ONLY ON MEDIUM
			if (! self.display_on_small && self.display_on_medium && ! self.display_on_large)
			{
				display_class = 'show-for-medium-only';
			}
			
			// DISPLAY ONLY ON LARGE
			if (! self.display_on_small && ! self.display_on_medium && self.display_on_large)
			{
				display_class = 'hide-for-small-only show-for-large-up';
			}
			
			// DISPLAY ON SMALL AND MEDIUM AND LARGE
			if (self.display_on_small && self.display_on_medium && self.display_on_large)
			{
				display_class = null;
			}
			
			// DISPLAY ON SMALL AND MEDIUM
			if (self.display_on_small && ! self.display_on_medium && ! self.display_on_large)
			{
				display_class = 'show-for-medium-only show-for-medium-only hide-for-large-up';
			}
			
			// DISPLAY ON MEDIUM AND LARGE
			if (! self.display_on_small && self.display_on_medium && self.display_on_large)
			{
				display_class = 'hide-for-small-only show-for-medium-up';
			}
			
			self.value(context, 'display on classes', display_class);
			if (display_class)
			{
				target_jqo.addClass(display_class);
			}
			
			// DISPLAY ON LANDSCAPE
			// if (self.display_on_landscape)
			// {
				// display_class = 'show-for-landscape';
				// target_jqo.addClass(display_class);
			// }
			// else
			// {
				// display_class = 'hide-for-landscape';
				// target_jqo.addClass(display_class);
			// }
			
			// DISPLAY ON PORTRAIT
			// if (self.display_on_portrait)
			// {
				// display_class = 'show-for-portrait';
				// target_jqo.addClass(display_class);
			// }
			// else
			// {
				// display_class = 'hide-for-portrait';
				// target_jqo.addClass(display_class);
			// }
			
			// DISPLAY ON TOUCH
			if ( target_jqo.hasClass('touch') )
			{
				if (self.display_on_touch)
				{
					display_class = 'show-for-touch';
					target_jqo.addClass(display_class);
				}
				else
				{
					display_class = 'hide-for-touch';
					target_jqo.addClass(display_class);
				}
			}
			
			
			// TOOLTIP
			if ( DevaptTypes.is_not_empty_str(self.toolip) )
			{
				// APPEND NODE STYLES
				self.value(context, 'set toolip', self.tooltip);
				target_jqo.attr('title', self.tooltip);
				target_jqo.attr('data-tooltip');
				target_jqo.addClass('has-tip');
			}
			
			// SCROLLING X
			target_jqo.css('overflow-x', 'none');
			if ( DevaptTypes.to_boolean(self.is_scrolling_x, false) )
			{
				target_jqo.css('overflow-x', 'scroll');
			}
			
			// SCROLLING Y
			target_jqo.css('overflow-y', 'none');
			if ( DevaptTypes.to_boolean(self.is_scrolling_y, false) )
			{
				target_jqo.css('overflow-y', 'scroll');
			}
			
			
			self.leave(context, 'render CSS options');
			self.pop_trace();
		}
	};
	
	
	
	/* --------------------------------------------- CREATE MIXIN CLASS ------------------------------------------------ */
	
	// MIXIN CLASS DEFINITION
	var class_settings= {
		'infos':{
			'author':'Luc BORIES',
			'created':'2014-07-14',
			'updated':'2014-12-06',
			'description':'Mixin methods for  CSS rendering options.'
		}
	};
	
	
	/**
	 * @mixin				DevaptMixinOptionsCSSClass
	 * @public
	 * @desc				Mixin of methods for  CSS rendering options
	 */
	var DevaptMixinOptionsCSSClass = new DevaptClass('DevaptMixinOptionsCSS', null, class_settings);
	
	DevaptMixinOptionsCSSClass.add_public_method('mixin_options_css_init', {}, DevaptMixinOptionsCSS.mixin_init);
	DevaptMixinOptionsCSSClass.add_public_method('applyCssOptions', {}, DevaptMixinOptionsCSS.applyCssOptions);
	DevaptMixinOptionsCSSClass.add_public_method('apply_css_options', {}, DevaptMixinOptionsCSS.applyCssOptions);
	
	DevaptMixinOptionsCSSClass.add_public_bool_property('template_enabled',	'', false, false, false, ['view_template_enabled']);
	DevaptMixinOptionsCSSClass.add_public_str_property('template_string',	'', null, false, false, ['view_template_string']);
	
	// SIZE
	DevaptMixinOptionsCSSClass.add_public_bool_property('is_resizable',		'', true, false, false, ['view_is_resizable']);	// TODO
	DevaptMixinOptionsCSSClass.add_public_str_property('width',				'', null, false, false, ['view_width']);
	DevaptMixinOptionsCSSClass.add_public_str_property('width_min',			'', null, false, false, ['view_width_min']);
	DevaptMixinOptionsCSSClass.add_public_str_property('width_max',			'', null, false, false, ['view_width_max']);
	DevaptMixinOptionsCSSClass.add_public_str_property('height',			'', null, false, false, ['view_height']);
	DevaptMixinOptionsCSSClass.add_public_str_property('height_min',		'', null, false, false, ['view_height_min']);
	DevaptMixinOptionsCSSClass.add_public_str_property('height_max',		'', null, false, false, ['view_height_max']);
	
	// VIBILITY
	DevaptMixinOptionsCSSClass.add_public_str_property('is_visible',			'', true, false, false, ['view_is_visible']);	// TODO
	
	// CSS
	DevaptMixinOptionsCSSClass.add_public_str_property('css_styles',			'', null, false, false, ['view_css_styles']);
	DevaptMixinOptionsCSSClass.add_public_str_property('css_classes',			'', null, false, false, ['view_css_classes']);
	DevaptMixinOptionsCSSClass.add_public_str_property('parent_css_styles',		'', null, false, false, ['view_parent_css_styles']);
	DevaptMixinOptionsCSSClass.add_public_str_property('parent_css_classes',	'', null, false, false, ['view_parent_css_classes']);
	DevaptMixinOptionsCSSClass.add_public_str_property('css_margin',			'', null, false, false, ['view_margin']);
	DevaptMixinOptionsCSSClass.add_public_str_property('css_padding',			'', null, false, false, ['view_padding']);
	
	DevaptMixinOptionsCSSClass.add_public_str_property('display_on_small',		'', true, false, false, ['view_display_on_small']);
	DevaptMixinOptionsCSSClass.add_public_str_property('display_on_medium',		'', true, false, false, ['view_display_on_medium']);
	DevaptMixinOptionsCSSClass.add_public_str_property('display_on_large',		'', true, false, false, ['view_display_on_large']);
	// DevaptMixinOptionsCSSClass.add_public_str_property('display_on_landscape',	'', true, false, false, ['view_display_on_landscape']); // TODO
	// DevaptMixinOptionsCSSClass.add_public_str_property('display_on_portrait',	'', false, false, false, ['view_display_on_portrait']); // TODO
	DevaptMixinOptionsCSSClass.add_public_str_property('display_on_touch',		'', true, false, false, ['view_display_on_touch']);
	
	// SCROLLING
	DevaptMixinOptionsCSSClass.add_public_bool_property('is_scrolling_x',	'',		false, false, false, []);
	DevaptMixinOptionsCSSClass.add_public_bool_property('is_scrolling_y',	'',		false, false, false, []);
	
	// BUILD CLASS
	DevaptMixinOptionsCSSClass.build_class();
	
	
	return DevaptMixinOptionsCSSClass;
}
);