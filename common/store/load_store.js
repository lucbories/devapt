
import path from 'path'
import fs from 'fs'
import assert from 'assert'
import T from 'typr'

import logs from '../utils/logs'
import * as default_runtime from './runtime/default_runtime'
import load_config from '../loaders/load_config'
import load_runtime from '../loaders/load_runtime'

import * as store_config_actions from './config/actions'
import store from './index'
// import * as parser from '../../server/config/config_parser'




let state = load_config({})
state = load_runtime(default_runtime)


export default state