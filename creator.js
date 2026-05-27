const classData = {
  "Black Belt": {
    summary: "A disciplined martial trainer who strengthens physical Pokémon and thrives in direct combat.",
    level1: [
      "Fighting Instinct: Your Pokémon gain +1 to physical attack rolls.",
      "Iron Body: Reduce incoming damage by 1 once per turn."
    ],
    levels: {
      2: ["Battle Focus: Gain advantage on your first attack roll once per encounter."],
      3: ["Power Strike: Once per encounter, add extra damage to a physical hit."],
      5: ["Unbreakable Form: Gain resistance to fear or intimidation effects."]
    },
    gear: [
      ["Trainer Vest, 3 Poké Balls, 1 Great Ball"],
      ["Potion, Potion, Antidote, ₽10"],
      ["Explorer Kit, 1 Poké Ball, Rations"]
    ]
  },

  "Ranger": {
    summary: "A field-trained survivalist who understands wild Pokémon, terrain, weather, and migration patterns.",
    level1: [
      "Calming Presence: You gain advantage when trying to calm or redirect wild Pokémon.",
      "Trail Sense: You gain advantage on tracking, navigation, and wilderness checks."
    ],
    levels: {
      2: ["Terrain Reader: Learn one useful detail about nearby terrain or weather."],
      3: ["Field Bond: Once per rest, give a partner Pokémon a small bonus during a natural encounter."],
      5: ["Pathfinder: Ignore minor difficult terrain while traveling."]
    },
    gear: [
      ["Trail Cloak, 3 Poké Balls"],
      ["Potion, Antidote, Paralyze Heal, ₽10"],
      ["Escape Rope, Berry Pouch, 1 Poké Ball"]
    ]
  },

  "Channeler": {
    summary: "A spiritually sensitive trainer who can sense emotions, lingering energy, and supernatural disturbances.",
    level1: [
      "Spirit Sense: You can detect strong emotional residue or spiritual disturbance nearby.",
      "Soothing Voice: Once per encounter, help calm a frightened or aggressive Pokémon."
    ],
    levels: {
      2: ["Omen Reading: Ask the DM for a vague sign about nearby danger or unrest."],
      3: ["Veil-Touched: Gain advantage against fear, possession, or spiritual influence."],
      5: ["Spirit Intercession: Once per rest, reduce harm caused by a Ghost, Psychic, or cursed effect."]
    },
    gear: [
      ["Spirit Charm, 3 Poké Balls"],
      ["Potion, Awakening, Antidote, ₽10"],
      ["Incense Pouch, Matches, 1 Poké Ball"]
    ]
  },

  "Magician": {
    summary: "A clever performer and trickster who uses misdirection, illusions, and timing to control the flow of a scene.",
    level1: [
      "Misdirection: Once per encounter, impose disadvantage on a hostile action against you or your Pokémon.",
      "Stage Presence: Gain advantage on performance, distraction, or deception checks."
    ],
    levels: {
      2: ["Quick Hands: Use or draw a small item without spending your main action once per encounter."],
      3: ["False Opening: Once per rest, bait an enemy into wasting movement or attention."],
      5: ["Grand Illusion: Create a convincing distraction that can affect a small group."]
    },
    gear: [
      ["Performer’s Cloak, 3 Poké Balls"],
      ["Potion, Poké Doll, Escape Rope, ₽10"],
      ["Trick Case, Marked Cards, 1 Poké Ball"]
    ]
  }
};

const statNames = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
const pointCosts = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };

const starterPokemon = [
  "Starly",
  "Shinx",
  "Budew",
  "Zubat",
  "Drifloon",
  "Croagunk",
  "Bronzor",
  "Shellos",
  "Bidoof"
];

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
  inventory: [],
  starterPokemon: "Starly",
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
    <div class="grid">
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

      <div class="info-card">
        <h3>${character.className}</h3>
        <p>${selected.summary}</p>

        <h3>Level 1 Abilities</h3>
        <ul>
          ${selected.level1.map(a => `<li>${a}</li>`).join("")}
        </ul>
      </div>

      <div class="info-card">
        <button class="secondary-button collapsible-btn" onclick="toggleLevels()">
          Show Higher Level Abilities
        </button>

        <div id="levelAbilities" style="display:none; margin-top:10px;">
          ${Object.entries(selected.levels).map(([lvl, abilities]) => `
            <div style="margin-bottom:10px;">
              <strong>Level ${lvl}</strong>
              <ul>
                ${abilities.map(a => `<li>${a}</li>`).join("")}
              </ul>
            </div>
          `).join("")}
        </div>
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
  const selected = classData[character.className] || classData[Object.keys(classData)[0]];
  const allGearOptions = selected.gear.flat();

  if (!character.gear.selected) {
    character.gear.selected = allGearOptions[0];
  }

  if (!character.starterPokemon) {
    character.starterPokemon = starterPokemon[0];
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

      <label class="info-card full-span">
        <span>Starting Pokémon</span>
        <select onchange="saveStarterPokemon(this.value)">
          ${starterPokemon.map(name => `
            <option ${name === character.starterPokemon ? "selected" : ""}>${name}</option>
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

function saveStarterPokemon(value) {
  character.starterPokemon = value;
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
  const startingGear = character.gear?.selected;

  if (!Array.isArray(character.inventory)) {
    character.inventory = [];
  }

  if (startingGear) {
    character.inventory = character.inventory.filter(item => {
      if (typeof item === "string") return item !== startingGear;
      return item.name !== startingGear;
    });

    const startingItems = startingGear
      .split(",")
      .map(item => item.trim())
      .filter(item => item.length > 0);

    startingItems.forEach(itemName => {
      const existing = character.inventory.find(item => {
        if (typeof item === "string") return item.toLowerCase() === itemName.toLowerCase();
        return item.name.toLowerCase() === itemName.toLowerCase();
      });

      if (existing) {
        if (typeof existing === "string") {
          character.inventory = character.inventory.filter(i => i !== existing);
          character.inventory.push({ name: itemName, qty: 2 });
        } else {
          existing.qty += 1;
        }
      } else {
        character.inventory.push({ name: itemName, qty: 1 });
      }
    });
  }

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

  if (!Array.isArray(character.inventory)) {
    character.inventory = [];
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

function toggleLevels() {
  const el = document.getElementById("levelAbilities");

  if (!el) return;

  el.style.display = el.style.display === "none" ? "block" : "none";
}

loadFromBrowser();