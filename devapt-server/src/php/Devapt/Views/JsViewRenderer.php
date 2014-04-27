<?php
/**
 * @file        JsViewRenderer.php
 * @brief       Javascript views renderer
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

final class JsViewRenderer
{
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Render an include view
     * @param[in]	arg_view_resource	view resource object (View)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		string
	 */
	static public function render($arg_view_resource, $arg_response)
	{
		// CHECK ARGS
		if ( ! is_object($arg_view_resource) )
		{
			Trace::warning('JsViewRenderer::render: bad resource object');
			return null;
		}
		
		// CHECK VIEW NAME
		$view_name = $arg_view_resource->getName();
		if ( is_string($view_name) && $view_name != '')
		{
			Trace::info('JsViewRenderer::render: view name is not valid');
			return null;
		}
		
		// CREATE VIEW TAG
		$view_tag_id = $view_name.'_view_id';
		$buffer = '<div id="'.$view_tag_id.'"></div>';
		
		// ADD JS RESOURCES
		if ( $arg_view_resource->hasModelName() )
		{
			$model_name = $arg_view_resource->getModelName();
			$model_resource = Broker::getResourceObject($model_name);
			if ( ! is_object($model_resource) )
			{
				Trace::warning('JsViewRenderer::render: bad model resource object for name ['.$model_name.']');
				return null;
			}
			JsWrapper::addModelResource($model_resource);
		}
		JsWrapper::addViewResource($arg_view_resource);
		
		return $buffer;
	}
}
