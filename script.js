// Configuración
const UNLOCK_DURATION = 1800;
const CELL_SIZE = 20;
const ANIMAL_MOVE_INTERVAL = 3000;

// Árboles
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
    { id: 11, name: "✨ Árbol Brillante", rarity: "Épico", cost: 100, emoji: "✨", type: "tree" },
    { id: 12, name: "🔥 Árbol Ígneo", rarity: "Épico", cost: 120, emoji: "🔥", type: "tree" },
    { id: 13, name: "💎 Árbol Cristal", rarity: "Épico", cost: 150, emoji: "💎", type: "tree" },
    { id: 14, name: "🌙 Árbol Lunar", rarity: "Legendario", cost: 200, emoji: "🌙", type: "tree" },
    { id: 15, name: "👑 Árbol Real", rarity: "Legendario", cost: 250, emoji: "👑", type: "tree" }
];

// Animales
const ANIMALS = [
    { id: 1, name: "🐕 Perro", rarity: "Común", cost: 8, emoji: "🐕", type: "animal" },
    { id: 2, name: "🐈 Gato", rarity: "Común", cost: 8, emoji: "🐈", type: "animal" },
    { id: 3, name: "🐇 Conejo", rarity: "Común", cost: 10, emoji: "🐇", type: "animal" },
    { id: 4, name: "🐿️ Ardilla", rarity: "Común", cost: 12, emoji: "🐿️", type: "animal" },
    { id: 5, name: "🦊 Zorro", rarity: "Raro", cost: 20, emoji: "🦊", type: "animal" },
    { id: 6, name: "🐺 Lobo", rarity: "Raro", cost: 25, emoji: "🐺", type: "animal" },
    { id: 7, name: "🦌 Ciervo", rarity: "Raro", cost: 30, emoji: "🦌", type: "animal" },
    { id: 8, name: "🦚 Pavo Real", rarity: "Épico", cost: 50, emoji: "🦚", type: "animal" },
    { id: 9, name: "🐉 Dragón", rarity: "Legendario", cost: 100, emoji: "🐉", type: "animal" },
    { id: 10, name: "🦄 Unicornio", rarity: "Legendario", cost: 150, emoji: "🦄", type: "animal" }
];

let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedEntityIndex = 0;
let selectedType = "tree";
let plantedTrees = [];
let spawnedAnimals = [];
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

const CHEAT_CODE = "409070110409070110409070110";

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
    
    if (userName) {
        document.getElementById('user-name').value = userName;
        startApp();
    }
});

function switchTab(tab) {
    selectedType = tab;
    const treesTab = document.getElementById('tab-trees');
    const animalsTab = document.getElementById('tab-animals');
    const treeList = document.getElementById('tree-list');
    const animalList = document.getElementById('animal-list');
    
    if (tab === 'tree') {
        treesTab.classList.add('active');
        animalsTab.classList.remove('active');
        treeList.style.display = 'flex';
        animalList.style.display = 'none';
        generateTreeMenu();
        selectEntity(0, 'tree');
        document.getElementById('selected-title').innerHTML = '🌲 Selección actual';
    } else {
        treesTab.classList.remove('active');
        animalsTab.classList.add('active');
        treeList.style.display = 'none';
        animalList.style.display = 'flex';
        generateAnimalMenu();
        selectEntity(0, 'animal');
        document.getElementById('selected-title').innerHTML = '🐾 Selección actual';
    }
}

function toggleColoringMode() {
    coloringModeActive = !coloringModeActive;
    const btn = document.getElementById('toggle-coloring-mode');
    if (btn) {
        if (coloringModeActive) {
            btn.textContent = '🎨 Modo Coloreo: ON';
            btn.style.background = '#ff9800';
            btn.style.color = 'white';
            showMessage("🎨 Modo coloreo ACTIVADO - Puedes pintar los cuadros", "#ff9800", 1500);
        } else {
            btn.textContent = '🎨 Modo Coloreo: OFF';
            btn.style.background = '#e5e7eb';
            btn.style.color = '#1f2937';
            showMessage("🎨 Modo coloreo DESACTIVADO - Puedes plantar/criar", "#4caf50", 1500);
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
    canvasWidth = Math.max(containerWidth, 400);
    canvasHeight = canvasWidth * 0.6;
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
                showMessage("🌱 Primero completa un tiempo de enfoque para añadir algo", "#ff9800", 1500);
            } else if (isBlocked) {
                showMessage("🔒 Celular bloqueado, espera a que termine el enfoque", "#f44336", 1500);
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
    showMessage("🟫 Todos los cuadros restablecidos a café", "#ff9800");
}

function setupGridControls() {
    const brushPicker = document.getElementById('brush-color');
    if (brushPicker) {
        brushPicker.value = brushColor;
        brushPicker.onchange = (e) => { brushColor = e.target.value; };
    }
}

// ============ UTILIDADES ============
function showMessage(text, bgColor = "#4caf50", duration = 2000) {
    const msg = document.createElement('div');
    msg.textContent = text;
    msg.style.cssText = `position:fixed; bottom:20px; left:50%; transform:translateX(-50%); background:${bgColor}; color:white; padding:10px 20px; border-radius:30px; z-index:9999; font-size:13px; animation:fadeOut ${duration/1000}s forwards; white-space:nowrap;`;
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
        userName, plantedTrees, spawnedAnimals, cheatModeActive, totalBlockedSeconds
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
        updateStats();
        updateBlockedTimeStats();
    }
}

function updateBlockedTimeStats() {
    const span = document.getElementById('total-blocked-time');
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
                showMessage("🎮 MODO PRUEBA ACTIVADO - Todo cuesta 5 segundos", "#ff9800", 3000);
                nameInput.style.borderColor = "#ff9800";
                nameInput.style.boxShadow = "0 0 0 3px rgba(255,152,0,0.3)";
                saveData();
                if (document.getElementById('main-app').style.display === 'block') {
                    if (selectedType === 'tree') generateTreeMenu();
                    else generateAnimalMenu();
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
            gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
            oscillator.stop(context.currentTime + 1);
            setTimeout(() => context.close(), 1500);
        } catch(e) {}
    }
    if (alarmInterval) clearInterval(alarmInterval);
    beep();
    count = 1;
    alarmInterval = setInterval(() => {
        if (count < 10) { beep(); count++; }
        else { clearInterval(alarmInterval); alarmInterval = null; }
    }, 1500);
}

function showSuccessPopup() {
    const popup = document.createElement('div');
    popup.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:linear-gradient(135deg,#2E7D32,#1B5E20); color:white; padding:30px 40px; border-radius:50px; text-align:center; z-index:20000; box-shadow:0 25px 50px -12px rgba(0,0,0,0.25); animation:bounceIn 0.5s ease; min-width:280px; max-width:90%; border:2px solid #FFD700;`;
    popup.innerHTML = `<div style="font-size:60px; margin-bottom:12px;">🏆</div><h1 style="font-size:32px; margin-bottom:12px;">¡LO LOGRASTE!</h1><p style="margin-bottom:12px;">Has completado el tiempo de enfoque</p><p>Tienes <strong style="color:#FFD700;">30 minutos</strong> para añadir algo 🌳🐾</p><button id="close-popup" style="margin-top:20px; padding:10px 25px; background:white; color:#2E7D32; border:none; border-radius:40px; font-size:14px; font-weight:bold; cursor:pointer;">✨ Añadir ✨</button>`;
    document.body.appendChild(popup);
    document.getElementById('close-popup').onclick = () => popup.remove();
    setTimeout(() => popup.remove(), 10000);
}

// ============ DETECCIÓN (NO PENALIZA BLOQUEO) ============
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
                resetCounter('Cambiaste de aplicación/pestaña');
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
    document.getElementById('mode-status').innerText = 'Libre';
    showMessage(`⚠️ ${reason} - Contador reiniciado`, "#f44336", 3000);
}

// ============ INICIAR APP ============
function startApp() {
    userName = document.getElementById('user-name').value.trim();
    if (userName === "") { alert("Ingresa tu nombre"); return; }
    saveData();
    document.getElementById('user-name-display').innerText = userName;
    document.getElementById('garden-title').innerHTML = cheatModeActive ? `🌱 Jardín de ${userName} 🎮` : `🌱 Jardín de ${userName}`;
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    generateTreeMenu();
    generateAnimalMenu();
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
            <div class="item-info">
                <div class="item-name">${tree.name} <span style="font-size:9px; color:${tree.rarity === 'Común' ? '#4caf50' : tree.rarity === 'Raro' ? '#2196f3' : tree.rarity === 'Épico' ? '#9c27b0' : '#ff9800'}">[${tree.rarity}]</span></div>
                <div class="item-cost">💰 ${formatTime(cost)}</div>
            </div>
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
            <div class="item-info">
                <div class="item-name">${animal.name} <span style="font-size:9px; color:${animal.rarity === 'Común' ? '#4caf50' : animal.rarity === 'Raro' ? '#2196f3' : animal.rarity === 'Épico' ? '#9c27b0' : '#ff9800'}">[${animal.rarity}]</span></div>
                <div class="item-cost">💰 ${formatTime(cost)}</div>
            </div>
        `;
        container.appendChild(div);
    });
}

function selectEntity(index, type) {
    selectedEntityIndex = index;
    selectedType = type;
    if (type === 'tree') {
        generateTreeMenu();
    } else {
        generateAnimalMenu();
    }
    updateSelectedDisplay();
}

function updateSelectedDisplay() {
    const selectedDisplay = document.getElementById('selected-display');
    if (!selectedDisplay) return;
    
    let entity = selectedType === 'tree' ? TREES[selectedEntityIndex] : ANIMALS[selectedEntityIndex];
    const cost = getEntityCost(entity);
    selectedDisplay.innerHTML = `
        <div class="item-emoji" style="font-size:40px;">${entity.emoji}</div>
        <p><strong>${entity.name}</strong></p>
        <p style="color:#ff6f00;">💰 ${formatTime(cost)}</p>
        <p style="font-size:10px; color:${entity.rarity === 'Común' ? '#4caf50' : entity.rarity === 'Raro' ? '#2196f3' : entity.rarity === 'Épico' ? '#9c27b0' : '#ff9800'}">✨ ${entity.rarity}</p>
        <button id="start-entity-btn" class="btn-primary" style="margin-top:12px; width:100%; padding:10px;">🌱 Comenzar</button>
    `;
    const startBtn = document.getElementById('start-entity-btn');
    if (startBtn) startBtn.onclick = () => startFocus();
}

// ============ ENFOQUE ============
function startFocus() {
    if (isBlocked) { alert(`🔒 ${userName}, ya estás en modo enfoque`); return; }
    if (focusInterval) clearInterval(focusInterval);
    
    let entity = selectedType === 'tree' ? TREES[selectedEntityIndex] : ANIMALS[selectedEntityIndex];
    let focusSeconds = cheatModeActive ? 5 : entity.cost * 60;
    currentFocusTime = focusSeconds;
    isBlocked = true;
    isPlantingMode = false;
    
    document.getElementById('blocker').classList.add('active');
    document.getElementById('mode-status').innerText = cheatModeActive ? '🔴 PRUEBA' : '🔴 ENFOQUE';
    
    if (cheatModeActive) {
        document.getElementById('next-unlock').innerText = `5 segundos`;
        document.getElementById('blocker-message').innerHTML = `${userName}, MODO PRUEBA - 5 segundos 🎮`;
    } else {
        document.getElementById('next-unlock').innerText = formatTime(entity.cost);
        document.getElementById('blocker-message').innerHTML = `${userName}, cultivando ${entity.name} ${entity.emoji}`;
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
    
    let entity = selectedType === 'tree' ? TREES[selectedEntityIndex] : ANIMALS[selectedEntityIndex];
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
    
    let entity = selectedType === 'tree' ? TREES[selectedEntityIndex] : ANIMALS[selectedEntityIndex];
    const totalSeconds = cheatModeActive ? 5 : entity.cost * 60;
    addBlockedTime(totalSeconds);
    
    isBlocked = false;
    isPlantingMode = true;
    playAlarmTenTimes();
    showSuccessPopup();
    
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = '🟢 AÑADIR';
    document.getElementById('next-unlock').innerText = `30 minutos`;
    
    showMessage(`🎉 ¡Tiempo completado! Tienes 30 minutos para añadir ${entity.name}`, "#4caf50", 4000);
    
    window.plantTimeout = setTimeout(() => {
        if (isPlantingMode && !isBlocked) {
            isPlantingMode = false;
            showMessage("⏰ Tiempo agotado (30 min), no se añadió nada", "#f44336", 3000);
        }
    }, UNLOCK_DURATION * 1000);
}

// ============ AÑADIR ENTIDADES ============
function placeEntity(x, y) {
    if (isBlocked) { 
        showMessage("🔒 Celular bloqueado, espera a que termine el enfoque", "#f44336");
        return; 
    }
    if (!isPlantingMode) { 
        showMessage("🌱 Primero completa un tiempo de enfoque para añadir algo", "#ff9800");
        return; 
    }
    
    let entity = selectedType === 'tree' ? TREES[selectedEntityIndex] : ANIMALS[selectedEntityIndex];
    
    const newEntity = {
        id: Date.now(),
        entityId: entity.id,
        name: entity.name,
        emoji: entity.emoji,
        rarity: entity.rarity,
        type: entity.type,
        cost: cheatModeActive ? 5/60 : entity.cost,
        x: x,
        y: y
    };
    
    if (entity.type === 'tree') {
        plantedTrees.push(newEntity);
    } else {
        spawnedAnimals.push(newEntity);
    }
    
    renderEntities();
    saveData();
    updateStats();
    
    if (window.plantTimeout) clearTimeout(window.plantTimeout);
    if (alarmInterval) clearInterval(alarmInterval);
    isPlantingMode = false;
    document.getElementById('mode-status').innerText = '✅ Completado';
    document.getElementById('next-unlock').innerText = 'Elige otro';
    
    showMessage(`✅ ¡${entity.name} ${entity.emoji} añadido, ${userName}!`, "#4caf50", 2500);
}

// ============ MOVIMIENTO ANIMALES ============
function startAnimalMovement() {
    if (animalMoveInterval) clearInterval(animalMoveInterval);
    animalMoveInterval = setInterval(() => {
        if (spawnedAnimals.length > 0 && canvasWidth > 0 && canvasHeight > 0) {
            spawnedAnimals.forEach(animal => {
                const newX = Math.max(20, Math.min(canvasWidth - 20, animal.x + (Math.random() - 0.5) * 60));
                const newY = Math.max(20, Math.min(canvasHeight - 20, animal.y + (Math.random() - 0.5) * 60));
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
    
    const allEntities = [...plantedTrees, ...spawnedAnimals];
    allEntities.forEach((entity, idx) => {
        const entityDiv = document.createElement('div');
        entityDiv.className = 'entity';
        const posX = entity.x || (idx * 45 % (canvasWidth || 800) + 30);
        const posY = entity.y || (Math.floor(idx / 18) * 45 + 40);
        entityDiv.style.left = `${posX}px`;
        entityDiv.style.top = `${posY}px`;
        entityDiv.innerHTML = `${entity.emoji}<div class="entity-tooltip">${entity.name} | ${formatTime(entity.cost)}</div>`;
        entityDiv.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`${userName}, ¿eliminar este ${entity.name}?`)) {
                if (entity.type === 'tree') {
                    const index = plantedTrees.findIndex(t => t.id === entity.id);
                    if (index !== -1) plantedTrees.splice(index, 1);
                } else {
                    const index = spawnedAnimals.findIndex(a => a.id === entity.id);
                    if (index !== -1) spawnedAnimals.splice(index, 1);
                }
                renderEntities();
                saveData();
                updateStats();
                showMessage(`🗑️ ${entity.name} eliminado`, "#ff9800", 1500);
            }
        };
        overlay.appendChild(entityDiv);
    });
}

// ============ ESTADÍSTICAS ============
function updateStats() {
    const treeCountSpan = document.getElementById('tree-count');
    if (treeCountSpan) treeCountSpan.innerText = plantedTrees.length;
    const animalCountSpan = document.getElementById('animal-count');
    if (animalCountSpan) animalCountSpan.innerText = spawnedAnimals.length;
    const totalTime = [...plantedTrees, ...spawnedAnimals].reduce((sum, e) => sum + (e.cost || 0), 0);
    const totalTimeSpan = document.getElementById('total-time');
    if (totalTimeSpan) totalTimeSpan.innerText = formatTime(totalTime);
}

function clearGarden() {
    if (confirm(`⚠️ ${userName}, ¿eliminar TODOS los árboles y animales?`)) {
        plantedTrees = [];
        spawnedAnimals = [];
        renderEntities();
        saveData();
        updateStats();
        showMessage("🗑️ Jardín limpiado", "#ff9800", 2000);
    }
}

function setupGardenClick() {
    console.log("Garden click setup completed");
}