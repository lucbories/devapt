# Devapt - Features - Messaging

## Description
A distributed application needs to provide a communication between its nodes.

Devapt provides messages buses to ensure JSON messages exchange.

![Messaging](https://github.com/lucbories/Devapt/tree/master/docs/features/buses.png)

Each topology node has access on 3 buses to communicate inside the node or between nodes:
* metrics bus: metrics collectors push metrics messages on this bus and metrics server listen on it to reduce metrics values.
* messages bus nodes servers and services communicate through messages.
* logs bus: each node part can log its activity on this bus.

Each browser has a socketio bus


## Status
The nodes, servers and services are ready for use.
The messaging bus is ready too but it sould be tested on many host.

To finish: push configuration.

Need Test, Optimization and code review.



## For Devapt users:
Coming soon.
```
```



## For Devapt contributers:
Coming soon.



## Thanks

### SimpleBus
AJ Lopez provides many specialized projects.
It's a great work.
One of them is SimpleBus, a messaging system between a server and its clients (local or remote).

[SimpleBus](https://github.com/ajlopez/SimpleBus)
