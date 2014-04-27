<?php
/**
 * @file        PermissionAdapterInterface.php
 * @brief       Authorization Permission interface for authorization adapters.
 * @details     ...
 * @see			Authorization
 * @ingroup     SECURITY
 * @date        2014-01-16
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * // @todo		...
 */

namespace Devapt\Security;

interface PermissionAdapterInterface
{
	/**
	 * @brief		Init the permission adapter
	 * @param[in]	arg_options		init options
	 * @return		boolean
	 */
	public function initPermissionAdapter($arg_options);
	
	
	
	/**
	 * @brief		Register a permission role on the target resource for the given access
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for examples 'get_view','read'...)
	 * @param[in]	arg_role			the role name (ROLE_VIEW1_READ)
	 * @return		boolean
	 */
	public function registerRoleAccess($arg_resource_name, $arg_access, $arg_role);
	
	/**
	 * @brief		Unegister a permission role on the target resource for the given access
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for examples 'get_view','read'...)
	 * @param[in]	arg_role			the role name (ROLE_VIEW1_READ)
	 * @return		boolean
	 */
	public function unregisterRoleAccess($arg_resource_name, $arg_access, $arg_role);
	
	/**
	 * @brief		Get the permission role on the target resource for the given access
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for examples 'get_view','read'...)
	 * @return		boolean
	 */
	public function getRegisteredRoleAccess($arg_resource_name, $arg_access);
	
	
	
	/**
	 * @brief		Verify if the requesting object has the authorization for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_requesting		the source object name (for example 'user1')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function check($arg_resource_name, $arg_requesting, $arg_access);
	
	/**
	 * @brief		Allow the requesting object for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_requesting		the source object name (for example 'user1')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function allow($arg_resource_name, $arg_requesting, $arg_access);
	
	/**
	 * @brief		Deny the requesting object for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_requesting		the source object name (for example 'user1')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function deny ($arg_resource_name, $arg_requesting, $arg_access);
	
	
	
	/**
	 * @brief		Verify if the logged user has the authorization for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function checkLogged($arg_resource_name, $arg_access);
	
	/**
	 * @brief		Allow the logged user for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function allowLogged($arg_resource_name, $arg_access);
	
	/**
	 * @brief		Deny the logged user for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function denyLogged($arg_resource_name, $arg_access);
}
