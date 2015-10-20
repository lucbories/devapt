'use strict';

var fs = require('fs'),
	ini_parser = require('ini'),
	util = require('util'),
	logs = require('../utils/logs')
	;



exports = module.exports = {
	split_all_keys: function(arg_cfg)
	{
		var self = this;
		var out_config = {};
		var value = null;
		var key = null;
		Object.keys(arg_cfg).forEach(
			function(cfg_key, cfg_index, cfg_items)
			{
				// if (cfg_index > 10) return;
				key = cfg_items[cfg_index];
				if ((typeof key) === 'string' && key.length > 0)
				{
					value = arg_cfg[key];
					
					// console.log('-----------------------------------------');
					// console.log(value, key);
					
					self.split_key(key, value, out_config);
				}
			}
		);
		
		// console.log('out_config',out_config);
		
		return out_config;
	},
	
	split_key: function(arg_key, arg_value, arg_cfg)
	{
		if ((typeof arg_key) !== 'string' || arg_key.length === 0)
		{
			return;
		}
		
		var parts = arg_key.split('.');
		if (parts.length === 1)
		{
			arg_cfg[arg_key] = arg_value;
			return;
		}
		
		var part_obj = arg_cfg;
		// console.log(parts, 'parts');
		parts.forEach(
			function(part_key, part_index, part_items)
			{
				// console.log(part_key, 'part_key');
				
				if (part_key in part_obj)
				{
					part_obj = part_obj[part_key];
					// console.log('get existing value', part_key);
				} else {
					
					if (part_index === parts.length - 1)
					{
						part_obj[part_key] = arg_value;
						// console.log('set new value', part_key);
						return;
					} else {
						part_obj = part_obj[part_key] = {};
						// console.log('set {}', part_key);
					}
				}
				
				// console.log(part_obj, 'part_obj');
			}
		);
	},
	
	
	read: function(arg_file_path_name, arg_charset)
	{
		var self = this;
		logs.info('parser', 'read [%s]', arg_file_path_name, arg_charset);
		
		if (arg_file_path_name.substr(-4).toLocaleLowerCase() === '.ini')
		{
			return self.read_ini(arg_file_path_name, arg_charset);
		}
		
		if (arg_file_path_name.substr(-5).toLocaleLowerCase() === '.json')
		{
			return self.read_json(arg_file_path_name, arg_charset);
		}
	},
	
	
	read_json: function(arg_file_path_name, arg_charset)
	{
		var self = this;
		logs.info('parser', 'read_json [%s] [%s]', arg_file_path_name, arg_charset);
		
		var config_content = require(arg_file_path_name);
		
		var out_cfg = self.split_all_keys(config_content);
		
		return out_cfg;
	},
	
	
	read_ini: function(arg_file_path_name, arg_charset)
	{
		var self = this;
		logs.info('parser', 'read_ini [%s] [%s]', arg_file_path_name, arg_charset);
		
		var config_file = fs.readFileSync(arg_file_path_name, arg_charset ? arg_charset : 'utf-8');
		var config_content = ini_parser.parse(config_file);
		// console.log(config_content, 'config_content');
		var out_cfg = self.split_all_keys(config_content);
		
		
		// var watch_listener = function(arg_prev_stats, arg_cur_stats)
		// {
		// 	logs.info('parser', 'read_ini fs.watchFile: config file on [%s] with mtime [%s] -> [%s]', arg_file_path_name, arg_prev_stats.mtime.getTime(), arg_cur_stats.mtime.getTime());
			
		// 	var watch_config_file = fs.readFileSync(arg_file_path_name, arg_charset ? arg_charset : 'utf-8');
		// 	var watch_config_content = ini_parser.parse(watch_config_file);
		// 	var watch_out_cfg = self.split_all_keys(watch_config_content);
			
		// 	// console.info('config file has changed [%s]', arg_file_path_name);
			
		// 	// LOOP ON APP OR RESOURCES CHANGES AND UPDATE RUNTIME
		// 	// ...
		// 	return;
		// }
		
		// fs.watchFile(arg_file_path_name, { persistent: true, recursive: false }, watch_listener);
		
		
		return out_cfg;
	},
	
	
	write: function(arg_file_path_name, arg_config)
	{
		var self = this;
		logs.info('parser', 'write [%s]', arg_file_path_name);
		
		if (arg_file_path_name.substr(-4).toLocaleLowerCase() === '.ini')
		{
			return self.write_ini(arg_file_path_name, arg_config);
		}
		
		if (arg_file_path_name.substr(-5).toLocaleLowerCase() === '.json')
		{
			return self.write_json(arg_file_path_name, arg_config);
		}
	},
	
	
	write_ini: function(arg_file_path_name, arg_config)
	{
		logs.info('parser', 'write_ini [%s]', arg_file_path_name);
		return fs.writeFileSync(arg_file_path_name, ini_parser.stringify(arg_config, {}));
	},
	
	
	write_json: function(arg_file_path_name, arg_config)
	{
		logs.info('parser', 'write_json [%s]', arg_file_path_name);
		return fs.writeFileSync(arg_file_path_name, JSON.stringify(arg_config));
	}
};
