(function() {
    'use strict';

    // --- CONFIGURACIÓN ---
    const CONFIG = {
        UNLOCK_DURATION: 1800,
        CELL_SIZE: 20,
        ANIMAL_MOVE_INTERVAL: 3000,
        CHEAT_CODE: "409070110", // Código secreto
        STORAGE_KEY: 'focusForestFinalV1' // Nueva clave para limpieza automática
    };

    // --- DATOS ---
    const TREES = [
        { id: 't1', name: "🌱 Brote", rarity: "Común", cost: 2, emoji: "🌱" },
        { id: 't2', name: "🌲 Pino", rarity: "Común", cost: 5, emoji: "🌲" },
        { id: 't3', name: "🌳 Roble", rarity: "Común", cost: 10, emoji: "🌳" },
        { id: 't4', name: "🌴 Palmera", rarity: "Común", cost: 15, emoji: "🌴" },
        { id: 't5', name: "🍁 Arce", rarity: "Común", cost: 20, emoji: "🍁" },
        { id: 't6', name: "🎄 Abeto", rarity: "Común", cost: 25, emoji: "🎄" },
        { id: 't7', name: "🌵 Cactus", rarity: "Común", cost: 30, emoji: "🌵" },
        { id: 't8', name: "🌸 Cerezo", rarity: "Raro", cost: 40, emoji: "🌸" },
        { id: 't9', name: "🌺 Hibisco", rarity: "Raro", cost: 50, emoji: "🌺" },
        { id: 't10', name: "🌻 Girasol", rarity: "Raro", cost: 60, emoji: "🌻" },
        { id: 't11', name: "🍊 Naranjo", rarity: "Raro", cost: 70, emoji: "🍊" },
        { id: 't12', name: "🎋 Bambú", rarity: "Raro", cost: 80, emoji: "🎋" },
        { id: 't13', name: "💧 Sauce Llorón", rarity: "Épico", cost: 100, emoji: "💧" },
        { id: 't14', name: "💎 Cristal", rarity: "Épico", cost: 150, emoji: "💎" },
        { id: 't15', name: "❄️ Escarcha", rarity: "Épico", cost: 180, emoji: "❄️" },
        { id: 't16', name: "🔥 Fénix", rarity: "Épico", cost: 200, emoji: "🔥" },
        { id: 't17', name: "🌙 Lunar", rarity: "Legendario", cost: 250, emoji: "🌙" },
        { id: 't18', name: "🌈 Arcoíris", rarity: "Legendario", cost: 300, emoji: "🌈" },
        { id: 't19', name: "👑 Real", rarity: "Legendario", cost: 400, emoji: "👑" },
        { id: 't20', name: "🌌 Cosmos", rarity: "Mítico", cost: 500, emoji: "🌌" },
        { id: 't21', name: "🌍 Mundo", rarity: "Mítico", cost: 800, emoji: "🌍" }
    ];

    const ANIMALS = [
        { id: 'a1', name: "🐕 Perro", rarity: "Común", cost: 5, emoji: "🐕" },
        { id: 'a2', name: "🐈 Gato", rarity: "Común", cost: 5, emoji: "🐈" },
        { id: 'a3', name: "🐇 Conejo", rarity: "Común", cost: 10, emoji: "🐇" },
        { id: 'a4', name: "🐿️ Ardilla", rarity: "Común", cost: 15, emoji: "🐿️" },
        { id: 'a5', name: "🐢 Tortuga", rarity: "Común", cost: 20, emoji: "🐢" },
        { id: 'a6', name: "🦆 Pato", rarity: "Común", cost: 25, emoji: "🦆" },
        { id: 'a7', name: "🐸 Rana", rarity: "Común", cost: 30, emoji: "🐸" },
        { id: 'a8', name: "🦊 Zorro", rarity: "Raro", cost: 40, emoji: "🦊" },
        { id: 'a9', name: "🦉 Búho", rarity: "Raro", cost: 50, emoji: "🦉" },
        { id: 'a10', name: "🦋 Mariposa", rarity: "Raro", cost: 60, emoji: "🦋" },
        { id: 'a11', name: "🐺 Lobo", rarity: "Raro", cost: 70, emoji: "🐺" },
        { id: 'a12', name: "🦌 Ciervo", rarity: "Raro", cost: 80, emoji: "🦌" },
        { id: 'a13', name: "🦁 León", rarity: "Épico", cost: 100, emoji: "🦁" },
        { id: 'a14', name: "🐼 Panda", rarity: "Épico", cost: 150, emoji: "🐼" },
        { id: 'a15', name: "🦚 Pavo Real", rarity: "Épico", cost: 180, emoji: "🦚" },
        { id: 'a16', name: "🦈 Tiburón", rarity: "Épico", cost: 200, emoji: "🦈" },
        { id: 'a17', name: "🦄 Unicornio", rarity: "Legendario", cost: 250, emoji: "🦄" },
        { id: 'a18', name: "🐲 Dragón", rarity: "Legendario", cost: 300, emoji: "🐲" },
        { id: 'a19', name: "🦅 Águila", rarity: "Legendario", cost: 400, emoji: "🦅" },
        { id: 'a20', name: "🦇 Murciélago", rarity: "Mítico", cost: 500, emoji: "🦇" }
    ];

    // --- ESTADO ---
    const state = {
        user: { name: "", blockedSeconds: 0 },
        garden: { trees: [], animals: [], gridColors: [] },
        app: {
            isBlocked: false,
            isPlantingMode: false,
            coloringMode: false,
            selectedType: 'tree',
            selectedId: 't1',
            cheatMode: false,
            cheatBuffer: "",
            brushColor: "#4caf50",
            focusTimeRemaining: 0,
            pausedTime: 0,
            timerInterval: null,
            animalInterval: null
        }
    };

    const entityMap = new Map();
    [...TREES, ...ANIMALS].forEach(e => entityMap.set(e.id, e));

    let canvas, ctx, canvasRect;

    // --- INICIALIZACIÓN ---
    document.addEventListener('DOMContentLoaded', () => {
        console.log("DOM Cargado"); // Debug
        loadState();
        initCanvas();
        bindEvents();
        
        // Intentar login automático si hay nombre
        if (state.user.name) {
            console.log("Usuario encontrado:", state.user.name);
            document.getElementById('user-name').value = state.user.name;
            startApp();
        } else {
            console.log("Mostrando bienvenida");
            showScreen('welcome');
        }
    });

    function showScreen(id) {
        // Ocultar todo
        document.getElementById('welcome-screen').classList.remove('active');
        document.getElementById('blocker').classList.remove('active');
        document.getElementById('main-app').style.display = 'none';

        // Mostrar actual
        if (id === 'main') {
            document.getElementById('main-app').style.display = 'block';
        } else {
            document.getElementById(id).classList.add('active');
        }
    }

    function startApp() {
        const nameInput = document.getElementById('user-name');
        const name = nameInput.value.trim();
        
        console.log("Intentando entrar con:", name); // Debug

        if (!name) {
            alert("Por favor escribe tu nombre");
            return;
        }

        state.user.name = name;
        saveState();
        
        showScreen('main');
        updateUI();
        startAnimalLoop();
        
        // Necesario para que el canvas se dibuje bien al inicio
        setTimeout(resizeCanvas, 100); 
    }

    function updateUI() {
        document.getElementById('user-name-display').textContent = state.user.name;
        document.getElementById('garden-title').textContent = `🌿 Jardín de ${state.user.name}`;
        updateStats();
        renderMenu();
        updateSelectedDisplay();
    }

    // --- LÓGICA DE TIEMPO ---
    function startFocus() {
        if (state.app.isBlocked) return;
        
        const entityDef = entityMap.get(state.app.selectedId);
        if (!entityDef) return;

        state.app.isBlocked = true;
        state.app.isPlantingMode = false;
        
        const minutes = state.app.cheatMode ? (5/60) : entityDef.cost; 
        state.app.focusTimeRemaining = minutes * 60;

        document.getElementById('blocker-message').textContent = `Cultivando ${entityDef.name}...`;
        document.getElementById('blocker').classList.add('active');
        
        updateTimerUI();
        
        clearInterval(state.app.timerInterval);
        state.app.timerInterval = setInterval(tickFocus, 1000);
    }

    function tickFocus() {
        if (state.app.focusTimeRemaining > 0) {
            state.app.focusTimeRemaining--;
            updateTimerUI();
        } else {
            finishFocus();
        }
    }

    function updateTimerUI() {
        const secs = state.app.focusTimeRemaining;
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        
        document.getElementById('timer').textContent = `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        const entityDef = entityMap.get(state.app.selectedId);
        const total = (state.app.cheatMode ? 5 : entityDef.cost) * 60;
        const pct = ((total - secs) / total) * 100;
        
        document.getElementById('progress-fill').style.width = `${pct}%`;
        document.getElementById('progress-percentage').textContent = `${Math.round(pct)}%`;
    }

    function finishFocus() {
        clearInterval(state.app.timerInterval);
        state.app.isBlocked = false;
        state.app.isPlantingMode = true;

        const entityDef = entityMap.get(state.app.selectedId);
        state.user.blockedSeconds += state.app.cheatMode ? 5 : entityDef.cost * 60;
        saveState();

        showScreen('main');
        playSound();
        showToast(`¡${entityDef.name} listo! 🌱`, "#4CAF50");
        
        document.getElementById('mode-status').textContent = "¡Planta ahora!";
        updateStats();
    }

    // --- VISIBILIDAD ---
    function handleVisibility() {
        if (document.hidden && state.app.isBlocked) {
            clearInterval(state.app.timerInterval);
            state.app.pausedTime = state.app.focusTimeRemaining;
        } else if (!document.hidden && state.app.isBlocked && state.app.pausedTime > 0) {
            state.app.focusTimeRemaining = state.app.pausedTime;
            state.app.pausedTime = 0;
            clearInterval(state.app.timerInterval);
            state.app.timerInterval = setInterval(tickFocus, 1000);
        }
    }

    // --- EVENTOS ---
    function bindEvents() {
        console.log("Bind events"); // Debug
        document.getElementById('start-btn').onclick = startApp;
        document.getElementById('tab-trees').onclick = () => switchTab('tree');
        document.getElementById('tab-animals').onclick = () => switchTab('animal');
        document.getElementById('clear-garden').onclick = clearGarden;
        document.getElementById('reset-all-colors').onclick = resetColors;
        document.getElementById('toggle-coloring-mode').onclick = toggleColoring;
        document.getElementById('brush-color').onchange = (e) => state.app.brushColor = e.target.value;

        const gardenArea = document.getElementById('garden-area');
        gardenArea.addEventListener('click', handleGardenClick);
        gardenArea.addEventListener('touchstart', handleGardenTouch, { passive: false });

        document.addEventListener('visibilitychange', handleVisibility);
        document.getElementById('user-name').addEventListener('input', handleCheatInput);
        
        window.addEventListener('resize', debounce(resizeCanvas, 200));
    }

    // --- CANVAS ---
    function initCanvas() {
        canvas = document.getElementById('garden-canvas');
        ctx = canvas.getContext('2d');
        resizeCanvas();
    }

    function resizeCanvas() {
        const container = document.getElementById('garden-area');
        if (!container) return;
        
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        canvasRect = { width: canvas.width, height: canvas.height };
        initGrid();
        drawGrid();
        renderEntities();
    }

    function initGrid() {
        if (canvasRect.width === 0) return;
        const cols = Math.ceil(canvasRect.width / CONFIG.CELL_SIZE);
        const rows = Math.ceil(canvasRect.height / CONFIG.CELL_SIZE);
        
        if (state.garden.gridColors && state.garden.gridColors.length === rows && state.garden.gridColors[0] && state.garden.gridColors[0].length === cols) {
            return;
        }
        
        state.garden.gridColors = [];
        for (let i = 0; i < rows; i++) state.garden.gridColors.push(new Array(cols).fill("#8b5a2b"));
    }

    function drawGrid() {
        if (!ctx || canvasRect.width === 0) return;
        const cols = Math.ceil(canvasRect.width / CONFIG.CELL_SIZE);
        const rows = Math.ceil(canvasRect.height / CONFIG.CELL_SIZE);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const color = (state.garden.gridColors[r] && state.garden.gridColors[r][c]) ? state.garden.gridColors[r][c] : "#8b5a2b";
                ctx.fillStyle = color;
                ctx.fillRect(c * CONFIG.CELL_SIZE, r * CONFIG.CELL_SIZE, CONFIG.CELL_SIZE - 1, CONFIG.CELL_SIZE - 1);
            }
        }
    }

    function handleGardenTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        processGardenInput(touch.clientX - rect.left, touch.clientY - rect.top, e.target);
    }

    function handleGardenClick(e) {
        const rect = canvas.getBoundingClientRect();
        processGardenInput(e.clientX - rect.left, e.clientY - rect.top, e.target);
    }

    function processGardenInput(x, y, target) {
        if (state.app.coloringMode) {
            paintCell(x, y);
            return;
        }

        if (state.app.isPlantingMode) {
            placeEntity(x, y);
        } else if (target.classList.contains('entity')) {
            // Click en entidad manejado por onclick propio
        } else if (!state.app.isBlocked) {
            showToast("Selecciona un elemento y pulsa 'Comenzar'", "#ff9800");
        }
    }

    function paintCell(x, y) {
        const col = Math.floor(x / CONFIG.CELL_SIZE);
        const row = Math.floor(y / CONFIG.CELL_SIZE);
        if (state.garden.gridColors[row] && state.garden.gridColors[row][col]) {
            state.garden.gridColors[row][col] = state.app.brushColor;
            drawGrid();
            saveState();
        }
    }

    function resetColors() {
        const cols = Math.ceil(canvasRect.width / CONFIG.CELL_SIZE);
        const rows = Math.ceil(canvasRect.height / CONFIG.CELL_SIZE);
        state.garden.gridColors = [];
        for (let i = 0; i < rows; i++) state.garden.gridColors.push(new Array(cols).fill("#8b5a2b"));
        drawGrid();
        saveState();
        showToast("Suelo restaurado", "#4caf50");
    }

    // --- ENTIDADES ---
    function placeEntity(x, y) {
        const entityDef = entityMap.get(state.app.selectedId);
        if (!entityDef) return;

        const newEntity = {
            tempId: Date.now().toString(),
            id: entityDef.id,
            name: entityDef.name,
            emoji: entityDef.emoji,
            type: entityDef.type,
            x: x,
            y: y
        };

        if (entityDef.type === 'tree') state.garden.trees.push(newEntity);
        else state.garden.animals.push(newEntity);

        renderEntities();
        saveState();
        updateStats();
        
        state.app.isPlantingMode = false;
        document.getElementById('mode-status').textContent = "✅ Completado";
        showToast(`¡${entityDef.name} añadido!`, "#4caf50");
    }

    function renderEntities() {
        const overlay = document.getElementById('entities-overlay');
        if(!overlay) return;
        overlay.innerHTML = '';
        
        const renderList = (list) => {
            list.forEach(entity => {
                const div = document.createElement('div');
                div.className = 'entity';
                div.dataset.id = entity.tempId;
                div.textContent = entity.emoji;
                div.style.left = `${entity.x}px`;
                div.style.top = `${entity.y}px`;
                div.style.transform = 'translate(-50%, -50%)';
                
                div.onclick = (e) => {
                    e.stopPropagation();
                    if(confirm(`¿Eliminar ${entity.name}?`)) {
                        removeEntity(entity.tempId);
                    }
                };
                
                overlay.appendChild(div);
            });
        };
        renderList(state.garden.trees);
        renderList(state.garden.animals);
    }

    function removeEntity(tempId) {
        state.garden.trees = state.garden.trees.filter(e => e.tempId !== tempId);
        state.garden.animals = state.garden.animals.filter(e => e.tempId !== tempId);
        renderEntities();
        saveState();
        updateStats();
    }

    function startAnimalLoop() {
        clearInterval(state.app.animalInterval);
        state.app.animalInterval = setInterval(() => {
            if (state.garden.animals.length === 0 || canvasRect.width === 0) return;
            state.garden.animals.forEach(animal => {
                const moveX = (Math.random() - 0.5) * 40;
                const moveY = (Math.random() - 0.5) * 40;
                animal.x = Math.max(20, Math.min(canvasRect.width - 20, animal.x + moveX));
                animal.y = Math.max(20, Math.min(canvasRect.height - 20, animal.y + moveY));
            });
            renderEntities();
        }, CONFIG.ANIMAL_MOVE_INTERVAL);
    }

    // --- MENÚS ---
    function renderMenu() {
        const type = state.app.selectedType;
        const list = type === 'tree' ? TREES : ANIMALS;
        const container = type === 'tree' ? document.getElementById('tree-list') : document.getElementById('animal-list');
        
        if(!container) return;
        container.innerHTML = '';
        
        list.forEach(item => {
            const cost = state.app.cheatMode ? 1 : item.cost;
            const isSelected = state.app.selectedId === item.id;
            
            const div = document.createElement('div');
            div.className = `item-card ${isSelected ? 'selected' : ''}`;
            div.onclick = () => selectItem(item.id);
            
            div.innerHTML = `
                <div class="item-emoji">${item.emoji}</div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-cost">💰 ${cost} min</div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    function selectItem(id) {
        state.app.selectedId = id;
        const item = entityMap.get(id);
        if(!item) return;
        
        state.app.selectedType = item.type;
        
        document.getElementById('tab-trees').classList.toggle('active', item.type === 'tree');
        document.getElementById('tab-animals').classList.toggle('active', item.type === 'animal');
        document.getElementById('tree-list').classList.toggle('hidden', item.type !== 'tree');
        document.getElementById('animal-list').classList.toggle('hidden', item.type !== 'animal');

        renderMenu();
        updateSelectedDisplay();
    }

    function updateSelectedDisplay() {
        const item = entityMap.get(state.app.selectedId);
        if (!item) return;
        const cost = state.app.cheatMode ? 1 : item.cost;
        const container = document.getElementById('selected-display');
        if(!container) return;
        
        container.innerHTML = `
            <div style="font-size:32px; margin-bottom:8px;">${item.emoji}</div>
            <p style="font-weight:700">${item.name}</p>
            <p style="font-size:12px; color:#666">Tiempo: ${cost} min</p>
            <button class="btn-primary" style="margin-top:12px; width:100%;" onclick="App.startFocus()">🌱 Comenzar</button>
        `;
    }

    function updateStats() {
        const treeCount = document.getElementById('tree-count');
        const animalCount = document.getElementById('animal-count');
        const totalTime = document.getElementById('total-time');
        const totalBlocked = document.getElementById('total-blocked-time');

        if(treeCount) treeCount.textContent = state.garden.trees.length;
        if(animalCount) animalCount.textContent = state.garden.animals.length;
        
        const mins = Math.floor(state.user.blockedSeconds / 60);
        if(totalTime) totalTime.textContent = mins + "m";
        if(totalBlocked) totalBlocked.textContent = mins + " min";
    }

    function switchTab(type) {
        state.app.selectedType = type;
        const firstItem = type === 'tree' ? TREES[0] : ANIMALS[0];
        selectItem(firstItem.id);
    }

    function clearGarden() {
        if (confirm("¿Borrar todo el jardín?")) {
            state.garden.trees = [];
            state.garden.animals = [];
            renderEntities();
            saveState();
            updateStats();
        }
    }

    function toggleColoring() {
        state.app.coloringMode = !state.app.coloringMode;
        const btn = document.getElementById('toggle-coloring-mode');
        if(btn){
            btn.style.background = state.app.coloringMode ? "#ff9800" : "#EEE";
            btn.style.color = state.app.coloringMode ? "white" : "inherit";
        }
    }

    // --- UTILS ---
    function showToast(msg, color = "#333") {
        const container = document.getElementById('toast-container');
        if(!container) return;
        const t = document.createElement('div');
        t.className = 'toast-msg';
        t.textContent = msg;
        t.style.background = color;
        container.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    function playSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g);
            g.connect(ctx.destination);
            osc.frequency.value = 600;
            g.gain.value = 0.2;
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } catch(e) {}
    }

    function handleCheatInput(e) {
        const val = e.target.value;
        state.app.cheatBuffer += e.data || "";
        if (state.app.cheatBuffer.length > 20) state.app.cheatBuffer = state.app.cheatBuffer.slice(-20);
        
        if (state.app.cheatBuffer.includes(CONFIG.CHEAT_CODE)) {
            state.app.cheatMode = true;
            e.target.style.borderColor = "#ff9800";
            showToast("🎮 Modo Test Activado", "#ff9800");
            updateSelectedDisplay();
            renderMenu();
            state.app.cheatBuffer = "";
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    window.App = { startFocus };

    function saveState() {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                if(data.user) state.user = data.user;
                if(data.garden) state.garden = data.garden;
                if(data.app) state.app.cheatMode = data.app.cheatMode || false;
            } catch(e) {
                console.error("Error loading data, resetting...", e);
                localStorage.removeItem(CONFIG.STORAGE_KEY);
            }
        }
    }
})();