<?php
/**
 * @file        PageHeaderViewRenderer.php
 * @brief       Page header views renderer
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

final class PageHeaderViewRenderer
{
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Render a page header
	 * @param[in]	arg_layout_name		layout string name (string)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		string
	 */
	static public function render($arg_layout_name, $arg_response)
	{
		// GET HEADER TEMPLATE FROM FILE
		$key_template_file_header = 'application.layouts.'.$arg_layout_name.'.header.template.file';
		if ( Application::getInstance()->getConfig()->hasAttribute($key_template_file_header) )
		{
			$file_path_name = Application::getInstance()->getConfig()->getAttribute($key_template_file_header);
			$buffer = TemplateViewRenderer::render_file($file_path_name, $arg_response);
			if ( is_null($buffer) )
			{
				Trace::warning("PageHeaderViewRenderer::render: page header failure from file");
				return null;
			}
			
			Trace::info("PageHeaderViewRenderer::render: page header success from file");
			return $buffer;
		}
		
		// GET HEADER TEMPLATE FROM STRING
		$key_template_str_header = 'application.layouts.'.$arg_layout_name.'.header.template.string';
		if ( Application::getInstance()->getConfig()->hasAttribute($key_template_str_header) )
		{
			$template_string = Application::getInstance()->getConfig()->getAttribute($key_template_str_header);
			$buffer = TemplateViewRenderer::render_string($template_string, $arg_response);
			if ( is_null($buffer) )
			{
				Trace::warning("PageHeaderViewRenderer::render: page header failure from string");
				return null;
			}
			
			Trace::info("PageHeaderViewRenderer::render: page header success from string");
			return $buffer;
		}
		
		
		Trace::warning("PageHeaderViewRenderer::render: page header failure config not found for [".$key_template_str_header.'] or ["'.$key_template_file_header.']');
		return null;
	}
}
