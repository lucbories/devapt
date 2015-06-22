/**
 * @file        views/container/all.js
 * @desc        Load all Devapt container classes
 * @ingroup     DEVAPT_CORE
 * @date        2014-12-26
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(
['views/container/container-mixin-render-item',
'views/container/container-mixin-render-node',
'views/container/container-mixin-render-object',
'views/container/container-mixin-render-view',
'views/container/container-mixin-selectable',
'views/container/container-mixin-utils',
'views/container/container-mixin-filtered',
'views/container/container-mixin-input',
'views/container/container-mixin-get-nodes',
'views/container/mixin-input-association',
'views/container/mixin-input-simple',
'views/container/mixin-input-validate',
/*'views/container/container-mixin-model-crud',*/
'views/container/container-mixin-pagination'
],
function()
{
} );