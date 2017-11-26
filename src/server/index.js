
// COMMON IMPORTS
import RenderingPlugin from '../common/plugins/rendering_plugin'

// SERVER IMPORTS
import runtime from './base/runtime'
import ServicesPlugin from './plugins/services_plugin'
import ServersPlugin from './plugins/servers_plugin'
import DefaultServicesPlugin from './default_plugins/services_default_plugin'

// BROWSER IMPORTS
import Component        from '../browser/base/component'
import Container        from '../browser/base/container'



/**
 * Main public part of Devapt library
 * 
 * @name index.js
 * 
 * @license Apache-2.0
 * 
 * @auhtor Luc BORIES
 * 
 * @property {object} devapt.runtime - Runtime class instance
 * @property {object} devapt.store - Redux store instance
 * @property {object} devapt.config - configuration part of a Redux store instance
 * @property {object} devapt.logs - logging wrapper
 * @property {object} devapt.render - rendering wrapper Class (Render)
 * @property {object} devapt.Component - rendering base class (Component)
 */


export default { runtime, Component, Container, RenderingPlugin, ServicesPlugin, ServersPlugin, DefaultServicesPlugin }
