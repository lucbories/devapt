<?php
/**
 * @file        AbstractResource.php
 * @brief       Base class for all resources
 * @details     ...
 * @see			...
 * @ingroup     RESOURCES
 * @date        2014-01-16
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Resources;

abstract class AbstractResource implements ResourceInterface
{
	/// @brief		resource  name (string)
	protected $resource_name	= null;
	
	/// @brief		resource  type (string)
	protected $resource_type	= null;
	
	/// @brief		resource  access role (string)
	protected $resource_access	= null;
	
	
	
	// BASE RESOURCE ATTRIBUTES
	
	/// @brief		Resource name (string) (should be unique)
	static public $RESOURCE_NAME			= 'name';
	
	/// @brief		Resource name alias (strings alias)
	static public $RESOURCE_NAME_ALIAS		= array('view_name', 'model_name');
	
	/// @brief		Resource type (string) (values: 'view', 'model', 'menu', ...)
	static public $RESOURCE_TYPE			= 'class_type';
	
	/// @brief		Resource type alias (strings array)
	static public $RESOURCE_TYPE_ALIAS		= array('type', 'resource_type');
	
	/// @brief		Resource access role (string) (should be a valid role name)
	static public $RESOURCE_ACCESS			= 'access_role';
	
	/// @brief		Resource access role alias (strings array)
	static public $RESOURCE_ACCESS_ALIAS	= array('access');
	
	
	
	/**
	 * @brief		Get resource name
	 * @param[in]	arg_record			resource values (array)
	 * @param[in]	arg_name			resource name (string)
	 * @param[in]	arg_alias_array		resource name alias (array|null)
	 * @param[in]	arg_default_value	resource default value (anything)
	 * @return		string
	 */
	public function getValueFromRecord($arg_record, $arg_name, $arg_alias_array, $arg_default_value)
	{
		// CHECK ARGS
		if ( ! is_array($arg_record) || ! is_string($arg_name) )
		{
			return $arg_default_value;
		}
		
		// RESOURCE VALUE FOUND BY NAME
		if ( array_key_exists($arg_name, $arg_record) )
		{
			return $arg_record[$arg_name];
		}
		
		// SEARCH RESOURCE VALUE BY NAME ALIAS
		foreach($arg_alias_array as $alias_name)
		{
			if ( array_key_exists($alias_name, $arg_record) )
			{
				return $arg_record[$alias_name];
			}
		}
		
		// RESOURCE VALUE NOT FOUND
		return $arg_default_value;
	}
	
	
	/**
	 * @brief		Get resource name
	 * @return		string
	 */
	public function getResourceName()
	{
		return $this->resource_name;
	}
	
	/**
	 * @brief		Set resource name
	 * @param[in]	arg_resource_name	resource name
	 * @return		nothing
	 */
	public function setResourceName($arg_resource_name)
	{
		$this->resource_name = $arg_resource_name;
	}
	
	
	
	/**
	 * @brief		Get resource type
	 * @return		string
	 */
	public function getResourceType()
	{
		return $this->resource_type;
	}
	
	/**
	 * @brief		Set resource type
	 * @param[in]	arg_resource_type	resource type
	 * @return		nothing
	 */
	public function setResourceType($arg_resource_type)
	{
		$this->resource_type = $arg_resource_type;
	}
	
	/**
	 * @brief		Get resource access role
	 * @return		string
	 */
	public function getResourceAccess()
	{
		return $this->resource_access;
	}
	
	/**
	 * @brief		Set resource access role
	 * @param[in]	arg_resource_role	role name
	 * @return		nothing
	 */
	public function setResourceAccess($arg_resource_role)
	{
		$this->resource_access = $arg_resource_role;
	}
}
