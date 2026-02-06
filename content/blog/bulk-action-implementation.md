+++
title = "Handling Spike Traffic Reliably"
date = "2025-03-21T13:00:00+09:00"
tags = ["distributed-systems", "go", "redis", "rate-limiting"]
+++

At Channel.io, we serve approximately 200,000 customers. In our day-to-day operations, we frequently encounter business scenarios that require bulk operations — uploading roughly 1 million customer records, targeting 100,000 customers for a promotional campaign, or bulk-applying tag changes across historical data. These requests arrive at arbitrary, unpredictable moments and must be handled reliably, at appropriate speed, and without straining the database.

Three backend engineers spent four months building a unified bulk action system to solve this problem. This post covers the implementation details.

# Problem Definition

We identified six interconnected challenges:

1. **Arbitrary timing** — Customers trigger bulk operations at unpredictable moments.
2. **Reliability** — No data loss during processing.
3. **Speed** — Fast completion despite high volumes.
4. **Consistency** — A unified interface across different bulk action features.
5. **Fairness** — Large customer requests must not block smaller ones.
6. **Isolation** — A single request must not degrade overall service quality.

# Architecture Overview

The bulk action system is built on five pillars: fair queuing, backpressure with rate limiting, a worker pool, an aggregator, and failure handling. Let's walk through each.

# Fair Queuing

A naive FIFO queue suffers from head-of-line blocking — a customer uploading 1 million records blocks everyone behind them. We needed a scheduling strategy that guarantees fairness across customers while still completing in-progress work efficiently.

## Shortest Job First with Aging

We implemented a priority queue using Redis Sorted Sets with Lua scripting for atomic operations. Rather than pure FIFO, the system employs Shortest Job First (SJF) scheduling combined with priority aging.

The priority for each job is calculated as:

```
priority = base_priority (FIFO timestamp) + config_value + completion_boost
```

- **Base priority**: A negative timestamp so older jobs naturally have higher priority (FIFO as default).
- **Config value**: A tunable parameter per bulk action type.
- **Completion boost**: A boost factor proportional to how close the job group is to finishing. Job groups that are nearly complete get prioritized, preventing the scenario where a retry causes a nearly-finished group to be deprioritized behind a freshly submitted one.

This combination prevents starvation (via aging) while ensuring fairness (via SJF) and efficient completion (via the completion boost).

# Backpressure & Rate Limiting

Bulk actions hit shared database tables. Without rate limiting, a burst of bulk operations can saturate write capacity and destabilize the entire service. We use **fixed-window rate limiting** to control throughput.

## Capacity Allocation

- **Global capacity per table**: e.g., 10,000 RPS.
- **Per-customer allocation**: Global capacity divided by the number of concurrent active customers.

## Smart Backoff: Solving the Idle Spinning Problem

When a job is throttled, the naive approach is to retry after a fixed delay. This creates **idle spinning** — jobs repeatedly fail the throttle check, wasting queue operations and CPU cycles without making forward progress.

We solved this by calculating a staggered wait time:

```
wait_time = 1s + floor(waiting_job_count / rate_limit_speed)
```

Instead of all throttled jobs retrying simultaneously after the same delay, each job calculates its position in the waiting queue and schedules its retry at a staggered interval. This distributes retry attempts across multiple rate-limit windows, dramatically reducing wasted operations.

# Worker Pool

The worker pool is built on Go's lightweight goroutines with channel-based coordination. Each instance maintains a fixed number of workers, and we scale horizontally by adding more instances rather than dynamically adjusting goroutine counts within a single process.

## Dual Queue System

The workers operate across two queues:

- **Ready Queue** — Jobs ready for immediate execution. Workers pull from this queue.
- **Non-ready Queue** — Throttled or failed jobs awaiting retry with their calculated backoff times.

A **Dispatcher** goroutine continuously monitors the Non-ready Queue and promotes jobs back to the Ready Queue once their backoff period expires.

# Failure Handling

We implement **at-least-once delivery semantics** with acknowledgment-based reliability:

- **In-flight Queue** — Tracks currently executing jobs. When a worker picks up a job, it moves from the Ready Queue to the In-flight Queue.
- **Visibility Timeout** — Similar to AWS SQS, if a worker doesn't ACK a job within a timeout period, the job is considered orphaned and re-queued for retry.
- **Client-side Idempotency** — Since at-least-once semantics means a job may be delivered more than once, each bulk action implementation is responsible for ensuring idempotency.

# Aggregation & Completion

A **Watcher** goroutine monitors job group completion. When all jobs in a group finish, the Watcher:

1. Acquires a distributed lock (preventing duplicate state transitions across instances).
2. Aggregates results using a MapReduce pattern.
3. Delivers a callback notification to the requesting service.

# Load Test Results

We tested with 15,000 jobs split across 3 groups at a target rate of 10 TPS:

| Metric | Value |
|--------|-------|
| Ideal completion time | 500 seconds |
| Actual completion time | ~720 seconds (+44%) |
| Avg throttle occurrences per job | 1.45 |
| Peak throughput | 25 TPS |

The average throttle count of 1.45 per job is a significant improvement over the naive backoff approach, which produced 10+ throttle occurrences per job. The smart backoff reduced queue operations by over 90%.

# What We Solved

- A unified interface for all bulk action implementations.
- Fair resource allocation preventing customer interference.
- Consistent RPS compliance across requests.
- Reliable job delivery with retry guarantees.
- Dramatically reduced queue operation overhead.

# Out of Scope

Several items were intentionally left for future work:

- **Dynamic flow control** — Adjusting rate limits based on observed downstream latency.
- **Client-side deduplication IDs** — Currently, idempotency is the caller's responsibility.
- **Horizontal job queue scaling** — The Redis-based queue is a single point; partitioning is future work.
- **Redis cluster setup** — Running on a single Redis instance for now.

# Conclusion

Building a bulk action system that handles spike traffic reliably comes down to three ideas: fair scheduling so no single customer monopolizes resources, intelligent backoff so throttled jobs don't waste cycles spinning, and layered queues (ready / non-ready / in-flight) that cleanly separate concerns. The congestion control algorithm — calculating staggered retry times instead of naive fixed delays — was the single biggest win, turning a queue-thrashing retry storm into planned, evenly-spaced execution windows.

# References

- [Channel.io Engineering Blog — Original Korean Post](https://channel.io/ko/team/blog/articles/235661b0)
