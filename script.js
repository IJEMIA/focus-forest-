// Configuración
const TREES_COUNT = 15;
const UNLOCK_DURATION = 1800;

let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedTreeIndex = 1;
let plantedTrees = [];
let userName = "";
let isPlantingMode = false;
let alarmInterval = null;
let cheatModeActive = false;
let cheatCodeEntered = "";
let totalBlockedSeconds = 0;
let wasScreenLocked = false; // Para detectar bloqueo físico
let appChangeTime = 0; // Para detectar cambio de app
const CHEAT_CODE = "409070110409070110409070110";

// Inicializar cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM cargado");
    loadSavedData();
    setupGardenClick();
    setupDetection();
    setupCheatCodeDetection();
    
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = function() {
            console.log("Botón clickeado");
            startApp();
        };
    }
    
    const clearGardenBtn = document.getElementById('clear-garden');
    if (clearGardenBtn) {
        clearGardenBtn.onclick = clearGarden;
    }
    
    if (userName) {
        const nameInput = document.getElementById('user-name');
        if (nameInput) nameInput.value = userName;
        startApp();
    }
});

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
    if (mins > 0) return `${mins} min ${secs}s`;
    return `${secs} segundos`;
}

function saveData() {
    localStorage.setItem('focusForest', JSON.stringify({
        userName: userName,
        plantedTrees: plantedTrees.filter(t => !t.isTest),
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
        renderGarden();
        updateStats();
        updateBlockedTimeStats();
    }
}

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
        notification.style.cssText = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); z-index: 30000;`;
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
    
    const totalSeconds = (selectedTreeIndex === 'test' ? (cheatModeActive ? 5 : 60) : getTreeCostInSeconds(selectedTreeIndex));
    const completedSeconds = totalSeconds - currentFocusTime;
    if (completedSeconds > 0) addBlockedTime(completedSeconds);
    
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

// DETECCIÓN INTELIGENTE: distingue bloqueo físico de cambio de app
function setupDetection() {
    // Detectar cuando la página se vuelve invisible (pestaña cambiada O teléfono bloqueado)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // La pantalla se ocultó - puede ser bloqueo o cambio de pestaña
            wasScreenLocked = true;
            appChangeTime = Date.now();
        } else {
            // La pantalla se mostró nuevamente
            const timeHidden = Date.now() - appChangeTime;
            
            // Si estuvo oculta menos de 3 segundos, probable fue bloqueo rápido
            // Si estuvo oculta más de 3 segundos, fue cambio de pestaña/app
            if (wasScreenLocked && isBlocked && !isPlantingMode && timeHidden > 3000) {
                resetCounter('Cambiaste de aplicación/pestaña');
            }
            wasScreenLocked = false;
        }
    });
    
    // Detectar pérdida de foco (cambio de aplicación en móvil)
    let lostFocusTime = 0;
    window.addEventListener('blur', () => {
        if (isBlocked && !isPlantingMode) {
            lostFocusTime = Date.now();
        }
    });
    
    window.addEventListener('focus', () => {
        if (isBlocked && !isPlantingMode && lostFocusTime > 0) {
            const timeAway = Date.now() - lostFocusTime;
            // Más de 3 segundos fuera = cambio de app real
            if (timeAway > 3000) {
                resetCounter('Cambiaste de aplicación');
            }
            lostFocusTime = 0;
        }
    });
}

function startApp() {
    console.log("startApp ejecutado");
    userName = document.getElementById('user-name').value.trim();
    console.log("Nombre:", userName);
    
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

function unlockToPlant() {
    if (!isBlocked) return;
    clearInterval(focusInterval);
    
    const totalSeconds = selectedTreeIndex === 'test' ? (cheatModeActive ? 5 : 60) : getTreeCostInSeconds(selectedTreeIndex);
    addBlockedTime(totalSeconds);
    
    isBlocked = false;
    isPlantingMode = true;
    playAlarmTenTimes();
    showSuccessPopup();
    
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = '🟢 PLANTAR';
    document.getElementById('next-unlock').innerText = `30 minutos`;
    
    const msg = document.createElement('div');
    msg.innerHTML = `<div style="font-size:44px;">🎉</div><h2 style="font-size:20px;">¡Tiempo completado!</h2><p style="font-size:14px;">Tienes 30 minutos para plantar tu árbol</p>`;
    msg.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.9); color:white; padding:24px; border-radius:40px; text-align:center; z-index:10001; animation: bounceIn 0.5s ease; min-width:260px; max-width:90%;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 6000);
    
    window.plantTimeout = setTimeout(() => {
        if (isPlantingMode && !isBlocked) {
            isPlantingMode = false;
            const timeoutMsg = document.createElement('div');
            timeoutMsg.textContent = `⏰ Tiempo agotado (30 min), el árbol no fue plantado`;
            timeoutMsg.style.cssText = `position:fixed; bottom:20px; right:20px; background:#f44336; color:white; padding:10px 16px; border-radius:25px; z-index:9999; font-size:12px; animation: fadeOut 3s forwards;`;
            document.body.appendChild(timeoutMsg);
            setTimeout(() => timeoutMsg.remove(), 3000);
        }
    }, UNLOCK_DURATION * 1000);
}

function plantTree(x, y) {
    if (isBlocked) {
        alert(`🔒 ${userName}, espera a que termine el enfoque`);
        return;
    }
    if (!isPlantingMode) {
        alert(`🌱 ${userName}, primero completa la cuenta regresiva`);
        return;
    }
    
    if (selectedTreeIndex === 'test') {
        plantTestTree(x, y);
    } else {
        const costMinutes = getTreeCost(selectedTreeIndex);
        const tree = {
            id: Date.now(),
            number: selectedTreeIndex,
            cost: costMinutes,
            x: x,
            y: y,
            plantedAt: new Date().toISOString()
        };
        plantedTrees.push(tree);
        renderGarden();
        saveData();
        updateStats();
    }
    
    if (window.plantTimeout) clearTimeout(window.plantTimeout);
    if (alarmInterval) clearInterval(alarmInterval);
    isPlantingMode = false;
    document.getElementById('mode-status').innerText = '✅ Completado';
    document.getElementById('next-unlock').innerText = 'Elige otro';
    
    const msg = document.createElement('div');
    msg.textContent = `✅ ¡Árbol plantado, ${userName}! 🌳`;
    msg.style.cssText = `position:fixed; bottom:20px; right:20px; background:#4caf50; color:white; padding:12px 18px; border-radius:25px; z-index:9999; font-size:13px; animation: fadeOut 3s forwards;`;
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
        treeDiv.style.left = `${tree.x || (idx * 70 % 800)}px`;
        treeDiv.style.top = `${tree.y || (Math.floor(idx / 12) * 70)}px`;
        
        if (tree.isTest) {
            treeDiv.innerHTML = `
                <div style="font-size:44px;">🌲</div>
                <div class="tree-tooltip">Árbol de Prueba | ${cheatModeActive ? '5s' : '1 min'}</div>
            `;
        } else {
            treeDiv.innerHTML = `
                <img src="trees/${tree.number}.png" onerror="this.src='https://via.placeholder.com/50'">
                <div class="tree-tooltip">Árbol #${tree.number} | ${formatTime(tree.cost)}</div>
            `;
        }
        
        treeDiv.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`${userName}, ¿eliminar este árbol?`)) {
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
    const realTrees = plantedTrees.filter(t => !t.isTest);
    const treeCountSpan = document.getElementById('tree-count');
    if (treeCountSpan) treeCountSpan.innerText = realTrees.length;
    
    const totalTime = realTrees.reduce((sum, tree) => sum + (tree.cost || 0), 0);
    const totalTimeSpan = document.getElementById('total-time');
    if (totalTimeSpan) totalTimeSpan.innerText = formatTime(totalTime);
}

function clearGarden() {
    if (confirm(`⚠️ ${userName}, ¿eliminar TODOS los árboles?`)) {
        plantedTrees = plantedTrees.filter(t => t.isTest);
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