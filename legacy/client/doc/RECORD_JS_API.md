Devapt / client / datas / model / record
========================================


 A Record is a class instance:
 * contains fields values (a plain object)
 * is attached to a ResultSet and a Model
 * is unique for a Model and a given id
 * is linked to a list of views

 
 Record fields values are reactive streams (Flyd instances).
 
 Record
 * datas: map of flyd streams
 
 