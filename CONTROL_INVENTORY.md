# Partner Hub prototype control inventory

This inventory covers Overview, Locations, Listings, Reputation, Network Performance, and Advanced Reporting.

## Fully functional

- Base-aware navigation, Back/Forward, copied links, and product jump links
- Demo Tools expansion, package/audience/product selection, and product gating
- Date, metric, media, channel, list/map, tab, and filter selectors that visibly change their selected state
- Location search, status filtering, location scorecard open/close, and reporting drill-down links
- Review assistant, ThryvAI open/close/prompts/message entry, and collapsible information panels
- Modal, drawer, checklist, and panel open/close controls

## Prototype simulation

- Add/Edit Location, Bulk Update, Sync, exports, Export PDF, Reply now, Review errors, Fix listing(s), View location, View campaign, Review budget
- Create report, custom report/analysis, Configure metrics/columns/analysis, Manage calculations/groups
- Add media/link/emoji, preview/share/duplicate/edit actions, and other useful workflow entry points

Activating these controls produces the shared **Prototype action** feedback panel. No production data is saved, published, downloaded, or changed.

## Not implemented

- Resolve, reconnect, mark-as-read, delete, and other destructive or externally mutating operations
- Ellipsis/More menus whose action sets are not defined in this prototype

These controls never imply success. Their shared feedback explicitly states that no production data changed or that the action is not available in this prototype.

Automated coverage in `tests/control-audit.spec.mjs` activates every visible enabled button on the audited pages and fails if an action produces no navigation, state change, modal/menu, or explicit prototype feedback.
