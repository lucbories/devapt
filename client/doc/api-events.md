API - EVENTS


DevaptContainer
	render_self(deferred)
		devapt.container.render.begin nothing
		devapt.container.render.item [item_index]
		rendered.items nothing
	render_end
		devapt.container.render.end nothing
	
DevaptList
	select_item_node(index,opds)
		devapt.events.list.selected [event_opds_map]
			avec event_opds_map = {
				index:node_index,
				label:node_value,
				record:record,
				opds
			}
	on_record_select(field name, field value, item text)
		devapt.events.list.selected [event_opds_map]
			avec event_opds_map = {
				index:node_index,
				label:node_value,
				record:record,
				field_name:
				field_value:
			}


BINDINGS
bind: function(arg_events_filter, arg_bind_action, arg_set_1, arg_item_1, arg_object_2, arg_set_2, arg_item_2)

on_binding: function(arg_event_obj, arg_bind_action, arg_set_1, arg_item_1, arg_set_2, arg_item_2, arg_event_opds)
	switch(arg_set_2)
		'filters'->on_binding_on_filters
		'records'->on_binding_on_records
		'record'->on_binding_on_record
		
on_binding_on_filters: function(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds)
	switch(arg_bind_action)
		'update'->	add_field_value_filter(null, arg_item_2, field_value, true)
					remove_items()
					render_items(deferred)

on_binding_on_records: function(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds)
	N/A

on_binding_on_record: function(arg_event_obj, arg_bind_action, arg_item_1, arg_item_2, arg_event_opds)
	switch(arg_bind_action)
		'select'->on_record_select(target_field_name, target_field_value, target_item_text)
	
