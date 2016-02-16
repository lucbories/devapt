
import runtime from '../common/base/runtime'
import {SOURCE_LOCAL_FILE, SOURCE_MSG_BUS, SOURCE_REMOTE_URL, SOURCE_SQL_DATABASE, SOURCE_NOSQL_DATABASE} from '../common/datas/providers/provider'



const runtime_settings = {
	'is_master':false,
	'name':'NodeB',
	
	'master':{
		'name':'NodeA',
		'host':"localhost",
		'port':5000
	},
	
    "settings_provider": {
        'source':SOURCE_MSG_BUS,
        "node":"NodeA"
    },
}

runtime.load(runtime_settings)


process.on('SIGTERM',
	function()
	{
		process.exit()
	}
)
