# Devapt - Features - Rendering

## Description
Rendering is the process of making an Html content.

Devapt allows you to render page content on the server or on the browser side or all both together.

Devapt rendering is still server side oriented because of rendering class into the server source tree.
A work in progress is to rework all rendering process with:
* stateless and isomorphic component classes with simple signature:
```javascript
const component_class = window.document.devapt().runtime().ui().get_component_class(class_name)
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
