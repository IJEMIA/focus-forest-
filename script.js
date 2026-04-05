Entendido. He realizado los cambios solicitados para que la experiencia sea mucho más amigable, fluida y funcional:

1.  **Código Secreto:** Actualizado a `409070110`.
2.  **Bloqueo/Desbloqueo:** Ahora el temporizador se **pausa** automáticamente cuando bloqueas tu celular o cambias de aplicación, y se **reanuda** cuando vuelves. Ya no pierdes el progreso por bloquear la pantalla.
3.  **Interfaz Amigable:** Eliminé cualquier mención al código secreto en la pantalla visible. Mejoré los textos para que sean más cálidos y directos.

Aquí tienes los 3 archivos actualizados:

### 1. Index.html
*Eliminada la pista del código secreto y textos más amigables.*

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <meta name="theme-color" content="#2E7D32">
    <meta name="description" content="Focus Forest - Cultiva tu concentración.">
    <title>Focus Forest 🌳</title>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- PANTALLA DE BIENVENIDA -->
    <div id="welcome-screen" class="screen-layer active">
        <div class="welcome-card">
            <div class="welcome-icon">🌳</div>
            <h1>Focus Forest</h1>
            <p>Concéntrate, cultiva tu jardín y relájate.</p>
            
            <input type="text" 
                   id="user-name" 
                   placeholder="¿Cómo te llamas?" 
                   maxlength="20" 
                   autocomplete="off" 
                   aria-label="Ingresa tu nombre">
                   
            <button id="start-btn" class="btn-primary">🌱 Entrar</button>
        </div>
    </div>

    <!-- OVERLAY DE BLOQUEO (FOCUS MODE) -->
    <div id="blocker" class="screen-layer">
        <div class="blocker-content">
            <div class="lock-icon">🌿</div>
            <h1>Modo Enfoque</h1>
            <p id="blocker-message">Cultivando tu árbol...</p>
            
            <div class="timer-display">
                <span id="timer">00:00</span>
            </div>
            
            <div class="progress-bar-container">
                <div class="progress-bar">
                    <div id="progress-fill"></div>
                </div>
                <div id="progress-percentage">0%</div>
            </div>
            
            <div class="blocker-footer">
                <p>¡Mantén el enfoque! 💪</p>
                <p class="small-text">El tiempo se pausará si sales, ¡vuelve pronto!</p>
            </div>
        </div>
    </div>

    <!-- INTERFAZ PRINCIPAL -->
    <div id="main-app" style="display: none;">
        <div class="container">
            
            <!-- Panel Izquierdo: Tienda -->
            <aside class="tree-menu card">
                <div class="menu-tabs">
                    <button id="tab-trees" class="tab-btn active">🌳 Árboles</button>
                    <button id="tab-animals" class="tab-btn">🐾 Animales</button>
                </div>
                <div id="tree-list" class="item-list"></div>
                <div id="animal-list" class="item-list hidden"></div>
            </aside>

            <!-- Panel Central: Jardín -->
            <main class="garden-container card">
                <header class="garden-header">
                    <h3 id="garden-title">🌱 Mi Jardín</h3>
                    <div class="stats">
                        <div class="stat-card">
                            <span class="stat-value" id="tree-count">0</span>
                            <span class="stat-label">Árboles</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value" id="animal-count">0</span>
                            <span class="stat-label">Animales</span>
                        </div>
                        <div class="stat-card">
                            <span class="stat-value" id="total-time">0m</span>
                            <span class="stat-label">Enfoque</span>
                        </div>
                    </div>
                </header>

                <div id="garden-area" class="garden-area">
                    <canvas id="garden-canvas" class="garden-canvas"></canvas>
                    <div id="entities-overlay" class="entities-overlay"></div>
                </div>

                <footer class="garden-controls">
                    <div class="color-picker-container">
                        <label for="brush-color">🎨</label>
                        <input type="color" id="brush-color" value="#4caf50" title="Color del pincel">
                        <button id="toggle-coloring-mode" class="btn-secondary btn-small">Pincel</button>
                        <button id="reset-all-colors" class="btn-secondary btn-small" title="Restaurar tierra">🧹</button>
                    </div>
                    <button id="clear-garden" class="btn-danger btn-small">🗑️ Limpiar</button>
                </footer>
            </main>

            <!-- Panel Derecho: Estado -->
            <aside class="status-panel card">
                <h3>📊 Tu Progreso</h3>
                <div class="status-card">
                    <div class="status-item">
                        <span class="status-icon">👤</span>
                        <div>
                            <span class="status-label">Jardinero</span>
                            <span class="status-value" id="user-name-display">---</span>
                        </div>
                    </div>
                    <div class="status-item">
                        <span class="status-icon">⚡</span>
                        <div>
                            <span class="status-label">Estado</span>
                            <span class="status-value" id="mode-status">Libre</span>
                        </div>
                    </div>
                    <div class="status-item">
                        <span class="status-icon">⏱️</span>
                        <div>
                            <span class="status-label">Siguiente</span>
                            <span class="status-value" id="next-unlock">---</span>
                        </div>
                    </div>
                    <div class="status-item">
                        <span class="status-icon">🛡️</span>
                        <div>
                            <span class="status-label">Acumulado</span>
                            <span class="status-value" id="total-blocked-time">0 min</span>
                        </div>
                    </div>
                </div>
                
                <div id="selected-entity">
                    <h4>✨ Selección</h4>
                    <div id="selected-display" class="selected-card">
                        Cargando...
                    </div>
                </div>
            </aside>
        </div>
    </div>

    <!-- Notificaciones -->
    <div id="toast-container"></div>

    <script src="script.js"></script>
</body>
</html>
```

### 2. Style.css
*Interfaz más suave, amigable y con mejor tipografía (Nunito).*

```css
:root {
    --primary-green: #4CAF50;
    --primary-green-dark: #388E3C;
    --primary-green-light: #E8F5E9;
    --bg-body: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    --bg-card: rgba(255, 255, 255, 0.95);
    --text-main: #2E3A45;
    --text-secondary: #546E7A;
    --radius-lg: 24px;
    --radius-md: 16px;
    --radius-full: 50px;
    --shadow-soft: 0 10px 30px -5px rgba(0,0,0,0.08);
    
    /* Rarezas */
    --rarity-common: #4caf50;
    --rarity-rare: #2196f3;
    --rarity-epic: #9c27b0;
    --rarity-legendary: #ff9800;
    --rarity-mythic: #e91e63;
    
    --font-sans: 'Nunito', system-ui, -apple-system, sans-serif;
    --transition: 0.3s ease;
}

* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

body {
    font-family: var(--font-sans);
    background: var(--bg-body);
    min-height: 100vh;
    color: var(--text-main);
    padding: 16px;
    overflow-x: hidden;
}

.container { display: flex; flex-direction: column; gap: 20px; max-width: 1400px; margin: 0 auto; }
.card { background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-soft); overflow: hidden; }

/* Pantallas */
.screen-layer {
    position: fixed; inset: 0; z-index: 1000; background: rgba(255,255,255,0.98);
    display: flex; justify-content: center; align-items: center; padding: 20px;
    opacity: 0; visibility: hidden; transition: all 0.4s ease;
}
.screen-layer.active { opacity: 1; visibility: visible; }

#welcome-screen { z-index: 20000; background: linear-gradient(135deg, #E8F5E9 0%, #A5D6A7 100%); }
#blocker { background: radial-gradient(circle, #1B5E20 0%, #000 100%); color: white; }
#blocker.active { z-index: 15000; }

.welcome-card {
    background: white; border-radius: 40px; padding: 40px 30px; text-align: center;
    box-shadow: 0 20px 50px rgba(0,0,0,0.1); max-width: 400px; width: 100%;
}
.welcome-icon { font-size: 60px; margin-bottom: 16px; animation: float 3s infinite; }
.welcome-card h1 { font-size: 32px; color: var(--primary-green-dark); margin-bottom: 8px; }
.welcome-card p { color: var(--text-secondary); margin-bottom: 24px; }
.welcome-card input {
    width: 100%; padding: 14px 20px; border: 2px solid #EEE; border-radius: var(--radius-full);
    text-align: center; font-family: inherit; font-size: 16px; margin-bottom: 16px; transition: border-color 0.2s;
}
.welcome-card input:focus { outline: none; border-color: var(--primary-green); }
.welcome-card button { width: 100%; padding: 14px; font-size: 16px; }

/* Bloqueo */
.blocker-content { text-align: center; max-width: 400px; }
.lock-icon { font-size: 50px; margin-bottom: 20px; opacity: 0.9; }
.blocker-content h1 { font-size: 24px; margin-bottom: 8px; color: #FFF; }
#blocker-message { opacity: 0.8; margin-bottom: 40px; font-size: 14px; }

.timer-display {
    font-size: 70px; font-weight: 800; font-variant-numeric: tabular-nums; font-family: monospace;
    background: rgba(255,255,255,0.1); padding: 20px; border-radius: 20px; margin-bottom: 24px;
}
.progress-bar-container { width: 80%; margin: 0 auto; }
.progress-bar { height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden; }
#progress-fill { height: 100%; background: var(--primary-green); transition: width 0.5s linear; }
#progress-percentage { margin-top: 8px; font-size: 14px; font-weight: 600; color: var(--primary-green); }

.blocker-footer { margin-top: 40px; font-size: 12px; color: rgba(255,255,255,0.5); }
.blocker-footer .small-text { display: block; margin-top: 4px; }

/* Menú Tienda */
.tree-menu { display: flex; flex-direction: column; max-height: 70vh; }
.menu-tabs { display: flex; padding: 12px 12px 0; gap: 8px; }
.tab-btn {
    flex: 1; padding: 10px; border: none; background: #F5F5F5; border-radius: 12px 12px 0 0;
    font-weight: 700; color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
}
.tab-btn.active { background: #FFF; color: var(--primary-green); box-shadow: 0 -2px 0 var(--primary-green); }

.item-list { padding: 12px; overflow-y: auto; flex: 1; display: flex; flex-direction: column; gap: 8px; }
.item-card {
    display: flex; align-items: center; gap: 10px; padding: 10px; background: #FAFAFA;
    border-radius: 12px; cursor: pointer; border: 2px solid transparent; transition: all 0.2s;
}
.item-card:hover { background: #F0F0F0; }
.item-card.selected { background: var(--primary-green-light); border-color: var(--primary-green); }
.item-emoji { font-size: 24px; width: 32px; text-align: center; }
.item-info { flex: 1; }
.item-name { font-weight: 700; font-size: 13px; display: flex; justify-content: space-between; }
.item-cost { font-size: 11px; color: var(--text-secondary); }

/* Jardín */
.garden-container { padding: 16px; display: flex; flex-direction: column; flex: 1; }
.garden-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.garden-header h3 { font-size: 18px; color: var(--primary-green-dark); }
.stats { display: flex; gap: 6px; }
.stat-card { background: #F5F5F5; padding: 6px 12px; border-radius: 20px; text-align: center; }
.stat-value { font-weight: 800; color: var(--primary-green); font-size: 14px; }
.stat-label { font-size: 9px; color: var(--text-secondary); text-transform: uppercase; }

.garden-area {
    position: relative; flex: 1; min-height: 250px; background: #A1887F;
    border-radius: 20px; overflow: hidden; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
}
.garden-canvas { display: block; width: 100%; height: 100%; }
.entities-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }

.entity {
    position: absolute; cursor: pointer; font-size: 22px; pointer-events: auto;
    transition: left 3s linear, top 3s linear; /* Movimiento suave */
    filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.2));
}
.entity:active { transform: scale(1.3); }
.entity-tooltip {
    position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
    background: #333; color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px;
    display: none; white-space: nowrap; margin-bottom: 4px;
}
.entity:hover .entity-tooltip { display: block; }

.garden-controls { margin-top: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }
.color-picker-container { display: flex; align-items: center; gap: 8px; background: #F5F5F5; padding: 8px 12px; border-radius: 30px; }
#brush-color { width: 24px; height: 24px; border: none; border-radius: 50%; cursor: pointer; }

/* Panel Estado */
.status-panel { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.status-card { background: #F9FAFB; border-radius: 12px; padding: 8px; }
.status-item { display: flex; align-items: center; gap: 10px; padding: 8px; border-bottom: 1px solid #EEE; }
.status-item:last-child { border-bottom: none; }
.status-icon { font-size: 16px; width: 20px; text-align: center; }
.status-label { font-size: 10px; color: var(--text-secondary); display: block; }
.status-value { font-size: 14px; font-weight: 700; color: var(--text-main); }

#selected-display { background: #F9FAFB; padding: 16px; border-radius: 12px; text-align: center; border: 1px dashed #DDD; }

/* Botones */
.btn-primary, .btn-danger, .btn-secondary {
    padding: 10px 20px; border: none; border-radius: var(--radius-full); font-weight: 700;
    font-size: 13px; font-family: inherit; cursor: pointer; transition: all 0.2s;
}
.btn-primary { background: var(--primary-green); color: white; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); }
.btn-primary:hover { transform: translateY(-2px); filter: brightness(1.1); }
.btn-danger { background: #EF5350; color: white; }
.btn-secondary { background: #EEE; color: var(--text-main); }
.btn-small { padding: 6px 12px; font-size: 11px; }

/* Toast */
#toast-container { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 99999; pointer-events: none; }
.toast-msg { padding: 12px 24px; background: #333; color: white; border-radius: 30px; margin-top: 10px; font-size: 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.2); animation: fadeUp 0.3s ease; }

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* Responsive */
@media (min-width: 900px) {
    body { padding: 24px; }
    .container { flex-direction: row; height: calc(100vh - 48px); }
    .tree-menu { width: 260px; flex-shrink: 0; }
    .garden-container { flex: 1; min-width: 0; }
    .status-panel { width: 240px; flex-shrink: 0; }
}
.hidden { display: none !important; }
```

### 3. Script.js
*Lógica de pausa inteligente (al bloquear celular) y código secreto `409070110`.*

```javascript
(function() {
    'use strict';

    // --- CONFIGURACIÓN ---
    const CONFIG = {
        UNLOCK_DURATION: 1800, // 30 min
        CELL_SIZE: 20,
        ANIMAL_MOVE_INTERVAL: 3000,
        CHEAT_CODE: "409070110", // CÓDIGO ACTUALIZADO
        STORAGE_KEY: 'focusForestV3'
    };

    // --- DATOS (EXPANDIDOS) ---
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
        { id: 't21', name: "🌍 Mundo", rarity: "Mítico", cost: 800, emoji: "🌍" },
        { id: 't22', name: "☠️ Calavera", rarity: "Mítico", cost: 1000, emoji: "☠️" }
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
        { id: 'a20', name: "🦇 Murciélago", rarity: "Mítico", cost: 500, emoji: "🦇" },
        { id: 'a21', name: "🐙 Kraken", rarity: "Mítico", cost: 800, emoji: "🐙" },
        { id: 'a22', name: "👽 Alien", rarity: "Mítico", cost: 1000, emoji: "👽" }
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
            pausedTime: 0, // Para guardar el tiempo al bloquear pantalla
            timerInterval: null,
            animalInterval: null
        }
    };

    const entityMap = new Map();
    [...TREES, ...ANIMALS].forEach(e => entityMap.set(e.id, e));

    let canvas, ctx, canvasRect;

    // --- INIT ---
    document.addEventListener('DOMContentLoaded', () => {
        loadState();
        initCanvas();
        bindEvents();
        
        if (state.user.name) {
            document.getElementById('user-name').value = state.user.name;
            startApp();
        } else {
            showScreen('welcome');
        }
    });

    function showScreen(id) {
        document.querySelectorAll('.screen-layer').forEach(el => el.classList.remove('active'));
        if (id === 'main') {
            document.getElementById('main-app').style.display = 'block';
        } else {
            document.getElementById(id).classList.add('active');
        }
    }

    function startApp() {
        const name = document.getElementById('user-name').value.trim();
        if (!name) return alert("Ingresa tu nombre");
        state.user.name = name;
        saveState();
        showScreen('main');
        updateUI();
        startAnimalLoop();
    }

    function updateUI() {
        document.getElementById('user-name-display').textContent = state.user.name;
        document.getElementById('garden-title').textContent = `🌿 Jardín de ${state.user.name}`;
        updateStats();
        renderMenu();
        updateSelectedDisplay();
    }

    // --- LÓGICA DE TIEMPO (BLOQUEO INTELIGENTE) ---
    function startFocus() {
        if (state.app.isBlocked) return;
        
        const entityDef = entityMap.get(state.app.selectedId);
        if (!entityDef) return;

        state.app.isBlocked = true;
        state.app.isPlantingMode = false;
        
        // Tiempo
        const minutes = state.app.cheatMode ? (5/60) : entityDef.cost; 
        state.app.focusTimeRemaining = minutes * 60;

        // UI
        document.getElementById('blocker-message').textContent = `Cultivando ${entityDef.name}...`;
        document.getElementById('blocker').classList.add('active');
        
        updateTimerUI();
        
        // Iniciar Intervalo
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

        // Sumar tiempo
        const entityDef = entityMap.get(state.app.selectedId);
        state.user.blockedSeconds += state.app.cheatMode ? 5 : entityDef.cost * 60;
        saveState();

        showScreen('main');
        playSound();
        showToast(`¡${entityDef.name} listo para plantar! 🌱`, "#4CAF50");
        
        document.getElementById('mode-status').textContent = "¡Planta ahora!";
        updateStats();
    }

    // --- MANEJO DE VISIBILIDAD (BLOQUEO DE CELULAR) ---
    function handleVisibility() {
        if (document.hidden && state.app.isBlocked) {
            // Se bloqueó la pantalla o se cambió de app
            clearInterval(state.app.timerInterval);
            state.app.pausedTime = state.app.focusTimeRemaining; // Guardar tiempo restante
            console.log("Pausado por bloqueo/cambio de app");
        } else if (!document.hidden && state.app.isBlocked && state.app.pausedTime > 0) {
            // Volvió a la app
            state.app.focusTimeRemaining = state.app.pausedTime; // Restaurar tiempo
            state.app.pausedTime = 0;
            // Reanudar contador
            clearInterval(state.app.timerInterval);
            state.app.timerInterval = setInterval(tickFocus, 1000);
            console.log("Reanudado");
        }
    }

    // --- EVENTOS ---
    function bindEvents() {
        document.getElementById('start-btn').onclick = startApp;
        document.getElementById('tab-trees').onclick = () => switchTab('tree');
        document.getElementById('tab-animals').onclick = () => switchTab('animal');
        document.getElementById('clear-garden').onclick = clearGarden;
        document.getElementById('reset-all-colors').onclick = resetColors;
        document.getElementById('toggle-coloring-mode').onclick = toggleColoring;
        document.getElementById('brush-color').onchange = (e) => state.app.brushColor = e.target.value;

        // Canvas
        const gardenArea = document.getElementById('garden-area');
        gardenArea.addEventListener('click', handleGardenClick);
        gardenArea.addEventListener('touchstart', handleGardenTouch, { passive: false });

        // Visibilidad
        document.addEventListener('visibilitychange', handleVisibility);

        // Cheat Code
        document.getElementById('user-name').addEventListener('input', handleCheatInput);
        
        window.addEventListener('resize', debounce(resizeCanvas, 200));
    }

    // --- CANVAS & GRID ---
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
        initGrid();
        drawGrid();
        renderEntities();
    }

    function initGrid() {
        const cols = Math.ceil(canvasRect.width / CONFIG.CELL_SIZE);
        const rows = Math.ceil(canvasRect.height / CONFIG.CELL_SIZE);
        if (!state.garden.gridColors || state.garden.gridColors.length !== rows) {
            state.garden.gridColors = [];
            for (let i = 0; i < rows; i++) state.garden.gridColors.push(new Array(cols).fill("#8b5a2b"));
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
        if (state.app.coloringMode) {
            paintCell(x, y);
            return;
        }

        if (state.app.isPlantingMode) {
            placeEntity(x, y);
        } else if (target.classList.contains('entity')) {
            // Click en entidad existente
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
                
                // Click para eliminar
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
            if (state.garden.animals.length === 0) return;
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
        state.app.selectedType = item.type;
        
        // UI Tabs
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
        container.innerHTML = `
            <div style="font-size:32px; margin-bottom:8px;">${item.emoji}</div>
            <p style="font-weight:700">${item.name}</p>
            <p style="font-size:12px; color:var(--text-secondary)">Tiempo: ${cost} min</p>
            <button class="btn-primary" style="margin-top:12px; width:100%;" onclick="App.startFocus()">🌱 Comenzar</button>
        `;
    }

    function updateStats() {
        document.getElementById('tree-count').textContent = state.garden.trees.length;
        document.getElementById('animal-count').textContent = state.garden.animals.length;
        const mins = Math.floor(state.user.blockedSeconds / 60);
        document.getElementById('total-time').textContent = mins + "m";
        document.getElementById('total-blocked-time').textContent = mins + " min";
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
        btn.style.background = state.app.coloringMode ? "#ff9800" : "#EEE";
        btn.style.color = state.app.coloringMode ? "white" : "inherit";
    }

    // --- UTILS ---
    function showToast(msg, color = "#333") {
        const container = document.getElementById('toast-container');
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
        // Acumular caracteres para detectar código
        state.app.cheatBuffer += e.data || "";
        if (state.app.cheatBuffer.length > 20) state.app.cheatBuffer = state.app.cheatBuffer.slice(-20);
        
        if (state.app.cheatBuffer.includes(CONFIG.CHEAT_CODE)) {
            state.app.cheatMode = true;
            document.getElementById('user-name').style.borderColor = "#ff9800";
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
            const data = JSON.parse(saved);
            if(data.user) state.user = data.user;
            if(data.garden) state.garden = data.garden;
            if(data.app) state.app.cheatMode = data.app.cheatMode || false;
        }
    }
})();
```