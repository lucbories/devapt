<?php
/**
 * @file        AuthenticationInterface.php
 * @brief       Authentication interface for authentication adapters.
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

interface AuthenticationAdapterInterface
{
	/**
	 * @brief		Init the authentication adapter
	 * @param[in]	arg_options		init options
	 * @return		nothing
	 */
	public function initAuthenticationAdapter($arg_options);
	
	
	
	/**
	 * @brief		Test if a user is logged
	 * @return		boolean
	 */
	public function isLogged();
	
	
	
	/**
	 * @brief		Get the logged user login
	 * @return		string
	 */
	public function getLogin();
	
	
	
	/**
	 * @brief		Test the authentication credentials
	 * @param[in]	arg_login		login
	 * @param[in]	arg_password	password (hashed value)
	 * @return		boolean
	 */
	public function login($arg_login, $arg_password);
	
	
	
	/**
	 * @brief		Logout the logged user
	 * @return		nothing
	 */
	public function logout();
	
	
	
	/**
	 * @brief		Get the hashed value of the given password
	 * @param[in]	arg_password	password string
	 * @return		strings			hashed value
	 */
	public function hashPassword($arg_password);
}
