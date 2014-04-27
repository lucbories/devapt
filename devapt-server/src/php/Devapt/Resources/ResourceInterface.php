<?php
/**
 * @file        ResourceInterface.php
 * @brief      Resource interface
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


interface ResourceInterface
{
	/**
	 * @brief		Get resource name
	 * @return		string
	 */
	public function getResourceName();
	
	/**
	 * @brief		Set resource name
	 * @param[in]	arg_resource_name	resource name
	 * @return		nothing
	 */
	public function setResourceName($arg_resource_name);
	
	/**
	 * @brief		Get resource type
	 * @return		string
	 */
	public function getResourceType();
	
	/**
	 * @brief		Set resource type
	 * @param[in]	arg_resource_type	resource type
	 * @return		nothing
	 */
	public function setResourceType($arg_resource_type);
	
	/**
	 * @brief		Get resource access role
	 * @return		string
	 */
	public function getResourceAccess();
	
	/**
	 * @brief		Set resource access role
	 * @param[in]	arg_resource_role	role name
	 * @return		nothing
	 */
	public function setResourceAccess($arg_resource_role);
}
