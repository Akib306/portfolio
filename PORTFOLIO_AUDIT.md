# Portfolio audit — 2026-10-04

Reviewed the local checkout and its existing uncommitted experience work, then compared content against the current GitHub profile and public project repositories. Extended the existing experience model, component, and tests. The follow-up restores terminal path conventions and the requested clear animation.

## Findings, solution plan, and outcome

The repair order was: restore accessible interaction, correct scrolling and mobile layout, replace placeholder content using primary sources, then verify the result with unit tests and a real browser.

| Issue                                                                                                                              | Solution implemented                                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Tab and Shift+Tab were intercepted, trapping keyboard users in the command input.                                                  | Preserve native Tab navigation. Use Alt+Up/Down to select a project and Alt+Right to toggle it; project buttons also support native Enter/Space.                                                                                                                    |
| Clicking projects, links, or ordinary text moved focus to the input. Automatic focus could open the mobile keyboard on arrival.    | Remove container click-to-focus and initial autofocus. Preserve the chosen control's focus; focus the input after deliberate form submission.                                                                                                                       |
| Opening or closing case studies scrolled output to the bottom.                                                                     | Expansion preserves reading position. Follow new command output only when already near the bottom; offer “Show latest output” otherwise.                                                                                                                            |
| The page initially rendered an empty terminal and waited about four seconds for its introduction and projects.                     | Render introduction, projects, contact links, and the prompt immediately, including server-rendered HTML.                                                                                                                                                           |
| Minimum heights of 520/640px exceeded short viewports. The prompt and shortcuts disappeared below long case studies.               | Use a dynamic viewport, an independently scrolling output region, and persistent command controls.                                                                                                                                                                  |
| Small input text and keyboard-only command submission made mobile interaction awkward.                                             | Use a 16px input, a native form submitted with Enter, mobile enter-key hints, and larger touch targets. Keep mobile shortcuts in one horizontally scrollable row.                                                                                                   |
| Muted text had low contrast against the dark background.                                                                           | Change muted text from `#5c6370` to `#929bad`; add consistent visible focus outlines.                                                                                                                                                                               |
| Contact output was plain text, with no persistent profile links.                                                                   | Keep GitHub and LinkedIn profile anchors; contact details remain available through `cat contact.txt`. Label project source/demo links and disclose new-tab behavior.                                                                                                |
| The local introduction was stale and four project case studies still contained template text and unrelated design roles.           | Use a degree-neutral university introduction and both roles from the current GitHub profile. Replace templates with CampusFind, SeamlessAI, and 8Ball+ descriptions. Removed DevTalk at the owner’s request.                                                        |
| Project lists showed arbitrary file sizes and squeezed/truncated descriptions at tablet widths.                                    | Display project type and activity year, wrap descriptions, and enable the wide table only at 1024px. Experience cards show the actual role, organization, and period instead of file metadata.                                                                      |
| Empty input created empty prompts, extra whitespace broke commands, shortcuts erased drafts, and clear restarted the delayed boot. | Ignore empty submissions, normalize whitespace, preserve drafts, and reset the session on clear with a staggered fade-in while keeping controls available. List directories and files relative to `~`: `ls projects`, `ls experiences`, and `cat experiences/<id>`. |
| Starter manifest names and icon did not represent the portfolio.                                                                   | Add a terminal favicon, correct manifest branding/colors, and update document title and description.                                                                                                                                                                |
| Case studies displayed empty image placeholders with no useful project destination.                                                | Remove empty placeholders and add verified source links plus the reachable CampusFind and 8Ball+ demos.                                                                                                                                                             |

Router devtools were present in the remote snapshot but had already been removed in this local checkout. No further repair was needed. Project screenshots exist on remote `main` but are absent locally; the implementation does not reference missing assets.

## Content accuracy and sources

- [Current GitHub profile](https://github.com/Akib306/Akib306/blob/main/README.md): Computer Science at the University of Saskatchewan; current co-op with SSC CanAI; Computer Vision & Robotics Developer at USask. Retained the locally supplied 12-month co-op duration. Removed the unverified third-year label.
- [CampusFind README](https://github.com/Akib306/Campus-Find/blob/main/README.md): Next.js, Supabase, campus email sign-in, searchable item reports, and messaging.
- [Seemless Chat README](https://github.com/Akib306/seemless.chat/blob/main/README.md): streaming multi-model chat, Google/OpenAI integration, authentication, saved history, full-text search, Markdown and math. The repository spells its name “Seemless Chat”; retained the portfolio's SeamlessAI branding.
- [8Ball contribution record](https://github.com/Akib306/8Ball/blob/main/who_worked_on_what.txt): specifically attributes ball generation and physics, scoring/rules, scene management, winner display, and confetti to Motasin/Akib306.

Case-study problem/insight paragraphs are editorial summaries of those documented features. They do not claim measured outcomes or independently verified team leadership. Unlinked latency measurements, percentage improvements, and unsupported provider claims from the remote portfolio were not imported. Displayed project years indicate repository activity rather than precise launch dates.

## Verification

- Existing baseline: 11 Vitest tests and TypeScript passed before changes.
- Follow-up verification: 26 Vitest tests, ESLint, TypeScript, Prettier, and the production build passed. Generated router output is excluded from formatting checks.
- Chrome checks cover native Enter submission and Tab focus navigation, focus after project expansion, shortcut draft preservation, overflow at 320×568, 390×844, 667×375, 768×600, and 1024×768, and useful server rendering with JavaScript disabled.
- Desktop, expanded case-study, and mobile screenshots were visually inspected.
- Direct HTTP checks returned 200 for CampusFind and 8Ball+. The SeamlessAI domain failed its TLS connection, so a live link is not offered for that project.

## LinkedIn follow-up and verification limits

The newly available BrowserUse connector reached the [public LinkedIn profile](https://ca.linkedin.com/in/akiba8728a), after earlier curl and isolated Chrome attempts encountered access restrictions. Public preview and search snippets confirm the headline “SWE Co-op @ SSC CanAI | CV & Robotics Dev @ Usask,” Government of Canada employment, a co-op beginning September 2026, University of Saskatchewan education (2023–2027), and computer-vision, geospatial, and autonomous-flight work for precision-agriculture research, including NDVI segmentation and multispectral crop work.

The full About section and complete job descriptions were not exposed. The co-op details therefore describe only the confirmed role, organization, location, and timeline; they do not invent responsibilities. Robotics search snippets disagree between May–August 2026 and September 2026–present. The current GitHub profile confirms the role as current, so the portfolio uses “2026 · current role” without an exact start month. Full experience and education detail pages require authentication. The Windows computer-use runtime still rejects the Linux workspace URI; the public browser connector provided the usable profile evidence.

## Follow-up fixes

- Removed DevTalk, the Email navigation link, the submit Run button, and the detached animated caret. The input uses the native caret with the terminal accent color.
- Updated boot output, help, command shortcuts, and bare `ls` to home-relative paths. Added relative `./` and `~/` support and actionable errors for absolute directory paths.
- Added expandable, keyboard-accessible experience details and `cat experiences/<id>` support. Disclosure state is independent between repeated lists.
- Restored the clear fade-in with CSS rather than delayed content insertion. Initial content remains server rendered immediately; reduced-motion users receive an immediate reset. Clear resets reading position and disclosures.
- Renamed the project metadata heading from STATUS to TYPE and added a mobile shortcut scrolling hint.

- The follow-up browser review found the latest-output recovery button offscreen inside the mobile shortcut strip. Moved it outside the strip so new results remain reachable without interrupting reading. Limited regular prose output to 75 characters per line for desktop readability.

## Experience-first presentation follow-up

Experiences now print by default on startup and after `clear`, preserving the fade-in reset. Projects remain available through `ls projects`, `cat projects/<id>`, and the projects shortcut. Project rows use the same stacked filename, description, and muted metadata pattern as experiences at every viewport; expanded project details also match the experience typography and panel border.

## Simplified navigation and commands follow-up

Removed the name-and-profile navigation bar and moved profile access to the `socials` command and shortcut (`cat socials.txt` also works). Former contact commands resolve to social links without exposing email or printing the site domain. Removed the focus field, command file, shortcut, and startup output; the biography already describes the development focus. Startup now prints the name and role under `whoami`. Help is grouped into commands and file examples, and terminal prose uses a 120-character maximum width with natural viewport wrapping.
