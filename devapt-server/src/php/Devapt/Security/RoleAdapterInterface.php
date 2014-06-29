<?php
/**
 * @file        RoleAdapterInterface.php
 * @brief       Authorization Role interface for authorization adapters.
 * @details     ...
 * @see			Authorization
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

interface RoleAdapterInterface
{
	/**
	 * @brief		Init the authorization adapter
	 * @param[in]	arg_options		init options
	 * @return		boolean
	 */
	public function initRoleAdapter($arg_options);
	
	
	
	/**
	 * @brief		Reset the logged user roles array
	 * @param[in]	arg_login	login name
	 * @return		boolean
	 */
	public function resetLoginAuthorization($arg_login);
	
	
	
	/**
	 * @brief		Get the logged user roles array
	 * @param[in]	arg_login	login name
	 * @return		array of strings
	 */
	public function getLoginRoles($arg_login);
	
	
	
	/**
	 * @brief		Test if the logged user has the given role
	 * @param[in]	arg_login	login name
	 * @param[in]	arg_role	role name
	 * @return		boolean
	 */
	public function hasLoginRole($arg_login, $arg_role);
	
	
	
	/**
	 * @brief		Add a role to the logged user roles
	 * @param[in]	arg_login	login name
	 * @param[in]	arg_role	role name
	 * @return		boolean
	 */
	public function addLoginRole($arg_login, $arg_role);
	
	
	
	/**
	 * @brief		Remove a role to the logged user roles
	 * @param[in]	arg_login	login name
	 * @param[in]	arg_role	role name
	 * @return		boolean
	 */
	public function removeLoginRole($arg_login, $arg_role);
	
	
}
