<?php
/**
 * @file        PageFooterViewRenderer.php
 * @brief       Page footer views renderer
 * @details     ...
 * @see			...
 * @ingroup     VIEWS
 * @date        2014-01-16
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		
 */

namespace Devapt\Views;

// DEBUG
use Devapt\Core\Trace;

// APPLICATION
use Devapt\Application\Application;

final class PageFooterViewRenderer
{
	// STATIC ATTIBUTES
	static public $TRACE_PAGE_FOOTER_VIEW_RENDERER = false;
	
	
	
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Render a page footer
	 * @param[in]	arg_layout_name		layout string name (string) (default value is 'default')
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		string
	 */
	static public function render($arg_layout_name, $arg_response)
	{
		// GET FOOTER TEMPLATE FROM FILE
		$key_template_file_footer = 'application.layouts.'.$arg_layout_name.'.footer.template.file';
		if ( Application::getInstance()->getConfig()->hasAttribute($key_template_file_footer) )
		{
			$file_path_name = Application::getInstance()->getConfig()->getAttribute($key_template_file_footer);
			$buffer = TemplateViewRenderer::render_file($file_path_name, $arg_response);
			if ( is_null($buffer) )
			{
				Trace::warning("PageFooterViewRenderer::render: page footer failure from file");
				return null;
			}
			
			Trace::info("PageFooterViewRenderer::render: page footer success from file", self::$TRACE_PAGE_FOOTER_VIEW_RENDERER);
			return $buffer;
		}
		
		// GET FOOTER TEMPLATE FROM STRING
		$key_template_str_footer = 'application.layouts.'.$arg_layout_name.'.footer.template.string';
		if ( Application::getInstance()->getConfig()->hasAttribute($key_template_str_footer) )
		{
			$template_string = Application::getInstance()->getConfig()->getAttribute($key_template_str_footer);
			$buffer = TemplateViewRenderer::render_string($template_string, $arg_response);
			if ( is_null($buffer) )
			{
				Trace::warning("PageFooterViewRenderer::render: page footer failure from string");
				return null;
			}
			
			Trace::info("PageFooterViewRenderer::render: page footer success from string", self::$TRACE_PAGE_FOOTER_VIEW_RENDERER);
			return $buffer;
		}
		
		
		Trace::warning("PageFooterViewRenderer::render: page footer failure config not found for [".$key_template_str_footer.'] or ["'.$key_template_file_footer.']');
		return null;
	}
}
