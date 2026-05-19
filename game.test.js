const fs = require("fs");
const vm = require("vm");

const gameSource = fs.readFileSync("game.js", "utf8");

function makeElement() {
  return {
    style: { setProperty() {} },
    classList: { add() {}, remove() {}, toggle() {} },
    appendChild() {},
    remove() {},
    addEventListener() {},
    set innerHTML(value) { this._innerHTML = value; },
    get innerHTML() { return this._innerHTML || ""; },
    textContent: "",
    value: "",
    disabled: false,
    dataset: {},
    focus() {},
    select() {},
    setAttribute() {},
  };
}

const elements = new Map();
const ids = [
  "board", "codeInput", "levelSelect", "runBtn", "resetBtn", "hintBtn",
  "nextBtn", "readBtn", "sampleBtn", "mentorText", "levelTitle", "levelGoal",
  "conceptLabel", "facingLabel", "stepLabel", "stars", "progressName",
  "treasureText", "sparkCount", "byteMood", "byteCompanion", "byteSpeech", "boostFill", "fxLayer", "actionBanner",
  "progressText", "progressFill", "clearBtn", "parentBtn", "creatorBtn", "soundBtn", "closeParentBtn",
  "exportBtn", "resetProgressBtn", "startBtn", "replayBtn", "successRewardsBtn", "successNextBtn",
  "lessonList", "welcomeModal", "successModal", "successText", "parentPanel",
  "parentStats", "exportBox", "missionNumber", "explorerBuilder", "explorerClearBtn",
  "explorerRunBtn", "explorerHelpBtn", "explorerPlan", "rewardsBtn", "closeRewardsBtn",
  "rewardPanel", "rewardGrid", "rewardName", "rewardIntro", "workshopGrid", "workshopPreview", "workshopSummary",
  "creatorPanel", "creatorPalette", "creatorGrid", "creatorStatus", "closeCreatorBtn",
  "creatorClearBtn", "creatorResetBtn", "creatorSaveBtn", "creatorPlayBtn",
  "worldMap", "mapSummary",
  "profileCard", "profileAvatar", "profileMode", "profileName", "profileLine",
  "builderNameInput", "explorerNameInput", "saveNamesBtn",
  "successSparkText", "successBanner", "bytePicker",
];

ids.forEach((id) => elements.set(id, makeElement()));

const context = {
  console,
  localStorage: {
    getItem() { return null; },
    setItem() {},
  },
  document: {
    body: makeElement(),
    getElementById(id) { return elements.get(id) || makeElement(); },
    querySelector() { return makeElement(); },
    querySelectorAll() { return []; },
    createElement() { return makeElement(); },
    addEventListener() {},
  },
  window: {},
  Audio: function Audio() {
    return {
      pause() {},
      play() { return Promise.resolve(); },
      currentTime: 0,
      volume: 1,
      playbackRate: 1,
      src: "",
      onended: null,
      onerror: null,
    };
  },
  setTimeout,
  clearTimeout,
  setInterval,
  clearInterval,
  Promise,
};

vm.createContext(context);
vm.runInContext(gameSource, context);

const api = context.window.RobotDungeon;
if (!api) throw new Error("RobotDungeon API was not exposed.");
if (api.levels.length < 10) throw new Error("Expected at least 10 starter missions.");

const parsed = api.parseProgram("repeat(2):\n    move()\nturn_right()");
if (parsed.length !== 2 || parsed[0].type !== "repeat" || parsed[1].type !== "turn_right") {
  throw new Error("Parser did not understand repeat plus turn_right.");
}

let failed = false;
try {
  api.parseProgram("fly()");
} catch (error) {
  failed = true;
}
if (!failed) throw new Error("Parser accepted an unknown command.");

failed = false;
try {
  api.parseProgram("repeat(2):");
} catch (error) {
  failed = true;
}
if (!failed) throw new Error("Parser accepted an empty repeat block.");

console.log("Robot Dungeon tests passed.");
