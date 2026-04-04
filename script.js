// Configuración
const TREES_COUNT = 15;
const UNLOCK_DURATION = 1800; // 30 MINUTOS = 1800 segundos para plantar

let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedTreeIndex = 1;
let plantedTrees = [];
let userName = "";
let isPlantingMode = false;
let wasScreenLocked = false;
let alarmInterval = null; // Para la alarma de 10 repeticiones

// Calcular costo
function getTreeCost(treeNumber) {
    if (treeNumber === 'test') return 1;
    return treeNumber * 15;
}

// Formatear tiempo
function formatTime(minutes) {
    if (minutes === 1) return '1 min';
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
        plantedTrees: plantedTrees.filter(t => !t.isTest)
    }));
}

// Cargar datos
function loadSavedData() {
    const saved = localStorage.getItem('focusForest');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.userName) userName = data.userName;
        plantedTrees = data.plantedTrees || [];
        renderGarden();
        updateStats();
    }
}

// Alarma que suena 10 veces
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
        } catch(e) {
            console.log("Audio no disponible");
        }
    }
    
    if (alarmInterval) clearInterval(alarmInterval);
    
    beep(); // Primera vez inmediata
    count = 1;
    
    alarmInterval = setInterval(() => {
        if (count < 10) {
            beep();
            count++;
        } else {
            clearInterval(alarmInterval);
            alarmInterval = null;
        }
    }, 1500);
}

// Ventana emergente de logro
function showSuccessPopup() {
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #4caf50, #2e7d32);
        backdrop-filter: blur(20px);
        color: white;
        padding: 40px 60px;
        border-radius: 60px;
        text-align: center;
        z-index: 20000;
        box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        animation: bounceIn 0.5s ease;
        min-width: 400px;
        border: 2px solid gold;
    `;
    popup.innerHTML = `
        <div style="font-size: 80px; margin-bottom: 20px;">🏆</div>
        <h1 style="font-size: 48px; margin-bottom: 16px;">¡LO LOGRASTE!</h1>
        <p style="font-size: 20px; margin-bottom: 16px;">Has completado el tiempo de enfoque</p>
        <p style="font-size: 16px; opacity: 0.9;">Ahora tienes <strong style="color: #ffd700;">30 minutos</strong> para plantar tu árbol 🌳</p>
        <button id="close-popup" style="margin-top: 30px; padding: 12px 30px; background: white; color: #4caf50; border: none; border-radius: 40px; font-size: 16px; font-weight: bold; cursor: pointer;">✨ Plantar árbol ✨</button>
    `;
    document.body.appendChild(popup);
    
    // Añadir animación
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.3);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.05);
            }
            70% {
                transform: translate(-50%, -50%) scale(0.9);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
            }
        }
    `;
    document.head.appendChild(style);
    
    document.getElementById('close-popup').onclick = () => {
        popup.remove();
    };
    
    // Auto-cerrar después de 10 segundos
    setTimeout(() => {
        if (popup.parentNode) popup.remove();
    }, 10000);
}

// Autenticación
async function authenticateUser() {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            z-index: 30000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;
        modal.innerHTML = `
            <div style="background:white; border-radius:32px; padding:32px; text-align:center; max-width:320px; width:90%;">
                <div style="font-size:48px;">🔐</div>
                <h2>Verificar identidad</h2>
                <p style="color:#666; margin:16px 0;">${userName}</p>
                <button id="auth-ok" style="width:100%; padding:14px; background:#4caf50; color:white; border:none; border-radius:14px;">🔓 Autorizar</button>
                <button id="auth-cancel" style="background:none; border:none; color:#999; margin-top:16px;">Cancelar</button>
            </div>
        `;
        document.body.appendChild(modal);
        
        document.getElementById('auth-ok').onclick = () => {
            modal.remove();
            resolve(true);
        };
        document.getElementById('auth-cancel').onclick = () => {
            modal.remove();
            resolve(false);
        };
    });
}

// Botón para ver contador
function showViewCounterButton() {
    if (document.getElementById('view-counter-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'view-counter-btn';
    btn.innerHTML = '👁️ Ver contador';
    btn.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255,255,255,0.2);
        backdrop-filter: blur(10px);
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 12px 24px;
        border-radius: 40px;
        z-index: 10001;
        cursor: pointer;
        font-weight: 600;
    `;
    btn.onclick = async () => {
        const auth = await authenticateUser();
        if (auth && isBlocked) {
            const mins = Math.floor(currentFocusTime / 60);
            const secs = currentFocusTime % 60;
            const modal = document.createElement('div');
            modal.style.cssText = `position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:30001; display:flex; justify-content:center; align-items:center; flex-direction:column;`;
            modal.innerHTML = `<div style="text-align:center;"><div style="font-size:72px;">⏱️</div><div style="font-size:64px; font-weight:bold;">${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}</div><p style="margin-top:20px;">Tiempo restante</p></div>`;
            document.body.appendChild(modal);
            modal.onclick = () => modal.remove();
            setTimeout(() => modal.remove(), 10000);
        }
    };
    document.body.appendChild(btn);
}

function hideViewCounterButton() {
    const btn = document.getElementById('view-counter-btn');
    if (btn) btn.remove();
}

// Árbol de prueba
function plantTestTree(x, y) {
    const testTree = {
        id: Date.now(),
        number: 'test',
        cost: 1,
        x: x,
        y: y,
        isTest: true,
        expiresAt: Date.now() + (30 * 60 * 1000) // 30 minutos
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
    
    const msg = document.createElement('div');
    msg.textContent = `🌱 Árbol de prueba plantado! (1 min de enfoque)`;
    msg.style.cssText = `position:fixed; bottom:20px; right:20px; background:#4caf50; color:white; padding:12px 20px; border-radius:30px; z-index:9999; animation: fadeOut 3s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

// Reiniciar contador
function resetCounter(reason) {
    if (!isBlocked) return;
    if (focusInterval) clearInterval(focusInterval);
    if (alarmInterval) clearInterval(alarmInterval);
    isBlocked = false;
    isPlantingMode = false;
    currentFocusTime = 0;
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = 'Libre';
    hideViewCounterButton();
    
    const msg = document.createElement('div');
    msg.textContent = `⚠️ ${reason} - Contador reiniciado`;
    msg.style.cssText = `position:fixed; bottom:20px; left:20px; background:#f44336; color:white; padding:12px 20px; border-radius:30px; z-index:9999; animation: fadeOut 3s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

// Detectar cambios
function setupDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            wasScreenLocked = true;
        } else {
            if (wasScreenLocked && isBlocked) {
                console.log("Teléfono desbloqueado - Contador continúa");
                wasScreenLocked = false;
            }
        }
    });
    
    let lostFocusTime = 0;
    window.addEventListener('blur', () => {
        if (isBlocked) {
            lostFocusTime = Date.now();
        }
    });
    
    window.addEventListener('focus', () => {
        if (isBlocked && lostFocusTime > 0) {
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
    document.getElementById('garden-title').innerHTML = `🌱 Jardín de ${userName}`;
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    generateTreeMenu();
    renderGarden();
    updateStats();
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
            <div class="tree-cost">💰 1 min</div>
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
            <div style="font-size:48px; margin:10px auto;">🌲</div>
            <p><strong>Árbol de Prueba</strong></p>
            <p style="color:#ff6f00;">💰 1 minuto</p>
            <button id="start-tree-btn" class="btn-primary" style="margin-top:20px; width:100%;">🌱 Comenzar</button>
        `;
    } else {
        const cost = getTreeCost(treeNumber);
        selectedDisplay.innerHTML = `
            <img src="trees/${treeNumber}.png" style="width:60px; margin:10px auto;" onerror="this.style.display='none'">
            <p><strong>Árbol #${treeNumber}</strong></p>
            <p style="color:#ff6f00;">💰 ${formatTime(cost)}</p>
            <button id="start-tree-btn" class="btn-primary" style="margin-top:20px; width:100%;">🌱 Comenzar</button>
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
    
    const focusMinutes = selectedTreeIndex === 'test' ? 1 : getTreeCost(selectedTreeIndex);
    currentFocusTime = focusMinutes * 60;
    isBlocked = true;
    isPlantingMode = false;
    
    document.getElementById('blocker').classList.add('active');
    document.getElementById('mode-status').innerText = '🔴 ENFOQUE';
    document.getElementById('next-unlock').innerText = formatTime(focusMinutes);
    document.getElementById('blocker-message').innerHTML = selectedTreeIndex === 'test' ? 
        `${userName}, cultivando Árbol de Prueba 🌲` : 
        `${userName}, cultivando Árbol #${selectedTreeIndex}`;
    
    updateTimerDisplay();
    showViewCounterButton();
    
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
    const minutes = Math.floor(currentFocusTime / 60);
    const seconds = currentFocusTime % 60;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    const totalSeconds = (selectedTreeIndex === 'test' ? 60 : getTreeCost(selectedTreeIndex) * 60);
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

// Desbloquear para plantar (con alarma de 10 veces y popup)
function unlockToPlant() {
    if (!isBlocked) return;
    clearInterval(focusInterval);
    isBlocked = false;
    isPlantingMode = true;
    hideViewCounterButton();
    
    // ALARMA QUE SUENA 10 VECES
    playAlarmTenTimes();
    
    // VENTANA EMERGENTE DE LOGRO
    showSuccessPopup();
    
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = '🟢 PLANTAR';
    document.getElementById('next-unlock').innerText = `30 minutos`;
    
    const msg = document.createElement('div');
    msg.innerHTML = `<div style="font-size:48px;">🎉</div><h2>¡Tiempo completado!</h2><p>Tienes 30 minutos para plantar tu árbol</p>`;
    msg.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.9); backdrop-filter:blur(20px); color:white; padding:32px; border-radius:48px; text-align:center; z-index:10001; animation: bounceIn 0.5s ease;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 8000);
    
    window.plantTimeout = setTimeout(() => {
        if (isPlantingMode && !isBlocked) {
            isPlantingMode = false;
            const timeoutMsg = document.createElement('div');
            timeoutMsg.textContent = `⏰ Tiempo agotado (30 min), el árbol no fue plantado`;
            timeoutMsg.style.cssText = `position:fixed; bottom:20px; right:20px; background:#f44336; color:white; padding:12px 20px; border-radius:30px; z-index:9999; animation: fadeOut 3s forwards;`;
            document.body.appendChild(timeoutMsg);
            setTimeout(() => timeoutMsg.remove(), 3000);
        }
    }, UNLOCK_DURATION * 1000);
}

// Plantar árbol
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
    msg.style.cssText = `position:fixed; bottom:20px; right:20px; background:#4caf50; color:white; padding:12px 20px; border-radius:30px; z-index:9999; animation: fadeOut 3s forwards;`;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
}

// Renderizar jardín
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
                <div style="font-size:48px;">🌲</div>
                <div class="tree-tooltip">Árbol de Prueba | 1 min</div>
            `;
        } else {
            treeDiv.innerHTML = `
                <img src="trees/${tree.number}.png" onerror="this.src='https://via.placeholder.com/55'">
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

// Actualizar estadísticas
function updateStats() {
    const realTrees = plantedTrees.filter(t => !t.isTest);
    const treeCountSpan = document.getElementById('tree-count');
    if (treeCountSpan) treeCountSpan.innerText = realTrees.length;
    
    const totalTime = realTrees.reduce((sum, tree) => sum + (tree.cost || 0), 0);
    const totalTimeSpan = document.getElementById('total-time');
    if (totalTimeSpan) totalTimeSpan.innerText = formatTime(totalTime);
}

// Limpiar jardín
function clearGarden() {
    if (confirm(`⚠️ ${userName}, ¿eliminar TODOS los árboles?`)) {
        plantedTrees = plantedTrees.filter(t => t.isTest);
        renderGarden();
        saveData();
        updateStats();
    }
}

// Configurar clic en jardín
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

// Añadir animaciones
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes bounceIn {
            0% {
                opacity: 0;
                transform: translate(-50%, -50%) scale(0.3);
            }
            50% {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1.05);
            }
            70% {
                transform: translate(-50%, -50%) scale(0.9);
            }
            100% {
                transform: translate(-50%, -50%) scale(1);
            }
        }
        @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
        }
    `;
    document.head.appendChild(style);
}

// Inicializar
function init() {
    addAnimations();
    loadSavedData();
    setupGardenClick();
    setupDetection();
    
    const startBtn = document.getElementById('start-btn');
    if (startBtn) {
        startBtn.onclick = startApp;
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
}

window.onload = init;
