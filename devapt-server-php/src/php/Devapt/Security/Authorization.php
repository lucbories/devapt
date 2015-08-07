<?php
/**
 * @file        Authorization.php
 * @brief       Checks autorization role and permissions of a requesting object name on a RESOURCE for an ACCESS.
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

final class Authorization
{
	// STATIC ATTRIBUTES
	static public $role_adapter = null;
	static public $perm_adapter = null;
	
	
	
	// CONSTRUCTOR
	private function __construct()
	{
	}
	
	
	// SET AUTHORIZATION ADAPTER
	static public function initAuthorization($arg_role_adapter, $arg_permission_adapter)
	{
		if ($arg_role_adapter instanceof RoleAdapterInterface)
		{
			self::$role_adapter = $arg_role_adapter;
		}
		else
		{
			return false;
		}
		
		if ($arg_permission_adapter instanceof PermissionAdapterInterface)
		{
			self::$perm_adapter = $arg_permission_adapter;
		}
		else
		{
			return false;
		}
		
		return true;
	}
	
	
	
	/**
	 * @brief		Test if authorization is enabled
	 * @return		boolean
	 */
	static public function isEnabled()
	{
		return Application::getInstance()->getConfig()->getSecurityAuthorizationEnabled();
	}
	
	
	
	// ROLES METHODS
	static public function initRoleAdapter($arg_options)
	{
		return is_null(self::$role_adapter) ? false : self::$role_adapter->initRoleAdapter($arg_options);
	}
	
	static public function resetLoginRoles($arg_login)
	{
		return is_null(self::$role_adapter) ? false : self::$role_adapter->resetLoginAuthorization($arg_login);
	}
	
	static public function getLoginRoles($arg_login)
	{
		return is_null(self::$role_adapter) ? null : self::$role_adapter->getLoginRoles($arg_login);
	}
	
	static public function hasLoginRole($arg_login, $arg_role)
	{
		return is_null(self::$role_adapter) ? false : self::$role_adapter->hasLoginRole($arg_login, $arg_role);
	}
	
	static public function addLoginRole($arg_login, $arg_role)
	{
		return is_null(self::$role_adapter) ? false : self::$role_adapter->addLoginRole($arg_login, $arg_role);
	}
	
	static public function removeLoginRole($arg_login, $arg_role)
	{
		return is_null(self::$role_adapter) ? false : self::$role_adapter->removeLoginRole($arg_login, $arg_role);
	}
	
	
	static public function resetRoles()
	{
		return is_null(self::$role_adapter) ? false : self::$role_adapter->resetLoginAuthorization( Authentication::getLogin() );
	}
	
	static public function getRoles()
	{
		return is_null(self::$role_adapter) ? null : self::$role_adapter->getLoginRoles( Authentication::getLogin() );
	}
	
	static public function hasRole($arg_role)
	{
		return is_null(self::$role_adapter) ? false : self::$role_adapter->hasLoginRole( Authentication::getLogin(), $arg_role);
	}
	
	static public function addRole($arg_role)
	{
		return is_null(self::$role_adapter) ? false : self::$role_adapter->addLoginRole( Authentication::getLogin(), $arg_role);
	}
	
	static public function removeRole($arg_role)
	{
		return is_null(self::$role_adapter) ? false : self::$role_adapter->removeLoginRole( Authentication::getLogin(), $arg_role);
	}
	
	
	
	// PERMISSIONS METHODS
	static public function check($arg_resource_name, $arg_login, $arg_access)
	{
		return is_null(self::$perm_adapter) ? false : self::$perm_adapter->check($arg_resource_name, $arg_login, $arg_access);
	}
	
	static public function allow($arg_resource_name, $arg_login, $arg_access)
	{
		return is_null(self::$perm_adapter) ? false : self::$perm_adapter->allow($arg_resource_name, $arg_login, $arg_access);
	}
	
	static public function deny($arg_resource_name,  $arg_login, $arg_access)
	{
		return is_null(self::$perm_adapter) ? false : self::$perm_adapter->deny($arg_resource_name, $arg_login, $arg_access);
	}
	
	
	static public function checkLogged($arg_resource_name, $arg_access)
	{
		return is_null(self::$perm_adapter) ? false : self::$perm_adapter->checkLogged($arg_resource_name, $arg_access);
	}
	
	static public function allowLogged($arg_resource_name, $arg_access)
	{
		return is_null(self::$perm_adapter) ? false : self::$perm_adapter->allowLogged($arg_resource_name, $arg_access);
	}
	
	static public function denyLogged($arg_resource_name,  $arg_access)
	{
		return is_null(self::$perm_adapter) ? false : self::$perm_adapter->denyLogged($arg_resource_name, $arg_access);
	}
	
	
	
	// ROLES ACCESSES
	static public function getResourceAccessKey($arg_resource_name, $arg_access)
	{
		return $arg_resource_name."/".$arg_access;
	}
	
	static public function registerRoleAccess($arg_resource_name, $arg_access, $arg_role)
	{
		return is_null(self::$perm_adapter) ? false : self::$perm_adapter->registerRoleAccess($arg_resource_name, $arg_access, $arg_role);
	}
	
	static public function unregisterRoleAccess($arg_resource_name, $arg_access, $arg_role)
	{
		return is_null(self::$perm_adapter) ? false : self::$perm_adapter->unregisterRoleAccess($arg_resource_name, $arg_access, $arg_role);
	}
	
	static public function getRegisteredRoleAccess($arg_resource_name, $arg_access)
	{
		return is_null(self::$perm_adapter) ? false : self::$perm_adapter->getRegisteredRoleAccess($arg_resource_name, $arg_access);
	}
}
