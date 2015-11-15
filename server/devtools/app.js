
import React from 'react'
import redux from 'redux'
import {Provider} from 'react-redux'

import { store, config, runtime } from '../../common/store/index'
// import {Counter} from '../../apps/public/devtools/app_component'


// const state = store.getState()
const state = config().toJS()

export default function (req, res)
{
	let html_content = '<ul>'
	const keys = Object.keys(state)
	for(let key of keys)
	{
		html_content += '<li>' + key + '</li>'
	}
	html_content += '</ul>'
				
	
	res.send('<!doctype html>\n' + React.renderToString(
		<html lang="en-us">
			<head>
				<meta charSet="utf-8"/>
				<title>React Redux Isomorphic Example</title>
			</head>
			
			<body>
				<div id="content">
				</div>
				<script dangerouslySetInnerHTML={{__html: `window.__INITIAL_STATE__=${JSON.stringify(state)};`}}/>
				<script type="javascript">
					const content = document.getElementById('content')
					
					content.html = "${html_content}"
				</script>
			</body>
		</html>)
	)
}
/*

				<div id="content" dangerouslySetInnerHTML={{__html: React.renderToString(
					<Provider store={store}>
						<Counter />
					</Provider>)
				}}/>
				
				<script src='./app_component.js'/>
*/
//{() => <AppComponent />}