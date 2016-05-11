
import runtime from './client_runtime'
import ui from './ui'

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



export default { runtime, ui }
