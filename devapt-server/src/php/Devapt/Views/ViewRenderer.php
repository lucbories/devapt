<?php
/**
 * @file        ViewRenderer.php
 * @brief       Views renderer
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

final class ViewRenderer
{
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Render the view : call specialized renderer
     * @param[in]	arg_view_resource	resource resource object (View)
     * @param[in]	arg_action_name		action name (string)
     * @param[in]	arg_id				id value (interger|string|null)
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		boolean
	 */
	static public function render($arg_view_resource, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		// CHECK ARGS
		if ( is_null($arg_view_resource) )
		{
			Trace::warning('ViewRenderer::render: resource object is null');
			return false;
		}
		if ( ! is_string($arg_action_name) )
		{
			Trace::warning('ViewRenderer::render: action name is not a string');
			return false;
		}
		// if ( is_null($arg_request) )
		// {
			// Trace::warning('ViewRenderer::render: request object is null');
			// return false;
		// }
		if ( is_null($arg_response) )
		{
			Trace::warning('ViewRenderer::render: response object is null');
			return false;
		}
		
		// CHECK ID
		if ( ! is_string($arg_id) || $arg_id === '' )
		{
			$arg_id = $arg_view_resource->getResourceName();
		}
		
		// GET VIEW CLASS
		$view_class = $arg_view_resource->getViewClass();
		if ( ! is_string($view_class) )
		{
			Trace::warning('ViewRenderer::render: view class is not a string');
			return false;
		}
		
		// CALL SPECIALIZED RENDERER
		switch($view_class)
		{
			case 'IncludeView':
			{
				// GET RENDERED BUFFER
				$str_result = IncludeViewRenderer::render($arg_view_resource, $arg_response);
				// Trace::trace_var($context, 'str_result', $str_result, true);
				
				// CHECK RENDERED BUFFER
				if ( ! is_string($str_result) )
				{
					Trace::warning('ViewRenderer::render: IncludeViewRenderer result is not a string');
					$arg_response->setStatusCode($arg_response::STATUS_CODE_500);
					return false;
				}
				
				// UPDATE RESPONSE
				$content = $arg_response->getContent();
				$content .= '<div id="'.$arg_id.'">'.$str_result.'</div>';
				$arg_response->setContent($content);
				
				$arg_response->setStatusCode($arg_response::STATUS_CODE_200);
				return true;
			}
			
			case 'TemplateView':
			{
				// GET RENDERED BUFFER
				$str_result = TemplateViewRenderer::render($arg_view_resource, $arg_response);
				// Trace::trace_var($context, 'str_result', $str_result, true);
				
				// CHECK RENDERED BUFFER
				if ( ! is_string($str_result) )
				{
					Trace::warning('ViewRenderer::render: TemplateViewRenderer result is not a string');
					$arg_response->setStatusCode($arg_response::STATUS_CODE_500);
					return false;
				}
				
				// UPDATE RESPONSE
				$content = $arg_response->getContent();
				$content .= '<div id="'.$arg_id.'">'.$str_result.'</div>';
				$arg_response->setContent($content);
				
				$arg_response->setStatusCode($arg_response::STATUS_CODE_200);
				return true;
			}
			
			// case 'JsModelView':
			// case 'JsView':
			default:
			{
				// GET RENDERED BUFFER
				$str_result = JsViewRenderer::render($arg_view_resource, $arg_response);
				// Trace::trace_var($context, 'str_result', $str_result, true);
				
				// CHECK RENDERED BUFFER
				if ( ! is_string($str_result) )
				{
					Trace::warning('ViewRenderer::render: default result is not a string');
					$arg_response->setStatusCode($arg_response::STATUS_CODE_500);
					return false;
				}
				
				// UPDATE RESPONSE
				$content = $arg_response->getContent();
				$content .= '<div id="'.$arg_id.'">'.$str_result.'</div>';
				$arg_response->setContent($content);
				
				$arg_response->setStatusCode($arg_response::STATUS_CODE_200);
				return true;
			}
		}
		
		Trace::warning("ViewRenderer::render: no renderer found to process the view class [$view_class]");
		return false;
	}
}
