<?php
/**
 * @file        ApplicationConfiguration.php
 * @brief       Application configuration implementation
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

use Devapt\Core\Types as Types;
use Devapt\Core\Configuration;

class ApplicationConfiguration extends Configuration
{
	
    /**
     * Constructor
     * @param[in] arg_config_array
     */
    public function __construct($arg_config_array)
    {
		parent::__construct($arg_config_array);
    }
	
	
	
    /**
     * Get the application name
     * @return		attribute string
     */
    public function getName()
    {
        return $this->getAttribute('application.name', null);
    }
	
    /**
     * Get the application title
     * @return		attribute string
     */
    public function getTitle()
    {
        return $this->getAttribute('application.title', null);
    }
	
    /**
     * Get the application short label
     * @return		attribute string
     */
    public function getShortLabel()
    {
        return $this->getAttribute('application.short_label', null);
    }
	
    /**
     * Get the application long label
     * @return		attribute string
     */
    public function getLongLabel()
    {
        return $this->getAttribute('application.long_label', null);
    }
	
    /**
     * Get the application version
     * @return		attribute string
     */
    public function getVersion()
    {
        return $this->getAttribute('application.version', null);
    }
	
    /**
     * Get the application hostname
     * @return		attribute string
     */
    public function getHostname()
    {
        return $this->getAttribute('application.hostname', null);
    }
	
    /**
     * Get the application url base
     * @return		attribute string
     */
    public function getUrlBase()
    {
        return $this->getAttribute('application.url.base', null);
    }
	
    /**
     * Get the application url home
     * @return		attribute string
     */
    public function getUrlHome()
    {
        return $this->getAttribute('application.url.home', null);
    }
	
    /**
     * Get the application url login
     * @return		attribute string
     */
    public function getUrlLogin()
    {
        return $this->getAttribute('application.url.login', null);
    }
	
    /**
     * Get the application url logout
     * @return		attribute string
     */
    public function getUrlLogout()
    {
        return $this->getAttribute('application.url.logout', null);
    }
	
    /**
     * Get the application icone url
     * @return		attribute string
     */
    public function getFavicoUrl()
    {
        return $this->getAttribute('application.url.favico', null);
    }
	
    /**
     * Get the application icone url format
     * @return		attribute string
     */
    public function getFavicoFormat()
    {
        return $this->getAttribute('application.url.favico_format', 'image/vnd.microsoft.icon');
    }
	
	
	
    /**
     * Get the application status.env
     * @return		attribute string
     */
    public function getStatusEnv()
    {
        return $this->getAttribute('application.status.env', null);
    }
	
    /**
     * Get the application status.offline
     * @return		attribute boolean
     */
    public function getStatusOffline()
    {
        return $this->getBooleanAttribute('application.status.offline', false);
    }
	
	
	
    /**
     * Get the application locales default zone
     * @return		attribute string
     */
    public function getLocalesDefaultZone()
    {
        return $this->getAttribute('application.locales.default_zone', null);
    }
	
    /**
     * Get the application locales default charset
     * @return		attribute string
     */
    public function getLocalesDefaultCharset()
    {
        return $this->getAttribute('application.locales.default_charset', null);
    }
	
    /**
     * Get the application locales html language
     * @return		attribute string
     */
    public function getLocalesHtmlLanguage()
    {
        return $this->getAttribute('application.locales.html_language', 'en');
    }
	
    /**
     * Get the application locales html charset
     * @return		attribute string
     */
    public function getLocalesHtmlCharset()
    {
        return $this->getAttribute('application.locales.html_charset', 'utf-8');
    }
	
	
	
    /**
     * Get the application contact author
     * @return		attribute string
     */
    public function getContactAuthor()
    {
        return $this->getAttribute('application.contact.author', null);
    }
	
    /**
     * Get the application contact email
     * @return		attribute string
     */
    public function getContactEmail()
    {
        return $this->getAttribute('application.contact.email', null);
    }
	
	
	
    /**
     * Get the application resources connexions
     * @return		attribute string
     */
    public function getResourcesConnexionsFile()
    {
        $value = $this->getAttribute('application.resources.connexions.file', null);
		return is_string($value) ? DEVAPT_APP_PRIVATE_ROOT.$value : null;
    }
	
	
	
    /**
     * Get the application sessions mode
     * @return		attribute string
     */
    public function getSessionsMode()
    {
        $value = $this->getAttribute('application.sessions.mode', null);
		return is_string($value) ? $value : 'standard';
    }
	
	
	
    /**
     * Get the application security is_readonly
     * @return		attribute boolean
     */
    public function getSecurityIsReadOnly()
    {
        return $this->getBooleanAttribute('application.security.is_readonly', null);
    }
	
	
	
    /**
     * Get the application security authentication is enabled
     * @return		attribute boolean
     */
    public function getSecurityAuthenticationEnabled()
    {
        return $this->getBooleanAttribute('application.security.authentication.enabled', true);
    }
	
    /**
     * Get the application security authentication expiration (in minutes)
     * @return		attribute integer (default 4h=4*60=240)
     */
    public function getSecurityAuthenticationExpirationInMinutes()
    {
        return $this->getAttribute('application.security.authentication.expiration', 240);
    }
	
    /**
     * Get the application security authentication secret
     * @return		attribute string (default non empty string)
     */
    public function getSecurityAuthenticationSecret()
    {
        return $this->getBooleanAttribute('application.security.authentication.secret', 'nu"hfhfz58875448é",;v;veTRFDHDJjejr');
    }
	
    /**
     * Get the application security authentication mode
     * @return		attribute string (database, file, ldap)
     */
    public function getSecurityAuthenticationMode()
    {
        return $this->getAttribute('application.security.authentication.mode', 'database');
    }
	
    /**
     * Get the application security authentication connexion name
     * @return		attribute string
     */
    public function getSecurityAuthenticationConnexion()
    {
        return $this->getAttribute('application.security.authentication.connexion', null);
    }
	
	
	
    /**
     * Get the application security authorization is enabled
     * @return		attribute boolean
     */
    public function getSecurityAuthorizationEnabled()
    {
        return $this->getBooleanAttribute('application.security.authorization.enabled', true);
    }
	
    /**
     * Get the application security authorization mode
     * @return		attribute string (database, file, ldap)
     */
    public function getSecurityAuthorizationMode()
    {
        return $this->getAttribute('application.security.authorization.mode', 'database');
    }
	
    /**
     * Get the application security authorization connexion name
     * @return		attribute string
     */
    public function getSecurityAuthorizationConnexion()
    {
        return $this->getAttribute('application.security.authorization.connexion', null);
    }
	
	
	
    /**
     * Get the application security autologin is enabled
     * @return		attribute boolean
     */
    public function getSecurityAutologinEnabled()
    {
        return $this->getBooleanAttribute('application.security.autologin.enabled', null);
    }
	
    /**
     * Get the application security autologin login
     * @return		attribute string
     */
    public function getSecurityAutologinLogin()
    {
        return $this->getAttribute('application.security.autologin.login', null);
    }
	
    /**
     * Get the application security autologin password
     * @return		attribute string
     */
    public function getSecurityAutologinPassword()
    {
        return $this->getAttribute('application.security.autologin.password', null);
    }

}
