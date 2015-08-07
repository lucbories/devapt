<?php
/**
 * @file        PermissionArrayAdapter.php
 * @brief       Authorization Permission Array adapter.
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

class PermissionArrayAdapter implements PermissionAdapterInterface
{
	/// @brief Permissions array
	private $permissions_array		= array();
	
	
	
	/**
	 * @brief		Constructor
	 * @return		nothing
	 */
	public function __construct()
	{
		$this->initPermissionAdapter(null);
	}
	
	
	
	public function initPermissionAdapter($arg_options)
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return false;
		}
		
		$permissions_array = array();
		
		return true;
	}
	
	
	
	public function registerRoleAccess($arg_resource_name, $arg_access, $arg_role)
	{
		if ( is_null($arg_resource_name) || is_null($arg_access) || is_null($arg_role) )
		{
			return false;
		}
		
		$key = Authorization::getResourceAccessKey($arg_resource_name, $arg_access);
		$this->permissions_array[$key] = $arg_role;
		
		return true;
	}
	
	
	
	public function unregisterRoleAccess($arg_resource_name, $arg_access, $arg_role)
	{
		if ( is_null($arg_resource_name) || is_null($arg_access) || is_null($arg_role) )
		{
			return false;
		}
		
		$key = Authorization::getResourceAccessKey($arg_resource_name, $arg_access);
		unset($this->permissions_array[$key]);
		
		return true;
	}
	
	
	
	public function getRegisteredRoleAccess($arg_resource_name, $arg_access)
	{
		if ( is_null($arg_resource_name) || is_null($arg_access) )
		{
			return null;
		}
		
		$key = Authorization::getResourceAccessKey($arg_resource_name, $arg_access);
		
		if ( array_key_exists($key, $this->permissions_array) )
		{
			return $this->permissions_array[$key];
		}
		
		return null;
	}
	
	
	
	/**
	 * @brief		Verify if the requesting object has the authorization for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_requesting		the source object name (for example 'user1')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function check($arg_resource_name, $arg_requesting, $arg_access)
	{
		$role = $this->getRegisteredRoleAccess($arg_resource_name, $arg_access);
		if ( is_null($role) )
		{
			return false;
		}
		
		return $role === '*' ? true : Authorization::hasLoginRole($arg_requesting, $role);
	}
	
	
	
	/**
	 * @brief		Allow the requesting object for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_requesting		the source object name (for example 'user1')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function allow($arg_resource_name, $arg_requesting, $arg_access)
	{
		$this->registerRoleAccess($arg_resource_name, $arg_access, $arg_requesting);
	}
	
	
	
	/**
	 * @brief		Deny the requesting object for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_requesting		the source object name (for example 'user1')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function deny($arg_resource_name, $arg_requesting, $arg_access)
	{
		$this->unregisterRoleAccess($arg_resource_name, $arg_access, $arg_requesting);
	}
	
	
	
	/**
	 * @brief		Verify if the logged user has the authorization for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function checkLogged($arg_resource_name, $arg_access)
	{
		return $this->check($arg_resource_name, Authentication::getLogin(), $arg_access);
	}
	
	
	
	/**
	 * @brief		Allow the logged user for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function allowLogged($arg_resource_name, $arg_access)
	{
		return $this->allow($arg_resource_name, Authentication::getLogin(), $arg_access);
	}
	
	
	
	/**
	 * @brief		Deny the logged user for the given access to the target resource
	 * @param[in]	arg_resource_name	the target resource name to access (for example 'HomePage')
	 * @param[in]	arg_access			the access name (for example 'Read')
	 * @return		boolean
	 */
	public function denyLogged($arg_resource_name, $arg_access)
	{
		return $this->deny($arg_resource_name, Authentication::getLogin(), $arg_access);
	}
}
