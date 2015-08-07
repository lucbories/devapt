<?php
/**
 * @file        Dispatcher.php
 * @brief       Application dispatcher implementation
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

// ZF2 IMPORTS
use Zend\Debug\Debug;

// DEVAPT IMPORTS
use Devapt\Core\Trace;
use Devapt\Security\Authentication;

final class Dispatcher
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static public $TRACE_DISPATCHER = true;
	
	/// @brief CONTROLLERS REPOSITORY
	static private $controllers = array();
	
	
    /**
     * Constructor (private)
     */
    private function __construct()
    {
    }
	
	
	
	// ----------------- CONTROLLERS REGISTRATION -----------------
	/**
	 * @brief		Register a controller
	 * @param[in]	arg_controller_name			controller name
	 * @param[in]	arg_controller_object		controller object
	 * @return		boolean
	 */
	static public function registerController($arg_controller_name, $arg_controller_object)
	{
		// CHECK ARGS
		if ( is_null($arg_controller_name) || is_null($arg_controller_object) || $arg_controller_name == "" || ! $arg_controller_object instanceof ControllerInterface)
		{
			// Debug::dump('Dispatcher::registerController : Bad args');
			Trace::warning('Dispatcher::registerController : Bad args');
			return false;
		}
		
		self::$controllers[$arg_controller_name] = $arg_controller_object;
		
		return true;
	}
	
	
	
	/**
	 * @brief		Unregister a controller
	 * @param[in]	arg_controller_name		controller name
	 * @return		boolean
	 */
	static public function unregisterController($arg_controller_name)
	{
		unset(self::$controllers[$arg_controller_name]);
	}
	
	
	
	/**
	 * @brief		Test if a controller is registered for the given action  name
	 * @param[in]	arg_controller_name		controller name
	 * @return		boolean
	 */
	static public function hasController($arg_controller_name)
	{
		return array_key_exists($arg_controller_name, self::$controllers);
	}
	
	
	
	/**
	 * @brief		Get the registered controller for the given action  name
	 * @param[in]	arg_controller_name		controller name
	 * @return		object		controller object || null if not found
	 */
	static public function getController($arg_controller_name)
	{
		if ( array_key_exists($arg_controller_name, self::$controllers) )
		{
			return self::$controllers[$arg_controller_name];
		}
		return null;
	}
	
	
	
	// ----------------- ACTIONS DISPATCHING -----------------
	
	/**
	 * @brief		Dispatch the request to the controller
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		boolean
	 */
	static public function dispatch($arg_request, $arg_response)
	{
		$context = 'Dispatcher::dispatch(request,response)';
		Trace::step($context, '', Dispatcher::$TRACE_DISPATCHER);
		
		
		// CHECK REQUEST OBJECT
		if ( is_null($arg_request) )
		{
			Trace::warning('Dispatcher::dispatch: Null request');
			return false;
		}
		
		
		// GET SECURITY TOKEN
		$token = $arg_request->getQuery('security_token', null);
		if ( is_null($token) )
		{
			$token = $arg_request->getPost('security_token', null);
		}
		Authentication::setToken($token);
		Trace::value($context, 'token', $token, Dispatcher::$TRACE_DISPATCHER);
		
		
		// GET REQUEST PATH ITEMS
		$request		= $arg_request;
		$uri			= $request->getUri();
		
		$uri_path		= rtrim(ltrim($uri->getPath(), '/'), '/');
		$uri_path_items	= explode('/', $uri_path);
		$uri_path_count	= count($uri_path_items);
		
		$app_path		= rtrim(ltrim(Application::getInstance()->getConfig()->getUrlBase(), '/'), '/');
		$app_path_items	= explode('/', $app_path);
		$app_path_count	= count($app_path_items);
		
		Trace::value($context, "uri_path_count", $uri_path_count, Dispatcher::$TRACE_DISPATCHER);
		Trace::value($context, "app_path_count", $app_path_count, Dispatcher::$TRACE_DISPATCHER);
		Trace::value($context, "uri_path_items", $uri_path_items, Dispatcher::$TRACE_DISPATCHER);
		
		
		// GET CONTROLLER NAME
		$controller_index = $uri_path_count > $app_path_count ? $app_path_count : $uri_path_count - 1;
		// $controller_index = $app_path_count;
		Trace::value($context, "controller_index", $controller_index, Dispatcher::$TRACE_DISPATCHER);
		$controller_name = $uri_path_items[$controller_index];
		Trace::value($context, 'controller name', $controller_name, Dispatcher::$TRACE_DISPATCHER);
		
		
		// TEST IF TARGET CONTROLLER IS SECURITY
		$target_is_security = false;
		if ($uri_path_count > $app_path_count)
		{
			$target_is_security = ($controller_name === 'security');
		}
		if ($target_is_security)
		{
			Trace::step($context, 'Dispatcher::dispatch: target is security', Dispatcher::$TRACE_DISPATCHER);
			
			return Dispatcher::dispatchSecurity($arg_request, $arg_response);
		}
		
		
		// TEST IF TARGET IS HOME PAGE
		$target_is_home = $uri_path_count === $app_path_count || ($controller_name === 'index.php' && $uri_path_count === $app_path_count + 1 );
		
		
		if ( Authentication::isEnabled() )
		{
			// NO SECURITY TOKEN
			if ( is_null($token) )
			{
				Trace::step($context, 'NO SECURITY TOKEN', Dispatcher::$TRACE_DISPATCHER);
				
				return Dispatcher::dispatchLogin($arg_request, $arg_response);
			}
			
			// CHECK SECURITY USER
			$check_user = Authentication::isLogged();
			Trace::value($context, 'check security user', $check_user, Dispatcher::$TRACE_DISPATCHER);
			if ( ! $check_user )
			{
				Trace::step($context, 'no logged user or bad security token', Dispatcher::$TRACE_DISPATCHER);
				
				// TARGET IS HOME PAGE
				if ($target_is_home)
				{
					Trace::step($context, 'target is home: display login', Dispatcher::$TRACE_DISPATCHER);
					return Dispatcher::dispatchLogin($arg_request, $arg_response);
				}
				
				// PREPARE RESPONSE
				$response_status = $arg_response::STATUS_CODE_401;
				$arg_response->setStatusCode($response_status);
				
				// SEND RESPONSE
				$arg_response->send();
				
				return true;
			}
		}
		
		
		// TARGET CONTROLLER IS NOT SECURITY
		Trace::step($context, 'target is not security', Dispatcher::$TRACE_DISPATCHER);
		
		
		// HOME PAGE
		if ($target_is_home)
		{
			Trace::step($context, 'HOME PAGE', Dispatcher::$TRACE_DISPATCHER);
			return Dispatcher::dispatchHome($arg_request, $arg_response);
		}
		
		
		// CHECK REQUEST PATH LENGTH
		if ($uri_path_count < $app_path_count + 1)
		{
			Trace::warning('Dispatcher::dispatch: Bad request path length');
			
			// PREPARE RESPONSE
			$response_status = $arg_response::STATUS_CODE_404;
			$arg_response->setStatusCode($response_status);
			
			// SEND RESPONSE
			$arg_response->send();
			
			return false;
		}
		
		
		// PROCESS REQUEST
		$bypass_security = false;
		$result = Dispatcher::process($arg_request, $arg_response, $controller_name, $bypass_security);
		
		if ( ! $result )
		{
			// PREPARE RESPONSE
			$response_status = $arg_response::STATUS_CODE_404;
			$arg_response->setStatusCode($response_status);
			
			// SEND RESPONSE
			$arg_response->send();
		}
		
		Trace::step($context, ($result ? 'SUCCESS' : 'FAILURE'), Dispatcher::$TRACE_DISPATCHER);
		return $result;
	}
	
	
	
	/**
	 * @brief		Goto the login view
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		boolean
	 */
	static public function dispatchLogin($arg_request, $arg_response)
	{
		$context = 'Dispatcher::dispatchLogin(request,response)';
		Trace::step($context, '', Dispatcher::$TRACE_DISPATCHER);
		
		
		// GET REQUEST PATH ITEMS
		$uri_path_items = self::switchUrl(Application::getInstance()->getConfig()->getUrlLogin());
		$uri_path_count	= count($uri_path_items);
		
		$app_path		= rtrim(ltrim(Application::getInstance()->getConfig()->getUrlBase(), '/'), '/');
		$app_path_items	= explode('/', $app_path);
		$app_path_count	= count($app_path_items);
		
		// UPDATE REQUEST
		$request		= $arg_request;
		$uri			= $request->getUri();
		$uri_path		= implode('/', $uri_path_items);
		$uri->setPath($uri_path);
		
		// CHECK REQUEST PATH LENGTH
		if ($uri_path_count < $app_path_count + 1)
		{
			Trace::warning('Dispatcher::dispatch: Bad request path length');
			return false;
		}
		
		
		// GET THE CONTROLLER NAME
		$controller_name = $uri_path_items[$app_path_count];
		$bypass_security = true;
		
		
		$result = Dispatcher::process($arg_request, $arg_response, $controller_name, $bypass_security);
		
		
		Trace::step($context, ($result ? 'SUCCESS' : 'FAILURE'), Dispatcher::$TRACE_DISPATCHER);
		return $result;
	}
	
	
	
	/**
	 * @brief		Goto the Home view
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		boolean
	 */
	static public function dispatchHome($arg_request, $arg_response)
	{
		$context = 'Dispatcher::dispatchHome(request,response)';
		Trace::step($context, '', Dispatcher::$TRACE_DISPATCHER);
		
		
		// GET REQUEST PATH ITEMS
		$uri_path_items = self::switchUrl(Application::getInstance()->getConfig()->getUrlHome());
		$uri_path_count	= count($uri_path_items);
		
		$app_path		= rtrim(ltrim(Application::getInstance()->getConfig()->getUrlBase(), '/'), '/');
		$app_path_items	= explode('/', $app_path);
		$app_path_count	= count($app_path_items);
		
		// UPDATE REQUEST
		$request		= $arg_request;
		$uri			= $request->getUri();
		$uri_path		= implode('/', $uri_path_items);
		$uri->setPath($uri_path);
		
		
		// CHECK REQUEST PATH LENGTH
		if ($uri_path_count < $app_path_count + 1)
		{
			Trace::warning('Dispatcher::dispatch: Bad request path length');
			return false;
		}
		
		
		// GET THE CONTROLLER NAME
		$controller_name = $uri_path_items[$app_path_count];
		$bypass_security = false;
		
		
		$result = Dispatcher::process($arg_request, $arg_response, $controller_name, $bypass_security);
		
		
		Trace::step($context, ($result ? 'SUCCESS' : 'FAILURE'), Dispatcher::$TRACE_DISPATCHER);
		return $result;
	}
	
	
	
	/**
	 * @brief		Goto the Error view
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		boolean
	 */
	static public function dispatchError($arg_request, $arg_response)
	{
		$context = 'Dispatcher::dispatchError(request,response)';
		Trace::step($context, '', Dispatcher::$TRACE_DISPATCHER);
		
		
		// GET REQUEST PATH ITEMS
		$uri_path_items = self::switchUrl(Application::getInstance()->getConfig()->getUrlHome());
		$uri_path_count	= count($uri_path_items);
		
		$app_path		= rtrim(ltrim(Application::getInstance()->getConfig()->getUrlBase(), '/'), '/');
		$app_path_items	= explode('/', $app_path);
		$app_path_count	= count($app_path_items);
		
		// UPDATE REQUEST
		$request		= $arg_request;
		$uri			= $request->getUri();
		$uri_path		= implode('/', $uri_path_items);
		$uri->setPath($uri_path);
		
		
		// CHECK REQUEST PATH LENGTH
		if ($uri_path_count < $app_path_count + 1)
		{
			Trace::warning('Dispatcher::dispatch: Bad request path length');
			return false;
		}
		
		
		// GET THE CONTROLLER NAME
		$controller_name = $uri_path_items[$app_path_count];
		$bypass_security = false;
		
		
		$result = Dispatcher::process($arg_request, $arg_response, $controller_name, $bypass_security);
		
		
		Trace::step($context, ($result ? 'SUCCESS' : 'FAILURE'), Dispatcher::$TRACE_DISPATCHER);
		return $result;
	}
	
	
	/**
	 * @brief		Dispatch the request to the security controller
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
	 * @return		boolean
	 */
	static public function dispatchSecurity($arg_request, $arg_response)
	{
		$context = 'Dispatcher::dispatchSecurity(request,response)';
		Trace::step($context, '', Dispatcher::$TRACE_DISPATCHER);
		
		
		$controller_name = 'security';
		$bypass_security = true;
		
		
		$result = Dispatcher::process($arg_request, $arg_response, $controller_name, $bypass_security);
		
		
		Trace::step($context, ($result ? 'SUCCESS' : 'FAILURE'), Dispatcher::$TRACE_DISPATCHER);
		return $result;
	}
	
	
	
	/**
	 * @brief		Process the request with the given controller
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
     * @param[in]	arg_controller_name	controller name (string)
     * @param[in]	arg_bypass_security	bypass security (boolean)
	 * @return		boolean
	 */
	static public function process($arg_request, $arg_response, $arg_controller_name, $arg_bypass_security)
	{
		$context = 'Dispatcher::process(request,response,controller)';
		Trace::step($context, '', Dispatcher::$TRACE_DISPATCHER);
		
		
		Trace::value($context, 'controller name', $arg_controller_name, Dispatcher::$TRACE_DISPATCHER);
		Trace::value($context, 'bypass security', $arg_bypass_security, Dispatcher::$TRACE_DISPATCHER);
		
		
		// GET REQUEST PATH ITEMS
		$request		= $arg_request;
		$uri			= $request->getUri();
		
		$uri_path		= rtrim(ltrim($uri->getPath(), '/'), '/');
		$uri_path_items	= explode('/', $uri_path);
		$uri_path_count	= count($uri_path_items);
		Trace::value($context, 'uri_path_count', $uri_path_count, Dispatcher::$TRACE_DISPATCHER);
		
		$app_path		= rtrim(ltrim(Application::getInstance()->getConfig()->getUrlBase(), '/'), '/');
		$app_path_items	= explode('/', $app_path);
		$app_path_count	= count($app_path_items);
		Trace::value($context, 'app_path_count', $app_path_count, Dispatcher::$TRACE_DISPATCHER);
		
		$url_args_count = $uri_path_count - $app_path_count;
		Trace::value($context, 'url_args_count', $url_args_count, Dispatcher::$TRACE_DISPATCHER);
		
		
		// GET THE URL ARGS
		$action_name = null;
		$resource_name = null;
		$id_value = null;
		
		if ( $url_args_count < 2 )
		{
			Trace::warning("$context: Controller failed to dispatch request with bad args count [$url_args_count]");
			return false;
		}
		
		if ($url_args_count === 2)
		{
			Trace::step($context, 'URL WITH 2 ARGS', Dispatcher::$TRACE_DISPATCHER);
			$resource_name = $uri_path_items[$app_path_count + 1];
		}
		else if ($url_args_count === 3)
		{
			Trace::step($context, 'GET THE ACTION NAME', Dispatcher::$TRACE_DISPATCHER);
			$resource_name = $uri_path_items[$app_path_count + 1];
			$action_name = $uri_path_items[$app_path_count + 2];
		}
		else if ($url_args_count > 3)
		{
			Trace::step($context, 'GET THE ACTION NAME', Dispatcher::$TRACE_DISPATCHER);
			$resource_name = $uri_path_items[$app_path_count + 1];
			$action_name = $uri_path_items[$app_path_count + 2];
			$id_value = $uri_path_items[$app_path_count + 3];
		}
		if ( is_null($id_value) )
		{
			$id_value = $arg_request->getQuery()->get('id', null);
			if ( is_null($id_value) )
			{
				$id_value = $arg_request->getPost()->get('id', null);
			}
		}
		Trace::value($context, 'resource_name', $resource_name, Dispatcher::$TRACE_DISPATCHER);
		Trace::value($context, 'action_name', $action_name, Dispatcher::$TRACE_DISPATCHER);
		Trace::value($context, 'id_value', $id_value, Dispatcher::$TRACE_DISPATCHER);
		
		
		// CHECK RESOURCE NAME
		if ( is_null($resource_name) )
		{
			Trace::warning("$context: Controller failed to dispatch request for resource [$resource_name], action [$action_name], id [$id_value]");
			return false;
		}
		
		
		// GET CONTROLLER OBJECT
		$controller_object = Dispatcher::getController($arg_controller_name);
		if ( is_null($controller_object) )
		{
			Trace::warning("$context: Controller not found for name [$arg_controller_name]");
			return false;
		}
		
		
		// PROCESS THE REQUEST
		$result = $controller_object->dispatch($resource_name, $action_name, $id_value, $arg_request, $arg_response, $arg_bypass_security);
		if ( ! $result )
		{
			Trace::warning("$context: Controller failed to dispatch request for resource [$resource_name], action [$action_name], id [$id_value]");
			return false;
		}
		
		Trace::step($context, 'SUCCESS', Dispatcher::$TRACE_DISPATCHER);
		return true;
	}
	
	
	
	static protected function switchUrl($arg_url)
	{
		// GET APPLICATION BASE PATH
		$app_path		= rtrim(ltrim(Application::getInstance()->getConfig()->getUrlBase(), '/'), '/');
		$app_path_items	= explode('/', $app_path);
		$app_path_count	= count($app_path_items);
		
		// GET URL PATH
		$url_switch			= rtrim(ltrim($arg_url, '/'), '/');;
		$url_switch_items	= explode('/', $url_switch);
		$url_switch_count	= count($url_switch_items);
		if ($url_switch_count < 1)
		{
			Trace::warning("Dispatcher::dispatch : Bad switch url path length [$arg_url]");
			return null;
		}
		
		// BUILD NEW URL PATH ITEMS
		$app_path_items[] = $url_switch_items[0];
		$app_path_items[] = ($url_switch_count < 2) ? null : $url_switch_items[1];
		$app_path_items[] = ($url_switch_count < 3) ? null : $url_switch_items[2];
		
		// DEBUG
		// Debug::dump('Dispatcher::dispatch url controller: '.$url_switch_items[0]);
		// Debug::dump('Dispatcher::dispatch url resource: '.$url_switch_items[1]);
		// Debug::dump('Dispatcher::dispatch url action: '.$url_switch_items[2]);
		
		return $app_path_items;
	}
}
