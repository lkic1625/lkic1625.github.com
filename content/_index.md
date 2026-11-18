I’m Hammer, a backend engineer. I spent over five years at Channel.io building CRM and marketing systems that handled more than 100 million messages a month.

On this blog, I share lessons from running those systems in production, along with notes on what I’m studying.

## Selected work

- Built a shared platform for bulk actions such as importing customer records, sending campaign messages, and tagging conversations in bulk. Fair queuing and per-tenant rate limits kept large jobs from monopolizing shared resources.
- Reduced head-of-line blocking in the bulk action queue through logical partitioning. Together with dynamic worker scaling, this cut the time to process 100,000 items from 25 minutes to 4 in a load test.
- Introduced ClickHouse for CRM audience segmentation so marketers could target customers using cart, order, and coupon data in a single query.
- Traced write throttling on a DynamoDB base table to backpressure from a global secondary index (GSI).

## Start here

### In English

- How we built and scaled a shared job queue. [Building the bulk processing system](/bulk-action-implementation/) · [Partitioning the queue and scaling workers](/bulk-action-improvement/)
- How we made cart, purchase, and coupon data queryable together. [More Precise Customer Targeting with ClickHouse](/clickhouse/)

### In Korean

- [KVCache부터 PagedAttention까지](/kv-cache-paged-attention/) · Nov 18, 2026
- [메모리 버퍼풀로 살펴보는 PostgreSQL, RocksDB, ClickHouse](/database-buffer-pools/) · Nov 5, 2026
- [메모리 할당기 — glibc, jemalloc, TCMalloc, Java, Go](/os-memory-allocation/) · Oct 21, 2026
- [Go, Rust, Java의 런타임 스케줄링](/os-limited-direct-execution/) · Oct 5, 2026

## External writing

- [Handling Spike Traffic Reliably: Improvement (2)](https://channel.io/ko/team/blog/articles/tech-logical-partitioning-0db50646)
- [Handling Spike Traffic Reliably: Improvement (1)](https://channel.io/ko/team/blog/articles/tech-dynamic-scaling-6748dc7e)
- [More Precise Customer Targeting with ClickHouse](https://channel.io/ko/team/blog/articles/tech-crm-marketing-clickhouse-16084dd4)
- [Handling Traffic Spikes Reliably](https://channel.io/ko/team/blog/articles/235661b0)
- [Real-time Chat Server Journey (3)](https://channel.io/ko/team/blog/articles/ebbb3712)
- [Real-time Chat Server Journey (2)](https://channel.io/ko/team/blog/articles/7b1edb14)
- [Real-time Chat Server Journey (1)](https://channel.io/ko/team/blog/articles/4571f5b3)
