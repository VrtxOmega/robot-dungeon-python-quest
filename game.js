(function () {
  const DIRECTIONS = ["north", "east", "south", "west"];
  const DELTAS = {
    north: { x: 0, y: -1 },
    east: { x: 1, y: 0 },
    south: { x: 0, y: 1 },
    west: { x: -1, y: 0 },
  };
  const ROTATION = { north: -90, east: 0, south: 90, west: 180 };
  const STORAGE_KEY = "robotDungeonPythonQuest.v1";

  const levels = [
    {
      title: "Wake the Robot",
      concept: "Sequence",
      goal: "Byte sees a shiny purple gem. Tap Run and help Byte roll over to it.",
      speak: "Mission one. Byte sees a shiny purple gem. Use move, move, move, then collect. Tap Run when you are ready.",
      size: 5,
      robot: { x: 0, y: 2, dir: "east" },
      gems: [{ x: 3, y: 2 }],
      walls: [],
      starter: "move()\nmove()\nmove()\ncollect()",
      alexSolution: ["move()", "move()", "move()", "collect()"],
      hint: "Byte needs three moves, then collect.",
      maxSteps: 4,
    },
    {
      title: "Turn the Corner",
      concept: "Turns",
      goal: "Byte needs to go across, turn the corner, and drive down to the gem.",
      speak: "Mission two. Byte needs to go across, turn right, then drive down to the gem.",
      size: 5,
      robot: { x: 1, y: 1, dir: "east" },
      gems: [{ x: 3, y: 3 }],
      walls: [{ x: 4, y: 1 }, { x: 4, y: 2 }],
      starter: "move()\nmove()\nturn_right()\nmove()\nmove()\ncollect()",
      alexSolution: ["move()", "move()", "turn_right()", "move()", "move()", "collect()"],
      hint: "After two moves, Byte should turn right and go down.",
      maxSteps: 6,
    },
    {
      title: "Tiny Loop",
      concept: "Loops",
      goal: "This gem is far away. A repeat spell can make Byte move four times.",
      speak: "Mission three. This gem is far away. Repeat means do it again. Repeat move four times, then collect.",
      size: 5,
      robot: { x: 0, y: 0, dir: "east" },
      gems: [{ x: 4, y: 0 }],
      walls: [],
      starter: "repeat(4):\n    move()\ncollect()",
      alexSolution: ["repeat_move_4", "collect()"],
      hint: "A repeat block can run move four times.",
      maxSteps: 5,
    },
    {
      title: "Gem Staircase",
      concept: "Sequence",
      goal: "There are two gems. Get the first gem, turn down, then get the second gem.",
      speak: "Mission four. There are two gems. Get the first gem, turn right, go down the stairs, and get the second gem.",
      size: 6,
      robot: { x: 0, y: 0, dir: "east" },
      gems: [{ x: 2, y: 0 }, { x: 2, y: 2 }],
      walls: [{ x: 3, y: 0 }, { x: 3, y: 1 }],
      starter: "repeat(2):\n    move()\ncollect()\nturn_right()\nrepeat(2):\n    move()\ncollect()",
      alexSolution: ["move()", "move()", "collect()", "turn_right()", "move()", "move()", "collect()"],
      hint: "Collect the first gem before turning down the staircase.",
      maxSteps: 8,
    },
    {
      title: "Wall Sensor",
      concept: "Conditionals",
      goal: "A wall is blocking the path. If Byte sees a wall, turn and find the open road.",
      speak: "Mission five. A wall is blocking the path. If Byte sees a wall ahead, turn right and go around it.",
      size: 5,
      robot: { x: 2, y: 4, dir: "north" },
      gems: [{ x: 4, y: 2 }],
      walls: [{ x: 2, y: 2 }],
      starter: "move()\nif wall_ahead():\n    turn_right()\nrepeat(2):\n    move()\nturn_left()\nmove()\ncollect()",
      alexSolution: ["move()", "turn_right()", "move()", "move()", "turn_left()", "move()", "collect()"],
      hint: "When the wall is ahead, turn right and drive to the side.",
      maxSteps: 8,
    },
    {
      title: "Bug Fix Bridge",
      concept: "Debugging",
      goal: "Watch out for the red bug tile. Steer around it and grab the gem.",
      speak: "Mission six. Watch out for the red bug tile. Byte cannot touch it. Steer around the bug and collect the gem.",
      size: 6,
      robot: { x: 0, y: 5, dir: "north" },
      gems: [{ x: 3, y: 2 }],
      bugs: [{ x: 0, y: 3 }],
      walls: [{ x: 1, y: 4 }, { x: 1, y: 3 }, { x: 1, y: 2 }],
      starter: "turn_right()\nrepeat(3):\n    move()\nturn_left()\nrepeat(3):\n    move()\ncollect()",
      alexSolution: ["turn_right()", "move()", "move()", "move()", "turn_left()", "move()", "move()", "move()", "collect()"],
      hint: "The red x is a bug tile. Byte cannot step on it, so route around it.",
      maxSteps: 9,
    },
    {
      title: "Battery Before Door",
      concept: "Order",
      goal: "Byte needs power first. Pick up the green battery, then go get the gem.",
      speak: "Mission seven. Byte needs power first. Pick up the green battery, go around the wall, then collect the gem.",
      size: 6,
      robot: { x: 0, y: 1, dir: "east" },
      gems: [{ x: 5, y: 4 }],
      batteries: [{ x: 3, y: 1 }],
      walls: [{ x: 4, y: 1 }, { x: 4, y: 2 }, { x: 4, y: 3 }],
      starter: "repeat(3):\n    move()\ncollect()\nturn_right()\nrepeat(3):\n    move()\nturn_left()\nrepeat(2):\n    move()\ncollect()",
      alexSolution: ["move()", "move()", "move()", "collect()", "turn_right()", "move()", "move()", "move()", "turn_left()", "move()", "move()", "collect()"],
      hint: "Collect the battery first. Then go around the wall.",
      maxSteps: 13,
    },
    {
      title: "Gem Check",
      concept: "Conditionals",
      goal: "Byte will check each tile. If there is a gem, collect it.",
      speak: "Mission eight. Byte will check each tile. If a gem is under Byte, collect it. Keep moving until both gems are gone.",
      size: 6,
      robot: { x: 0, y: 2, dir: "east" },
      gems: [{ x: 2, y: 2 }, { x: 5, y: 2 }],
      walls: [],
      starter: "repeat(5):\n    move()\n    if gem_here():\n        collect()",
      alexSolution: ["move()", "move()", "collect()", "move()", "move()", "move()", "collect()"],
      hint: "Put if gem_here() inside the repeat block.",
      maxSteps: 10,
    },
    {
      title: "Square Patrol",
      concept: "Nested loops",
      goal: "Byte is learning a square dance. Go around the square and collect the gem.",
      speak: "Mission nine. Byte is learning a square dance. Move three times, turn right, and do that four times.",
      size: 6,
      robot: { x: 1, y: 1, dir: "east" },
      gems: [{ x: 1, y: 1 }],
      walls: [],
      starter: "repeat(4):\n    repeat(3):\n        move()\n    turn_right()\ncollect()",
      alexSolution: ["move()", "move()", "move()", "turn_right()", "move()", "move()", "move()", "turn_right()", "move()", "move()", "move()", "turn_right()", "move()", "move()", "move()", "turn_right()", "collect()"],
      hint: "A square has four sides. Each side is three moves.",
      maxSteps: 18,
    },
    {
      title: "Portal Pop",
      concept: "Portals",
      goal: "Drive into the glowing portal. It will pop Byte closer to the gem.",
      speak: "Mission ten. Drive into the glowing portal. It will pop Byte closer to the gem. Then keep going and collect it.",
      size: 6,
      robot: { x: 0, y: 0, dir: "east" },
      gems: [{ x: 4, y: 4 }],
      portals: [{ x: 2, y: 0, to: { x: 2, y: 4 } }],
      walls: [{ x: 3, y: 0 }, { x: 3, y: 1 }, { x: 3, y: 2 }, { x: 3, y: 3 }],
      starter: "repeat(2):\n    move()\nrepeat(2):\n    move()\ncollect()",
      alexSolution: ["repeat_move_4", "collect()"],
      hint: "Step on ◎, then keep moving toward the gem.",
      maxSteps: 10,
    },
    {
      title: "Alex Dash",
      concept: "Loops",
      goal: "Alex dash time. Blast straight up to the gem.",
      speak: "Mission eleven. Alex dash time. Blast straight up to the gem. Repeat move four times, then collect.",
      size: 5,
      robot: { x: 2, y: 4, dir: "north" },
      gems: [{ x: 2, y: 0 }],
      walls: [],
      starter: "repeat(4):\n    move()\ncollect()",
      alexSolution: ["repeat_move_4", "collect()"],
      hint: "Four moves north will do it.",
      maxSteps: 5,
    },
    {
      title: "Emmy's Crown Path",
      concept: "Review",
      goal: "Final path. Get all three gems and earn Byte's crown.",
      speak: "Mission twelve. Final path. Get all three gems. Go east, go north, go east, and collect each gem you find.",
      size: 7,
      robot: { x: 0, y: 6, dir: "east" },
      gems: [{ x: 3, y: 6 }, { x: 3, y: 3 }, { x: 6, y: 3 }],
      walls: [{ x: 4, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 4 }, { x: 2, y: 3 }],
      starter: "repeat(3):\n    move()\ncollect()\nturn_left()\nrepeat(3):\n    move()\ncollect()\nturn_right()\nrepeat(3):\n    move()\ncollect()",
      alexSolution: ["move()", "move()", "move()", "collect()", "turn_left()", "move()", "move()", "move()", "collect()", "turn_right()", "move()", "move()", "move()", "collect()"],
      hint: "This is a three-part path: east, north, east.",
      maxSteps: 14,
    },
  ];

  let currentLevelIndex = 0;
  let player = "Emmy";
  let state = null;
  let running = false;
  let runToken = 0;
  let voiceEnabled = false;
  let speechReady = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let speechResetTimer = null;
  let speechKeepAlive = null;
  const audioPlayer = typeof Audio !== "undefined" ? new Audio() : null;
  const commandAudioPlayer = typeof Audio !== "undefined" ? new Audio() : null;
  let progress = loadProgress();

  const board = document.getElementById("board");
  const codeInput = document.getElementById("codeInput");
  const levelSelect = document.getElementById("levelSelect");
  const runBtn = document.getElementById("runBtn");
  const resetBtn = document.getElementById("resetBtn");
  const hintBtn = document.getElementById("hintBtn");
  const nextBtn = document.getElementById("nextBtn");
  const readBtn = document.getElementById("readBtn");
  const sampleBtn = document.getElementById("sampleBtn");
  const clearBtn = document.getElementById("clearBtn");
  const alexBuilder = document.getElementById("alexBuilder");
  const alexClearBtn = document.getElementById("alexClearBtn");
  const alexHelpBtn = document.getElementById("alexHelpBtn");
  const alexRunBtn = document.getElementById("alexRunBtn");
  const alexPlan = document.getElementById("alexPlan");
  const parentBtn = document.getElementById("parentBtn");
  const rewardsBtn = document.getElementById("rewardsBtn");
  const closeParentBtn = document.getElementById("closeParentBtn");
  const closeRewardsBtn = document.getElementById("closeRewardsBtn");
  const exportBtn = document.getElementById("exportBtn");
  const resetProgressBtn = document.getElementById("resetProgressBtn");
  const startBtn = document.getElementById("startBtn");
  const replayBtn = document.getElementById("replayBtn");
  const successRewardsBtn = document.getElementById("successRewardsBtn");
  const successNextBtn = document.getElementById("successNextBtn");
  const mentorText = document.getElementById("mentorText");
  const levelTitle = document.getElementById("levelTitle");
  const levelGoal = document.getElementById("levelGoal");
  const conceptLabel = document.getElementById("conceptLabel");
  const lessonList = document.getElementById("lessonList");
  const missionNumber = document.getElementById("missionNumber");
  const facingLabel = document.getElementById("facingLabel");
  const stepLabel = document.getElementById("stepLabel");
  const stars = document.getElementById("stars");
  const progressName = document.getElementById("progressName");
  const progressText = document.getElementById("progressText");
  const progressFill = document.getElementById("progressFill");
  const worldMap = document.getElementById("worldMap");
  const mapSummary = document.getElementById("mapSummary");
  const missionPanel = document.querySelector(".mission-panel");
  const welcomeModal = document.getElementById("welcomeModal");
  const successModal = document.getElementById("successModal");
  const successText = document.getElementById("successText");
  const parentPanel = document.getElementById("parentPanel");
  const parentStats = document.getElementById("parentStats");
  const exportBox = document.getElementById("exportBox");
  const rewardPanel = document.getElementById("rewardPanel");
  const rewardGrid = document.getElementById("rewardGrid");
  const rewardName = document.getElementById("rewardName");
  const rewardIntro = document.getElementById("rewardIntro");
  const profileCard = document.getElementById("profileCard");
  const profileAvatar = document.getElementById("profileAvatar");
  const profileMode = document.getElementById("profileMode");
  const profileName = document.getElementById("profileName");
  const profileLine = document.getElementById("profileLine");

  const profiles = {
    Emmy: {
      avatar: "E",
      mode: "Code Pilot",
      line: "Ready to teach Byte real code.",
      className: "theme-emmy",
    },
    Alex: {
      avatar: "A",
      mode: "Tap Pilot",
      line: "Listen, tap, and guide Byte.",
      className: "theme-alex",
    },
  };

  const lessonNotes = {
    Sequence: ["Go one line at a time.", "When Byte lands on a gem, collect it."],
    Turns: ["Turn first, then move.", "Right turns Byte toward the next path."],
    Loops: ["Repeat means do it again.", "The tucked-in lines belong to repeat."],
    Conditionals: ["If means check first.", "When the check is true, Byte does the tucked-in command."],
    Debugging: ["If Byte bumps, that is a clue.", "Try one small change and run again."],
    Order: ["First power up.", "Then go get the gem."],
    "Nested loops": ["A repeat can live inside another repeat.", "Tiny steps can make a big shape."],
    Portals: ["Portals pop Byte to a new spot.", "Look where Byte lands before moving again."],
    Review: ["Use moves, turns, repeats, and collect.", "One gem at a time."],
  };

  const visualLabels = {
    "move()": { icon: "↑", label: "Move", voice: "move" },
    "turn_left()": { icon: "↶", label: "Left", voice: "left" },
    "turn_right()": { icon: "↷", label: "Right", voice: "right" },
    "collect()": { icon: "◆", label: "Grab", voice: "grab" },
    repeat_move_4: { icon: "×4", label: "Repeat Move", voice: "repeat-move" },
  };

  const rewards = [
    { icon: "◆", name: "Gem Finder", detail: "Found Byte's first shiny gem." },
    { icon: "↷", name: "Corner Captain", detail: "Turned Byte around a corner." },
    { icon: "×4", name: "Loop Wizard", detail: "Used a repeat spell." },
    { icon: "✦", name: "Stair Star", detail: "Collected gems on the staircase." },
    { icon: "🧭", name: "Wall Scout", detail: "Found a path around a wall." },
    { icon: "!", name: "Bug Dodger", detail: "Steered around danger." },
    { icon: "+", name: "Power Picker", detail: "Grabbed Byte's battery." },
    { icon: "?", name: "Gem Checker", detail: "Checked before collecting." },
    { icon: "□", name: "Square Dancer", detail: "Walked a perfect square." },
    { icon: "◎", name: "Portal Pilot", detail: "Rode a glowing portal." },
    { icon: "↑", name: "Dash Hero", detail: "Blasted straight to the gem." },
    { icon: "♛", name: "Crown Coder", detail: "Finished the crown path." },
  ];

  const mapIcons = ["◆", "↷", "×4", "✦", "🧭", "!", "+", "?", "□", "◎", "↑", "♛"];

  let alexCommands = [];

  function clonePoint(point) {
    return { ...point };
  }

  function key(point) {
    return `${point.x},${point.y}`;
  }

  function loadProgress() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch (error) {
      return {};
    }
  }

  function saveProgress() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
      return true;
    } catch (error) {
      setMentor("Progress could not be saved in this browser, but the mission still works.");
      return false;
    }
  }

  function playerProgress() {
    if (!progress[player]) progress[player] = { completed: {}, bestSteps: {} };
    return progress[player];
  }

  function setupLevelPicker() {
    levelSelect.innerHTML = levels
      .map((level, index) => `<option value="${index}">${index + 1}. ${level.title}</option>`)
      .join("");
    renderWorldMap();
  }

  function applyProfile() {
    const profile = profiles[player];
    document.body.classList.toggle("alex-mode", player === "Alex");
    document.body.classList.toggle("theme-emmy", player === "Emmy");
    document.body.classList.toggle("theme-alex", player === "Alex");
    profileAvatar.textContent = profile.avatar;
    profileMode.textContent = profile.mode;
    profileName.textContent = player;
    profileLine.textContent = profile.line;
    profileCard.setAttribute("aria-label", `${player}, ${profile.mode}. ${profile.line}`);
  }

  function initLevel(index, keepCode, options = {}) {
    runToken += 1;
    running = false;
    runBtn.disabled = false;
    currentLevelIndex = Math.max(0, Math.min(levels.length - 1, index));
    const level = levels[currentLevelIndex];
    state = {
      robot: clonePoint(level.robot),
      dir: level.robot.dir,
      gems: new Set((level.gems || []).map(key)),
      batteries: new Set((level.batteries || []).map(key)),
      steps: 0,
      inventory: { battery: 0 },
      won: false,
    };

    levelSelect.value = String(index);
    levelTitle.textContent = level.title;
    levelGoal.textContent = level.goal;
    conceptLabel.textContent = level.concept;
    missionNumber.textContent = String(currentLevelIndex + 1).padStart(2, "0");
    missionPanel.classList.remove("complete");
    renderLessonNotes(level.concept);
    nextBtn.disabled = true;
    if (!keepCode) {
      alexCommands = [];
      codeInput.value = player === "Alex" ? "" : level.starter;
    } else if (player === "Alex") {
      syncAlexCode();
    }
    renderAlexPlan();
    setMentor(`Hi ${player}. I can read the mission out loud. Press Read to me, then help Byte.`);
    render();
    updateProgress();
    applyProfile();
    renderWorldMap();
    if (options.speak) speakMission();
  }

  function isMissionUnlocked(index) {
    if (index === 0) return true;
    const completed = playerProgress().completed || {};
    return Boolean(completed[index]) || Boolean(completed[index - 1]);
  }

  function renderWorldMap() {
    if (!worldMap) return;
    const record = playerProgress();
    const completed = record.completed || {};
    const completeCount = Object.values(completed).filter(Boolean).length;
    mapSummary.textContent = `${player}: ${completeCount} of ${levels.length} quests complete`;
    worldMap.innerHTML = levels.map((level, index) => {
      const done = Boolean(completed[index]);
      const current = index === currentLevelIndex;
      const unlocked = isMissionUnlocked(index);
      const classes = ["map-node", done ? "complete" : "", current ? "current" : "", unlocked ? "unlocked" : "locked"].filter(Boolean).join(" ");
      const label = done ? "Done" : current ? "Now" : unlocked ? "Open" : "Locked";
      return `
        <button class="${classes}" data-map-level="${index}" type="button" ${unlocked ? "" : "disabled"} aria-label="Mission ${index + 1}: ${level.title}, ${label}">
          <span class="map-icon">${done ? "✓" : mapIcons[index]}</span>
          <strong>${index + 1}</strong>
          <small>${level.title}</small>
        </button>
      `;
    }).join("");
  }

  function renderLessonNotes(concept) {
    const notes = lessonNotes[concept] || ["Run the code and watch Byte carefully.", "Try a small change if Byte gets stuck."];
    lessonList.innerHTML = notes.map((note) => `<li>${note}</li>`).join("");
  }

  function tileAt(x, y, type) {
    const level = levels[currentLevelIndex];
    return (level[type] || []).some((point) => point.x === x && point.y === y);
  }

  function portalAt(x, y) {
    const level = levels[currentLevelIndex];
    return (level.portals || []).find((point) => point.x === x && point.y === y);
  }

  function inBounds(point) {
    const size = levels[currentLevelIndex].size;
    return point.x >= 0 && point.y >= 0 && point.x < size && point.y < size;
  }

  function wallAhead() {
    const delta = DELTAS[state.dir];
    const next = { x: state.robot.x + delta.x, y: state.robot.y + delta.y };
    return !inBounds(next) || tileAt(next.x, next.y, "walls");
  }

  function gemHere() {
    return state.gems.has(key(state.robot));
  }

  function expandVisualCommands(commands) {
    return commands.flatMap((command) => {
      if (command === "repeat_move_4") return ["move()", "move()", "move()", "move()"];
      return [command];
    });
  }

  function alexCommandToCode(command) {
    if (command === "repeat_move_4") return "repeat(4):\n    move()";
    return command;
  }

  function simulatePlan(commands, level = levels[currentLevelIndex]) {
    const expandedCommands = expandVisualCommands(commands);
    const sim = {
      robot: clonePoint(level.robot),
      dir: level.robot.dir,
      gems: new Set((level.gems || []).map(key)),
      batteries: new Set((level.batteries || []).map(key)),
      path: [],
      steps: 0,
    };

    for (const command of expandedCommands) {
      if (command === "turn_left()") {
        const index = DIRECTIONS.indexOf(sim.dir);
        sim.dir = DIRECTIONS[(index + 3) % 4];
        sim.steps += 1;
        continue;
      }

      if (command === "turn_right()") {
        const index = DIRECTIONS.indexOf(sim.dir);
        sim.dir = DIRECTIONS[(index + 1) % 4];
        sim.steps += 1;
        continue;
      }

      if (command === "collect()") {
        const pos = key(sim.robot);
        sim.gems.delete(pos);
        sim.batteries.delete(pos);
        sim.steps += 1;
        continue;
      }

      if (command === "move()") {
        const delta = DELTAS[sim.dir];
        const next = { x: sim.robot.x + delta.x, y: sim.robot.y + delta.y };
        const blocked = next.x < 0 || next.y < 0 || next.x >= level.size || next.y >= level.size
          || (level.walls || []).some((point) => point.x === next.x && point.y === next.y)
          || (level.bugs || []).some((point) => point.x === next.x && point.y === next.y);
        if (blocked) return { ...sim, ok: false, reason: "Byte might bump. Try a turn first." };
        sim.robot = next;
        const portal = (level.portals || []).find((point) => point.x === next.x && point.y === next.y);
        if (portal) sim.robot = clonePoint(portal.to);
        sim.path.push(key(sim.robot));
        sim.steps += 1;
      }
    }

    return { ...sim, ok: true };
  }

  function displayState() {
    if (player !== "Alex" || running || state.won || alexCommands.length === 0) return state;
    const preview = simulatePlan(alexCommands);
    return {
      ...state,
      robot: preview.robot,
      dir: preview.dir,
      gems: preview.gems,
      batteries: preview.batteries,
      steps: preview.steps,
    };
  }

  function ghostPathKeys() {
    if (player !== "Alex") return new Set();
    const level = levels[currentLevelIndex];
    const solution = level.alexSolution || [];
    if (!solution.length) return new Set();
    const visibleCommands = solution.slice(0, Math.min(solution.length, Math.max(alexCommands.length + 3, 4)));
    const sim = simulatePlan(visibleCommands, level);
    return new Set((sim.path || []).slice(Math.max(0, expandVisualCommands(alexCommands).filter((command) => command === "move()").length - 1)));
  }

  function render() {
    const level = levels[currentLevelIndex];
    const view = displayState();
    board.style.setProperty("--cols", level.size);
    board.innerHTML = "";
    board.style.setProperty("--robot-rotation", `${ROTATION[view.dir]}deg`);
    facingLabel.textContent = view.dir;
    stepLabel.textContent = String(view.steps);
    const ghosts = ghostPathKeys();

    for (let y = 0; y < level.size; y += 1) {
      for (let x = 0; x < level.size; x += 1) {
        const cell = document.createElement("div");
        cell.className = "cell";
        if (tileAt(x, y, "walls")) cell.classList.add("wall");
        if (tileAt(x, y, "water")) cell.classList.add("water");
        if (view.gems.has(`${x},${y}`)) cell.classList.add("gem");
        if (view.batteries.has(`${x},${y}`)) cell.classList.add("battery");
        if (tileAt(x, y, "bugs")) cell.classList.add("bug");
        if (portalAt(x, y)) cell.classList.add("portal");
        if (ghosts.has(`${x},${y}`)) cell.classList.add("ghost-path");
        if (view.robot.x === x && view.robot.y === y) cell.classList.add("robot");
        board.appendChild(cell);
      }
    }

    const best = playerProgress().bestSteps[currentLevelIndex];
    stars.textContent = best ? rating(best, level.maxSteps) : "☆ ☆ ☆";
  }

  function rating(steps, maxSteps) {
    if (steps <= maxSteps) return "★ ★ ★";
    if (steps <= maxSteps + 4) return "★ ★ ☆";
    return "★ ☆ ☆";
  }

  function parseProgram(source) {
    const lines = source.replace(/\t/g, "    ").split("\n");
    const result = parseBlock(lines, 0, 0);
    return result.commands;
  }

  function indentation(line) {
    const match = line.match(/^ */);
    return match ? match[0].length : 0;
  }

  function parseBlock(lines, start, indent) {
    const commands = [];
    let i = start;

    while (i < lines.length) {
      const raw = lines[i];
      const trimmed = raw.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        i += 1;
        continue;
      }

      const currentIndent = indentation(raw);
      if (currentIndent < indent) break;
      if (currentIndent > indent) {
        throw new Error(`Line ${i + 1} is indented too far.`);
      }

      const repeatMatch = trimmed.match(/^repeat\((\d+)\):$/);
      if (repeatMatch) {
        const child = parseBlock(lines, i + 1, indent + 4);
        const count = Number(repeatMatch[1]);
        if (!Number.isInteger(count) || count < 1 || count > 20) {
          throw new Error("repeat() needs a number from 1 to 20.");
        }
        if (child.commands.length === 0) {
          throw new Error(`Line ${i + 1} needs commands indented under repeat().`);
        }
        commands.push({ type: "repeat", count, body: child.commands });
        i = child.next;
        continue;
      }

      const ifMatch = trimmed.match(/^if (wall_ahead|gem_here)\(\):$/);
      if (ifMatch) {
        const child = parseBlock(lines, i + 1, indent + 4);
        if (child.commands.length === 0) {
          throw new Error(`Line ${i + 1} needs commands indented under the if.`);
        }
        commands.push({ type: "if", test: ifMatch[1], body: child.commands });
        i = child.next;
        continue;
      }

      if (["move()", "turn_left()", "turn_right()", "collect()"].includes(trimmed)) {
        commands.push({ type: trimmed.replace("()", "") });
        i += 1;
        continue;
      }

      throw new Error(`I do not know "${trimmed}" on line ${i + 1}.`);
    }

    return { commands, next: i };
  }

  function countCommands(commands) {
    return commands.reduce((total, command) => {
      if (command.type === "repeat") {
        return total + command.count * countCommands(command.body);
      }
      if (command.type === "if") return total + countCommands(command.body);
      return total + 1;
    }, 0);
  }

  async function executeCommands(commands, token) {
    if (token !== runToken) throw new Error("Run stopped.");
    for (const command of commands) {
      if (token !== runToken) throw new Error("Run stopped.");
      if (command.type === "repeat") {
        for (let count = 0; count < command.count; count += 1) {
          await executeCommands(command.body, token);
        }
        continue;
      }

      if (command.type === "if") {
        const passes = command.test === "wall_ahead" ? wallAhead() : gemHere();
        if (passes) await executeCommands(command.body, token);
        continue;
      }

      execute(command);
      render();
      await sleep(260);
    }
  }

  function flatten(commands, output = []) {
    commands.forEach((command) => {
      if (command.type === "repeat") {
        for (let count = 0; count < command.count; count += 1) flatten(command.body, output);
      } else if (command.type === "if") {
        flatten(command.body, output);
      } else {
        output.push(command);
      }
    });
    return output;
  }

  function execute(command) {
    if (command.type === "turn_left") {
      const index = DIRECTIONS.indexOf(state.dir);
      state.dir = DIRECTIONS[(index + 3) % 4];
      state.steps += 1;
      return;
    }

    if (command.type === "turn_right") {
      const index = DIRECTIONS.indexOf(state.dir);
      state.dir = DIRECTIONS[(index + 1) % 4];
      state.steps += 1;
      return;
    }

    if (command.type === "collect") {
      const pos = key(state.robot);
      if (state.gems.has(pos)) state.gems.delete(pos);
      if (state.batteries.has(pos)) {
        state.batteries.delete(pos);
        state.inventory.battery += 1;
      }
      state.steps += 1;
      return;
    }

    if (command.type === "move") {
      if (wallAhead()) throw new Error("Bonk. Byte bumped a wall. Try a turn before that move.");
      const delta = DELTAS[state.dir];
      const next = { x: state.robot.x + delta.x, y: state.robot.y + delta.y };
      if (tileAt(next.x, next.y, "bugs")) throw new Error("Byte touched a bug tile. Find a path around it.");
      state.robot = next;
      const portal = portalAt(next.x, next.y);
      if (portal) state.robot = clonePoint(portal.to);
      state.steps += 1;
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function runProgram() {
    if (running) return;
    running = true;
    runToken += 1;
    const token = runToken;
    runBtn.disabled = true;
    nextBtn.disabled = true;
    initLevel(currentLevelIndex, true, { speak: false });
    runToken = token;
    running = true;
    runBtn.disabled = true;

    try {
      const commands = parseProgram(codeInput.value);
      if (commands.length === 0) throw new Error("Add at least one command for Byte.");
      if (countCommands(commands) > 80) throw new Error("That is a very long plan. Try a smaller loop.");
      await executeCommands(commands, token);

      if (state.gems.size === 0) {
        state.won = true;
        completeLevel();
      } else {
        setMentor(`Nice try, ${player}. Byte still sees ${state.gems.size} gem${state.gems.size === 1 ? "" : "s"}. What command collects a gem?`);
      }
    } catch (error) {
      render();
      if (error.message !== "Run stopped.") setMentor(error.message);
    } finally {
      if (token === runToken) {
        running = false;
        runBtn.disabled = false;
      }
    }
  }

  function completeLevel() {
    const p = playerProgress();
    p.completed[currentLevelIndex] = true;
    const best = p.bestSteps[currentLevelIndex];
    if (!best || state.steps < best) p.bestSteps[currentLevelIndex] = state.steps;
    saveProgress();
    nextBtn.disabled = currentLevelIndex >= levels.length - 1;
    missionPanel.classList.add("complete");
    setMentor(`Mission complete, ${player}! Byte used ${state.steps} steps. ${rating(state.steps, levels[currentLevelIndex].maxSteps)}`);
    showSuccess();
    updateProgress();
    render();
  }

  function showSuccess() {
    const finalMission = currentLevelIndex >= levels.length - 1;
    successText.textContent = finalMission
      ? `${player} finished the current quest path. Byte is ready for the next world.`
      : `${player} solved "${levels[currentLevelIndex].title}" in ${state.steps} steps.`;
    successNextBtn.textContent = finalMission ? "Stay Here" : "Next Mission";
    successModal.classList.remove("hidden");
  }

  function updateProgress() {
    progressName.textContent = player;
    const p = playerProgress();
    const complete = Object.values(p.completed).filter(Boolean).length;
    const percent = Math.round((complete / levels.length) * 100);
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${complete} of ${levels.length} missions complete`;
    renderParentStats();
    renderRewards();
  }

  function setMentor(message) {
    mentorText.textContent = message;
  }

  function syncAlexCode() {
    if (player !== "Alex") return;
    codeInput.value = alexCommands.map(alexCommandToCode).join("\n");
  }

  function renderAlexPlan() {
    if (!alexPlan) return;
    if (player !== "Alex") {
      alexPlan.innerHTML = "";
      return;
    }

    if (!alexCommands.length) {
      alexPlan.innerHTML = '<span class="plan-token">Tap a move</span>';
      return;
    }

    alexPlan.innerHTML = alexCommands.map((command) => {
      const item = visualLabels[command] || { icon: "•", label: command };
      return `<span class="plan-token"><span>${item.icon}</span>${item.label}</span>`;
    }).join("");
  }

  function addAlexCommand(command) {
    if (alexCommands.length >= 24) {
      setMentor("That is a big plan. Try running it and watching Byte.");
      return;
    }
    alexCommands.push(command);
    syncAlexCode();
    renderAlexPlan();
    render();
    const item = visualLabels[command];
    playCommandVoice(command);
    setMentor(item ? `${item.label} added. Tap Run My Plan when Byte is ready.` : "Command added.");
  }

  function undoAlexCommand() {
    alexCommands.pop();
    syncAlexCode();
    renderAlexPlan();
    render();
    setMentor(alexCommands.length ? "Last move removed." : "Plan cleared. Tap a move to start.");
  }

  function helpAlexPlan() {
    const solution = levels[currentLevelIndex].alexSolution || [];
    if (alexCommands.length >= solution.length) {
      setMentor("Your plan has all the steps. Tap Run My Plan.");
      return;
    }

    const nextCommand = solution[alexCommands.length];
    addAlexCommand(nextCommand);
    const item = visualLabels[nextCommand];
    setMentor(item ? `Nova added ${item.label}. Follow the glowing path.` : "Nova added the next step.");
  }

  function playCommandVoice(command) {
    if (!commandAudioPlayer || player !== "Alex") return;
    const item = visualLabels[command];
    if (!item || !item.voice) return;
    commandAudioPlayer.pause();
    commandAudioPlayer.currentTime = 0;
    commandAudioPlayer.src = `assets/voice/command-${item.voice}.mp3`;
    commandAudioPlayer.volume = 1;
    const playPromise = commandAudioPlayer.play();
    if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
  }

  function playUiVoice(name) {
    if (!commandAudioPlayer || player !== "Alex") return;
    commandAudioPlayer.pause();
    commandAudioPlayer.currentTime = 0;
    commandAudioPlayer.src = `assets/voice/command-${name}.mp3`;
    commandAudioPlayer.volume = 1;
    const playPromise = commandAudioPlayer.play();
    if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
  }

  function alexPlanWarning() {
    if (player !== "Alex") return "";
    if (!alexCommands.length) return "Tap a move first, or press Help Me.";
    const sim = simulatePlan(alexCommands);
    if (!sim.ok) return sim.reason;
    if (alexCommands.length < 2) return "Try adding a few more moves before running.";
    return "";
  }

  function speechTextForLevel() {
    const level = levels[currentLevelIndex];
    const checklist = lessonNotes[level.concept] || [];
    return `${level.speak || level.goal} ${checklist.join(" ")}`;
  }

  function waitForVoices() {
    if (!speechReady) return Promise.resolve([]);
    const voices = window.speechSynthesis.getVoices();
    if (voices.length) return Promise.resolve(voices);

    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        window.speechSynthesis.onvoiceschanged = null;
        resolve(window.speechSynthesis.getVoices());
      };
      window.speechSynthesis.onvoiceschanged = finish;
      setTimeout(finish, 1200);
    });
  }

  function chooseVoice(voices) {
    if (!speechReady) return null;
    return voices.find((voice) => /female|samantha|victoria|zira|aria|jenny/i.test(voice.name))
      || voices.find((voice) => voice.lang && voice.lang.toLowerCase().startsWith("en"))
      || voices[0]
      || null;
  }

  function resetReadButton() {
    readBtn.classList.remove("speaking");
    readBtn.innerHTML = '<span aria-hidden="true">▶</span> Read to me';
    if (speechResetTimer) clearTimeout(speechResetTimer);
    if (speechKeepAlive) clearInterval(speechKeepAlive);
    speechResetTimer = null;
    speechKeepAlive = null;
  }

  function missionVoicePath() {
    return `assets/voice/mission-${String(currentLevelIndex + 1).padStart(2, "0")}.mp3`;
  }

  function playMissionAudio() {
    if (!audioPlayer) return Promise.reject(new Error("No audio player."));

    if (speechReady) window.speechSynthesis.cancel();
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.src = missionVoicePath();
    audioPlayer.volume = 1;
    audioPlayer.playbackRate = player === "Alex" ? 0.96 : 1;

    readBtn.classList.add("speaking");
    readBtn.innerHTML = '<span aria-hidden="true">■</span> Reading';

    return new Promise((resolve, reject) => {
      audioPlayer.onended = () => {
        resetReadButton();
        resolve();
      };
      audioPlayer.onerror = () => {
        resetReadButton();
        reject(new Error("Narration file did not play."));
      };
      const playPromise = audioPlayer.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch((error) => {
          resetReadButton();
          reject(error);
        });
      }
    });
  }

  function splitSpeech(text) {
    return text
      .replace(/\s+/g, " ")
      .split(/(?<=[.!?])\s+/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  async function speak(text) {
    if (!speechReady) {
      setMentor("This browser does not have a voice reader. Ask a grown-up to open it in Chrome, or read the big mission card.");
      return;
    }

    window.speechSynthesis.cancel();
    window.speechSynthesis.resume();
    if (speechResetTimer) clearTimeout(speechResetTimer);
    readBtn.classList.add("speaking");
    readBtn.innerHTML = '<span aria-hidden="true">■</span> Starting';

    const voices = await waitForVoices();
    if (!voices.length) {
      resetReadButton();
      setMentor("Nova cannot find a reading voice in this browser. Try opening the game in regular Chrome.");
      return;
    }

    const voice = chooseVoice(voices);
    const chunks = splitSpeech(text);
    let index = 0;
    const readNext = () => {
      if (index >= chunks.length) {
        resetReadButton();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      index += 1;
      if (voice) utterance.voice = voice;
      utterance.rate = player === "Alex" ? 0.78 : 0.88;
      utterance.pitch = player === "Alex" ? 1.12 : 1.03;
      utterance.volume = 1;
      utterance.onend = readNext;
      utterance.onerror = () => {
        resetReadButton();
        setMentor("Nova tried to read, but this browser blocked the voice. Try regular Chrome if the sound stays quiet.");
      };
      window.speechSynthesis.speak(utterance);
    };

    readBtn.innerHTML = '<span aria-hidden="true">■</span> Reading';
    speechKeepAlive = setInterval(() => window.speechSynthesis.resume(), 250);
    readNext();
    speechResetTimer = setTimeout(() => {
      window.speechSynthesis.cancel();
      resetReadButton();
    }, Math.max(12000, text.length * 95));
  }

  function speakMission() {
    voiceEnabled = true;
    playMissionAudio().catch(() => speak(speechTextForLevel()));
  }

  function insertCommand(text) {
    const start = codeInput.selectionStart;
    const end = codeInput.selectionEnd;
    const before = codeInput.value.slice(0, start);
    const after = codeInput.value.slice(end);
    const prefix = before && !before.endsWith("\n") ? "\n" : "";
    const next = `${before}${prefix}${text}${after}`;
    codeInput.value = next;
    codeInput.focus();
    codeInput.selectionStart = codeInput.selectionEnd = before.length + prefix.length + text.length;
  }

  function renderParentStats() {
    if (!parentStats) return;
    const names = ["Emmy", "Alex"];
    parentStats.innerHTML = names.map((name) => {
      const record = progress[name] || { completed: {}, bestSteps: {} };
      const complete = Object.values(record.completed || {}).filter(Boolean).length;
      const bestTotal = Object.values(record.bestSteps || {}).reduce((sum, value) => sum + Number(value || 0), 0);
      return `
        <div class="parent-stat">
          <div>
            <strong>${name}</strong>
            <span>${complete} of ${levels.length} missions complete</span>
          </div>
          <strong>${bestTotal || "-"} steps</strong>
        </div>
      `;
    }).join("");
  }

  function renderRewards() {
    if (!rewardGrid) return;
    const record = playerProgress();
    const unlocked = rewards.filter((_, index) => record.completed[index]).length;
    rewardName.textContent = player;
    rewardIntro.textContent = `${unlocked} of ${rewards.length} badges unlocked.`;
    rewardGrid.innerHTML = rewards.map((reward, index) => {
      const isUnlocked = Boolean(record.completed[index]);
      return `
        <div class="reward-badge ${isUnlocked ? "unlocked" : "locked"}">
          <div class="reward-icon">${isUnlocked ? reward.icon : "?"}</div>
          <div>
            <strong>${reward.name}</strong>
            <span>${isUnlocked ? reward.detail : `Finish mission ${index + 1} to unlock.`}</span>
          </div>
        </div>
      `;
    }).join("");
  }

  function openRewardPanel() {
    renderRewards();
    rewardPanel.classList.remove("hidden");
    rewardPanel.setAttribute("aria-hidden", "false");
  }

  function closeRewardPanel() {
    rewardPanel.classList.add("hidden");
    rewardPanel.setAttribute("aria-hidden", "true");
  }

  function openParentPanel() {
    renderParentStats();
    exportBox.classList.remove("visible");
    parentPanel.classList.remove("hidden");
    parentPanel.setAttribute("aria-hidden", "false");
  }

  function closeParentPanel() {
    parentPanel.classList.add("hidden");
    parentPanel.setAttribute("aria-hidden", "true");
  }

  function resetCurrentPlayerProgress() {
    const firstTry = resetProgressBtn.dataset.confirm !== "true";
    if (firstTry) {
      resetProgressBtn.dataset.confirm = "true";
      resetProgressBtn.textContent = `Confirm reset ${player}`;
      setTimeout(() => {
        resetProgressBtn.dataset.confirm = "";
        resetProgressBtn.textContent = "Reset Current Child";
      }, 3000);
      return;
    }

    progress[player] = { completed: {}, bestSteps: {} };
    saveProgress();
    resetProgressBtn.dataset.confirm = "";
    resetProgressBtn.textContent = "Reset Current Child";
    initLevel(0, false, { speak: false });
    renderParentStats();
  }

  document.querySelectorAll("[data-player]").forEach((button) => {
    button.addEventListener("click", () => {
      player = button.dataset.player;
      document.querySelectorAll("[data-player]").forEach((item) => item.classList.toggle("active", item === button));
      initLevel(currentLevelIndex, false, { speak: false });
      if (player === "Alex") speakMission();
    });
  });

  document.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => insertCommand(button.dataset.command));
  });

  document.querySelectorAll("[data-visual-command]").forEach((button) => {
    button.addEventListener("click", () => addAlexCommand(button.dataset.visualCommand));
  });

  worldMap.addEventListener("click", (event) => {
    const button = event.target.closest("[data-map-level]");
    if (!button || button.disabled) return;
    initLevel(Number(button.dataset.mapLevel), false, { speak: voiceEnabled || player === "Alex" });
  });

  runBtn.addEventListener("click", runProgram);
  readBtn.addEventListener("click", speakMission);
  alexRunBtn.addEventListener("click", () => {
    playUiVoice("run-plan");
    const warning = alexPlanWarning();
    if (warning) {
      setMentor(warning);
      return;
    }
    runProgram();
  });
  alexClearBtn.addEventListener("click", () => {
    playUiVoice("undo");
    undoAlexCommand();
  });
  alexHelpBtn.addEventListener("click", () => {
    playUiVoice("help-me");
    helpAlexPlan();
  });
  resetBtn.addEventListener("click", () => initLevel(currentLevelIndex, true, { speak: false }));
  clearBtn.addEventListener("click", () => {
    codeInput.value = "";
    setMentor("Code cleared. Add one command at a time and watch what Byte does.");
  });
  sampleBtn.addEventListener("click", () => {
    codeInput.value = levels[currentLevelIndex].starter;
    setMentor("Starter loaded. Run it, then experiment.");
  });
  hintBtn.addEventListener("click", () => {
    const hint = levels[currentLevelIndex].hint;
    setMentor(hint);
    if (voiceEnabled || player === "Alex") speak(`Hint. ${hint}`);
  });
  nextBtn.addEventListener("click", () => initLevel(Math.min(currentLevelIndex + 1, levels.length - 1), false, { speak: voiceEnabled || player === "Alex" }));
  levelSelect.addEventListener("change", () => initLevel(Number(levelSelect.value), false, { speak: voiceEnabled || player === "Alex" }));
  startBtn.addEventListener("click", () => {
    welcomeModal.classList.add("hidden");
    if (player === "Alex") speakMission();
  });
  replayBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    initLevel(currentLevelIndex, false, { speak: false });
  });
  successNextBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    if (currentLevelIndex < levels.length - 1) initLevel(currentLevelIndex + 1, false, { speak: voiceEnabled || player === "Alex" });
  });
  successRewardsBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    openRewardPanel();
  });
  parentBtn.addEventListener("click", openParentPanel);
  rewardsBtn.addEventListener("click", openRewardPanel);
  closeParentBtn.addEventListener("click", closeParentPanel);
  closeRewardsBtn.addEventListener("click", closeRewardPanel);
  exportBtn.addEventListener("click", () => {
    exportBox.value = JSON.stringify({ exportedAt: new Date().toISOString(), progress }, null, 2);
    exportBox.classList.add("visible");
    exportBox.select();
  });
  resetProgressBtn.addEventListener("click", resetCurrentPlayerProgress);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (speechReady) window.speechSynthesis.cancel();
      successModal.classList.add("hidden");
      closeParentPanel();
      closeRewardPanel();
      welcomeModal.classList.add("hidden");
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      runProgram();
    }
  });

  window.RobotDungeon = { levels, parseProgram, countCommands };

  setupLevelPicker();
  initLevel(0, false, { speak: false });
})();
