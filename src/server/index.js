import runtime from '../common/base/runtime'
import { store, config } from '../common/store/index'
import Render from '../common/rendering/render'
import Component from '../common/rendering/base/component'

import RenderingPlugin from '../common/plugins/rendering_plugin'
import ServicesPlugin from '../common/plugins/services_plugin'
import ServersPlugin from '../common/plugins/servers_plugin'

import DefaultRenderingPlugin from '../plugins/default/rendering_default_plugin'
import DefaultServicesPlugin from '../plugins/default/services_default_plugin'


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


export default { runtime, config, store, Render, Component, RenderingPlugin, ServicesPlugin, ServersPlugin, DefaultRenderingPlugin, DefaultServicesPlugin }
