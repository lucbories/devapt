
cli
nodes.promote_master node_name






2 kind of servers:
Express
Restify

Stability patterns:
* Http request retry (requester code: browser or server)
* Http request timeout (requester code: browser or server)
* Circuit Breaker: break a link if some threasold are too high (requester code: browser or server)
* Handshaking: to detect overload situation in advance
	* use a server load balancer and check an health url on each node to determine the best nodes)
	* use a server push approach by adding a flow control header to the response: control the load on a per client base
* Bulkheads: allow some server resources per application, per user, per end-point, per operation (requester code: server)

Use of middlewares to append features to servers:
* Activity logger: log each request
* Performance monitor (start): init request metrics and create request transaction
* Authentication filter: check if a valid user is available for the request (update metrics)
* Authorization filter: check if the valid user could access to the resource (update metrics)
* Bulkheads dispatcher (update metrics)
* Process request (update metrics)
* Performance monitor (end): close request metrics


Others patterns
Facade: serves as an abstraction
Mediator:a standard way to communicate between "modules"
	* subscribe(channel_id, fn)
	* publish(channel_id, args)






Restify:
server.use(restify.throttle({
  burst: 100,
  rate: 50,
  ip: true,
  overrides: {
    '192.168.1.1': {
      rate: 0,        // unlimited
      burst: 0
    }
  }
}));

If a client has consumed all of their available rate/burst, an HTTP response code of 429 Too Many Requests is returned.

Options:
Name	Type	Description
rate	Number	Steady state number of requests/second to allow
burst	Number	If available, the amount of requests to burst to
ip	Boolean	Do throttling on a /32 (source IP)
xff	Boolean	Do throttling on a /32 (X-Forwarded-For)
username	Boolean	Do throttling on req.username
overrides	Object	Per "key" overrides
tokensTable	Object	Storage engine; must support put/get
maxKeys	Number	If using the built-in storage table, the maximum distinct throttling keys to allow at a time