
import T from 'typr'
import assert from 'assert'
import Sequelize from 'sequelize'
import epilogue from 'epilogue'

import Resource from './resource'
import runtime from './runtime'
import to_boolean from '../utils/to_boolean'



let context = 'common/base/model'


export default class Model extends Resource
{
	constructor(arg_name, arg_settings)
	{
		assert( T.isObject(arg_settings), context + ':bad settings object')
		
		super(arg_name, arg_settings, 'Model')
		
		this.is_model = true
            this.$type = 'models'
            
            this.sequelize_db = null
            this.associations = null
            this.roles = null
	}
      
      
      load()
      {
            // GET CONFIG ITEMS
            const cfg_fields = this.$settings.get('fields').toJS()
            // console.log(cfg_fields, 'cfg_fields')
            
            const cx_name = this.$settings.get('connexion')
            this.sequelize_db = runtime.resources.find_by_name(cx_name)
            assert( T.isObject(this.sequelize_db), context + ':bad db object for [' + cx_name + ']')
            
            // const driver = this.$settings.get('driver') // IGNORED, FOR CLIENT ONLY
            // const engine_name   = this.$settings.getIn(['engine', 'name']) // IGNORED, FOR CLIENT ONLY
            // const engine_source = this.$settings.getIn(['engine', 'source']) // IGNORED, FOR CLIENT ONLY
            
            const cfg_associations = this.$settings.has('associations') ? this.$settings.get('associations').toJS() : null
            // console.log(this.$settings.toJS(), 'model')
            // console.log(cfg_associations, 'cfg_associations')
            
            const role_read = this.$settings.get('role_read')
            const role_create = this.$settings.get('role_create')
            const role_update = this.$settings.get('role_update')
            const role_delete = this.$settings.get('role_delete')
            const crud_table = this.$settings.get('crud_table')
            
            const should_load_associations = false
            
            
            // SET ACCESS
            this.roles = {
                  create:role_create,
                  read:role_read,
                  update:role_update,
                  destroy:role_delete
            }
            
            
            // INCLUDES
            // this.includes = this.$settings.has('includes') ? this.$settings.get('includes').toArray() : []
            
            
            // LOAD FIELDS
            this.fields = this.load_fields(crud_table, cfg_fields)
            
            
            // LOAD SEQUELIZE MODEL
            this.load_sequelize_model()
            
            
            // LOAD ASSOCIATIONS
            this.associations = []
            let association_record = null;
            if (cfg_associations)
            {
                  Object.keys(cfg_associations).forEach(
                        function(arg_value, arg_index, arg_array)
                        {
                              association_record = cfg_associations[arg_value];
                              association_record.name = arg_value;
                              association_record.left_model = this.$name;
                              association_record.left_table = crud_table;
                              if (should_load_associations)
                              {
                                    this.load_association(association_record);
                              }
                              else
                              {
                                    this.associations.push(association_record);
                              }
                        }
                  )
            }
            
            
            // LOAD INCLUDED MODELS
            console.log(this.includes, this.$name + '.includes')
            if ( T.isArray(this.includes) )
            {
                  this.includes.forEach(
                        function(arg_value, arg_index, arg_array)
                        {
                              var loop_model = arg_array[arg_index].sequelize_model;
                              // console.log(loop_model, 'loop_model');
                              // console.log((typeof loop_model), '(typeof loop_model)');
                              if ( (typeof loop_model).toLocaleLowerCase() === 'string' )
                              {
                                    this.includes[arg_index].sequelize_model = runtime.find_by_name(loop_model).sequelize_model;
                              }
                              // console.log(this.includes[arg_index].sequelize_model, 'this.includes[arg_index].sequelize_model');
                        }
                  )
            }
            
            
            // LOAD EPILOGUE
            // this.load_epilogue()
            
            
            super.load()
      }
	
      
      load_sequelize_model()
      {
            const cx_name = this.$settings.get('connexion')
            const crud_table = this.$settings.get('crud_table')
            
            // CREATE SEQUELIZE MODEL
            const settings = {
                  timestamps: false,
                  underscored: true,
                  freezeTableName: true,
                  // charset:'utf-8',
                  tableName: crud_table
            }
            let db = runtime.resources.find_by_name(cx_name);
            assert(db, context + ':db not found for [' + cx_name + ']')
            this.sequelize_db = db.sequelize_db
            this.sequelize_model = this.sequelize_db ? this.sequelize_db.define(this.$name, this.fields, settings) : null;
      }
      
      
      load_associations()
      {
            if (! this.association)
            {
                  return
            }
            for(let asso of this.association)
            {
                  this.load_association(asso)
            }
      }
	
      
      load_association(arg_asso_cfg)
      {
            console.log(arg_asso_cfg)
            
            // GET ASSOCIATION MODE
            let mode = arg_asso_cfg.mode
            
            // GET LEFT PART
            let left_model_name = arg_asso_cfg.left_model
            let left_model_record = this
            let left_model_key = arg_asso_cfg.left_key
            assert.ok(left_model_record && left_model_record.sequelize_model, context + ':bad association left model for name [' + left_model_name + ']')
            let left_model_obj = left_model_record.sequelize_model
            
            // GET RIGHT PART
            let right_model_name = arg_asso_cfg.right_model
            let right_model_record = runtime.find_by_name(right_model_name)
            assert(right_model_record, context + ':model not found')
            let right_model_key = arg_asso_cfg.right_key
            let right_model_fields = arg_asso_cfg.right_fields
            assert.ok(right_model_record && right_model_record.sequelize_model, context + ':bad association right model for name [' + right_model_name + ']')
            let right_model_obj = right_model_record.sequelize_model
            
            // GET MANY PART
            let many_model_name = arg_asso_cfg.sequelize_model
            let many_model_obj = runtime.find_by_name(many_model_name)
            assert.ok(many_model_obj && many_model_obj.sequelize_model, context + ':bad association many model for name [' + many_model_name + ']')
            many_model_obj = many_model_obj.sequelize_model
            
            
            if (mode === 'many_to_many')
            {
                  console.log('add many_to_many with %s: left:%s right:%s', many_model_table, left_model_table, right_model_table);
                  
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
	
      
      load_fields(arg_crud_table, arg_fields_cfg)
      {
            this.info('loading fields for model')
            
            let cfg_field = null
            let cfg_name = null
            let cfg_type = null
            let cfg_label = null
            let cfg_is_editable = false
            let cfg_is_visible = true
            let cfg_sql_is_primary_key = false
            let cfg_sql_is_expression = false
            let cfg_sql_column = null
            let cfg_sql_table = null
            
            let fields = {}
            
            let field = null
            let self = this
            
            // console.log(arg_fields_cfg, 'arg_fields_cfg')
            Object.keys(arg_fields_cfg).forEach(
                  function(arg_value, arg_index, arg_array)
                  {
                        cfg_field = arg_fields_cfg[arg_value];
                        
                        cfg_name = arg_value
                        cfg_type = self.get_field_type(cfg_field.type)
                        cfg_label = cfg_field.label
                        cfg_is_editable = to_boolean(cfg_field.is_editable, false)
                        cfg_is_visible = to_boolean(cfg_field.is_visible, true)
                        cfg_sql_is_primary_key = to_boolean(cfg_field.sql_is_primary_key, false)
                        cfg_sql_is_expression = to_boolean(cfg_field.sql_is_expression, false)
                        cfg_sql_column = cfg_field.sql_column
                        cfg_sql_table = cfg_field.sql_table ? cfg_field.sql_table : arg_crud_table
                        
                        if (cfg_sql_table === arg_crud_table)
                        {
                              field = {
                                    field: cfg_sql_column ? cfg_sql_column : cfg_name,
                                    type:cfg_type,
                                    primaryKey: cfg_sql_is_primary_key,
                                    autoIncrement:cfg_sql_is_primary_key,
                                    allowNull:false
                              }
                        }
                        else
                        {
                              console.error('bad model [%s] configuration for field [%s]', this.$name, cfg_name);
                              console.log(cfg_field, context + ':cfg_field')
                              console.log(cfg_sql_table, context + ':cfg_sql_table')
                              throw Error(context + ':error bad field')
                              return
                        }
                        
                        fields[cfg_name] = field
                        // console.log(field, 'field')
                  }
            )
            
            return fields
      }
      
      
      get_epilogue_resource(arg_server, arg_route)
      {
            this.info('get epilogue resource for route [' + arg_route + ']')
            
            var epilogue_settings = {
                  model: this.sequelize_model,
                  endpoints: [arg_route + '/' + this.$name, arg_route + '/' + this.$name + '/:' + this.sequelize_model.primaryKeyAttribute],
                  include: this.includes/*,
                  search: {
                        param: 'searchOnlyUsernames',
                        operator: '$gt', // $like as default or $ne, $not, $gte, $gt, $lte, $lt, $like (default), $ilike/$iLike, $notLike, $notILike
                        attributes: [ 'username' ]
                  },
                  sort: {
                        default: '-email,username',
                        param: 'orderby',
                        attributes: [ 'username' ]
                  },
                  pagination: false // default: true with use of offset and count or page and count
            */
            }
  		
		// INITIALIZE EPILOGUE
		epilogue.initialize(
			{
				app: arg_server.server,
				sequelize: this.sequelize_db
			}
		)
            
            let epilogue_resource = epilogue.resource(epilogue_settings)
            
            return epilogue_resource
      }
      
      
      get_field_type(arg_type)
      {
            // console.info('get field type', arg_type);
            
            switch(arg_type)
            {
                  case 'Integer': return Sequelize.INTEGER;
                  case 'String': return Sequelize.STRING;
                  case 'Email': return Sequelize.STRING;
                  case 'Password': return Sequelize.STRING;
            }
            
            return Sequelize.STRING;
      }
      
      
      get_field_validate(arg_type)
      {
            // console.info('get field validate', arg_type);
            
            switch(arg_type)
            {
            case 'Email': return {isEmail:true};
            // case 'Password': return Sequelize.STRING;
            }
            
            return null;
      }

      
	export_settings()
	{
		let cfg = this.$settings.toJS()
		
		return cfg
	}
}

/*

// REGISTER A MODEL
    models[arg_model_name] = {
      database:arg_cx_name,
      name:arg_model_name,
      model:arg_model,
      roles:arg_roles,
      includes: arg_includes
    }

*/