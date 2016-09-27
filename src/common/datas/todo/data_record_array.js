save
update()


API:
 *                  ->constructor(object)     : nothing
 *  
 *                  ->get_records()   		  : array of Records objects
 *                  ->get_count()             : integer (records count)
 *  
 *                  ->new_record()            : 
 *                  ->free_record()           : 
 *                  
 *                  ->update_records_map()    : Reload all query model records
 *                  ->get_record_by_id(id)    : Lookup a record with its id
 *                  ->get_first_record_by_field(n,v): Lookup a record with a field name and a field value
 *                  ->get_first_record_by_object(o) : Lookup a record with its values
 *                  
 *                  ->load(datas)             : Fill the Recordset with given datas records
 *                  ->read()                  : Read records from the model with the owned query
 *                  ->read_all()              : Read all available records from the model
 *  
 *                  ->save()                  : Save all dirty records into the model
 *                  ->erase()                 : Remove all records and update the model
 * 



ResultSet

 API:
 *                  ->constructor(object)     : nothing
 *  				
 *                  ->get_records()     	  : array
 *                  ->get_count()             : integer




DS.RECORDARRAYMANAGER CLASS ADDON/-PRIVATE/SYSTEM/RECORD-ARRAY-MANAGER.JS:15
PRIVATE

EXTENDS: EMBER.OBJECT
DEFINED IN: addon/-private/system/record-array-manager.js:15
MODULE: ember-data
Index
Methods
Show:   Inherited   Protected   Private   Deprecated
METHODS

createAdapterPopulatedRecordArray
createFilteredRecordArray
createRecordArray
liveRecordArrayFor
registerFilteredRecordArray
unregisterRecordArray
updateFilter
updateFilterRecordArray
updateRecordArrays

