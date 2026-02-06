+++
title = "More Precise Customer Targeting with ClickHouse"
date = "2026-01-25T13:00:00+09:00"
tags = ["OLAP", "ClickHouse"]
+++

Channel.io's marketing feature enables diverse and precise customer targeting. While we already provide methods that leverage customer behavioral data and personalization data, the underlying storage architecture had its limitations. In this post, I'll walk through the process of adopting ClickHouse to support more granular customer behavioral and personalization data.

# Overview

Channel.io has established itself as a B2B customer communication tool connecting customers and businesses, but it offers much more than that. CRM marketing is one of those capabilities — it helps draw customers who've engaged through support conversations back to the site. When a customer makes a purchase through a marketing campaign, their behavioral data flows back into Channel.io, enriching personalization data and enabling better support conversations — a virtuous cycle. Driving revenue while enabling precise targeting through personalized customer data is both the core direction and strength of Channel.io's CRM marketing.

That's how critical customer personalization data is. However, Channel.io's existing CRM data had many gaps in the customer information it could support. Channel.io integrates with various e-commerce platform providers (Cafe24, Imweb, etc.), but due to limitations in the data storage architecture, it was difficult to target based on what items a customer had purchased, what products were in their cart, or which coupons they held but hadn't used. Today, let's talk about how we solved this problem with ClickHouse, and the challenges that came with the adoption.

# Making Customer Behavioral Data More Precise

Channel.io stores data across multiple database systems. We primarily use RDBMS (PostgreSQL) and NoSQL (DynamoDB), but also leverage OpenSearch for search and Redis for faster caching. For more precise, schemaless data queries, we also run a separate Hot Storage layer built through a CDC pipeline from the NoSQL source tables (internally called "Memdb").

On top of all this, we had additional requirements. In e-commerce, the products a customer is interested in are a strong signal for purchase conversion. Therefore, behavioral data such as what items a customer has in their cart, what coupons they hold, and what products they've previously purchased is also critical. Targeting these customers within Channel.io was difficult with the existing architecture.

# The Problem

[image placeholder]
- A customer who has a coupon for product A and has added product A to their cart, but hasn't purchased it yet.
- A customer who has added products to their cart but hasn't placed an order for those products yet.

The examples and diagram above illustrate real-world customer targeting scenarios for purchase conversion. What database system would be best suited for querying this kind of data? The query pattern immediately brings RDBMS to mind. However, we're dealing with data volumes that a traditional RDBMS cannot handle. For example, the total number of coupons issued by Channel.io clients currently reaches several billion records. Even with proper indexing, JOIN-heavy query patterns are highly likely to cause disk spills. This leads to increased tail latency and can degrade product stability.

Additionally, this data is fundamentally write-heavy. More precisely, the data integrated into Channel.io is rarely read directly by clients — the main read use case is selecting a target audience for running marketing campaigns. Here's a brief summary of the data characteristics:

1. **Write-heavy workload.** Traffic can also spike during specific time windows or dates (e.g., Black Friday). It's a spiky traffic pattern.
2. **A single table cannot hold all the information.** The query pattern requires JOINs.
3. **Order information from clients arrives as webhooks, similar to a WAL (Write-Ahead Log).** It doesn't require a transactional data model — supporting append-only writes with Last-Write-Wins consistency is sufficient.

# Why ClickHouse? Why Not the Other Candidates?

[image placeholder]

ClickHouse is a relatively recent OLAP system, but we judged it to be mature enough, and there was a reasonable amount of reference material available. Additionally, we needed to guarantee production-level reliability within a month, and using ClickHouse Cloud made that achievable with minimal setup and optimization effort.

Beyond that, ClickHouse's simplicity — maintaining only the straightforward MergeTree structure — was actually a big draw. Its simple index structures, including sparse indexes and Bloom filters, made it easy to understand and reason about the internals quickly. (Of course, this simplicity comes with clear downsides, which we'll cover in later sections.)

Below is a comparison table we assembled while evaluating OLAP systems. At the time, we concluded that ClickHouse was the best choice.

| Criteria | PostgreSQL | Druid | BigQuery | StarRocks | ClickHouse |
|----------|------------|-------|----------|-----------|------------|
| **Storage Model** | Row-based | Column-based | Column-based | Column-based | Column-based |
| **Query Flexibility** | High | Low (fixed schema) | High | High | High |
| **Ad-hoc Filter Combinations** | ✅ | ❌ | ✅ | ✅ | ✅ |
| **Cost Efficiency** | ✅ | ✅ | ❌ Pay-per-query | ⚠️ Self-managed | ✅ |
| **Operational Complexity** | Low | High | None (Managed) | High | Low |
| **Large-scale Analytics Performance** | ❌ Disk spill, tail latency | ✅ | ✅ | ✅ | ✅ |
| **Ecosystem Maturity** | ✅ | ✅ | ✅ | ⚠️ Growing | ✅ |
| **Verdict** | Performance limits | Lacks flexibility | Cost concerns | Operational burden | ✅ Adopted |

# Challenges After Adopting ClickHouse

As mentioned above, ClickHouse's simplicity can actually become a problem. Let's discuss the issues we encountered during the production rollout.

## Limitations of ReplacingMergeTree

ReplacingMergeTree (RMT) is the approach for managing data that requires updates. ClickHouse's fundamental storage model operates under the MergeTree data structure — small parts are written to disk and periodically merged in the background.

RMT handles updates by writing new versions of rows and deduplicating during merge. The key problem is that **deduplication only happens at merge time**. As a result, every query must use the `FINAL` keyword to perform deduplication at read time, which becomes **the primary bottleneck for query performance**.

**Solution**: Hot/Cold data separation. We manage mutable data (Hot Storage) and immutable data (ClickHouse) separately, and query them together.

## JOIN Performance Issues

ClickHouse does not handle all JOINs equally well. Systems like StarRocks are better suited for JOINs across large fact tables. The JOIN patterns ClickHouse handles well are JOINs with small dimension tables or tables small enough to be broadcast.

That said, in Channel.io's actual use cases, we're performing in-memory operations on filtered customer sets of a few million records or less, so Parallel Hash Join keeps latency manageable at the hundreds-of-milliseconds level. However, this only holds when the JOIN target is within 1-2 GB.

## Point Query Limitations

Before sending a marketing campaign, we need point queries to check whether a specific customer belongs to a specific segment. ClickHouse uses sparse indexes at the granule level (default 8,192 rows per granule), which means reading a single row requires scanning a large range of the data file.

**Solution**: A hybrid architecture running both ClickHouse and a Key-Value store. This increases synchronization complexity, but can be managed using patterns similar to the Hot/Cold separation described above.

# Conclusion

ClickHouse's simplicity is a strength for rapid adoption, but several technical limitations surface during production operations. We were aware of the ReplacingMergeTree and JOIN limitations before adoption, but in terms of implementation and management difficulty, it was still the best choice. That said, the trade-off is that **the hybrid design increased overall architecture complexity**.

At this point, the team is considering adopting StarRocks for workloads that require frequent updates. We plan to cover that in a follow-up technical blog post.

# References

- [ClickHouse Documentation](https://clickhouse.com/docs)
- [ClickHouse MergeTree](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree)
- [Channel.io Engineering Blog - Original Korean Post](https://channel.io/ko/team/blog/articles/tech-crm-marketing-clickhouse-16084dd4)
