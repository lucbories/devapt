// SERVER IMPORTS
import runtime from './base/runtime'
import Render from './rendering/render'
import Component from './rendering/base/component'
import Container from './rendering/base/container'

import RenderingPlugin from './plugins/rendering_plugin'
import ServicesPlugin from './plugins/services_plugin'
import ServersPlugin from './plugins/servers_plugin'

import DefaultRenderingPlugin from './default_plugins/rendering_default_plugin'
import DefaultServicesPlugin from './default_plugins/services_default_plugin'



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


export default { runtime, Render, Component, Container, RenderingPlugin, ServicesPlugin, ServersPlugin, DefaultRenderingPlugin, DefaultServicesPlugin }
