// COMMON IMPORTS
import T from './common/utils/types'
import RenderingBuilder from './common/rendering/rendering_builder'
import RenderingPlugin from './common/plugins/rendering_plugin'
import DefaultRenderingPlugin from './common/default_plugins/rendering_default_plugin'

// BROWSER IMPORTS
import Component from './browser/base/component'
import Container from './browser/base/container'

// SERVER IMPORTS
import runtime from './server/base/runtime'
import ServicesPlugin from './server/plugins/services_plugin'
import ServersPlugin from './server/plugins/servers_plugin'
import DefaultServicesPlugin from './server/default_plugins/services_default_plugin'


/**
 * Main public part of Devapt library
 * @name index.js
 * @license Apache-2.0
 * @auhtor Luc BORIES
 * 
 * @property {object} devapt.runtime - Runtime class instance
 * @property {object} devapt.store - Redux store instance
 * @property {object} devapt.config - configuration part of a Redux store instance
 * @property {object} devapt.logs - logging wrapper
 * @property {object} devapt.render - rendering wrapper Class (Render)
 * @property {object} devapt.Component - rendering base class (Component)
 */


export default { T, runtime, RenderingBuilder, Component, Container, RenderingPlugin, ServicesPlugin, ServersPlugin, DefaultRenderingPlugin, DefaultServicesPlugin }
