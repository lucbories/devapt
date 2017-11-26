// NPM IMPORTS
// import T from 'typr'
// import assert from 'assert'
import Sequelize from 'sequelize'

// COMMON IMPORTS
import to_boolean from '../../utils/to_boolean'


let context = 'common/data/sequelize/load_sequelize_model'



/**
 * @file Sequelize Data Adapter helper: load a model.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */


/**
 * Load Sequelize model.
 * 
 * @param {DataSequelizeAdapter} arg_adapter - data source adapter.
 * @param {TopologyRuntimeModelSchema} arg_model_schema - topology model schema.
 * 
 * @returns {Promise} - Promise(boolean)
 */
function load_model(arg_adapter, arg_model_schema)
{
	// GET SCHEMA ATTRIBUTES
	// const single_name = arg_model_schema.get_setting('single')
	const plural_name = arg_model_schema.get_setting('plural')
	
	// const datasource = arg_model_schema.get_setting('datasource')
	// const container = arg_model_schema.get_setting('container')
	
	const fields = arg_model_schema.get_setting('fields').toJS()
	const associations = arg_model_schema.has_setting('associations') ? arg_model_schema.get_setting('associations') : null
	
	const role_read = arg_model_schema.get_setting('role_read')
	const role_create = arg_model_schema.get_setting('role_create')
	const role_update = arg_model_schema.get_setting('role_update')
	const role_delete = arg_model_schema.get_setting('role_delete')
	const crud_table = arg_model_schema.get_setting('crud_table')
	
	const should_load_associations = false
	
	
	// SET ACCESS
	arg_adapter._roles = {
		create:role_create,
		read:role_read,
		update:role_update,
		destroy:role_delete
	}
	
	
	// INCLUDES
	// arg_adapter._includes = arg_adapter.$settings.has('includes') ? arg_adapter.$settings.get('includes').toArray() : []
	arg_adapter._includes[plural_name] = []
	
	
	// LOAD FIELDS
	arg_adapter._fields = load_fields(arg_adapter, crud_table, fields)
	
	
	// CREATE SEQUELIZE MODEL
	const settings = {
		timestamps: false,
		underscored: true,
		freezeTableName: true,
		// charset:'utf-8',
		tableName: crud_table
	}
	arg_adapter._sequelize_models[plural_name] = arg_adapter._sequelize_db ? arg_adapter._sequelize_db.define(plural_name, arg_adapter._fields, settings) : undefined
	
	
	// LOAD ASSOCIATIONS
	arg_adapter._associations[plural_name] = []
	let association_record = null
	if (associations)
	{
		for(let [key, arg_value] of associations)
		{
			// console.log(key, arg_value, 'association')
			
			association_record = arg_value.toJS()
			association_record.name = key
			association_record.left_model = plural_name
			association_record.left_table = crud_table
			// console.log(association_record, 'association_record')
			
			if (should_load_associations)
			{
				arg_adapter.load_association(association_record)
			}
			else
			{
				arg_adapter._associations[plural_name].push(association_record)
			}
		}
	}

	return Promise.resolve(true)
}



function load_fields(arg_adapter, arg_crud_table, arg_fields_cfg)
{
	arg_adapter.info('loading fields for model')
	
	let fields = {}
	
	let field = null
	
	// console.log(arg_fields_cfg, 'arg_fields_cfg')
	Object.keys(arg_fields_cfg).forEach(
		function(arg_value/*, arg_index, arg_array*/)
		{
			const cfg_field = arg_fields_cfg[arg_value]
			
			const cfg_name = arg_value
			const cfg_type = get_field_type(cfg_field.type)

			const cfg_auto_increment = to_boolean(cfg_field.auto_increment, false)
			const cfg_allow_null = to_boolean(cfg_field.allow_null,false)
			// const cfg_is_unique = to_boolean(cfg_field.is_unique, false)
			const cfg_is_primary_key = to_boolean(cfg_field.is_primary_key, false)
			
			// const cfg_expression = to_boolean(cfg_field.expression, false)
			const cfg_column = cfg_field.column
			const cfg_table = cfg_field.container ? cfg_field.container : arg_crud_table
			
			// cfg_label = cfg_field.label
			// cfg_is_editable = to_boolean(cfg_field.is_editable, false)
			// cfg_is_visible = to_boolean(cfg_field.is_visible, true)
			
			if (cfg_table === arg_crud_table)
			{
				field = {
					field: cfg_column ? cfg_column : cfg_name,
					type:cfg_type,
					primaryKey: cfg_is_primary_key,
					autoIncrement:cfg_auto_increment,
					allowNull:cfg_allow_null
				}
			}
			else
			{
				console.error('bad model [%s] configuration for field [%s]', arg_adapter.$name, cfg_name)
				console.log(cfg_field, context + ':cfg_field')
				console.log(cfg_table, context + ':cfg_table')
				throw Error(context + ':error bad field')
			}
			
			fields[cfg_name] = field
			// console.log(field, 'field')
		}
	)
	
	return fields
}


	
function get_field_type(arg_type)
{
	// console.info('get field type', arg_type);
	
	switch(arg_type)
	{
		case 'Integer': return Sequelize.INTEGER
		case 'String': return Sequelize.STRING
		case 'Email': return Sequelize.STRING
		case 'Password': return Sequelize.STRING
	}
	
	return Sequelize.STRING
}


/*
function get_field_validate(arg_type)
{
	// console.info('get field validate', arg_type);
	
	switch(arg_type)
	{
		case 'Email': return {isEmail:true}
		// case 'Password': return Sequelize.STRING;
	}
	
	return null
}
*/

export default load_model
