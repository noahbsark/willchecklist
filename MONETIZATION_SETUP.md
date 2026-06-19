# Monetization Setup

## Recommended path

Start with the free PDF packet and newsletter capture. Add affiliate links only after the site has real usefulness and traffic. Display ads should come later because legal-adjacent trust matters.

## Affiliate placeholders

Replace placeholders such as `AFFILIATE_LINK_EXAMPLE_1` only with approved affiliate URLs. Keep nearby disclosure text. Use cautious language such as “compare options,” “worth considering,” or “learn more.” Do not claim a service is best unless you have a truthful, documented methodology.

Recommended categories to research:

- Online will-making software
- Attorney consultation marketplaces
- Password manager products
- Document storage products
- Home office scanners or filing tools
- Estate planning books from reputable retailers

## Display ads

Replace `ADSENSE_PUBLISHER_ID_PLACEHOLDER` only after approval. Keep ads responsive and not intrusive. Do not place ads in a way that makes them look like legal guidance.

## Newsletter

Replace `NEWSLETTER_ENDPOINT_PLACEHOLDER` with your provider endpoint. Use the PDF packet as the main lead magnet. Consider a short sequence:

1. Deliver the PDF packet.
2. Explain what to gather first.
3. Share when to consider professional help.
4. Link to comparison options.

## Lead capture

Replace `LEAD_FORM_ENDPOINT_PLACEHOLDER` only if you have a compliant lead process. For legal leads, be especially careful not to imply you are a law firm or can match users with legal advice unless that is actually true and compliant.

## Compliance reminders

- Keep disclosures close to affiliate links.
- Do not fabricate reviews or testimonials.
- Do not use attorney-review claims unless true.
- Do not collect sensitive personal information through the static forms.
- Do not ask users to submit Social Security numbers, passwords, or full account numbers.


## Monetization added by this upgrade

- The decision helper can lead to comparison pages with affiliate placeholders, but it should not imply that an option is legally sufficient.
- The state resource finder should remain mostly non-commercial to preserve trust.
- The attorney meeting prep page can support a careful lead form or attorney directory later, but only after compliance review and clear disclosure.
- Avoid pay-per-lead claims such as “matched with the best attorney.” Use neutral language like “request information” or “compare qualified options.”


## V3 monetization ideas added by the upgrade

- Offer the document locator PDF as a second newsletter lead magnet after the main will preparation packet.
- Add a compliant sponsored placement for secure document storage categories only after vetting the advertiser and adding clear disclosures.
- Use the 7-day plan as the email nurture sequence structure: one practical email per day, no legal advice, with links back to the site tools.
- Consider a future paid printable bundle that combines the will prep packet, document locator, family conversation worksheet, and annual review checklist.

## V4 monetization path: Planning Help page

The new `pages/request-planning-help.html` page is designed as a future conversion hub. Keep it conservative:

1. Replace `LEAD_FORM_ENDPOINT_PLACEHOLDER` only after you know who receives the inquiry and how it is handled.
2. Add clear disclosure if the page routes visitors to attorney referral partners, online will-making platforms, sponsored listings, or affiliate links.
3. Do not imply that Will Checklist is a law firm, screens attorneys, guarantees consultation availability, or can decide what legal documents a person needs.
4. Keep the initial form non-confidential. Do not ask for account numbers, Social Security numbers, passwords, or sensitive family conflict details.
5. Use the dashboard as a soft conversion: after progress is started, invite visitors to download the packet, join the email list, or prepare a safe planning-help request.

## V5 monetization notes

The planning summary builder is a strong pre-conversion page. Route users from the summary builder to the planning-help form, affiliate comparison page, newsletter PDF, or future paid workbook. Keep language conservative: do not promise legal outcomes, do not imply attorney matching unless a real provider relationship exists, and keep disclosures near monetized links.


## V6 monetization path

The new recommended funnel is:

1. Homepage → Start Here Assessment
2. Start Here → Dashboard
3. Dashboard → Checklist and Document Locator
4. Summary Builder → Planning Help Request or 5-Day Email Course
5. Email Course → affiliate/resource comparison or professional lead flow

The 5-day course page uses `NEWSLETTER_ENDPOINT_PLACEHOLDER`. Connect it to your real email provider before promotion.

## V7 monetization notes

The Readiness Scorecard, Beneficiary Review Worksheet, and Estate Binder Index Builder create stronger intent signals before monetization. Good next monetization placements are:

- A non-intrusive affiliate/resource box after the scorecard result.
- A planning-help CTA after the binder index is generated.
- A newsletter prompt offering the printable binder index and will preparation packet together.

Do not imply that an affiliate tool is legally sufficient or attorney-approved unless you have documented support for that claim.


## V8 UX monetization note

Keep monetization behind the guided flow. Do not interrupt the first few steps with ads or aggressive affiliate blocks. The most natural conversion points are after the Summary Builder, Decision Helper, Download page, and Planning Help Request page.


## V9 usability-first monetization note

Keep monetized links secondary to the guided flow. Do not interrupt the first-use path with popups. Add offers only after a user completes a meaningful action, such as finishing the summary builder or downloading a packet.


## V10 usability upgrade

- Added a one-question-at-a-time setup at `/pages/onboarding-wizard.html`.
- Added a Quick-Start Guide page and printable PDF at `/pages/quick-start-guide.html` and `/assets/downloads/will-checklist-quick-start-guide.pdf`.
- Updated navigation so first-time users have fewer choices and clearer next steps.
- Continue to upload only `/site` publicly; private builder notes stay outside the public folder.


## V11 placeholder fallback behavior

Until email or lead endpoints are connected, forms display a clear fallback message. Newsletter forms direct users to the downloadable PDF instead of pretending an email was sent. Lead forms warn that the submission path is not connected and should not receive confidential details. Remove or revise those fallback messages only after connecting real providers and testing consent, privacy, and delivery.


## V13 public-test update

This version pauses public newsletter, lead, affiliate, and display-ad placeholders so real users do not hit dead submissions or misleading monetization. Use the site as a working planning tool first. See `PUBLIC_TEST_READINESS.md`, `USABILITY_TEST_SCRIPT.md`, and `OWNER_LAUNCH_INPUTS_DRAFT.md`.
