/**
 * @file        plugins/all.js
 * @desc        Load all Devapt worker classes
 * @ingroup     DEVAPT_PLUGINS
 * @date        2015-08-15
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

'use strict';
define(
	[
		'plugins/plugins',
		'plugins/backend-foundation5/all',
		'plugins/backend-jquery-ui/all'
	],
	function()
	{
	}
);