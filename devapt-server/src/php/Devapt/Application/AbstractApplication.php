<?php
/**
 * @file        AbstractApplication.php
 * @brief       Base Application implementation for init code
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
use Devapt\Core\Trace;

// IMPORT SESSIONS
use Zend\Session\Config\StandardConfig;
use Zend\Session\SessionManager;
use Zend\Session\Container;

// IMPORT SECURITY
use Devapt\Security\DbConnexions;
use Devapt\Security\Authentication;
use Devapt\Security\AuthenticationDbAdapter;
use Devapt\Security\Authorization;
use Devapt\Security\RoleDbAdapter;
use Devapt\Security\PermissionArrayAdapter;

// IMPORT RESOURCES
use Devapt\Resources\Broker as ResourcesBroker;

abstract class AbstractApplication
{
   /**
     * Constructor
     */
    protected function __construct()
    {
    }
	
	

    /**
     * Init the application connections
     *
     * @return boolean
     */
    public function initConnections()
	{
		$connexions_file_name = $this->getConfig()->getResourcesConnexionsFile();
		
		if( is_null($connexions_file_name) )
		{
			return true;
		}
		
		if ( is_readable($connexions_file_name) )
		{
			// LOAD CONNEXIONS
			return DbConnexions::loadConnexionsFromIniFile($connexions_file_name);
		}
		else
		{
			Debug::dump('Application: Resources connexions file is not readable:'.$connexions_file_name);
		}
		
		return false;
	}
	
	

    /**
     * Init the application traces
     *
     * @return boolean
     */
    public function initTraces()
	{
		// TEST IF TRACES ARE ENABLED
		$traces_enabled = $this->getConfig()->getBooleanAttribute('application.traces.enabled', true);
		if ( ! $traces_enabled )
		{
			return true;
		}
		
		$traces_std_enabled = $this->getConfig()->getBooleanAttribute('application.traces.std.enabled', true);
		$traces_file_enabled = $this->getConfig()->getBooleanAttribute('application.traces.file.enabled', true);
		$traces_db_enabled = $this->getConfig()->getBooleanAttribute('application.traces.db.enabled', true);
		
		// INIT FILE CONFIG
		$file_path_name = null;
		if ( $traces_file_enabled )
		{
			$file_path_name = $this->getConfig()->getAttribute('application.traces.file.path', null);
			if ( is_string($file_path_name) && ! file_exists($file_path_name) )
			{
				$file_path_name = DEVAPT_APP_PRIVATE_ROOT.$file_path_name;
			}
		}
		
		// INIT DB CONFIG
		$db_config = null;
		if ( $traces_db_enabled )
		{
			$db_connexion = $this->getConfig()->getAttribute('application.traces.db.connexion', null);
			
			$db_adapter = null;
			if ( ! is_null($db_connexion) )
			{
				// TODO
				// $db_adapter = ...
			}
			
			if ( is_object($db_adapter) )
			{
				$db_table = $this->getConfig()->getAttribute('application.traces.db.table', null);
				$db_fields_timestamp = $this->getConfig()->getAttribute('application.traces.db.fields.timestamp', null);
				$db_fields_priority = $this->getConfig()->getAttribute('application.traces.db.fields.priority', null);
				$db_fields_message = $this->getConfig()->getAttribute('application.traces.db.fields.message', null);
				
				if ( is_string($db_table) )
				{
					$db_config = array();
					$db_config['adapter'] = $db_adapter;
					$db_config['table'] = $db_table;
					$db_config['fields'] = null;
					if ( is_string($db_fields_timestamp) && is_string($db_fields_timestamp) && is_string($db_fields_timestamp) )
					{
						$db_config['fields'] = array('timestamp' => $db_fields_timestamp, 'priority' => $db_fields_priority, 'message' => $db_fields_message);
					}
				}
			}
		}
		
		// INIT TRACES
		return Trace::init($traces_std_enabled, $file_path_name, $db_config);
	}
	
	

    /**
     * Init the application security
     *
     * @return boolean
     */
    public function initSecurity()
	{
		// INIT AUTHENTICATION
		if ( $this->getConfig()->getSecurityAuthenticationEnabled() )
		{
			
			// INIT AUTHENTICATION ADAPTER
			$auth_mode = $this->getConfig()->getSecurityAuthenticationMode();
			$connexion_name = $this->getConfig()->getSecurityAuthenticationConnexion();
			switch ($auth_mode)
			{
				case 'database':
					$result = Authentication::initAuthentication( new AuthenticationDbAdapter($connexion_name) );
					if ( ! $result )
					{
						Trace::warning('Application: Init database authentication failed.');
						return false;
					}
					break;
				case 'ldap':
					$result = false;
					if ( ! $result )
					{
						Trace::warning('Application: Init ldap authentication failed.');
						return false;
					}
					break;
				case 'file':
					$result = false;
					if ( ! $result )
					{
						Trace::warning('Application: Init file authentication failed.');
						return false;
					}
					break;
			}
			
			// INIT AUTHORIZATION ADAPTER
			$auth_mode = $this->getConfig()->getSecurityAuthorizationMode();
			$connexion_name = $this->getConfig()->getSecurityAuthorizationConnexion();
			switch ($auth_mode)
			{
				case 'database':
					$result = Authorization::initAuthorization( new RoleDbAdapter($connexion_name), new PermissionArrayAdapter());
					if ( ! $result )
					{
						Trace::warning('Application: Init database authorization failed.');
						return false;
					}
					break;
				case 'ldap':
					$result = false;
					if ( ! $result )
					{
						Trace::warning('Application: Init ldap authorization failed.');
						return false;
					}
					break;
				case 'file':
					$result = false;
					if ( ! $result )
					{
						Trace::warning('Application: Init file authorization failed.');
						return false;
					}
					break;
			}
			
			// AUTOLOGIN ENABLED
			if ( $this->getConfig()->getSecurityAutologinEnabled() )
			{
				// LOGIN
				$username	= Application::getInstance()->getConfig()->getSecurityAutologinLogin();
				$password	= Authentication::hashPassword( Application::getInstance()->getConfig()->getSecurityAutologinPassword() );
				$result = Authentication::login($username, $password);
				if ( ! $result )
				{
					Trace::warning('Application: Autologin failed.');
					return false;
				}
			}
		}
		
		return true;
	}
	
	

    /**
     * Init the application sessions
     *
     * @return boolean
     */
    public function initSessions()
	{
		// GET THE KIND OF SESSIONS
		$sessions_mode = $this->getConfig()->getSessionsMode();
		
		$config = null;
		switch($sessions_mode)
		{
			case 'standard' :
				/*
					GET APPLICATION CONFIGURATION IN
						application.sessions.standard.cache_expire
						application.sessions.standard.gc_maxlifetime
						application.sessions.standard.remember_me_seconds
						application.sessions.standard.use_cookies
						application.sessions.standard.cookie_domain
						application.sessions.standard.cookie_httponly
						application.sessions.standard.cookie_lifetime
						application.sessions.standard.cookie_path
						application.sessions.standard.cookie_secure
						application.sessions.standard.entropy_length
						application.sessions.standard.entropy_file
						application.sessions.standard.gc_divisor
						application.sessions.standard.gc_probability
						application.sessions.standard.hash_bits_per_character
						application.sessions.standard.name
						application.sessions.standard.save_path
				*/
				$standard_config = $this->getConfig()->getAttributesCollection('application.sessions.standard');
				
				// SESSION NAME FOR COOKIES...
				if ( ! array_key_exists('name', $standard_config) )
				{
					$standard_config['name'] = $this->getConfig()->getName();
				}
				
				// CACHED PAGES EXPIRATION IN MINUTES
				if ( ! array_key_exists('cache_expire', $standard_config) )
				{
					$standard_config['cache_expire'] = 30;
				}
				
				// NUMBER OF SECONDS BEFORE CLEARING SESSIONS DATAS
				if ( ! array_key_exists('remember_me_seconds', $standard_config) )
				{
					$standard_config['remember_me_seconds'] = 3600;
				}
				
				// ENABLED/DISABLE USE OF COOKIES
				if ( ! array_key_exists('use_cookies', $standard_config) )
				{
					$standard_config['use_cookies'] = false;
				}
				
				// UPDATE SAVE PATH
				if ( array_key_exists('save_path', $standard_config) )
				{
					$standard_config['save_path'] = DEVAPT_APP_PRIVATE_ROOT.$standard_config['save_path'];
				}
				
				// CREATE SESSIONS MANAGER
				$config = new StandardConfig();
				$config->setOptions($standard_config);
				break;
		}
		
		if ( ! is_null($config) )
		{
			$this->session_manager = new SessionManager($config);
			Container::setDefaultManager($this->session_manager);
			return true;
		}
		
		return false;
	}
	
	

    /**
     * Init the application modules
     *
     * @return boolean
     */
    public function initModules()
	{
		if ( ! $this->initModulesCollection('application.modules', DEVAPT_APP_PRIVATE_ROOT) )
		{
			Trace::error('Application: Init application.modules failed.');
			return false;
		}
		
		if ( ! $this->initModulesCollection('application.shared_modules', DEVAPT_MODULES_ROOT) )
		{
			Trace::error('Application: Init application.shared_modules failed.');
			return false;
		}
		
		return true;
	}
	
	

    /**
     * Init the application modules
     * 
	 * @param[in] arg_collection_key	modules collection key
	 * @param[in] arg_base_path			modules collection base path
     * @return boolean
     */
    public function initModulesCollection($arg_collection_key, $arg_base_path)
	{
		$modules = $this->getConfig()->getAttributesCollection($arg_collection_key);
		if ( ! is_array($modules) )
		{
			Trace::info("Application: Load modules collection [$arg_collection_key] for base path [$arg_base_path] is empty");
			return true;
		}
		
		// LOOP ON MODULES
		foreach($modules as $module_name=>$resources)
		{
			// INIT VIEWS
			if ( array_key_exists('views', $resources) )
			{
				// LOOP ON VIEWS FILES
				$views = $resources['views'];
				foreach($views as $file_name)
				{
					$file_name = $arg_base_path.$file_name;
					Trace::debug("Application: Load module [$module_name] resources view file [$file_name]");
					if ( ! is_readable($file_name) )
					{
						Trace::error("Application: Load module [$module_name] resources view file [$file_name] failed.");
						return false;
					}
					ResourcesBroker::addSearchFile($file_name);
				}
			}
			
			// INIT MENUBARS
			if ( array_key_exists('menubars', $resources) )
			{
				// LOOP ON VIEWS FILES
				$menubars = $resources['menubars'];
				foreach($menubars as $file_name)
				{
					$file_name = $arg_base_path.$file_name;
					Trace::debug("Application: Load module [$module_name] resources menubar file [$file_name]");
					if ( ! is_readable($file_name) )
					{
						Trace::error("Application: Load module [$module_name] resources menubar file [$file_name] failed.");
						return false;
					}
					ResourcesBroker::addSearchFile($file_name);
				}
			}
			
			// INIT MODELS
			if ( array_key_exists('models', $resources) )
			{
				// LOOP ON VIEWS FILES
				$models = $resources['models'];
				foreach($models as $file_name)
				{
					$file_name = $arg_base_path.$file_name;
					Trace::debug("Application: Load module [$module_name] resources model file [$file_name]");
					if ( ! is_readable($file_name) )
					{
						Trace::error("Application: Load module [$module_name] resources model file [$file_name] failed.");
						return false;
					}
					ResourcesBroker::addSearchFile($file_name);
				}
			}
		}
		
		return true;
	}
	
	

    /**
     * Init the application dispatcher
     * @return boolean
     */
    public function initDispatcher()
	{
		// REGISTER RESOURCES CONTROLLER
		// if ( ! Dispatcher::registerController('resources', new ResourcesController() ) )
		// {
			// Debug::dump('Resources controller registration failed.');
			// return false;
		// }
		
		// REGISTER MODELS CONTROLLER
		if ( ! Dispatcher::registerController('models', new ModelController() ) )
		{
			Debug::dump('Models controller registration failed.');
			return false;
		}
		
		// REGISTER VIEWS CONTROLLER
		if ( ! Dispatcher::registerController('views', new ViewController() ) )
		{
			Trace::error('Application: Views controller registration failed.');
			return false;
		}
		
		// REGISTER RESOURCES CONTROLLER
		if ( ! Dispatcher::registerController('resources', new ResourceController() ) )
		{
			Debug::dump('Resources controller registration failed.');
			return false;
		}
		
		return true;
	}
}
