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

// DEBUG
use Zend\Debug\Debug;

// SECURITY
use Devapt\Security\Authentication;

final class Dispatcher
{
	static protected $DEBUG_RUNNING = false;
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
			Debug::dump('Dispatcher::registerController : Bad args');
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
		// CHECK REQUEST OBJECT
		if ( is_null($arg_request) )
		{
			Debug::dump('Dispatcher::dispatch: Null request');
			return false;
		}
		
		// GET REQUEST PATH ITEMS
		$request		= $arg_request;
		$uri			= $request->getUri();
		
		$uri_path		= rtrim(ltrim($uri->getPath(), '/'), '/');
		$uri_path_items	= explode('/', $uri_path);
		$uri_path_count	= count($uri_path_items);
		
		$app_path		= rtrim(ltrim(Application::getInstance()->getConfig()->getUrlBase(), '/'), '/');
		$app_path_items	= explode('/', $app_path);
		$app_path_count	= count($app_path_items);
		
		
		// LOGIN PAGE
		if ( Authentication::isEnabled() && ! Authentication::isLogged() )
		{
			$uri_path_items = self::switchUrl(Application::getInstance()->getConfig()->getUrlLogin());
			$uri_path_count	= count($uri_path_items);
		}
		
		// HOME PAGE
		if ($uri_path_count === $app_path_count || ($uri_path_items[$app_path_count] === 'index.php' && $uri_path_count === $app_path_count + 1 ))
		{
			$uri_path_items = self::switchUrl(Application::getInstance()->getConfig()->getUrlHome());
			$uri_path_count	= count($uri_path_items);
		}
		
		// CHECK REQUEST PATH LENGTH
		if ($uri_path_count < $app_path_count + 1)
		{
			Debug::dump('Dispatcher::dispatch: Bad request path length');
			return false;
		}
		
		// GET THE CONTROLLER NAME
		$controller_name = $uri_path_items[$app_path_count];
		
		// GET THE RESOURCE NAME
		$resource_name = null;
		if ($uri_path_count >= $app_path_count + 2)
		{
			$resource_name = $uri_path_items[$app_path_count + 1];
		}
		
		// GET THE ACTION NAME
		$action_name = null;
		if ($uri_path_count >= $app_path_count + 3)
		{
			$action_name = $uri_path_items[$app_path_count + 2];
		}
		
		// GET THE ID VALUE
		$id_value = null;
		if ($uri_path_count >= $app_path_count + 4)
		{
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
		
		if (self::$DEBUG_RUNNING)
		{
			Debug::dump('Dispatcher: action=['.$action_name.'] resource=['.$resource_name.'] id=['.(is_null($id_value) ? 'null' : $id_value).']');
		}
		
		// GET CONTROLLER OBJECT
		$controller_object = Dispatcher::getController($controller_name);
		if ( is_null($controller_object) )
		{
			Debug::dump("Dispatcher::dispatch: Controller not found for name [$controller_name]");
			return false;
		}
		
		// DISPATCH THE ACTION TO THE CONTROLLER
		$result = $controller_object->dispatch($resource_name, $action_name, $id_value, $arg_request, $arg_response);
		if ( ! $result )
		{
			Debug::dump("Dispatcher::dispatch: Controller failed to dispatch request for resource [$resource_name], action [$action_name], id [$id_value]");
			return false;
		}
		
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
			Debug::dump("Dispatcher::dispatch : Bad switch url path length [$arg_url]");
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
