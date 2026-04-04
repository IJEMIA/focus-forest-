// Configuración
const UNLOCK_DURATION = 1800;
const CELL_SIZE = 20; // Tamaño de cada cuadro en píxeles

// Árboles mejorados con emojis reales
const TREES = [
    { id: 1, name: "🌲 Pino", rarity: "Común", cost: 5, emoji: "🌲" },
    { id: 2, name: "🌳 Roble", rarity: "Común", cost: 10, emoji: "🌳" },
    { id: 3, name: "🎄 Abeto", rarity: "Común", cost: 15, emoji: "🎄" },
    { id: 4, name: "🌴 Palmera", rarity: "Común", cost: 20, emoji: "🌴" },
    { id: 5, name: "🍁 Arce", rarity: "Común", cost: 25, emoji: "🍁" },
    { id: 6, name: "🌸 Cerezo", rarity: "Raro", cost: 35, emoji: "🌸" },
    { id: 7, name: "🍊 Naranjo", rarity: "Raro", cost: 45, emoji: "🍊" },
    { id: 8, name: "🌿 Sauce", rarity: "Raro", cost: 55, emoji: "🌿" },
    { id: 9, name: "🍂 Olmo", rarity: "Raro", cost: 65, emoji: "🍂" },
    { id: 10, name: "🌺 Flor de Cerezo", rarity: "Raro", cost: 75, emoji: "🌺" },
    { id: 11, name: "✨ Árbol Brillante", rarity: "Épico", cost: 100, emoji: "✨" },
    { id: 12, name: "🔥 Árbol Ígneo", rarity: "Épico", cost: 120, emoji: "🔥" },
    { id: 13, name: "💎 Árbol Cristal", rarity: "Épico", cost: 150, emoji: "💎" },
    { id: 14, name: "🌙 Árbol Lunar", rarity: "Legendario", cost: 200, emoji: "🌙" },
    { id: 15, name: "👑 Árbol Real", rarity: "Legendario", cost: 250, emoji: "👑" }
];

let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedTreeIndex = 0;
let plantedTrees = [];
let userName = "";
let isPlantingMode = false;
let alarmInterval = null;
let cheatModeActive = false;
let cheatCodeEntered = "";
let totalBlockedSeconds = 0;
let isPausedForLock = false;
let pausedTime = 0;
let lastFocusLoss = 0;

// Variables de la cuadrícula
let canvas = null;
let ctx = null;
let canvasWidth = 0;
let canvasHeight = 0;
let cols = 0;
let rows = 0;
let gridColors = [];
let brushColor = "#4caf50";

const CHEAT_CODE = "409070110409070110409070110";

// Inicializar
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
    
    if (userName) {
        document.getElementById('user-name').value = userName;
        startApp();
    }
});

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
    const container = canvas.parentElement;
    const containerWidth = container.clientWidth - 32;
    canvasWidth = Math.max(containerWidth, 400);
    canvasHeight = canvasWidth * 0.6;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    canvas.style.width = `${canvasWidth}px`;
    canvas.style.height = `${canvasHeight}px`;
    
    cols = Math.ceil(canvasWidth / CELL_SIZE);
    rows = Math.ceil(canvasHeight / CELL_SIZE);
    
    if (gridColors.length === 0 || gridColors.length !== rows) {
        initGridColors();
    } else {
        // Ajustar si cambió el tamaño
        while (gridColors.length < rows) gridColors.push(Array(cols).fill("#8b5a2b"));
        while (gridColors.length > rows) gridColors.pop();
        for (let i = 0; i < rows; i++) {
            while (gridColors[i].length < cols) gridColors[i].push("#8b5a2b");
            while (gridColors[i].length > cols) gridColors[i].pop();
        }
    }
    
    drawGrid();
}

function initGridColors() {
    gridColors = [];
    for (let i = 0; i < rows; i++) {
        gridColors.push([]);
        for (let j = 0; j < cols; j++) {
            gridColors[i][j] = "#8b5a2b";
        }
    }
}

function drawGrid() {
    if (!ctx) return;
    
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            ctx.fillStyle = gridColors[row][col];
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
        gridColors[row][col] = brushColor;
        drawGrid();
        saveGridColors();
        
        // Feedback visual
        const feedback = document.createElement('div');
        feedback.textContent = '🎨';
        feedback.style.cssText = `position:fixed; top:${e.clientY - 20}px; left:${e.clientX - 10}px; font-size:20px; opacity:0.8; pointer-events:none; z-index:10000; animation:fadeOut 0.5s forwards;`;
        document.body.appendChild(feedback);
        setTimeout(() => feedback.remove(), 500);
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
        } else {
            initGridColors();
        }
    } else {
        initGridColors();
    }
    drawGrid();
}

function resetAllColors() {
    initGridColors();
    drawGrid();
    saveGridColors();
    
    const msg = document.createElement('div');
    msg.textContent = `🟫 Todos los cuadros restablecidos a café`;
    msg.style.cssText = `position:fixed; bottom:20px; left:20px; background:#ff9800; color:white; padding:8px 16px; border-radius:25px; z-index:9999; font-size:12px; animation:fadeOut 2s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2000);
}

function setupGridControls() {
    const brushPicker = document.getElementById('brush-color');
    if (brushPicker) {
        brushPicker.value = brushColor;
        brushPicker.onchange = (e) => {
            brushColor = e.target.value;
        };
    }
}

function getTreeCost(tree) {
    if (cheatModeActive) return 5 / 60;
    return tree.cost;
}

function getTreeCostInSeconds(tree) {
    if (cheatModeActive) return 5;
    return tree.cost * 60;
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
        userName: userName,
        plantedTrees: plantedTrees,
        cheatModeActive: cheatModeActive,
        totalBlockedSeconds: totalBlockedSeconds
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
        updateStats();
        updateBlockedTimeStats();
        renderTrees();
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

function checkCheatCode(input) {
    cheatCodeEntered += input;
    if (cheatCodeEntered.length > CHEAT_CODE.length) {
        cheatCodeEntered = cheatCodeEntered.slice(-CHEAT_CODE.length);
    }
    
    if (cheatCodeEntered === CHEAT_CODE && !cheatModeActive) {
        cheatModeActive = true;
        const notification = document.createElement('div');
        notification.innerHTML = `<div style="background:linear-gradient(135deg,#ff9800,#ff5722);color:white;padding:16px 24px;border-radius:30px;text-align:center;"><div style="font-size:24px;">🎮 MODO PRUEBA ACTIVADO 🎮</div><div style="font-size:14px;">Todos los árboles costarán 5 SEGUNDOS</div></div>`;
        notification.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); z-index:30000;`;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        
        const nameInput = document.getElementById('user-name');
        if (nameInput) {
            nameInput.style.borderColor = "#ff9800";
            nameInput.style.boxShadow = "0 0 0 3px rgba(255,152,0,0.3)";
        }
        saveData();
    }
}

function setupCheatCodeDetection() {
    const nameInput = document.getElementById('user-name');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            const lastChar = e.data || '';
            if (lastChar) checkCheatCode(lastChar);
        });
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
    popup.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:linear-gradient(135deg,#4caf50,#2e7d32); color:white; padding:30px 40px; border-radius:50px; text-align:center; z-index:20000; box-shadow:0 20px 40px rgba(0,0,0,0.4); animation:bounceIn 0.5s ease; min-width:280px; max-width:90%; border:2px solid gold;`;
    popup.innerHTML = `<div style="font-size:60px; margin-bottom:12px;">🏆</div><h1 style="font-size:32px; margin-bottom:12px;">¡LO LOGRASTE!</h1><p style="font-size:16px; margin-bottom:12px;">Has completado el tiempo de enfoque</p><p style="font-size:14px;">Tienes <strong style="color:#ffd700;">30 minutos</strong> para plantar tu árbol 🌳</p><button id="close-popup" style="margin-top:20px; padding:10px 25px; background:white; color:#4caf50; border:none; border-radius:40px; font-size:14px; font-weight:bold; cursor:pointer;">✨ Plantar árbol ✨</button>`;
    document.body.appendChild(popup);
    document.getElementById('close-popup').onclick = () => popup.remove();
    setTimeout(() => { if (popup.parentNode) popup.remove(); }, 10000);
}

function resetCounter(reason) {
    if (!isBlocked) return;
    if (focusInterval) clearInterval(focusInterval);
    if (alarmInterval) clearInterval(alarmInterval);
    
    const tree = TREES[selectedTreeIndex];
    const totalSeconds = cheatModeActive ? 5 : tree.cost * 60;
    const completedSeconds = totalSeconds - currentFocusTime;
    if (completedSeconds > 0) addBlockedTime(completedSeconds);
    
    isBlocked = false;
    isPlantingMode = false;
    currentFocusTime = 0;
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = 'Libre';
    
    const msg = document.createElement('div');
    msg.textContent = `⚠️ ${reason} - Contador reiniciado`;
    msg.style.cssText = `position:fixed; bottom:20px; left:20px; background:#f44336; color:white; padding:8px 16px; border-radius:25px; z-index:9999; font-size:12px; animation:fadeOut 3s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

// Detección