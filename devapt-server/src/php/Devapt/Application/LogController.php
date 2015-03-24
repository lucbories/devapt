<?php
/**
 * @file        LogController.php
 * @brief       Log controller implementation
 * @details     ...
 * @see			...
 * @ingroup     APPLICATION
 * @date        2015-03-08
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 */

namespace Devapt\Application;

// ZEND IMPORTS
// use Zend\Debug\Debug;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Resources\Broker as ResourcesBroker;


class LogController extends AbstractController
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_LOGGER_CONTROLLER = false;
	
	
	
    /**
     * Constructor
     */
    public function __construct()
    {
		$this->has_action_attribute = false;
    }
	
	
	/*
	*/
	public function doGetAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		return $this->doPostAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
		
		
		// CHECK ACTION NAME
		if ( ! is_string($arg_action_name) )
		{
			Trace::warning("LogController: Controller has no action name for resource [$arg_resource_name]");
			return false;
		}
		
		// CHECK AUTORIZATION
		if ( ! $this->authorization_is_cheched && ! $this->checkAuthorization($arg_resource_name, $arg_action_name) )
		{
			Trace::warning("LogController: Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");
			return false;
		}
		
		// GET VIEW RESOURCE OBJECT
		$logger_resource = ResourcesBroker::getResourceObject($arg_resource_name);
		if ( is_null($logger_resource) )
		{
			Trace::warning('LogController: Resource not found ['.$arg_resource_name.']');
			return false;
		}
		
		// NOTHING TO DO ...
		Trace::warning('LogController: Get is not implemented ['.$arg_resource_name.']');
		return false;
		
		
		// Trace::step('LogController::doGetAction', 'Logger success ['.$arg_resource_name.']', self::$TRACE_VIEW_CONTROLLER);
		// return true;
	}
	
	
	public function doPostAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		// CHECK ACTION NAME
		if ( ! is_string($arg_action_name) )
		{
			Trace::warning("LogController: Controller has no action name for resource [$arg_resource_name]");
			return false;
		}
		
		// CHECK AUTORIZATION
		if ( ! $this->authorization_is_cheched && ! $this->checkAuthorization($arg_resource_name, $arg_action_name) )
		{
			Trace::warning("LogController: Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");
			return false;
		}
		
		// GET VIEW RESOURCE OBJECT
		$logger_resource = ResourcesBroker::getResourceObject($arg_resource_name);
		if ( is_null($logger_resource) )
		{
			Trace::warning('LogController: Resource not found ['.$arg_resource_name.']');
			return false;
		}
		
		// SWITCH ON METHOD
		switch($arg_action_name)
		{
			case 'security':
				$msg = 'REMOTE LOGGER ['.$arg_resource_name.'] - SECURITY:'.$arg_id;
				Trace::notice($msg, $arg_resource_name);
				break;
			case 'debug':
				$msg = 'REMOTE LOGGER ['.$arg_resource_name.'] - DEBUG:'.$arg_id;
				Trace::debug($msg, $arg_resource_name);
				break;
			case 'info':
				$msg = 'REMOTE LOGGER ['.$arg_resource_name.'] - INFO:'.$arg_id;
				Trace::info($msg, $arg_resource_name);
				break;
			case 'warn':
				$msg = 'REMOTE LOGGER ['.$arg_resource_name.'] - WARNING:'.$arg_id;
				Trace::warning($msg, $arg_resource_name);
				break;
			case 'error':
				$msg = 'REMOTE LOGGER ['.$arg_resource_name.'] - ERROR:'.$arg_id;
				Trace::error($msg, $arg_resource_name);
				break;
			default:
				$msg = 'REMOTE LOGGER ['.$arg_resource_name.'] - UNKNOW:'.$arg_id;
				Trace::error($msg, $arg_resource_name);
				break;
		}
		
		
		Trace::step('LogController::doPostAction', 'Logger success ['.$arg_resource_name.']', self::$TRACE_LOGGER_CONTROLLER);
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