<?php
/**
 * @file        ITraceable.php
 * @brief       Trace interface
 * @details     ...
 * @see			...
 * @ingroup     CORE
 * @date        2014-01-18
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

namespace Devapt\Core;


interface ITraceable
{
	/**
     * Trace the object content (see Trace class)
     *
     * @return string
     */
    public function trace();
}
