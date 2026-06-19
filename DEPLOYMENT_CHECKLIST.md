# Deployment Checklist

- [ ] Upload the contents of `/site` to hosting.
- [ ] Keep `/assets`, `/pages`, and `/assets/downloads` paths intact.
- [ ] Open `index.html` locally and on hosting.
- [ ] Open `pages/interactive-will-checklist.html` and verify progress saves after refresh.
- [ ] Test the PDF download link: `assets/downloads/will-preparation-packet.pdf`.
- [ ] Replace `NEWSLETTER_ENDPOINT_PLACEHOLDER`.
- [ ] Replace `LEAD_FORM_ENDPOINT_PLACEHOLDER`.
- [ ] Replace affiliate link placeholders only with approved links.
- [ ] Add analytics only after replacing `ANALYTICS_ID_PLACEHOLDER`.
- [ ] Add display ad code only after network approval.
- [ ] Test all forms.
- [ ] Test all internal links.
- [ ] Connect the domain.
- [ ] Add Search Console.
- [ ] Submit `sitemap.xml`.
- [ ] Check mobile layout.
- [ ] Check page speed.
- [ ] Confirm disclosures appear near monetized links.
- [ ] Confirm images and PDF are original.
- [ ] Confirm no attorney-review claims are added unless documented.
- [ ] Confirm content remains general educational information only.


## Additional checks for second upgrade

- Test the decision helper by checking high, medium, and low-complexity answers.
- Test that state finder buttons generate state-specific official-resource searches.
- Test meeting prep copy, print, save, and clear behavior.
- Confirm external links open to current official resources before launch.
- Do not collect sensitive estate planning data unless you have an appropriate secure backend and privacy review.


## V3 tool checks before launch

- Test document locator local save, copy, reset, print, and PDF download.
- Test family conversation guide generate, copy, reset, and print behavior.
- Test 7-day plan progress bar, local save, copy, reset, and print behavior.
- Open `assets/downloads/document-locator-card.pdf` and confirm it renders correctly.
- Confirm privacy messaging around local storage and sensitive data is visible.

## V4 pre-public checks

- [ ] Upload only the public site files.
- [ ] Open `pages/planning-dashboard.html` after using at least one tool to confirm local progress appears.
- [ ] Open `pages/request-planning-help.html` and confirm the form placeholder message appears until a real endpoint is connected.
- [ ] Confirm public pages do not contain hidden keyword-stuffing or private builder notes.
- [ ] Confirm all lead and affiliate disclosures remain visible near conversion elements.

## V5 checks

- Open the planning summary builder and confirm it can build/copy/print a brief.
- Open the final review checklist and confirm progress saves locally.
- Search the glossary for “beneficiary,” “executor,” and “probate.”
- Confirm private production notes are not uploaded to public hosting.


## V6 checks

- [ ] Test `pages/start-here.html` assessment save, copy, print, and reset.
- [ ] Test dashboard JSON export and import in a fresh browser profile.
- [ ] Test `pages/annual-review-planner.html` reminder builder.
- [ ] Replace the newsletter endpoint on `pages/five-day-email-course.html` before collecting signups.
- [ ] Confirm private production notes are not uploaded publicly.

## V7 deployment checks

- Open the Readiness Scorecard and verify progress saves after refresh.
- Open the Beneficiary Review Worksheet and verify add/remove/copy/print functions.
- Open the Estate Binder Index Builder and verify the PDF download works.
- Confirm `estate-binder-index.pdf` opens correctly after upload.
- Confirm private builder notes are not uploaded publicly unless intentionally kept outside the web root.


## V8 publication check

- Open `pages/guided-flow.html` and confirm the step-by-step path is visible.
- Type a fake SSN format such as `123-45-6789` into a non-email test field and confirm the privacy warning appears; remove it before publishing screenshots.
- Confirm the quick-use strip appears below the header on public pages.
- Confirm the dashboard next-step panel links to the next unfinished tool.

- Test the floating “Need help?” panel on desktop and mobile.
- Open `pages/how-to-use.html` and `pages/safe-input-examples.html` before launch.
- Confirm form helper text does not cover or break any input on mobile.


## V10 usability upgrade

- Added a one-question-at-a-time setup at `/pages/onboarding-wizard.html`.
- Added a Quick-Start Guide page and printable PDF at `/pages/quick-start-guide.html` and `/assets/downloads/will-checklist-quick-start-guide.pdf`.
- Updated navigation so first-time users have fewer choices and clearer next steps.
- Continue to upload only `/site` publicly; private builder notes stay outside the public folder.


## V11 pre-public usability checks

- [ ] Open the homepage in a private/incognito browser and confirm the first-visit welcome modal appears.
- [ ] Click `Continue` before entering progress and confirm it points to the Setup.
- [ ] Complete part of the checklist, then return to `Continue` and confirm the next-step recommendation changes.
- [ ] Confirm placeholder email/lead forms show fallback messages and do not imply successful submission.
- [ ] Confirm each major tool page shows a recommended next-step card near the bottom.


## V12 usability checks before sharing

- Open the homepage on mobile and desktop. Confirm the first visible button is “Start setup.”
- Confirm the top nav has only Home, Start, Continue, Dashboard, Help, and Print guide.
- Confirm the Help button is small and not visually distracting.
- Confirm placeholder forms are connected or clearly marked as not connected.
- Confirm no page asks users to enter passwords, SSNs, full account numbers, safe codes, private keys, or seed phrases.


## V13 public-test update

This version pauses public newsletter, lead, affiliate, and display-ad placeholders so real users do not hit dead submissions or misleading monetization. Use the site as a working planning tool first. See `PUBLIC_TEST_READINESS.md`, `USABILITY_TEST_SCRIPT.md`, and `OWNER_LAUNCH_INPUTS_DRAFT.md`.


## V79 default GitHub Pages launch note

For now, no custom domain is needed. Use `https://noahbsark.github.io/willchecklist/`. Later, when a custom domain is ready, add a `CNAME` file and update canonical, Open Graph, sitemap, and robots URLs.
