
import assert from 'assert'

import { is_browser, is_server } from './common/utils/is_browser'



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
 * @property {object} devapt.Render - rendering wrapper Class (Render)
 * @property {object} devapt.Component - rendering base class (Component)
 */

let api = undefined

if ( is_server() )
{
	api = require('./server/index')
}


else if ( is_browser() )
{
	api = require('./browser/index')
}

else
{
	assert('not a server and not a browser !!!')
}

// console.log(api, 'devapt/src/index:api')
// console.log(api.default.runtime, 'devapt/src/index:api.runtime')

const runtime = api.default.runtime
const config = api.default.config
const store = api.default.store
const Render = api.default.Render
const Component = api.default.Component

const RenderingPlugin = api.default.RenderingPlugin
const ServicesPlugin = api.default.ServicesPlugin
const ServersPlugin = api.default.ServersPlugin

const DefaultRenderingPlugin = api.default.DefaultRenderingPlugin
const DefaultServicesPlugin = api.default.DefaultServicesPlugin

// console.log(api.runtime, 'devapt/src/index:api.runtime')

export default {
	runtime, config, store,
	Render, Component,
	RenderingPlugin, ServicesPlugin, ServersPlugin,
	DefaultRenderingPlugin,
	DefaultServicesPlugin
}
