
import T from 'typr'
import assert from 'assert'

import { html_table_template } from '../lib/html_template'



export default function middleware(req, res)
{
	
	
	let records_array = [{'ts':Date.now(), 'level':'DEBUG', 'content':'hello1'}, {'ts':Date.now(), 'level':'DEBUG', 'content':'hello2'}]
	
	
	const html = html_table_template(records_array, 'Devapt Devtools - Logs')
	
	res.send(html)
}
