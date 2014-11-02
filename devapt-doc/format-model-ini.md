model

scheme : sql, csv file, xml file, nosql, map, ...

field
	validate
		regexp:[a-zA-Z]+[0-9]{2}
		type:digits
		type:chars
		type:email
		type:identifier -> [a-zA-Z0-9][a-zA-Z0-9\-_]+
	format
		template:value is {value} !
		type:local date
		type:local time
		type:local date time
