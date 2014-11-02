<?php
/**
 * @file        SessionsAdapterInterface.php
 * @brief       Application sessions adapter interface
 * @details     ...
 * @see			...
 * @ingroup     APPLICATION
 * @date        2014-01-19
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Application;

// use Zend\Stdlib\RequestInterface;
// use Zend\Stdlib\ResponseInterface;

interface SessionsAdapterInterface
{
    /**
     * Start the session
     *
     * @return nothing
     */
    public function startSession();

    /**
     * Unlock the session
     *
     * @return nothing
     */
    public function unlockSession();

    /**
     * Reset the session
     *
     * @return nothing
     */
    public function resetSession();
	
    /**
     * Stop the session
     *
     * @return nothing
     */
    public function stopSession();
	
    /**
     * Get the session id
     *
     * @return string
     */
	public function getSessionId();
	
    /**
     * Set the session id
     *
	 * @param[in] arg_id session id
     * @return nothing
     */
	public function setSessionId($arg_id);
	
    /**
     * Get the session name
     *
     * @return string
     */
	public function getSessionName();
	
    /**
     * Set the session name
     *
	 * @param[in] arg_name session name
     * @return nothing
     */
	public function setSessionName($arg_name);
	
	
	
	
//	see SessionManager
	
	
	/*
	interface StorageInterface extends Traversable, ArrayAccess, Serializable, Countable
	{
		public function getRequestAccessTime();

		public function lock($key = null);
		public function isLocked($key = null);
		public function unlock($key = null);

		public function markImmutable();
		public function isImmutable();

		public function setMetadata($key, $value, $overwriteArray = false);
		public function getMetadata($key = null);

		public function clear($key = null);

		public function fromArray(array $array);
		public function toArray($metaData = false);
	}
	
	ManagerInterface
	
    public function setConfig(Config $config);
    public function getConfig();

    public function setStorage(Storage $storage);
    public function getStorage();

    public function setSaveHandler(SaveHandler $saveHandler);
    public function getSaveHandler();

    public function sessionExists();
    public function start();
    public function destroy();
    public function writeClose();

    public function setName($name);
    public function getName();

    public function setId($id);
    public function getId();
    public function regenerateId();

    public function rememberMe($ttl = null);
    public function forgetMe();
    public function expireSessionCookie();

    public function setValidatorChain(EventManagerInterface $chain);
    public function getValidatorChain();
    public function isValid();
    */
}
