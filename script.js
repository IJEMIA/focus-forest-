// Configuración
const TREES_COUNT = 15;
const UNLOCK_DURATION = 1800;

// Árboles con diferentes rarezas y costos
const TREES = [
    { id: 1, name: "🍃 Hierba", rarity: "Común", cost: 5, emoji: "🍃" },
    { id: 2, name: "🌿 Arbusto", rarity: "Común", cost: 10, emoji: "🌿" },
    { id: 3, name: "🌱 Retoño", rarity: "Común", cost: 15, emoji: "🌱" },
    { id: 4, name: "🍂 Abedul", rarity: "Común", cost: 20, emoji: "🍂" },
    { id: 5, name: "🌳 Roble", rarity: "Común", cost: 25, emoji: "🌳" },
    { id: 6, name: "🌸 Cerezo", rarity: "Raro", cost: 35, emoji: "🌸" },
    { id: 7, name: "🍊 Naranjo", rarity: "Raro", cost: 45, emoji: "🍊" },
    { id: 8, name: "🌴 Palmera", rarity: "Raro", cost: 55, emoji: "🌴" },
    { id: 9, name: "🎋 Bambú", rarity: "Raro", cost: 65, emoji: "🎋" },
    { id: 10, name: "🍁 Arce", rarity: "Raro", cost: 75, emoji: "🍁" },
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
let startTimeReference = null;
let pausedRemaining = 0;
let gridColor = "#8b5a2b";

const CHEAT_CODE = "409070110409070110409070110";

// Inicializar
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    setupGardenClick();
    setupDetection();
    setupCheatCodeDetection();
    setupGridColorControls();
    
    document.getElementById('start-btn').onclick = () => startApp();
    document.getElementById('clear-garden').onclick = clearGarden;
    
    if (userName) {
        document.getElementById('user-name').value = userName;
        startApp();
    }
});

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
        totalBlockedSeconds: totalBlockedSeconds,
        gridColor: gridColor
    }));
}

function loadSavedData() {
    const saved = localStorage.getItem('focusForest');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.userName) userName = data.userName;
        if (data.cheatModeActive) cheatModeActive = data.cheatModeActive;
        if (data.totalBlockedSeconds) totalBlockedSeconds = data.totalBlockedSeconds;
        if (data.gridColor) gridColor = data.gridColor;
        plantedTrees = data.plantedTrees || [];
        renderGarden();
        updateStats();
        updateBlockedTimeStats();
        applyGridColor();
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

function setupGridColorControls() {
    const picker = document.getElementById('grid-color-picker');
    const applyBtn = document.getElementById('apply-grid-color');
    const resetBtn = document.getElementById('reset-grid-color');
    
    if (picker) picker.value = gridColor;
    
    if (applyBtn) {
        applyBtn.onclick = () => {
            gridColor = picker.value;
            applyGridColor();
            saveData();
            const msg = document.createElement('div');
            msg.textContent = `🎨 Color de cuadrícula cambiado`;
            msg.style.cssText = `position:fixed; bottom:20px; left:20px; background:#4caf50; color:white; padding:8px 16px; border-radius:25px; z-index:9999; font-size:12px; animation: fadeOut 2s forwards;`;
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 2000);
        };
    }
    
    if (resetBtn) {
        resetBtn.onclick = () => {
            gridColor = "#8b5a2b";
            picker.value = gridColor;
            applyGridColor();
            saveData();
            const msg = document.createElement('div');
            msg.textContent = `🟫 Cuadrícula restablecida a café`;
            msg.style.cssText = `position:fixed; bottom:20px; left:20px; background:#ff9800; color:white; padding:8px 16px; border-radius:25px; z-index:9999; font-size:12px; animation: fadeOut 2s forwards;`;
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 2000);
        };
    }
}

function applyGridColor() {
    const garden = document.getElementById('garden');
    if (garden) {
        garden.style.backgroundColor = gridColor;
    }
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
    msg.style.cssText = `position:fixed; bottom:20px; left:20px; background:#f44336; color:white; padding:8px 16px; border-radius:25px; z-index:9999; font-size:12px; animation: fadeOut 3s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

// DETECCIÓN - NO penaliza bloqueo/desbloqueo físico
function setupDetection() {
    let lastFocusLoss = 0;
    let isPausedForLock = false;
    let pausedTime = 0;
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isBlocked && !isPlantingMode) {
            // Se perdió visibilidad (bloqueo o cambio de pestaña)
            lastFocusLoss = Date.now();
            isPausedForLock = true;
            if (focusInterval) {
                clearInterval(focusInterval);
                focusInterval = null;
                pausedTime = currentFocusTime;
            }
        } else if (!document.hidden && isPausedForLock && isBlocked && !isPlantingMode) {
            // Se recuperó visibilidad
            const timeHidden = Date.now() - lastFocusLoss;
            
            if (timeHidden > 5000) {
                // Más de 5 segundos = cambio real de app/pestaña
                resetCounter('Cambiaste de aplicación/pestaña');
            } else {
                // Menos de 5 segundos = bloqueo rápido - continuar sin penalizar
                if (pausedTime > 0) {
                    currentFocusTime = pausedTime;
                    focusInterval = setInterval(() => {
                        if (currentFocusTime <= 0) {
                            clearInterval(focusInterval);
                            unlockToPlant();
                        } else {
                            currentFocusTime--;
                            updateTimerDisplay();
                        }
                    }, 1000);
                }
            }
            isPausedForLock = false;
            pausedTime = 0;
        }
    });
}

function startApp() {
    userName = document.getElementById('user-name').value.trim();
    if (userName === "") { alert("Ingresa tu nombre"); return; }
    
    saveData();
    document.getElementById('user-name-display').innerText = userName;
    document.getElementById('garden-title').innerHTML = cheatModeActive ? `🌱 Jardín de ${userName} 🎮` : `🌱 Jardín de ${userName}`;
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    generateTreeMenu();
    renderGarden();
    updateStats();
    updateBlockedTimeStats();
    applyGridColor();
    selectTree(0);
}

function generateTreeMenu() {
    const treeList = document.getElementById('tree-list');
    if (!treeList) return;
    treeList.innerHTML = '';
    
    TREES.forEach((tree, idx) => {
        const cost = getTreeCost(tree);
        const div = document.createElement('div');
        div.className = `tree-item ${selectedTreeIndex === idx ? 'selected' : ''}`;
        div.onclick = () => selectTree(idx);
        div.innerHTML = `
            <div style="font-size:20px;">${tree.emoji}</div>
            <div class="tree-info">
                <div class="tree-name">${tree.name} <span style="font-size:9px; color:${tree.rarity === 'Común' ? '#4caf50' : tree.rarity === 'Raro' ? '#2196f3' : tree.rarity === 'Épico' ? '#9c27b0' : '#ff9800'}">[${tree.rarity}]</span></div>
                <div class="tree-cost">💰 ${formatTime(cost)}</div>
            </div>
        `;
        treeList.appendChild(div);
    });
}

function selectTree(index) {
    selectedTreeIndex = index;
    generateTreeMenu();
    const selectedDisplay = document.getElementById('selected-display');
    if (!selectedDisplay) return;
    
    const tree = TREES[index];
    const cost = getTreeCost(tree);
    selectedDisplay.innerHTML = `
        <div style="font-size:32px; margin:6px auto;">${tree.emoji}</div>
        <p><strong>${tree.name}</strong></p>
        <p style="color:#ff6f00; font-size:12px;">💰 ${formatTime(cost)}</p>
        <p style="font-size:10px; color:${tree.rarity === 'Común' ? '#4caf50' : tree.rarity === 'Raro' ? '#2196f3' : tree.rarity === 'Épico' ? '#9c27b0' : '#ff9800'}">✨ ${tree.rarity}</p>
        <button id="start-tree-btn" class="btn-primary" style="margin-top:12px; width:100%; padding:10px;">🌱 Comenzar</button>
    `;
    
    const startBtn = document.getElementById('start-tree-btn');
    if (startBtn) startBtn.onclick = () => startFocus();
}

function startFocus() {
    if (isBlocked) { alert(`🔒 ${userName}, ya estás en modo enfoque`); return; }
    if (focusInterval) clearInterval(focusInterval);
    
    const tree = TREES[selectedTreeIndex];
    let focusSeconds = cheatModeActive ? 5 : tree.cost * 60;
    currentFocusTime = focusSeconds;
    isBlocked = true;
    isPlantingMode = false;
    
    document.getElementById('blocker').classList.add('active');
    document.getElementById('mode-status').innerText = cheatModeActive ? '🔴 PRUEBA' : '🔴 ENFOQUE';
    
    if (cheatModeActive) {
        document.getElementById('next-unlock').innerText = `5 segundos`;
        document.getElementById('blocker-message').innerHTML = `${userName}, MODO PRUEBA - 5 segundos 🎮`;
    } else {
        document.getElementById('next-unlock').innerText = formatTime(tree.cost);
        document.getElementById('blocker-message').innerHTML = `${userName}, cultivando ${tree.name} ${tree.emoji}`;
    }
    
    updateTimerDisplay();
    
    focusInterval = setInterval(() => {
        if (currentFocusTime <= 0) { 
            clearInterval(focusInterval); 
            unlockToPlant(); 
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
    
    const tree = TREES[selectedTreeIndex];
    let totalSeconds = cheatModeActive ? 5 : tree.cost * 60;
    const progress = ((totalSeconds - currentFocusTime) / totalSeconds) * 100;
    const fillElement = document.getElementById('progress-fill');
    if (fillElement) fillElement.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    const percentageElement = document.getElementById('progress-percentage');
    if (percentageElement) percentageElement.innerText = `${Math.round(progress)}%`;
}

function unlockToPlant() {
    if (!isBlocked) return;
    clearInterval(focusInterval);
    
    const tree = TREES[selectedTreeIndex];
    const totalSeconds = cheatModeActive ? 5 : tree.cost * 60;
    addBlockedTime(totalSeconds);
    
    isBlocked = false;
    isPlantingMode = true;
    playAlarmTenTimes();
    showSuccessPopup();
    
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = '🟢 PLANTAR';
    document.getElementById('next-unlock').innerText = `30 minutos`;
    
    const msg = document.createElement('div');
    msg.innerHTML = `<div style="font-size:40px;">🎉</div><h2 style="font-size:18px;">¡Tiempo completado!</h2><p style="font-size:12px;">Tienes 30 minutos para plantar tu árbol</p>`;
    msg.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.9); color:white; padding:20px; border-radius:40px; text-align:center; z-index:10001; animation: bounceIn 0.5s ease; min-width:240px; max-width:90%;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
    
    window.plantTimeout = setTimeout(() => {
        if (isPlantingMode && !isBlocked) {
            isPlantingMode = false;
            const timeoutMsg = document.createElement('div');
            timeoutMsg.textContent = `⏰ Tiempo agotado (30 min), el árbol no fue plantado`;
            timeoutMsg.style.cssText = `position:fixed; bottom:20px; right:20px; background:#f44336; color:white; padding:8px 16px; border-radius:25px; z-index:9999; font-size:11px; animation: fadeOut 3s forwards;`;
            document.body.appendChild(timeoutMsg);
            setTimeout(() => timeoutMsg.remove(), 3000);
        }
    }, UNLOCK_DURATION * 1000);
}

function plantTree(x, y) {
    if (isBlocked) { alert(`🔒 ${userName}, espera a que termine el enfoque`); return; }
    if (!isPlantingMode) { alert(`🌱 ${userName}, primero completa la cuenta regresiva`); return; }
    
    const tree = TREES[selectedTreeIndex];
    const plantedTree = {
        id: Date.now(),
        treeId: tree.id,
        name: tree.name,
        emoji: tree.emoji,
        rarity: tree.rarity,
        cost: cheatModeActive ? 5/60 : tree.cost,
        x: x,
        y: y,
        plantedAt: new Date().toISOString()
    };
    plantedTrees.push(plantedTree);
    renderGarden();
    saveData();
    updateStats();
    
    if (window.plantTimeout) clearTimeout(window.plantTimeout);
    if (alarmInterval) clearInterval(alarmInterval);
    isPlantingMode = false;
    document.getElementById('mode-status').innerText = '✅ Completado';
    document.getElementById('next-unlock').innerText = 'Elige otro';
    
    const msg = document.createElement('div');
    msg.textContent = `✅ ¡${tree.name} ${tree.emoji} plantado, ${userName}!`;
    msg.style.cssText = `position:fixed; bottom:20px; right:20px; background:#4caf50; color:white; padding:8px 16px; border-radius:25px; z-index:9999; font-size:12px; animation: fadeOut 3s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

function renderGarden() {
    const garden = document.getElementById('garden');
    if (!garden) return;
    garden.innerHTML = '';
    
    plantedTrees.forEach((tree, idx) => {
        const treeDiv = document.createElement('div');
        treeDiv.className = 'tree-planted';
        treeDiv.style.left = `${tree.x || (idx * 40 % 800)}px`;
        treeDiv.style.top = `${tree.y || (Math.floor(idx / 20) * 40)}px`;
        treeDiv.innerHTML = `
            <div style="font-size:22px;">${tree.emoji}</div>
            <div class="tree-tooltip">${tree.name} | ${formatTime(tree.cost)}</div>
        `;
        treeDiv.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`${userName}, ¿eliminar este ${tree.name}?`)) {
                plantedTrees.splice(idx, 1);
                renderGarden();
                saveData();
                updateStats();
            }
        };
        garden.appendChild(treeDiv);
    });
}

function updateStats() {
    const treeCountSpan = document.getElementById('tree-count');
    if (treeCountSpan) treeCountSpan.innerText = plantedTrees.length;
    
    const totalTime = plantedTrees.reduce((sum, tree) => sum + (tree.cost || 0), 0);
    const totalTimeSpan = document.getElementById('total-time');
    if (totalTimeSpan) totalTimeSpan.innerText = formatTime(totalTime);
}

function clearGarden() {
    if (confirm(`⚠️ ${userName}, ¿eliminar TODOS los árboles?`)) {
        plantedTrees = [];
        renderGarden();
        saveData();
        updateStats();
    }
}

function setupGardenClick() {
    const garden = document.getElementById('garden');
    if (garden) {
        garden.addEventListener('click', (e) => {
            const rect = garden.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            plantTree(x, y);
        });
    }
}