# Robot Dungeon: Python Quest

A first playable coding adventure built for Emmy and Alex.

Kids guide Byte the robot through grid missions with Python-style commands:

```python
move()
turn_right()
collect()

repeat(3):
    move()

if wall_ahead():
    turn_left()
```

## Open It

Open `index.html` directly in a browser, or run:

```bash
npm run dev
```

## What Is In This First Build

- 12 playable missions
- Emmy and Alex player profiles
- Local progress saving in `localStorage`
- Python-style command parser
- Loops and conditionals
- Kid-friendly hints from Nova
- Command buttons for younger players
- Welcome and mission-complete screens
- Parent progress drawer with export/reset controls
- Static app with no required install step

## Verification

```bash
npm test
```

The browser verification pass also runs every starter mission, checks the parent drawer, and checks mobile layout overflow.
