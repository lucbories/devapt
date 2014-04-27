<?php
/**
 * @file        Configuration.php
 * @brief       Configuration implementation
 * @details     ...
 * @see			...
 * @ingroup     CORE
 * @date        2014-01-18
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 */

namespace Devapt\Core;

use Devapt\Core\Types as Types;

class Configuration
{

    /**
     * @var array
     */
    protected $config_array = null;
	
	
	
    /**
     * Constructor
     * @param[in] arg_config_array
     */
    public function __construct($arg_config_array)
    {
        $this->config_array  = ! is_array($arg_config_array) ? array() : $arg_config_array;
    }
	
	
	
    /**
     * Get a configuration attributes collection
     * @param[in]	arg_key					attribute key
     * @return		attributes array|null
     */
    public function getAttributesCollection($arg_key)
    {
        if ( array_key_exists($arg_key, $this->config_array) )
		{
			$result = $this->config_array[$arg_key];
			if (! is_array($result) )
			{
				$result = array($result);
			}
			return $result;
		}
		
		$path = explode('.', $arg_key);
		$path_count = count($path);
		$config = $this->config_array;
		for($i = 0 ; $i < $path_count ; $i++ )
		{
			$key = $path[$i];
			if ( ! array_key_exists($key, $config) )
			{
				return null;
			}
			$config = $config[$key];
		}
		
		return $config;
    }
	
	
	
    /**
     * Get the configuration attribute
     * @param[in]	arg_key			attribute key
     * @param[in]	arg_default		default value
     * @return		attribute string
     */
    public function hasAttribute($arg_key)
    {
		if ( array_key_exists($arg_key, $this->config_array) )
		{
			return true;
		}
		
		
		$path = explode('.', $arg_key);
		$path_count = count($path);
		$config = $this->config_array;
		for($i = 0 ; $i < $path_count ; $i++ )
		{
			$key = $path[$i];
			if ( ! array_key_exists($key, $config) )
			{
				return false;
			}
			$config = $config[$key];
			if ($i == $path_count - 1)
			{
				return true;
			}
		}
		
		return false;
	}
	
	
	
    /**
     * Get the configuration attribute
     * @param[in]	arg_key			attribute key
     * @param[in]	arg_default		default value
     * @return		attribute string
     */
    public function getAttribute($arg_key, $arg_default = null)
    {
        if ( array_key_exists($arg_key, $this->config_array) )
		{
			return $this->config_array[$arg_key];
		}
		
		$path = explode('.', $arg_key);
		$path_count = count($path);
		$config = $this->config_array;
		$value = $arg_default;
		for($i = 0 ; $i < $path_count ; $i++ )
		{
			$key = $path[$i];
			if ( ! array_key_exists($key, $config) )
			{
				return $arg_default;
			}
			$config = $config[$key];
			if ($i == $path_count - 1)
			{
				$value = $config;
			}
		}
		
		return $value;
    }
	
    /**
     * Get the configuration boolean attribute
     * @param[in]	arg_key			attribute key
     * @param[in]	arg_default		default value (boolean)
     * @return		attribute boolean
     */
    public function getBooleanAttribute($arg_key, $arg_default = false)
    {
		$value = $this->getAttribute($arg_key, Types::toBoolean($arg_default));
        return Types::toBoolean($value);
    }
	
    /**
     * Set an attribute value
     * @param[in]	arg_key			attribute key
     * @param[in]	arg_value		attribute value
     * @return		nothing
     */
    public function setAttribute($arg_key, $arg_value)
    {
        return $this->config_array[$arg_key] = $arg_value;
    }
	
    /**
     * Set a boolean attribute value
     * @param[in]	arg_key			attribute key
     * @param[in]	arg_value		attribute value
     * @return		nothing
     */
    public function setBooleanAttribute($arg_key, $arg_value)
    {
        return $this->config_array[$arg_key] = Types::toBoolean($arg_value, false);
    }
}