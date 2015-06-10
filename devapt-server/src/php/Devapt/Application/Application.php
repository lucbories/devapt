<?php
/**
 * @file        Application.php
 * @brief       Application implementation
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
use Zend\Debug\Debug;
use Devapt\Core\Trace;

// IMPORT HTTP
use Zend\Http\PhpEnvironment\Request as HttpRequest;
use Zend\Http\PhpEnvironment\Response as HttpResponse;

// IMPORT SESSIONS
use Zend\Session\Config\StandardConfig;
use Zend\Session\SessionManager;
use Zend\Session\Container;

class Application extends AbstractApplication implements ApplicationInterface
{
	static protected $DEBUG_RUNNING = false;
	
	static protected $app = null;
	
	
    /**
     * @var array
     */
    protected $configuration = null;
	
    /**
     * @var \Zend\Stdlib\RequestInterface
     */
    protected $request = null;
	
    /**
     * @var ResponseInterface
     */
    protected $response = null;
	
	/// @brief Session manager object
	protected $session_manager = null;
	
	
    /**
     * Constructor
     *
     * @param[in] arg_config_array configuration associative array
     */
    public function __construct($arg_config_array)
    {
		Application::$app		= $this;
		
        $this->configuration  = new ApplicationConfiguration($arg_config_array);

        $this->request        = new HttpRequest();
        $this->response       = new HttpResponse();
		
		// REGISTER ACCESS
		// TODO DEFINE CUSTOM ROLES IN APPLICATION CONFIG
		$get_action = \Devapt\Application\ResourceController::$RESOURCES_ACTION_GET;
		$list_action = \Devapt\Application\ResourceController::$RESOURCES_ACTION_LIST;
		$access = '*';
		\Devapt\Security\Authorization::registerRoleAccess('application', $get_action, $access);
		\Devapt\Security\Authorization::registerRoleAccess('all', $list_action, $access);
		\Devapt\Security\Authorization::registerRoleAccess('models', $list_action, $access);
		\Devapt\Security\Authorization::registerRoleAccess('views', $list_action, $access);
		\Devapt\Security\Authorization::registerRoleAccess('menus', $list_action, $access);
		\Devapt\Security\Authorization::registerRoleAccess('menubars', $list_action, $access);
		\Devapt\Security\Authorization::registerRoleAccess('loggers', $list_action, $access);
    }
	
	
	
    /**
     * Get the singleton object
     *
     * @return Application
     */
    static public function getInstance()
    {
        return Application::$app;
    }
	
	
	
    /**
     * Get the configuration object
     *
     * @return ApplicationConfiguration
     */
    public function getConfig()
    {
        return $this->configuration;
    }
	
	
	
    /**
     * Get the session manager object
     *
     * @return SessionManager
     */
    public function getSessionManager()
    {
        return $this->session_manager;
    }
	
	
	
    /**
     * Get the session manager object
     *
     * @return SessionManager
     */
    public function getSessionContainer()
    {
        return $this->session_manager->getContainer();
    }
	
	
	
    /**
     * Get the request object
     *
     * @return \Zend\Stdlib\RequestInterface
     */
    public function getRequest()
    {
        return $this->request;
    }
	
	
	
    /**
     * Get the response object
     *
     * @return ResponseInterface
     */
    public function getResponse()
    {
        return $this->response;
    }
	
	
	
    /**
     * Run the application
     *
     * @return nothing
     */
    public function run()
	{
		if (self::$DEBUG_RUNNING)
		{
			Debug::dump('Application: starts running');
		}
		
		// INIT CONNECTIONS AND SECURITY AND MODULES
		if ( ! $this->getConfig()->getStatusOffline() )
		{
			// INIT CONNECTIONS
			if ( ! $this->initConnections() )
			{
				Debug::dump('Application: Init connections failed.');
				return;
			}
			
			// INIT TRACES
			if ( ! $this->initTraces() )
			{
				Trace::error('Application: Init traces failed.');
				return;
			}
			
			// INIT SECURITY
			if ( ! $this->initSecurity() )
			{
				Trace::error('Application: Init security failed.');
				return;
			}
			
			// INIT SESSIONS
			if ( ! $this->initSessions() )
			{
				Trace::error('Application: Init sessions failed.');
				return;
			}
			
			// INIT MODULES
			if ( ! $this->initModules() )
			{
				Trace::error('Application: Init modules failed.');
				return;
			}
		}
		
		// INIT DISPATCHER
		if ( ! $this->initDispatcher() )
		{
			Trace::error('Application: Init dispatcher failed.');
			return;
		}
		
		// PROCESS REQUEST
		if (self::$DEBUG_RUNNING)
		{
			Debug::dump('Application: process request');
		}
		$request = $this->getRequest();
		$response = $this->getResponse();
		$result = Dispatcher::dispatch($request, $response);
		
		if (! $result)
		{
			// TODO
		}
		
		if (self::$DEBUG_RUNNING)
		{
			if (! $result)
			{
				Debug::dump('Application: stops running with request failure');
			}
			else
			{
				Debug::dump('Application: stops running with request success');
			}
		}
	}
	
	
	
    /**
     * Run the application for Tests Units
     *
     * @return boolean
     */
    public function run_tu($arg_tu_path)
	{
		// if (self::$DEBUG_RUNNING)
		// {
			// Debug::dump('Application: starts running for TU');
		// }
		
		define('DEVAPT_APP_PRIVATE_ROOT', $arg_tu_path);
		define('DEVAPT_APP_MODULES_ROOT', $arg_tu_path.'/modules/');
		define('DEVAPT_MODULES_ROOT', $arg_tu_path.'/modules/');
		
		// INIT CONNECTIONS AND SECURITY AND MODULES
		if ( ! $this->getConfig()->getStatusOffline() )
		{
			// INIT CONNECTIONS
			if ( ! $this->initConnections() )
			{
				Debug::dump('Application: Init connections failed.');
				return false;
			}
			
			// INIT TRACES
			if ( ! $this->initTraces() )
			{
				Trace::error('Application: Init traces failed.');
				return false;
			}
			
			// INIT SECURITY
			if ( ! $this->initSecurity() )
			{
				Trace::error('Application: Init security failed.');
				return false;
			}
			
			// INIT SESSIONS
			// if ( ! $this->initSessions() )
			// {
				// Trace::error('Application: Init sessions failed.');
				// return;
			// }
			// $this->getSessionManager()->start();
			
			// INIT MODULES
			if ( ! $this->initModules() )
			{
				Trace::error('Application: Init modules failed.');
				return false;
			}
		}
		
		// INIT MODULES
		// if ( ! $this->initDispatcher() )
		// {
			// Trace::error('Application: Init dispatcher failed.');
			// return;
		// }
		
		// PROCESS REQUEST
		// if (self::$DEBUG_RUNNING)
		// {
			// Debug::dump('Application: process request');
		// }
		// $request = $this->getRequest();
		// $response = $this->getResponse();
		// $result = Dispatcher::dispatch($request, $response);
		
		// if (! $result)
		// {
			// TODO
		// }
		
		// if (self::$DEBUG_RUNNING)
		// {
			// if (! $result)
			// {
				// Debug::dump('Application: stops running with request failure');
			// }
			// else
			// {
				// Debug::dump('Application: stops running with request success');
			// }
		// }
		return true;
	}
}
