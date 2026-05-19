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
  const SFX_KEY = "robotDungeonPythonQuest.sfxEnabled.v1";
  const CREATOR_KEY = "robotDungeonPythonQuest.creatorDungeon.v1";

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
  let missionEnergy = 0;
  let actionTimer = null;
  let soundEnabled = loadSfxPreference();
  let audioContext = null;
  let creatorLevel = loadCreatorLevel();
  let creatorDraft = cloneCreatorLevel(creatorLevel);
  let creatorTool = "floor";
  let playingCreator = false;

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
  const creatorBtn = document.getElementById("creatorBtn");
  const rewardsBtn = document.getElementById("rewardsBtn");
  const soundBtn = document.getElementById("soundBtn");
  const closeParentBtn = document.getElementById("closeParentBtn");
  const closeRewardsBtn = document.getElementById("closeRewardsBtn");
  const closeCreatorBtn = document.getElementById("closeCreatorBtn");
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
  const byteCompanion = document.getElementById("byteCompanion");
  const byteSpeech = document.getElementById("byteSpeech");
  const boostFill = document.getElementById("boostFill");
  const fxLayer = document.getElementById("fxLayer");
  const actionBanner = document.getElementById("actionBanner");
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
  const successBanner = document.getElementById("successBanner");
  const parentPanel = document.getElementById("parentPanel");
  const parentStats = document.getElementById("parentStats");
  const exportBox = document.getElementById("exportBox");
  const rewardPanel = document.getElementById("rewardPanel");
  const rewardGrid = document.getElementById("rewardGrid");
  const rewardName = document.getElementById("rewardName");
  const rewardIntro = document.getElementById("rewardIntro");
  const creatorPanel = document.getElementById("creatorPanel");
  const creatorPalette = document.getElementById("creatorPalette");
  const creatorGrid = document.getElementById("creatorGrid");
  const creatorStatus = document.getElementById("creatorStatus");
  const creatorClearBtn = document.getElementById("creatorClearBtn");
  const creatorResetBtn = document.getElementById("creatorResetBtn");
  const creatorSaveBtn = document.getElementById("creatorSaveBtn");
  const creatorPlayBtn = document.getElementById("creatorPlayBtn");
  const workshopGrid = document.getElementById("workshopGrid");
  const workshopPreview = document.getElementById("workshopPreview");
  const workshopSummary = document.getElementById("workshopSummary");
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

  const actionWords = {
    launch: "Byte launch!",
    move: "Zoom!",
    turn_left: "Left spin!",
    turn_right: "Right spin!",
    collect: "Gem grab!",
    repeat: "Loop spell!",
    sensor: "Sensor check!",
    portal: "Portal pop!",
    bump: "Oops, bonk!",
    win: "Quest clear!",
    style: "New Byte!",
  };

  const starterCosmetics = {
    hat: "none",
    visor: "clear",
    trail: "cyan",
    aura: "soft",
  };

  const cosmeticItems = [
    { id: "hat-none", slot: "hat", value: "none", icon: "•", name: "No Hat", detail: "Classic Byte head.", unlockIndex: null },
    { id: "visor-clear", slot: "visor", value: "clear", icon: "□", name: "Clear Face", detail: "Byte's original look.", unlockIndex: null },
    { id: "trail-cyan", slot: "trail", value: "cyan", icon: "↑", name: "Cyan Trail", detail: "Soft blue robot trail.", unlockIndex: null },
    { id: "aura-soft", slot: "aura", value: "soft", icon: "○", name: "Soft Aura", detail: "A gentle starter glow.", unlockIndex: null },
    { id: "trail-gold", slot: "trail", value: "gold", icon: "✦", name: "Gold Trail", detail: "Earned from the first gem.", unlockIndex: 0 },
    { id: "visor-star", slot: "visor", value: "star", icon: "★", name: "Star Visor", detail: "A bright focus lens.", unlockIndex: 1 },
    { id: "hat-bolt", slot: "hat", value: "bolt", icon: "⚡", name: "Bolt Hat", detail: "Loop-powered headgear.", unlockIndex: 2 },
    { id: "aura-gem", slot: "aura", value: "gem", icon: "◆", name: "Gem Aura", detail: "A purple treasure glow.", unlockIndex: 3 },
    { id: "trail-purple", slot: "trail", value: "purple", icon: "◆", name: "Purple Trail", detail: "A magical coding trail.", unlockIndex: 4 },
    { id: "visor-blue", slot: "visor", value: "blue", icon: "▰", name: "Blue Visor", detail: "Bug-spotting goggles.", unlockIndex: 5 },
    { id: "hat-antenna", slot: "hat", value: "antenna", icon: "◎", name: "Signal Antenna", detail: "A powered-up scanner.", unlockIndex: 6 },
    { id: "aura-portal", slot: "aura", value: "portal", icon: "◎", name: "Portal Aura", detail: "A swirly teleport glow.", unlockIndex: 7 },
    { id: "trail-rainbow", slot: "trail", value: "rainbow", icon: "≋", name: "Rainbow Trail", detail: "A full square-dance trail.", unlockIndex: 8 },
    { id: "hat-crown", slot: "hat", value: "crown", icon: "♛", name: "Tiny Crown", detail: "For a crown coder.", unlockIndex: 11 },
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
    Create: ["This dungeon was built in Builder Lab.", "Play Test uses the same code tools as quests."],
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

  function defaultCreatorLevel() {
    return {
      title: "My Dungeon",
      concept: "Create",
      goal: "Build a tiny quest, then code Byte through your own dungeon.",
      speak: "Builder Lab. Build a tiny quest. Put Byte down, add a gem, then press Play Test.",
      size: 5,
      robot: { x: 0, y: 2, dir: "east" },
      gems: [{ x: 4, y: 2 }],
      walls: [{ x: 2, y: 1 }, { x: 2, y: 3 }],
      bugs: [],
      batteries: [],
      portals: [],
      starter: "move()\nmove()\nmove()\nmove()\ncollect()",
      explorerSolution: [],
      hint: "This is your dungeon. Try building a clear path from Byte to the gem.",
      maxSteps: 8,
      creator: true,
    };
  }

  function cloneCreatorLevel(level) {
    return {
      ...level,
      robot: clonePoint(level.robot),
      gems: (level.gems || []).map(clonePoint),
      walls: (level.walls || []).map(clonePoint),
      bugs: (level.bugs || []).map(clonePoint),
      batteries: (level.batteries || []).map(clonePoint),
      portals: (level.portals || []).map((portal) => ({ ...portal, to: clonePoint(portal.to) })),
    };
  }

  function pointInBounds(point, size = 5) {
    return point && Number.isInteger(point.x) && Number.isInteger(point.y)
      && point.x >= 0 && point.y >= 0 && point.x < size && point.y < size;
  }

  function sanitizePointList(points, size, blocked = new Set()) {
    const seen = new Set();
    return (Array.isArray(points) ? points : []).reduce((list, point) => {
      if (!pointInBounds(point, size)) return list;
      const id = key(point);
      if (seen.has(id) || blocked.has(id)) return list;
      seen.add(id);
      list.push({ x: point.x, y: point.y });
      return list;
    }, []);
  }

  function normalizeCreatorLevel(value) {
    const base = defaultCreatorLevel();
    const source = value && typeof value === "object" ? value : {};
    const size = 5;
    const robot = pointInBounds(source.robot, size)
      ? { x: source.robot.x, y: source.robot.y, dir: DIRECTIONS.includes(source.robot.dir) ? source.robot.dir : "east" }
      : clonePoint(base.robot);
    const blocked = new Set([key(robot)]);
    const walls = sanitizePointList(source.walls, size, blocked);
    walls.forEach((point) => blocked.add(key(point)));
    const bugs = sanitizePointList(source.bugs, size, blocked);
    bugs.forEach((point) => blocked.add(key(point)));
    const gems = sanitizePointList(source.gems, size, blocked);
    const hasGemList = Array.isArray(source.gems);

    return {
      ...base,
      robot,
      walls,
      bugs,
      gems: hasGemList ? gems : base.gems.map(clonePoint),
    };
  }

  function loadCreatorLevel() {
    try {
      return normalizeCreatorLevel(JSON.parse(localStorage.getItem(CREATOR_KEY)));
    } catch (error) {
      return defaultCreatorLevel();
    }
  }

  function saveCreatorLevel() {
    try {
      localStorage.setItem(CREATOR_KEY, JSON.stringify(creatorLevel));
      return true;
    } catch (error) {
      setMentor("The dungeon could not be saved in this browser, but Play Test still works.");
      return false;
    }
  }

  function removeCreatorPoint(type, x, y) {
    creatorDraft[type] = (creatorDraft[type] || []).filter((point) => point.x !== x || point.y !== y);
  }

  function addCreatorPoint(type, x, y) {
    creatorDraft[type] = [...(creatorDraft[type] || []), { x, y }];
  }

  function clearCreatorCell(x, y) {
    ["walls", "gems", "bugs"].forEach((type) => removeCreatorPoint(type, x, y));
  }

  function creatorCellKind(x, y, level = creatorDraft) {
    if (level.robot.x === x && level.robot.y === y) return "start";
    if ((level.gems || []).some((point) => point.x === x && point.y === y)) return "gem";
    if ((level.walls || []).some((point) => point.x === x && point.y === y)) return "wall";
    if ((level.bugs || []).some((point) => point.x === x && point.y === y)) return "bug";
    return "floor";
  }

  function creatorIcon(kind) {
    return { start: "🤖", gem: "◆", wall: "▦", bug: "!", floor: "" }[kind] || "";
  }

  function currentLevel() {
    return playingCreator ? creatorLevel : levels[currentLevelIndex];
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

  function loadSfxPreference() {
    try {
      return localStorage.getItem(SFX_KEY) !== "off";
    } catch (error) {
      return true;
    }
  }

  function saveSfxPreference() {
    try {
      localStorage.setItem(SFX_KEY, soundEnabled ? "on" : "off");
    } catch (error) {
      // SFX preference is optional; keep the game playable if storage fails.
    }
  }

  function syncSoundButton() {
    if (!soundBtn) return;
    soundBtn.textContent = soundEnabled ? "SFX On" : "SFX Off";
    soundBtn.setAttribute("aria-pressed", String(soundEnabled));
    soundBtn.classList.toggle("sfx-on", soundEnabled);
    soundBtn.classList.toggle("sfx-off", !soundEnabled);
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
    if (!progress[player] || typeof progress[player] !== "object") progress[player] = {};
    if (!progress[player].completed || typeof progress[player].completed !== "object") progress[player].completed = {};
    if (!progress[player].bestSteps || typeof progress[player].bestSteps !== "object") progress[player].bestSteps = {};
    progress[player].cosmetics = normalizeCosmetics(progress[player].cosmetics);
    return progress[player];
  }

  function normalizeCosmetics(value) {
    const saved = value && typeof value === "object" ? value : {};
    return Object.keys(starterCosmetics).reduce((cosmetics, slot) => {
      cosmetics[slot] = cosmeticItems.some((item) => item.slot === slot && item.value === saved[slot])
        ? saved[slot]
        : starterCosmetics[slot];
      return cosmetics;
    }, {});
  }

  function cosmeticUnlocked(item, record = playerProgress()) {
    return item.unlockIndex === null || Boolean(record.completed[item.unlockIndex]);
  }

  function currentCosmetics() {
    const record = playerProgress();
    const cosmetics = normalizeCosmetics(record.cosmetics);
    Object.entries(cosmetics).forEach(([slot, value]) => {
      const item = cosmeticItem(slot, value);
      if (!item || !cosmeticUnlocked(item, record)) cosmetics[slot] = starterCosmetics[slot];
    });
    record.cosmetics = cosmetics;
    return cosmetics;
  }

  function cosmeticItem(slot, value) {
    return cosmeticItems.find((item) => item.slot === slot && item.value === value);
  }

  function cosmeticClasses(cosmetics = currentCosmetics()) {
    return Object.entries(cosmetics).map(([slot, value]) => `cosmetic-${slot}-${value}`);
  }

  function applyCosmetics() {
    const allClasses = cosmeticItems.map((item) => `cosmetic-${item.slot}-${item.value}`);
    document.body.classList.remove(...allClasses);
    document.body.classList.add(...cosmeticClasses());
  }

  function totalTreasure(level = currentLevel()) {
    return (level.gems || []).length + (level.batteries || []).length;
  }

  function updateQuestHud() {
    if (!state) return;
    const total = totalTreasure();
    const found = Math.max(0, total - state.gems.size - state.batteries.size);
    if (treasureText) treasureText.textContent = `${found}/${total}`;
    if (sparkCount) sparkCount.textContent = String(missionSparks);
    if (boostFill) boostFill.style.width = `${Math.min(100, missionEnergy)}%`;
    if (byteMood) {
      byteMood.textContent = state.won ? "Happy" : running ? "Zooming" : found > 0 ? "Glowing" : "Ready";
    }
  }

  function setByteMood(text, mood = "ready") {
    if (byteSpeech) byteSpeech.textContent = text;
    if (!byteCompanion) return;
    byteCompanion.classList.remove("mood-ready", "mood-zoom", "mood-happy", "mood-bump", "mood-magic");
    byteCompanion.classList.add(`mood-${mood}`);
  }

  function chargeEnergy(amount) {
    missionEnergy = Math.max(0, Math.min(100, missionEnergy + amount));
    updateQuestHud();
  }

  function announceAction(type, text = actionWords[type] || "Go Byte!", energy = 4) {
    chargeEnergy(energy);
    setByteMood(text, type === "bump" ? "bump" : type === "win" || type === "collect" ? "happy" : type === "repeat" || type === "sensor" || type === "portal" ? "magic" : "zoom");
    burstEffect(type);
    if (!actionBanner) return;
    if (actionTimer) clearTimeout(actionTimer);
    actionBanner.textContent = text;
    actionBanner.className = `action-banner show ${type}`;
    actionTimer = setTimeout(() => {
      actionBanner.className = "action-banner";
    }, 720);
  }

  function rememberStep(point) {
    if (!state.trail) state.trail = [];
    state.trail.push(key(point));
    if (state.trail.length > 10) state.trail = state.trail.slice(-10);
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
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
    levelSelect.innerHTML = [
      ...levels.map((level, index) => `<option value="${index}">${index + 1}. ${level.title}</option>`),
      '<option value="creator">★ My Dungeon</option>',
    ].join("");
    renderWorldMap();
  }

  function applyProfile() {
    const profile = profiles[player];
    const displayName = playerName();
    document.body.classList.toggle("explorer-mode", player === "Explorer");
    document.body.classList.toggle("theme-builder", player === "Builder");
    document.body.classList.toggle("theme-explorer", player === "Explorer");
    syncPreviewButton();
    applyCosmetics();
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
    playingCreator = false;
    currentLevelIndex = Math.max(0, Math.min(levels.length - 1, index));
    startActiveLevel(levels[currentLevelIndex], keepCode, options);
  }

  function initCreatorLevel(keepCode = false, options = {}) {
    playingCreator = true;
    creatorLevel = normalizeCreatorLevel(creatorLevel);
    startActiveLevel(creatorLevel, keepCode, options);
  }

  function restartCurrentLevel(keepCode, options = {}) {
    if (playingCreator) initCreatorLevel(keepCode, options);
    else initLevel(currentLevelIndex, keepCode, options);
  }

  function startActiveLevel(level, keepCode, options = {}) {
    runToken += 1;
    running = false;
    runBtn.disabled = false;
    if (options.resetPreview !== false) codePreviewEnabled = false;
    missionSparks = 0;
    missionEnergy = 0;
    state = {
      robot: clonePoint(level.robot),
      dir: level.robot.dir,
      gems: new Set((level.gems || []).map(key)),
      batteries: new Set((level.batteries || []).map(key)),
      steps: 0,
      inventory: { battery: 0 },
      won: false,
      trail: [key(level.robot)],
    };

    levelSelect.value = playingCreator ? "creator" : String(currentLevelIndex);
    levelTitle.textContent = level.title;
    levelGoal.textContent = level.goal;
    conceptLabel.textContent = level.concept;
    missionNumber.textContent = playingCreator ? "★" : String(currentLevelIndex + 1).padStart(2, "0");
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
    applyCosmetics();
    setByteMood("Ready for launch.", "ready");
    setMentor(playingCreator
      ? `${playerName()}'s dungeon is live. Run code to test the path, or press Create to edit it.`
      : `Hi ${playerName()}. I can read the mission out loud. Press Read to me, then help Byte.`);
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
      const current = !playingCreator && index === currentLevelIndex;
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
    const level = currentLevel();
    return (level[type] || []).some((point) => point.x === x && point.y === y);
  }

  function portalAt(x, y) {
    const level = currentLevel();
    return (level.portals || []).find((point) => point.x === x && point.y === y);
  }

  function inBounds(point) {
    const size = currentLevel().size;
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

  function simulatePlan(commands, level = currentLevel()) {
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

  function simulateCodePreview(source, level = currentLevel()) {
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
    const level = currentLevel();
    const solution = level.explorerSolution || [];
    if (!solution.length) return new Set();
    const visibleCommands = solution.slice(0, Math.min(solution.length, Math.max(explorerCommands.length + 3, 4)));
    const sim = simulatePlan(visibleCommands, level);
    return new Set((sim.path || []).slice(Math.max(0, expandVisualCommands(explorerCommands).filter((command) => command === "move()").length - 1)));
  }

  function addRobotPart(cell, className, text) {
    const part = document.createElement("span");
    part.className = `robot-part ${className}`;
    part.textContent = text;
    part.setAttribute("aria-hidden", "true");
    cell.appendChild(part);
  }

  function renderRobotParts(cell, cosmetics = currentCosmetics()) {
    if (cosmetics.aura !== "soft") cell.classList.add(`aura-${cosmetics.aura}`);
    if (cosmetics.hat !== "none") {
      const item = cosmeticItem("hat", cosmetics.hat);
      addRobotPart(cell, `hat-${cosmetics.hat}`, item ? item.icon : "✦");
    }
    if (cosmetics.visor !== "clear") {
      const item = cosmeticItem("visor", cosmetics.visor);
      addRobotPart(cell, `visor-${cosmetics.visor}`, item ? item.icon : "★");
    }
  }

  function render() {
    const level = currentLevel();
    const view = displayState();
    const cosmetics = currentCosmetics();
    board.style.setProperty("--cols", level.size);
    board.innerHTML = "";
    board.style.setProperty("--robot-rotation", `${ROTATION[view.dir]}deg`);
    facingLabel.textContent = view.dir;
    stepLabel.textContent = String(view.steps);
    const trails = new Set((state.trail || []).slice(0, -1));
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
        if (trails.has(`${x},${y}`)) cell.classList.add("step-trail");
        if (ghosts.has(`${x},${y}`)) cell.classList.add("ghost-path");
        if (view.robot.x === x && view.robot.y === y) {
          cell.classList.add("robot");
          renderRobotParts(cell, cosmetics);
        }
        board.appendChild(cell);
      }
    }

    const best = !playingCreator ? playerProgress().bestSteps[currentLevelIndex] : null;
    stars.textContent = playingCreator ? "★ Build ★" : best ? rating(best, level.maxSteps) : "☆ ☆ ☆";
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
        playTone("repeat");
        announceAction("repeat", `Loop x${command.count}!`, 5);
        for (let count = 0; count < command.count; count += 1) {
          await executeCommands(command.body, token);
        }
        continue;
      }

      if (command.type === "if") {
        const passes = command.test === "wall_ahead" ? wallAhead() : gemHere();
        playTone("sensor");
        announceAction("sensor", passes ? "Sensor yes!" : "Sensor no!", 3);
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
      announceAction("turn_left", actionWords.turn_left, 5);
      pulseBoard("turn");
      return;
    }

    if (command.type === "turn_right") {
      const index = DIRECTIONS.indexOf(state.dir);
      state.dir = DIRECTIONS[(index + 1) % 4];
      state.steps += 1;
      playTone("turn");
      announceAction("turn_right", actionWords.turn_right, 5);
      pulseBoard("turn");
      return;
    }

    if (command.type === "collect") {
      const pos = key(state.robot);
      let collected = false;
      let collectText = "Gem grab!";
      if (state.gems.has(pos)) {
        state.gems.delete(pos);
        collected = true;
      }
      if (state.batteries.has(pos)) {
        state.batteries.delete(pos);
        state.inventory.battery += 1;
        collected = true;
        collectText = "Power grab!";
      }
      state.steps += 1;
      if (collected) {
        missionSparks += 10;
        playTone("collect");
        announceAction("collect", collectText, 18);
        popSpark(collectText, "collect mega");
        pulseBoard("collect");
      } else {
        announceAction("sensor", "Nothing here.", 2);
      }
      return;
    }

    if (command.type === "move") {
      if (wallAhead()) {
        playTone("bump");
        announceAction("bump", actionWords.bump, 0);
        pulseBoard("bump");
        throw new Error("Bonk. Byte bumped a wall. Try a turn before that move.");
      }
      const delta = DELTAS[state.dir];
      const next = { x: state.robot.x + delta.x, y: state.robot.y + delta.y };
      if (tileAt(next.x, next.y, "bugs")) {
        playTone("bump");
        announceAction("bump", "Bug tile!", 0);
        pulseBoard("bump");
        throw new Error("Byte touched a bug tile. Find a path around it.");
      }
      state.robot = next;
      const portal = portalAt(next.x, next.y);
      if (portal) {
        state.robot = clonePoint(portal.to);
        playTone("portal");
        announceAction("portal", actionWords.portal, 10);
        popSpark("Portal pop!", "portal mega");
        pulseBoard("portal");
      }
      rememberStep(state.robot);
      state.steps += 1;
      playTone("move");
      if (!portal) {
        announceAction("move", actionWords.move, 7);
        pulseBoard("move");
      }
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

  function scheduleTone(context, frequency, start, duration, volume, wave = "triangle", slideTo = null) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = wave;
    oscillator.frequency.setValueAtTime(frequency, start);
    if (slideTo) oscillator.frequency.exponentialRampToValueAtTime(slideTo, start + duration);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration + 0.03);
  }

  function scheduleNoise(context, start, duration, volume, tone = "spark") {
    const length = Math.max(1, Math.floor(context.sampleRate * duration));
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let index = 0; index < length; index += 1) {
      data[index] = (Math.random() * 2 - 1) * (1 - index / length);
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    filter.type = tone === "thump" ? "lowpass" : "bandpass";
    filter.frequency.setValueAtTime(tone === "thump" ? 260 : 2600, start);
    filter.Q.setValueAtTime(tone === "thump" ? 0.6 : 7, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
    source.buffer = buffer;
    source.connect(filter).connect(gain).connect(context.destination);
    source.start(start);
    source.stop(start + duration + 0.02);
  }

  function playTone(type) {
    if (!soundEnabled) return;
    try {
      const context = soundContext();
      if (!context) return;
      const style = byteStyles[byteStyle] || byteStyles.sky;
      const base = style.tone;
      const now = context.currentTime;
      const playSteps = (steps) => steps.forEach((step) => {
        scheduleTone(context, step.frequency, now + (step.at || 0), step.duration, step.volume, step.wave, step.slideTo);
      });

      if (type === "move") {
        playSteps([
          { frequency: base * 0.78, slideTo: base * 1.02, duration: 0.075, volume: 0.034, wave: "sine" },
        ]);
        scheduleNoise(context, now, 0.055, 0.012, "spark");
        return;
      }

      if (type === "turn") {
        playSteps([
          { frequency: base * 0.58, duration: 0.045, volume: 0.026, wave: "triangle" },
          { frequency: base * 0.76, at: 0.045, duration: 0.050, volume: 0.026, wave: "triangle" },
        ]);
        return;
      }

      if (type === "collect") {
        playSteps([
          { frequency: base * 1.14, duration: 0.075, volume: 0.040, wave: "triangle" },
          { frequency: base * 1.48, at: 0.055, duration: 0.095, volume: 0.046, wave: "triangle" },
          { frequency: base * 1.92, at: 0.13, duration: 0.13, volume: 0.038, wave: "sine" },
        ]);
        scheduleNoise(context, now + 0.03, 0.18, 0.020, "spark");
        return;
      }

      if (type === "portal") {
        playSteps([
          { frequency: base * 0.68, slideTo: base * 1.42, duration: 0.28, volume: 0.035, wave: "sine" },
          { frequency: base * 1.82, at: 0.10, duration: 0.16, volume: 0.024, wave: "triangle" },
        ]);
        scheduleNoise(context, now + 0.04, 0.22, 0.016, "spark");
        return;
      }

      if (type === "repeat") {
        playSteps([0, 1, 2].map((index) => ({
          frequency: base * (0.74 + index * 0.12),
          at: index * 0.055,
          duration: 0.065,
          volume: 0.026,
          wave: "square",
        })));
        return;
      }

      if (type === "sensor") {
        playSteps([
          { frequency: base * 1.35, duration: 0.035, volume: 0.022, wave: "sine" },
          { frequency: base * 1.72, at: 0.055, duration: 0.045, volume: 0.022, wave: "sine" },
        ]);
        return;
      }

      if (type === "win") {
        playSteps([
          { frequency: base * 0.92, duration: 0.10, volume: 0.044, wave: "triangle" },
          { frequency: base * 1.16, at: 0.08, duration: 0.12, volume: 0.048, wave: "triangle" },
          { frequency: base * 1.46, at: 0.17, duration: 0.15, volume: 0.052, wave: "triangle" },
          { frequency: base * 1.94, at: 0.31, duration: 0.28, volume: 0.042, wave: "sine" },
        ]);
        scheduleNoise(context, now + 0.12, 0.36, 0.024, "spark");
        return;
      }

      if (type === "bump") {
        playSteps([
          { frequency: 180, slideTo: 120, duration: 0.16, volume: 0.048, wave: "sawtooth" },
        ]);
        scheduleNoise(context, now, 0.14, 0.024, "thump");
        return;
      }

      if (type === "launch" || type === "start") {
        playSteps([
          { frequency: base * 0.72, slideTo: base * 1.1, duration: 0.12, volume: 0.034, wave: "triangle" },
          { frequency: base * 1.42, at: 0.10, duration: 0.10, volume: 0.025, wave: "sine" },
        ]);
        return;
      }

      if (type === "style") {
        playSteps([
          { frequency: base, duration: 0.08, volume: 0.034, wave: "triangle" },
          { frequency: base * 1.33, at: 0.075, duration: 0.12, volume: 0.034, wave: "triangle" },
        ]);
        scheduleNoise(context, now + 0.03, 0.13, 0.014, "spark");
        return;
      }

      scheduleTone(context, base, now, 0.08, 0.026, "triangle");
    } catch (error) {
      // Sound is a bonus layer. Browsers can block it without affecting gameplay.
    }
  }

  function burstEffect(type) {
    if (!fxLayer) return;
    const counts = {
      launch: 12,
      move: 7,
      turn_left: 8,
      turn_right: 8,
      collect: 22,
      repeat: 14,
      sensor: 7,
      portal: 20,
      bump: 10,
      win: 36,
      style: 16,
    };
    const count = counts[type] || 8;
    for (let index = 0; index < count; index += 1) {
      const particle = document.createElement("span");
      particle.className = `fx-particle ${type}`;
      particle.style.setProperty("--x", `${randomBetween(32, 68)}%`);
      particle.style.setProperty("--y", `${randomBetween(34, 62)}%`);
      particle.style.setProperty("--tx", `${randomBetween(-130, 130)}px`);
      particle.style.setProperty("--ty", `${randomBetween(-110, 95)}px`);
      particle.style.setProperty("--spin", `${randomBetween(-180, 180)}deg`);
      particle.style.setProperty("--delay", `${randomBetween(0, 0.09)}s`);
      fxLayer.appendChild(particle);
      setTimeout(() => particle.remove(), 900);
    }

    const ring = document.createElement("span");
    ring.className = `fx-ring ${type}`;
    ring.style.setProperty("--x", `${randomBetween(40, 60)}%`);
    ring.style.setProperty("--y", `${randomBetween(38, 58)}%`);
    fxLayer.appendChild(ring);
    setTimeout(() => ring.remove(), 720);
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
    board.classList.remove("pulse-move", "pulse-turn", "pulse-collect", "pulse-win", "pulse-bump", "pulse-portal");
    void board.offsetWidth;
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
    restartCurrentLevel(true, { speak: false });
    runToken = token;
    running = true;
    runBtn.disabled = true;
    playTone("launch");
    announceAction("launch", actionWords.launch, 8);

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
    const level = currentLevel();
    missionSparks += 20;
    missionEnergy = 100;
    if (playingCreator) {
      nextBtn.disabled = true;
      missionPanel.classList.add("complete");
      setMentor(`Dungeon tested, ${playerName()}! Byte cleared your build in ${state.steps} steps.`);
      playTone("win");
      announceAction("win", "Build clear!", 0);
      popSpark("Build clear!", "win mega");
      pulseBoard("win");
      showSuccess();
      updateProgress();
      render();
      return;
    }

    const p = playerProgress();
    p.completed[currentLevelIndex] = true;
    const best = p.bestSteps[currentLevelIndex];
    if (!best || state.steps < best) p.bestSteps[currentLevelIndex] = state.steps;
    saveProgress();
    nextBtn.disabled = currentLevelIndex >= levels.length - 1;
    missionPanel.classList.add("complete");
    setMentor(`Mission complete, ${playerName()}! Byte used ${state.steps} steps. ${rating(state.steps, level.maxSteps)}`);
    playTone("win");
    announceAction("win", actionWords.win, 0);
    popSpark("Quest clear!", "win mega");
    pulseBoard("win");
    showSuccess();
    updateProgress();
    render();
  }

  function showSuccess() {
    const level = currentLevel();
    const finalMission = !playingCreator && currentLevelIndex >= levels.length - 1;
    successText.textContent = playingCreator
      ? `${playerName()} cleared a custom dungeon in ${state.steps} steps. Build another one or try a new path.`
      : finalMission
      ? `${playerName()} finished the current quest path. Byte is ready for the next world.`
      : `${playerName()} solved "${level.title}" in ${state.steps} steps.`;
    if (successSparkText) {
      const cheer = successCheers[currentLevelIndex % successCheers.length];
      successSparkText.textContent = `${cheer} ${missionSparks} sparks earned.`;
    }
    if (successBanner) successBanner.textContent = playingCreator ? "Build clear!" : finalMission ? "Crown coder!" : "Quest clear!";
    successNextBtn.textContent = playingCreator ? "Build More" : finalMission ? "Stay Here" : "Next Mission";
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
    const solution = currentLevel().explorerSolution || [];
    if (!solution.length) {
      setMentor("Builder Lab dungeons do not have an answer key yet. Try a move, watch Byte, then change the plan.");
      return;
    }
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
    const level = currentLevel();
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
    if (playingCreator) return "";
    return `assets/voice/mission-${String(currentLevelIndex + 1).padStart(2, "0")}.mp3`;
  }

  function playMissionAudio() {
    if (!audioPlayer) return Promise.reject(new Error("No audio player."));
    if (playingCreator) return Promise.reject(new Error("Creator narration uses browser voice."));

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
    renderWorkshop(record);
  }

  function renderWorkshop(record = playerProgress()) {
    if (!workshopGrid || !workshopPreview || !workshopSummary) return;
    const cosmetics = currentCosmetics();
    const unlockedItems = cosmeticItems.filter((item) => item.unlockIndex !== null && cosmeticUnlocked(item, record)).length;
    const earnedTotal = cosmeticItems.filter((item) => item.unlockIndex !== null).length;
    const equipped = Object.entries(cosmetics)
      .map(([slot, value]) => cosmeticItem(slot, value))
      .filter(Boolean)
      .map((item) => item.name)
      .join(", ");

    workshopPreview.innerHTML = `
      <div class="workshop-byte ${cosmeticClasses(cosmetics).join(" ")}">
        ${robotPartMarkup(cosmetics)}
      </div>
    `;
    workshopSummary.textContent = `${unlockedItems} of ${earnedTotal} robot parts earned. Equipped: ${equipped}.`;
    workshopGrid.innerHTML = cosmeticItems.map((item) => {
      const unlocked = cosmeticUnlocked(item, record);
      const equippedItem = cosmetics[item.slot] === item.value;
      const unlockText = item.unlockIndex === null ? "Starter part" : `Finish quest ${item.unlockIndex + 1}`;
      return `
        <button class="workshop-item ${unlocked ? "unlocked" : "locked"} ${equippedItem ? "equipped" : ""}" data-cosmetic-id="${item.id}" type="button" ${unlocked ? "" : "disabled"} aria-pressed="${equippedItem}">
          <span class="workshop-icon">${item.icon}</span>
          <span>
            <strong>${item.name}</strong>
            <small>${unlocked ? item.detail : unlockText}</small>
          </span>
          <em>${equippedItem ? "Equipped" : unlocked ? "Equip" : "Locked"}</em>
        </button>
      `;
    }).join("");
  }

  function robotPartMarkup(cosmetics = currentCosmetics()) {
    const parts = [];
    if (cosmetics.hat !== "none") {
      const item = cosmeticItem("hat", cosmetics.hat);
      parts.push(`<span class="robot-part hat-${cosmetics.hat}" aria-hidden="true">${item ? item.icon : "✦"}</span>`);
    }
    if (cosmetics.visor !== "clear") {
      const item = cosmeticItem("visor", cosmetics.visor);
      parts.push(`<span class="robot-part visor-${cosmetics.visor}" aria-hidden="true">${item ? item.icon : "★"}</span>`);
    }
    return parts.join("");
  }

  function equipCosmetic(id) {
    const item = cosmeticItems.find((cosmetic) => cosmetic.id === id);
    if (!item) return;
    const record = playerProgress();
    if (!cosmeticUnlocked(item, record)) {
      setMentor(`${item.name} is still locked. Finish more quests to open it.`);
      return;
    }
    record.cosmetics = currentCosmetics();
    record.cosmetics[item.slot] = item.value;
    saveProgress();
    applyCosmetics();
    render();
    renderRewards();
    setMentor(`${item.name} equipped for ${playerName()}.`);
    playTone("style");
    announceAction("style", item.name, 6);
  }

  function setCreatorStatus(message) {
    if (creatorStatus) creatorStatus.textContent = message;
  }

  function renderCreatorPalette() {
    if (!creatorPalette) return;
    creatorPalette.querySelectorAll("[data-creator-tool]").forEach((button) => {
      const active = button.dataset.creatorTool === creatorTool;
      button.classList.toggle("active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function renderCreatorGrid() {
    if (!creatorGrid) return;
    const draft = normalizeCreatorLevel(creatorDraft);
    creatorDraft = draft;
    creatorGrid.style.setProperty("--creator-size", draft.size);
    creatorGrid.innerHTML = "";
    for (let y = 0; y < draft.size; y += 1) {
      for (let x = 0; x < draft.size; x += 1) {
        const kind = creatorCellKind(x, y, draft);
        const button = document.createElement("button");
        button.type = "button";
        button.className = `creator-cell ${kind}`;
        button.dataset.creatorX = String(x);
        button.dataset.creatorY = String(y);
        button.textContent = creatorIcon(kind);
        button.setAttribute("aria-label", `${kind} tile, column ${x + 1}, row ${y + 1}`);
        creatorGrid.appendChild(button);
      }
    }
    renderCreatorPalette();
  }

  function editCreatorCell(x, y) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) return;
    if (creatorTool === "start") {
      creatorDraft.robot = { x, y, dir: "east" };
      clearCreatorCell(x, y);
      setCreatorStatus("Byte start moved. Add a gem, then Play Test.");
    } else if (creatorTool === "floor") {
      clearCreatorCell(x, y);
      setCreatorStatus("Floor cleared. Keep building.");
    } else {
      if (creatorDraft.robot.x === x && creatorDraft.robot.y === y) {
        setCreatorStatus("Byte needs a start square. Move Byte before placing that tile.");
        return;
      }
      const type = creatorTool === "wall" ? "walls" : creatorTool === "gem" ? "gems" : "bugs";
      const alreadyPlaced = (creatorDraft[type] || []).some((point) => point.x === x && point.y === y);
      clearCreatorCell(x, y);
      if (!alreadyPlaced) addCreatorPoint(type, x, y);
      setCreatorStatus(alreadyPlaced ? "Tile cleared." : `${creatorTool === "gem" ? "Gem" : creatorTool === "bug" ? "Bug" : "Wall"} placed.`);
    }
    creatorDraft = normalizeCreatorLevel(creatorDraft);
    renderCreatorGrid();
  }

  function saveCreatorDraft() {
    const next = normalizeCreatorLevel(creatorDraft);
    if (!next.gems.length) {
      setCreatorStatus("Add at least one gem so Byte has a goal.");
      return false;
    }
    creatorLevel = next;
    creatorDraft = cloneCreatorLevel(next);
    const saved = saveCreatorLevel();
    setupLevelPicker();
    levelSelect.value = playingCreator ? "creator" : String(currentLevelIndex);
    renderCreatorGrid();
    setCreatorStatus(saved ? "Dungeon saved on this device." : "Dungeon ready for this session.");
    return true;
  }

  function playCreatorDungeon() {
    if (!saveCreatorDraft()) return;
    closeCreatorPanel();
    successModal.classList.add("hidden");
    playTone("start");
    initCreatorLevel(false, { speak: false });
  }

  function openCreatorPanel() {
    creatorDraft = cloneCreatorLevel(creatorLevel);
    renderCreatorGrid();
    closeParentPanel();
    closeRewardPanel();
    creatorPanel.classList.remove("hidden");
    creatorPanel.setAttribute("aria-hidden", "false");
  }

  function closeCreatorPanel() {
    creatorPanel.classList.add("hidden");
    creatorPanel.setAttribute("aria-hidden", "true");
  }

  function openRewardPanel() {
    renderRewards();
    closeCreatorPanel();
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
    closeCreatorPanel();
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

    progress[player] = { completed: {}, bestSteps: {}, cosmetics: { ...starterCosmetics } };
    saveProgress();
    resetProgressBtn.dataset.confirm = "";
    resetProgressBtn.textContent = "Reset Current Player";
    initLevel(0, false, { speak: false });
    renderParentStats();
  }

  document.querySelectorAll("[data-player]").forEach((button) => {
    button.addEventListener("click", () => {
      player = button.dataset.player;
      restartCurrentLevel(false, { speak: false });
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
      playTone("style");
      announceAction("style", byteStyles[byteStyle].label, 6);
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

  if (workshopGrid) {
    workshopGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-cosmetic-id]");
      if (!button || button.disabled) return;
      equipCosmetic(button.dataset.cosmeticId);
    });
  }

  if (creatorPalette) {
    creatorPalette.addEventListener("click", (event) => {
      const button = event.target.closest("[data-creator-tool]");
      if (!button) return;
      creatorTool = button.dataset.creatorTool;
      renderCreatorPalette();
      setCreatorStatus(`${button.textContent.trim()} tool selected.`);
    });
  }

  if (creatorGrid) {
    creatorGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-creator-x]");
      if (!button) return;
      editCreatorCell(Number(button.dataset.creatorX), Number(button.dataset.creatorY));
    });
  }

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
  resetBtn.addEventListener("click", () => restartCurrentLevel(true, { speak: false }));
  clearBtn.addEventListener("click", () => {
    codeInput.value = "";
    refreshCodePreview();
    setMentor("Code cleared. Add one command at a time and watch what Byte does.");
  });
  sampleBtn.addEventListener("click", () => {
    codeInput.value = currentLevel().starter;
    refreshCodePreview();
    setMentor("Starter loaded. Run it, then experiment.");
  });
  hintBtn.addEventListener("click", () => {
    const hint = currentLevel().hint;
    setMentor(hint);
    if (voiceEnabled || player === "Explorer") speak(`Hint. ${hint}`);
  });
  nextBtn.addEventListener("click", () => initLevel(Math.min(currentLevelIndex + 1, levels.length - 1), false, { speak: voiceEnabled || player === "Explorer" }));
  levelSelect.addEventListener("change", () => {
    if (levelSelect.value === "creator") initCreatorLevel(false, { speak: false });
    else initLevel(Number(levelSelect.value), false, { speak: voiceEnabled || player === "Explorer" });
  });
  startBtn.addEventListener("click", () => {
    playTone("start");
    welcomeModal.classList.add("hidden");
    if (player === "Explorer") speakMission();
  });
  if (soundBtn) {
    soundBtn.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      saveSfxPreference();
      syncSoundButton();
      if (soundEnabled) playTone("style");
    });
  }
  replayBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    restartCurrentLevel(false, { speak: false });
  });
  successNextBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    if (playingCreator) {
      openCreatorPanel();
      return;
    }
    if (currentLevelIndex < levels.length - 1) initLevel(currentLevelIndex + 1, false, { speak: voiceEnabled || player === "Explorer" });
  });
  successRewardsBtn.addEventListener("click", () => {
    successModal.classList.add("hidden");
    openRewardPanel();
  });
  parentBtn.addEventListener("click", openParentPanel);
  if (creatorBtn) creatorBtn.addEventListener("click", openCreatorPanel);
  rewardsBtn.addEventListener("click", openRewardPanel);
  closeParentBtn.addEventListener("click", closeParentPanel);
  closeRewardsBtn.addEventListener("click", closeRewardPanel);
  if (closeCreatorBtn) closeCreatorBtn.addEventListener("click", closeCreatorPanel);
  if (creatorSaveBtn) creatorSaveBtn.addEventListener("click", saveCreatorDraft);
  if (creatorPlayBtn) creatorPlayBtn.addEventListener("click", playCreatorDungeon);
  if (creatorResetBtn) creatorResetBtn.addEventListener("click", () => {
    creatorDraft = defaultCreatorLevel();
    renderCreatorGrid();
    setCreatorStatus("Starter dungeon restored.");
  });
  if (creatorClearBtn) creatorClearBtn.addEventListener("click", () => {
    creatorDraft = {
      ...defaultCreatorLevel(),
      robot: { x: 0, y: 2, dir: "east" },
      gems: [],
      walls: [],
      bugs: [],
    };
    renderCreatorGrid();
    setCreatorStatus("Blank dungeon ready. Add at least one gem.");
  });
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
      closeCreatorPanel();
      welcomeModal.classList.add("hidden");
    }
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      runProgram();
    }
  });

  window.RobotDungeon = { levels, parseProgram, countCommands };

  applyByteStyle();
  syncSoundButton();
  setupLevelPicker();
  initLevel(0, false, { speak: false });
})();
