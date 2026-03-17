Backend engineer building distributed systems for B2B SaaS.

I work on backend problems where throughput, correctness, and product constraints collide: spike traffic, multi-tenant fairness, streaming pipelines, and reliability under failure.

Over the last 5+ years at Channel.io, I have worked on CRM and marketing systems that process 100M+ messages per month. I care about systems that hold up in production, and I write about the trade-offs behind them here.

## What you will find here

- Real production problems, not toy examples
- System design decisions and their trade-offs
- Notes on distributed systems, databases, and backend architecture
- Writing that reflects how I think and debug as an engineer

## A few things I have worked on

- Built a bulk processing system that handled 1k/s spike traffic with better fairness and failure isolation
- Replaced batch-style aggregation with a DynamoDB CDC pipeline and reduced database load from 297 TPS to 36 TPS
- Introduced ClickHouse for more expressive CRM targeting queries
- Investigated and fixed production issues such as monolith OOMs and DynamoDB GSI backpressure propagation
- Designed shared reliability patterns including idempotency, retries, and rate limiting

## Start here

- [Handling Spike Traffic Reliably: Improvement](/bulk-action-improvement/)
- [More Precise Customer Targeting with ClickHouse](/clickhouse/)
- [Handling Spike Traffic Reliably](/bulk-action-implementation/)
- [Database Internals](/database-internals/)
- [Transactions and Consensus in Distributed Systems](/2pc-raft-정리/)

## External writing

- [Handling Spike Traffic Reliably: Improvement (2)](https://channel.io/ko/team/blog/articles/tech-logical-partitioning-0db50646)
- [Handling Spike Traffic Reliably: Improvement (1)](https://channel.io/ko/team/blog/articles/tech-dynamic-scaling-6748dc7e)
- [More Precise Customer Targeting with ClickHouse](https://channel.io/ko/team/blog/articles/tech-crm-marketing-clickhouse-16084dd4)
- [Handling Traffic Spikes Reliably](https://channel.io/ko/team/blog/articles/235661b0)
- [Real-time Chat Server Journey (3)](https://channel.io/ko/team/blog/articles/ebbb3712)
- [Real-time Chat Server Journey (2)](https://channel.io/ko/team/blog/articles/7b1edb14)
- [Real-time Chat Server Journey (1)](https://channel.io/ko/team/blog/articles/4571f5b3)
