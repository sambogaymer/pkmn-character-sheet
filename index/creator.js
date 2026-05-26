const classData = {
  "Black Belt": {
    hitDie: "d10",
    primary: "Strength",
    saves: "Strength, Constitution",
    gear: [
      ["Training Garb, 3 Poké Balls, ₽10"],
      ["Potion x3, ₽10"],
      ["Explorer Kit, 1 Poké Ball, ₽10"]
    ]
  },

  "Ranger": {
    hitDie: "d8",
    primary: "Dexterity or Wisdom",
    saves: "Dexterity, Wisdom",
    gear: [
      ["Ranger Hat, 3 Poke Balls, ₽10"],
      ["Potion, Antidote, Paralyze Heal, ₽10"],
      ["Escape Rope, Berry Pouch, 1 Poke Ball, ₽10"]
    ]
  },

  "Channeler": {
    hitDie: "d8",
    primary: "Wisdom",
    saves: "Wisdom, Charisma",
    gear: [
      ["Spirit Charm + 3 Poké Balls"],
      ["Potion, Awakening, Antidote, ₽10"],
      ["Incense Pouch, Matches, 1 Poke Ball, ₽10"]
    ]
  },

  "Mystic": {
    hitDie: "d6",
    primary: "Intelligence or Charisma",
    saves: "Intelligence, Charisma",
    gear: [
      ["Performer’s Cloak, 3 Poké Balls, ₽10"],
      ["Escape Rope, Poke Doll, ₽10"],
      ["Playing Cards, 1 Poke Ball, ₽10"]
    ]
  }
};

const statNames = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
const pointCosts = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

const steps = [
  { title: "Class", icon: "⚔️" },
  { title: "Background", icon: "📜" },
  { title: "Abilities", icon: "🎲" },
  { title: "Starting Gear", icon: "🎒" }
];

let currentStep = 0;

let character = {
  name: "",
  className: "Black Belt",
  level: 1,
  alignment: "",
  faith: "",
  personality: "",
  physical: "",
  notes: "",
  stats: {
    Strength: 8,
    Dexterity: 8,
    Constitution: 8,
    Intelligence: 8,
    Wisdom: 8,
    Charisma: 8
  },
  gear: {},
  inventory: []
};

function startCreator() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("creator").style.display = "block";
  render();
}

function nextStep() {
  if (currentStep === 2 && pointsSpent() > 27) {
    alert("You have spent too many points.");
    return;
  }

  currentStep = Math.min(currentStep + 1, steps.length - 1);
  render();
}

function prevStep() {
  currentStep = Math.max(currentStep - 1, 0);
  render();
}

function render() {
  document.getElementById("stepCounter").textContent =
    `Step ${currentStep + 1} of ${steps.length}: ${steps[currentStep].title}`;

  document.getElementById("stepTitle").textContent = steps[currentStep].title;
  document.getElementById("stepIcon").textContent = steps[currentStep].icon;

  document.getElementById("backButton").disabled = currentStep === 0;
  document.getElementById("nextButton").disabled = currentStep === steps.length - 1;

  const content = document.getElementById("stepContent");

  if (currentStep === 0) content.innerHTML = renderClassStep();
  if (currentStep === 1) content.innerHTML = renderBackgroundStep();
  if (currentStep === 2) content.innerHTML = renderAbilityStep();
  if (currentStep === 3) content.innerHTML = renderGearStep();
}

function renderClassStep() {
  const selected = classData[character.className] || classData[Object.keys(classData)[0]];

  return `
    <div class="grid grid-2">
      <label>
        <span>Character Name</span>
        <input value="${escapeHtml(character.name)}" oninput="saveTextField('name', this.value)" placeholder="Enter character name" />
      </label>

      <label>
        <span>Class</span>
        <select onchange="saveField('className', this.value)">
          ${Object.keys(classData).map(name => `
            <option ${name === character.className ? "selected" : ""}>${name}</option>
          `).join("")}
        </select>
      </label>

      <div class="info-card full-span">
        <h3>${character.className} Overview</h3>
        <p><strong class="muted">Hit Die:</strong> ${selected.hitDie}</p>
        <p><strong class="muted">Primary Ability:</strong> ${selected.primary}</p>
        <p><strong class="muted">Saving Throws:</strong> ${selected.saves}</p>
      </div>
    </div>
  `;
}

function renderBackgroundStep() {
  return `
    <div class="grid grid-2">
      ${textareaField("alignment", "Alignment")}
      ${textareaField("faith", "Potential Faith")}
      ${textareaField("personality", "Personality")}
      ${textareaField("physical", "Physical Characteristics")}

      <label class="full-span">
        <span>General Notes</span>
        <textarea oninput="saveTextField('notes', this.value)">${escapeHtml(character.notes)}</textarea>
      </label>
    </div>
  `;
}

function textareaField(field, label) {
  return `
    <label>
      <span>${label}</span>
      <textarea oninput="saveTextField('${field}', this.value)">${escapeHtml(character[field])}</textarea>
    </label>
  `;
}

function renderAbilityStep() {
  const spent = pointsSpent();
  const left = 27 - spent;

  return `
    <div class="warning-card ${left < 0 ? "over" : ""}">
      <strong>Point Buy:</strong> ${spent} / 27 spent, ${left} remaining.
    </div>

    <div style="height:18px"></div>

    <div class="grid grid-3">
      ${statNames.map(stat => `
        <div class="stat-card">
          <div class="stat-header">
            <h3>${stat}</h3>
            <div class="mod">${modifier(character.stats[stat])}</div>
          </div>

          <select onchange="saveStat('${stat}', this.value)">
            ${Object.keys(pointCosts).map(score => `
              <option value="${score}" ${Number(score) === character.stats[stat] ? "selected" : ""}>
                ${score} score, ${pointCosts[score]} points
              </option>
            `).join("")}
          </select>
        </div>
      `).join("")}
    </div>
  `;
}

function renderGearStep() {
  const selected = classData[character.className];
  const allGearOptions = selected.gear.flat();

  if (!character.gear.selected) {
    character.gear.selected = allGearOptions[0];
  }

  return `
    <div class="grid grid-2">
      <label class="info-card full-span">
        <span>Starting Equipment</span>
        <select onchange="saveSingleGear(this.value)">
          ${allGearOptions.map(choice => `
            <option ${choice === character.gear.selected ? "selected" : ""}>${choice}</option>
          `).join("")}
        </select>
      </label>
    </div>

    <div class="final-actions">
      <button class="secondary-button" onclick="cancelCharacter()">Cancel</button>
      <button class="primary-button" onclick="saveAndRedirect()">Save</button>
    </div>
  `;
}

function saveField(field, value) {
  character[field] = value;

  if (field === "className") {
    character.gear = {};
  }

  render();
}

function saveTextField(field, value) {
  character[field] = value;
}

function saveStat(stat, value) {
  character.stats[stat] = Number(value);
  render();
}

function saveSingleGear(value) {
  character.gear = { selected: value };
  render();
}

function pointsSpent() {
  return Object.values(character.stats)
    .reduce((sum, score) => sum + pointCosts[score], 0);
}

function modifier(score) {
  const value = Math.floor((score - 10) / 2);
  return value >= 0 ? `+${value}` : `${value}`;
}

function cancelCharacter() {
  if (!confirm("Are you sure you want to cancel? This will reset everything.")) return;

  localStorage.removeItem("tabletopCharacter");
  location.reload();
}

function saveAndRedirect() {
  localStorage.setItem("tabletopCharacter", JSON.stringify(character));
  window.location.href = "test.html";
}

function loadFromBrowser() {
  const saved = localStorage.getItem("tabletopCharacter");

  if (saved) {
    try {
      character = JSON.parse(saved);
    } catch (error) {
      console.warn("Could not load saved character.", error);
    }
  }

  if (!classData[character.className]) {
    character.className = Object.keys(classData)[0];
    character.gear = {};
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

loadFromBrowser();