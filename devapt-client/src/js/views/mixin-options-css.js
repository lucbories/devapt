/**
 * @file        views/mixin-options-css.js
 * @desc        Mixin for CSS rendering options
 * @see			DevaptMixinOptionsCSS
 * @ingroup     DEVAPT_CORE
 * @date        2014-07-114
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['Devapt', 'core/types', 'core/options'],
function(Devapt, DevaptTypes, DevaptOptions)
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
		mixin_options_css_trace: true,
		
		
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
		applyCssOptions: function(arg_deferred)
		{
			var self = this;
			self.push_trace(self.trace, self.mixin_options_css_trace);
			var context = 'applyCssOptions(deferred)';
			self.enter(context, '');
			
			
			// CSS PARENT STYLES
			if ( DevaptTypes.is_not_empty_str(self.parent_css_styles) )
			{
				// GET TARGET NODE
				var target_jqo = self.parent_jqo;
				self.value(context, 'CSS options parent styles', self.parent_css_styles);
				self.assertNotNull(context, 'target_jqo', target_jqo);
				
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
				self.assertNotNull(context, 'target_jqo', target_jqo);
				
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
			self.assertNotNull(context, 'target_jqo', target_jqo);
			
			
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
			
			
			// TOOLTIP
			if ( DevaptTypes.is_not_empty_str(self.toolip) )
			{
				// APPEND NODE STYLES
				self.value(context, 'set toolip', self.tooltip);
				target_jqo.attr('title', self.tooltip);
				target_jqo.attr('data-tooltip');
				target_jqo.addClass('has-tip');
			}
			
			
			self.leave(context, 'render CSS options');
			self.pop_trace();
		}
	};
	
	
	
	/**
	 * @public
	 * @memberof			DevaptMixinOptionsCSS
	 * @desc				Register mixin options
	 * @return {nothing}
	 */
	DevaptMixinOptionsCSS.register_options = function(arg_prototype)
	{
		// SIZE
		DevaptOptions.register_bool_option(arg_prototype, 'is_resizable',		true, false, ['view_is_resizable']);	// TODO
		DevaptOptions.register_str_option(arg_prototype, 'width',				null, false, ['view_width']);
		DevaptOptions.register_str_option(arg_prototype, 'width_min',			null, false, ['view_width_min']);
		DevaptOptions.register_str_option(arg_prototype, 'width_max',			null, false, ['view_width_max']);
		DevaptOptions.register_str_option(arg_prototype, 'height',				null, false, ['view_height']);
		DevaptOptions.register_str_option(arg_prototype, 'height_min',			null, false, ['view_height_min']);
		DevaptOptions.register_str_option(arg_prototype, 'height_max',			null, false, ['view_height_max']);
		
		// VIBILITY
		DevaptOptions.register_bool_option(arg_prototype, 'is_visible',			true, false, ['view_is_visible']);	// TODO
		
		// CSS
		DevaptOptions.register_str_option(arg_prototype, 'css_styles',			null, false, ['view_css_styles']);
		DevaptOptions.register_str_option(arg_prototype, 'css_classes',			null, false, ['view_css_classes']);
		DevaptOptions.register_str_option(arg_prototype, 'parent_css_styles',	null, false, ['view_parent_css_styles']);
		DevaptOptions.register_str_option(arg_prototype, 'parent_css_classes',	null, false, ['view_parent_css_classes']);
		DevaptOptions.register_str_option(arg_prototype, 'css_margin',			null, false, ['view_margin']);
		DevaptOptions.register_str_option(arg_prototype, 'css_padding',			null, false, ['view_padding']);
	};
	
	
	return DevaptMixinOptionsCSS;
}
);