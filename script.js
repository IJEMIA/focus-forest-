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
let isPausedForAuth = false;
let pausedRemainingTime = 0;

// Elemento de audio
let alarmAudio = null;

// Inicializar audio
function initAudio() {
    try {
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
        }
    } catch(e) {
        console.log("Error reproduciendo alarma");
    }
}

// ============ AUTENTICACIÓN BIOMÉTRICA ============
function supportsBiometricAuth() {
    return window.PublicKeyCredential && 
           PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable &&
           window.PasswordCredential;
}

async function authenticateUser() {
    return new Promise((resolve) => {
        const authModal = document.createElement('div');
        authModal.id = 'auth-modal';
        authModal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.95);
            backdrop-filter: blur(20px);
            z-index: 30000;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            animation: fadeIn 0.3s ease;
        `;
        
        authModal.innerHTML = `
            <div style="background: white; border-radius: 32px; padding: 32px; text-align: center; max-width: 320px; width: 90%;">
                <div style="font-size: 48px; margin-bottom: 16px;">🔐</div>
                <h2 style="margin-bottom: 8px;">Verificar identidad</h2>
                <p style="color: #666; margin-bottom: 24px;">${userName || 'Usuario'}, confirma que eres tú</p>
                <div id="auth-options" style="display: flex; flex-direction: column; gap: 12px;">
                    <button id="biometric-btn" class="btn-primary" style="padding: 14px; border-radius: 14px;">🔓 Huella / Face ID</button>
                    <button id="pin-btn" class="btn-secondary" style="padding: 14px; border-radius: 14px; background: #666;">🔢 Código PIN</button>
                    <button id="cancel-auth" style="background: none; border: none; color: #999; margin-top: 12px;">Cancelar</button>
                </div>
                <div id="pin-input-container" style="display: none; margin-top: 20px;">
                    <input type="password" id="pin-input" maxlength="4" placeholder="PIN de 4 dígitos" style="width: 100%; padding: 14px; border-radius: 14px; border: 1px solid #ddd; text-align: center; font-size: 20px; letter-spacing: 5px;">
                    <button id="verify-pin-btn" class="btn-primary" style="margin-top: 12px; width: 100%;">Verificar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(authModal);
        
        const biometricBtn = document.getElementById('biometric-btn');
        const pinBtn = document.getElementById('pin-btn');
        const cancelBtn = document.getElementById('cancel-auth');
        const pinContainer = document.getElementById('pin-input-container');
        const pinInput = document.getElementById('pin-input');
        const verifyPinBtn = document.getElementById('verify-pin-btn');
        
        const CORRECT_PIN = "1234";
        
        biometricBtn.onclick = async () => {
            try {
                alert("🔓 (SIMULACIÓN) Autenticación biométrica exitosa");
                authModal.remove();
                resolve(true);
            } catch(e) {
                alert("❌ Autenticación fallida");
                resolve(false);
            }
        };
        
        pinBtn.onclick = () => {
            pinContainer.style.display = 'block';
            pinInput.focus();
        };
        
        verifyPinBtn.onclick = () => {
            if (pinInput.value === CORRECT_PIN) {
                authModal.remove();
                resolve(true);
            } else {
                alert("❌ PIN incorrecto");
                pinInput.value = "";
                resolve(false);
            }
        };
        
        cancelBtn.onclick = () => {
            authModal.remove();
            resolve(false);
        };
        
        pinInput.onkeyup = (e) => {
            if (e.key === 'Enter' && pinInput.value.length === 4) {
                verifyPinBtn.click();
            }
        };
    });
}

function showViewCounterButton() {
    let viewBtn = document.getElementById('view-counter-btn');
    if (!viewBtn && isBlocked) {
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
            font-size: 14px;
            transition: all 0.3s;
        `;
        btn.onclick = async () => {
            if (focusInterval && !isPausedForAuth) {
                clearInterval(focusInterval);
                focusInterval = null;
                isPausedForAuth = true;
                pausedRemainingTime = currentFocusTime;
            }
            
            const authenticated = await authenticateUser();
            
            if (authenticated) {
                showTemporaryCounter();
            } else {
                alert("🔒 Autenticación fallida. El contador continúa.");
            }
            
            if (isPausedForAuth && isBlocked) {
                currentFocusTime = pausedRemainingTime;
                isPausedForAuth = false;
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
        };
        document.body.appendChild(btn);
    }
}

function hideViewCounterButton() {
    const btn = document.getElementById('view-counter-btn');
    if (btn) btn.remove();
}

function showTemporaryCounter() {
    const tempModal = document.createElement('div');
    tempModal.id = 'temp-counter-modal';
    tempModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.95);
        backdrop-filter: blur(20px);
        z-index: 30001;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        animation: fadeIn 0.3s ease;
    `;
    
    const minutes = Math.floor(currentFocusTime / 60);
    const seconds = currentFocusTime % 60;
    
    tempModal.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 72px; margin-bottom: 20px;">⏱️</div>
            <div style="font-size: 64px; font-weight: bold; font-family: monospace; letter-spacing: 5px; margin-bottom: 20px;">${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}</div>
            <p style="color: #ffd700; margin-bottom: 30px;">Tiempo restante de enfoque</p>
            <p style="font-size: 12px; color: #999;">Esta ventana se cerrará automáticamente</p>
        </div>
    `;
    
    document.body.appendChild(tempModal);
    
    setTimeout(() => {
        tempModal.remove();
    }, 10000);
    
    tempModal.onclick = () => tempModal.remove();
}

// ============ ÁRBOL DE PRUEBA ============
function plantTestTree(x, y) {
    const testTree = {
        id: Date.now(),
        number: 'test',
        cost: 1,
        x: x,
        y: y,
        isTest: true,
        plantedAt: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000)
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
            
            const msg = document.createElement('div');
            msg.textContent = `🌲 El árbol de prueba ha desaparecido (expiró después de 5 minutos)`;
            msg.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: #ff9800;
                color: white;
                padding: 10px 15px;
                border-radius: 20px;
                z-index: 9999;
                font-size: 12px;
            `;
            document.body.appendChild(msg);
            setTimeout(() => msg.remove(), 3000);
        }
    }, 5 * 60 * 1000);
    
    const msg = document.createElement('div');
    msg.textContent = `🌱 Árbol de prueba plantado! (1 min de enfoque, desaparece en 5 min)`;
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
}

function getTreeCost(treeNumber) {
    if (treeNumber === 'test') return 1;
    return treeNumber * 15;
}

function formatTime(minutes) {
    if (minutes === 1) return `1 min`;
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (mins === 0) return `${hours} hora${hours > 1 ? 's' : ''}`;
    return `${hours}h ${mins}min`;
}

function saveData() {
    localStorage.setItem('focusForest', JSON.stringify({
        userName: userName,
        plantedTrees: plantedTrees.filter(t => !t.isTest)
    }));
}

function loadSavedData() {
    const saved = localStorage.getItem('focusForest');
    if (saved) {
        const data = JSON.parse(saved);
        if (data.userName) {
            userName = data.userName;
            const nameInput = document.getElementById('user-name');
            if (nameInput) nameInput.value = userName;
        }
        plantedTrees = data.plantedTrees || [];
        renderGarden();
        updateStats();
    }
}

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
    
    const blocker = document.getElementById('blocker');
    if (blocker) blocker.classList.remove('active');
    
    const modeStatus = document.getElementById('mode-status');
    if (modeStatus) modeStatus.innerText = 'Reiniciado';
    
    const nextUnlock = document.getElementById('next-unlock');
    if (nextUnlock) nextUnlock.innerText = 'Vuelve a empezar';
    
    hideViewCounterButton();
}

function setupStrictDetection() {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isBlocked && !isPausedForAuth) resetCounter('📱 Cambiaste de pestaña');
    });
    window.addEventListener('blur', () => {
        if (isBlocked && !isPausedForAuth) resetCounter('🪟 Saliste de la ventana');
    });
    document.addEventListener('keydown', (e) => {
        if (isBlocked && !isPausedForAuth) {
            e.preventDefault();
            resetCounter(`⌨️ Tecla presionada: ${e.key}`);
        }
    });
    window.addEventListener('scroll', () => {
        if (isBlocked && !isPausedForAuth) resetCounter('📜 Scroll detectado');
    });
    document.addEventListener('contextmenu', (e) => {
        if (isBlocked && !isPausedForAuth) {
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
    
    const userNameDisplay = document.getElementById('user-name-display');
    if (userNameDisplay) userNameDisplay.innerText = userName;
    
    const gardenTitle = document.getElementById('garden-title');
    if (gardenTitle) gardenTitle.innerHTML = `🌱 Jardín de ${userName}`;
    
    const welcomeScreen = document.getElementById('welcome-screen');
    if (welcomeScreen) welcomeScreen.style.display = 'none';
    
    const mainApp = document.getElementById('main-app');
    if (mainApp) mainApp.style.display = 'block';
    
    generateTreeMenu();
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
    testDiv.innerHTML = `
        <div style="width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; font-size: 32px;">🌲</div>
        <div class="tree-info">
            <div class="tree-name">🌲 Árbol de Prueba</div>
            <div class="tree-cost">💰 1 min (desaparece en 5 min)</div>
        </div>
    `;
    treeList.appendChild(testDiv);
    
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
    
    const selectedDisplay = document.getElementById('selected-display');
    if (!selectedDisplay) return;
    
    if (treeNumber === 'test') {
        selectedDisplay.innerHTML = `
            <div style="font-size: 48px; margin: 10px auto;">🌲</div>
            <p style="font-weight: 600; margin: 12px 0;">Árbol de Prueba</p>
            <p style="color: #ff6f00; font-weight: 500;">💰 1 minuto de enfoque</p>
            <p style="color: #666; font-size: 12px;">⚠️ Desaparece después de 5 minutos</p>
            <button id="start-tree-btn" class="btn-primary" style="margin-top: 20px; width: 100%;">🌱 Comenzar</button>
        `;
    } else {
        const cost = getTreeCost(treeNumber);
        selectedDisplay.innerHTML = `
            <img src="trees/${treeNumber}.png" alt="Árbol ${treeNumber}" onerror="this.style.display='none'">
            <p style="font-weight: 600; margin: 12px 0;">Árbol #${treeNumber}</p>
            <p style="color: #ff6f00; font-weight: 500;">💰 ${formatTime(cost)}</p>
            <button id="start-tree-btn" class="btn-primary" style="margin-top: 20px; width: 100%;">🌱 Comenzar</button>
        `;
    }
    
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
    
    let focusMinutes;
    if (selectedTreeIndex === 'test') {
        focusMinutes = 1;
    } else {
        focusMinutes = getTreeCost(selectedTreeIndex);
    }
    currentFocusTime = focusMinutes * 60;
    
    isBlocked = true;
    isPlantingMode = false;
    violationCount = 0;
    
    const blocker = document.getElementById('blocker');
    if (blocker) blocker.classList.add('active');
    
    const modeStatus = document.getElementById('mode-status');
    if (modeStatus) modeStatus.innerText = '🔴 ENFOQUE';
    
    const nextUnlock = document.getElementById('next-unlock');
    if (nextUnlock) nextUnlock.innerText = formatTime(focusMinutes);
    
    const blockerMessage = document.getElementById('blocker-message');
    if (blockerMessage) {
        if (selectedTreeIndex === 'test') {
            blockerMessage.innerHTML = `${userName}, cultivando Árbol de Prueba 🌲 (1 minuto)`;
        } else {
            blockerMessage.innerHTML = `${userName}, cultivando Árbol #${selectedTreeIndex}`;
        }
    }
    
    updateBlockerTimer();
    showViewCounterButton();
    
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
    
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    let totalSeconds;
    if (selectedTreeIndex === 'test') {
        totalSeconds = 60;
    } else {
        totalSeconds = getTreeCost(selectedTreeIndex) * 60;
    }
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
    
    hideViewCounterButton();
    playAlarm();
    
    const blocker = document.getElementById('blocker');
    if (blocker) blocker.classList.remove('active');
    
    const modeStatus = document.getElementById('mode-status');
    if (modeStatus) modeStatus.innerText = '🟢 PLANTAR';
    
    const nextUnlock = document.getElementById('next-unlock');
    if (nextUnlock) nextUnlock.innerText = `${Math.floor(UNLOCK_DURATION / 60)} minutos`;
    
    const msg = document.createElement('div');
    if (selectedTreeIndex === 'test') {
        msg.innerHTML = `
            <div style="font-size: 48px;">🌲</div>
            <h2>¡Tiempo completado!</h2>
            <p>Tienes 5 minutos para plantar tu Árbol de Prueba</p>
            <p style="font-size: 14px; color: #4caf50; margin-top: 12px;">🌳 Desaparecerá en 5 minutos</p>
        `;
    } else {
        msg.innerHTML = `
            <div style="font-size: 48px;">🎉</div>
            <h2>¡Tiempo completado!</h2>
            <p>Tienes 5 minutos para plantar tu árbol</p>
            <p style="font-size: 14px; color: #4caf50; margin-top: 12px;">🌳 Árbol #${selectedTreeIndex}</p>
        `;
    }
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
    }
    
    if (window.pendingAutoLock) {
        clearTimeout(window.pendingAutoLock);
        window.pendingAutoLock = null;
    }
    
    isPlantingMode = false;
    
    const modeStatus = document.getElementById('mode-status');
    if (modeStatus) modeStatus.innerText = '✅ Completado';
    
    const nextUnlock = document.getElementById('next-unlock');
    if (nextUnlock) nextUnlock.innerText = 'Elige otro';
}

function renderGarden() {
    const garden = document.getElementById('garden');
    if (!garden) return;
    garden.innerHTML = '';
    
    plantedTrees.forEach((tree, idx) => {
        const treeDiv = document.createElement('div');
        treeDiv.className = 'tree-planted';
        treeDiv.style.position = 'absolute';
        treeDiv.style.left = `${tree.x || (idx * 70 % 800)}px`;
        treeDiv.style.top = `${tree.y || (Math.floor(idx / 12) * 70)}px`;
        
        if (tree.isTest) {
            treeDiv.innerHTML = `
                <div style="font-size: 48px;">🌲</div>
                <div class="tree-tooltip">
                    Árbol de Prueba | 1 min | Expira: ${new Date(tree.expiresAt).toLocaleTimeString()}
                </div>
            `;
        } else {
            treeDiv.innerHTML = `
                <img src="trees/${tree.number}.png" alt="Árbol ${tree.number}" style="width:55px; height:55px; object-fit:contain" onerror="this.src='https://via.placeholder.com/55?text=🌲'">
                <div class="tree-tooltip">
                    Árbol #${tree.number} | ${formatTime(tree.cost)}
                </div>
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
    if (!garden) return;
    garden.addEventListener('click', (e) => {
        const rect = garden.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        plantTree(x, y);
    });
}

function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes shake {
            0%, 100% { transform: translate(-50%, -50%) translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-50%, -50%) translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translate(-50%, -50%) translateX(10px); }
        }
        @keyframes bounce {
            0%, 100% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.05); }
        }
        @keyframes fadeOut {
            0% { opacity: 1; }
            70% { opacity: 1; }
            100% { opacity: 0; visibility: hidden; }
        }
        .btn-secondary {
            background: #666;
            color: white;
            border: none;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-secondary:hover {
            background: #555;
            transform: scale(1.02);
        }
    `;
    document.head.appendChild(style);
}

function init() {
    loadSavedData();
    setupGardenClick();
    setupStrictDetection();
    addAnimations();
    initAudio();
    
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
