/**
 * FOCUS FOREST - Script Principal Mejorado
 * Versión: 2.0 (Optimizada)
 */
(function() {
    'use strict';

    // --- CONFIGURACIÓN ---
    const CONFIG = {
        UNLOCK_DURATION: 1800, // 30 minutos para plantar después de desbloquear
        CELL_SIZE: 20,
        ANIMAL_MOVE_INTERVAL: 2500, // Movimiento más fluido
        CHEAT_CODE: "409070110409070110409070110",
        STORAGE_KEY: 'focusForestDataV2'
    };

    // --- BASES DE DATOS (EXPANDIDAS) ---
    const TREES = [
        // Comunes
        { id: 't1', name: "🌲 Pino", rarity: "Común", cost: 5, emoji: "🌲", type: "tree" },
        { id: 't2', name: "🌳 Roble", rarity: "Común", cost: 10, emoji: "🌳", type: "tree" },
        { id: 't3', name: "🎄 Abeto", rarity: "Común", cost: 15, emoji: "🎄", type: "tree" },
        { id: 't4', name: "🌴 Palmera", rarity: "Común", cost: 20, emoji: "🌴", type: "tree" },
        { id: 't5', name: "🍁 Arce", rarity: "Común", cost: 25, emoji: "🍁", type: "tree" },
        { id: 't6', name: "🌱 Brote", rarity: "Común", cost: 3, emoji: "🌱", type: "tree" },
        { id: 't7', name: "🌿 Helecho", rarity: "Común", cost: 8, emoji: "🌿", type: "tree" },
        // Raros
        { id: 't8', name: "🌸 Cerezo", rarity: "Raro", cost: 35, emoji: "🌸", type: "tree" },
        { id: 't9', name: "🍊 Naranjo", rarity: "Raro", cost: 45, emoji: "🍊", type: "tree" },
        { id: 't10', name: "🍂 Olmo", rarity: "Raro", cost: 55, emoji: "🍂", type: "tree" },
        { id: 't11', name: "🌺 Magnolia", rarity: "Raro", cost: 60, emoji: "🌺", type: "tree" },
        { id: 't12', name: "🌻 Girasol Gigante", rarity: "Raro", cost: 65, emoji: "🌻", type: "tree" },
        { id: 't13', name: "🌵 Cactus", rarity: "Raro", cost: 40, emoji: "🌵", type: "tree" },
        // Épicos
        { id: 't14', name: "✨ Árbol Brillante", rarity: "Épico", cost: 100, emoji: "✨", type: "tree" },
        { id: 't15', name: "🔥 Árbol Ígneo", rarity: "Épico", cost: 120, emoji: "🔥", type: "tree" },
        { id: 't16', name: "💎 Árbol Cristal", rarity: "Épico", cost: 150, emoji: "💎", type: "tree" },
        { id: 't17', name: "❄️ Árbol Escarcha", rarity: "Épico", cost: 140, emoji: "❄️", type: "tree" },
        { id: 't18', name: "⚡ Árbol Tormenta", rarity: "Épico", cost: 160, emoji: "⚡", type: "tree" },
        // Legendarios
        { id: 't19', name: "🌙 Árbol Lunar", rarity: "Legendario", cost: 200, emoji: "🌙", type: "tree" },
        { id: 't20', name: "👑 Árbol Real", rarity: "Legendario", cost: 250, emoji: "👑", type: "tree" },
        { id: 't21', name: "☄️ Árbol Cósmico", rarity: "Legendario", cost: 300, emoji: "☄️", type: "tree" },
        // Míticos
        { id: 't22', name: "🌳 Yggdrasil", rarity: "Mítico", cost: 500, emoji: "🌳", type: "tree" },
        { id: 't23', name: "🌈 Arcoíris", rarity: "Mítico", cost: 600, emoji: "🌈", type: "tree" },
        { id: 't24', name: "🎋 Bambú Dorado", rarity: "Mítico", cost: 450, emoji: "🎋", type: "tree" },
        { id: 't25', name: "🍂 Árbol del Mundo", rarity: "Mítico", cost: 800, emoji: "🌍", type: "tree" }
    ];

    const ANIMALS = [
        // Comunes
        { id: 'a1', name: "🐕 Perro", rarity: "Común", cost: 8, emoji: "🐕", type: "animal" },
        { id: 'a2', name: "🐈 Gato", rarity: "Común", cost: 8, emoji: "🐈", type: "animal" },
        { id: 'a3', name: "🐇 Conejo", rarity: "Común", cost: 10, emoji: "🐇", type: "animal" },
        { id: 'a4', name: "🐿️ Ardilla", rarity: "Común", cost: 12, emoji: "🐿️", type: "animal" },
        { id: 'a5', name: "🐸 Rana", rarity: "Común", cost: 6, emoji: "🐸", type: "animal" },
        { id: 'a6', name: "🐢 Tortuga", rarity: "Común", cost: 15, emoji: "🐢", type: "animal" },
        { id: 'a7', name: "🦆 Pato", rarity: "Común", cost: 9, emoji: "🦆", type: "animal" },
        // Raros
        { id: 'a8', name: "🦊 Zorro", rarity: "Raro", cost: 20, emoji: "🦊", type: "animal" },
        { id: 'a9', name: "🐺 Lobo", rarity: "Raro", cost: 25, emoji: "🐺", type: "animal" },
        { id: 'a10', name: "🦌 Ciervo", rarity: "Raro", cost: 30, emoji: "🦌", type: "animal" },
        { id: 'a11', name: "🦉 Búho", rarity: "Raro", cost: 28, emoji: "🦉", type: "animal" },
        { id: 'a12', name: "🦋 Mariposa", rarity: "Raro", cost: 18, emoji: "🦋", type: "animal" },
        { id: 'a13', name: "🦎 Lagarto", rarity: "Raro", cost: 22, emoji: "🦎", type: "animal" },
        // Épicos
        { id: 'a14', name: "🦚 Pavo Real", rarity: "Épico", cost: 50, emoji: "🦚", type: "animal" },
        { id: 'a15', name: "🦈 Tiburón (Tierra?)", rarity: "Épico", cost: 70, emoji: "🦈", type: "animal" },
        { id: 'a16', name: "🦁 León", rarity: "Épico", cost: 80, emoji: "🦁", type: "animal" },
        { id: 'a17', name: "🐼 Panda", rarity: "Épico", cost: 60, emoji: "🐼", type: "animal" },
        // Legendarios
        { id: 'a18', name: "🐉 Dragón", rarity: "Legendario", cost: 100, emoji: "🐉", type: "animal" },
        { id: 'a19', name: "🦄 Unicornio", rarity: "Legendario", cost: 150, emoji: "🦄", type: "animal" },
        { id: 'a20', name: "🐲 Dragón Chino", rarity: "Legendario", cost: 120, emoji: "🐲", type: "animal" },
        { id: 'a21', name: "🦅 Fénix", rarity: "Legendario", cost: 180, emoji: "🦅", type: "animal" },
        // Míticos
        { id: 'a22', name: "🦄 Unicornio Alado", rarity: "Mítico", cost: 300, emoji: "🦄", type: "animal" },
        { id: 'a23', name: "🐙 Kraken", rarity: "Mítico", cost: 400, emoji: "🐙", type: "animal" },
        { id: 'a24', name: "🐘 Elefante Blanco", rarity: "Mítico", cost: 350, emoji: "🐘", type: "animal" },
        { id: 'a25', name: "🐈‍⬛ Gato Cósmico", rarity: "Mítico", cost: 500, emoji: "🐈‍⬛", type: "animal" }
    ];

    // --- ESTADO DE LA APLICACIÓN ---
    const state = {
        user: { name: "", blockedSeconds: 0 },
        garden: { trees: [], animals: [], gridColors: [] },
        app: {
            isBlocked: false,
            isPlantingMode: false,
            coloringMode: false,
            selectedType: 'tree',
            selectedId: 't1', // ID por defecto
            cheatMode: false,
            cheatBuffer: "",
            brushColor: "#4caf50",
            focusTimeRemaining: 0
        }
    };

    // Variables globales para intervalos y DOM
    let focusInterval = null;
    let animalInterval = null;
    let canvas = null;
    let ctx = null;
    let canvasRect = { width: 0, height: 0 };

    // Mapeo de entidades para acceso rápido (optimización)
    const entityMap = new Map();
    [...TREES, ...ANIMALS].forEach(e => entityMap.set(e.id, e));

    // --- INICIALIZACIÓN ---
    document.addEventListener('DOMContentLoaded', () => {
        loadState();
        initCanvas();
        bindEvents();
        
        // Si ya hay usuario, ir directo a la app
        if (state.user.name) {
            document.getElementById('user-name').value = state.user.name;
            startApp();
        } else {
            showScreen('welcome');
        }
    });

    // --- LÓGICA DE PANTALLAS ---
    function showScreen(screenId) {
        // Limpieza de clases activas
        document.querySelectorAll('.screen-layer').forEach(el => el.classList.remove('active'));
        
        if (screenId === 'welcome') {
            document.getElementById('welcome-screen').classList.add('active');
            document.getElementById('main-app').style.display = 'none';
        } else if (screenId === 'main') {
            document.getElementById('main-app').style.display = 'block';
            resizeCanvas(); // Asegurar tamaño correcto al mostrar
        } else if (screenId === 'blocker') {
            document.getElementById('blocker').classList.add('active');
        }
    }

    function startApp() {
        const nameInput = document.getElementById('user-name');
        const name = nameInput.value.trim();
        if (!name) return alert("Por favor ingresa tu nombre");

        state.user.name = name;
        saveState();
        
        showScreen('main');
        updateUI();
        startAnimalLoop();
    }

    function updateUI() {
        document.getElementById('user-name-display').textContent = state.user.name;
        document.getElementById('garden-title').textContent = `🌱 Jardín de ${state.user.name}`;
        updateStats();
        updateSelectedDisplay();
        renderMenu();
    }

    // --- MANEJO DE EVENTOS ---
    function bindEvents() {
        // Bienvenida
        document.getElementById('start-btn').onclick = startApp;
        
        // Tabs
        document.getElementById('tab-trees').onclick = () => switchTab('tree');
        document.getElementById('tab-animals').onclick = () => switchTab('animal');

        // Controles de jardín
        document.getElementById('clear-garden').onclick = clearGarden;
        document.getElementById('reset-all-colors').onclick = resetColors;
        document.getElementById('toggle-coloring-mode').onclick = toggleColoring;
        document.getElementById('brush-color').onchange = (e) => state.app.brushColor = e.target.value;

        // Canvas (delegación de eventos para mejor rendimiento)
        const gardenArea = document.getElementById('garden-area');
        gardenArea.addEventListener('click', handleGardenClick);
        gardenArea.addEventListener('touchstart', handleGardenTouch, { passive: false });

        // Detección de pestaña (bloqueo)
        document.addEventListener('visibilitychange', handleVisibility);

        // Detección de código secreto
        document.getElementById('user-name').addEventListener('input', handleCheatInput);

        // Resize
        window.addEventListener('resize', debounce(resizeCanvas, 200));
    }

    // --- CANVAS Y GRID ---
    function initCanvas() {
        canvas = document.getElementById('garden-canvas');
        ctx = canvas.getContext('2d');
        resizeCanvas();
    }

    function resizeCanvas() {
        const container = document.getElementById('garden-area');
        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        canvasRect = { width: canvas.width, height: canvas.height };
        
        // Ajustar colores si cambió el tamaño (preservar datos existentes)
        initGrid();
        drawGrid();
        renderEntities(); // Reposicionar entidades si es necesario
    }

    function initGrid() {
        const cols = Math.ceil(canvasRect.width / CONFIG.CELL_SIZE);
        const rows = Math.ceil(canvasRect.height / CONFIG.CELL_SIZE);
        
        // Si no hay colores guardados o cambió el tamaño drasticamente, reiniciar
        if (!state.garden.gridColors || state.garden.gridColors.length !== rows) {
            state.garden.gridColors = [];
            for (let i = 0; i < rows; i++) {
                state.garden.gridColors.push(new Array(cols).fill("#8b5a2b")); // Color tierra
            }
        }
    }

    function drawGrid() {
        if (!ctx) return;
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
        // 1. Verificar si clickeó una entidad (botón eliminar/info)
        if (target.classList.contains('entity')) {
            // Por ahora mantenemos simple: eliminar al confirmar
            const id = target.dataset.id;
            if (confirm(`¿Eliminar esta entidad?`)) {
                removeEntity(id);
            }
            return;
        }

        // 2. Modo Coloreo
        if (state.app.coloringMode) {
            paintCell(x, y);
            return;
        }

        // 3. Modo Plantar
        if (state.app.isPlantingMode) {
            placeEntity(x, y);
        } else if (!state.app.isBlocked) {
            showToast("Selecciona un elemento y pulsa 'Comenzar' para cultivar", "#ff9800");
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
        for (let i = 0; i < rows; i++) {
            state.garden.gridColors.push(new Array(cols).fill("#8b5a2b"));
        }
        drawGrid();
        saveState();
        showToast("Suelo restaurado", "#4caf50");
    }

    // --- ENTIDADES (ÁRBOLES Y ANIMALES) ---
    function placeEntity(x, y) {
        const entityDef = entityMap.get(state.app.selectedId);
        if (!entityDef) return;

        const newEntity = {
            tempId: Date.now().toString(), // ID temporal para el DOM
            id: entityDef.id,
            name: entityDef.name,
            emoji: entityDef.emoji,
            type: entityDef.type,
            x: x,
            y: y
        };

        if (entityDef.type === 'tree') {
            state.garden.trees.push(newEntity);
        } else {
            state.garden.animals.push(newEntity);
        }

        renderEntities();
        saveState();
        updateStats();
        
        // Resetear modo plantar
        state.app.isPlantingMode = false;
        document.getElementById('mode-status').textContent = "✅ Completado";
        clearTimeout(focusInterval); // Limpiar cualquier timer de seguridad
        
        showToast(`¡${entityDef.name} añadido!`, "#4caf50");
    }

    function removeEntity(tempId) {
        state.garden.trees = state.garden.trees.filter(e => e.tempId !== tempId);
        state.garden.animals = state.garden.animals.filter(e => e.tempId !== tempId);
        renderEntities();
        saveState();
        updateStats();
    }

    function renderEntities() {
        const overlay = document.getElementById('entities-overlay');
        overlay.innerHTML = ''; // Limpiar todo

        const renderList = (list, movable) => {
            list.forEach(entity => {
                const div = document.createElement('div');
                div.className = 'entity';
                div.dataset.id = entity.tempId; // Para identificación en clicks
                div.textContent = entity.emoji;
                
                // Establecer posición
                div.style.left = `${entity.x}px`;
                div.style.top = `${entity.y}px`;
                div.style.transform = 'translate(-50%, -50%)';

                // Tooltip
                const tooltip = document.createElement('div');
                tooltip.className = 'entity-tooltip';
                tooltip.textContent = entity.name;
                div.appendChild(tooltip);

                overlay.appendChild(div);
            });
        };

        renderList(state.garden.trees, false);
        renderList(state.garden.animals, true);
    }

    function startAnimalLoop() {
        if (animalInterval) clearInterval(animalInterval);
        
        animalInterval = setInterval(() => {
            if (state.garden.animals.length === 0) return;
            
            state.garden.animals.forEach(animal => {
                // Movimiento aleatorio dentro de los límites
                const moveX = (Math.random() - 0.5) * 40;
                const moveY = (Math.random() - 0.5) * 40;
                
                animal.x = Math.max(20, Math.min(canvasRect.width - 20, animal.x + moveX));
                animal.y = Math.max(20, Math.min(canvasRect.height - 20, animal.y + moveY));
            });
            
            // Re-renderizar solo posiciones (optimización simple)
            // Por ahora re-renderizamos todo para simplicidad, pero es rápido
            renderEntities(); 

        }, CONFIG.ANIMAL_MOVE_INTERVAL);
    }

    // --- LÓGICA DE TIEMPO (BLOQUEO) ---
    function startFocus() {
        const entityDef = entityMap.get(state.app.selectedId);
        if (!entityDef) return;

        if (state.app.isBlocked) return showToast("Ya hay una sesión en curso", "#f44336");

        state.app.isBlocked = true;
        state.app.isPlantingMode = false;
        
        // Tiempo en segundos
        const minutes = state.app.cheatMode ? (5/60) : entityDef.cost; 
        state.app.focusTimeRemaining = minutes * 60;

        // Actualizar UI de bloqueo
        const msg = state.app.cheatMode ? `MODO PRUEBA (5s)` : `Cultivando ${entityDef.name}`;
        document.getElementById('blocker-message').textContent = msg;
        document.getElementById('blocker').classList.add('active');
        
        // Iniciar contador
        updateTimerUI();
        focusInterval = setInterval(tickFocus, 1000);
    }

    function tickFocus() {
        state.app.focusTimeRemaining--;
        updateTimerUI();

        if (state.app.focusTimeRemaining <= 0) {
            finishFocus();
        }
    }

    function updateTimerUI() {
        const secs = state.app.focusTimeRemaining;
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        
        document.getElementById('timer').textContent = `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        
        // Progreso
        const entityDef = entityMap.get(state.app.selectedId);
        const total = (state.app.cheatMode ? 5 : entityDef.cost) * 60;
        const pct = ((total - secs) / total) * 100;
        
        document.getElementById('progress-fill').style.width = `${pct}%`;
        document.getElementById('progress-percentage').textContent = `${Math.round(pct)}%`;
    }

    function finishFocus() {
        clearInterval(focusInterval);
        state.app.isBlocked = false;
        state.app.isPlantingMode = true; // ¡Permitir plantar!

        // Sumar tiempo al contador total
        const entityDef = entityMap.get(state.app.selectedId);
        state.user.blockedSeconds += state.app.cheatMode ? 5 : entityDef.cost * 60;
        saveState();

        // Ocultar bloqueo
        document.getElementById('blocker').classList.remove('active');
        
        // Sonido y Popup
        playSound();
        showSuccessPopup();

        // Actualizar estado en panel
        document.getElementById('mode-status').textContent = "🟢 ¡AÑADIR!";
        document.getElementById('next-unlock').textContent = "Haz clic en el jardín";
        updateStats();

        // Auto-cancelar si no planta en 30 mins (seguridad)
        setTimeout(() => {
            if (state.app.isPlantingMode) {
                state.app.isPlantingMode = false;
                showToast("Tiempo de plantación expirado", "#f44336");
            }
        }, CONFIG.UNLOCK_DURATION * 1000);
    }

    function handleVisibility() {
        if (document.hidden && state.app.isBlocked && !state.app.cheatMode) {
            // Penalización: Reiniciar contador
            clearInterval(focusInterval);
            state.app.isBlocked = false;
            document.getElementById('blocker').classList.remove('active');
            showToast("¡Saliste de la app! Tiempo perdido.", "#f44336");
            document.getElementById('mode-status').textContent = "Libre";
        }
    }

    // --- MENÚS Y UI ---
    function renderMenu() {
        const type = state.app.selectedType;
        const list = type === 'tree' ? TREES : ANIMALS;
        const container = type === 'tree' ? document.getElementById('tree-list') : document.getElementById('animal-list');
        
        container.innerHTML = '';
        
        list.forEach(item => {
            const cost = state.app.cheatMode ? 1 : item.cost; // Costo 1 en modo trampa
            const isSelected = state.app.selectedId === item.id;
            
            const div = document.createElement('div');
            div.className = `item-card ${isSelected ? 'selected' : ''}`;
            div.onclick = () => selectItem(item.id);
            
            div.innerHTML = `
                <div class="item-emoji">${item.emoji}</div>
                <div class="item-info">
                    <div class="item-name">${item.name}</div>
                    <div class="item-cost">💰 ${state.app.cheatMode ? '1 min (Test)' : cost + ' min'}</div>
                </div>
            `;
            container.appendChild(div);
        });
    }

    function selectItem(id) {
        state.app.selectedId = id;
        const item = entityMap.get(id);
        state.app.selectedType = item.type; // Actualizar tipo automáticamente
        
        // Actualizar tabs visualmente
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
        
        const container = document.getElementById('selected-display');
        const cost = state.app.cheatMode ? 1 : item.cost;
        const timeStr = state.app.cheatMode ? "5 segundos" : `${cost} minutos`;

        container.innerHTML = `
            <div class="item-emoji" style="font-size:40px; margin-bottom:10px;">${item.emoji}</div>
            <p><strong>${item.name}</strong></p>
            <p style="color:${getRarityColor(item.rarity)}; font-size:12px;">${item.rarity}</p>
            <p style="margin-top:5px;">⏱️ ${timeStr}</p>
            <button class="btn-primary" style="margin-top:12px; width:100%;" onclick="App.startFocus()">🌱 Comenzar</button>
        `;
    }

    function updateStats() {
        document.getElementById('tree-count').textContent = state.garden.trees.length;
        document.getElementById('animal-count').textContent = state.garden.animals.length;
        
        const totalMin = state.user.blockedSeconds / 60;
        const h = Math.floor(totalMin / 60);
        const m = Math.floor(totalMin % 60);
        
        document.getElementById('total-time').textContent = h > 0 ? `${h}h ${m}m` : `${m} min`;
        document.getElementById('total-blocked-time').textContent = `${Math.floor(state.user.blockedSeconds / 60)} min`;
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
            showToast("Jardín limpiado", "#ff9800");
        }
    }

    function toggleColoring() {
        state.app.coloringMode = !state.app.coloringMode;
        const btn = document.getElementById('toggle-coloring-mode');
        if (state.app.coloringMode) {
            btn.textContent = "Modo Pincel: ON";
            btn.style.background = "#ff9800";
            btn.style.color = "white";
            canvas.style.cursor = "crosshair";
        } else {
            btn.textContent = "Modo Pincel: OFF";
            btn.style.background = "#E5E7EB";
            btn.style.color = "#1F2937";
            canvas.style.cursor = "default";
        }
    }

    // --- UTILIDADES ---
    function getRarityColor(rarity) {
        const colors = {
            "Común": "#4caf50",
            "Raro": "#2196f3",
            "Épico": "#9c27b0",
            "Legendario": "#ff9800",
            "Mítico": "#e91e63"
        };
        return colors[rarity] || "#000";
    }

    function showToast(msg, color = "#333") {
        const container = document.getElementById('toast-container');
        const t = document.createElement('div');
        t.className = 'toast-msg';
        t.textContent = msg;
        t.style.background = color;
        container.appendChild(t);
        setTimeout(() => t.remove(), 3000);
    }

    function showSuccessPopup() {
        const div = document.createElement('div');
        div.style.cssText = `position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:white; padding:40px; border-radius:20px; text-align:center; z-index:20000; box-shadow:0 20px 60px rgba(0,0,0,0.2); animation: bounceIn 0.4s;`;
        div.innerHTML = `
            <h1 style="color:#2E7D32; margin-bottom:10px;">¡Tiempo Completado!</h1>
            <p style="margin-bottom:20px;">Puedes añadir tu elemento al jardín.</p>
            <button class="btn-primary" onclick="this.parentElement.remove()">Genial ✨</button>
        `;
        document.body.appendChild(div);
    }

    function playSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.connect(g);
            g.connect(ctx.destination);
            osc.frequency.value = 800;
            osc.type = 'sine';
            g.gain.value = 0.2;
            osc.start();
            osc.stop(ctx.currentTime + 0.2);
        } catch(e) {}
    }

    function handleCheatInput(e) {
        const val = e.target.value;
        if (val.endsWith(CONFIG.CHEAT_CODE.slice(-5))) { // Detección simple para ejemplo
             // Lógica real sería comparar todo el string acumulado
             state.app.cheatBuffer += e.data;
             if (state.app.cheatBuffer.includes(CONFIG.CHEAT_CODE)) {
                 state.app.cheatMode = true;
                 e.target.style.borderColor = "#ff9800";
                 showToast("🎮 MODO TEST ACTIVADO", "#ff9800");
                 updateSelectedDisplay();
                 renderMenu();
                 state.app.cheatBuffer = "";
             }
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Expone funciones necesarias globalmente (para onclick en HTML)
    window.App = {
        startFocus
    };

    // --- PERSISTENCIA ---
    function saveState() {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state));
    }

    function loadState() {
        const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            state.user = data.user || state.user;
            state.garden = data.garden || state.garden;
            state.app.cheatMode = data.app?.cheatMode || false;
        }
    }

})();