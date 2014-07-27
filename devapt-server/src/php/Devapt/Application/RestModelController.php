<?php
/**
 * @file        RestModelController.php
 * @brief       Restfull controller implementation for resources of type Model
 * @details     ...
 * @see			...
 * @ingroup     APPLICATION
 * @date        2014-01-18
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 */

namespace Devapt\Application;

// ZEND IMPORTS
// use Zend\Debug\Debug;

// DEVAPT IMPORTS
// use Devapt\Core\Trace;


class RestModelController extends ModelController
{
	// STATIC ATTRIBUTES
	
	
	
    /**
     * Constructor
     */
    public function __construct()
    {
		$this->has_action_attribute = false;
    }
}