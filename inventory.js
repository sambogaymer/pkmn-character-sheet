function loadCharacter() {
  const saved = localStorage.getItem("tabletopCharacter");
  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function saveCharacter(character) {
  localStorage.setItem("tabletopCharacter", JSON.stringify(character));
}

function renderInventory() {
  const character = loadCharacter();
  const container = document.getElementById("inventory");

  if (!character) return;

  if (!character.inventory) character.inventory = [];

  container.innerHTML = `
    <div class="info-card">
      <h3>Inventory</h3>

      <div id="inventory-list">
        ${character.inventory.map((item, index) => `
          <div style="display:flex; justify-content:space-between; margin-bottom:6px;">
            <span>${item}</span>
            <button onclick="removeItem(${index})">X</button>
          </div>
        `).join("")}
      </div>

      <div style="margin-top:10px;">
        <input id="newItem" placeholder="Add item..." />
        <button onclick="addItem()">Add</button>
      </div>
    </div>
  `;
}

function addItem() {
  const input = document.getElementById("newItem");
  const value = input.value.trim();

  if (!value) return;

  const character = loadCharacter();
  character.inventory.push(value);

  saveCharacter(character);
  input.value = "";

  renderInventory();
}

function removeItem(index) {
  const character = loadCharacter();
  character.inventory.splice(index, 1);

  saveCharacter(character);
  renderInventory();
}

renderInventory();