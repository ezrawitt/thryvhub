# Thryv Partner Hub demonstration data

The canonical fixture is `demo-data.js`. Page components import this module rather than owning competing network facts.

## Tenant and reporting contract

- Organization: Acme Franchising (`TEN-ACME-001`)
- Network: 25 uniquely identified U.S. locations (`LOC-0001` through `LOC-0025`)
- Regions: West, Southwest, Mountain, Central, and East
- Reporting period: Jul 27–Aug 25, 2026
- Prior period: Jun 27–Jul 26, 2026
- Currency: USD, displayed with U.S. formatting
- Reporting timezone: Pacific Time (`America/Los_Angeles`)
- Freshness: `Demo data · Updated Aug 25, 2026 at 6:00 AM PT`
- Status vocabulary: Active, Inactive, Temporarily closed, Performing well, Stable, Needs attention

Listings intentionally represents a connected subset: 9 of 25 locations. Location tables and scorecards may show smaller previews, which must be labeled as subsets. Reputation contains 236 reviews across the same 25-location roster; the UI renders six representative reviews from the current reporting period.

## Aggregation rules

- **Total leads (4,820):** unique leads after de-duplication by lead ID across the tenant and reporting period.
- **Core Growth Platform leads (2,300):** leads whose primary acquisition source is the core platform.
- **Leads Boost leads (900):** leads assigned to the Leads Boost source.
- **Social Ads leads (620):** leads assigned to paid social as their primary source.
- **SEO leads (1,000):** leads assigned to organic search as their primary source.
- These four source categories are mutually exclusive in this demonstration fixture and sum to Total leads. Product activity may influence another source, but a lead is counted once in network totals.
- **Revenue ($284,770):** recognized USD revenue during the reporting period, net of voids and refunds. Channel attribution is an allocation of this total and must sum to it.
- **Active locations (22):** locations with canonical status `Active`; 1 is Inactive and 2 are Temporarily closed.
- **Product adoption:** count of canonical locations enabled and active for each product, stored in `productAdoption`.
- **Reviews (236):** reviews received across all canonical locations during the reporting period.
- **Response rate (91.1%):** 215 responded reviews divided by 236 reviews.

Integrity coverage lives in `tests/demo-data.spec.mjs`. It validates unique identifiers, known locations, date boundaries, mutually exclusive lead sums, attributed-revenue reconciliation, subset bounds, freshness wording, and page-level canonical totals.
