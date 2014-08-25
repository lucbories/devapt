/**
 * @file        core/options.js
 * @desc        Devapt static object options features
 * @ingroup     DEVAPT_CORE
 * @date        2014-08-14
 * @version		1.0.x
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 */

define(['Devapt', 'core/traces', 'core/types', 'core/options-set'],
function(Devapt, DevaptTraces, DevaptTypes, DevaptOptions)
{
	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_simple_option(arg_class_proto, arg_option_name, arg_option_type, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {string}		arg_option_type			option type
	 * @param {anything}	arg_option_default		option default value
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_simple_option = function(arg_class_proto, arg_option_name, arg_option_type, arg_option_default, arg_option_is_required, arg_option_aliases)
	{
		var option =
			{
				name: arg_option_name,
				type: arg_option_type,
				aliases: arg_option_aliases ? arg_option_aliases : [],
				default_value: arg_option_default,
				array_separator: null,
				array_type: null,
				format: null,
				is_required: arg_option_is_required,
				childs: {}
			};
		DevaptOptions.register_option(arg_class_proto, option);
	}



	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_str_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple string option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {string}		arg_option_default		option default value
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_str_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
	{
		DevaptOptions.register_simple_option(arg_class_proto, arg_option_name, 'String', arg_option_default, arg_option_is_required, arg_option_aliases);
	}
	
	
	
	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_obj_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple object option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {object}		arg_option_default		option default value (object template)
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @param {object}		arg_object_attributes	option attributes definition
	 * @return {nothing}
	 */
	DevaptOptions.register_obj_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases, arg_object_attributes)
	{
		if ( ! DevaptTypes.is_object(arg_object_attributes) )
		{
			arg_object_attributes = null;
		}
		
		var option =
		{
			name: arg_option_name,
			type: 'Object',
			aliases: arg_option_aliases ? arg_option_aliases : [],
			default_value: arg_option_default,
			array_separator: null,
			array_type: null,
			format: null,
			is_required: arg_option_is_required,
			childs: arg_object_attributes
		};
		
		DevaptOptions.register_option(arg_class_proto, option);
	}



	/**
	 * @memberof				DevaptOptions
	 * @public
	 * @static
	 * @method					DevaptOptions.register_cb_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc					Register a simple object option
	 * @param {object}			arg_class_proto			class
	 * @param {string}			arg_option_name			option name
	 * @param {array|function}	arg_option_default		option default value
	 * @param {boolean}			arg_option_is_required	option is required flag
	 * @param {array|null}		arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_cb_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
	{
		DevaptOptions.register_simple_option(arg_class_proto, arg_option_name, 'Callback', arg_option_default, arg_option_is_required, arg_option_aliases);
	}



	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_bool_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple boolean option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {boolean}		arg_option_default		option default value
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_bool_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
	{
		DevaptOptions.register_simple_option(arg_class_proto, arg_option_name, 'Boolean', arg_option_default, arg_option_is_required, arg_option_aliases);
	}



	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_int_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple integer option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {integer}		arg_option_default		option default value
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_int_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
	{
		DevaptOptions.register_simple_option(arg_class_proto, arg_option_name, 'Integer', arg_option_default, arg_option_is_required, arg_option_aliases);
	}



	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_float_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple float option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {float}		arg_option_default		option default value
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_float_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
	{
		DevaptOptions.register_simple_option(arg_class_proto, arg_option_name, 'Float', arg_option_default, arg_option_is_required, arg_option_aliases);
	}



	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_date_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple date option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {date}		arg_option_default		option default value
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_date_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
	{
		DevaptOptions.register_simple_option(arg_class_proto, arg_option_name, 'Date', arg_option_default, arg_option_is_required, arg_option_aliases);
	}



	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_time_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple time option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {time}		arg_option_default		option default value
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_time_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
	{
		DevaptOptions.register_simple_option(arg_class_proto, arg_option_name, 'Time', arg_option_default, arg_option_is_required, arg_option_aliases);
	}



	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_datetime_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple datetime option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {datetime}	arg_option_default		option default value
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_datetime_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_option_aliases)
	{
		DevaptOptions.register_simple_option(arg_class_proto, arg_option_name, 'DateTime', arg_option_default, arg_option_is_required, arg_option_aliases);
	}
	
	
	
	/**
	 * @memberof			DevaptOptions
	 * @public
	 * @static
	 * @method				DevaptOptions.register_array_option(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required)
	 * @desc				Register a simple object option
	 * @param {object}		arg_class_proto			class
	 * @param {string}		arg_option_name			option name
	 * @param {object}		arg_option_default		option default value (object template)
	 * @param {boolean}		arg_option_is_required	option is required flag
	 * @param {object}		arg_array_separator		option array separator
	 * @param {object}		arg_array_type			option array items type
	 * @param {array|null}	arg_option_aliases		option name aliases
	 * @return {nothing}
	 */
	DevaptOptions.register_array_option = function(arg_class_proto, arg_option_name, arg_option_default, arg_option_is_required, arg_array_separator, arg_array_type, arg_option_aliases)
	{
		arg_array_separator = DevaptTypes.is_not_empty_str(arg_array_separator) ? arg_array_separator : ',';
		arg_array_type = DevaptTypes.is_not_empty_str(arg_array_type) ? arg_array_type : 'String';
		arg_option_aliases = DevaptTypes.is_array(arg_option_aliases) ? arg_option_aliases : [];
		
		var option =
		{
			name: arg_option_name,
			type: 'array',
			aliases: arg_option_aliases,
			default_value: arg_option_default,
			array_separator: arg_array_separator,
			array_type: arg_array_type,
			format: null,
			is_required: arg_option_is_required,
			childs: {}
		};
		
		DevaptOptions.register_option(arg_class_proto, option);
	}
	
	
	return DevaptOptions;
});