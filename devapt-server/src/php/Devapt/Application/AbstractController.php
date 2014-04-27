<?php
/**
 * @file        AbstractController.php
 * @brief       Base controller class
 * @details     ...
 * @see			...
 * @ingroup     APPLICATION
 * @date        2014-01-18
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Application;

// DEBUG
// use Zend\Debug\Debug;
use Devapt\Core\Trace;

// RESOURCES
use Devapt\Resources\Broker as ResourcesBroker;

// SECURITY
use Devapt\Security\Authentication;
use Devapt\Security\Authorization;

abstract class AbstractController implements ControllerInterface
{
	/// @brief Controller need an action attribute ?
	protected $has_action_attribute			= true;
	protected $authorization_is_cheched		= false;
	
	
    /**
     * Constructor
     */
    protected function __construct()
    {
    }
	
	
	
	public function dispatch($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		// RESERT AUTHORIZATION FLAG
		$this->authorization_is_cheched = false;
		
		// SEARCH RESOURCE OBJECT
		if ( ! ResourcesBroker::searchResource($arg_resource_name) )
		{
			Trace::warning("AbstractController: Resource [$arg_resource_name] not found");
			return false;
		}
		
		// CHECK ACTION ATTRIBUTE
		if ( ! is_string($arg_action_name) && $this->has_action_attribute )
		{
			Trace::warning("AbstractController: Controller need an action on resource [$arg_resource_name]");
			return false;
		}
		
		// CHECK AUTHORIZATION
		if ( is_string($arg_action_name) && ! $this->checkAuthorization($arg_resource_name, $arg_action_name) )
		{
			Trace::warning("AbstractController: Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");
			return false;
		}
		
		// DO ACTION
		$result = $this->doAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
		if ($result)
		{
			// ACTION SUCCESS
			Trace::info("AbstractController: Controller authorization success for action [$arg_action_name] on resource [$arg_resource_name]");
			return true;
		}
		
		// ACTION FAILURE
		Trace::warning("AbstractController: Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");("AbstractController: Controller action [$arg_action_name] on resource [$arg_resource_name] failed");
		return false;
	}
	
	
	
	/**
     * Check if the logged user has permission to execute the given action on the given resource
     * @param[in]	arg_resource_name	resource name (string)
     * @param[in]	arg_action_name		action name (string)
     * @return		boolean
     */
	protected function checkAuthorization($arg_resource_name, $arg_access_name)
	{
		$this->authorization_is_cheched = true;
		
		// TEST IF AUTHENTIFICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			Trace::warning('AbstractController: Authentication is disabled');
			return true;
		}
		
		// TEST IF A USER IS LOGGED
		if ( ! Authentication::isLogged() )
		{
			Trace::warning('AbstractController: Authentication is enabled but no user is logged');
			return false;
		}
		
		// TEST IF AUTHORIZATION IS ENABLED
		if ( ! Authorization::isEnabled() )
		{
			Trace::warning('AbstractController: Authorization is disabled');
			return true;
		}
		
		// CHECK AUTHORIZATION FOR THE LOGGED USER
		$result = Authorization::checkLogged($arg_resource_name, $arg_access_name);
		if ($result == true)
		{
			// AUDIT ACCESS
			Trace::info('AbstractController: Authentication success');
			return true;
		}
		
		Trace::warning('AbstractController: Logged user has no access ['.$arg_access_name.'] for this resource['.$arg_resource_name.']');
		return false;
	}
	
	
	public function doAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		// RESTful methods
        $method = strtolower($arg_request->getMethod());
        switch ($method)
		{
			case 'get':		return $this->doGetAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
			case 'post':	return $this->doPostAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
			case 'put':		return $this->doPutAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
			case 'delete':	return $this->doDeleteAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
		}
		
		return false;
	}
	
	
	public function doGetAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		Trace::warning('AbstractController: Dummy get action');
		return true;
	}
	
	
	public function doPostAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		Trace::warning('AbstractController: Dummy post action');
		return true;
	}
	
	
	public function doPutAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		Trace::warning('AbstractController: Dummy put action');
		return true;
	}
	
	
	public function doDeleteAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		Trace::warning('AbstractController: Dummy delete action');
		return true;
	}
}
