<?php
/**
 * @file        JsWrapper.php
 * @brief       Controller implementation for resources of type View
 * @details     ...
 * @see			...
 * @ingroup     APPLICATION
 * @date        2014-01-18
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 */

namespace Devapt\Application;

// DEBUG
// use Zend\Debug\Debug;
use Devapt\Core\Trace;

// RESOURCES
use Devapt\Resources\Broker as ResourcesBroker;
use Devapt\Resources\View as ViewResource;

final class JsWrapper
{
	static $js_resources_buffers = array();
	
    /**
     * Constructor
     */
    private function __construct()
    {
    }
	
	
	
	static public function initJsResources($arg_response)
	{
		// BUILD JS BUFFER
		$js_buffer = '';
		foreach(self::$js_resources_buffers as $js_resource_buffer)
		{
			$js_buffer .= $js_resource_buffer.'\n';
		}
		
		// UPDATE RESPONSE
		if ( is_string($js_buffer) && $js_buffer !== '')
		{
			$buffer = '';
			$buffer .= '<SCRIPT type="text/javascript">';
			$buffer .= '$(document).ready( function() {\n'.$js_buffer.'}\n );\n';
			$buffer .= '</SCRIPT>';
			
			$content = $arg_response->getContent();
			$content .= $buffer;
			$arg_response->setContent($content);
		}
	}
	
	
	static public function addModelResource($arg_model_resource, $arg_response)
	{
		// CHECK RESOURCE OBJECT
		if ( ! is_object($arg_model_resource) )
		{
			Trace::warning('JsWrapper: bad resource object');
			return false;
		}
		
		// CHECK RESPONSE OBJECT
		if ( ! is_object($arg_response) )
		{
			Trace::warning('JsWrapper: bad response object');
			return false;
		}
		
		Trace::info('JsWrapper: Render model JS resource success ['.$arg_resource_name.']');
		return true;
	}
	
	
	static public function addViewResource($arg_view_resource, $arg_response)
	{
		// CHECK RESOURCE OBJECT
		if ( ! is_object($arg_view_resource) )
		{
			Trace::warning('JsWrapper: bad resource object');
			return false;
		}
		
		// CHECK RESPONSE OBJECT
		if ( ! is_object($arg_response) )
		{
			Trace::warning('JsWrapper: bad response object');
			return false;
		}
		
		Trace::info('JsWrapper: Render view JS resource success ['.$arg_resource_name.']');
		return true;
	}
}