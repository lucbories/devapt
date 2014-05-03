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
			$js_buffer .= $js_resource_buffer;
		}
		
		// UPDATE RESPONSE
		if ( is_string($js_buffer) && $js_buffer !== '')
		{
			$buffer = '';
			$buffer .= '<SCRIPT type="text/javascript">';
			$buffer .= 'console.info(\'Devapt.main define\');';
			$buffer .= 'define(\'main\', [\'Devapt\', \'core/resources\'], function(Devapt, DevaptResources) {';
			$buffer .= 'console.info(\'Devapt.main\');';
			$buffer .= 'var $ = Devapt.jQuery();';
			$buffer .= '$(document).ready( function() {'.$js_buffer.'} );';
			$buffer .= '} );  var main = require([\'main\']);  </SCRIPT>';
			
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
		
		// GET RESOURCE DECLARATION
		$resource_name = $arg_model_resource->getResourceName();
		$resource_json_str = ResourcesBroker::getResourceJson($resource_name);
		
		// SAVE BUFFER
		$this->js_resources_buffers[] = 'DevaptResources.add_cached_declaration('.$resource_json_str.');';
		
		Trace::info('JsWrapper: Render model JS resource success ['.$resource_name.']');
		return true;
	}
	
	
	static public function addViewResource($arg_view_resource, $arg_response, $arg_view_tag_id)
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
		
		// GET RESOURCE DECLARATION
		$resource_name = $arg_view_resource->getResourceName();
		$resource_json_str = ResourcesBroker::getResourceJson($resource_name);
		
		// SAVE BUFFER
		$js_code = 'DevaptResources.add_cached_declaration('.$resource_json_str.');';
		$js_code .= 'DevaptViews.render(\''.$resource_name.'\',\''.$arg_view_tag_id.'\');';
		self::$js_resources_buffers[] = $js_code;
		
		Trace::info('JsWrapper: Render view JS resource success ['.$resource_name.']');
		return true;
	}
}