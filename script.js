// Configuración
const TREES_COUNT = 15; // 1 a 15
const UNLOCK_DURATION = 30; // 30 segundos para plantar
let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedTreeIndex = 1;
let plantedTrees = [];
let userName = "";
let isPlantingMode = false;
let violationCount = 0;

// Calcular costo: árbol 1 = 15min, 2 = 30min, 3 = 45min... 15 = 225min
function getTreeCost(treeNumber) {
    return treeNumber * 15;
}

// Formatear minutos a horas y minutos
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

// Cargar datos guardados
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

// REINICIAR CONTADOR (solo si está activo)
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
        background: #f44336;
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 20002;
        text-align: center;
        box-shadow: 0 5px 30px rgba(0,0,0,0.5);
        animation: shake 0.5s ease;
        min-width: 300px;
    `;
    violationMsg.innerHTML = `
        <h2>⚠️ INFACCIÓN ⚠️</h2>
        <p>${reason}</p>
        <p>Llevabas ${formatTime(elapsedMinutes)} de enfoque</p>
        <p>❌ El contador se ha REINICIADO ❌</p>
        <p>Infracción #${violationCount}</p>
        <small>Vuelve a comenzar la cuenta regresiva</small>
    `;
    document.body.appendChild(violationMsg);
    
    setTimeout(() => violationMsg.remove(), 4000);
    
    isBlocked = false;
    isPlantingMode = false;
    currentFocusTime = 0;
    
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = 'Reiniciado por infracción';
    document.getElementById('next-unlock').innerText = 'Vuelve a empezar';
    
    const footerMsg = document.createElement('div');
    footerMsg.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 20px;
        right: 20px;
        background: #ff9800;
        color: white;
        padding: 10px;
        border-radius: 5px;
        text-align: center;
        z-index: 9999;
        animation: fadeOut 3s forwards;
    `;
    footerMsg.textContent = `❌ ${userName}, no puedes salir del contador. Reinicia desde cero el Árbol #${selectedTreeIndex}. Infracción #${violationCount}`;
    document.body.appendChild(footerMsg);
    setTimeout(() => footerMsg.remove(), 3000);
}

// Detectar cambios SOLO cuando el contador está activo
function setupStrictDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isBlocked) {
            resetCounter('📱 Cambiaste de pestaña o aplicación');
        }
    });
    
    window.addEventListener('blur', () => {
        if (isBlocked) {
            resetCounter('🪟 Saliste de la ventana del navegador');
        }
    });
    
    document.addEventListener('click', (e) => {
        if (isBlocked) {
            const blocker = document.getElementById('blocker');
            const isClickInsideBlocker = blocker && blocker.contains(e.target);
            if (!isClickInsideBlocker) {
                resetCounter('👆 Tocaste fuera del contador de enfoque');
            }
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (isBlocked) {
            if (e.key === 'F5' || e.key === 'F12' || 
                (e.ctrlKey && e.key === 'r') ||
                (e.ctrlKey && e.key === 'R')) {
                e.preventDefault();
            }
            resetCounter(`⌨️ Presionaste la tecla: ${e.key}`);
        }
    });
    
    document.addEventListener('touchstart', (e) => {
        if (isBlocked) {
            const blocker = document.getElementById('blocker');
            const isTouchInsideBlocker = blocker && blocker.contains(e.target);
            if (!isTouchInsideBlocker) {
                resetCounter('👉 Tocaste fuera de la pantalla de enfoque');
            }
        }
    });
    
    window.addEventListener('scroll', () => {
        if (isBlocked) {
            resetCounter('📜 Intentaste hacer scroll fuera del contador');
        }
    });
    
    window.addEventListener('resize', () => {
        if (isBlocked) {
            resetCounter('🖥️ Cambiaste el tamaño de la ventana');
        }
    });
    
    document.addEventListener('contextmenu', (e) => {
        if (isBlocked) {
            e.preventDefault();
            resetCounter('🛠️ Intentaste abrir el menú contextual');
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (isBlocked) {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'u') ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                resetCounter('🔧 Intentaste abrir herramientas de desarrollador');
            }
        }
    });
}

// Iniciar aplicación después del nombre
function startApp() {
    userName = document.getElementById('user-name').value.trim();
    if (userName === "") {
        alert("Por favor, ingresa tu nombre");
        return;
    }
    
    saveData();
    
    document.getElementById('user-name-display').innerText = userName;
    document.getElementById('garden-title').innerHTML = `🌱 Jardín de ${userName} 🌱`;
    
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    generateTreeMenu();
    renderGarden();
    updateStats();
    selectTree(1);
}

// Generar menú de árboles
function generateTreeMenu() {
    const treeList = document.getElementById('tree-list');
    treeList.innerHTML = '';
    
    for (let i = 1; i <= TREES_COUNT; i++) {
        const cost = getTreeCost(i);
        const div = document.createElement('div');
        div.className = `tree-item ${selectedTreeIndex === i ? 'selected' : ''}`;
        div.onclick = () => selectTree(i);
        
        div.innerHTML = `
            <img src="trees/${i}.png" alt="Árbol ${i}" onerror="this.src='https://via.placeholder.com/30?text=🌲'">
            <div class="tree-info">
                <div class="tree-name">🌲 Árbol #${i}</div>
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
    const cost = getTreeCost(treeNumber);
    document.getElementById('selected-display').innerHTML = `
        <img src="trees/${treeNumber}.png" alt="Árbol ${treeNumber}" onerror="this.style.display='none'">
        <p><strong>Árbol #${treeNumber}</strong></p>
        <p>💰 Costo: ${formatTime(cost)}</p>
        <button id="start-tree-btn" class="btn-primary" style="margin-top:15px; width:100%">🌱 Comenzar cuenta regresiva 🌱</button>
        <p style="font-size:11px; color:#666; margin-top:10px">✅ 1. Elige un árbol</p>
        <p style="font-size:11px; color:#666">✅ 2. Haz clic en "Comenzar cuenta regresiva"</p>
        <p style="font-size:10px; color:#f44336; margin-top:10px">🔒 Durante el contador NO hagas NADA fuera de esta pantalla</p>
    `;
    
    const startBtn = document.getElementById('start-tree-btn');
    if (startBtn) {
        const newStartBtn = startBtn.cloneNode(true);
        startBtn.parentNode.replaceChild(newStartBtn, startBtn);
        newStartBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            startFocusForSelectedTree();
        };
    }
}

// Iniciar bloqueo para el árbol seleccionado
function startFocusForSelectedTree() {
    if (isBlocked) {
        alert(`🔒 ${userName}, ya estás en modo enfoque. Termina o reinicia.`);
        return;
    }
    
    if (focusInterval) clearInterval(focusInterval);
    
    const focusMinutes = getTreeCost(selectedTreeIndex);
    currentFocusTime = focusMinutes * 60;
    
    isBlocked = true;
    isPlantingMode = false;
    violationCount = 0;
    
    document.getElementById('blocker').classList.add('active');
    document.getElementById('mode-status').innerText = '🔴 ENFOQUE ACTIVO';
    document.getElementById('next-unlock').innerText = formatTime(focusMinutes);
    document.getElementById('blocker-message').innerHTML = `
        ${userName}, estás cultivando el Árbol #${selectedTreeIndex} 🌱<br>
        <small style="color:#ffd700">⚠️ NO toques NADA fuera de esta pantalla o se REINICIARÁ ⚠️</small>
        <br>
        <small style="color:#ff9800">Queda terminantemente prohibido salir de esta pantalla</small>
    `;
    
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

// Actualizar timer del bloqueador
function updateBlockerTimer() {
    const minutes = Math.floor(currentFocusTime / 60);
    const seconds = currentFocusTime % 60;
    document.getElementById('timer').innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    const totalSeconds = getTreeCost(selectedTreeIndex) * 60;
    const progress = ((totalSeconds - currentFocusTime) / totalSeconds) * 100;
    document.getElementById('progress-fill').style.width = `${Math.min(100, Math.max(0, progress))}%`;
}

// Desbloquear para plantar
function unlockForPlanting() {
    if (!isBlocked) return;
    
    clearInterval(focusInterval);
    isBlocked = false;
    isPlantingMode = true;
    
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = '🟢 TIEMPO DE PLANTAR';
    document.getElementById('next-unlock').innerText = `${UNLOCK_DURATION} segundos`;
    
    const msg = document.createElement('div');
    msg.textContent = `🎉 ${userName}, ¡COMPLETASTE EL ENFOQUE! Planta tu Árbol #${selectedTreeIndex} 🎉`;
    msg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #4caf50;
        color: white;
        padding: 20px;
        border-radius: 10px;
        z-index: 10001;
        font-size: 18px;
        text-align: center;
        box-shadow: 0 5px 20px rgba(0,0,0,0.3);
        animation: bounce 0.5s ease;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
    
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
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
            `;
            document.body.appendChild(timeoutMsg);
            setTimeout(() => timeoutMsg.remove(), 3000);
        }
    }, UNLOCK_DURATION * 1000);
    
    window.pendingAutoLock = autoLockTimeout;
}

// Plantar árbol
function plantTree(x, y) {
    if (isBlocked) {
        alert(`🔒 ${userName}, celular bloqueado. Completa la cuenta regresiva primero.`);
        return;
    }
    
    if (!isPlantingMode) {
        alert(`🌱 ${userName}, primero elige un árbol y haz clic en "Comenzar cuenta regresiva".`);
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
    msg.textContent = `✅ ¡Árbol #${selectedTreeIndex} plantado, ${userName}! 🌳 Sin infracciones!`;
    msg.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #4caf50;
        color: white;
        padding: 10px;
        border-radius: 5px;
        z-index: 9999;
        animation: fadeOut 3s forwards;
    `;
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
    
    document.getElementById('mode-status').innerText = '✅ Completado';
    document.getElementById('next-unlock').innerText = 'Elige otro árbol';
}

// Renderizar jardín
function renderGarden() {
    const garden = document.getElementById('garden');
    garden.innerHTML = '';
    
    plantedTrees.forEach((tree, idx) => {
        const treeDiv = document.createElement('div');
        treeDiv.className = 'tree-planted';
        treeDiv.style.position = 'absolute';
        treeDiv.style.left = `${tree.x || (idx * 70 % 800)}px`;
        treeDiv.style.top = `${tree.y || (Math.floor(idx / 12) * 70)}px`;
        
        treeDiv.innerHTML = `
            <img src="trees/${tree.number}.png" alt="Árbol ${tree.number}" onerror="this.src='https://via.placeholder.com/55?text=🌲'">
            <div class="tree-tooltip">
                Árbol #${tree.number} | ${formatTime(tree.cost)}
            </div>
        `;
        
        treeDiv.onclick = (e) => {
            e.stopPropagation();
            if (confirm(`${userName}, ¿eliminar este árbol #${tree.number}?`)) {
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
    document.getElementById('tree-count').innerText = plantedTrees.length;
    const totalTime = plantedTrees.reduce((sum, tree) => sum + tree.cost, 0);
    document.getElementById('total-time').innerText = formatTime(totalTime);
}

function clearGarden() {
    if (confirm(`⚠️ ${userName}, ¿eliminar TODOS tus árboles?`)) {
        plantedTrees = [];
        renderGarden();
        saveData();
        updateStats();
    }
}

function setupGardenClick() {
    const garden = document.getElementById('garden');
    garden.addEventListener('click', (e) => {
        const rect = garden.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        plantTree(x, y);
    });
}

// Agregar animaciones
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translate(-50%, -50%) translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-50%, -50%) translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translate(-50%, -50%) translateX(10px); }
        }
        
        @keyframes bounce {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
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
    loadSavedData();
    setupGardenClick();
    setupStrictDetection();
    addAnimations();
    
    if (userName) {
        document.getElementById('user-name').value = userName;
        startApp();
    }
    
    document.getElementById('start-btn').onclick = startApp;
    document.getElementById('clear-garden').onclick = clearGarden;
}

window.onload = init;
