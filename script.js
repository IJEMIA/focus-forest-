:root {
    --primary-green: #2E7D32;
    --primary-green-dark: #1B5E20;
    --primary-blue: #1565C0;
    --gray-bg: #F5F7FA;
    --gray-card: #FFFFFF;
    --gray-text: #4B5563;
    --gray-text-light: #6B7280;
    --border-radius-card: 24px;
    --border-radius-element: 16px;
    --box-shadow-soft: 0 10px 40px -10px rgba(0, 0, 0, 0.08);
    --box-shadow-card: 0 20px 40px -15px rgba(0, 0, 0, 0.1);
    --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, sans-serif;
    
    /* Transiciones globales */
    --transition-fast: 0.2s ease;
    --transition-smooth: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}

body {
    font-family: var(--font-sans);
    background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    min-height: 100vh;
    padding: 24px 16px;
    color: #1F2937;
    overflow-x: hidden;
}

/* --- Layout Principal --- */
.container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 1400px;
    margin: 0 auto;
}

.card {
    background: rgba(255, 255, 255, 0.95);
    border-radius: var(--border-radius-card);
    box-shadow: var(--box-shadow-card);
    border: 1px solid rgba(255, 255, 255, 0.5);
    overflow: hidden;
    backdrop-filter: blur(10px);
}

.hidden {
    display: none !important;
}

/* --- Pantalla de Bienvenida --- */
.screen-layer {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s ease, visibility 0.4s ease;
}

.screen-layer.active {
    opacity: 1;
    visibility: visible;
}

#welcome-screen {
    background: linear-gradient(135deg, #E8F5E9 0%, #A5D6A7 100%);
    z-index: 20000;
}

#blocker {
    background: rgba(0, 0, 0, 0.98);
    z-index: 15000;
}

.welcome-card {
    background: rgba(255, 255, 255, 0.98);
    border-radius: 48px;
    padding: 48px 32px;
    text-align: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    max-width: 500px;
    width: 90%;
    transform: translateY(20px);
    transition: transform 0.4s ease;
}

#welcome-screen.active .welcome-card {
    transform: translateY(0);
}

.welcome-icon {
    font-size: 72px;
    margin-bottom: 20px;
    animation: float 3s ease-in-out infinite;
}

.welcome-card h1 {
    font-size: 42px;
    font-weight: 700;
    background: linear-gradient(135deg, var(--primary-green-dark), var(--primary-blue));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    margin-bottom: 12px;
}

.welcome-card p {
    color: var(--gray-text);
    margin-bottom: 32px;
    font-size: 16px;
}

.welcome-card input {
    width: 100%;
    padding: 16px 20px;
    font-size: 16px;
    border: 2px solid #E5E7EB;
    border-radius: 40px;
    margin-bottom: 24px;
    text-align: center;
    font-family: inherit;
    transition: border-color var(--transition-fast);
}

.welcome-card input:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 4px rgba(46, 125, 50, 0.1);
}

.welcome-card button {
    width: 100%;
    padding: 16px;
    font-size: 16px;
    font-weight: 600;
}

.cheat-hint {
    font-size: 12px;
    color: var(--gray-text-light);
    margin-top: 16px !important;
    margin-bottom: 0 !important;
    opacity: 0.6;
}

/* --- Overlay de Bloqueo --- */
.blocker-content {
    text-align: center;
    padding: 20px;
    width: 100%;
    max-width: 450px;
}

.lock-icon {
    font-size: 80px;
    margin-bottom: 20px;
    animation: pulse 2s infinite;
}

.blocker-content h1 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 12px;
    color: #FFD700;
}

#blocker-message {
    font-size: 16px;
    opacity: 0.8;
    margin-bottom: 40px;
}

.timer-display {
    font-size: 64px;
    font-weight: 700;
    font-family: monospace;
    margin: 30px 0;
    letter-spacing: 5px;
    background: rgba(255,255,255,0.08);
    padding: 30px;
    border-radius: 60px;
    border: 1px solid rgba(255,255,255,0.1);
}

.progress-bar-container {
    width: 85%;
    max-width: 320px;
    margin: 20px auto;
}

.progress-bar {
    width: 100%;
    height: 10px;
    background: rgba(255,255,255,0.2);
    border-radius: 5px;
    overflow: hidden;
}

#progress-fill {
    height: 100%;
    background: #4caf50;
    width: 0%;
    transition: width 0.3s linear;
}

#progress-percentage {
    margin-top: 12px;
    font-size: 16px;
    font-weight: 500;
    color: #4caf50;
}

.blocker-footer {
    margin-top: 60px;
    font-size: 13px;
    color: #ff9800;
}

.blocker-footer .small-text {
    font-size: 11px;
    color: #f44336;
    margin-top: 8px;
}

/* --- Tienda --- */
.tree-menu {
    padding: 0;
    display: flex;
    flex-direction: column;
}

.menu-tabs {
    display: flex;
    border-bottom: 1px solid #E5E7EB;
}

.tab-btn {
    flex: 1;
    padding: 16px;
    background: #F3F4F6;
    border: none;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
    color: var(--gray-text);
}

.tab-btn.active {
    background: white;
    color: var(--primary-green);
    border-bottom: 3px solid var(--primary-green);
}

.item-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    overflow-y: auto;
    flex: 1;
    min-height: 200px;
}

.item-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    background: #F9FAFB;
    border-radius: var(--border-radius-element);
    cursor: pointer;
    transition: all var(--transition-fast);
    border: 1px solid transparent;
}

.item-card:hover {
    background: #F3F4F6;
    transform: translateX(4px);
}

.item-card.selected {
    border-color: var(--primary-green);
    background: #E8F5E9;
    box-shadow: 0 4px 10px rgba(46, 125, 50, 0.1);
}

.item-emoji {
    font-size: 28px;
    width: 40px;
    text-align: center;
}

.item-info {
    flex: 1;
}

.item-name {
    font-weight: 600;
    font-size: 14px;
    color: #1F2937;
}

.item-cost {
    font-size: 12px;
    color: var(--gray-text-light);
    margin-top: 2px;
}

/* --- Jardín --- */
.garden-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.garden-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 16px;
}

.garden-header h3 {
    font-size: 20px;
    font-weight: 600;
    color: #1F2937;
}

.stats {
    display: flex;
    gap: 12px;
}

.stat-card {
    background: #F3F4F6;
    padding: 8px 16px;
    border-radius: 40px;
    text-align: center;
    display: flex;
    flex-direction: column;
}

.stat-value {
    font-size: 18px;
    font-weight: 700;
    color: var(--primary-green);
}

.stat-label {
    font-size: 10px;
    color: var(--gray-text-light);
    text-transform: uppercase;
}

.garden-area {
    position: relative;
    background: #A1887F; /* Color tierra base */
    border-radius: 24px;
    overflow: hidden;
    box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
    min-height: 400px;
    width: 100%;
    aspect-ratio: 16/9;
}

.garden-canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: crosshair;
}

.entities-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
}

/* Entidades con aceleración GPU */
.entity {
    position: absolute;
    cursor: pointer;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    font-size: 24px;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.2));
    /* GPU Acceleration trick */
    will-change: transform;
    transform: translate(-50%, -50%) translateZ(0);
    transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.entity:active {
    transform: translate(-50%, -50%) scale(1.2);
    transition: transform 0.1s;
}

.entity .entity-tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #1F2937;
    color: white;
    padding: 4px 8px;
    border-radius: 20px;
    font-size: 9px;
    font-weight: 500;
    white-space: nowrap;
    display: none;
    z-index: 100;
    pointer-events: none;
    margin-bottom: 4px;
}

.entity:hover .entity-tooltip {
    display: block;
}

.garden-controls {
    margin-top: 20px;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
}

.color-picker-container {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #F3F4F6;
    padding: 8px 16px;
    border-radius: 40px;
}

#brush-color {
    width: 32px;
    height: 32px;
    border: 2px solid white;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

/* --- Panel de Estado --- */
.status-panel {
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.status-panel h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 16px;
    color: #1F2937;
}

.status-card {
    background: #F9FAFB;
    border-radius: 20px;
    padding: 16px;
    margin-bottom: 24px;
}

.status-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid #E5E7EB;
}

.status-item:last-child {
    border-bottom: none;
}

.status-icon {
    font-size: 20px;
    width: 32px;
    text-align: center;
}

.status-label {
    display: block;
    font-size: 11px;
    font-weight: 500;
    color: var(--gray-text-light);
    text-transform: uppercase;
}

.status-value {
    display: block;
    font-size: 16px;
    font-weight: 600;
    color: #1F2937;
}

.selected-card {
    background: #F9FAFB;
    border-radius: 20px;
    padding: 20px;
    text-align: center;
    border: 1px solid #E5E7EB;
}

/* --- Botones --- */
.btn-primary, .btn-danger, .btn-secondary {
    padding: 10px 20px;
    border: none;
    border-radius: 40px;
    font-weight: 600;
    font-size: 14px;
    font-family: inherit;
    cursor: pointer;
    transition: all var(--transition-fast);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.btn-primary {
    background: var(--primary-green);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-green-dark);
    transform: translateY(-2px);
    box-shadow: 0 6px 12px -2px rgba(46, 125, 50, 0.3);
}

.btn-danger {
    background: #DC2626;
    color: white;
}

.btn-danger:hover {
    background: #B91C1C;
}

.btn-secondary {
    background: #E5E7EB;
    color: #1F2937;
}

.btn-secondary:hover {
    background: #D1D5DB;
}

.btn-small {
    padding: 6px 14px;
    font-size: 12px;
}

/* --- Toast Notifications --- */
#toast-container {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
}

.toast-msg {
    padding: 12px 24px;
    border-radius: 30px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    animation: toastFadeIn 0.3s ease forwards, toastFadeOut 0.3s ease forwards 2.7s;
    white-space: nowrap;
}

/* --- Animaciones --- */
@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

@keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.05); }
}

@keyframes toastFadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes toastFadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-20px); visibility: hidden; }
}

@keyframes bounceIn {
    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
    70% { transform: translate(-50%, -50%) scale(0.9); }
    100% { transform: translate(-50%, -50%) scale(1); }
}

/* --- Responsive --- */
@media (min-width: 900px) {
    body { padding: 32px; }
    .container { flex-direction: row; align-items: stretch; height: calc(100vh - 64px); }
    .tree-menu { flex: 1; max-width: 320px; }
    .garden-container { flex: 3; }
    .status-panel { flex: 1; max-width: 300px; }
}

@media (max-width: 600px) {
    .stats { width: 100%; justify-content: space-between; }
    .garden-controls { flex-direction: column; align-items: stretch; }
    .color-picker-container { justify-content: center; order: 1; }
    #clear-garden { order: 2; }
    .timer-display { font-size: 48px; padding: 20px; }
    .entity { font-size: 20px; }
}