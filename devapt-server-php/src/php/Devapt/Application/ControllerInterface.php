<?php
/**
 * @file        ControllerInterface.php
 * @brief       Controller interface
 * @details     ...
 * @see			...
 * @ingroup     APPLICATION
 * @date        2014-01-18
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Application;

interface ControllerInterface
{
	/**
     * Dispatch the request
     * @param[in]	arg_resource_name	resource name (string)
     * @param[in]	arg_action_name		action name (string)
     * @param[in]	arg_id				optional item id (integer|string|null)
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
     * @return		boolean
     */
	public function dispatch($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
	
	
	
	/**
     * Execute the given action on the given resource
     * @param[in]	arg_resource_name	resource name (string)
     * @param[in]	arg_action_name		action name (string)
     * @param[in]	arg_id				optional item id (integer|string|null)
     * @param[in]	arg_request			request object (RequestInterface)
     * @param[in]	arg_response		response object (ResponseInterface)
     * @return		boolean
     */
	public function doAction($arg_resource_name, $arg_action_name, $arg_id, $arg_request, $arg_response);
}
