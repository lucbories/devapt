
import path from 'path'
import fs from 'fs'
import assert from 'assert'
import T from 'typr'

import logs from '../../server/utils/logs'
import * as parser from '../parser'


let context = 'common/loaders/load_file'
let error_msg_bad_file_name = context + ':bad file name'
let error_msg_bad_file_dir = context + ':bad file directory'
let error_msg_bad_file_path = context + ':bad file path'
let error_msg_bad_config = context + ':bad config object'


function load_file(arg_file_path_name, arg_base_dir)
{
	logs.info(context, 'loading configuration from file [%s] of directory [%s]', arg_file_path_name, arg_base_dir);
	
	// CHECK ARGS
	assert(T.isString(arg_file_path_name) && arg_file_path_name.length > 1, error_msg_bad_file_name)
	assert(T.isString(arg_base_dir) && arg_base_dir.length > 0, error_msg_bad_file_dir)
	
	// GET PATH NAME
	var config_path = path.join(arg_base_dir, arg_file_path_name);
	assert(T.isString(config_path) && config_path.length > 0, error_msg_bad_file_path)
	logs.info(context, 'loading configuration: file [%s]', config_path);
	
	// LOAD APPLICATION INI CONFIGURATION
	var config = parser.read(config_path, 'utf-8');
	assert(T.isObject(config), error_msg_bad_config)
	
	return config;
}

exports = module.export = load_file