# Devapt - Features - Rendering

## Description
Rendering is the process of making an Html content.

Devapt allows you to render page content on the server or on the browser side or all both together.

Devapt rendering is a set of pure functions which take settings, state and context.
* settings contains what to be rendering: a trre of component descriptions.
* state has initial values of component: label, placeholder, items...
* context is an object with rendering helpers: functions resolver, result data to be updated...

Devapt rendering is stateless and isomorphic component classes with simple signature:

All rendering functions update a virtual dom tree based on virtual-dom.
Rendered virtual nodes are stored in a RenderingResult instance.
On server side rendering, RenderingResult instance is serialized and given to the browser to update the browser dom tree.
On browser side, rendering is processed by Component classes which update the real dom tree and manage UI interactions (user actions, stream events...).

A work in progress is to give plugins component class to the browser with browserify build process.



## At startup
A page is rendered by the server and send to the browser.

The initial page contains:
* common page headers
* applications initial settings and states: window.__INITIAL_STATE__
* page initial content to be rendered: window.__INITIAL_CONTENT__
* page initial content headers: css, js...
* a single empty body DIV tag with id 'content'
* a devapt bootstrap script

Devapt bootstrap script calls:
```javascript
window.devapt().on_dom_loaded( window.devapt().create_runtime )
window.devapt().on_runtime_created( window.devapt().render_page_content )
window.devapt().on_content_rendered( window.devapt().init_anchors_commands )
```

First line create Devapt runtime, load initial Redux state.

Line two render initial content and initialize router current path:
```javascript
window.devapt().ui().process_rendering_result(json_result)
window.devapt().router().set_hash_if_empty('/')
```

Line three update anchors path with application url prefix.



## Rendering result process
At startup <DIV id="content"> is empty and initial RenderingResult contains a virtual tree of the "content" tag.

For example, "content" virtual tree children can contain:
* "menubar":vnode_a
* "separator":vnode_b
* "table":vnode_c

First children components are created and intialized with a vnode:
```javascript
// REMOVE "content" existing children

var compo_a = window.devapt().ui("menubar")
compo_a.process_rendering_result(vnode_a)
compo_content.get_dom_element().appendChild( compo_a.get_dom_element() )

var compo_b = window.devapt().ui("separator")
compo_b.process_rendering_result(vnode_b)
compo_content.get_dom_element().appendChild( compo_b.get_dom_element() )

var compo_c = window.devapt().ui("table")
compo_c.process_rendering_result(vnode_c)
compo_content.get_dom_element().appendChild( compo_c.get_dom_element() )

```



## Rendering component
Each rendering component is a base class of devapt/src/browser/Component.
A Component has a private Rendering instance named "_rendering" which manage dom and vnode rendering actions.



```javascript

const component_instance = window.document.devapt().runtime().ui().get_component_class(class_name)
const c = new component_class(settings)
c.render(state)
```
* An other axis is to manage DOM update through a virtual DOM.

Devapt comes is a set of rendering components but it is expandable with plugins for foundation-site, cytoscape...




## Example
For example, at the beginning you have a /myapp/home route to display your home page.

Server receives a /myapp/home request:
* server search for a corresponding service service and reply with a 404 not found page if no service was found.
* server ask service to process the request: service serves a static page, process a custom work or call a rendering middleware.
* for rendering middleware, service response with a common page skeleton and a RenderingResult instance.
* browser receive html page, init javascript to create ClientRuntime and UI instances.
* browser UI instance processes RenderingResult to finalize page content.

After you choose a menu item with a route command as
```javascript
{
	"type":"display",
	"url":"/page2",
	"middleware":"mypage2service"
}
assuming you have an application whith the /myapp route.
```
Browser has append a route for each command at startup, so browser process the requested route and call UI instance method:
```javascript
window.document.devapt().runtime().ui().render_with_middleware(cmd, "/myapp/page2", "mypage2service")
```
* Browser asks server for a RenderingResult instance (server rendering result) via websocket.
* Browser UI instance processes RenderingResult to update page content.


If you choose a menu item with a view command as
```javascript
{
	"type":"display",
	"view":"page2_view",
	"menubar":"page2_menubar"
}
```
* Browser searchs for page2_view and page2_menubar (optional) settings. If not found into cache, asks server for settings.
* Browser process rendering of page2_view and page2_menubar (optional).
```javascript
window.document.devapt().runtime().ui(page2_view).render()
window.document.devapt().runtime().ui(page2_menubar).render()
```




## Status

Usable but work in progress.
Need Test, Optimization and code review.




## For Devapt users:
Coming soon.
```javascript
```



## For Devapt contributers:
Coming soon.





|    |     |    |
|:---|:---:|---:|
|[Metrics](https://github.com/lucbories/Devapt/tree/master/docs/features/METRICS.md)..........................|[Table of content](https://github.com/lucbories/Devapt/tree/master/docs/TOC.md)|..........................[Security](https://github.com/lucbories/Devapt/tree/master/docs/features/SECURITY.md)|
