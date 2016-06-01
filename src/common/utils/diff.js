
/**
 * Source : http://jsfiddle.net/sbgoran/kySNu/
 * 
 */
export const diff = () => {
	return {
		VALUE_CREATED: 'created',
		VALUE_UPDATED: 'updated',
		VALUE_DELETED: 'deleted',
		VALUE_UNCHANGED: 'unchanged',
		
		map: (obj1, obj2) => {
			if ( this.isFunction(obj1) || this.isFunction(obj2) )
			{
				throw 'Invalid argument. Function given, object expected.'
			}
			
			if ( this.isValue(obj1) || this.isValue(obj2) )
			{
				return {type: this.compareValues(obj1, obj2), data: obj1 || obj2}
			}

			let diff = {}
			for (var key in obj1)
			{
				if ( this.isFunction( obj1[key] ) )
				{
					continue
				}
				
				let value2 = undefined
				if ( 'undefined' != typeof(obj2[key]) )
				{
					value2 = obj2[key]
				}

				diff[key] = this.map(obj1[key], value2)
			}
			
			for (var key in obj2)
			{
				if ( this.isFunction(obj2[key]) || ('undefined' != typeof( diff[key] ) ) )
				{
					continue
				}

				diff[key] = this.map(undefined, obj2[key])
			}

			return diff

		},
		
		
		compareValues: (value1, value2) => {
			if (value1 === value2)
			{
				return this.VALUE_UNCHANGED
			}
			
			if ('undefined' == typeof(value1))
			{
				return this.VALUE_CREATED
			}
			
			if ('undefined' == typeof(value2))
			{
				return this.VALUE_DELETED;
			}

			return this.VALUE_UPDATED;
		},
		
		
		isFunction: (obj) => {
			return {}.toString.apply(obj) === '[object Function]'
		},
		
		
		isArray: (obj) => {
			return {}.toString.apply(obj) === '[object Array]'
		},
		
		
		isObject: (obj) => {
			return {}.toString.apply(obj) === '[object Object]'
		},
		
		
		isValue: (obj) => {
			return !this.isObject(obj) && !this.isArray(obj)
		}
	}
}

/*
const result = deepDiffMapper.map(
	{
      a:'i am unchanged',
      b:'i am deleted',
      e:{ a: 1,b:false, c: null},
      f: [1,{a: 'same',b:[{a:'same'},{d: 'delete'}]}]
  },
  {
      a:'i am unchanged',
      c:'i am created',
      e:{ a: '1', b: '', d:'created'},
      f: [{a: 'same',b:[{a:'same'},{c: 'create'}]},1]
  
  }
)

console.log(result)*/
