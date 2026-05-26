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

function normalizeInventory(character) {
  if (!character.inventory) character.inventory = [];

  const merged = [];

  character.inventory.forEach(item => {
    const name = typeof item === "string" ? item : item.name;
    const qty = typeof item === "string" ? 1 : item.qty || 1;

    if (!name) return;

    const existing = merged.find(i => i.name.toLowerCase() === name.toLowerCase());

    if (existing) {
      existing.qty += qty;
    } else {
      merged.push({ name, qty });
    }
  });

  character.inventory = merged;
}

function renderInventory() {
  const character = loadCharacter();
  const container = document.getElementById("inventory");

  if (!character || !container) return;

  normalizeInventory(character);
  saveCharacter(character);

  container.innerHTML = `
    <div class="info-card">
      <h3>Inventory</h3>

      <div class="inventory-input">
        <input id="newItem" placeholder="Add item, like Potion or Escape Rope" />
        <button type="button" onclick="addItem()">Add</button>
      </div>

      <div id="inventory-list" style="margin-top: 12px;">
        ${
          character.inventory.length === 0
            ? `<p class="muted">No inventory items yet.</p>`
            : character.inventory.map((item, index) => `
              <div class="inventory-item">
                <span>${escapeHtml(item.qty > 1 ? `${item.qty} ${item.name}` : item.name)}</span>
                <button type="button" onclick="removeItem(${index})">Remove</button>
              </div>
            `).join("")
        }
      </div>
    </div>
  `;
}

function addItem() {
  const input = document.getElementById("newItem");
  const value = input.value.trim();

  if (!value) return;

  const character = loadCharacter();
  if (!character) return;

  normalizeInventory(character);

  const existing = character.inventory.find(
    item => item.name.toLowerCase() === value.toLowerCase()
  );

  if (existing) {
    existing.qty += 1;
  } else {
    character.inventory.push({ name: value, qty: 1 });
  }

  saveCharacter(character);
  renderInventory();
}

function removeItem(index) {
  const character = loadCharacter();
  if (!character) return;

  normalizeInventory(character);

  const item = character.inventory[index];

  if (item.qty > 1) {
    item.qty -= 1;
  } else {
    character.inventory.splice(index, 1);
  }

  saveCharacter(character);
  renderInventory();
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

renderInventory();