# Site Acquisition Tracker — v0.2 Build Specification

## 1. Purpose

This specification defines v0.2 of the Site Acquisition Tracker.

It is a small internal web app for two named internal users. Its purpose is to track live target sites through the acquisition workflow from the point they become worth managing, without using a sales CRM, a generic project board, or a seller-led record structure.

The app exists to support a site-first acquisition process. It is not a customer relationship system, not a marketing tool, and not a general work-management platform.

## 2. Core Rule

Only sites marked **Review** or **Progress** at the end of Stage 1 enter the system. Rejected sites do not enter the system. The tracker is for live sites only, not for all screened sites.

This follows the Site Selection and Rejection Standard.

## 3. What the App Is

The app is a private, browser-based, internal-first tracking tool for live target sites.

It is built around one primary record type only:

**Site**

Each site is a single managed record that can move through a fixed acquisition pipeline, store structured site data, hold working notes, retain dated activity history, and support controlled outward sharing.

## 4. What the App Is Not

The app is not a CRM in the usual sales sense.

It does not revolve around leads, customers, contacts, accounts, opportunities, deals, revenue, products, or sales forecasts.

It does not require a person or organisation to exist before a site can exist.

It is not a public-facing system.

It is not an automation engine.

It is not a document generator in the full templated sense.

It is not a finance calculator.

It is not an AI product.

It is not a platform.

## 5. Users

v0.2 is for two named internal users only:

- Terence
- Allana

There is no public signup, no guest access, and no external login in v0.2.

## 6. External Collaboration Principle

v0.2 must support external sharing without external access.

The system must allow selected site data to be passed safely to named external partners when needed, but those partners do not log into the system in v0.2.

This keeps the security model simple while still allowing collaboration with third parties where the working relationship requires it. The Land Capital arrangement is a live example of why this is needed.

## 7. Hosting and Operating Context

v0.2 will run as a small internal web app on the Ubuntu-based Intel NUC.

It will be hosted internally on the user’s own network.

It will not be exposed directly to the public internet.

External parties will not access the app directly in v0.2. Any information shared with them will be passed out by controlled export or generated summary.

## 8. Primary Workflow

The workflow is fixed and stage-based. The main board view must use these exact stages:

1. Review
2. Progress
3. Planning Thesis Ready
4. Ownership Checked
5. Ready for Contact
6. Contacted
7. Active Dialogue
8. Dead
9. Acquired

These stages reflect the actual acquisition process and must not be replaced with sales terminology. The workflow follows the underlying standard: Review and Progress are the entry points, then the site moves through planning, ownership/contact readiness, outreach, and then either dies or is acquired.

## 9. Record Entry Rule

A site record may only be created when the site has already been classified as either:

- Review
- Progress

This classification happens outside the app as part of Stage 1 screening.

The app is not the screening inbox for rejects.

## 10. Primary Record Type: Site

Each Site record must contain the following minimum structured fields.

### Required structured fields

- Site name
- Property address
- Postcode
- Local authority
- Site type
- Current use
- Why use is weakening
- Physical positives
- Physical risks
- Location tier
- Planning thesis
- Planning notes
- Ownership type
- Ownership traceability
- Owner contacted
- Next step
- Last action date
- Maps link
- Source link
- External share status
- Shared with
- Shared date
- External summary
- Stage
- Created by
- Updated by
- Created date
- Updated date

### Field definitions

**Site name**  
Short plain-English identifier for the site.

**Property address**  
Main address line or best available property description.

**Postcode**  
Postcode where known.

**Local authority**  
Relevant Scottish local authority.

**Site type**  
Controlled values:

- Side plot
- Corner plot
- Large garden
- Infill
- Backland
- Other

**Current use**  
Short description of how the property/site is currently used.

**Why use is weakening**  
Short note explaining why existing use appears weak, tired, redundant, underused, or vulnerable.

**Physical positives**  
Short structured note on favourable physical/site conditions.

**Physical risks**  
Short structured note on physical/site problems or concerns.

**Location tier**  
Simple classification of location quality or fit.

**Planning thesis**  
The current plain-English development thesis for the site.

**Planning notes**  
Supplementary planning observations that do not belong in the main thesis field.

**Ownership type**  
Where known, basic ownership character or structure.

**Ownership traceability**  
Controlled values:

- Unknown
- Partial
- Confirmed

**Owner contacted**  
Controlled values:

- No
- Yes

**Next step**  
Immediate next action required.

**Last action date**  
Date of last substantive action or update.

**Maps link**  
Link to map/location reference.

**Source link**  
Link to original source/listing/reference.

**External share status**  
Controlled values:

- Not shared
- Shared externally
- Updated since sharing

**Shared with**  
Short text listing the named external recipient or group.

**Shared date**  
Date the current outward version was last shared.

**External summary**  
A clean outward-facing summary note suitable for sharing externally without exposing all internal working notes.

**Stage**  
One of the nine fixed workflow stages.

**Created by / Updated by / dates**  
System audit information.

## 11. Notes and Activity History

Each Site record must include:

- internal working notes
- append-only activity history
- optional external summary

Internal working notes are for candid internal use.

External summary is the outward-facing version suitable for sending to third parties.

The activity log should record what happened, when, and by whom.

Examples:

- Site created
- Stage changed from Review to Progress
- Planning thesis added
- Ownership checked
- Owner contact attempted
- Reply received
- Site moved to Dead
- Shared externally with Mads
- External summary updated
- Shared pack reissued

In addition to the activity log, the record should allow working notes. Notes may be edited, but stage moves and key activity events should remain historically visible.

## 12. Screens and Views

v0.2 should have six screens or views only.

### A. Board View

This is the main working screen.

It shows all live Site records in Kanban form using the nine fixed stages as columns.

Each card should show, at minimum:

- Site name
- Local authority or address summary
- Next step
- Last action date

Dead and Acquired may be hidden by default if that improves clarity, but they must remain available to view.

### B. Table View

This is the structured list view.

It must allow sorting and filtering by key fields, especially:

- Stage
- Local authority
- Site type
- Owner contacted
- Ownership traceability
- External share status
- Site name/address search

### C. Site Detail View

This is the full record screen.

It must show:

- all structured fields
- notes
- activity history
- stage
- created/updated metadata

### D. New Site / Edit Site Form

This is the record entry and maintenance form.

It must be quick to use and designed for speed, not ornament.

### E. Admin / Settings

This should be minimal.

It should support:

- user management
- controlled values for dropdown fields where needed
- no sprawling admin machinery

### F. Share / Export View

This is a controlled outward-sharing view.

It must allow:

- export of a single site summary
- export of selected records from the table view
- export only of approved outward-facing fields
- no exposure of internal-only notes unless deliberately included

## 13. External Sharing Outputs

v0.2 must support these outward-sharing methods.

### Single-site summary export

A clean structured summary for one site, suitable for copying, printing, PDF export, or sending by email.

Minimum outward summary content:

- Site name
- Property address
- Postcode
- Local authority
- Site type
- Current use
- Planning thesis
- Physical positives
- Physical risks
- Ownership traceability
- Owner contacted
- Next step
- Maps link
- Source link
- Stage
- Last action date
- External summary

### Filtered multi-site export

Ability to export selected site records from the table view to CSV or similar structured output.

This is for sending packs or updates to external partners without giving them access to the app.

## 14. Security Requirements

Security should be simple, serious, and boring.

v0.2 must include:

- named user accounts only
- strong password login
- no public registration
- no guest access
- no shared accounts
- HTTPS if practical internally
- server-side session handling
- basic audit trail
- restricted access to the private internal network only
- remote use only through secure private access if needed later
- database not publicly exposed
- regular backups retained

Two roles are sufficient:

- Admin
- Standard User

External sharing in v0.2 must be pull-based and deliberate, not open-ended.

That means:

- no public links
- no outsider logins
- no shared credentials
- no direct database access
- no live external board view

Only named internal users may decide what is shared.

## 15. Technical Shape

v0.2 should be a small internal web app.

It should run on Ubuntu on the NUC.

It should use a private local database.

The technology stack should be boring and maintainable.

The design goal is not technical cleverness. The design goal is a dependable internal tool that fits the process.

There is no need for a native Ubuntu desktop app in v0.2.

There is no need for public cloud hosting in v0.2.

## 16. Explicit Exclusions

The following are out of scope for v0.2:

- CRM entities such as Leads, Deals, Accounts, Companies, People, Opportunities
- public portal
- public-facing site
- Gmail integration
- automatic email sync
- AI summaries
- automation rules engine
- dashboards
- finance modelling
- mapping integration beyond links
- mobile app
- notifications beyond what is essential
- multi-pipeline support
- investor/client portals
- advanced permissions model
- workflow branching
- analytics and forecasting
- external user accounts
- read-only partner portals
- public share links
- live third-party dashboards
- external editing rights

These are excluded deliberately to keep v0.2 small, honest, and buildable.

## 17. Acceptance Test

v0.2 is acceptable if all of the following are true:

A new live site can be created quickly once it has been classified as Review or Progress.

A site can be moved through the defined stages without sales terminology or contact-first distortion.

The planning thesis, ownership state, next step, and source/map links can be kept together in one record.

Both users can see the same live pipeline clearly.

The board view works as the primary operating surface.

The table view allows useful filtering and review.

Dead and acquired sites remain recorded without cluttering day-to-day live work.

Internal users can manage live sites without exposing the full system externally.

A single site can be exported as a clean outward-facing summary.

Selected sites can be exported as a controlled external pack.

Internal notes remain internal unless deliberately copied into the external summary.

The system records whether a site has already been shared and with whom.

The app can be used internally without swearing at it more than the alternatives already tested.  

## 18. Design Principle

This app must reflect the process.

The process must not be bent to suit off-the-shelf software habits.

The app is successful only if it fits the actual site acquisition workflow better than the CRMs, board tools, and pseudo-platforms already rejected.

## 19. One-Sentence Build Brief

Build a small internal two-user web app called Site Acquisition Tracker, hosted on the Ubuntu NUC, using Site as the only primary record type, with a fixed nine-stage acquisition board, structured site fields, notes/history, controlled external-summary and export capability, and no external user access in v0.2.
