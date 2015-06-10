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
	
	/// @brief TRACE FLAG
	static public $TRACE_RESOURCE_CONTROLLER = false;
	
	/// @brief ACTION NAME
	static public $RESOURCES_ACTION_GET		= 'get_resource';
	
	/// @brief ACTION NAME
	static public $RESOURCES_ACTION_LIST		= 'list';
	
	
	
    /**
     * Constructor
     */
    public function __construct()
    {
		$this->has_action_attribute = true;
    }
	
	
	
	public function doGetAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		// FORMAT RESPONSE
		$charset			= 'utf-8';
		$contentType		= 'application/json';
		$contentType		.= '; charset=' . $charset;
		$multibyteCharsets	= array(); // ???
		$headers = $arg_response->getHeaders();
		$headers->addHeaderLine('content-type', $contentType);
		if ( in_array(strtoupper($charset), $multibyteCharsets) )
		{
			$headers->addHeaderLine('content-transfer-encoding', 'BINARY');
		}
		
		
		// CHECK ACTION NAME
		if ( ! is_string($arg_action_name) || ($arg_action_name !== self::$RESOURCES_ACTION_GET && $arg_action_name !== self::$RESOURCES_ACTION_LIST) )
		{
			Trace::warning("ResourceController: Controller has no action name for resource [$arg_resource_name]");
			
			// UPDATE RESPONSE
			$arg_response->setContent('Bad action name');
			$arg_response->setStatusCode($arg_response::STATUS_CODE_400);
			
			// SEND JSON RESPONSE
			$arg_response->send();
			
			return false;
		}
		
		// LIST ACTION
		if ($arg_action_name === self::$RESOURCES_ACTION_LIST)
		{
			$resources = ResourcesBroker::getResourcesNames($arg_resource_name);
			$resource_json_str = implode(',', $resources);
		}
		
		// GET ACTION
		else if ($arg_action_name === self::$RESOURCES_ACTION_GET)
		{
			// CHECK AUTORIZATION
			if ( ! $this->authorization_is_cheched && ! $this->checkAuthorization($arg_resource_name, $arg_action_name) )
			{
				Trace::warning("ResourceController: Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");
				
				// UPDATE RESPONSE
				$arg_response->setContent('No access');
				$arg_response->setStatusCode($arg_response::STATUS_CODE_401);
				
				// SEND JSON RESPONSE
				$arg_response->send();
				
				return false;
			}
			
			// GET RESOURCE OBJECT
			$resource_json_str = ResourcesBroker::getResourceJson($arg_resource_name);
		}
		
		// CHECK BROKER ERROR
		if ( is_null($resource_json_str) )
		{
			Trace::warning('ResourceController: Resource broker error ['.$arg_resource_name.']');
			
			// UPDATE RESPONSE
			$arg_response->setContent('Broker error');
			$arg_response->setStatusCode($arg_response::STATUS_CODE_500);
			
			// SEND JSON RESPONSE
			$arg_response->send();
			
			return false;
		}
		
		// RESOURCE IS NOT FOUND
		if ($resource_json_str === ResourcesBroker::$RESOURCE_NOT_FOUND)
		{
			Trace::warning('ResourceController: Resource not found ['.$arg_resource_name.']');
			
			// UPDATE RESPONSE
			$arg_response->setContent('Not found');
			$arg_response->setStatusCode($arg_response::STATUS_CODE_404);
			
			// SEND JSON RESPONSE
			$arg_response->send();
			
			return true;
		}
		
		// UPDATE RESPONSE
		$arg_response->setContent($resource_json_str);
		$arg_response->setStatusCode($arg_response::STATUS_CODE_200);
		
		// SEND JSON RESPONSE
		$arg_response->send();
		
		
		Trace::step('ResourceController::doGetAction', 'get action success ['.$arg_resource_name.']', self::$TRACE_RESOURCE_CONTROLLER);
		return true;
	}
	
	public function doPostAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		Trace::warning('ResourceController: Dummy post action');
		return true;
	}
}