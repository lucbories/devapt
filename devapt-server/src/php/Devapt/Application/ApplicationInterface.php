<?php
/**
 * @file        ApplicationInterface.php
 * @brief       Application interface
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

use Zend\Stdlib\RequestInterface;
use Zend\Stdlib\ResponseInterface;

interface ApplicationInterface
{
	/**
     * Get the configuration object
     *
     * @return ApplicationConfiguration
     */
    public function getConfig();
	
    /**
     * Get the session manager object
     *
     * @return SessionManager
     */
    public function getSessionManager();
	
    /**
     * Get the session manager object
     *
     * @return SessionManager
     */
    public function getSessionContainer();
	
    /**
     * Get the request object
     *
     * @return \Zend\Stdlib\RequestInterface
     */
    public function getRequest();

    /**
     * Get the response object
     *
     * @return \Zend\Stdlib\ResponseInterface
     */
    public function getResponse();
	
    /**
     * Run the application
     *
     * @return nothing
     */
    public function run();
}
