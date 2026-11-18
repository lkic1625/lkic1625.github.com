I’m Hammer, a backend engineer. I spent over five years at Channel.io working on CRM and marketing systems that handled more than 100 million messages a month.

I write about questions that came up while building those systems. How do you keep one customer’s million-record import from holding up someone else’s campaign? When a queue starts filling up, how do you tell whether adding workers will help? I also keep notes here on databases, operating systems, and LLM inference.

## Selected work

- Helped build a shared queue for bulk jobs so a large import could run alongside smaller campaigns. We later partitioned the queue and adjusted the number of workers based on the backlog. In a load test, processing 100,000 items went from 25 minutes to 4. [How we scaled the queue](/bulk-action-improvement/)
- Introduced ClickHouse so marketers could combine cart, coupon, and purchase data. For example, they could reach shoppers who had both an item in their cart and an unused coupon for it. [How we built customer targeting](/clickhouse/)
- Switched from batch aggregation to processing changes as they arrived from DynamoDB, reducing database load from 297 to 36 transactions per second.
- Tracked down production failures, including an application that ran out of memory and a DynamoDB secondary index that slowed writes to the main table.

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
