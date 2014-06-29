<?php
/**
 * @file        Authentication.php
 * @brief       ...
 * @details     ...
 * @see			...
 * @ingroup     SECURITY
 * @date        2014-01-16
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		
 */

namespace Devapt\Security;

use Devapt\Application\Application as Application;

final class Authentication
{
	// STATIC ATTRIBUTES
	static private $authentication_adapter		= null;
	
	
	
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	private function __construct()
	{
	}
	
	
	
	/**
	 * @brief		Init the authentication adapter
	 * @param[in]	arg_adapter		adapter object
	 * @return		boolean
	 */
	static public function initAuthentication($arg_adapter)
	{
		if ($arg_adapter instanceof AuthenticationAdapterInterface)
		{
			Authentication::$authentication_adapter = $arg_adapter;
		}
		
		
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return false;
		}
		
		return true;
	}
	
	
	
	/**
	 * @brief		Test if authentication is enabled
	 * @return		boolean
	 */
	static public function isEnabled()
	{
		return Application::getInstance()->getConfig()->getSecurityAuthenticationEnabled();
	}
	
	
	
	/**
	 * @brief		Test if a user is logged
	 * @return		boolean
	 */
	static public function isLogged()
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return false;
		}
		
		// CALL ADAPTER
		if (Authentication::$authentication_adapter)
		{
			return Authentication::$authentication_adapter->isLogged();
		}
		
		return false;
	}
	
	
	
	/**
	 * @brief		Get the logged user login
	 * @return		string
	 */
	static public function getLogin()
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return null;
		}
		
		// CALL ADAPTER
		if (Authentication::$authentication_adapter)
		{
			return Authentication::$authentication_adapter->getLogin();
		}
		
		return null;
	}
	
	
	
	/**
	 * @brief		Test the authentication credentials
	 * @param[in]	arg_login		login
	 * @param[in]	arg_password	password (hashed value)
	 * @return		boolean
	 */
	static public function login($arg_login, $arg_password)
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return false;
		}
		
		// CALL ADAPTER
		if (Authentication::$authentication_adapter)
		{
			return Authentication::$authentication_adapter->login($arg_login, $arg_password);
		}
		
		return false;
	}
	
	
	
	/**
	 * @brief		Logout the logged user
	 * @return		nothing
	 */
	static public function logout()
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return false;
		}
		
		// CALL ADAPTER
		if (Authentication::$authentication_adapter)
		{
			return Authentication::$authentication_adapter->logout();
		}
		
		return false;
	}
	
	
	
	/**
	 * @brief		Get the hashed value of the given password
	 * @param[in]	arg_password	password string
	 * @return		strings			hashed value
	 */
	static public function hashPassword($arg_password)
	{
		return MD5($arg_password);
	}
}
