<?php
/**
 * @file        ResourceController.php
 * @brief       Controller implementation for resources
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

class ResourceController extends AbstractController
{
	// STATIC ATTRIBUTES
	static public $RESOURCES_ACTION_GET		= 'get_resource';
	
	
	
    /**
     * Constructor
     */
    public function __construct()
    {
		$this->has_action_attribute = true;
    }
	
	
	
	public function doGetAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		// CHECK ACTION NAME
		if ( ! is_string($arg_action_name) )
		{
			Trace::warning("ResourceController: Controller has no action name for resource [$arg_resource_name]");
			return false;
		}
		
		// CHECK AUTORIZATION
		if ( ! $this->authorization_is_cheched && ! $this->checkAuthorization($arg_resource_name, $arg_action_name) )
		{
			Trace::warning("ResourceController: Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");
			return false;
		}
		
		// GET RESOURCE OBJECT
		$resource_json_str = ResourcesBroker::getResourceJson($arg_resource_name);
		if ( is_null($resource_json_str) )
		{
			Trace::warning('ResourceController: Resource not found ['.$arg_resource_name.']');
			return false;
		}
		
		// FORMAT RESPONSE
		$charset			= 'utf-8';
		$contentType		= 'application/json';
		$contentType		.= '; charset=' . $charset;
		$multibyteCharsets	= array(); // ???
		
		$arg_response->setContent($resource_json_str);
		$headers = $arg_response->getHeaders();
		$headers->addHeaderLine('content-type', $contentType);
		
		if ( in_array(strtoupper($charset), $multibyteCharsets) )
		{
			$headers->addHeaderLine('content-transfer-encoding', 'BINARY');
		}
		
		// SEND JSON RESPONSE
		$arg_response->send();
		
		Trace::info('ResourceController: get action success ['.$arg_resource_name.']');
		return true;
	}
}