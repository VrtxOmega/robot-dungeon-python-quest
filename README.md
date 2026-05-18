# Robot Dungeon: Python Quest

**VERITAS public preview:** a cozy coding adventure where young players guide Byte the robot through puzzle missions using Python-style commands.

[Play the live game](https://vrtxomega.github.io/robot-dungeon-python-quest/) | [View the repo](https://github.com/VrtxOmega/robot-dungeon-python-quest)

## Overview

Robot Dungeon is a browser-based learning game for early coding practice. Kids solve grid puzzles by sequencing commands, using turns, trying loops, reading hints, and watching Byte move through a warm dungeon world filled with gems, portals, batteries, and reward badges.

The current release is a static web app with no backend, no account system, and no required install step. It is designed to be easy to run locally, safe to publish on GitHub Pages, and simple enough for families or classrooms to try.

## VERITAS Posture

This project follows a small but strict public-release checklist:

| Principle | Current release posture |
| --- | --- |
| Verification | `npm test`, syntax checks, and browser regression passes were run before publishing. |
| Evidence | Release state is backed by local tests, GitHub Pages workflow status, and live URL checks. |
| Reliability | The app is static HTML, CSS, and JavaScript, with no server dependency during play. |
| Integrity | Public source was swept for personal names, local machine paths, private keys, and token patterns. |
| Transparency | Progress, names, and rewards are local-only browser data. |
| Audit | GitHub Pages deployment is handled by a committed workflow in `.github/workflows/deploy-pages.yml`. |
| Safety | The game uses generic player profiles and parent-configurable names for public release. |

## Live Release

Production URL:

```text
https://vrtxomega.github.io/robot-dungeon-python-quest/
```

GitHub Pages is deployed from `main` using the `Deploy GitHub Pages` workflow.

## Player Modes

| Mode | Designed for | Experience |
| --- | --- | --- |
| Builder Mode / Code Mode | Readers and early coders | Real Python-style starter code, editable command bank, optional live code preview. |
| Explorer Mode / Easy Mode | Younger players and pre-readers | Big tap-friendly command cards, visual movement preview, command voice reinforcement. |

Parent setup lets a grown-up rename the two profiles. Names stay in the browser only and are not part of the source code or exported progress.

## Gameplay Features

- 12 playable missions
- Byte the robot on a dungeon grid board
- Python-style commands: `move()`, `turn_left()`, `turn_right()`, `collect()`
- Loops with `repeat(n):`
- Conditionals with `if wall_ahead():` and `if gem_here():`
- Explorer Mode visual command preview
- Builder Mode optional live code preview
- Mission narration and command voice clips
- Per-profile reward badges
- Parent progress drawer with local export and reset controls
- Mobile-friendly layout with no required app install

## Example Code

```python
move()
turn_right()
collect()

repeat(3):
    move()

if wall_ahead():
    turn_left()
```

## Privacy Model

Robot Dungeon is local-first:

- No backend service
- No analytics
- No cookies
- No login
- No third-party database
- Player display names are stored only in browser `localStorage`
- Progress and rewards are stored only in browser `localStorage`

Clearing browser site data clears names and progress.

## Quick Start

Open the app directly:

```bash
xdg-open index.html
```

Or serve it locally:

```bash
npm run dev
```

Then open the local URL printed by the dev server.

## Validation

Run the JavaScript test harness:

```bash
npm test
```

The release validation also included:

- `node --check game.js`
- Full browser regression for all 12 missions
- Explorer Mode mission 3 Repeat Move preview and completion
- Builder Mode mission 3 loop code and live preview
- Invalid half-typed Builder code safety check
- Per-profile Reward Room check
- Mobile horizontal overflow check
- Console error check
- Secret, path, and personal-name sweep

## Project Layout

```text
.
|-- index.html
|-- styles.css
|-- game.js
|-- game.test.js
|-- assets/
|   `-- voice/
|-- .github/
|   `-- workflows/
|       `-- deploy-pages.yml
|-- SECURITY.md
`-- package.json
```

## Deployment

The app is deployed as a static site through GitHub Pages.

```text
main -> GitHub Actions -> Pages artifact -> GitHub Pages
```

No build step is required. The workflow uploads the repository root as the static site.

## Roadmap

- Add more mission worlds
- Add a parent-created profile setup flow on first launch
- Add optional classroom progress export formats
- Add more voice styles and sound settings
- Add creator mode for building custom levels
- Add a public regression script committed to the repo

## License

This public preview is currently source-available and marked `UNLICENSED`. No open-source license has been granted yet.
