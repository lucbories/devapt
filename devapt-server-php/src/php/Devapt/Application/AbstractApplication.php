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
use Devapt\Resources\Logger as ResourceLogger;

abstract class AbstractApplication
{
	// STATIC ATTRIBUTES
	
	/// @brief TRACE FLAG
	static protected $TRACE_APP = false;
	
	
	
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
		$context = 'AbstractApplication::initTraces: ';
		
		// TEST IF TRACES ARE ENABLED
		$traces_enabled = $this->getConfig()->getBooleanAttribute('application.traces.enabled', true);
		if ( ! $traces_enabled )
		{
			return true;
		}
		
		
		// LOAD CONFIGS
		$traces_loggers = $this->getConfig()->getAttributesCollection('application.loggers');
		// \Zend\Debug\Debug::dump($traces_loggers, 'loggers');
		
		
		// INIT TRACE
		if (! Trace::init('default') )
		{
			\Zend\Debug\Debug::dump($context.'Trace init failed');
			return false;
		}
		
		
		// SET DEFAULT TRACE LEVEL FOR LOG WRITERS
		$default_trace_level = 'INFO';
		
		
		// LOOP ON LOGGERS
		foreach($traces_loggers as $logger_name => $logger_config)
		{
			if ($logger_name === 'enabled')
			{
				continue;
			}
			
			// \Zend\Debug\Debug::dump($logger_name, $context.'loop: logger name');
			// \Zend\Debug\Debug::dump($logger_config, $context.'loop: logger config');
			
			if ( ! Trace::has_logger($logger_name) )
			{
				if ( ! Trace::add_logger($logger_name) )
				{
					Trace::warning('Application: Init trace - add logger failed.');
					return false;
				}
			}
			
			foreach($logger_config as $appender_type => $appender_config)
			{
				$prefix = 'application.loggers.'.$logger_name.'.'.$appender_type;
				// \Zend\Debug\Debug::dump($appender_type, $context.'loop: appender type');
				
				// ENABLE REMOTE TRACES
				if ($appender_type === 'remote')
				{
					$remote = $this->getConfig()->getBooleanAttribute($prefix.'.enabled', false);
					// \Zend\Debug\Debug::dump($remote, $context.'loop: remote enabled ['.$logger_name.']');
					
					$access = $this->getConfig()->getAttribute($prefix.'.access', 'ROLE_LOGGER');
					// \Zend\Debug\Debug::dump($access, $context.'loop: remote access ['.$logger_name.']');
					
					// ENABLE LOG CONTROLLER PERMISSIONS
					if ($remote)
					{
						// REGISTER RESOURCE LOGGER
						$logger_resource_record = array();
						$logger_resource_record['name'] = $logger_name;
						$logger_resource_record['class_type'] = 'logger';
						$logger_resource_record['class_name'] = 'Logger';
						$logger_resource_record['access_role'] = $access;
						$logger = ResourcesBroker::buildResourceObjectFromRecord($logger_resource_record);
						
						// \Zend\Debug\Debug::dump($logger->getResourceName(), $context.'loop: remote logger');
						// \Zend\Debug\Debug::dump(ResourcesBroker::hasResourceObject($logger_name), $context.'loop: has logger');
						// \Zend\Debug\Debug::dump(ResourcesBroker::getResourceObject($logger_name)->getResourceName(), $context.'loop: get logger name');
					}
					
					continue;
				}
				
				// GET TRACE LEVEL
				$level = $this->getConfig()->getAttribute($prefix.'.level', $default_trace_level);
				// \Zend\Debug\Debug::dump($level, $context.'loop: appender level');
				
				// ENABLED
				$appender_is_enabled = $this->getConfig()->getBooleanAttribute($prefix.'.enabled', true);
				// \Zend\Debug\Debug::dump($appender_is_enabled, $context.'loop: appender enabled');
				if ($appender_is_enabled)
				{
					switch($appender_type)
					{
						case 'console':
						case 'std':
						{
							// CREATE APPENDER
							if ( ! Trace::add_console_appender($logger_name, $level) )
							{
								\Zend\Debug\Debug::dump('Application: Init trace - create console appender failed.');
								// Trace::warning('Application: Init trace - create console appender failed.');
								return false;
							}
							
							break;
						}
						
						case 'file':
						{
							// GET AND CHECK FILE PATH NAME
							$file_path_name = $this->getConfig()->getAttribute($prefix.'.path', null);
							if ( ! is_string($file_path_name) )
							{
								\Zend\Debug\Debug::dump('Application: Init trace - bad file appender path ['.$file_path_name.'].');
								// Trace::warning('Application: Init trace - bad file appender path ['.$file_path_name.'].');
								return false;
							}
							
							// CHECK FILE
							// TODO CHECK SECURITY FOR FILE (DIRECTORY...)
							if (! file_exists($file_path_name) )
							{
								$file_path_name = DEVAPT_APP_PRIVATE_ROOT.$file_path_name;
							}
							
							// CREATE APPENDER
							if ( ! Trace::add_file_appender($logger_name, $file_path_name, $level) )
							{
								\Zend\Debug\Debug::dump('Application: Init trace - create file appender failed.');
								// Trace::warning('Application: Init trace - create file appender failed.');
								return false;
							}
							
							break;
						}
						
						case 'db':
						{
							$db_connexion = $this->getConfig()->getAttribute($prefix.'.connexion', null);
							
							// TODO LOG DB ADAPTER
							$db_adapter = null;
							if ( ! is_null($db_connexion) )
							{
								// TODO
								// $db_adapter = ...
							}
							
							if ( is_object($db_adapter) )
							{
								$db_table = $this->getConfig()->getAttribute($prefix.'.table', null);
								$db_fields_timestamp = $this->getConfig()->getAttribute($prefix.'.fields.timestamp', null);
								$db_fields_priority = $this->getConfig()->getAttribute($prefix.'.fields.priority', null);
								$db_fields_message = $this->getConfig()->getAttribute($prefix.'.fields.message', null);
								
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
							
							// CREATE APPENDER
							if ( ! Trace::add_db_appender($logger_name, $db_config, $level) )
							{
								\Zend\Debug\Debug::dump('Application: Init trace - create db appender failed.');
								// Trace::warning('Application: Init trace - create db appender failed.');
								return false;
							}
							
							break;
						}
						
						default:
							\Zend\Debug\Debug::dump('Application: Init trace - bad appender type.');
							// Trace::warning('Application: Init trace - bad appender type.');
							return false;
					}
				}
			}
		}
		
		
		return true;
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
			case 'disabled' :
			{
				// TODO DISABLE PHPSESSID ?
				// setcookie(  
					// 'PHPSESSID',
					// 'xxx',
					// -1,
					// '',
					// '/',
					// true
				// );
				return true;
			}
			
			case 'standard' :
			{
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
		}
		
		if ( ! is_null($config) )
		{
			$this->session_manager = new SessionManager($config);
			Container::setDefaultManager($this->session_manager);
			$this->getSessionManager()->start();
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
		if ( ! $this->initModulesCollection('application.modules', DEVAPT_APP_MODULES_ROOT) )
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
			if (self::$TRACE_APP)
			{
				Trace::info("Application.initModulesCollection: Load modules collection [$arg_collection_key] for base path [$arg_base_path] is empty");
			}
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
					if (self::$TRACE_APP)
					{
						Trace::debug("Application.initModulesCollection: Load module [$module_name] resources view file [$file_name]");
					}
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
					if (self::$TRACE_APP)
					{
						Trace::debug("Application.initModulesCollection: Load module [$module_name] resources menubar file [$file_name]");
					}
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
					if (self::$TRACE_APP)
					{
						Trace::debug("Application.initModulesCollection", "Load module [$module_name] resources model file [$file_name]");
					}
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
	 * 
     * @return boolean
     */
    public function initDispatcher()
	{
		// REGISTER SECURITY CONTROLLER
		if ( ! Dispatcher::registerController('security', new SecurityController() ) )
		{
			Debug::dump('Application: Security controller registration failed.');
			return false;
		}
		
		// REGISTER MODELS CONTROLLER
		if ( ! Dispatcher::registerController('models', new ModelController() ) )
		{
			Debug::dump('Application: Models controller registration failed.');
			return false;
		}
		
		// REGISTER REST MODELS CONTROLLER
		if ( ! Dispatcher::registerController('rest', new RestModelController() ) )
		{
			Debug::dump('Application: RestModels controller registration failed.');
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
			Debug::dump('Application: Resources controller registration failed.');
			return false;
		}
		
		// REGISTER LOG CONTROLLER
		if ( ! Dispatcher::registerController('loggers', new LogController() ) )
		{
			Debug::dump('Application: Log controller registration failed.');
			return false;
		}
		
		return true;
	}
	
	
	
    /**
     * Find a resource file
     *
	 * @param[in] arg_file_path_name	file path name
     * @return nothing
     */
    public function searchResourceFile($arg_file_path_name)
	{
		$context = 'Application.searchResourceFile(file)';
		Trace::enter($context, 'search file in app modules ['.$arg_file_path_name.']', self::$TRACE_APP);
		
		
		// INIT RESOURCE FILE
		$resource_file_path_name = $arg_file_path_name;
		
		
		// GIVEN FILE EXISTS
		if ( file_exists($resource_file_path_name) )
		{
			return $resource_file_path_name;
		}
		
		// SEARCH FILE IN APP PRIVATE FILES
		$resource_file_path_name = DEVAPT_APP_PRIVATE_ROOT.$arg_file_path_name;
		if ( file_exists($resource_file_path_name) )
		{
			return Trace::leaveok($context, 'file found in app private files ['.$resource_file_path_name.']', $resource_file_path_name, self::$TRACE_APP);
		}
		
		// SEARCH FILE IN APP MODULES
		$resource_file_path_name = DEVAPT_APP_MODULES_ROOT.$arg_file_path_name;
		if ( file_exists($resource_file_path_name) )
		{
			return Trace::leaveok($context, 'file found in app modules ['.$resource_file_path_name.']', $resource_file_path_name, self::$TRACE_APP);
		}
		
		// SEARCH FILE IN SHARED MODULES
		$resource_file_path_name = DEVAPT_MODULES_ROOT.$arg_file_path_name;
		if ( file_exists($resource_file_path_name) )
		{
			return Trace::leaveok($context, 'file found in shared modules ['.$resource_file_path_name.']', $resource_file_path_name, self::$TRACE_APP);
		}
		
		
		return Trace::leaveko($context, 'file not found ['.$arg_file_path_name.']', null, self::$TRACE_APP);
	}
}
