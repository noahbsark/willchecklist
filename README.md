# WillChecklist.com

A static, U.S.-focused will preparation checklist site. The upgraded version includes an interactive browser-based checklist, a downloadable PDF planning packet, SEO pages, disclosure pages, and original SVG assets.

## What changed in this upgrade

- Added `pages/interactive-will-checklist.html` with local browser progress saving.
- Added `assets/downloads/will-preparation-packet.pdf`, an 8-page printable organizer.
- Added `editorial-policy.html` with trust standards, source links, and attorney-review limitations.
- Updated navigation, sitemap, README, and setup docs.

## How to upload

1. Upload the contents of `/site` to your domain's public web root, such as `public_html`.
2. Keep the folder structure intact.
3. Visit `https://noahbsark.github.io/willchecklist/index.html` or the domain root after upload.
4. Test `pages/interactive-will-checklist.html` and the PDF download link.

## Placeholders to replace

- `NEWSLETTER_ENDPOINT_PLACEHOLDER` - replace with your email provider form endpoint.
- `LEAD_FORM_ENDPOINT_PLACEHOLDER` - replace with your contact or lead form endpoint.
- `AFFILIATE_LINK_EXAMPLE_1` through `AFFILIATE_LINK_EXAMPLE_7` - replace with approved affiliate links only.
- `ADSENSE_PUBLISHER_ID_PLACEHOLDER` - replace only after ad network approval.
- `ANALYTICS_ID_PLACEHOLDER` - replace with your analytics ID if used.

## Important compliance notes

This site is educational only and is not legal advice. Do not add “attorney reviewed,” “expert approved,” “guaranteed,” “best,” or similar claims unless they are truthful and documented. Affiliate links should be clearly disclosed and marked with `rel="sponsored nofollow"`.

## Suggested next improvements

1. Add state-by-state resource links to official court or state bar pages.
2. Have a licensed estate planning attorney review the core checklist and add a documented review note only if true.
3. Connect a real newsletter provider and create an automated welcome email delivering the PDF packet.
4. Add a simple provider comparison table with transparent criteria and no fake rankings.
5. Turn the PDF packet into a professionally designed branded lead magnet.
6. Add a printable one-page summary generated from the interactive checklist.
7. Create a “When to talk to a lawyer” diagnostic page.
8. Add analytics with privacy-friendly settings.
9. Test page speed after uploading.
10. Submit `sitemap.xml` manually in Search Console after launch.


## Second usability upgrade included

This version adds three practical, visitor-facing tools:

1. `pages/will-maker-decision-helper.html` — an interactive, browser-only helper that suggests a conservative research path.
2. `pages/state-estate-planning-resources.html` — a state resource finder that links visitors to official starting points instead of summarizing state law.
3. `pages/attorney-meeting-prep.html` — a local worksheet for preparing a concise consultation brief.

These tools use local browser storage or no storage. They do not submit sensitive information to a server. Keep that privacy-first behavior unless you add a secure backend and update the Privacy Policy.


## V3 usability upgrades

This package adds three visitor-facing utility pages designed to make the site feel more real and usable:

- `pages/document-locator.html` - a private browser-based document locator with printable PDF card.
- `pages/family-conversation-guide.html` - a script builder for estate planning conversations.
- `pages/seven-day-will-plan.html` - a 7-day progress-based preparation workflow.

A new PDF, `assets/downloads/document-locator-card.pdf`, is included as a second practical lead/resource asset. It is educational only and should not be used to store passwords, private keys, access codes, full account numbers, or Social Security numbers.

## V4 upgrades

- Added `pages/planning-dashboard.html`, a local-browser progress dashboard for the main tools.
- Added `pages/request-planning-help.html`, a compliant placeholder lead path for future referrals, affiliate routing, or email segmentation.
- Added dashboard and planning-help SVG illustrations.
- Private builder notes are outside `/site`. Do not upload that folder; upload only the contents of `/site`.

## Privacy reminder for tool pages

The interactive tools use browser localStorage. That makes the site useful without a database, but it also means progress is device/browser-specific. Visitors should not enter passwords, full account numbers, Social Security numbers, private keys, or confidential legal facts.


## V5 upgrade

This version adds a planning summary builder, a final review checklist, and a plain-English glossary. The summary builder reads browser-local progress from the tool suite and creates a high-level brief that users can copy or print. It is designed for organization only and intentionally warns users not to enter passwords, full account numbers, Social Security numbers, private keys, or confidential legal facts.

New public pages:

- `/pages/planning-summary-builder.html`
- `/pages/final-review-checklist.html`
- `/pages/estate-planning-glossary.html`

Only upload the public site files to public hosting. Private production guidance should not be deployed.


## V6 upgrade notes

This version makes the site more product-like:

- `pages/start-here.html` provides a browser-local starter assessment.
- `pages/annual-review-planner.html` creates an annual review reminder plan.
- `pages/five-day-email-course.html` is a launch-ready newsletter funnel page.
- `pages/planning-dashboard.html` now supports local progress export/import as JSON.

Only upload the public site directory.

## V7 upgrade notes

This version adds three practical user-facing tools:

- Will Preparation Readiness Scorecard (`pages/readiness-scorecard.html`)
- Beneficiary Review Worksheet (`pages/beneficiary-review-worksheet.html`)
- Estate Binder Index Builder (`pages/estate-binder-index.html`)

The binder page links to `assets/downloads/estate-binder-index.pdf`, a printable worksheet. All three tools are browser-local and should not be used to store passwords, Social Security numbers, full account numbers, private keys, or confidential legal facts.


## V8 usability upgrade

This version adds a Guided Flow page, global quick-start strip, sensitive-input warnings, clearer navigation, and a dashboard next-step panel. The goal is to make the site usable by visitors who do not know where to begin and to reduce accidental entry of sensitive information.

When publishing, upload only the public site files.


## V9 usability upgrades

V9 makes the public experience easier for first-time visitors:

- The homepage is now guided-flow-first.
- `pages/how-to-use.html` explains buttons, progress, browser-local saving, printing, copying, and resetting.
- `pages/safe-input-examples.html` gives concrete safe/unsafe examples.
- A floating “Need help?” panel appears on public pages.
- Text inputs and textareas receive inline helper text that discourages sensitive details.
- The main nav is simplified around Guided Flow, How to Use, Dashboard, Checklist, Summary, and Free PDF.

When publishing, upload only the public site folder.


## V10 usability upgrade

- Added a one-question-at-a-time setup at `/pages/onboarding-wizard.html`.
- Added a Quick-Start Guide page and printable PDF at `/pages/quick-start-guide.html` and `/assets/downloads/will-checklist-quick-start-guide.pdf`.
- Updated navigation so first-time users have fewer choices and clearer next steps.
- Continue to upload only `/site` publicly; private builder notes stay outside the public folder.


## V11 usability upgrade

V11 adds a `Continue Where You Left Off` page, first-visit welcome modal, next-step cards at the bottom of tool pages, and clearer fallback messages for placeholder forms. This makes the site easier to use during usability testing because visitors always have one obvious next action and a repeated safety reminder.

When publishing, upload only the public site files.


## V12 simplified GUI notes

V12 makes the site easier for real users by simplifying the homepage, top navigation, footer, helper button, and visual system. The first-visit modal was disabled to reduce interruption. The intended path is now: Home → Start → Continue/Dashboard → Summary.

See `OWNER_GUIDE.md` for the simplest maintenance rules.


## V13 public-test update

This version pauses public newsletter, lead, affiliate, and display-ad placeholders so real users do not hit dead submissions or misleading monetization. Use the site as a working planning tool first. See `PUBLIC_TEST_READINESS.md`, `USABILITY_TEST_SCRIPT.md`, and `OWNER_LAUNCH_INPUTS_DRAFT.md`.


## V14 simplification update

V14 intentionally reduces the visible product path to six core steps: Setup, Main Checklist, Document Locator, Beneficiary Review, Planning Summary, and Final Review. Optional worksheets remain available, but the homepage, guided flow, dashboard, and Continue page now emphasize one next action at a time.

For public testing, ask users whether they can identify the next step without reading the footer or sitemap. If they hesitate, simplify the current screen further rather than adding new features.


## V15 simplicity update

V15 makes the public experience simpler: the homepage now sends visitors to a single Simple Path page, the main navigation uses plain labels, and the Progress page is positioned as a one-next-step dashboard. The recommended public route is: Home → Start → Continue/Progress → Print Guide. Advanced tools still exist, but they should stay secondary until user testing shows they are needed.


## V16 usability update
This version simplifies the main experience into a visible six-step path and hides sidebar distractions on core tool pages. The core steps are: Setup, Checklist, Documents, Beneficiaries, Summary, and Final Review.


## V17 simplicity upgrade
This version tightens the user flow: core pages hide the extra helper strip, each core page has one obvious next button, and completion feedback is clearer. The goal is fewer choices per screen and a calmer experience for real users.


## V18 update

V18 focuses on simplicity. Core tool pages now hide utility actions such as copy, print, download, and reset inside collapsible drawers. This keeps the visible interface focused on the main task and the next step. V18 also includes `WHAT_I_NEED_FROM_YOU_TO_GO_LIVE.md` for the later hosting and launch process.

## V19 simplicity update

V19 makes the site easier to use by sending the main **Start** link directly to Step 1 instead of requiring users to read the overview first. The overview page remains available as a "How it works" page, but the recommended flow is now:

1. Start Step 1
2. Continue where left off
3. Check Progress
4. Print or save only when needed

Keep inactive forms, ads, affiliate blocks, and lead-capture elements hidden until they are connected.


## V21 simplicity note
V21 makes the six-step path more direct. Core step pages now use a primary "Save and go" button so users do not have to understand separate save/next actions. Optional help is tucked into a small expandable panel.


## V22 simplicity update

The six core pages now use one primary finish action: save the current step and continue to the next step. Avoid reintroducing separate completion buttons unless user testing shows a real need.


## V23 ultra-simple flow update

V23 reduces core-page distractions, hides the floating Help widget on the six main steps, and adds a mobile-only bottom Next button so phone users always know how to continue.


## V24 simplicity update

V24 makes the six core pages quieter and easier to finish. The duplicate hero area is hidden on core steps, the core-page navigation is reduced, legal/safety notes are shorter, and each core page keeps one main save-and-next action.

## V25 simplicity update

V25 makes the six-step core path calmer and easier to use. The main change is that each core page now has a shorter visible interface: one step title, one safety line, one task area, and one bottom Next button. The Next button still saves progress locally in the visitor's browser.

For public testing, keep users focused on:

1. Start Step 1
2. Checklist
3. Documents
4. Beneficiaries
5. Summary
6. Final Review

Advanced pages remain available but should not be promoted until the core flow is validated with real users.


## V26 usability polish

V26 focuses on public-test simplicity: calmer core pages, hidden repeated helper strips, safe input placeholders, reset confirmations, and a small saved-progress confirmation.


## V27 update

V27 adds a calm finish page at `pages/done.html` so users do not end the six-step path on another dashboard. The final button now says **Finish** and leads to three plain next actions: save/print, share safely, and confirm offline if needed.


## V28 update

V28 keeps the simplified six-step flow and adds completed-step status in the step strip. When a user saves a step, that step changes to a checkmark in the strip. This helps returning users understand progress without adding extra buttons or screens.


## V29 simplicity update
V29 makes the Progress page more public-test friendly by removing the large advanced dashboard from the default flow. Users now see one recommended next action, the six core steps, and a small optional tools drawer.


## V30 simplicity update

The six core pages now share the same compact instruction pattern: one step title, one plain-language task, one safe-input reminder, the task area, and one primary next button. The goal is for users to feel like they are moving through one product, not jumping between separate tools.


## V31 update

The main header has been simplified to Start, Continue, Help, and Print guide. Progress is still available from Continue and the footer, but it no longer competes in the main navigation. A no-JavaScript notice was added so visitors understand that saved progress requires JavaScript.


## V32 simplicity note

The six-step strip on core pages is now a progress indicator rather than a second navigation menu. Users move forward with the one bottom button, which saves progress and opens the next step.

## V33 update

V33 is a calm-path polish release. It hides duplicate instruction blocks on the six core pages, simplifies the Continue and Progress pages, and keeps the primary user journey focused on one next action at a time.


## V34 simplicity update

V34 keeps the same six-step flow and improves usability through larger tap targets, clearer selected states, stronger keyboard focus, and more mobile-friendly next buttons. No new tools were added.

## V35 update
The six public core step pages were cleaned at the HTML source level. Duplicate hero blocks, repeated quick-start strips, and extra mini instruction panels were removed so the flow now shows one step header, one safety line, the task, and one next action.


## V36 simplification update

V36 removes several source-level distractions from the six core pages: sidebars, optional FAQ blocks, ad placeholders, and old optional cards. The public core flow should now read as one simple path: step title, safety line, task, one next action.


## V37 simplicity cleanup

V37 trims the Continue and Progress pages so users see one plain heading and one recommended action before anything else. It also renames core-page utility drawers to "Print, copy, or clear" and keeps optional notes calmer. No new tools were added.


## V38 simplicity pass

V38 keeps the site focused on the six-step flow. It removes remaining non-core explanation blocks from the core pages, unifies the safety notice, shortens the Guide label, and reduces next-step cards to one primary action.


## V39 simplicity note

V39 reduces public chrome: footers are shorter, duplicate footer columns are removed, and the homepage uses one short “How it works” note instead of multiple linked cards. The main six-step path remains unchanged.


## V40 simplicity update

V40 reduces the homepage and finish page to the smallest practical set of actions. The public experience should continue to emphasize one path: Start Step 1, complete the six core steps, and review/print a summary. Avoid adding new top-navigation items unless they support that path directly.

## V41 simplicity update

V41 removes repeated warning/callout blocks from the six core steps, standardizes the core step titles, and makes Step 1 simpler. The setup wizard now has one visible action at a time and always routes users to Step 2: Checklist when setup is complete.

## V42 update

Step 1 now behaves more like a simple wizard: the next button stays inactive until the user chooses an answer, and the Previous button is hidden on the first question. This reduces accidental clicks and makes the first step easier to understand.


## V43 note
V43 keeps the product simple: the six-step flow is unchanged, final action panels are more compact, setup choices have clearer selected/disabled states, and saved-step status is less confusing.

## V44 simplicity note

V44 keeps the six-step flow unchanged. It improves clarity by making selected choices easier to see and by hiding field helper text until the user focuses a field. The goal is a cleaner screen with help available only when needed.


## V45 update
The setup questions were rewritten to be clearer and safer. Step 1 now includes a safe-example check and a short summary before sending users to Step 2.


## V46 note

V46 keeps the same six-step path but improves the setup questions and answer choices. Step 1 now includes short answer hints and a safety check that explains why private numbers, passwords, safe codes, and SSNs should not be entered.


## V47 note

V47 improves the wording and flow of the six-step experience: shorter checklist groups, clearer step prompts, safer examples, simpler summary options, and a shorter final review.


## V48 note

V48 improves questions, answers, and flow without adding new tools. Each core step now has a simple question and a short “Done when” line so users know what counts as enough before continuing.


## V49 simplicity note

The setup now begins with the safe-notes rule before any planning questions. Core pages use a consistent “Do this / Done when / unsure” pattern so visitors know when it is okay to continue.


## V50 simplicity note

Step 1 now has four questions instead of five. Keep future setup questions short and only ask something if it changes user understanding or prevents misuse.

## V51 simplicity note

Step 1 is now only two questions: the safety check and one extra-care flag. Avoid adding setup questions unless the answer changes the next step or prevents unsafe use.


## V52 simplicity update

Step 1 was shortened to two questions: first a safety example, then one extra-care flag. The removed goal question did not change the path, so removing it makes the start faster and less confusing.


## V53 update

Step 1 is now a single safety-confirmation gate. Users choose the safe example, then go directly to the checklist. This reduces setup friction while keeping misuse prevention in place.


## V55 launch polish

- The top navigation is calmer: Guide is no longer styled as the main button.
- A simple 404 page is included for broken or old links.
- `CNAME` and `.nojekyll` are included for easier GitHub Pages hosting.
- The six-step flow remains the only recommended main path.


## V56 simplicity note

V56 is the recommended baseline for usability testing. It keeps the six-step path simple, hides copy-preview blocks from the main flow, and prevents continuing when the privacy guard has flagged private-looking information.


## V57 update

V57 keeps the six-step flow unchanged while improving the GUI: beneficiary rows now behave like simple cards, the summary builder is single-column, and core pages use calmer spacing and clearer focus states.


## V58 usability note

V58 keeps the six-step path simple and clarifies that users can leave blanks, return later, and use the Next button to save that they reviewed a step. This reduces pressure to enter private details just to complete a page.


## V59 usability note

V59 keeps the six-step flow unchanged but makes the interface more self-explanatory with one-line safe examples, clearer next-button labels, and calmer save-status text.


## V60 simplicity note

Step 1 is now a one-click safety confirmation instead of a quiz. Users see safe and unsafe examples, confirm that they understand, and then go directly to the checklist.

## V61 usability note

V61 lowers pressure in the core six-step path. Extra completion counters are hidden from the main steps so users do not feel they must reach 100%. The stepper still shows where they are, checked choices are clearer, and each page ends with one calm save-and-continue action.


## V62 visual polish

V62 improves the public look without changing the six-step flow. It adds a clearer logo, a lightweight original homepage SVG, a cleaner hero layout, softer footer proportions, and more polished cards/buttons.

## V63 note

V63 is a visual and usability audit pass. It keeps the same six-step flow but improves the homepage, core page layout, progress strip, buttons, selected states, and footer balance. It also includes `UI_AUDIT_REPORT.md` for manual review.


## V65 note
V65 is a GUI polish version. It keeps the six-step flow unchanged while improving homepage presentation, visual hierarchy, safety copy, and core-step consistency.


## V66 update

V66 is a visual/usability polish pass. It keeps the six-step flow unchanged while making the homepage, safety notice, form fields, next-step panel, and mobile layout calmer and easier to use.


## V67 note

V67 is a visual and usability polish pass. It keeps the public experience focused on the six-step checklist path, makes the homepage and header feel more finished, and reduces repeated helper/progress elements on the core pages.


## V68 update

V68 is a visual and usability polish pass. It keeps the simple six-step flow and improves the homepage, core step cards, form styling, buttons, safety notice, and mobile spacing.


## V70 update
A visual polish pass made the homepage, header, core-step panels, selected states, and mobile next buttons calmer and more consistent. No new tools or pages were added.


## V71 update

V71 is a visual/usability polish pass. It improves the homepage illustration, makes Step 1 feel like a quick confirmation instead of a quiz, and makes the six core pages feel calmer and more consistent. No new tools or user decisions were added.


## V72 note

V72 is a visual/usability polish release. It keeps the product simple, makes Start visually primary, combines duplicate safety guidance, and makes the six-step pages feel calmer and more consistent.


## V74 update

V74 is a readability and usability polish. It keeps the site simple, hides the floating helper panel, improves the homepage visual, and preserves the six-step path as the main product experience.


## Latest update: V75

V75 is a clean product polish pass: stronger homepage visual, clearer primary Start action, softer forms, calmer core pages, and no added complexity.


## V77 update
V77 is a public-test visual polish version. The main six-step flow is unchanged; styling was refined for a calmer homepage, friendlier forms, and clearer next-step panels.


## V78 update

V78 is a public-test polish pass: cleaner homepage visual, shorter safety/help copy, no progress-pressure widgets in the core flow, and utility tools pushed lower on the page.


## V79 GitHub Pages default URL note

This version is configured for the default GitHub Pages project URL:

`https://noahbsark.github.io/willchecklist/`

The custom-domain `CNAME` file has been removed for now. When the domain is purchased and ready, add a `CNAME` file containing the domain name and update canonical, Open Graph, sitemap, and robots URLs back to the custom domain.
