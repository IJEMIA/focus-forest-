// Configuración
const UNLOCK_DURATION = 1800;
const CELL_SIZE = 20;
const ANIMAL_MOVE_INTERVAL = 3000;

// PLANTAS (20 tipos)
const TREES = [
    { id: 1, name: "🌲 Pino", rarity: "Común", cost: 5, emoji: "🌲", type: "tree" },
    { id: 2, name: "🌳 Roble", rarity: "Común", cost: 10, emoji: "🌳", type: "tree" },
    { id: 3, name: "🎄 Abeto", rarity: "Común", cost: 15, emoji: "🎄", type: "tree" },
    { id: 4, name: "🌴 Palmera", rarity: "Común", cost: 20, emoji: "🌴", type: "tree" },
    { id: 5, name: "🍁 Arce", rarity: "Común", cost: 25, emoji: "🍁", type: "tree" },
    { id: 6, name: "🌸 Cerezo", rarity: "Raro", cost: 35, emoji: "🌸", type: "tree" },
    { id: 7, name: "🍊 Naranjo", rarity: "Raro", cost: 45, emoji: "🍊", type: "tree" },
    { id: 8, name: "🌿 Sauce", rarity: "Raro", cost: 55, emoji: "🌿", type: "tree" },
    { id: 9, name: "🍂 Olmo", rarity: "Raro", cost: 65, emoji: "🍂", type: "tree" },
    { id: 10, name: "🌺 Flor de Cerezo", rarity: "Raro", cost: 75, emoji: "🌺", type: "tree" },
    { id: 11, name: "🍄 Seta Mágica", rarity: "Raro", cost: 80, emoji: "🍄", type: "tree" },
    { id: 12, name: "🌵 Cactus", rarity: "Común", cost: 30, emoji: "🌵", type: "tree" },
    { id: 13, name: "🪴 Planta Interior", rarity: "Común", cost: 12, emoji: "🪴", type: "tree" },
    { id: 14, name: "🌻 Girasol", rarity: "Común", cost: 18, emoji: "🌻", type: "tree" },
    { id: 15, name: "🌿 Helecho", rarity: "Común", cost: 8, emoji: "🌿", type: "tree" },
    { id: 16, name: "✨ Árbol Brillante", rarity: "Épico", cost: 100, emoji: "✨", type: "tree" },
    { id: 17, name: "🔥 Árbol Ígneo", rarity: "Épico", cost: 120, emoji: "🔥", type: "tree" },
    { id: 18, name: "💎 Árbol Cristal", rarity: "Épico", cost: 150, emoji: "💎", type: "tree" },
    { id: 19, name: "🌙 Árbol Lunar", rarity: "Legendario", cost: 200, emoji: "🌙", type: "tree" },
    { id: 20, name: "👑 Árbol Real", rarity: "Legendario", cost: 250, emoji: "👑", type: "tree" }
];

// ANIMALES (15 tipos)
const ANIMALS = [
    { id: 1, name: "🐕 Perro", rarity: "Común", cost: 8, emoji: "🐕", type: "animal" },
    { id: 2, name: "🐈 Gato", rarity: "Común", cost: 8, emoji: "🐈", type: "animal" },
    { id: 3, name: "🐇 Conejo", rarity: "Común", cost: 10, emoji: "🐇", type: "animal" },
    { id: 4, name: "🐿️ Ardilla", rarity: "Común", cost: 12, emoji: "🐿️", type: "animal" },
    { id: 5, name: "🐼 Panda", rarity: "Raro", cost: 30, emoji: "🐼", type: "animal" },
    { id: 6, name: "🐨 Koala", rarity: "Raro", cost: 28, emoji: "🐨", type: "animal" },
    { id: 7, name: "🦊 Zorro", rarity: "Raro", cost: 20, emoji: "🦊", type: "animal" },
    { id: 8, name: "🐺 Lobo", rarity: "Raro", cost: 25, emoji: "🐺", type: "animal" },
    { id: 9, name: "🦌 Ciervo", rarity: "Raro", cost: 30, emoji: "🦌", type: "animal" },
    { id: 10, name: "🦁 León", rarity: "Épico", cost: 60, emoji: "🦁", type: "animal" },
    { id: 11, name: "🐧 Pingüino", rarity: "Épico", cost: 55, emoji: "🐧", type: "animal" },
    { id: 12, name: "🦚 Pavo Real", rarity: "Épico", cost: 50, emoji: "🦚", type: "animal" },
    { id: 13, name: "🦝 Mapache", rarity: "Épico", cost: 45, emoji: "🦝", type: "animal" },
    { id: 14, name: "🐉 Dragón", rarity: "Legendario", cost: 100, emoji: "🐉", type: "animal" },
    { id: 15, name: "🦄 Unicornio", rarity: "Legendario", cost: 150, emoji: "🦄", type: "animal" }
];

// CASAS (8 tipos)
const HOUSES = [
    { id: 1, name: "🏠 Cabaña", rarity: "Común", cost: 30, emoji: "🏠", type: "house" },
    { id: 2, name: "🏡 Casa", rarity: "Común", cost: 50, emoji: "🏡", type: "house" },
    { id: 3, name: "🏘️ Pueblo", rarity: "Raro", cost: 80, emoji: "🏘️", type: "house" },
    { id: 4, name: "🏰 Castillo", rarity: "Épico", cost: 150, emoji: "🏰", type: "house" },
    { id: 5, name: "🗿 Templo", rarity: "Épico", cost: 120, emoji: "🗿", type: "house" },
    { id: 6, name: "⛩️ Santuario", rarity: "Épico", cost: 140, emoji: "⛩️", type: "house" },
    { id: 7, name: "🏯 Pagoda", rarity: "Legendario", cost: 200, emoji: "🏯", type: "house" },
    { id: 8, name: "💒 Catedral", rarity: "Legendario", cost: 250, emoji: "💒", type: "house" }
];

let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedEntityIndex = 0;
let selectedType = "tree";
let plantedTrees = [];
let spawnedAnimals = [];
let placedHouses = [];
let userName = "";
let isPlantingMode = false;
let alarmInterval = null;
let cheatModeActive = false;
let cheatCodeEntered = "";
let totalBlockedSeconds = 0;
let coloringModeActive = false;
let animalMoveInterval = null;

let canvas = null;
let ctx = null;
let canvasWidth = 0;
let canvasHeight = 0;
let cols = 0;
let rows = 0;
let gridColors = [];
let brushColor = "#4caf50";

const CHEAT_CODE = "23";

// ============ INICIALIZACIÓN ============
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    initCanvas();
    setupGardenClick();
    setupDetection();
    setupCheatCodeDetection();
    setupGridControls();
    
    document.getElementById('start-btn').onclick = () => startApp();
    document.getElementById('clear-garden').onclick = clearGarden;
    document.getElementById('reset-all-colors').onclick = resetAllColors;
    document.getElementById('toggle-coloring-mode').onclick = toggleColoringMode;
    document.getElementById('tab-trees').onclick = () => switchTab('tree');
    document.getElementById('tab-animals').onclick = () => switchTab('animal');
    document.getElementById('tab-houses').onclick = () => switchTab('house');
    
    if (userName) {
        document.getElementById('user-name').value = userName;
        startApp();
    }
});

function switchTab(tab) {
    selectedType = tab;
    const treesTab = document.getElementById('tab-trees');
    const animalsTab = document.getElementById('tab-animals');
    const housesTab = document.getElementById('tab-houses');
    const treeList = document.getElementById('tree-list');
    const animalList = document.getElementById('animal-list');
    const houseList = document.getElementById('house-list');
    
    treesTab.classList.remove('active');
    animalsTab.classList.remove('active');
    housesTab.classList.remove('active');
    
    if (tab === 'tree') {
        treesTab.classList.add('active');
        treeList.style.display = 'grid';
        animalList.style.display = 'none';
        houseList.style.display = 'none';
        generateTreeMenu();
        selectEntity(0, 'tree');
    } else if (tab === 'animal') {
        animalsTab.classList.add('active');
        treeList.style.display = 'none';
        animalList.style.display = 'grid';
        houseList.style.display = 'none';
        generateAnimalMenu();
        selectEntity(0, 'animal');
    } else {
        housesTab.classList.add('active');
        treeList.style.display = 'none';
        animalList.style.display = 'none';
        houseList.style.display = 'grid';
        generateHouseMenu();
        selectEntity(0, 'house');
    }
}

function toggleColoringMode() {
    coloringModeActive = !coloringModeActive;
    const btn = document.getElementById('toggle-coloring-mode');
    if (btn) {
        if (coloringModeActive) {
            btn.innerHTML = '🎨 ON';
            btn.style.background = '#ff9800';
            showMessage("🎨 Modo coloreo ACTIVADO", "#ff9800", 1000);
        } else {
            btn.innerHTML = '🎨 OFF';
            btn.style.background = 'rgba(0,0,0,0.5)';
            showMessage("🎨 Modo coloreo DESACTIVADO", "#4caf50", 1000);
        }
    }
}

// ============ CANVAS ============
function initCanvas() {
    canvas = document.getElementById('garden-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', () => resizeCanvas());
    
    canvas.addEventListener('click', handleCanvasClick);
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touch = e.touches[0];
        const x = (touch.clientX - rect.left) * (canvas.width / rect.width);
        const y = (touch.clientY - rect.top) * (canvas.height / rect.height);
        handleCanvasClickAt(x, y);
    });
}

function resizeCanvas() {
    const area = document.getElementById('garden-area');
    if (!area) return;
    const containerWidth = area.clientWidth - 4;
    canvasWidth = Math.max(containerWidth, 350);
    canvasHeight = canvasWidth * 0.7;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    cols = Math.ceil(canvasWidth / CELL_SIZE);
    rows = Math.ceil(canvasHeight / CELL_SIZE);
    loadGridColors();
    drawGrid();
    renderEntities();
}

function drawGrid() {
    if (!ctx) return;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            ctx.fillStyle = (gridColors[row] && gridColors[row][col]) ? gridColors[row][col] : "#8b5a2b";
            ctx.fillRect(x, y, CELL_SIZE - 0.5, CELL_SIZE - 0.5);
        }
    }
}

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    handleCanvasClickAt(x, y);
}

function handleCanvasClickAt(x, y) {
    if (x < 0 || x >= canvas.width || y < 0 || y >= canvas.height) return;
    const col = Math.floor(x / CELL_SIZE);
    const row = Math.floor(y / CELL_SIZE);
    if (row >= 0 && row < rows && col >= 0 && col < cols) {
        if (coloringModeActive) {
            gridColors[row][col] = brushColor;
            drawGrid();
            saveGridColors();
        } else {
            if (isPlantingMode && !isBlocked) {
                placeEntity(x, y);
            } else if (!isPlantingMode && !isBlocked) {
                showMessage("🌱 Completa un enfoque para añadir", "#ff9800", 1500);
            } else if (isBlocked) {
                showMessage("🔒 Celular bloqueado", "#f44336", 1500);
            }
        }
    }
}

function saveGridColors() {
    localStorage.setItem('focusForestGrid', JSON.stringify({ gridColors, cols, rows }));
}

function loadGridColors() {
    const saved = localStorage.getItem('focusForestGrid');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.gridColors && data.rows === rows && data.cols === cols) {
            gridColors = data.gridColors;
            return;
        }
    }
    gridColors = [];
    for (let i = 0; i < rows; i++) {
        gridColors.push([]);
        for (let j = 0; j < cols; j++) gridColors[i][j] = "#8b5a2b";
    }
}

function resetAllColors() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) gridColors[i][j] = "#8b5a2b";
    }
    drawGrid();
    saveGridColors();
    showMessage("🟫 Suelo restablecido", "#ff9800", 1500);
}

function setupGridControls() {
    const brushPicker = document.getElementById('brush-color');
    if (brushPicker) {
        brushPicker.value = brushColor;
        brushPicker.onchange = (e) => { brushColor = e.target.value; };
    }
}

// ============ UTILIDADES ============
function showMessage(text, bgColor = "#4caf50", duration = 1500) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.cssText = `position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:${bgColor}; color:white; padding:8px 16px; border-radius:30px; z-index:9999; font-size:12px; animation:fadeOut ${duration/1000}s forwards; white-space:nowrap;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), duration);
}

function getEntityCost(entity) {
    if (cheatModeActive) return 5 / 60;
    return entity.cost;
}

function getEntityCostInSeconds(entity) {
    if (cheatModeActive) return 5;
    return entity.cost * 60;
}

function formatTime(minutes) {
    if (cheatModeActive) return `5s (prueba)`;
    if (minutes === 1) return '1 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}min`;
}

function formatSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) return `${hours}h ${mins}min`;
    if (mins > 0) return `${mins} min ${secs}s`;
    return `${secs} segundos`;
}

function saveData() {
    localStorage.setItem('focusForest', JSON.stringify({
        userName, plantedTrees, spawnedAnimals, placedHouses, cheatModeActive, totalBlockedSeconds
    }));
}

function loadSavedData() {
    const saved = localStorage.getItem('focusForest');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.userName) userName = data.userName;
        if (data.cheatModeActive) cheatModeActive = data.cheatModeActive;
        if (data.totalBlockedSeconds) totalBlockedSeconds = data.totalBlockedSeconds;
        plantedTrees = data.plantedTrees || [];
        spawnedAnimals = data.spawnedAnimals || [];
        placedHouses = data.placedHouses || [];
        updateStats();
        updateBlockedTimeStats();
    }
}

function updateBlockedTimeStats() {
    const span = document.getElementById('total-time');
    if (span) span.innerText = formatSeconds(totalBlockedSeconds);
}

function addBlockedTime(seconds) {
    totalBlockedSeconds += seconds;
    updateBlockedTimeStats();
    saveData();
}

// ============ MODO PRUEBA ============
function setupCheatCodeDetection() {
    const nameInput = document.getElementById('user-name');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            const lastChar = e.data || '';
            cheatCodeEntered += lastChar;
            if (cheatCodeEntered.length > CHEAT_CODE.length) {
                cheatCodeEntered = cheatCodeEntered.slice(-CHEAT_CODE.length);
            }
            if (cheatCodeEntered === CHEAT_CODE && !cheatModeActive) {
                cheatModeActive = true;
                showMessage("🎮 MODO PRUEBA ACTIVADO! 5 segundos", "#ff9800", 3000);
                nameInput.style.borderColor = "#ff9800";
                nameInput.style.boxShadow = "0 0 0 3px rgba(255,152,0,0.3)";
                saveData();
                if (document.getElementById('main-app').style.display === 'block') {
                    if (selectedType === 'tree') generateTreeMenu();
                    else if (selectedType === 'animal') generateAnimalMenu();
                    else generateHouseMenu();
                    updateSelectedDisplay();
                    updateStats();
                }
            }
        });
    }
}

// ============ ALARMA ============
function playAlarmTenTimes() {
    let count = 0;
    function beep() {
        try {
            const context = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = context.createOscillator();
            const gain = context.createGain();
            oscillator.connect(gain);
            gain.connect(context.destination);
            oscillator.frequency.value = 880;
            gain.gain.value = 0.4;
            oscillator.start();
            gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.8);
            oscillator.stop(context.currentTime + 0.8);
            setTimeout(() => context.close(), 1000);
        } catch(e) {}
    }
    if (alarmInterval) clearInterval(alarmInterval);
    beep();
    count = 1;
    alarmInterval = setInterval(() => {
        if (count < 10) { beep(); count++; }
        else { clearInterval(alarmInterval); alarmInterval = null; }
    }, 1000);
}

function showSuccessPopup() {
    const popup = document.createElement('div');
    popup.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:linear-gradient(135deg,#4CAF50,#2E7D32); color:white; padding:24px; border-radius:40px; text-align:center; z-index:20000; box-shadow:0 20px 40px rgba(0,0,0,0.3); animation:bounceIn 0.5s ease; min-width:260px; max-width:85%; border:2px solid #FFD700;`;
    popup.innerHTML = `<div style="font-size:50px;">🏆</div><h2 style="margin:8px 0;">¡LO LOGRASTE!</h2><p>Completaste el enfoque</p><p>Tienes <strong>30 minutos</strong> para añadir algo</p><button id="close-popup" style="margin-top:16px; padding:8px 20px; background:white; color:#2E7D32; border:none; border-radius:30px; font-weight:bold; cursor:pointer;">✨ Añadir ✨</button>`;
    document.body.appendChild(popup);
    document.getElementById('close-popup').onclick = () => popup.remove();
    setTimeout(() => popup.remove(), 8000);
}

// ============ DETECCIÓN ============
function setupDetection() {
    let visibilityStart = 0;
    let wasHidden = false;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            visibilityStart = Date.now();
            wasHidden = true;
        } else if (wasHidden && isBlocked && !isPlantingMode) {
            const hiddenTime = Date.now() - visibilityStart;
            if (hiddenTime > 3000) {
                resetCounter('Cambiaste de aplicación');
            }
            wasHidden = false;
        }
    });
}

function resetCounter(reason) {
    if (!isBlocked) return;
    if (focusInterval) clearInterval(focusInterval);
    if (alarmInterval) clearInterval(alarmInterval);
    isBlocked = false;
    isPlantingMode = false;
    currentFocusTime = 0;
    document.getElementById('blocker').classList.remove('active');
    showMessage(`⚠️ ${reason} - Reiniciado`, "#f44336", 2000);
}

// ============ INICIAR APP ============
function startApp() {
    userName = document.getElementById('user-name').value.trim();
    if (userName === "") { alert("Ingresa tu nombre"); return; }
    saveData();
    document.getElementById('garden-title').innerHTML = cheatModeActive ? `🌱 Jardín de ${userName} 🎮` : `🌱 Jardín de ${userName}`;
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    generateTreeMenu();
    generateAnimalMenu();
    generateHouseMenu();
    renderEntities();
    updateStats();
    updateBlockedTimeStats();
    selectEntity(0, 'tree');
    startAnimalMovement();
    setTimeout(() => resizeCanvas(), 100);
}

// ============ MENÚS ============
function generateTreeMenu() {
    const container = document.getElementById('tree-list');
    if (!container) return;
    container.innerHTML = '';
    TREES.forEach((tree, idx) => {
        const cost = getEntityCost(tree);
        const div = document.createElement('div');
        div.className = `item-card ${selectedType === 'tree' && selectedEntityIndex === idx ? 'selected' : ''}`;
        div.onclick = () => selectEntity(idx, 'tree');
        div.innerHTML = `
            <div class="item-emoji">${tree.emoji}</div>
            <div class="item-name">${tree.name.split(' ')[0]}</div>
            <div class="item-cost">${formatTime(cost)}</div>
        `;
        container.appendChild(div);
    });
}

function generateAnimalMenu() {
    const container = document.getElementById('animal-list');
    if (!container) return;
    container.innerHTML = '';
    ANIMALS.forEach((animal, idx) => {
        const cost = getEntityCost(animal);
        const div = document.createElement('div');
        div.className = `item-card ${selectedType === 'animal' && selectedEntityIndex === idx ? 'selected' : ''}`;
        div.onclick = () => selectEntity(idx, 'animal');
        div.innerHTML = `
            <div class="item-emoji">${animal.emoji}</div>
            <div class="item-name">${animal.name.split(' ')[0]}</div>
            <div class="item-cost">${formatTime(cost)}</div>
        `;
        container.appendChild(div);
    });
}

function generateHouseMenu() {
    const container = document.getElementById('house-list');
    if (!container) return;
    container.innerHTML = '';
    HOUSES.forEach((house, idx) => {
        const cost = getEntityCost(house);
        const div = document.createElement('div');
        div.className = `item-card ${selectedType === 'house' && selectedEntityIndex === idx ? 'selected' : ''}`;
        div.onclick = () => selectEntity(idx, 'house');
        div.innerHTML = `
            <div class="item-emoji">${house.emoji}</div>
            <div class="item-name">${house.name.split(' ')[0]}</div>
            <div class="item-cost">${formatTime(cost)}</div>
        `;
        container.appendChild(div);
    });
}

function selectEntity(index, type) {
    selectedEntityIndex = index;
    selectedType = type;
    if (type === 'tree') generateTreeMenu();
    else if (type === 'animal') generateAnimalMenu();
    else generateHouseMenu();
    updateSelectedDisplay();
}

function updateSelectedDisplay() {
    const selectedDisplay = document.getElementById('selected-display');
    if (!selectedDisplay) return;
    
    let entity;
    if (selectedType === 'tree') entity = TREES[selectedEntityIndex];
    else if (selectedType === 'animal') entity = ANIMALS[selectedEntityIndex];
    else entity = HOUSES[selectedEntityIndex];
    
    const cost = getEntityCost(entity);
    selectedDisplay.innerHTML = `
        <div class="selected-emoji">${entity.emoji}</div>
        <div class="selected-info">
            <span class="selected-name">${entity.name}</span>
            <span class="selected-cost">💰 ${formatTime(cost)}</span>
        </div>
    `;
    const startBtn = document.getElementById('start-entity-btn');
    if (startBtn) startBtn.onclick = () => startFocus();
}

// ============ ENFOQUE ============
function startFocus() {
    if (isBlocked) { showMessage("🔒 Ya estás en enfoque", "#f44336"); return; }
    if (focusInterval) clearInterval(focusInterval);
    
    let entity;
    if (selectedType === 'tree') entity = TREES[selectedEntityIndex];
    else if (selectedType === 'animal') entity = ANIMALS[selectedEntityIndex];
    else entity = HOUSES[selectedEntityIndex];
    
    let focusSeconds = cheatModeActive ? 5 : entity.cost * 60;
    currentFocusTime = focusSeconds;
    isBlocked = true;
    isPlantingMode = false;
    
    document.getElementById('blocker').classList.add('active');
    
    if (cheatModeActive) {
        document.getElementById('next-unlock').innerText = `5 segundos`;
        document.getElementById('blocker-message').innerHTML = `${userName}, MODO PRUEBA 🎮`;
    } else {
        document.getElementById('next-unlock').innerText = formatTime(entity.cost);
        document.getElementById('blocker-message').innerHTML = `${userName}, cultivando ${entity.name}`;
    }
    
    updateTimerDisplay();
    
    focusInterval = setInterval(() => {
        if (currentFocusTime <= 0) { 
            clearInterval(focusInterval); 
            unlockToAdd(); 
        } else { 
            currentFocusTime--; 
            updateTimerDisplay(); 
        }
    }, 1000);
}

function updateTimerDisplay() {
    const seconds = currentFocusTime;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        if (cheatModeActive || seconds < 60) {
            timerElement.innerText = `${seconds}s`;
        } else {
            const minutes = Math.floor(seconds / 60);
            const secs = seconds % 60;
            timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    let entity;
    if (selectedType === 'tree') entity = TREES[selectedEntityIndex];
    else if (selectedType === 'animal') entity = ANIMALS[selectedEntityIndex];
    else entity = HOUSES[selectedEntityIndex];
    
    let totalSeconds = cheatModeActive ? 5 : entity.cost * 60;
    const progress = ((totalSeconds - currentFocusTime) / totalSeconds) * 100;
    const fillElement = document.getElementById('progress-fill');
    if (fillElement) fillElement.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    const percentageElement = document.getElementById('progress-percentage');
    if (percentageElement) percentageElement.innerText = `${Math.round(progress)}%`;
}

function unlockToAdd() {
    if (!isBlocked) return;
    clearInterval(focusInterval);
    
    let entity;
    if (selectedType === 'tree') entity = TREES[selectedEntityIndex];
    else if (selectedType === 'animal') entity = ANIMALS[selectedEntityIndex];
    else entity = HOUSES[selectedEntityIndex];
    
    const totalSeconds = cheatModeActive ? 5 : entity.cost * 60;
    addBlockedTime(totalSeconds);
    
    isBlocked = false;
    isPlantingMode = true;
    playAlarmTenTimes();
    showSuccessPopup();
    
    document.getElementById('blocker').classList.remove('active');
    showMessage(`🎉 ¡Completado! Añade ${entity.name}`, "#4caf50", 3000);
    
    window.plantTimeout = setTimeout(() => {
        if (isPlantingMode && !isBlocked) {
            isPlantingMode = false;
            showMessage("⏰ Tiempo agotado", "#f44336", 2000);
        }
    }, UNLOCK_DURATION * 1000);
}

// ============ AÑADIR ENTIDADES ============
function placeEntity(x, y) {
    if (isBlocked) { showMessage("🔒 Celular bloqueado", "#f44336"); return; }
    if (!isPlantingMode) { showMessage("🌱 Completa un enfoque primero", "#ff9800"); return; }
    
    let entity;
    if (selectedType === 'tree') entity = TREES[selectedEntityIndex];
    else if (selectedType === 'animal') entity = ANIMALS[selectedEntityIndex];
    else entity = HOUSES[selectedEntityIndex];
    
    const newEntity = {
        id: Date.now(),
        entityId: entity.id,
        name: entity.name,
        emoji: entity.emoji,
        type: entity.type,
        cost: cheatModeActive ? 5/60 : entity.cost,
        x: x,
        y: y
    };
    
    if (entity.type === 'tree') plantedTrees.push(newEntity);
    else if (entity.type === 'animal') spawnedAnimals.push(newEntity);
    else placedHouses.push(newEntity);
    
    renderEntities();
    saveData();
    updateStats();
    
    if (window.plantTimeout) clearTimeout(window.plantTimeout);
    if (alarmInterval) clearInterval(alarmInterval);
    isPlantingMode = false;
    
    showMessage(`✅ ¡${entity.name} añadido!`, "#4caf50", 1500);
}

// ============ MOVIMIENTO ANIMALES ============
function startAnimalMovement() {
    if (animalMoveInterval) clearInterval(animalMoveInterval);
    animalMoveInterval = setInterval(() => {
        if (spawnedAnimals.length > 0 && canvasWidth > 0 && canvasHeight > 0) {
            spawnedAnimals.forEach(animal => {
                const newX = Math.max(20, Math.min(canvasWidth - 20, animal.x + (Math.random() - 0.5) * 50));
                const newY = Math.max(20, Math.min(canvasHeight - 20, animal.y + (Math.random() - 0.5) * 50));
                animal.x = newX;
                animal.y = newY;
            });
            renderEntities();
        }
    }, ANIMAL_MOVE_INTERVAL);
}

// ============ RENDERIZADO ============
function renderEntities() {
    const overlay = document.getElementById('entities-overlay');
    if (!overlay) return;
    overlay.innerHTML = '';
    
    const allEntities = [...plantedTrees, ...spawnedAnimals, ...placedHouses];
    allEntities.forEach((entity, idx) => {
        const entityDiv = document.createElement('div');
        entityDiv.className = 'entity';
        const posX = entity.x || (idx * 38 % (canvasWidth || 800) + 20);
        const posY = entity.y || (Math.floor(idx / 20) * 38 + 30);
        entityDiv.style.left = `${posX}px`;
        entityDiv.style.top = `${posY}px`;
        entityDiv.innerHTML = `${entity.emoji}<div class="entity-tooltip">${entity.name} | ${formatTime(entity.cost)}</div>`;
        entityDiv.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`¿Eliminar ${entity.name}?`)) {
                if (entity.type === 'tree') {
                    const index = plantedTrees.findIndex(t => t.id === entity.id);
                    if (index !== -1) plantedTrees.splice(index, 1);
                } else if (entity.type === 'animal') {
                    const index = spawnedAnimals.findIndex(a => a.id === entity.id);
                    if (index !== -1) spawnedAnimals.splice(index, 1);
                } else {
                    const index = placedHouses.findIndex(h => h.id === entity.id);
                    if (index !== -1) placedHouses.splice(index, 1);
                }
                renderEntities();
                saveData();
                updateStats();
                showMessage(`🗑️ ${entity.name} eliminado`, "#ff9800", 1000);
            }
        };
        overlay.appendChild(entityDiv);
    });
}

// ============ ESTADÍSTICAS ============
function updateStats() {
    const treeSpan = document.getElementById('tree-count');
    const animalSpan = document.getElementById('animal-count');
    const houseSpan = document.getElementById('house-count');
    const totalSpan = document.getElementById('total-time');
    
    if (treeSpan) treeSpan.innerText = plantedTrees.length;
    if (animalSpan) animalSpan.innerText = spawnedAnimals.length;
    if (houseSpan) houseSpan.innerText = placedHouses.length;
    
    const totalTime = [...plantedTrees, ...spawnedAnimals, ...placedHouses].reduce((sum, e) => sum + (e.cost || 0), 0);
    if (totalSpan) totalSpan.innerText = formatTime(totalTime);
}

function clearGarden() {
    if (confirm(`⚠️ ¿Eliminar TODO?`)) {
        plantedTrees = [];
        spawnedAnimals = [];
        placedHouses = [];
        renderEntities();
        saveData();
        updateStats();
        showMessage("🗑️ Jardín limpiado", "#ff9800", 1500);
    }
}

function setupGardenClick() {
    console.log("Ready!");
}