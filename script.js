// Configuración
const TREES_COUNT = 15;
const UNLOCK_DURATION = 300; // 5 MINUTOS = 300 segundos para plantar
let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedTreeIndex = 1;
let plantedTrees = [];
let userName = "";
let isPlantingMode = false;
let violationCount = 0;

// Elemento de audio para la alarma
let alarmAudio = null;

// Inicializar audio
function initAudio() {
    try {
        // Crear un beep simple con Web Audio API
        alarmAudio = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) {
        console.log("Audio no soportado");
    }
}

// Reproducir alarma
function playAlarm() {
    try {
        if (alarmAudio) {
            const oscillator = alarmAudio.createOscillator();
            const gainNode = alarmAudio.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(alarmAudio.destination);
            oscillator.frequency.value = 880;
            gainNode.gain.value = 0.3;
            oscillator.start();
            gainNode.gain.exponentialRampToValueAtTime(0.00001, alarmAudio.currentTime + 2);
            oscillator.stop(alarmAudio.currentTime + 2);
        } else {
            // Fallback: usar sonido del sistema
            const beep = new Audio('data:audio/wav;base64,U3RlYWx0aCBzb3VuZCBub3QgYXZhaWxhYmxl');
            beep.play().catch(e => console.log('Audio no disponible'));
        }
    } catch(e) {
        console.log("Error reproduciendo alarma");
    }
}

// Calcular costo
function getTreeCost(treeNumber) {
    return treeNumber * 15;
}

// Formatear tiempo
function formatTime(minutes) {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}min`;
}

// Guardar datos
function saveData() {
    localStorage.setItem('focusForest', JSON.stringify({
        userName: userName,
        plantedTrees: plantedTrees
    }));
}

function loadSavedData() {
    const saved = localStorage.getItem('focusForest');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.userName) {
            userName = data.userName;
            document.getElementById('user-name').value = userName;
        }
        plantedTrees = data.plantedTrees || [];
        renderGarden();
        updateStats();
    }
}

// Reiniciar contador
function resetCounter(reason) {
    if (!isBlocked) return;
    
    violationCount++;
    
    if (focusInterval) {
        clearInterval(focusInterval);
        focusInterval = null;
    }
    
    const elapsedSeconds = (getTreeCost(selectedTreeIndex) * 60) - currentFocusTime;
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    
    const violationMsg = document.createElement('div');
    violationMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        backdrop-filter: blur(20px);
        color: white;
        padding: 24px;
        border-radius: 32px;
        z-index: 20002;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        animation: shake 0.5s ease;
        min-width: 320px;
        border: 1px solid rgba(255,255,255,0.2);
    `;
    violationMsg.innerHTML = `
        <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
        <h2 style="margin-bottom: 12px;">Infracción</h2>
        <p>${reason}</p>
        <p style="color: #ff9800; margin: 12px 0;">Llevabas ${formatTime(elapsedMinutes)} de enfoque</p>
        <p style="color: #f44336;">❌ El contador se ha reiniciado</p>
        <p style="margin-top: 12px; font-size: 14px;">Infracción #${violationCount}</p>
    `;
    document.body.appendChild(violationMsg);
    setTimeout(() => violationMsg.remove(), 4000);
    
    isBlocked = false;
    isPlantingMode = false;
    currentFocusTime = 0;
    
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = 'Reiniciado';
    document.getElementById('next-unlock').innerText = 'Vuelve a empezar';
}

// Detección estricta
function setupStrictDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isBlocked) resetCounter('📱 Cambiaste de pestaña');
    });
    window.addEventListener('blur', () => {
        if (isBlocked) resetCounter('🪟 Saliste de la ventana');
    });
    document.addEventListener('keydown', (e) => {
        if (isBlocked) {
            e.preventDefault();
            resetCounter(`⌨️ Tecla presionada: ${e.key}`);
        }
    });
    window.addEventListener('scroll', () => {
        if (isBlocked) resetCounter('📜 Scroll detectado');
    });
    document.addEventListener('contextmenu', (e) => {
        if (isBlocked) {
            e.preventDefault();
            resetCounter('🛠️ Menú contextual');
        }
    });
}

function startApp() {
    userName = document.getElementById('user-name').value.trim();
    if (userName === "") {
        alert("Por favor, ingresa tu nombre");
        return;
    }
    
    saveData();
    document.getElementById('user-name-display').innerText = userName;
    document.getElementById('garden-title').innerHTML = `🌱 Jardín de ${userName}`;
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    generateTreeMenu();
    renderGarden();
    updateStats();
    selectTree(1);
}

function generateTreeMenu() {
    const treeList = document.getElementById('tree-list');
    treeList.innerHTML = '';
    
    for (let i = 1; i <= TREES_COUNT; i++) {
        const cost = getTreeCost(i);
        const div = document.createElement('div');
        div.className = `tree-item ${selectedTreeIndex === i ? 'selected' : ''}`;
        div.onclick = () => selectTree(i);
        
        div.innerHTML = `
            <img src="trees/${i}.png" alt="Árbol ${i}" onerror="this.src='https://via.placeholder.com/40?text=🌲'">
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
    const cost = getTreeCost(treeNumber);
    document.getElementById('selected-display').innerHTML = `
        <img src="trees/${treeNumber}.png" alt="Árbol ${treeNumber}" onerror="this.style.display='none'">
        <p style="font-weight: 600; margin: 12px 0;">Árbol #${treeNumber}</p>
        <p style="color: #ff6f00; font-weight: 500;">💰 ${formatTime(cost)}</p>
        <button id="start-tree-btn" class="btn-primary" style="margin-top: 20px; width: 100%;">🌱 Comenzar</button>
        <p style="font-size: 12px; color: #666; margin-top: 12px;">1. Elige árbol | 2. Comienza</p>
    `;
    
    const startBtn = document.getElementById('start-tree-btn');
    if (startBtn) {
        const newBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newBtn, startBtn);
        newBtn.onclick = (e) => {
            e.stopPropagation();
            startFocusForSelectedTree();
        };
    }
}

function startFocusForSelectedTree() {
    if (isBlocked) {
        alert(`🔒 ${userName}, ya estás en modo enfoque`);
        return;
    }
    
    if (focusInterval) clearInterval(focusInterval);
    
    const focusMinutes = getTreeCost(selectedTreeIndex);
    currentFocusTime = focusMinutes * 60;
    
    isBlocked = true;
    isPlantingMode = false;
    violationCount = 0;
    
    document.getElementById('blocker').classList.add('active');
    document.getElementById('mode-status').innerText = '🔴 ENFOQUE';
    document.getElementById('next-unlock').innerText = formatTime(focusMinutes);
    document.getElementById('blocker-message').innerHTML = `${userName}, cultivando Árbol #${selectedTreeIndex}`;
    
    updateBlockerTimer();
    
    focusInterval = setInterval(() => {
        if (currentFocusTime <= 0) {
            clearInterval(focusInterval);
            unlockForPlanting();
        } else {
            currentFocusTime--;
            updateBlockerTimer();
        }
    }, 1000);
}

function updateBlockerTimer() {
    const minutes = Math.floor(currentFocusTime / 60);
    const seconds = currentFocusTime % 60;
    document.getElementById('timer').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const totalSeconds = getTreeCost(selectedTreeIndex) * 60;
    const progress = ((totalSeconds - currentFocusTime) / totalSeconds) * 100;
    const circumference = 2 * Math.PI * 90;
    const offset = circumference - (progress / 100) * circumference;
    
    const circle = document.getElementById('progress-ring-circle');
    if (circle) {
        circle.style.strokeDashoffset = offset;
    }
    
    const percentageSpan = document.getElementById('progress-percentage');
    if (percentageSpan) {
        percentageSpan.innerText = `${Math.round(progress)}%`;
    }
}

function unlockForPlanting() {
    if (!isBlocked) return;
    
    clearInterval(focusInterval);
    isBlocked = false;
    isPlantingMode = true;
    
    // REPRODUCIR ALARMA
    playAlarm();
    
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = '🟢 PLANTAR';
    document.getElementById('next-unlock').innerText = `${Math.floor(UNLOCK_DURATION / 60)} minutos`;
    
    const msg = document.createElement('div');
    msg.innerHTML = `
        <div style="font-size: 48px;">🎉</div>
        <h2>¡Tiempo completado!</h2>
        <p>Tienes 5 minutos para plantar tu árbol</p>
        <p style="font-size: 14px; color: #4caf50; margin-top: 12px;">🌳 Árbol #${selectedTreeIndex}</p>
    `;
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        backdrop-filter: blur(20px);
        color: white;
        padding: 32px;
        border-radius: 48px;
        z-index: 10001;
        text-align: center;
        box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        animation: bounce 0.5s ease;
        min-width: 320px;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 5000);
    
    const autoLockTimeout = setTimeout(() => {
        if (isPlantingMode && !isBlocked) {
            isPlantingMode = false;
            const timeoutMsg = document.createElement('div');
            timeoutMsg.textContent = `⏰ Tiempo agotado, ${userName}. El árbol no fue plantado.`;
            timeoutMsg.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: #f44336;
                color: white;
                padding: 12px 20px;
                border-radius: 30px;
                z-index: 9999;
            `;
            document.body.appendChild(timeoutMsg);
            setTimeout(() => timeoutMsg.remove(), 3000);
        }
    }, UNLOCK_DURATION * 1000);
    
    window.pendingAutoLock = autoLockTimeout;
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
    
    if (window.pendingAutoLock) {
        clearTimeout(window.pendingAutoLock);
        window.pendingAutoLock = null;
    }
    
    isPlantingMode = false;
    
    const msg = document.createElement('div');
    msg.textContent = `✅ ¡Árbol #${selectedTreeIndex} plantado, ${userName}!`;
    msg.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 12px 20px;
        border-radius: 30px;
        z-index: 9999;
        animation: fadeOut 3s forwards;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
    
    document.getElementById('mode-status').innerText = '✅ Completado';
    document.getElementById('next-unlock').innerText = 'Elige otro';
}

function renderGarden() {
    const garden = document.getElementById('garden');
    garden.innerHTML = '';
    
    plantedTrees.forEach((tree, idx) => {
        const treeDiv = document.createElement('div');
        treeDiv.className = 'tree-planted';
        treeDiv.style.left = `${tree.x || (idx * 70 % 800)}px`;
        treeDiv.style.top = `${tree.y || (Math.floor(idx / 12) * 70)}px`;
        
        treeDiv.innerHTML = `
            <img src="trees/${tree.number}.png" alt="Árbol ${tree.number}" onerror="this.src='https://via.placeholder.com/60?text=🌲'">
            <div class="tree-tooltip">
                Árbol #${tree.number} | ${formatTime(tree.cost)}
            </div>
        `;
        
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

function updateStats()
