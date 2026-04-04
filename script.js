// Configuración
const TREES_COUNT = 15;
const UNLOCK_DURATION = 1800; // 30 minutos para plantar

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
let totalBlockedSeconds = 0; // Estadística de tiempo bloqueado
const CHEAT_CODE = "409070110409070110409070110";

// Calcular costo
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
    if (mins > 0) return `${mins} min ${secs} s`;
    return `${secs} segundos`;
}

// Guardar datos
function saveData() {
    localStorage.setItem('focusForest', JSON.stringify({
        userName: userName,
        plantedTrees: plantedTrees.filter(t => !t.isTest),
        cheatModeActive: cheatModeActive,
        totalBlockedSeconds: totalBlockedSeconds
    }));
}

// Cargar datos
function loadSavedData() {
    const saved = localStorage.getItem('focusForest');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.userName) userName = data.userName;
        if (data.cheatModeActive) cheatModeActive = data.cheatModeActive;
        if (data.totalBlockedSeconds) totalBlockedSeconds = data.totalBlockedSeconds;
        plantedTrees = data.plantedTrees || [];
        renderGarden();
        updateStats();
        updateBlockedTimeStats();
    }
}

// Actualizar estadística de tiempo bloqueado
function updateBlockedTimeStats() {
    const totalBlockedSpan = document.getElementById('total-blocked-time');
    if (totalBlockedSpan) {
        totalBlockedSpan.innerText = formatSeconds(totalBlockedSeconds);
    }
}

function addBlockedTime(seconds) {
    totalBlockedSeconds += seconds;
    updateBlockedTimeStats();
    saveData();
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
        saveData();
        return true;
    }
    return false;
}

// Alarma
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

// Árbol de prueba
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

// Reiniciar contador
function resetCounter(reason) {
    if (!isBlocked) return;
    if (focusInterval) clearInterval(focusInterval);
    if (alarmInterval) clearInterval(alarmInterval);
    
    // Guardar tiempo completado si había progreso
    const totalSeconds = (selectedTreeIndex === 'test' ? (cheatModeActive ? 5 : 60) : getTreeCostInSeconds(selectedTreeIndex));
    const completedSeconds = totalSeconds - currentFocusTime;
    if (completedSeconds > 0) {
        addBlockedTime(completedSeconds);
    }
    
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

// Detectar cambios
function setupDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isBlocked && !isPlantingMode) {
            wasScreenLocked = true;
        } else if (!document.hidden && wasScreenLocked && isBlocked && !isPlantingMode) {
            wasScreenLocked = false;
        }
    });
    
    let lostFocusTime = 0;
    window.addEventListener('blur', () => { 
        if (isBlocked && !isPlantingMode) lostFocusTime = Date.now(); 
    });
    window.addEventListener('focus', () => {
        if (isBlocked && !isPlantingMode && lostFocusTime > 0) {
            const timeAway = Date.now() - lostFocusTime;
            if (timeAway > 2000) {
                resetCounter('Cambiaste de aplicación');
            }
            lostFocusTime = 0;
        }
    });
}

// Iniciar app
function startApp() {
    userName = document.getElementById('user-name').value.trim();
    if (userName === "") { 
        alert("Ingresa tu nombre"); 
        return; 
    }
    
    saveData();
    document.getElementById('user-name-display').innerText = userName;
    
    if (cheatModeActive) {
        document.getElementById('garden-title').innerHTML = `🌱 Jardín de ${userName} 🎮`;
    } else {
        document.getElementById('garden-title').innerHTML = `🌱 Jardín de ${userName}`;
    }
    
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    generateTreeMenu();
    renderGarden();
    updateStats();
    updateBlockedTimeStats();
    selectTree(1);
}

// Generar menú
function generateTreeMenu() {
    const treeList = document.getElementById('tree-list');
    if (!treeList) return;
    treeList.innerHTML = '';
    
    const testDiv = document.createElement('div');
    testDiv.className = `tree-item ${selectedTreeIndex === 'test' ? 'selected' : ''}`;
    testDiv.onclick = () => selectTree('test');
    testDiv.innerHTML = `
        <div style="width:40px; height:40px; display:flex; align-items:center; justify-content:center; font-size:32px;">🌲</div>
        <div class="tree-info">
            <div class="tree-name">🌲 Árbol de Prueba</div>
            <div class="tree-cost">💰 ${cheatModeActive ? '5s (prueba)' : '1 min'}</div>
        </div>
    `;
    treeList.appendChild(testDiv);
    
    for (let i = 1; i <= TREES_COUNT; i++) {
        const cost = getTreeCost(i);
        const div = document.createElement('div');
        div.className = `tree-item ${selectedTreeIndex === i ? 'selected' : ''}`;
        div.onclick = () => selectTree(i);
        div.innerHTML = `
            <img src="trees/${i}.png" onerror="this.style.display='none'">
            <div class="tree-info">
                <div class="tree-name">Árbol #${i}</div>
                <div class="tree-cost">💰 ${formatTime(cost)}</div>
            </div>
        `;
        treeList.appendChild(div);
    }
}

// Seleccionar árbol
function selectTree(treeNumber) {
    selectedTreeIndex = treeNumber;
    generateTreeMenu();
    const selectedDisplay = document.getElementById('selected-display');
    if (!selectedDisplay) return;
    
    if (treeNumber === 'test') {
        selectedDisplay.innerHTML = `
            <div style="font-size:48px; margin:8px auto;">🌲</div>
            <p><strong>Árbol de Prueba</strong></p>
            <p style="color:#ff6f00;">💰 ${cheatModeActive ? '5 segundos (modo prueba)' : '1 minuto'}</p>
            <button id="start-tree-btn" class="btn-primary" style="margin-top:16px; width:100%; padding:12px;">🌱 Comenzar</button>
        `;
    } else {
        const cost = getTreeCost(treeNumber);
        selectedDisplay.innerHTML = `
            <img src="trees/${treeNumber}.png" style="width:60px; margin:8px auto;" onerror="this.style.display='none'">
            <p><strong>Árbol #${treeNumber}</strong></p>
            <p style="color:#ff6f00;">💰 ${formatTime(cost)}</p>
            <button id="start-tree-btn" class="btn-primary" style="margin-top:16px; width:100%; padding:12px;">🌱 Comenzar</button>
        `;
    }
    
    const startBtn = document.getElementById('start-tree-btn');
    if (startBtn) {
        startBtn.onclick = () => startFocus();
    }
}

// Iniciar enfoque
function startFocus() {
    if (isBlocked) { 
        alert(`🔒 ${userName}, ya estás en modo enfoque`); 
        return; 
    }
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
        document.getElementById('blocker-message').innerHTML = selectedTreeIndex === 'test' ? 
            `${userName}, cultivando Árbol de Prueba 🌲` : 
            `${userName}, cultivando Árbol #${selectedTreeIndex}`;
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

// Actualizar timer
function updateTimerDisplay() {
    const seconds = currentFocusTime;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        if (cheatModeActive || seconds < 60) {
            timerElement.innerText = `${seconds}s`;
        } else {
            timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    let totalSeconds = selectedTreeIndex === 'test' ? (cheatModeActive ? 5 : 60) : getTreeCostInSeconds(selectedTreeIndex);
    const progress = ((totalSeconds - currentFocusTime) / totalSeconds) * 100;
    const fillElement = document.getElementById('progress-fill');
    if (fillElement) {
        fillElement.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
    const percentageElement = document.getElementById('progress-percentage');
    if (percentageElement) {
        percentageElement.innerText = `${Math.round(progress)}%`;
    }
}

// Desbloquear para plantar
function unlockToPlant() {
    if (!isBlocked) return;
    clearInterval(focusInterval);
    
    // Guardar el tiempo completado
    const totalSeconds = selectedTreeIndex === 'test' ? (cheatModeActive ? 5 : 60) : getTreeCostInSeconds(selectedTreeIndex);
    addBlockedTime
