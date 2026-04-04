// Configuración
const TREES_COUNT = 15;
const UNLOCK_DURATION = 1800; // 30 MINUTOS para plantar
const GRID_SIZE = 4; // 4x4 píxeles por cuadro (10 veces más detallado que 40x40)
const DEFAULT_COLOR = "#8b5a2b"; // Café
const ALT_COLOR = "#2196f3"; // Azul

let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedTreeIndex = 1;
let plantedTrees = [];
let userName = "";
let isPlantingMode = false;
let wasScreenLocked = false;
let alarmInterval = null;
let cheatModeActive = false;
let cheatCodeEntered = "";
const CHEAT_CODE = "409070110409070110409070110";

// Variables para la cuadrícula
let canvas = null;
let ctx = null;
let gridColors = []; // Matriz de colores para cada celda
let canvasWidth = 0;
let canvasHeight = 0;
let cols = 0;
let rows = 0;

// Inicializar canvas
function initGridCanvas() {
    const gardenDiv = document.getElementById('garden');
    if (!gardenDiv) return;
    
    // Crear canvas si no existe
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.className = 'garden-canvas';
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
        gardenDiv.innerHTML = '';
        gardenDiv.appendChild(canvas);
        
        // Crear overlay para árboles
        const treesOverlay = document.createElement('div');
        treesOverlay.id = 'trees-overlay';
        treesOverlay.style.position = 'relative';
        treesOverlay.style.width = '100%';
        gardenDiv.appendChild(treesOverlay);
        
        canvas.addEventListener('click', handleCanvasClick);
    }
    
    resizeAndDrawGrid();
    window.addEventListener('resize', () => resizeAndDrawGrid());
}

function resizeAndDrawGrid() {
    if (!canvas) return;
    
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 32;
    canvasWidth = Math.max(containerWidth, 400);
    canvasHeight = canvasWidth * 0.6; // Proporción 5:3
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    
    ctx = canvas.getContext('2d');
    
    cols = Math.floor(canvasWidth / GRID_SIZE);
    rows = Math.floor(canvasHeight / GRID_SIZE);
    
    // Inicializar matriz de colores si está vacía
    if (gridColors.length === 0) {
        loadGridColors();
        if (gridColors.length === 0) {
            gridColors = Array(rows).fill().map(() => Array(cols).fill(DEFAULT_COLOR));
        }
    }
    
    drawGrid();
}

function drawGrid() {
    if (!ctx) return;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * GRID_SIZE;
            const y = row * GRID_SIZE;
            ctx.fillStyle = gridColors[row]?.[col] || DEFAULT_COLOR;
            ctx.fillRect(x, y, GRID_SIZE, GRID_SIZE);
            
            // Dibujar líneas de la cuadrícula (más sutiles)
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.strokeRect(x, y, GRID_SIZE, GRID_SIZE);
        }
    }
}

function handleCanvasClick(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    
    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
        e.preventDefault();
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    const canvasX = (clientX - rect.left) * scaleX;
    const canvasY = (clientY - rect.top) * scaleY;
    
    if (canvasX >= 0 && canvasX < canvas.width && canvasY >= 0 && canvasY < canvas.height) {
        const col = Math.floor(canvasX / GRID_SIZE);
        const row = Math.floor(canvasY / GRID_SIZE);
        
        if (row >= 0 && row < rows && col >= 0 && col < cols) {
            // Cambiar color del cuadro
            const currentColor = gridColors[row][col];
            gridColors[row][col] = currentColor === DEFAULT_COLOR ? ALT_COLOR : DEFAULT_COLOR;
            saveGridColors();
            drawGrid();
            
            // Mostrar feedback
            const feedback = document.createElement('div');
            feedback.textContent = currentColor === DEFAULT_COLOR ? '🔵' : '🟫';
            feedback.style.cssText = `
                position: fixed;
                top: ${clientY - 20}px;
                left: ${clientX - 10}px;
                font-size: 20px;
                opacity: 0.8;
                pointer-events: none;
                z-index: 10000;
                animation: fadeOut 0.5s forwards;
            `;
            document.body.appendChild(feedback);
            setTimeout(() => feedback.remove(), 500);
        }
    }
}

function saveGridColors() {
    localStorage.setItem('focusForestGrid', JSON.stringify({
        gridColors: gridColors,
        cols: cols,
        rows: rows
    }));
}

function loadGridColors() {
    const saved = localStorage.getItem('focusForestGrid');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.gridColors && data.rows === rows && data.cols === cols) {
            gridColors = data.gridColors;
        } else if (data.gridColors) {
            // Reescalar si cambió el tamaño
            gridColors = Array(rows).fill().map(() => Array(cols).fill(DEFAULT_COLOR));
        }
    }
}

// Función para resetear la cuadrícula a café
function resetGridToDefault() {
    gridColors = Array(rows).fill().map(() => Array(cols).fill(DEFAULT_COLOR));
    saveGridColors();
    drawGrid();
    
    const msg = document.createElement('div');
    msg.textContent = `🟫 Cuadrícula restablecida a color café`;
    msg.style.cssText = `position:fixed; bottom:20px; left:20px; background:#4caf50; color:white; padding:10px 16px; border-radius:25px; z-index:9999; font-size:12px; animation: fadeOut 2s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// Función para cambiar toda la cuadrícula a azul
function setGridToBlue() {
    gridColors = Array(rows).fill().map(() => Array(cols).fill(ALT_COLOR));
    saveGridColors();
    drawGrid();
    
    const msg = document.createElement('div');
    msg.textContent = `🔵 Cuadrícula cambiada a azul`;
    msg.style.cssText = `position:fixed; bottom:20px; left:20px; background:#2196f3; color:white; padding:10px 16px; border-radius:25px; z-index:9999; font-size:12px; animation: fadeOut 2s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

// Verificar cheat code
function checkCheatCode(input) {
    cheatCodeEntered += input;
    if (cheatCodeEntered.length > CHEAT_CODE.length) {
        cheatCodeEntered = cheatCodeEntered.slice(-CHEAT_CODE.length);
    }
    
    if (cheatCodeEntered === CHEAT_CODE && !cheatModeActive) {
        cheatModeActive = true;
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="background: linear-gradient(135deg, #ff9800, #ff5722); color: white; padding: 16px 24px; border-radius: 30px; text-align: center; animation: bounceIn 0.5s ease;">
                <div style="font-size: 24px;">🎮 MODO PRUEBA ACTIVADO 🎮</div>
                <div style="font-size: 14px; margin-top: 8px;">Todos los árboles costarán 5 SEGUNDOS</div>
            </div>
        `;
        notification.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 30000; animation: bounceIn 0.5s ease;`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        
        const nameInput = document.getElementById('user-name');
        if (nameInput) {
            nameInput.style.borderColor = "#ff9800";
            nameInput.style.boxShadow = "0 0 0 3px rgba(255,152,0,0.3)";
        }
        return true;
    }
    return false;
}

function getTreeCost(treeNumber) {
    if (cheatModeActive) return 5 / 60;
    if (treeNumber === 'test') return 1;
    return treeNumber * 15;
}

function getTreeCostInSeconds(treeNumber) {
    if (cheatModeActive) return 5;
    if (treeNumber === 'test') return 60;
    return treeNumber * 15 * 60;
}

function formatTime(minutes) {
    if (cheatModeActive) return `5 segundos (modo prueba)`;
    if (minutes === 1) return '1 min';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}min`;
}

function saveData() {
    localStorage.setItem('focusForest', JSON.stringify({
        userName: userName,
        plantedTrees: plantedTrees.filter(t => !t.isTest),
        cheatModeActive: cheatModeActive
    }));
}

function loadSavedData() {
    const saved = localStorage.getItem('focusForest');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.userName) userName = data.userName;
        if (data.cheatModeActive) cheatModeActive = data.cheatModeActive;
        plantedTrees = data.plantedTrees || [];
        renderGarden();
        updateStats();
    }
}

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
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        color: white;
        padding: 30px 40px;
        border-radius: 50px;
        text-align: center;
        z-index: 20000;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        animation: bounceIn 0.5s ease;
        min-width: 280px;
        max-width: 90%;
        border: 2px solid gold;
    `;
    popup.innerHTML = `
        <div style="font-size: 60px; margin-bottom: 12px;">🏆</div>
        <h1 style="font-size: 32px; margin-bottom: 12px;">¡LO LOGRASTE!</h1>
        <p style="font-size: 16px; margin-bottom: 12px;">Has completado el tiempo de enfoque</p>
        <p style="font-size: 14px; opacity: 0.9;">Tienes <strong style="color: #ffd700;">30 minutos</strong> para plantar tu árbol 🌳</p>
        <button id="close-popup" style="margin-top: 20px; padding: 10px 25px; background: white; color: #4caf50; border: none; border-radius: 40px; font-size: 14px; font-weight: bold; cursor: pointer;">✨ Plantar árbol ✨</button>
    `;
    document.body.appendChild(popup);
    document.getElementById('close-popup').onclick = () => popup.remove();
    setTimeout(() => { if (popup.parentNode) popup.remove(); }, 10000);
}

function plantTestTree(x, y) {
    const testTree = {
        id: Date.now(),
        number: 'test',
        cost: cheatModeActive ? 5/60 : 1,
        x: x,
        y: y,
        isTest: true,
        expiresAt: Date.now() + (30 * 60 * 1000)
    };
    plantedTrees.push(testTree);
    renderGarden();
    saveData();
    updateStats();
    setTimeout(() => {
        const index = plantedTrees.findIndex(t => t.id === testTree.id);
        if (index !== -1) {
            plantedTrees.splice(index, 1);
            renderGarden();
            saveData();
            updateStats();
        }
    }, 30 * 60 * 1000);
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
    const msg = document.createElement('div');
    msg.textContent = `⚠️ ${reason} - Contador reiniciado`;
    msg.style.cssText = `position:fixed; bottom:20px; left:20px; background:#f44336; color:white; padding:12px 18px; border-radius:30px; z-index:9999; font-size:13px; animation: fadeOut 3s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

function setupDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isBlocked && !isPlantingMode) wasScreenLocked = true;
        else if (!document.hidden && wasScreenLocked && isBlocked && !isPlantingMode) wasScreenLocked = false;
    });
    let lostFocusTime = 0;
    window.addEventListener('blur', () => { if (isBlocked && !isPlantingMode) lostFocusTime = Date.now(); });
    window.addEventListener('focus', () => {
        if (isBlocked && !isPlantingMode && lostFocusTime > 0) {
            const timeAway = Date.now() - lostFocusTime;
            if (timeAway > 2000) resetCounter('Cambiaste de aplicación');
            lostFocusTime = 0;
        }
    });
}

function startApp() {
    userName = document.getElementById('user-name').value.trim();
    if (userName === "") { alert("Ingresa tu nombre"); return; }
    saveData();
    document.getElementById('user-name-display').innerText = userName;
    if (cheatModeActive) {
        document.getElementById('garden-title').innerHTML = `🌱 Jardín de ${userName} 🎮`;
        document.getElementById('mode-status').innerHTML = '🔴 MODO PRUEBA';
    } else {
        document.getElementById('garden-title').innerHTML = `🌱 Jardín de ${userName}`;
    }
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    generateTreeMenu();
    initGridCanvas();
    renderGarden();
    updateStats();
    selectTree(1);
}

function generateTreeMenu() {
    const treeList = document.getElementById('tree-list');
    if (!treeList) return;
    treeList.innerHTML = '';
    const testDiv = document.createElement('div');
    testDiv.className = `tree-item ${selectedTreeIndex === 'test' ? 'selected' : ''}`;
    testDiv.onclick = () => selectTree('test');
    testDiv.innerHTML = `<div style="width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-size:28px;">🌲</div><div class="tree-info"><div class="tree-name">🌲 Árbol de Prueba</div><div class="tree-cost">💰 ${cheatModeActive ? '5 segundos (prueba)' : '1 min'}</div></div>`;
    treeList.appendChild(testDiv);
    for (let i = 1; i <= TREES_COUNT; i++) {
        const cost = getTreeCost(i);
        const div = document.createElement('div');
        div.className = `tree-item ${selectedTreeIndex === i ? 'selected' : ''}`;
        div.onclick = () => selectTree(i);
        div.innerHTML = `<img src="trees/${i}.png" onerror="this.style.display='none'"><div class="tree-info"><div class="tree-name">Árbol #${i}</div><div class="tree-cost">💰 ${formatTime(cost)}</div></div>`;
        treeList.appendChild(div);
    }
}

function selectTree(treeNumber) {
    selectedTreeIndex = treeNumber;
    generateTreeMenu();
    const selectedDisplay = document.getElementById('selected-display');
    if (!selectedDisplay) return;
    if (treeNumber === 'test') {
        selectedDisplay.innerHTML = `<div style="font-size:44px; margin:8px auto;">🌲</div><p><strong>Árbol de Prueba</strong></p><p style="color:#ff6f00;">💰 ${cheatModeActive ? '5 segundos (modo prueba)' : '1 minuto'}</p><button id="start-tree-btn" class="btn-primary" style="margin-top:16px; width:100%; padding:12px;">🌱 Comenzar</button>`;
    } else {
        const cost = getTreeCost(treeNumber);
        selectedDisplay.innerHTML = `<img src="trees/${treeNumber}.png" style="width:55px; margin:8px auto;" onerror="this.style.display='none'"><p><strong>Árbol #${treeNumber}</strong></p><p style="color:#ff6f00;">💰 ${formatTime(cost)}</p><button id="start-tree-btn" class="btn-primary" style="margin-top:16px; width:100%; padding:12px;">🌱 Comenzar</button>`;
    }
    const startBtn = document.getElementById('start-tree-btn');
    if (startBtn) startBtn.onclick = () => startFocus();
}

function startFocus() {
    if (isBlocked) { alert(`🔒 ${userName}, ya estás en modo enfoque`); return; }
    if (focusInterval) clearInterval(focusInterval);
    let focusSeconds = selectedTreeIndex === 'test' ? (cheatModeActive ? 5 : 60) : getTreeCostInSeconds(selectedTreeIndex);
    currentFocusTime = focusSeconds;
    isBlocked = true;
    isPlantingMode = false;
    document.getElementById('blocker').classList.add('active');
    document.getElementById('mode-status').innerText = cheatModeActive ? '🔴 PRUEBA' : '🔴 ENFOQUE';
    if (cheatModeActive) {
        document.getElementById('next-unlock').innerText = `5 segundos`;
        document.getElementById('blocker-message').innerHTML = `${userName}, MODO PRUEBA - ${focusSeconds} segundos 🎮`;
    } else {
        const focusMinutes = focusSeconds / 60;
        document.getElementById('next-unlock').innerText = formatTime(focusMinutes);
        document.getElementById('blocker-message').innerHTML = selectedTreeIndex === 'test' ? `${userName}, cultivando Árbol de Prueba 🌲` : `${userName}, cultivando Árbol #${selectedTreeIndex}`;
    }
    updateTimerDisplay();
    focusInterval = setInterval(() => {
        if (currentFocusTime <= 0) { clearInterval(focusInterval); unlockToPlant(); }
        else { currentFocusTime--; updateTimerDisplay(); }
    }, 1000);
}

function updateTimerDisplay() {
    const seconds = currentFocusTime;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        if (cheatModeActive || seconds < 60) timerElement.innerText = `${seconds.toString().padStart(2, '0')}s`;
        else
