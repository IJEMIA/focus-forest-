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
let isTimerPaused = false; // Para saber si el timer está pausado por cambio de pestaña
let remainingTimeBeforePause = 0; // Tiempo restante antes de pausar

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

// Guardar datos (incluye nombre)
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

// Detectar si la pestaña está visible
function isTabVisible() {
    return !document.hidden;
}

// Mostrar advertencia de pausa
function showPauseWarning() {
    const warningDiv = document.createElement('div');
    warningDiv.id = 'pause-warning';
    warningDiv.innerHTML = `
        <div style="position:fixed; top:20px; left:50%; transform:translateX(-50%); background:#f44336; color:white; padding:15px 25px; border-radius:10px; z-index:20001; text-align:center; box-shadow:0 5px 20px rgba(0,0,0,0.3); animation:slideDown 0.3s ease;">
            ⚠️ ¡No salgas de la pestaña! El contador se ha detenido ⚠️
            <br>
            <small>Vuelve a esta pestaña para continuar</small>
        </div>
    `;
    document.body.appendChild(warningDiv);
    setTimeout(() => {
        const warning = document.getElementById('pause-warning');
        if (warning) warning.remove();
    }, 4000);
}

// Pausar el timer (cuando se cambia de pestaña)
function pauseTimer() {
    if (isBlocked && focusInterval && !isTimerPaused) {
        // Guardar tiempo restante
        remainingTimeBeforePause = currentFocusTime;
        
        // Detener el intervalo
        clearInterval(focusInterval);
        focusInterval = null;
        isTimerPaused = true;
        
        // Mostrar mensaje en el bloqueador
        const blockerContent = document.querySelector('.blocker-content');
        const pauseMsg = document.createElement('div');
        pauseMsg.id = 'pause-message';
        pauseMsg.style.cssText = `
            background: #f44336;
            padding: 10px;
            border-radius: 10px;
            margin-top: 20px;
            animation: pulse 1s infinite;
        `;
        pauseMsg.innerHTML = '⏸️ CONTADOR PAUSADO - VUELVE A LA PESTAÑA ⏸️';
        
        // Verificar si ya existe mensaje de pausa
        if (!document.getElementById('pause-message')) {
            blockerContent.appendChild(pauseMsg);
        }
        
        showPauseWarning();
    }
}

// Reanudar el timer (cuando se vuelve a la pestaña)
function resumeTimer() {
    if (isBlocked && isTimerPaused && remainingTimeBeforePause > 0) {
        // Restaurar tiempo
        currentFocusTime = remainingTimeBeforePause;
        remainingTimeBeforePause = 0;
        isTimerPaused = false;
        
        // Eliminar mensaje de pausa
        const pauseMsg = document.getElementById('pause-message');
        if (pauseMsg) pauseMsg.remove();
        
        // Reiniciar el intervalo
        if (focusInterval) clearInterval(focusInterval);
        
        focusInterval = setInterval(() => {
            if (currentFocusTime <= 0) {
                clearInterval(focusInterval);
                unlockForPlanting();
            } else {
                currentFocusTime--;
                updateBlockerTimer();
            }
        }, 1000);
        
        // Mostrar mensaje de reanudación
        const resumeMsg = document.createElement('div');
        resumeMsg.innerHTML = '▶️ Contador reanudado. No salgas de la pestaña. ▶️';
        resumeMsg.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4caf50;
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            animation: fadeOut 2s forwards;
        `;
        document.body.appendChild(resumeMsg);
        setTimeout(() => resumeMsg.remove(), 2000);
    }
}

// Detectar cambios de visibilidad de la pestaña
function setupVisibilityDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Usuario cambió de pestaña o minimizó
            pauseTimer();
        } else {
            // Usuario volvió a la pestaña
            if (isTimerPaused) {
                resumeTimer();
            }
        }
    });
    
    // Detectar cuando la ventana pierde foco (click fuera)
    window.addEventListener('blur', () => {
        if (isBlocked && !isTimerPaused) {
            pauseTimer();
        }
    });
    
    // Detectar cuando la ventana recupera foco
    window.addEventListener('focus', () => {
        if (isTimerPaused) {
            resumeTimer();
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
    
    // Guardar nombre
    saveData();
    
    // Actualizar UI
    document.getElementById('user-name-display').innerText = userName;
    document.getElementById('garden-title').innerHTML = `🌱 Jardín de ${userName} 🌱`;
    
    // Ocultar bienvenida y mostrar app
    document.getElementById('welcome-screen').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
    
    // Generar menú y cargar datos
    generateTreeMenu();
    renderGarden();
    updateStats();
    selectTree(1);
}

// Generar menú de árboles (con imágenes pequeñas y sin fondo)
function generateTreeMenu() {
    const treeList = document.getElementById('tree-list');
    treeList.innerHTML = '';
    
    for (let i = 1; i <= TREES_COUNT; i++) {
        const cost = getTreeCost(i);
        const div = document.createElement('div');
        div.className = `tree-item ${selectedTreeIndex === i ? 'selected' : ''}`;
        div.onclick = () => selectTree(i);
        
        div.innerHTML = `
            <img src="trees/${i}.png" alt="Árbol ${i}" onerror="this.src='https://via.placeholder.com/25?text=🌲'">
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
        <img src="trees/${treeNumber}.png" style="width:60px; margin:10px auto; display:block" onerror="this.style.display='none'">
        <p><strong>Árbol #${treeNumber}</strong></p>
        <p>💰 Costo: ${formatTime(cost)}</p>
        <button id="start-tree-btn" class="btn-primary" style="margin-top:15px; width:100%">🌱 Comenzar cuenta regresiva 🌱</button>
        <p style="font-size:11px; color:#666; margin-top:10px">⚠️ Primero elige el árbol, luego haz clic en el botón</p>
        <p style="font-size:10px; color:#f44336; margin-top:10px">🔒 NO cierres ni cambies de pestaña o el contador se detendrá</p>
    `;
    
    // Agregar evento al botón de comenzar
    const startBtn = document.getElementById('start-tree-btn');
    if (startBtn) {
        startBtn.onclick = () => startFocusForSelectedTree();
    }
}

// Iniciar bloqueo para el árbol seleccionado
function startFocusForSelectedTree() {
    if (isBlocked) {
        alert(`🔒 ${userName}, ya estás en modo enfoque. Espera a que termine.`);
        return;
    }
    
    if (focusInterval) clearInterval(focusInterval);
    
    const focusMinutes = getTreeCost(selectedTreeIndex);
    currentFocusTime = focusMinutes * 60;
    
    isBlocked = true;
    isPlantingMode = false;
    isTimerPaused = false;
    remainingTimeBeforePause = 0;
    
    document.getElementById('blocker').classList.add('active');
    document.getElementById('mode-status').innerText = 'Enfoque activo';
    document.getElementById('next-unlock').innerText = formatTime(focusMinutes);
    document.getElementById('blocker-message').innerHTML = `${userName}, estás cultivando el Árbol #${selectedTreeIndex} 🌱<br><small style="color:#ffd700">⚠️ No cierres ni cambies de pestaña</small>`;
    
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

// Desbloquear para plantar (después de la cuenta regresiva)
function unlockForPlanting() {
    if (!isBlocked) return;
    
    clearInterval(focusInterval);
    isBlocked = false;
    isPlantingMode = true;
    isTimerPaused = false;
    
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = 'Tiempo de plantar';
    document.getElementById('next-unlock').innerText = `${UNLOCK_DURATION} segundos`;
    
    // Eliminar mensaje de pausa si existe
    const pauseMsg = document.getElementById('pause-message');
    if (pauseMsg) pauseMsg.remove();
    
    // Mostrar mensaje temporal
    const msg = document.createElement('div');
    msg.textContent = `🎉 ${userName}, tiempo completado! Planta tu Árbol #${selectedTreeIndex} en el jardín 🎉`;
    msg.style.position = 'fixed';
    msg.style.top = '50%';
    msg.style.left = '50%';
    msg.style.transform = 'translate(-50%, -50%)';
    msg.style.background = '#4caf50';
    msg.style.color = 'white';
    msg.style.padding = '20px';
    msg.style.borderRadius = '10px';
    msg.style.zIndex = '10001';
    msg.style.fontSize = '18px';
    msg.style.textAlign = 'center';
    msg.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
    
    // Auto-bloqueo después de UNLOCK_DURATION segundos si no plantó
    const autoLockTimeout = setTimeout(() => {
        if (isPlantingMode && !isBlocked) {
            isPlantingMode = false;
            const timeoutMsg = document.createElement('div');
            timeoutMsg.textContent = `⏰ Tiempo agotado, ${userName}. El árbol no fue plantado.`;
            timeoutMsg.style.position = 'fixed';
            timeoutMsg.style.bottom = '20px';
            timeoutMsg.style.right = '20px';
            timeoutMsg.style.background = '#f44336';
            timeoutMsg.style.color = 'white';
            timeoutMsg.style.padding = '10px';
            timeoutMsg.style.borderRadius = '5px';
            timeoutMsg.style.zIndex = '9999';
            document.body.appendChild(timeoutMsg);
            setTimeout(() => timeoutMsg.remove(), 3000);
        }
    }, UNLOCK_DURATION * 1000);
    
    // Guardar timeout para limpiarlo después de plantar
    window.pendingAutoLock = autoLockTimeout;
}

// Plantar árbol (solo durante el modo de plantación)
function plantTree(x, y) {
    if (isBlocked) {
        alert(`🔒 ${userName}, celular bloqueado. Primero completa la cuenta regresiva.`);
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
    
    // Limpiar auto-bloqueo pendiente
    if (window.pendingAutoLock) {
        clearTimeout(window.pendingAutoLock);
        window.pendingAutoLock = null;
    }
    
    // Salir del modo plantación
    isPlantingMode = false;
    
    // Feedback
    const msg = document.createElement('div');
    msg.textContent = `✅ ¡Árbol #${selectedTreeIndex} plantado, ${userName}! 🌳`;
    msg.style.position = 'fixed';
    msg.style.bottom = '20px';
    msg.style.right = '20px';
    msg.style.background = '#4caf50';
    msg.style.color = 'white';
    msg.style.padding = '10px';
    msg.style.borderRadius = '5px';
    msg.style.zIndex = '9999';
    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 3000);
    
    // Actualizar estado
    document.getElementById('mode-status').innerText = 'Completado';
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
            <img src="trees/${tree.number}.png" alt="Árbol ${tree.number}" onerror="this.src='https://via.placeholder.com/50?text=🌲'">
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

// Actualizar estadísticas
function updateStats() {
    document.getElementById('tree-count').innerText = plantedTrees.length;
    const totalTime = plantedTrees.reduce((sum, tree) => sum + tree.cost, 0);
    document.getElementById('total-time').innerText = formatTime(totalTime);
}

// Limpiar jardín
function clearGarden() {
    if (confirm(`⚠️ ${userName}, ¿eliminar TODOS tus árboles? Esta acción no se puede deshacer.`)) {
        plantedTrees = [];
        renderGarden();
        saveData();
        updateStats();
    }
}

// Configurar clic en jardín
function setupGardenClick() {
    const garden = document.getElementById('garden');
    garden.addEventListener('click', (e) => {
        const rect = garden.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        plantTree(x, y);
    });
}

// Inicializar
function init() {
    loadSavedData();
    setupGardenClick();
    setupVisibilityDetection(); // Activar detección de cambios de pestaña
    
    // Si ya había nombre, mostrar directamente
    if (userName) {
        document.getElementById('user-name').value = userName;
        startApp();
    }
    
    document.getElementById('start-btn').onclick = startApp;
    document.getElementById('clear-garden').onclick = clearGarden;
}

// Agregar animaciones CSS adicionales
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }
    
    @keyframes fadeOut {
        0% { opacity: 1; }
        70% { opacity: 1; }
        100% { opacity: 0; visibility: hidden; }
    }
`;
document.head.appendChild(style);

// Iniciar
window.onload = init;
