
import React from 'react'
import ReactDom from 'react-dom/server'
import redux from 'redux'
// import document from 'react-dom'
import {Provider} from 'react-redux'

import { store, config, runtime } from '../../common/store/index'
import Counter from '../../apps/public/devtools/app_component'


// const state = store.getState()


export default function middleware(req, res)
{
	const state = config().toJS()
	
	// let html_content = '<ul>'
	// const keys = Object.keys(state)
	// for(let key of keys)
	// {
	// 	html_content += '<li>' + key + '</li>'
	// }
	// html_content += '</ul>'
	
	// var maxAge = opts.maxAge === undefined ? 3600 : opts.maxAge;
	// const maxAge = 3600
	// res.cache({maxAge: maxAge});
	// res.set('Content-Length', stats.size);
	// res.set('Content-Type', 'text/html; charset=UTF-8');
	// res.set('Last-Modified', Date.now());
	// if (opts.charSet) {
		// var type = res.getHeader('Content-Type') +
		// 	'; charset=' + opts.charSet;
		// res.setHeader('Content-Type', type);
	// }
	// if (opts.etag) {
		// res.set('ETag', opts.etag(stats, opts));
	// }
	// res.writeHead(200);
	// res.contentType = 'text/html'
	
	// const head = '<head><meta charSet="utf-8"/><meta Content-Type="text/html"/><title>React Redux Isomorphic Example</title></head>'
	// const head = '<head><meta charSet="utf-8"/><title>React Redux Isomorphic Example</title></head>'
	// const body = '<body><div id="content">' + html_content + '</div></body>'
	
	// console.log(head, 'head')
	// console.log(body, 'body')
	// sss
	// res.send('<!doctype html>\n<html lang="en-us">' + head + body + '</html>\n')
	
	
	
	const html_content = React.renderToString(
		`<Provider store={state}>
			<Counter />
		</Provider>`
	)
	
	const html_body = ReactDom.renderToString(
		`<html lang="en-us">
			<head>
				<meta charSet="utf-8"/>
				<title>Devapt Devtools</title>
			</head>
			
			<body>
				<div id="content" dangerouslySetInnerHTML={__html:` + html_content + `}/>
				
				<script dangerouslySetInnerHTML={{__html: ` + '`var __INITIAL_STATE__=${JSON.stringify(state)};`' + `}}/>
			</body>
		</html>`
	)
	
	res.send('<!doctype html>\n' + html_body)
}
/*


				<div id="content">
				</div>
				<script type="javascript">
					const content = document.getElementById('content')
					
					content.html = "${html_content}"
				</script>
				
				<script src='./app_component.js'/>
*/
//{() => <AppComponent />}