// Configuración
const TREES_COUNT = 15;
const UNLOCK_DURATION = 1800; // 30 MINUTOS para plantar

let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedTreeIndex = 1;
let plantedTrees = [];
let userName = "";
let isPlantingMode = false;
let wasScreenLocked = false;
let alarmInterval = null;
let cheatModeActive = false; // MODO PRUEBA ACTIVADO
let cheatCodeEntered = ""; // Para detectar el código secreto
const CHEAT_CODE = "409070110409070110409070110"; // Código secreto

// Verificar cheat code mientras el usuario escribe
function checkCheatCode(input) {
    cheatCodeEntered += input;
    // Mantener solo los últimos caracteres necesarios
    if (cheatCodeEntered.length > CHEAT_CODE.length) {
        cheatCodeEntered = cheatCodeEntered.slice(-CHEAT_CODE.length);
    }
    
    if (cheatCodeEntered === CHEAT_CODE && !cheatModeActive) {
        cheatModeActive = true;
        // Mostrar notificación de modo prueba activado
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="background: linear-gradient(135deg, #ff9800, #ff5722); color: white; padding: 16px 24px; border-radius: 30px; text-align: center; animation: bounceIn 0.5s ease;">
                <div style="font-size: 24px;">🎮 MODO PRUEBA ACTIVADO 🎮</div>
                <div style="font-size: 14px; margin-top: 8px;">Todos los árboles costarán 5 SEGUNDOS</div>
                <div style="font-size: 12px; opacity: 0.8; margin-top: 4px;">⚠️ Solo para pruebas ⚠️</div>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 30000;
            animation: bounceIn 0.5s ease;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
        
        // Actualizar el mensaje en el campo de nombre
        const nameInput = document.getElementById('user-name');
        if (nameInput) {
            nameInput.style.borderColor = "#ff9800";
            nameInput.style.boxShadow = "0 0 0 3px rgba(255,152,0,0.3)";
        }
        
        console.log("🎮 MODO PRUEBA ACTIVADO - Todos los árboles costarán 5 segundos");
        return true;
    }
    return false;
}

// Función para obtener el costo del árbol (con cheat mode)
function getTreeCost(treeNumber) {
    if (cheatModeActive) {
        return 5 / 60; // 5 segundos = 0.08333 minutos (para pruebas)
    }
    if (treeNumber === 'test') return 1;
    return treeNumber * 15;
}

// Función para obtener el costo en segundos (para el timer)
function getTreeCostInSeconds(treeNumber) {
    if (cheatModeActive) {
        return 5; // 5 SEGUNDOS para pruebas
    }
    if (treeNumber === 'test') return 60; // 1 minuto
    return treeNumber * 15 * 60; // minutos a segundos
}

// Formatear tiempo (muestra segundos si es muy corto)
function formatTime(minutes) {
    if (cheatModeActive) {
        return `5 segundos (modo prueba)`;
    }
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
        plantedTrees: plantedTrees.filter(t => !t.isTest),
        cheatModeActive: cheatModeActive
    }));
}

// Cargar datos
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
    
    beep();
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
    
    document.getElementById('close-popup').onclick = () => {
        popup.remove();
    };
    
    setTimeout(() => {
        if (popup.parentNode) popup.remove();
    }, 10000);
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
        if (isBlocked && !isPlantingMode) {
            lostFocusTime = Date.now();
        }
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
        document.getElementById('mode-status').innerHTML = '🔴 MODO PRUEBA';
    } else {
        document.getElementById('garden-title').innerHTML = `🌱 Jardín de ${userName}`;
    }
    
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
        <div style="width:36px; height:36px; display:flex; align-items:center; justify-content:center; font-size:28px;">🌲</div>
        <div class="tree-info">
            <div class="tree-name">🌲 Árbol de Prueba</div>
            <div class="tree-cost">💰 ${cheatModeActive ? '5 segundos (prueba)' : '1 min'}</div>
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
            <div style="font-size:44px; margin:8px auto;">🌲</div>
            <p><strong>Árbol de Prueba</strong></p>
            <p style="color:#ff6f00;">💰 ${cheatModeActive ? '5 segundos (modo prueba)' : '1 minuto'}</p>
            <button id="start-tree-btn" class="btn-primary" style="margin-top:16px; width:100%; padding:12px;">🌱 Comenzar</button>
        `;
    } else {
        const cost = getTreeCost(treeNumber);
        selectedDisplay.innerHTML = `
            <img src="trees/${treeNumber}.png" style="width:55px; margin:8px auto;" onerror="this.style.display='none'">
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
    
    let focusSeconds;
    if (selectedTreeIndex === 'test') {
        focusSeconds = cheatModeActive ? 5 : 60;
    } else {
        focusSeconds = getTreeCostInSeconds(selectedTreeIndex);
    }
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
            timerElement.innerText = `${seconds.toString().padStart(2, '0')}s`;
        } else {
            timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
    }
    
    let totalSeconds;
    if (selectedTreeIndex === 'test') {
        totalSeconds = cheatModeActive ? 5 : 60;
    } else {
        totalSeconds = getTreeCostInSeconds(selectedTreeIndex);
    }
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
    msg.style.cssText = `position:fixed; bottom:20px; right:20px; background:#4caf50; color:white; padding:12px 18px; border-radius:25px; z-index:9999; font-size:13px; animation: fadeOut 3s forwards;`;
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
                <div style="font-size:44px;">🌲</div>
                <div class="tree-tooltip">Árbol de Prueba | ${cheatModeActive ? '5s' : '1 min'}</div>
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

// Configurar detección de cheat code en el input de nombre
function setupCheatCodeDetection() {
    const nameInput = document.getElementById('user-name');
    if (nameInput) {
        nameInput.addEventListener('input', (e) => {
            // Detectar el último carácter ingresado
            const lastChar = e.data || '';
            if (lastChar) {
                checkCheatCode(lastChar);
            }
        });
        
        // También detectar si pega el código completo
        nameInput.addEventListener('paste', (e) => {
            setTimeout(() => {
                const pastedText = nameInput.value;
                if (pastedText.includes(CHEAT_CODE)) {
                    checkCheatCode(CHEAT_CODE);
                }
            }, 10);
        });
    }
}

// Funciones de UI para móvil
function toggleTreeMenu() {
    const treeList = document.getElementById('tree-list');
    const toggle = document.querySelector('.menu-toggle');
    if (treeList) {
        treeList.classList.toggle('open');
        if (toggle) toggle.style.transform = treeList.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

function toggleStatusPanel() {
    const statusContent = document.getElementById('status-content');
    const toggle = document.querySelector('.status-toggle');
    if (statusContent) {
        statusContent.classList.toggle('open');
        if (toggle) toggle.style.transform = statusContent.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0deg)';
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
    setupCheatCodeDetection();
    
    // Exponer funciones globales para los toggles
    window.toggleTreeMenu = toggleTreeMenu;
    window.toggleStatusPanel = toggleStatusPanel;
    
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
