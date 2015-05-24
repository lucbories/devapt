<?php
/**
 * @file        SecurityController.php
 * @brief       Security controller implementation
 * @details     ...
 * @see			...
 * @ingroup     APPLICATION
 * @date        2015-03-14
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 */

namespace Devapt\Application;

// ZEND IMPORTS
// use Zend\Debug\Debug;
use Zend\Json\Json as JsonFormatter;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Security\Authentication;


class SecurityController extends AbstractController
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_SECURITY_CONTROLLER = true;
	
	
	
    /**
     * Constructor
     */
    public function __construct()
    {
		$this->has_action_attribute = false;
    }
	
	
	/*
	*/
	
	
	
	
	/**
     * Check permission and dispatch the request to the corresponding method
     * @param[in]	arg_resource_name	resource name (string)
     * @param[in]	arg_action_name		action name (string)
     * @param[in]	arg_id				optional record id (string)
     * @param[in]	arg_request			ZF2 request object (object)
     * @param[in]	arg_response		ZF2 response object (object)
     * @param[in]	arg_bypass_security	do not check security (is it a login resource) (boolean)
     * @return		boolean
     */
	public function dispatch($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response, $arg_bypass_security = false)
	{
		$context = "SecurityController.dispatch";
		Trace::warning("SecurityController: bypass security [$arg_bypass_security] for resource [$arg_resource_name]");
		
		
		// DO ACTION
		$result = $this->doAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
		if ($result)
		{
			// ACTION SUCCESS
			Trace::step($context, "Controller authorization success for action [$arg_action_name] on resource [$arg_resource_name]", self::$TRACE_ABSTRACT_CONTROLLER);
			return true;
		}
		
		// ACTION FAILURE
		Trace::warning("SecurityController: Controller authorization failed for action [$arg_action_name] on resource [$arg_resource_name]");
		Trace::warning("SecurityController: Controller action [$arg_action_name] on resource [$arg_resource_name] failed");
		return false;
		
		
	}
	
	
	public function doGetAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		Trace::warning('SecurityController: GET method is not implemented ['.$arg_resource_name.']');
		return false;
	}
	
	
	public function doPostAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		// CHECK RESOURCE NAME
		if ( ! is_string($arg_resource_name) )
		{
			Trace::warning("SecurityController: bad resource name");
			return false;
		}
		
		// CHECK ACTION NAME
		if ( ! is_string($arg_action_name) )
		{
			Trace::warning("SecurityController: Controller has no action name for resource [$arg_resource_name]");
			return false;
		}
		
		
		// SWITCH ON RESOURCE
		if ($arg_resource_name === 'authentication')
		{
			// SWITCH ON ACTION
			switch($arg_action_name)
			{
				case 'login':
				{
					// GET REQUEST CONTENT
					$json_datas_str = $arg_request->getContent();
					if ( ! is_string($json_datas_str) )
					{
						Trace::warning("SecurityController: no request content for resource [$arg_resource_name]");
						return false;
					}
					
					// FORMAT JSON REQUEST CONTENT
					$json_datas = JsonFormatter::decode($json_datas_str, JsonFormatter::TYPE_ARRAY);
					if ( ! is_array($json_datas) || ! array_key_exists('login', $json_datas) || ! array_key_exists('password', $json_datas) )
					{
						Trace::warning("SecurityController: bad request content for resource [$arg_resource_name]");
						return false;
					}
					
					// GET LOGIN AND PASSWORD
					$login = $json_datas['login'];
					$password = $json_datas['password'];
					
					// TRACE REQUEST
					$msg = 'SecurityController::doPostAction resource ['.$arg_resource_name.'] action ['.$arg_action_name.'] login ['.$login.'] password ['.$password.']';
					Trace::notice($msg, $arg_resource_name);
					
					// PROCESS AUTHENTICATION LOGIN
					// $hashed_password = Authentication::hashPassword($password);
					$hashed_password = $password;
					$auth_result = Authentication::login($login, $hashed_password);
					
					// SET RESPONSE CONTENT
					$response_status = $arg_response::STATUS_CODE_401;
					$response_content = array();
					if ($auth_result)
					{
						$response_status = $arg_response::STATUS_CODE_200;
						
						$expire = Authentication::expire();
						$token = Authentication::token($expire);
						
						$response_content['status'] = 'ok';
						$response_content['login'] = $login;
						$response_content['expire'] = $expire;
						$response_content['token'] = $token;
					}
					else
					{
						$response_content['status'] = 'error';
						$response_content['login'] = $login;
						$response_content['error'] = 'bad credentials';
					}
					
					// IS A JSONP REQUEST ?
					$jsonp_callback = $arg_request->getQuery('callback', null);
					$is_jsonp = is_string($jsonp_callback) ? true : false;
					
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
					
					// SET RESPONSE CONTENT
					$jsonOptions = null;
					$result_string = JsonFormatter::encode($response_content, null, $jsonOptions);
					if ($is_jsonp)
					{
						$result_string = $jsonp_callback.'('.$result_string.');';
					}
					$arg_response->setContent($result_string);
					$arg_response->setStatusCode($response_status);
					
					// SEND RESPONSE
					$arg_response->send();
					
					break;
				}
				
				
				case 'logout':
				{
					$msg = 'SecurityController::doPostAction resource ['.$arg_resource_name.'] action ['.$arg_action_name.']';
					Trace::notice($msg, $arg_resource_name);
					
					$result = Authentication::logout();
					if ( ! $result )
					{
						Trace::warning('SecurityController::doPostAction: Logout failed.');
						Trace::step('SecurityController::doPostAction', 'Logout failure ['.$arg_resource_name.']', self::$TRACE_SECURITY_CONTROLLER);
						return false;
					}
					
					break;
				}
				
				
				case 'renew':
				{
					$msg = 'SecurityController::doPostAction resource ['.$arg_resource_name.'] action ['.$arg_action_name.']';
					Trace::notice($msg, $arg_resource_name);
					
					if ( ! Authentication::isEnabled() )
					{
						Trace::step('SecurityController::doPostAction', 'Renew requested but authentication is not enabled.', self::$TRACE_SECURITY_CONTROLLER);
						return true;
					}
					
					
					// NO SECURITY TOKEN
					$token = Authentication::getToken();
					if ( is_null($token) )
					{
						Trace::step($context, 'NO SECURITY TOKEN', self::$TRACE_SECURITY_CONTROLLER);
						
						return Dispatcher::dispatchLogin($arg_request, $arg_response);
					}
					
					
					// CHECK SECURITY USER
					$check_user = Authentication::isLogged();
					Trace::value($context, 'check security user', $check_user, self::$TRACE_SECURITY_CONTROLLER);
					if ( ! $check_user )
					{
						Trace::step($context, 'no logged user or bad security token', self::$TRACE_SECURITY_CONTROLLER);
						
						// PREPARE RESPONSE
						$response_status = $arg_response::STATUS_CODE_401;
						$arg_response->setStatusCode($response_status);
						
						// SEND RESPONSE
						$arg_response->send();
						
						return true;
					}
					
					
					// AUTHENTICATION IS CHECKED, DO TOKEN RENEW
					
					// GET REQUEST CONTENT
					$json_datas_str = $arg_request->getContent();
					if ( ! is_string($json_datas_str) )
					{
						Trace::warning("SecurityController: no request content for resource [$arg_resource_name]");
						return false;
					}
					
					// FORMAT JSON REQUEST CONTENT
					$json_datas = JsonFormatter::decode($json_datas_str, JsonFormatter::TYPE_ARRAY);
					if ( ! is_array($json_datas) || ! array_key_exists('login', $json_datas) || ! array_key_exists('password', $json_datas) )
					{
						Trace::warning("SecurityController: bad request content for resource [$arg_resource_name]");
						return false;
					}
					
					// GET LOGIN
					$login = $json_datas['login'];
					
					// SET RESPONSE CONTENT
					$response_status = $arg_response::STATUS_CODE_401;
					$response_content = array();
					$response_status = $arg_response::STATUS_CODE_200;
					
					$expire = Authentication::expire();
					$token = Authentication::token($expire);
					
					$response_content['status'] = 'ok';
					$response_content['login'] = $login;
					$response_content['expire'] = $expire;
					$response_content['token'] = $token;
					
					// IS A JSONP REQUEST ?
					$jsonp_callback = $arg_request->getQuery('callback', null);
					$is_jsonp = is_string($jsonp_callback) ? true : false;
					
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
					
					// SET RESPONSE CONTENT
					$jsonOptions = null;
					$result_string = JsonFormatter::encode($response_content, null, $jsonOptions);
					if ($is_jsonp)
					{
						$result_string = $jsonp_callback.'('.$result_string.');';
					}
					$arg_response->setContent($result_string);
					$arg_response->setStatusCode($response_status);
					
					// SEND RESPONSE
					$arg_response->send();
					
					break;
				}
				
				
				default:
					$msg = 'SecurityController::doPostAction resource ['.$arg_resource_name.'] action ['.$arg_action_name.']';
					Trace::error($msg, $arg_resource_name);
					Trace::step('SecurityController::doPostAction', 'Bad security action failure ['.$arg_resource_name.']', self::$TRACE_SECURITY_CONTROLLER);
					return false;
			}
		}
		
		
		Trace::step('SecurityController::doPostAction', 'Action success ['.$arg_resource_name.'] action ['.$arg_action_name.']', self::$TRACE_SECURITY_CONTROLLER);
		return true;
	}
	
	
	public function doPutAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		Trace::warning('SecurityController: PUT method is not implemented');
		return false;
	}
	
	
	public function doDeleteAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response)
	{
		Trace::warning('SecurityController: DELETE method is not implemented');
		return false;
	}
}