// NPM IMPORTS
// import T from 'typr'
import assert from 'assert'


let context = 'common/data/sequelize/load_sequelize_association'



/**
 * @file Sequelize Data Adapter helper: load an association between models.
 * 
 * @author Luc BORIES
 * 
 * @license Apache-2.0
 */


/**
 * Load associations between models.
 * 
 * @param {DataSequeizeAdapter} arg_adapter - data source adapter.
 * @param {object} arg_asso_cfg - association configuration.
 * 
 * @returns {Promise} - Promise(boolean)
 */
function load_association(arg_adapter, arg_asso_cfg)
{
	// console.log(arg_asso_cfg)
	
	
	// GET ASSOCIATION MODE
	let mode = arg_asso_cfg.mode
	
	
	// GET LEFT PART
	let left_model_name = arg_asso_cfg.left_model
	let left_model_record = arg_adapter
	let left_model_key = arg_asso_cfg.left_key
	assert.ok(left_model_record && left_model_record.sequelize_model, context + ':bad association left model for name [' + left_model_name + ']')
	let left_model_obj = left_model_record.sequelize_model
	
	
	// GET RIGHT PART
	let right_model_name = arg_asso_cfg.right_model
	let right_model_record = arg_adapter.get_sequelize_model(right_model_name)
	assert(right_model_record, context + ':model not found for [' + right_model_name + ']')
	assert.ok(right_model_record && right_model_record.sequelize_model, context + ':bad association right model for name [' + right_model_name + ']')
	
	let right_model_key = arg_asso_cfg.right_key
	let right_model_fields = arg_asso_cfg.right_fields
	let right_model_obj = right_model_record.sequelize_model
	
	
	// GET MANY PART
	let many_model_name = arg_asso_cfg.model
	let many_model_obj = arg_adapter.get_sequelize_model(many_model_name)
	assert.ok(many_model_obj && many_model_obj.sequelize_model, context + ':bad association many model for name [' + many_model_name + ']')
	many_model_obj = many_model_obj.sequelize_model
	
	
	if (mode === 'many_to_many')
	{
		// console.log('add many_to_many with %s: left:%s right:%s', many_model_table, left_model_table, right_model_table);
		
		// SET ASSOCIATION ON THE LEFT SIDE (QUERYABLE MODEL)
		let asso_settings_left = {
			through: {
				model:many_model_obj
			},
			as:arg_asso_cfg.name,
			foreignKey: left_model_key,
			constraints: false
		}
		left_model_record.includes.push( { model: right_model_obj, as:arg_asso_cfg.name, attributes:right_model_fields } )
		left_model_obj.belongsToMany(right_model_obj, asso_settings_left)
		
		
		// SET RIGHT ASSOCIATION
		let asso_settings_right = {
			through: {
				model:many_model_obj
			},
			foreignKey: right_model_key,
			constraints: false
		}
		right_model_obj.belongsToMany(left_model_obj, asso_settings_right)
	}
}


export default load_association
