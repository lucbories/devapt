# Devapt - Features - Metrics

## Description
Applications optimization and analyze need some metrics.

Usefull libraries offer builin metrics support but each one with its own format.

Devapt provides a unique metrics format per domain: http request, messaging, host, nodejs...


Metrics architecture consist of 4 main base classes and one bus per topology, on the master node:
* MetricsCollector: update MetricsRecord values, use MetricsReducer to consolidate values and post a message onto the metrics bus.
* MetricsRecord: a snapshot of a set of values
* MetricsReducer: reduce a list of MetricsRecord values
* MetricsState: MetricsReducer result
Each of this 4 classes should be subclassed to create a new metrics feature.


For instance, available metrics are:
* Bus metrics: collect master node buses counters (messages count, messages size, errors count, subscribers count)
* Host metrics: collect NodeJs host metrics (CPUs count, CPUs architecture, CPUs usage...)
* NodeJs metrics: collect NodeJs process metrics (pid, version, plateform, uptime, memory)
* Http metrics: for Restify and Express, collect request metrics (id, method, status, referer, url, service, latency, browser...)


How it runs:

The MetricsServer owns collectors instance and listen the metrics bus and call a MetricsCollector method to process new metrics values.
A MetricsCollector owns one MetricsReducer, one MetricsState and one MetricsRecord.
The MetricsServer provides metrics reduced values to metrics services.
Each metrics feature has its corresponding metrics service to publish metrics outside the node:
* MetricsBusService
* MetricsHostService
* MetricsNodeJsService
* MetricsHttpService


## Status
Features are finished for Bus, Host, NodeJs and Http metrics.

The metrics server is operational.

See devapt-devtools project for a full example of metrics services usage.

[DEVTOOLS Project](https://github.com/lucbories/devapt-devtools/)


## For Devapt users:
```
    // GET NODE
    let node = ...
    
    // GET HTTP METRICS STATISTICS VALUES
    const http_metrics = node.get_metrics_server().get_http_metrics().get_values()
    
    /*
        HTTP METRICS STATISTICS FORMAT:
        
        // REQUEST VERSIONS
        http_metrics.version_counters: a map of Devapt versions counters (plain object)
        
        // REQUEST UUID
        http_metrics.id_counters: a map of requests ids counters { id1:counter1, id2:counter2 } (plain object)
        http_metrics.pid_counters: a map of process ids counters { pid1:counter1, pid2:counter2 } (plain object)
        
        // DURATIONS
        http_metrics.latency_min: the minimal latencies value (integer)
        http_metrics.latency_counter: the counter latencies values (integer)
        http_metrics.latency_sum: the sum of latencies values (integer)
        http_metrics.latency_mean: the sum divided by the count of latencies values (integer)
        http_metrics.latency_max: the maximal latencies value (integer)
        
        // SERVICE IDENTIFICATION
        http_metrics.service_name_counters: a map of service name counters (plain object)
        http_metrics.service_url_counters: a map of service url counters (plain object)
        http_metrics.service_method_counters: a map of service method counters (plain object)
        http_metrics.service_http_version_counters: a map of service http counters (plain object)
        http_metrics.service_route_counters: a map of service route counters (plain object)
        
        // SERVER IDENTIFICATION
        http_metrics.server_node_name_counters: a map of Devapt versions counters (plain object)
        http_metrics.server_server_name_counters: a map of Devapt versions counters (plain object)
        
        // CLIENT IDENTIFICATION
        http_metrics.client_user_name_counters: a map of user name counters (plain object)
        http_metrics.client_user_id_counters: a map of user id counters (plain object)
        http_metrics.client_browser_counters: a map of client browser type counters (plain object)
        http_metrics.client_referrer_counters: a map of client referrer counters (plain object)

        // RESPONSE
        http_metrics.response_status_counters: a map of response status counters (plain object)
    */
```



## For Devapt contributers:

Metrics classes are:
* common/metrics/metric_duration.js - MetricDuration: metrics values collector for a simple time interval.

* common/metrics/base/metrics_collector.js - MetricsCollector: metrics values collector base class.
* common/metrics/base/metrics_record.js - MetricsRecord: metrics values snapshot base class.
* common/metrics/base/metrics_reducer.js - MetricsHost: metrics values reducer base class.
* common/metrics/base/metrics_state.js - MetricsState: metrics values persistent state base class.

* common/metrics/bus/metrics_bus_collector.js - MetricsBusCollector: metrics values collector class for bus metrics feature.
* common/metrics/bus/metrics_bus_record.js - MetricsBusRecord: metrics values snapshot class for bus metrics feature.
* common/metrics/bus/metrics_bus_reducer.js - MetricsBusHost: metrics values reducer class for bus metrics feature.
* common/metrics/bus/metrics_bus_state.js - MetricsBusState: metrics values persistent state class for bus metrics feature.

* common/metrics/host/metrics_host_collector.js - MetricsCollector: metrics values collector class for host metrics feature.
* common/metrics/host/metrics_host_record.js - MetricsRecord: metrics values snapshot class for host metrics feature.
* common/metrics/host/metrics_host_reducer.js - MetricsHost: metrics values reducer class for host metrics feature.
* common/metrics/host/metrics_host_state.js - MetricsState: metrics values persistent state class for host metrics feature.

* common/metrics/http/metrics_http_collector.js - MetricsHttpCollector: metrics values collector class for Http metrics feature.
* common/metrics/http/metrics_http_record.js - MetricsHttpRecord: metrics values snapshot class for Http metrics feature.
* common/metrics/http/metrics_http_reducer.js - MetricsHttpHost: metrics values reducer class for Http metrics feature.
* common/metrics/http/metrics_http_state.js - MetricsHttpState: metrics values persistent state class for Http metrics feature.

* common/metrics/nodejs/metrics_nodejs_collector.js - MetricsNodeJsCollector: metrics values collector class for NodeJs metrics feature.
* common/metrics/nodejs/metrics_nodejs_record.js - MetricsNodeJsRecord: metrics values snapshot class for NodeJs metrics feature.
* common/metrics/nodejs/metrics_nodejs_reducer.js - MetricsNodeJsHost: metrics values reducer class for NodeJs metrics feature.
* common/metrics/nodejs/metrics_nodejs_state.js - MetricsNodeJsState: metrics values persistent state class for NodeJs metrics feature.

* common/servers/metric_server.js - MetricsServer: server which reveive metrics message and call a reducer to update statistics


Metrics bus message format:
```
{
   "target":"metrics_server", // Fixed name: see node.metrics_server.get_name()
   "sender":"...", // fill by BusClient.send_msg(target,payload)
   "payload":{
       "is_metrics_message":true,
       "metric":"...", // metrics collector type: http/message/...
       "metrics":[
           {
                // metrics values
           }
       ],
       "metrics_count":999 // count of metrics
    }
}
```
