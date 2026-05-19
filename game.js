(function () {
  const DIRECTIONS = ["north", "east", "south", "west"];
  const DELTAS = {
    north: { x: 0, y: -1 },
    east: { x: 1, y: 0 },
    south: { x: 0, y: 1 },
    west: { x: -1, y: 0 },
  };
  const ROTATION = { north: -90, east: 0, south: 90, west: 180 };
  const PROFILE_IDS = ["Builder", "Explorer"];
  const DEFAULT_PROFILE_NAMES = { Builder: "Builder", Explorer: "Explorer" };
  const STORAGE_KEY = "robotDungeonPythonQuest.progress.v2";
  const SETTINGS_KEY = "robotDungeonPythonQuest.profileSettings.v1";
  const BYTE_STYLE_KEY = "robotDungeonPythonQuest.byteStyle.v1";

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
      explorerSolution: ["move()", "move()", "move()", "collect()"],
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
      explorerSolution: ["move()", "move()", "turn_right()", "move()", "move()", "collect()"],
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
      explorerSolution: ["repeat_move_4", "collect()"],
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
      explorerSolution: ["move()", "move()", "collect()", "turn_right()", "move()", "move()", "collect()"],
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
      explorerSolution: ["move()", "turn_right()", "move()", "move()", "turn_left()", "move()", "collect()"],
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
      explorerSolution: ["turn_right()", "move()", "move()", "move()", "turn_left()", "move()", "move()", "move()", "collect()"],
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
      explorerSolution: ["move()", "move()", "move()", "collect()", "turn_right()", "move()", "move()", "move()", "turn_left()", "move()", "move()", "collect()"],
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
      explorerSolution: ["move()", "move()", "collect()", "move()", "move()", "move()", "collect()"],
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
      explorerSolution: ["move()", "move()", "move()", "turn_right()", "move()", "move()", "move()", "turn_right()", "move()", "move()", "move()", "turn_right()", "move()", "move()", "move()", "turn_right()", "collect()"],
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
      explorerSolution: ["repeat_move_4", "collect()"],
      hint: "Step on ◎, then keep moving toward the gem.",
      maxSteps: 10,
    },
    {
      title: "Rocket Dash",
      concept: "Loops",
      goal: "Rocket dash time. Blast straight up to the gem.",
      speak: "Mission eleven. Rocket dash time. Blast straight up to the gem. Repeat move four times, then collect.",
      size: 5,
      robot: { x: 2, y: 4, dir: "north" },
      gems: [{ x: 2, y: 0 }],
      walls: [],
      starter: "repeat(4):\n    move()\ncollect()",
      explorerSolution: ["repeat_move_4", "collect()"],
      hint: "Four moves north will do it.",
      maxSteps: 5,
    },
    {
      title: "Crown Path",
      concept: "Review",
      goal: "Final path. Get all three gems and earn Byte's crown.",
      speak: "Mission twelve. Final path. Get all three gems. Go east, go north, go east, and collect each gem you find.",
      size: 7,
      robot: { x: 0, y: 6, dir: "east" },
      gems: [{ x: 3, y: 6 }, { x: 3, y: 3 }, { x: 6, y: 3 }],
      walls: [{ x: 4, y: 6 }, { x: 4, y: 5 }, { x: 4, y: 4 }, { x: 2, y: 3 }],
      starter: "repeat(3):\n    move()\ncollect()\nturn_left()\nrepeat(3):\n    move()\ncollect()\nturn_right()\nrepeat(3):\n    move()\ncollect()",
      explorerSolution: ["move()", "move()", "move()", "collect()", "turn_left()", "move()", "move()", "move()", "collect()", "turn_right()", "move()", "move()", "move()", "collect()"],
      hint: "This is a three-part path: east, north, east.",
      maxSteps: 14,
    },
  ];

  let currentLevelIndex = 0;
  let player = "Builder";
  let state = null;
  let running = false;
  let runToken = 0;
  let voiceEnabled = false;
  let codePreviewEnabled = false;
  let speechReady = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let speechResetTimer = null;
  let speechKeepAlive = null;
  const audioPlayer = typeof Audio !== "undefined" ? new Audio() : null;
  const commandAudioPlayer = typeof Audio !== "undefined" ? new Audio() : null;
  let progress = loadProgress();
  let profileNames = loadProfileNames();
  let byteStyle = loadByteStyle();
  let missionSparks = 0;
  let audioContext = null;

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
  const previewBtn = document.getElementById("previewBtn");
  const explorerBuilder = document.getElementById("explorerBuilder");
  const explorerClearBtn = document.getElementById("explorerClearBtn");
  const explorerHelpBtn = document.getElementById("explorerHelpBtn");
  const explorerRunBtn = document.getElementById("explorerRunBtn");
  const explorerPlan = document.getElementById("explorerPlan");
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
  const treasureText = document.getElementById("treasureText");
  const sparkCount = document.getElementById("sparkCount");
  const byteMood = document.getElementById("byteMood");
  const fxLayer = document.getElementById("fxLayer");
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
  const successSparkText = document.getElementById("successSparkText");
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
  const builderNameInput = document.getElementById("builderNameInput");
  const explorerNameInput = document.getElementById("explorerNameInput");
  const saveNamesBtn = document.getElementById("saveNamesBtn");

  const profiles = {
    Builder: {
      avatar: "B",
      mode: "Builder Mode",
      line: "Code Mode: write real Python-style spells.",
      className: "theme-builder",
    },
    Explorer: {
      avatar: "E",
      mode: "Explorer Mode",
      line: "Easy Mode: listen, tap, and guide Byte.",
      className: "theme-explorer",
    },
  };

  const byteStyles = {
    sky: { label: "Sky Byte", className: "byte-sky", tone: 520 },
    gem: { label: "Gem Byte", className: "byte-gem", tone: 620 },
    gold: { label: "Gold Byte", className: "byte-gold", tone: 700 },
  };

  const successCheers = [
    "Gem grab!",
    "Code spark!",
    "Byte boost!",
    "Tiny spell, big win!",
    "Quest clear!",
    "Nice robot brain!",
  ];

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

  let explorerCommands = [];

  function clonePoint(point) {
    return { ...point };
  }

  function key(point) {
    return `${point.x},${point.y}`;
  }

  function cleanProfileName(value, fallback) {
    const cleaned = String(value || "").replace(/\s+/g, " ").trim().slice(0, 24);
    return cleaned || fallback;
  }

  function loadProfileNames() {
    try {
      const parsed = JSON.parse(localStorage.getItem(SETTINGS_KEY));
      if (parsed && typeof parsed === "object") {
        return PROFILE_IDS.reduce((names, id) => {
          names[id] = cleanProfileName(parsed[id], DEFAULT_PROFILE_NAMES[id]);
          return names;
        }, {});
      }
    } catch (error) {
      // Use safe defaults if this browser has a malformed settings record.
    }
    return { ...DEFAULT_PROFILE_NAMES };
  }

  function loadByteStyle() {
    try {
      const saved = localStorage.getItem(BYTE_STYLE_KEY);
      return byteStyles[saved] ? saved : "sky";
    } catch (error) {
      return "sky";
    }
  }

  function saveByteStyle() {
    try {
      localStorage.setItem(BYTE_STYLE_KEY, byteStyle);
    } catch (error) {
      // Byte style is cosmetic. Ignore storage failures so play can continue.
    }
  }

  function applyByteStyle() {
    Object.values(byteStyles).forEach((style) => document.body.classList.remove(style.className));
    const style = byteStyles[byteStyle] || byteStyles.sky;
    document.body.classList.add(style.className);
    document.querySelectorAll("[data-byte-style]").forEach((button) => {
      const active = button.dataset.byteStyle === byteStyle;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function saveProfileNames() {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(profileNames));
      return true;
    } catch (error) {
      setMentor("Player names could not be saved in this browser, but the game still works.");
      return false;
    }
  }

  function playerName(id = player) {
    return cleanProfileName(profileNames[id], DEFAULT_PROFILE_NAMES[id] || id);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[char]));
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

  function totalTreasure(level = levels[currentLevelIndex]) {
    return (level.gems || []).length + (level.batteries || []).length;
  }

  function updateQuestHud() {
    if (!state) return;
    const total = totalTreasure();
    const found = Math.max(0, total - state.gems.size - state.batteries.size);
    if (treasureText) treasureText.textContent = `${found}/${total}`;
    if (sparkCount) sparkCount.textContent = String(missionSparks);
    if (byteMood) {
      byteMood.textContent = state.won ? "Happy" : running ? "Zooming" : found > 0 ? "Glowing" : "Ready";
    }
  }

  function renderPlayerSwitch() {
    document.querySelectorAll("[data-player]").forEach((button) => {
      const id = button.dataset.player;
      const profile = profiles[id];
      button.textContent = playerName(id);
      button.classList.toggle("active", id === player);
      if (profile) button.setAttribute("aria-label", `${playerName(id)}. ${profile.mode}.`);
    });
  }

  function setupLevelPicker() {
    levelSelect.innerHTML = levels
      .map((level, index) => `<option value="${index}">${index + 1}. ${level.title}</option>`)
      .join("");
    renderWorldMap();
  }

  function applyProfile() {
    const profile = profiles[player];
    const displayName = playerName();
    document.body.classList.toggle("explorer-mode", player === "Explorer");
    document.body.classList.toggle("theme-builder", player === "Builder");
    document.body.classList.toggle("theme-explorer", player === "Explorer");
    syncPreviewButton();
    renderPlayerSwitch();
    profileAvatar.textContent = displayName.charAt(0).toUpperCase() || profile.avatar;
    profileMode.textContent = profile.mode;
    profileName.textContent = displayName;
    profileLine.textContent = profile.line;
    profileCard.setAttribute("aria-label", `${displayName}, ${profile.mode}. ${profile.line}`);
  }

  function syncPreviewButton() {
    if (!previewBtn) return;
    const active = player === "Builder" && codePreviewEnabled;
    previewBtn.classList.toggle("active", active);
    previewBtn.setAttribute("aria-pressed", String(active));
    previewBtn.textContent = active ? "Preview On" : "Preview";
    document.body.classList.toggle("code-preview-on", active);
  }

  function initLevel(index, keepCode, options = {}) {
    runToken += 1;
    running = false;
    runBtn.disabled = false;
    if (options.resetPreview !== false) codePreviewEnabled = false;
    missionSparks = 0;
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
      explorerCommands = [];
      codeInput.value = player === "Explorer" ? "" : level.starter;
    } else if (player === "Explorer") {
      syncExplorerCode();
    }
    renderExplorerPlan();
    setMentor(`Hi ${playerName()}. I can read the mission out loud. Press Read to me, then help Byte.`);
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
    mapSummary.textContent = `${playerName()}: ${completeCount} of ${levels.length} quests complete`;
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

  function explorerCommandToCode(command) {
    if (command === "repeat_move_4") return "repeat(4):\n    move()";
    return command;
  }

  function createSimulation(level) {
    return {
      robot: clonePoint(level.robot),
      dir: level.robot.dir,
      gems: new Set((level.gems || []).map(key)),
      batteries: new Set((level.batteries || []).map(key)),
      path: [],
      steps: 0,
    };
  }

  function simulationWallAhead(sim, level) {
    const delta = DELTAS[sim.dir];
    const next = { x: sim.robot.x + delta.x, y: sim.robot.y + delta.y };
    return next.x < 0 || next.y < 0 || next.x >= level.size || next.y >= level.size
      || (level.walls || []).some((point) => point.x === next.x && point.y === next.y);
  }

  function simulationGemHere(sim) {
    return sim.gems.has(key(sim.robot));
  }

  function applySimulationCommand(sim, command, level) {
    if (command === "turn_left()") {
      const index = DIRECTIONS.indexOf(sim.dir);
      sim.dir = DIRECTIONS[(index + 3) % 4];
      sim.steps += 1;
      return null;
    }

    if (command === "turn_right()") {
      const index = DIRECTIONS.indexOf(sim.dir);
      sim.dir = DIRECTIONS[(index + 1) % 4];
      sim.steps += 1;
      return null;
    }

    if (command === "collect()") {
      const pos = key(sim.robot);
      sim.gems.delete(pos);
      sim.batteries.delete(pos);
      sim.steps += 1;
      return null;
    }

    if (command === "move()") {
      const delta = DELTAS[sim.dir];
      const next = { x: sim.robot.x + delta.x, y: sim.robot.y + delta.y };
      const blocked = next.x < 0 || next.y < 0 || next.x >= level.size || next.y >= level.size
        || (level.walls || []).some((point) => point.x === next.x && point.y === next.y)
        || (level.bugs || []).some((point) => point.x === next.x && point.y === next.y);
      if (blocked) return { ok: false, reason: "Byte might bump. Try a turn first." };
      sim.robot = next;
      const portal = (level.portals || []).find((point) => point.x === next.x && point.y === next.y);
      if (portal) sim.robot = clonePoint(portal.to);
      sim.path.push(key(sim.robot));
      sim.steps += 1;
    }

    return null;
  }

  function simulatePlan(commands, level = levels[currentLevelIndex]) {
    const sim = createSimulation(level);
    const expandedCommands = expandVisualCommands(commands);

    for (const command of expandedCommands) {
      const result = applySimulationCommand(sim, command, level);
      if (result) return { ...sim, ...result };
    }

    return { ...sim, ok: true };
  }

  function applyParsedSimulationCommands(sim, commands, level) {
    for (const command of commands) {
      if (command.type === "repeat") {
        for (let count = 0; count < command.count; count += 1) {
          const result = applyParsedSimulationCommands(sim, command.body, level);
          if (result) return result;
        }
        continue;
      }

      if (command.type === "if") {
        const passes = command.test === "wall_ahead" ? simulationWallAhead(sim, level) : simulationGemHere(sim);
        if (passes) {
          const result = applyParsedSimulationCommands(sim, command.body, level);
          if (result) return result;
        }
        continue;
      }

      const result = applySimulationCommand(sim, `${command.type}()`, level);
      if (result) return result;
    }

    return null;
  }

  function simulateCodePreview(source, level = levels[currentLevelIndex]) {
    const commands = parseProgram(source);
    if (commands.length === 0 || countCommands(commands) > 80) return null;
    const sim = createSimulation(level);
    const result = applyParsedSimulationCommands(sim, commands, level);
    return result ? { ...sim, ...result } : { ...sim, ok: true };
  }

  function displayState() {
    if (running || state.won) return state;
    let preview = null;
    if (player === "Explorer" && explorerCommands.length > 0) preview = simulatePlan(explorerCommands);
    if (player === "Builder" && codePreviewEnabled && codeInput.value.trim()) {
      try {
        preview = simulateCodePreview(codeInput.value);
      } catch (error) {
        preview = null;
      }
    }
    if (!preview) return state;
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
    if (player !== "Explorer") return new Set();
    const level = levels[currentLevelIndex];
    const solution = level.explorerSolution || [];
    if (!solution.length) return new Set();
    const visibleCommands = solution.slice(0, Math.min(solution.length, Math.max(explorerCommands.length + 3, 4)));
    const sim = simulatePlan(visibleCommands, level);
    return new Set((sim.path || []).slice(Math.max(0, expandVisualCommands(explorerCommands).filter((command) => command === "move()").length - 1)));
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
    updateQuestHud();
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
      playTone("turn");
      return;
    }

    if (command.type === "turn_right") {
      const index = DIRECTIONS.indexOf(state.dir);
      state.dir = DIRECTIONS[(index + 1) % 4];
      state.steps += 1;
      playTone("turn");
      return;
    }

    if (command.type === "collect") {
      const pos = key(state.robot);
      let collected = false;
      if (state.gems.has(pos)) {
        state.gems.delete(pos);
        collected = true;
      }
      if (state.batteries.has(pos)) {
        state.batteries.delete(pos);
        state.inventory.battery += 1;
        collected = true;
      }
      state.steps += 1;
      if (collected) {
        missionSparks += 10;
        playTone("collect");
        popSpark("+10 sparks", "collect");
        pulseBoard("collect");
      }
      return;
    }

    if (command.type === "move") {
      if (wallAhead()) {
        playTone("bump");
        pulseBoard("bump");
        throw new Error("Bonk. Byte bumped a wall. Try a turn before that move.");
      }
      const delta = DELTAS[state.dir];
      const next = { x: state.robot.x + delta.x, y: state.robot.y + delta.y };
      if (tileAt(next.x, next.y, "bugs")) {
        playTone("bump");
        pulseBoard("bump");
        throw new Error("Byte touched a bug tile. Find a path around it.");
      }
      state.robot = next;
      const portal = portalAt(next.x, next.y);
      if (portal) {
        state.robot = clonePoint(portal.to);
        popSpark("Portal pop!", "portal");
      }
      state.steps += 1;
      playTone("move");
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function soundContext() {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioContext) audioContext = new AudioCtx();
    if (audioContext.state === "suspended") audioContext.resume().catch(() => {});
    return audioContext;
  }

  function playTone(type) {
    try {
      const context = soundContext();
      if (!context) return;
      const style = byteStyles[byteStyle] || byteStyles.sky;
      const tones = {
        move: [style.tone * 0.78, 0.055, 0.035],
        turn: [style.tone * 0.58, 0.045, 0.025],
        collect: [style.tone * 1.18, 0.12, 0.060],
        win: [style.tone * 1.38, 0.20, 0.075],
        bump: [170, 0.16, 0.050],
        start: [style.tone, 0.10, 0.040],
      };
      const [frequency, duration, volume] = tones[type] || tones.move;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type === "bump" ? "sawtooth" : "triangle";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime);
      gain.gain.setValueAtTime(0.0001, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(volume, context.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration + 0.02);
    } catch (error) {
      // Sound is a bonus layer. Browsers can block it without affecting gameplay.
    }
  }

  function popSpark(text, kind = "spark") {
    if (!fxLayer) return;
    const burst = document.createElement("span");
    burst.className = `spark-pop ${kind}`;
    burst.textContent = text;
    burst.style.left = `${32 + Math.random() * 36}%`;
    burst.style.top = `${24 + Math.random() * 34}%`;
    fxLayer.appendChild(burst);
    setTimeout(() => burst.remove(), 900);
  }

  function pulseBoard(kind) {
    if (!board) return;
    board.classList.remove("pulse-collect", "pulse-win", "pulse-bump");
    board.offsetWidth;
    board.classList.add(`pulse-${kind}`);
    setTimeout(() => board.classList.remove(`pulse-${kind}`), 520);
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
        setMentor(`Nice try, ${playerName()}. Byte still sees ${state.gems.size} gem${state.gems.size === 1 ? "" : "s"}. What command collects a gem?`);
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
    missionSparks += 20;
    p.completed[currentLevelIndex] = true;
    const best = p.bestSteps[currentLevelIndex];
    if (!best || state.steps < best) p.bestSteps[currentLevelIndex] = state.steps;
    saveProgress();
    nextBtn.disabled = currentLevelIndex >= levels.length - 1;
    missionPanel.classList.add("complete");
    setMentor(`Mission complete, ${playerName()}! Byte used ${state.steps} steps. ${rating(state.steps, levels[currentLevelIndex].maxSteps)}`);
    playTone("win");
    popSpark("Quest clear!", "win");
    pulseBoard("win");
    showSuccess();
    updateProgress();
    render();
  }

  function showSuccess() {
    const finalMission = currentLevelIndex >= levels.length - 1;
    successText.textContent = finalMission
      ? `${playerName()} finished the current quest path. Byte is ready for the next world.`
      : `${playerName()} solved "${levels[currentLevelIndex].title}" in ${state.steps} steps.`;
    if (successSparkText) {
      const cheer = successCheers[currentLevelIndex % successCheers.length];
      successSparkText.textContent = `${cheer} ${missionSparks} sparks earned.`;
    }
    successNextBtn.textContent = finalMission ? "Stay Here" : "Next Mission";
    successModal.classList.remove("hidden");
  }

  function updateProgress() {
    progressName.textContent = playerName();
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

  function syncExplorerCode() {
    if (player !== "Explorer") return;
    codeInput.value = explorerCommands.map(explorerCommandToCode).join("\n");
  }

  function renderExplorerPlan() {
    if (!explorerPlan) return;
    if (player !== "Explorer") {
      explorerPlan.innerHTML = "";
      return;
    }

    if (!explorerCommands.length) {
      explorerPlan.innerHTML = '<span class="plan-token">Tap a move</span>';
      return;
    }

    explorerPlan.innerHTML = explorerCommands.map((command) => {
      const item = visualLabels[command] || { icon: "•", label: command };
      return `<span class="plan-token"><span>${item.icon}</span>${item.label}</span>`;
    }).join("");
  }

  function addExplorerCommand(command) {
    if (explorerCommands.length >= 24) {
      setMentor("That is a big plan. Try running it and watching Byte.");
      return;
    }
    explorerCommands.push(command);
    syncExplorerCode();
    renderExplorerPlan();
    render();
    const item = visualLabels[command];
    playCommandVoice(command);
    setMentor(item ? `${item.label} added. Tap Run My Plan when Byte is ready.` : "Command added.");
  }

  function undoExplorerCommand() {
    explorerCommands.pop();
    syncExplorerCode();
    renderExplorerPlan();
    render();
    setMentor(explorerCommands.length ? "Last move removed." : "Plan cleared. Tap a move to start.");
  }

  function helpExplorerPlan() {
    const solution = levels[currentLevelIndex].explorerSolution || [];
    if (explorerCommands.length >= solution.length) {
      setMentor("Your plan has all the steps. Tap Run My Plan.");
      return;
    }

    const nextCommand = solution[explorerCommands.length];
    addExplorerCommand(nextCommand);
    const item = visualLabels[nextCommand];
    setMentor(item ? `Nova added ${item.label}. Follow the glowing path.` : "Nova added the next step.");
  }

  function playCommandVoice(command) {
    if (!commandAudioPlayer || player !== "Explorer") return;
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
    if (!commandAudioPlayer || player !== "Explorer") return;
    commandAudioPlayer.pause();
    commandAudioPlayer.currentTime = 0;
    commandAudioPlayer.src = `assets/voice/command-${name}.mp3`;
    commandAudioPlayer.volume = 1;
    const playPromise = commandAudioPlayer.play();
    if (playPromise && typeof playPromise.catch === "function") playPromise.catch(() => {});
  }

  function explorerPlanWarning() {
    if (player !== "Explorer") return "";
    if (!explorerCommands.length) return "Tap a move first, or press Help Me.";
    const sim = simulatePlan(explorerCommands);
    if (!sim.ok) return sim.reason;
    if (explorerCommands.length < 2) return "Try adding a few more moves before running.";
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
    audioPlayer.playbackRate = player === "Explorer" ? 0.96 : 1;

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
      utterance.rate = player === "Explorer" ? 0.78 : 0.88;
      utterance.pitch = player === "Explorer" ? 1.12 : 1.03;
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
    if (codePreviewEnabled && player === "Builder") render();
  }

  function refreshCodePreview() {
    if (codePreviewEnabled && player === "Builder") render();
  }

  function renderParentStats() {
    if (!parentStats) return;
    parentStats.innerHTML = PROFILE_IDS.map((id) => {
      const record = progress[id] || { completed: {}, bestSteps: {} };
      const complete = Object.values(record.completed || {}).filter(Boolean).length;
      const bestTotal = Object.values(record.bestSteps || {}).reduce((sum, value) => sum + Number(value || 0), 0);
      const profile = profiles[id];
      return `
        <div class="parent-stat">
          <div>
            <strong>${escapeHtml(playerName(id))}</strong>
            <span>${profile.mode}: ${complete} of ${levels.length} missions complete</span>
          </div>
          <strong>${bestTotal || "-"} steps</strong>
        </div>
      `;
    }).join("");
  }

  function renderParentSetup() {
    if (builderNameInput) builderNameInput.value = playerName("Builder");
    if (explorerNameInput) explorerNameInput.value = playerName("Explorer");
  }

  function savePlayerSetup() {
    profileNames = {
      Builder: cleanProfileName(builderNameInput ? builderNameInput.value : "", DEFAULT_PROFILE_NAMES.Builder),
      Explorer: cleanProfileName(explorerNameInput ? explorerNameInput.value : "", DEFAULT_PROFILE_NAMES.Explorer),
    };
    saveProfileNames();
    renderParentSetup();
    applyProfile();
    updateProgress();
    setMentor(`Saved player names. ${playerName()} is ready for the next quest.`);
  }

  function renderRewards() {
    if (!rewardGrid) return;
    const record = playerProgress();
    const unlocked = rewards.filter((_, index) => record.completed[index]).length;
    rewardName.textContent = playerName();
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
    renderParentSetup();
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
      resetProgressBtn.textContent = `Confirm reset ${playerName()}`;
      setTimeout(() => {
        resetProgressBtn.dataset.confirm = "";
        resetProgressBtn.textContent = "Reset Current Player";
      }, 3000);
      return;
    }

    progress[player] = { completed: {}, bestSteps: {} };
    saveProgress();
    resetProgressBtn.dataset.confirm = "";
    resetProgressBtn.textContent = "Reset Current Player";
    initLevel(0, false, { speak: false });
    renderParentStats();
  }

  document.querySelectorAll("[data-player]").forEach((button) => {
    button.addEventListener("click", () => {
      player = button.dataset.player;
      initLevel(currentLevelIndex, false, { speak: false });
      if (player === "Explorer") speakMission();
    });
  });

  document.querySelectorAll("[data-command]").forEach((button) => {
    button.addEventListener("click", () => insertCommand(button.dataset.command));
  });

  document.querySelectorAll("[data-byte-style]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!byteStyles[button.dataset.byteStyle]) return;
      byteStyle = button.dataset.byteStyle;
      saveByteStyle();
      applyByteStyle();
      playTone("start");
      popSpark(byteStyles[byteStyle].label, "style");
    });
  });

  codeInput.addEventListener("input", refreshCodePreview);

  previewBtn.addEventListener("click", () => {
    codePreviewEnabled = !codePreviewEnabled;
    syncPreviewButton();
    render();
    setMentor(codePreviewEnabled
      ? "Preview is on. Byte shows what valid code will do before you press Run."
      : "Preview is off. Press Run when you want Byte to try the mission.");
  });

  document.querySelectorAll("[data-visual-command]").forEach((button) => {
    button.addEventListener("click", () => addExplorerCommand(button.dataset.visualCommand));
  });

  worldMap.addEventListener("click", (event) => {
    const button = event.target.closest("[data-map-level]");
    if (!button || button.disabled) return;
    initLevel(Number(button.dataset.mapLevel), false, { speak: voiceEnabled || player === "Explorer" });
  });

  runBtn.addEventListener("click", runProgram);
  readBtn.addEventListener("click", speakMission);
  explorerRunBtn.addEventListener("click", () => {
    playUiVoice("run-plan");
    const warning = explorerPlanWarning();
    if (warning) {
      setMentor(warning);
      return;
    }
    runProgram();
  });
  explorerClearBtn.addEventListener("click", () => {
    playUiVoice("undo");
    undoExplorerCommand();
  });
  explorerHelpBtn.addEventListener("click", () => {
    playUiVoice("help-me");
    helpExplorerPlan();
  });
  resetBtn.addEventListener("click", () => initLevel(currentLevelIndex, true, { speak: false }));
  clearBtn.addEventListener("click", () => {
    codeInput.value = "";
    refreshCodePreview();
    setMentor("Code cleared. Add one command at a time and watch what Byte does.");
  });
  sampleBtn.addEventListener("click", () => {
    codeInput.value = levels[currentLevelIndex].starter;
    refreshCodePreview();
    setMentor("Starter loaded. Run it, then experiment.");
  });
  hintBtn.addEventListener("click", () => {
    const hint = levels[currentLevelIndex].hint;
    setMentor(hint);
    if (voiceEnabled || player === "Explorer") speak(`Hint. ${hint}`);
  });
  nextBtn.addEventListener("click", () => initLevel(Math.min(currentLevelIndex + 1, levels.length - 1), false, { speak: voiceEnabled || player === "Explorer" }));
  levelSelect.addEventListener("change", () => initLevel(Number(levelSelect.value), false, { speak: voiceEnabled || player === "Explorer" }));
  startBtn.addEventListener("click", () => {
    playTone("start");
    welcomeModal.classList.add("hidden");
    if (player === "Explorer") speakMission();
  });
  replayBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    initLevel(currentLevelIndex, false, { speak: false });
  });
  successNextBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    if (currentLevelIndex < levels.length - 1) initLevel(currentLevelIndex + 1, false, { speak: voiceEnabled || player === "Explorer" });
  });
  successRewardsBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    openRewardPanel();
  });
  parentBtn.addEventListener("click", openParentPanel);
  rewardsBtn.addEventListener("click", openRewardPanel);
  closeParentBtn.addEventListener("click", closeParentPanel);
  closeRewardsBtn.addEventListener("click", closeRewardPanel);
  if (saveNamesBtn) saveNamesBtn.addEventListener("click", savePlayerSetup);
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

  applyByteStyle();
  setupLevelPicker();
  initLevel(0, false, { speak: false });
})();
