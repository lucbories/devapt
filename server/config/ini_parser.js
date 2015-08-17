'use strict';

var fs = require('fs');
var parser = require('ini');



module.exports = {
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
				value = arg_cfg[key];
				// console.log('-----------------------------------------');
				// console.log(value, key);
				self.split_key(key, value, out_config);
			}
		);
		
		return out_config;
	},
	
	split_key: function(arg_key, arg_value, arg_cfg)
	{
		var parts = arg_key.split('.');
		if (parts.length === 1)
		{
			arg_cfg[arg_key] = arg_value;
			return;
		}
		
		var part_obj = arg_cfg;
		parts.forEach(
			function(part_key, part_index, part_items)
			{
				// console.log(part_key, 'part_key');
				
				
				if (part_key in part_obj)
				{
					part_obj = part_obj[part_key];
				} else {
					
					if (part_index === parts.length - 1)
					{
						part_obj[part_key] = arg_value;
						// console.log('set value', 'part_key');
						return;
					} else {
						part_obj = part_obj[part_key] = {};
						// console.log('set {}', 'part_key');
					}
				}
				
				// console.log(part_obj, 'part_obj');
			}
		);
	},
	
	read: function(arg_file_path_name, arg_charset)
	{
		var self = this;
		var config_file = fs.readFileSync(arg_file_path_name, arg_charset ? arg_charset : 'utf-8');
		var config_content = parser.parse(config_file);
		
		/*var out_config = {};
		var value = null;
		var key = null;
		// var parts = null;
		// var part_obj = null;
		Object.keys(config_content).forEach(
			function(cfg_key, cfg_index, cfg_items)
			{
				// if (cfg_index > 10) return;
				key = cfg_items[cfg_index];
				value = config_content[key];
				// console.log('-----------------------------------------');
				// console.log(value, key);
				self.split_key(key, value, out_config);
			}
		);*/
		
		return self.split_all_keys(config_content);
	},
	
	write: function(arg_file_path_name, arg_config)
	{
		return fs.writeFileSync(arg_file_path_name, parser.stringify(arg_config, {}));
	}
};
