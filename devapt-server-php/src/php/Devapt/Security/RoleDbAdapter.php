<?php
/**
 * @file        RoleDbAdapter.php
 * @brief       Authorization Role Database adapter.
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

use Zend\Db\Adapter\Adapter as DbAdapter;
use Zend\Db\Sql\Sql;

class RoleDbAdapter implements RoleAdapterInterface
{
	private $db_adapter		= null;
	private $login_roles	= null;
	
	
	
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
		$this->initRoleAdapter($arg_options);
	}
	
	
	
	/**
	 * @brief		Init the authorization adapter
	 * @param[in]	arg_options		init options
	 * @return		boolean
	 */
	public function initRoleAdapter($arg_options)
	{
		$this->login_roles = null;
		
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return false;
		}
		
		// INIT DB ADAPTER
		$this->db_adapter = new DbAdapter($arg_options);
		
		return true;
	}
	
	
	
	/**
	 * @brief		Reset the logged user roles array
	 * @param[in]	arg_login	login name
	 * @return		boolean
	 */
	public function resetLoginAuthorization($arg_login)
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return;
		}
		
		if ( is_array($this->login_roles) && is_array($this->login_roles[$arg_login]) )
		{
			$this->login_roles[$arg_login] = null;
		}
	}
	
	
	
	/**
	 * @brief		Get the logged user roles array
	 * @param[in]	arg_login	login name
	 * @return		array of strings
	 */
	public function getLoginRoles($arg_login)
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return null;
		}
		
		// TEST ROLES CACHE
		if ( is_array($this->login_roles) && is_array($this->login_roles[$arg_login]) )
		{
			return $this->login_roles[$arg_login];
		}
		
		// INIT ROLES ARRAY
		if ( ! is_array($this->login_roles) )
		{
			$this->login_roles = array();
		}
		$this->login_roles[$arg_login] = array();
		
		// GET LOGIN ROLES
		if ( ! $this->db_adapter )
		{
			return null;
		}
		
		$sql = new Sql($this->db_adapter);
		$select = $sql->select();
		$select->columns( array(), true);
		$select->from('users_roles');
		$select->where( array('login' => $arg_login) );
		$select->join('users', 'users.id_user = users_roles.id_user', array('login'), $select::JOIN_INNER);
		$select->join('roles', 'roles.id_role = users_roles.id_role', array('label'), $select::JOIN_INNER);
		$select->order('label ASC');
		$select->limit(1000);
		$roles_statement = $sql->prepareStatementForSqlObject($select);
		$roles_results = $roles_statement->execute();
		
		// SAVE LOGIN ROLES
		while( $roles_results->current() )
		{
			// GET ROLE RECORD
			$role_record = $roles_results->current();
			// var_dump($role_record);
			
			// GET ROLE LABEL
			$role = $role_record['label'];
			// var_dump($role);
			
			// REGISTER ROLE
			$this->login_roles[$arg_login][$role] = $role;
			
			// MOVE TO NEXT ROLE
			$roles_results->next();
		}
		
		return $this->login_roles[$arg_login];
	}
	
	
	
	/**
	 * @brief		Test if the logged user has the given role
	 * @param[in]	arg_login	login name
	 * @param[in]	arg_role	role name
	 * @return		boolean
	 */
	public function hasLoginRole($arg_login, $arg_role)
	{
		// CHECK IF AUTHENTICATION IS ENABLED
		if ( ! Authentication::isEnabled() )
		{
			return false;
		}
		
		// TEST ROLES CACHE
		if ( is_array($this->login_roles) && is_array($this->login_roles[$arg_login]) )
		{
			return array_key_exists($arg_role, $this->login_roles[$arg_login]);
		}
		
		// GET LOGIN ROLES
		$roles = $this->getLoginRoles($arg_login);
		if ( ! is_array($roles) )
		{
			return false;
		}
		
		return array_key_exists($arg_role, $roles);
	}
	
	
	
	/**
	 * @brief		Add a role to the logged user roles
	 * @param[in]	arg_login	login name
	 * @param[in]	arg_role	role name
	 * @return		boolean
	 */
	public function addLoginRole($arg_login, $arg_role)
	{
		if ( ! $this->db_adapter )
		{
			return false;
		}
		
		$sql = new Sql($this->db_adapter);
		
		$insert = $sql->insert();
		$insert->columns('id_user', 'id_role');
		$insert->from('users_roles');
		$insert->where( array('login' => $arg_login, 'label' => arg_role) );
		$insert->join('users', 'users.id_user = users_roles.id_user', 'login', $select::JOIN_INNER);
		$insert->join('roles', 'roles.id_role = users_roles.id_role', 'label', $select::JOIN_INNER);
		$sql->query($insert);
		
		return true;
	}
	
	
	
	/**
	 * @brief		Remove a role to the logged user roles
	 * @param[in]	arg_login	login name
	 * @param[in]	arg_role	role name
	 * @return		boolean
	 */
	public function removeLoginRole($arg_login, $arg_role)
	{
		if ( ! $this->db_adapter )
		{
			return false;
		}
		
		$sql = new Sql($this->db_adapter);
		
		$delete = $sql->delete();
		$delete->from('users_roles');
		$delete->where( array('login' => $arg_login, 'label' => arg_role) );
		$delete->join('users', 'users.id_user = users_roles.id_user', 'login', $select::JOIN_INNER);
		$delete->join('roles', 'roles.id_role = users_roles.id_role', 'label', $select::JOIN_INNER);
		$sql->query($delete);
		
		return true;
	}
}
