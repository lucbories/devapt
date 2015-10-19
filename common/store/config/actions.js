import create_action_creator from '../../create_action_creator'

export const STORE_CONFIG_SET_ALL = 'STORE_CONFIG_SET_ALL';
export const STORE_CONFIG_UPDATE_VALUE = 'STORE_CONFIG_UPDATE_VALUE';
export const STORE_CONFIG_CREATE_VALUE = 'STORE_CONFIG_CREATE_VALUE';
export const STORE_CONFIG_REMOVE_VALUE = 'STORE_CONFIG_REMOVE_VALUE';


export const create_store_config_set_all = create_action_creator(STORE_CONFIG_SET_ALL, 'config');
export const create_store_config_update_value = create_action_creator(STORE_CONFIG_UPDATE_VALUE, 'path', 'value');
export const create_store_config_create_value = create_action_creator(STORE_CONFIG_CREATE_VALUE, 'path', 'value');
export const create_store_config_remove_value = create_action_creator(STORE_CONFIG_REMOVE_VALUE, 'path');

export const dispatch_store_config_set_all = arg_config => dispatch( create_store_config_set_all(arg_config) );
export const dispatch_store_config_update_value = arg_config => dispatch( create_store_config_update_value(arg_path, arg_value) );
export const dispatch_store_config_create_value = arg_config => dispatch( create_store_config_create_value(arg_path, arg_value) );
export const dispatch_store_config_remove_value = arg_config => dispatch( create_store_config_remove_value(arg_path) );
