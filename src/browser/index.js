
// COMMON IMPORTS
import es5 from '../common/utils/es5-compat'
import runtime from './runtime/client_runtime'
import RenderingDefaultPlugin from '../common/default_plugins/rendering_default_plugin'
import RenderingPlugin        from '../common/plugins/rendering_plugin'

// BROWSER IMPORTS
import Component        from '../browser/base/component'
import Container        from '../browser/base/container'


/**
 * Main public part of Devapt library on client side
 * @name index.js
 * 
 * @license Apache-2.0
 * @auhtor Luc BORIES
 */

export default { runtime, Component, Container, RenderingPlugin, RenderingDefaultPlugin }
