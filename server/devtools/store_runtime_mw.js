
import T from 'typr'
import assert from 'assert'

import { store, config, runtime } from '../../common/store/index'

import { render_node } from './render_tree'



export default function middleware(req, res)
{
	const state = config().toJS()
	
	
	let html_content = render_node(state, 1, 'state')
	
	
	const html = `
		<html lang="en-us">
			<head>
				<meta charSet="utf-8"/>
				<title>Devapt Devtools</title>
				
				<style type='text/css'>
					#content      { margin-left: 50px; }
					.node         { cursor: default; }
					.node_a       { position: relative; cursor: pointer; }
					.node_content { margin-left: 10px; }
					.node_opened  { position: absolute;left: -0.7em; }
					.node_closed  { position: absolute;left: -0.7em; }
				</style>
			</head>
			
			<body>
				<div id="content">
					${html_content}
				</div>
				<script type="text/javascript" src="http://localhost:8080/assets/js/vendor/jquery.js"> </script>
				
				<script type="text/javascript">
					$('.node_closed').hide()
					$('a.node_a').click(
						function(ev)
						{
							var node = $(ev.currentTarget).parent();
							
							$('div.node_content', node).toggle()
							$('span.node_opened', node).toggle()
							$('span.node_closed', node).toggle()
						}
					)
				</script>
			</body>
		</html>`
	
	res.send('<!doctype html>\n' + html)
}
