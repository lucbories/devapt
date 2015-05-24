<?php
/**
 * @file        ModelController.php
 * @brief       Controller implementation for resources of type Model
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

// ZEND IMPORTS
use Zend\Debug\Debug;
use Zend\Json\Json as JsonFormatter;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Resources\Broker as ResourcesBroker;
use Devapt\Resources\Model as ModelResource;


class ModelController extends AbstractController
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_MODEL_CONTROLLER = false;
	
	/// @brief CONTROLLER ACTION NAME FOR CREATE OPERATION
	public static $ACTION_CREATE = 'create';
	
	/// @brief CONTROLLER ACTION NAME FOR READ OPERATION
	public static $ACTION_READ = 'read';
	
	/// @brief CONTROLLER ACTION NAME FOR UPDATE OPERATION
	public static $ACTION_UPDATE = 'update';
	
	/// @brief CONTROLLER ACTION NAME FOR DELETE OPERATION
	public static $ACTION_DELETE = 'delete';
	
	
	
    /**
     * Constructor
     */
    public function __construct()
    {
		$this->has_action_attribute = true;
    }
	
	
	/**
	 * @brief		Process a GET HTTP request
	 * @param[in]	arg_resource_name	resource name (string)
	 * @param[in]	arg_action_name		action name (string)
	 * @param[in]	arg_id				record id (string) (optional)
	 * @param[in]	arg_request			HTTP request (object)
	 * @param[in]	arg_response		HTTP response (object)
	 * @return		boolean
	 */
	public function doGetAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		$context = 'ModelController::doGetAction: ';
		
		
		// CHECK ACTION NAME
		if ( ! $this->has_action_attribute )
		{
			$arg_action_name = self::$ACTION_READ;
		}
		
		// DO MODEL ACTION
		$result = $this->doModelAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
		if (! $result)
		{
			Trace::warning($context."Controller GET action processing failure for resource [$arg_resource_name]");
			return false;
		}
		
		
		Trace::step($context, 'Process GET model action success', self::$TRACE_MODEL_CONTROLLER);
		return true;
	}
	
	
	/**
	 * @brief		Process a PUT HTTP request
	 * @param[in]	arg_resource_name	resource name (string)
	 * @param[in]	arg_action_name		action name (string)
	 * @param[in]	arg_id				record id (string) (optional)
	 * @param[in]	arg_request			HTTP request (object)
	 * @param[in]	arg_response		HTTP response (object)
	 * @return		boolean
	 */
	public function doPutAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		$context = 'ModelController::doGPutAction: ';
		
		
		// CHECK ACTION NAME
		$arg_action_name = self::$ACTION_CREATE;
		
		// DO MODEL ACTION
		$result = $this->doModelAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
		if (! $result)
		{
			Trace::warning($context."Controller PUT action processing failure for resource [$arg_resource_name]");
			return false;
		}
		
		
		Trace::step($context, 'Process PUT model action success', self::$TRACE_MODEL_CONTROLLER);
		return true;
	}
	
	
	/**
	 * @brief		Process a POST HTTP request
	 * @param[in]	arg_resource_name	resource name (string)
	 * @param[in]	arg_action_name		action name (string)
	 * @param[in]	arg_id				record id (string) (optional)
	 * @param[in]	arg_request			HTTP request (object)
	 * @param[in]	arg_response		HTTP response (object)
	 * @return		boolean
	 */
	public function doPostAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		$context = 'ModelController::doPostAction: ';
		
		
		// CHECK ACTION NAME
//		if ( ! $this->has_action_attribute )
//		{
			$arg_action_name = self::$ACTION_UPDATE;
//		}
		
		// DO MODEL ACTION
		$result = $this->doModelAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
		if (! $result)
		{
			Trace::warning($context."Controller POST action processing failure for resource [$arg_resource_name]");
			return false;
		}
		
		
		Trace::step($context, 'Process POST model action success', self::$TRACE_MODEL_CONTROLLER);
		return true;
	}
	
	
	/**
	 * @brief		Process a DELETE HTTP request
	 * @param[in]	arg_resource_name	resource name (string)
	 * @param[in]	arg_action_name		action name (string)
	 * @param[in]	arg_id				record id (string) (optional)
	 * @param[in]	arg_request			HTTP request (object)
	 * @param[in]	arg_response		HTTP response (object)
	 * @return		boolean
	 */
	public function doDeleteAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		$context = 'ModelController;;doDeleteAction: ';
		
		
		// CHECK ACTION NAME
		$arg_action_name = self::$ACTION_DELETE;
		
		// DO MODEL ACTION
		$result = $this->doModelAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
		if (! $result)
		{
			Trace::warning($context."Controller DELETE action processing failure for resource [$arg_resource_name]");
			return false;
		}
		
		
		Trace::step($context, 'Process DELETE model action success', self::$TRACE_MODEL_CONTROLLER);
		return true;
	}
	
	
	/**
	 * @brief		Process a HTTP request
	 * @param[in]	arg_resource_name	resource name (string)
	 * @param[in]	arg_action_name		action name (string)
	 * @param[in]	arg_id				record id (string) (optional)
	 * @param[in]	arg_request			HTTP request (object)
	 * @param[in]	arg_response		HTTP response (object)
	 * @return		boolean
	 */
	public function doModelAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		$context = 'ModelController::doModelAction: ';
		
		// CHECK ACTION NAME
		if ( ! is_string($arg_action_name) )
		{
			Trace::warning($context."Controller has no action name for resource [$arg_resource_name]");
			return false;
		}
		
		// CHECK AUTORIZATION
		if ( ! $this->authorization_is_cheched && ! $this->checkAuthorization($arg_resource_name, $arg_action_name) )
		{
			Trace::warning($context."Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");
			return false;
		}
		
		// GET VIEW RESOURCE OBJECT
		$model_resource = ResourcesBroker::getResourceObject($arg_resource_name);
		if ( is_null($model_resource) )
		{
			Trace::warning($context.'Resource not found ['.$arg_resource_name.']');
			return false;
		}
		
		// BUILD QUERY OBJECT
		$query = \Devapt\Models\Query::buildFromRequest($arg_action_name, $model_resource, $arg_request, $arg_id);
		Trace::value($context, 'Query', $query, self::$TRACE_MODEL_CONTROLLER);
		// Debug::dump($query);
		if ( ! is_object($query) )
		{
			Trace::warning($context.'Build query failed ['.$arg_resource_name.']');
			return false;
		}
		
		
		// INIT MODEL RESULT
		$model_result = array('status'=>'error', 'count'=>'0', 'error'=>'bad action');
		
		
		// PAGE HEADER
		switch ($arg_action_name)
		{
			case self::$ACTION_READ:
			{
				$model_result = $model_resource->read($query);
				break;
			}
			case self::$ACTION_CREATE:
			{
				$model_result = $model_resource->create($query);
				break;
			}
			case self::$ACTION_UPDATE:
			{
				$model_result = $model_resource->update($query);
				break;
			}
			case self::$ACTION_DELETE:
			{
				$model_result = $model_resource->delete($query);
				break;
			}
		}
		
		
		// IS JSONP ?
		$jsonp_callback = $arg_request->getQuery('callback', null);
		$is_jsonp = is_string($jsonp_callback) ? true : false;
		
		
		// SET RESPONSE CONTENT
		$jsonOptions = null;
		$result_string = JsonFormatter::encode($model_result, null, $jsonOptions);
		Trace::value($context, 'Response content result', $result_string, self::$TRACE_MODEL_CONTROLLER);
		if ($is_jsonp)
		{
			$result_string = $jsonp_callback.'('.$result_string.');';
		}
		$arg_response->setContent($result_string);
		
		
		// DEBUG
		if (self::$TRACE_MODEL_CONTROLLER)
		{
			$str = JsonFormatter::prettyPrint($result_string, array("indent" => " "));
			Trace::value($context, '$model_result', $model_result, self::$TRACE_MODEL_CONTROLLER);
			Trace::value($context, 'JSON result', $str, self::$TRACE_MODEL_CONTROLLER);
		}
		
		
		// SET RESPONSE HEADER
		$charset		= 'utf-8'; // TODO: configure charset
		$contentType	= $is_jsonp ? 'application/javascript' : 'application/json';
		$contentType	.= '; charset=' . $charset;
		$headers = $arg_response->getHeaders();
		$headers->addHeaderLine('content-type', $contentType);
		$multibyteCharsets	= array(); // TODO: check usage
		if ( in_array(strtoupper($charset), $multibyteCharsets) )
		{
			$headers->addHeaderLine('content-transfer-encoding', 'BINARY'); // TODO: check usage
		}
		
		
		// SEND RESPONSE
		$arg_response->send();
		
		
		Trace::step($context, 'Process model action success ['.$arg_resource_name.']', self::$TRACE_MODEL_CONTROLLER);
		return true;
	}
}