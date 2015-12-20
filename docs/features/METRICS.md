# Devapt - Features - Metrics

## Description
Applications optimization and analyze need some metrics.
Usefull libraries offer builin metrics support but each one with its own format.
Devapt provides a unique metrics format per server domain: http request, messaging request...


## Status
The metrics collector is finished for HTTP servers.
The metrics server is operational.

Need Test, Optimization and code review.


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
* common/base/metric.js - Metric: base class of metrics collectors
* common/metrics/metric_duration.js - MetricDuration: metrics values collector for a simple time interval
* common/metrics/metric_host.js - MetricHost: metrics values collector for a hostname value
* common/metrics/metric_http.js - MetricHttp: metrics values collector for Http servers
* common/metrics/metric_http_reducer.js - MetricHttpReducer: retrics reducer to calculate statistiques from collected values
* common/metrics/metric_http_state.js - MetricHttpState: metrics reducer results (statistics)
* common/servers/metric_server.js - MetricsServer: server which reveive metrics message and call a reducer to update statistics

Metrics message format:
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
