<?php
/**
 * @file        AuthenticationDbAdapter.php
 * @brief       Authentication Database adapter.
 * @details     ...
 * @see			Authentication
 * @ingroup     SECURITY
 * @date        2014-01-16
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Security;

use Zend\Db\Adapter\Adapter as DbAdapter;
use Zend\Db\Sql\Sql;
use Zend\Authentication\AuthenticationService;
use Zend\Authentication\Adapter\DbTable as AuthDbAdapter;

class AuthenticationDbAdapter implements AuthenticationAdapterInterface
{
	private $db_adapter		= null;
	private $auth_service	= null;
	private $auth_adapter	= null;
	private $auth_token		= null;
	
	
	
	/**
	 * @brief		Constructor
	 * @param[in]	arg_connexion_name	connexion name
	 * @return		nothing
	 */
	public function __construct($arg_connexion_name)
	{
		// CHECK CONNEXION
		if ( ! DbConnexions::hasConnexion($arg_connexion_name) )
		{
			return;
		}
		
		// GET CONNEXION ARRAY
		$arg_options = array();
		$arg_options['driver']		= DbConnexions::getConnexionDriver($arg_connexion_name);
		$arg_options['hostname']	= DbConnexions::getConnexionHostname($arg_connexion_name);
		$arg_options['port']		= DbConnexions::getConnexionPort($arg_connexion_name);
		$arg_options['database']	= DbConnexions::getConnexionDatabase($arg_connexion_name);
		$arg_options['username']	= DbConnexions::getConnexionUser($arg_connexion_name);
		$arg_options['password']	= DbConnexions::getConnexionPassword($arg_connexion_name);
		$arg_options['charset']		= DbConnexions::getConnexionCharset($arg_connexion_name, '');
		
		// INIT CONNEXION
		$this->initAuthenticationAdapter($arg_options);
	}
	
	
	
	/**
	 * @brief		Init the authentication adapter
	 * @param[in]	arg_options		init options
	 * @return		nothing
	 */
	public function initAuthenticationAdapter($arg_options)
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return;
		}
		
		// INIT DB ADAPTER
		$this->db_adapter = new DbAdapter($arg_options);
		
		// INIT AUTHENTICATION ADAPTER
		$this->auth_adapter = new AuthDbAdapter(
			$this->db_adapter,
			'users',
			'login',
			'password',
			'MD5(?)'
		);
		
		// INIT AUTHENTICATION SERVICE
		$this->auth_service = new AuthenticationService();
		
		$this->auth_token = null;
	}
	
	
	
	/**
	 * @brief		Test if a user is logged
	 * @return		boolean
	 */
	public function isLogged()
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return;
		}
		
		// TEST AUTHENTICATION TOKEN
		if ($this->auth_token)
		{
			return $this->auth_token->isValid();
		}
		
		return false;
	}
	
	
	
	/**
	 * @brief		Get the logged user login
	 * @return		string
	 */
	public function getLogin()
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return null;
		}
		
		// TEST AUTHENTICATION TOKEN
		if ($this->auth_token)
		{
			return $this->auth_token->getIdentity();
		}
		
		return null;
	}
	
	
	
	/**
	 * @brief		Test the authentication credentials
	 * @param[in]	arg_login		login
	 * @param[in]	arg_password	password (hashed value)
	 * @return		boolean
	 */
	public function login($arg_login, $arg_password)
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			Trace::notice('Authentication::login: not enabled');
			return false;
		}
		
		// CHECK IF INIT IS NEEDED
		if ( is_null($this->auth_adapter) )
		{
			Trace::notice('Authentication::login: no adapter');
			return false;
		}
		
		// INIT AUTHENTICATION ADAPTER
		$this->auth_adapter
			->setIdentity($arg_login)
			->setCredential($arg_password)
			;
		
		// INIT AUTHENTICATION TOKEN
		$this->auth_token = $this->auth_service->authenticate($this->auth_adapter);
		
		// TEST AUTHENTICATION TOKEN
		if ($this->auth_token)
		{
			return $this->auth_token->isValid();
		}
		
		Trace::notice('Authentication::login: bad auth token');
		return false;
	}
	
	
	
	/**
	 * @brief		Logout the logged user
	 * @return		nothing
	 */
	public function logout()
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return;
		}
		
		// RESET LOGIN TOKEN
		if ($this->auth_token)
		{
			Authorization::resetLoginRoles( $this->auth_token->getIdentity() );
		}
		
		$this->auth_adapter->clearIdentity();
		$this->auth_token = null;
	}
	
	
	
	/**
	 * @brief		Get the hashed value of the given password
	 * @param[in]	arg_password	password string
	 * @return		strings			hashed value
	 */
	public function hashPassword($arg_password)
	{
		return MD5($arg_password);
	}
}
