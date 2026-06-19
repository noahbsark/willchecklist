# Simple GUI Notes for V15

The public experience should feel like one path, not a library of tools.

## Primary path
1. Home
2. Simple Path
3. Setup
4. Main Checklist
5. Document Locator
6. Beneficiary Review
7. Planning Summary
8. Final Review

## GUI rules
- One primary button per screen whenever possible.
- Use plain labels: Start, Continue, Progress, Help, Print Guide.
- Avoid showing advanced worksheets unless the user asks for them.
- Repeat the safety rule, but keep it calm and short.
- Prefer cards with short text over long explanation blocks.

## Safety copy
Use labels and locations, not private numbers or passwords.


## V16 simplification rule
The public experience should be treated as one six-step path: Setup, Checklist, Documents, Beneficiaries, Summary, Final Review. Keep advanced pages available from footer/sitemap only unless user testing shows they are needed in the main path.

Core tool pages now hide sidebars and show a consistent stepper so users always know where they are.


## V17 simplification pass
- Core pages now hide the global helper strip to reduce repeated instructions.
- Each core page ends with one primary next-step button instead of competing actions.
- Completion feedback now says the step is saved and focuses the next button.
- Keep future changes aligned with this rule: one screen, one most important action.

## V19 direct-start rule

The visible experience should start the user immediately. Main navigation should link **Start** to `pages/onboarding-wizard.html`, not to an overview page. The overview page can remain available as "How it works," but it should not be a required extra click before starting.

Keep the main path simple:

1. Start Step 1
2. Continue where left off
3. Progress
4. Help
5. Print guide

Avoid adding new top-level navigation links unless they replace one of the above.


## V20 simplification pass
- Core pages now use shorter hero text and a calmer single-column layout.
- The main task is visually prioritized over print, copy, and backup options.
- Each core page uses the same three-part brief: Do this / Safe to write / Do not write.
- Completion panels now use shorter labels and one full-width next button.


## V21 simplicity note
V21 makes the six-step path more direct. Core step pages now use a primary "Save and go" button so users do not have to understand separate save/next actions. Optional help is tucked into a small expandable panel.


## V22 simplicity update

The six core pages now use one primary finish action: save the current step and continue to the next step. Avoid reintroducing separate completion buttons unless user testing shows a real need.


## V23 note

Keep the six core pages as the main experience. The floating Help button is hidden there on purpose; use the small local help dropdown instead. On mobile, the bottom Next button should remain short and should only advance to the next core step.


## V24 rule

Core pages should not look like articles. They should look like one task at a time:

1. Step title
2. Simple progress strip
3. Safe input rule
4. The task
5. One save-and-next button

Avoid adding new cards, banners, or sidebars to the six core pages.

## V25 plain-flow rule

Do not add new visible choices to the six core pages unless they directly help the user complete the current step. Each core page should keep this order:

1. Step name
2. One short safety line
3. Main task
4. Optional copy/print/reset drawer
5. One Next button

Avoid adding extra cards, sidebars, large illustrations, popups, or multiple CTAs to the core pages.


## V26 note

Keep the six core pages calm: no repeated quick-start strips, one main next button, safe placeholders, and reset confirmation.


## V27 simplicity note

The six-step path now ends on `pages/done.html`. Keep that page calm: three next actions only — save/print, share safely, and confirm offline with a qualified source if needed. Do not turn it into another dashboard.


## V28 simplicity rule

Show progress without asking for another choice. The step strip may show completed steps, but the bottom of each core page should still have only one primary action: the next step.


## V29 rule
Keep Progress simple: one next action first, six core steps second, optional tools last. Do not put advanced worksheets back into the main path unless usability testing proves users need them.


## V30 simplicity update

The six core pages now share the same compact instruction pattern: one step title, one plain-language task, one safe-input reminder, the task area, and one primary next button. The goal is for users to feel like they are moving through one product, not jumping between separate tools.


## V31 update

The main header has been simplified to Start, Continue, Help, and Print guide. Progress is still available from Continue and the footer, but it no longer competes in the main navigation. A no-JavaScript notice was added so visitors understand that saved progress requires JavaScript.


## V32 simplicity note

The six-step strip on core pages is now a progress indicator rather than a second navigation menu. Users move forward with the one bottom button, which saves progress and opens the next step.

## V33 simplicity note

Keep Continue and Progress as utility pages, not second homepages. They should show one recommended next action first, then the six-step path, then optional tools only if needed.

On the six core pages, avoid reintroducing duplicate instruction panels. The page should feel like a task screen, not an article.


## V34 touch and readability rules

- Keep buttons, checkbox rows, radio choices, and summaries at least 44px tall.
- Do not add competing primary buttons to core pages.
- Keep the six-step flow unchanged unless user testing shows a clear problem.
- Preserve strong focus states for keyboard users.

## V35 source-clean rule
For the six core step pages, do not re-add duplicate hero sections, repeated quick-start strips, or extra instruction panels. Keep the public flow to one step header, one safety line, the task, and one next action.


## V36 simplification update

V36 removes several source-level distractions from the six core pages: sidebars, optional FAQ blocks, ad placeholders, and old optional cards. The public core flow should now read as one simple path: step title, safety line, task, one next action.


## V37 rule

Continue and Progress should not feel like dashboards full of choices. Continue should show one next action. Progress may show the six-step list, but the recommended action must remain the first and most prominent element.


## V38 simplicity pass

V38 keeps the site focused on the six-step flow. It removes remaining non-core explanation blocks from the core pages, unifies the safety notice, shortens the Guide label, and reduces next-step cards to one primary action.


## V39 simplicity note

V39 reduces public chrome: footers are shorter, duplicate footer columns are removed, and the homepage uses one short “How it works” note instead of multiple linked cards. The main six-step path remains unchanged.


## V40 simplicity update

V40 reduces the homepage and finish page to the smallest practical set of actions. The public experience should continue to emphasize one path: Start Step 1, complete the six core steps, and review/print a summary. Avoid adding new top-navigation items unless they support that path directly.

## V41 simplicity rule

Do not add alternate routes at the end of Step 1. The setup step should finish by sending users to Step 2: Checklist. Optional tools can remain available from Help, the sitemap, or lower-page links, but they should not interrupt the six-step path.

## V42 simplicity note

The setup wizard should always show only the controls that make sense for the current question. Keep the next button inactive until an answer is selected, and do not show a Previous button on the first question.


## V43 simplicity rule
Do not add more actions to the bottom of core pages. Keep one primary next button, one quiet save-status line, and no competing secondary buttons.

## V44 simplicity note

V44 keeps the six-step flow unchanged. It improves clarity by making selected choices easier to see and by hiding field helper text until the user focuses a field. The goal is a cleaner screen with help available only when needed.


## V45 flow guidance
Keep Step 1 questions plain and concrete. Avoid adding branches that send users away from the six-step path. The setup can personalize wording, but the next action should stay Step 2: Checklist.


## V46 note

V46 keeps the same six-step path but improves the setup questions and answer choices. Step 1 now includes short answer hints and a safety check that explains why private numbers, passwords, safe codes, and SSNs should not be entered.


## V47 note

V47 improves the wording and flow of the six-step experience: shorter checklist groups, clearer step prompts, safer examples, simpler summary options, and a shorter final review.


## V48 note

V48 improves questions, answers, and flow without adding new tools. Each core step now has a simple question and a short “Done when” line so users know what counts as enough before continuing.


## V49 rule

Keep the safety check first. Do not ask for planning details before reminding users what is safe to write. Each core page should keep one main next button and one short “done when” line.


## V50 simplicity note

Step 1 now has four questions instead of five. Keep future setup questions short and only ask something if it changes user understanding or prevents misuse.

## V51 simplicity note

Step 1 is now only two questions: the safety check and one extra-care flag. Avoid adding setup questions unless the answer changes the next step or prevents unsafe use.


## V52 simplicity update

Step 1 was shortened to two questions: first a safety example, then one extra-care flag. The removed goal question did not change the path, so removing it makes the start faster and less confusing.


## V53 simplicity note

Do not add more setup questions unless they change the user path. Step 1 should remain one safety confirmation so the product starts quickly and safely.


## V54 rule
Do not re-enable global injected next-step cards. Each page should have only one primary next action. Advanced tools may exist, but should not be pushed automatically after the six-step finish.


## V55 launch polish

- The top navigation is calmer: Guide is no longer styled as the main button.
- A simple 404 page is included for broken or old links.
- `CNAME` and `.nojekyll` are included for easier GitHub Pages hosting.
- The six-step flow remains the only recommended main path.


## V56 simplicity note

V56 is the recommended baseline for usability testing. It keeps the six-step path simple, hides copy-preview blocks from the main flow, and prevents continuing when the privacy guard has flagged private-looking information.


## V57 update

V57 keeps the six-step flow unchanged while improving the GUI: beneficiary rows now behave like simple cards, the summary builder is single-column, and core pages use calmer spacing and clearer focus states.


## V59 rule

Keep help to one sentence near the task. Prefer examples over explanations. Every core step should have one visible primary action and no competing navigation inside the task area.


## V60 rule

Do not re-add quiz-style setup questions unless they change the user's path. Step 1 should stay as a simple safety confirmation.


## V65 GUI rule
Do not add more top-level choices. Keep the homepage to Start and Continue, keep core pages to one task and one next button, and keep secondary tools inside collapsed drawers.


## V67 simplicity rule

Keep the main public path visually consistent: one step title, one safety line, one task area, and one primary next button. Optional controls should remain inside the collapsed tools drawer.


## V70 update
A visual polish pass made the homepage, header, core-step panels, selected states, and mobile next buttons calmer and more consistent. No new tools or pages were added.


## V71 update

V71 is a visual/usability polish pass. It improves the homepage illustration, makes Step 1 feel like a quick confirmation instead of a quiz, and makes the six core pages feel calmer and more consistent. No new tools or user decisions were added.


## V72 note

V72 is a visual/usability polish release. It keeps the product simple, makes Start visually primary, combines duplicate safety guidance, and makes the six-step pages feel calmer and more consistent.


## V73 simplicity rule

Keep the visible product calm: one main path, one task per page, one next button. Visual polish should improve confidence without adding new choices.


## V76 guidance

Keep the public flow visually calm. Avoid showing percentage, score, or completion-pressure widgets on the six core pages. The user should see the current step, the safe-note reminder, the task, and one next button.


## V77 note
Keep the homepage premium but simple: one headline, two actions, one product preview. Do not add new homepage CTAs unless they replace an existing one.
