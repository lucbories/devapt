const default_runtime = {
	runtime:{
		application:{
			// mutable runtime values (copy of initial config)
			// resources: available resources names list
		},
		
		records:{
			by_id: {},    // record id: record datas (plain object)
			by_query: {}, // query hash:map of record id
			by_model: {}, // model name:map of record id
			by_view: {}   // view name:map of record id
		},
		
		instances:{
			by_id:{}, // instance id:plain object
			by_class:{}, // class_name:[] (array of id)
			by_name:{}, // name:id
			by_type:{
				view:[], // (array of id)
				model:[], // (array of id)
				menubar:[], // (array of id)
				menu:[], // (array of id)
				database:[], // (array of id)
				plugin:[], // (array of id)
				logger:[] // (array of id)
			}
		},
		
		security:{
			authentication:{},
			authorization:{}
		}
	}
}

/*
	Instance AAA:{
		dependancies:{
			views:[], // list of instance id
			models:[] // list of instance id
		}
		config:{
			// copy of state.config.... instance initial definition
			// runtime values are mutable
			type:
			class_name:
			name:
			id:=name
			...
		}
		state:{
			// other runtime values
		}
	}
*/

export default default_runtime