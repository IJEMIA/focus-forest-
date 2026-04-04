// Configuración
const TREES_COUNT = 15; // 1 a 15
const UNLOCK_DURATION = 30; // 30 segundos para plantar
let currentFocusTime = 0;
let focusInterval = null;
let isBlocked = false;
let selectedTreeIndex = 1;
let plantedTrees = [];
let userName = "";

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
            <img src="trees/${i}.png" alt="Árbol ${i}" onerror="this.src='https://via.placeholder.com/50?text=Tree${i}'">
            <div class="tree-info">
                <div class="tree-name">🌲 Árbol #${i}</div>
                <div class="tree-cost">💰 Costo: ${formatTime(cost)}</div>
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
        <img src="trees/${treeNumber}.png" style="width:80px; margin:10px 0" onerror="this.style.display='none'">
        <p><strong>Árbol #${treeNumber}</strong></p>
        <p>💰 Costo: ${formatTime(cost)}</p>
        <p style="font-size:12px; color:#666">Haz clic en el jardín para plantar</p>
        <p style="font-size:11px; color:#4caf50; margin-top:10px">⏱️ Bloqueo: ${formatTime(cost)}</p>
    `;
}

// Iniciar bloqueo
function startFocus() {
    if (focusInterval) clearInterval(focusInterval);
    if (isBlocked) return;
    
    const focusMinutes = getTreeCost(selectedTreeIndex);
    currentFocusTime = focusMinutes * 60;
    
    isBlocked = true;
    document.getElementById('blocker').classList.add('active');
    document.getElementById('mode-status').innerText = 'Bloqueado';
    document.getElementById('next-unlock').innerText = formatTime(focusMinutes);
    document.getElementById('blocker-message').innerHTML = `${userName}, estás cultivando tu concentración 🌱`;
    
    updateBlockerTimer();
    
    focusInterval = setInterval(() => {
        if (currentFocusTime <= 0) {
            clearInterval(focusInterval);
            unlockPhone();
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

// Desbloquear celular
function unlockPhone() {
    if (!isBlocked) return;
    
    clearInterval(focusInterval);
    isBlocked = false;
    document.getElementById('blocker').classList.remove('active');
    document.getElementById('mode-status').innerText = 'Libre (plantando)';
    document.getElementById('next-unlock').innerText = 'Ahora';
    
    // Auto-bloqueo después de UNLOCK_DURATION segundos
    setTimeout(() => {
        if (!isBlocked) {
            startFocus();
        }
    }, UNLOCK_DURATION * 1000);
}

// Plantar árbol
function plantTree(x, y) {
    if (isBlocked) {
        alert(`🔒 ${userName}, el celular está bloqueado. Espera a que termine el tiempo de enfoque.`);
        return;
    }
    
    const costMinutes = getTreeCost(selectedTreeIndex);
    
    const confirmed = confirm(`🌱 ${userName}, ¿plantar árbol #${selectedTreeIndex}?\n\n💰 Costo: ${formatTime(costMinutes)} de enfoque\n⏱️ Bloqueará tu celular por ${formatTime(costMinutes)}\n\n¿Confirmas?`);
    
    if (confirmed) {
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
        
        // Iniciar bloqueo
        startFocus();
        
        // Feedback personalizado
        const msg = document.createElement('div');
        msg.textContent = `✅ ${userName}, plantaste árbol #${selectedTreeIndex}! Bloqueo por ${formatTime(costMinutes)} activado`;
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
    }
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
            <img src="trees/${tree.number}.png" alt="Árbol ${tree.number}" onerror="this.src='https://via.placeholder.com/60?text=🌲'">
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
    
    // Si ya había nombre, mostrar directamente
    if (userName) {
        document.getElementById('user-name').value = userName;
        startApp();
    }
    
    document.getElementById('start-btn').onclick = startApp;
    document.getElementById('clear-garden').onclick = clearGarden;
}

// Iniciar
window.onload = init;
