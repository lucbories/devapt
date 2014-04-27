<?php
/**
 * @file        Model.php
 * @brief       Model resource class
 * @details     ...
 * @see			...
 * @ingroup     RESOURCES
 * @date        2014-01-16
 * @version		1.0.0
 * @author      Luc BORIES
 * @copyright	Copyright (C) 2011 Luc BORIES All rights reserved.
 * @license		Apache License Version 2.0, January 2004; see LICENSE.txt or http://www.apache.org/licenses/
 * 
 * //@todo		...
 */

 /*	EXAMPLE :
 [MODEL_CALENDARS_REF_ACTIVITIES]
class_type                    = model
class_name                    = MySqlModel
connexion_name                = cx_demo_db
role_read                     = ROLE_AUTH_USERS_READ
role_create                   = ROLE_AUTH_USERS_CREATE
role_update                   = ROLE_AUTH_USERS_UPDATE
role_delete                   = ROLE_AUTH_USERS_DELETE
crud_table                    = calendars_ref_activities

[MODEL_CALENDARS_REF_ACTIVITIES_ID]
class_type                    = model
class_name                    = 
model_name                    = MODEL_CALENDARS_REF_ACTIVITIES
source                        = SQL
name                          = id
type                          = Integer
default                       = 
label                         = Activity id
isEditable                    = 0
isVisible                     = 0
sql_column                    = id_calendars_ref_activity
sql_alias                     = id
sql_is_primary_key            = 1
sql_is_expression             = 0
...

OR

application.models.MODEL_CALENDARS_REF_ACTIVITIES.driver=MYSQL/MYSQLI/PDO_MYSQL/MySqlModel/MySqlIModel (alias: class_name)
application.models.MODEL_CALENDARS_REF_ACTIVITIES.connexion=cx_demo_db
application.models.MODEL_CALENDARS_REF_ACTIVITIES.role_read=ROLE_AUTH_USERS_READ
application.models.MODEL_CALENDARS_REF_ACTIVITIES.role_create=ROLE_AUTH_USERS_CREATE
application.models.MODEL_CALENDARS_REF_ACTIVITIES.role_update=ROLE_AUTH_USERS_UPDATE
application.models.MODEL_CALENDARS_REF_ACTIVITIES.role_delete=ROLE_AUTH_USERS_DELETE
application.models.MODEL_CALENDARS_REF_ACTIVITIES.crud_table=calendars_ref_activities

application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.type=Integer
application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.label=Activity id
application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.default=
application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.format=
application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.is_editable=false (alias isEditable)
application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.is_visible=false (alias isVisible)
application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.sql_column=id_calendars_ref_activity
application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.sql_alias=id
application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.sql_is_primary_key=true
application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID.sql_is_expression=false
...

OR

[application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields]
MODEL_ACTIVITIES_ID.type=Integer
MODEL_ACTIVITIES_ID.label=Activity id
MODEL_ACTIVITIES_ID.default=
MODEL_ACTIVITIES_ID.format=
...

[application.models.MODEL_CALENDARS_REF_ACTIVITIES.fields.MODEL_ACTIVITIES_ID]
type=Integer
label=Activity id
default=
format=
...


 */
namespace Devapt\Resources;

use Zend\Db\Adapter\Adapter as DbAdapter;

use \Devapt\Core\Trace;
use \Devapt\Security\DbConnexions;
use \Devapt\Models\SqlQuery;

class Model extends AbstractResource
{
	// ALL MODEL ATTRIBUTES
	
	/// @brief	Model driver name (string) (should be in 'PdoMysql', 'Mysqli'...)
	protected $model_driver			= null;
	
	/// @brief	Model access role for read (string) (should be a valid role name)
	protected $model_access_read	= null;
	
	/// @brief	Model access role for create (string) (should be a valid role name)
	protected $model_access_create	= null;
	
	/// @brief	Model access role for update (string) (should be a valid role name)
	protected $model_access_update	= null;
	
	/// @brief	Model access role for delete (string) (should be a valid role name)
	protected $model_access_delete	= null;
	
	/// @brief	Model CRUD main table name (string) (should be a valid table name)
	protected $model_crud_table		= null;
	
	/// @brief	Model connexion name (string) (should be a valid connexion resource name)
	protected $model_connexion		= null;
	
	/// @brief	Model joins records (array)
	protected $model_joins			= null;
	
	/// @brief	Model fields records (array)
	protected $model_fields			= null;
	
	/// @brief	Model Db adapter (object)
	protected $db_adapter			= null;
	
	
	
	// MODEL RESOURCE ATTRIBUTES
	
	/// @brief	Model driver name (string) (should be in 'PdoMysql', 'Mysqli'...)
	static public $MODEL_DRIVER				= 'driver';
	
	/// @brief	Model driver name (strings array)
	static public $MODEL_DRIVER_ALIAS		= array('class_name');
	
	
	/// @brief	Model access role for read (string) (should be a valid role name)
	static public $MODEL_ACCESS_ROLE_READ	= 'role_read';
	
	/// @brief	Model access role for create (string) (should be a valid role name)
	static public $MODEL_ACCESS_ROLE_CREATE	= 'role_create';
	
	/// @brief	Model access role for update (string) (should be a valid role name)
	static public $MODEL_ACCESS_ROLE_UPDATE	= 'role_update';
	
	/// @brief	Model access role for delete (string) (should be a valid role name)
	static public $MODEL_ACCESS_ROLE_DELETE	= 'role_delete';
	
	
	/// @brief	Model CRUD main table name (string) (should be a valid table name)
	static public $MODEL_CRUD_TABLE			= 'crud_table';
	
	/// @brief	Model CRUD main table name (strings array)
	static public $MODEL_CRUD_TABLE_ALIAS	= array('table');
	
	
	/// @brief	Model connexion name (string) (should be a valid connexion resource name)
	static public $MODEL_CONNEXION			= 'connexion';
	
	/// @brief	Model connexion name alias (strings array)
	static public $MODEL_CONNEXION_ALIAS	= array('connexion_name');
	
	
	/// @brief	Model joins records (array)
	static public $MODEL_JOINS			= 'joins';
	
	/// @brief	Model joins records alias (strings array)
	static public $MODEL_JOINS_ALIAS	= array('model_joins');
	
	
	/// @brief	Model fields records (array)
	static public $MODEL_FIELDS			= 'fields';
	
	/// @brief	Model fields records alias (strings array)
	static public $MODEL_FIELDS_ALIAS	= array('model_fields');
	
	
	/// @brief	Model required attributes (array of strings)
	static public $attributes_required_list	= array('name', 'driver');
	
	
	
	/**
	 * @brief		Constructor
	 $ @param[in]	arg_resource_record	resource record
	 * @return		nothing
	 */
	public function __construct($arg_resource_record)
	{
		// SET BASE RESOURCE ATTRIBUTES
		$this->setResourceName( $this->getValueFromRecord($arg_resource_record, AbstractResource::$RESOURCE_NAME, AbstractResource::$RESOURCE_NAME_ALIAS, null) );
		$this->setResourceType( $this->getValueFromRecord($arg_resource_record, AbstractResource::$RESOURCE_TYPE, AbstractResource::$RESOURCE_TYPE_ALIAS, null) );
		
		
		// REGISTER ACCESSES
		$this->setModelAccessRead	( $this->getValueFromRecord($arg_resource_record, self::$MODEL_ACCESS_ROLE_READ,	null, null) );
		$this->setModelAccessCreate	( $this->getValueFromRecord($arg_resource_record, self::$MODEL_ACCESS_ROLE_CREATE,	null, null) );
		$this->setModelAccessUpdate	( $this->getValueFromRecord($arg_resource_record, self::$MODEL_ACCESS_ROLE_UPDATE,	null, null) );
		$this->setModelAccessDelete	( $this->getValueFromRecord($arg_resource_record, self::$MODEL_ACCESS_ROLE_DELETE,	null, null) );
		$this->setResourceAccess( $this->getModelAccessRead() );
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), 'read', $this->getModelAccessRead() );
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), 'create', $this->getModelAccessCreate() );
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), 'update', $this->getModelAccessUpdate() );
		\Devapt\Security\Authorization::registerRoleAccess($this->getResourceName(), 'delete', $this->getModelAccessDelete() );
		
		
		// SET MODEL RESOURCE ATTRIBUTES
		$this->setModelDriverName		( $this->getValueFromRecord($arg_resource_record, self::$MODEL_DRIVER,		self::$MODEL_DRIVER_ALIAS,		null, null) );
		$this->setModelCrudTableName	( $this->getValueFromRecord($arg_resource_record, self::$MODEL_CRUD_TABLE,	self::$MODEL_CRUD_TABLE_ALIAS,	null, null) );
		$this->setModelConnexionName	( $this->getValueFromRecord($arg_resource_record, self::$MODEL_CONNEXION,	self::$MODEL_CONNEXION_ALIAS,	null, null) );
		
		
		// SET JOINS RECORDS
		$this->setModelJoinsRecords( $this->getValueFromRecord($arg_resource_record, self::$MODEL_JOINS, self::$MODEL_JOINS_ALIAS, null) );
		
		
		// SET FIELDS RECORDS
		$this->setModelFieldsRecords( $this->getValueFromRecord($arg_resource_record, self::$MODEL_FIELDS, self::$MODEL_FIELDS_ALIAS, null) );
	}
	
	
	
	/**
	 * @brief		Get model access create
	 * @return		string
	 */
	public function getModelAccessCreate()
	{
		return $this->model_access_create;
	}
	
	/**
	 * @brief		Set model access create
	 * @param[in]	arg_role_name	role name
	 * @return		nothing
	 */
	public function setModelAccessCreate($arg_role_name)
	{
		$this->model_access_create = $arg_role_name;
	}
	
	
	
	/**
	 * @brief		Get model access read
	 * @return		string
	 */
	public function getModelAccessRead()
	{
		return $this->model_access_read;
	}
	
	/**
	 * @brief		Set model access read
	 * @param[in]	arg_role_name	role name
	 * @return		nothing
	 */
	public function setModelAccessRead($arg_role_name)
	{
		$this->model_access_read = $arg_role_name;
	}
	
	
	
	/**
	 * @brief		Get model access update
	 * @return		string
	 */
	public function getModelAccessUpdate()
	{
		return $this->model_access_update;
	}
	
	/**
	 * @brief		Set model access update
	 * @param[in]	arg_role_name	role name
	 * @return		nothing
	 */
	public function setModelAccessUpdate($arg_role_name)
	{
		$this->model_access_update = $arg_role_name;
	}
	
	
	
	/**
	 * @brief		Get model access delete
	 * @return		string
	 */
	public function getModelAccessDelete()
	{
		return $this->model_access_delete;
	}
	
	/**
	 * @brief		Set model access delete
	 * @param[in]	arg_role_name	role name
	 * @return		nothing
	 */
	public function setModelAccessDelete($arg_role_name)
	{
		$this->model_access_delete = $arg_role_name;
	}
	
	
	
	/**
	 * @brief		Get model driver name
	 * @return		string
	 */
	public function getModelDriverName()
	{
		return $this->model_driver;
	}
	
	/**
	 * @brief		Set model driver name
	 * @param[in]	arg_driver	 driver name
	 * @return		nothing
	 */
	public function setModelDriverName($arg_driver_name)
	{
		$this->model_driver = $arg_driver_name;
	}
	
	
	
	/**
	 * @brief		Get model crud table name
	 * @return		string
	 */
	public function getModelCrudTableName()
	{
		return $this->model_crud_table;
	}
	
	/**
	 * @brief		Set model crud table name
	 * @param[in]	arg_crud_table	crud table name
	 * @return		nothing
	 */
	public function setModelCrudTableName($arg_crud_table_name)
	{
		$this->model_crud_table = $arg_crud_table_name;
	}
	
	
	
	/**
	 * @brief		Get model connexion name
	 * @return		string
	 */
	public function getModelConnexionName()
	{
		return $this->model_connexion;
	}
	
	/**
	 * @brief		Set model connexion name
	 * @param[in]	arg_connexion_name		connexion name
	 * @return		nothing
	 */
	public function setModelConnexionName($arg_connexion_name)
	{
		$this->model_connexion = $arg_connexion_name;
	}
	
	
	
	/**
	 * @brief		Get model joins records
	 * @return		array
	 */
	public function getModelJoinsRecords()
	{
		return $this->model_joins;
	}
	
	/**
	 * @brief		Set model joins records
	 * @param[in]	arg_joins_array		joins records (array)
	 * @return		nothing
	 */
	public function setModelJoinsRecords($arg_joins_array)
	{
		$this->model_joins = $arg_joins_array;
	}
	
	
	
	/**
	 * @brief		Get model fields records
	 * @return		array
	 */
	public function getModelFieldsRecords()
	{
		return $this->model_fields;
	}
	
	/**
	 * @brief		Set model fields records
	 * @param[in]	arg_fields_array		fields records (array)
	 * @return		nothing
	 */
	public function setModelFieldsRecords($arg_fields_array)
	{
		// CHECK ARGS
		if ( ! is_array($arg_fields_array) )
		{
			return;
		}
		
		// GET CONNEXION DB
		$default_db = DbConnexions::getConnexionDatabase($this->model_connexion);
		
		// LOOP ON FIELDS
		foreach($arg_fields_array as $field_name => $field_record)
		{
			// CHECK FIELD RECORD
			if ( ! $this->isValidRecordItem($field_record, 'type', 'string', true, false) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "type" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'position', 'integer', false, false) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "position" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'label', 'string', true, false) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "label" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'format', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "format" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'default', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "default" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'is_editable', 'boolean', true, false) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "is_editable" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'is_visible', 'boolean', true, false) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "is_visible" for field ['.$field_name.']');
				return;
			}
			
			if ( ! $this->isValidRecordItem($field_record, 'sql_db', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_db" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'sql_table', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_table" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'sql_column', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_column" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'sql_alias', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_alias" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'sql_is_primary_key', 'boolean', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_is_primary_key" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'sql_is_expression', 'boolean', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_is_expression" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'sql_foreign_db', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_foreign_db" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'sql_foreign_key', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_foreign_key" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'sql_foreign_column', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_foreign_column" for field ['.$field_name.']');
				return;
			}
			if ( ! $this->isValidRecordItem($field_record, 'sql_foreign_table', 'string', false, true) )
			{
				Trace::warning('Model.setModelFieldsRecords: bad item "sql_foreign_table" for field ['.$field_name.']');
				return;
			}
			
			// SET FOREIGN LINK FLAG
			$field_record['has_foreign_link'] = $this->getFieldHasForeignLink($field_record);
			
			// FILL NAM
			if ( ! array_key_exists('name', $field_record) || $field_record['name'] !== $field_name )
			{
				$field_record['name'] = $field_name;
			}
			
			// FILL DB
			if ( ! array_key_exists('sql_db', $field_record) )
			{
				$field_record['sql_db'] = $default_db;
			}
			
			// FILL TABLE
			if ( ! array_key_exists('sql_table', $field_record) )
			{
				$field_record['sql_table'] = $this->getModelCrudTableName();
			}
			
			// FILL COLUMN
			if ( ! array_key_exists('sql_column', $field_record) )
			{
				$field_record['sql_column'] = $field_record['name'];
			}
			
			// FILL COLUMN ALIAS
			if ( ! array_key_exists('sql_alias', $field_record) )
			{
				$field_record['sql_alias'] = $field_record['sql_column'];
			}
			
			// FILL FOREIGN DB
			if ( $field_record['has_foreign_link'] && ! array_key_exists('sql_foreign_db', $field_record) )
			{
				$field_record['sql_foreign_db'] = $field_record['sql_db'];
			}
			
			// FILL FOREIGN TABLE ALIAS
			if ( array_key_exists('sql_foreign_table', $field_record) )
			{
				$field_record['sql_foreign_table_alias'] = $field_record['sql_foreign_table'].'_'.$field_name;
			}
			
			// FILL IS EXPRESSION
			if ( ! array_key_exists('sql_is_expression', $field_record) )
			{
				$field_record['sql_is_expression'] = false;
			}
			
			// FILL IS PRIMARY KEY
			if ( ! array_key_exists('sql_is_primary_key', $field_record) )
			{
				$field_record['sql_is_primary_key'] = false;
			}
			
			// REGISTER FIELD RECORD
			$this->model_fields[$field_name] = $field_record;
		}
	}
	
	
	/**
	 * @brief		Field has foreign link
	 * @param[in]	arg_record			record (array)
	 * @return		boolean
	 */
	public function getFieldHasForeignLink($arg_record)
	{
		// CHECK ARGS
		if ( ! is_array($arg_record) )
		{
			Trace::warning('Model.getFieldHasForeignLink: bad record array');
			return false;
		}
		
		return array_key_exists('sql_foreign_key', $arg_record) && array_key_exists('sql_foreign_column', $arg_record) && array_key_exists('sql_foreign_table', $arg_record)
			&& is_string( $arg_record['sql_foreign_key'] ) && is_string( $arg_record['sql_foreign_column'] ) && is_string( $arg_record['sql_foreign_table'] );
	}
	
	
	/**
	 * @brief		Check a record item
	 * @param[in]	arg_record			record (array)
	 * @param[in]	arg_name			record item name (string)
	 * @param[in]	arg_type			record item type (string)
	 * @param[in]	arg_is_required		record item is required (boolean)
	 * @param[in]	arg_can_empty		record item can be empty (boolean)
	 * @return		boolean
	 */
	public function isValidRecordItem($arg_record, $arg_name, $arg_type, $arg_is_required, $arg_can_empty)
	{
		// CHECK ARGS
		if ( ! is_array($arg_record) )
		{
			Trace::warning('Model.isValidRecordItem: bad record array');
			return false;
		}
		
		// TEST REQUIRED
		if ( ! array_key_exists($arg_name, $arg_record) )
		{
			return ! $arg_is_required;
		}
		
		// GET VALUE
		$value = $arg_record[$arg_name];
		
		// TEST TYPE
		if ( $arg_can_empty && $value == '' )
		{
			return true;
		}
		switch( strtolower($arg_type) )
		{
			case 'boolean':
			{
				return \Devapt\Core\Types::isBoolean($value);
			}
			case 'integer':
			{
				return is_numeric($value);
			}
			case 'string':
			{
				return is_string($value);
			}
		}
		
		Trace::warning('Model.isValidRecordItem: bad item type');
		return false;
	}
	
	
	/**
	 * @brief		Init DB adapter
	 * @return		boolean
	 */
	public function initDbAdapter()
	{
		if ( ! is_null($this->db_adapter) )
		{
			return true;
		}
		
		switch( $this->getModelDriverName() )
		{
			case 'PDO_MYSQL':
			case 'MYSQL':
			case 'MYSQLI':
			{
				// CHECK CONNEXION
				if ( ! DbConnexions::hasConnexion($this->model_connexion) )
				{
					return false;
				}
				
				// GET CONNEXION ARRAY
				$arg_options = array();
				$arg_options['driver']		= DbConnexions::getConnexionDriver( $this->getModelConnexionName() );
				$arg_options['hostname']	= DbConnexions::getConnexionHostname( $this->getModelConnexionName() );
				$arg_options['port']		= DbConnexions::getConnexionPort( $this->getModelConnexionName() );
				$arg_options['database']	= DbConnexions::getConnexionDatabase( $this->getModelConnexionName() );
				$arg_options['username']	= DbConnexions::getConnexionUser( $this->getModelConnexionName() );
				$arg_options['password']	= DbConnexions::getConnexionPassword( $this->getModelConnexionName() );
				$arg_options['charset']		= DbConnexions::getConnexionCharset( $this->getModelConnexionName(), '');
				
				// INIT DB ADAPTER
				$this->db_adapter = new DbAdapter($arg_options);
				
				return true;
			}
		}
		
		return false;
	}
	
	
	/**
	 * @brief		Read datas
	 * @param[in]	arg_id				id (integer|string)
	 * @param[in]	arg_request			request (object)
	 * @return		array
	 */
	public function read($arg_id, $arg_request)
	{
		// CHECK ARGS
		if ( ! is_object($arg_request) )
		{
			Trace::warning('Model.read: bad request');
			return null;
		}
		
		// INIT DB ADAPTER
		if ( ! $this->initDbAdapter() )
		{
			return null;
		}
		
		$query = SqlQuery::buildFromRequest($this, $arg_request, $arg_id);
		
		if ( is_null($query) )
		{
			return null;
		}
		
		return $query->read($this->db_adapter);
	}
}
