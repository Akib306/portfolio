---
target: src/TerminalPortfolio.tsx
total_score: 28
max_score: 40
na_heuristics:
p0_count: 0
p1_count: 2
target_identity: 'file:/home/akib/dev/portfolio/src/TerminalPortfolio.tsx'
target_fingerprint: 'sha256:e5622dec5362fed48f0f2b309ec1f6e2a3f3eb34e78cb41ab6404f7bfb6d3919'
target_path: /home/akib/dev/portfolio/src/TerminalPortfolio.tsx
timestamp: 2026-10-04T22-12-05Z
slug: src-terminalportfolio-tsx
---

Method: dual-agent (A: /root/critique_design · B: /root/critique_evidence)

Implemented the requested terminal refinements: restored the clear fade-in, removed DevTalk, removed Email from navigation and the standalone Run button, used the native input caret, and made directory commands relative to ~. Experiences now expand and support cat experiences/<id>. Also moved latest-output recovery outside the mobile shortcut scroller and limited prose to 75ch.

The browser connector reached the public LinkedIn preview. Experience copy now includes the Government of Canada / SSC CanAI co-op and University of Saskatchewan precision-agriculture work involving computer vision, geospatial systems, autonomous flight, NDVI segmentation and multispectral crop work. Full job descriptions remain restricted, and conflicting robotics dates are documented rather than guessed. Sources: [LinkedIn](https://ca.linkedin.com/in/akiba8728a) and [current GitHub profile](https://github.com/Akib306/Akib306/blob/main/README.md).

The independent pre-fix design review scored **28/40 — Good**. This is the baseline assessment, not a fresh score for the repaired version. All ten heuristics apply because this portfolio includes an interactive command interface.

| Heuristic               | Score / 4 | Pre-fix finding                                      |
| ----------------------- | --------: | ---------------------------------------------------- |
| System status           |         3 | Detached caret misrepresented insertion position.    |
| Match with real world   |         2 | Root paths contradicted the home-directory prompt.   |
| User control            |         3 | Clear left an empty output region.                   |
| Consistency             |         2 | Projects expanded; experiences did not.              |
| Error prevention        |         3 | Visible home-relative commands failed.               |
| Recognition over recall |         3 | Mobile concealed secondary shortcuts.                |
| Efficiency              |         3 | Useful keyboard and click paths already existed.     |
| Minimalism              |         3 | Redundant controls competed with work evidence.      |
| Error recovery          |         3 | Recovery guidance used inconsistent paths.           |
| Help                    |         3 | Guidance existed but inherited path inconsistencies. |
| **Total**               | **28/40** | **Good**                                             |

**Design specificity:** The terminal is coherent and authored through prompts, file names, syntax colors and inline reading. The familiar CRT styling gains personal character from concrete project and experience evidence. Preserve that identity.

**What works:** Inline details keep evidence beside its source row; native controls and visible focus support keyboard use; responsive rows and a persistent prompt keep navigation available.

**Priority issues and implemented solutions:**

- **[P1] Experience evidence was too thin.** Visitors could see titles but could not evaluate the work. Added expandable summaries, confirmed responsibilities, timelines and profile links. The co-op entry remains limited to confirmed role, organization, location and timeline because its full description was unavailable. Corresponding command: `$impeccable clarify`.
- **[P1] Terminal behavior and recovery were inconsistent.** Root paths, the detached caret and redundant Run control undermined the metaphor; mobile visitors could miss new output because recovery was offscreen. Added relative paths, native caret and Enter submission, restored clear animation, and made latest-output recovery visible outside the shortcut scroller. Removed redundant navigation and DevTalk as requested. Corresponding command: `$impeccable harden`.

**Personas:** Jordan can now open experiences without learning commands. Casey gets a shortcut scrolling cue and visible recovery for newly appended results. Sam retains native Tab navigation, disclosure state and focus; command announcements still require navigating into output to read the result.

**Cognitive load and emotional journey:** The baseline had moderate load from eight equally weighted shortcuts, weak grouping and introductory shell scaffolding. Removing redundant controls and adding experience disclosure improves the path from curiosity to useful evidence. The restored clear fade makes session re-entry intentional. Eight shortcuts and the tall phone introduction remain minor opportunities for future refinement.

**Detector and browser evidence:** CLI scanning the five rendering TSX files returned zero findings. The injected browser detector flagged one repeating-gradient scanline pattern, a false positive against the explicitly retained terminal aesthetic. Headless injection succeeded, but no user-visible overlay is available. Desktop and mobile screenshots plus browser behavior supplied the visual evidence.

**Verification:** 26 tests, ESLint, TypeScript, Prettier and production build passed. Browser checks confirmed Enter submission, insertion-position caret behavior, experience expansion, relative paths, clear fade/reset and visible latest-output recovery at 1280, 390 and 320px widths, with no page errors or horizontal overflow. Reduced-motion handling was verified in source.

Questions skipped: two priority issue groups; the user's requested changes already defined the scope.
