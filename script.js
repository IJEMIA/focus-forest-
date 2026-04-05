:root {
    --primary-green: #4CAF50;
    --primary-green-dark: #388E3C;
    --bg-body: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%);
    --bg-card: rgba(255, 255, 255, 0.96);
    --text-main: #2E3A45;
    --font-sans: 'Nunito', sans-serif;
    --radius-lg: 24px;
    --radius-full: 50px;
    --shadow-soft: 0 10px 30px rgba(0,0,0,0.08);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
    font-family: var(--font-sans);
    background: var(--bg-body);
    color: var(--text-main);
    min-height: 100vh;
    padding: 16px;
}

.container { display: flex; flex-direction: column; gap: 20px; max-width: 1400px; margin: 0 auto; }
.card { background: var(--bg-card); border-radius: var(--radius-lg); box-shadow: var(--shadow-soft); overflow: hidden; }

/* Pantallas */
.screen-layer {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(255,255,255,0.98);
    display: flex; align-items: center; justify-content: center;
    opacity: 0; visibility: hidden; pointer-events: none;
    transition: opacity 0.3s;
}
.screen-layer.active { opacity: 1; visibility: visible; pointer-events: auto; }

#welcome-screen { z-index: 20000; background: linear-gradient(135deg, #E8F5E9 0%, #A5D6A7 100%); }
.welcome-card { background: white; padding: 40px; border-radius: 40px; text-align: center; width: 90%; max-width: 400px; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
.welcome-icon { font-size: 60px; margin-bottom: 10px; }
.welcome-card h1 { color: var(--primary-green-dark); margin-bottom: 5px; }
.welcome-card p { color: #666; margin-bottom: 20px; }
.welcome-card input { width: 100%; padding: 12px; margin-bottom: 15px; border: 2px solid #EEE; border-radius: var(--radius-full); text-align: center; font-family: inherit; font-size: 16px; }
.welcome-card input:focus { border-color: var(--primary-green); outline: none; }

#blocker { background: #1B5E20; color: white; z-index: 15000; text-align: center; }
.blocker-content { width: 90%; max-width: 400px; }
.lock-icon { font-size: 60px; margin-bottom: 10px; }
.timer-display { font-size: 60px; font-weight: 800; font-family: monospace; margin: 20px 0; background: rgba(0,0,0,0.2); padding: 15px; border-radius: 20px; }
.progress-bar-container { width: 80%; margin: 0 auto; }
.progress-bar { height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; overflow: hidden; }
#progress-fill { height: 100%; background: #FFF; transition: width 0.5s; }
#progress-percentage { margin-top: 5px; font-size: 12px; }
.blocker-footer { margin-top: 30px; font-size: 12px; opacity: 0.7; }

/* Layout Interno */
.tree-menu { display: flex; flex-direction: column; max-height: 70vh; }
.menu-tabs { display: flex; background: #F5F5F5; padding: 10px 10px 0; gap: 5px; }
.tab-btn { flex: 1; padding: 10px; border: none; background: transparent; cursor: pointer; border-radius: 12px 12px 0 0; font-weight: 700; color: #888; }
.tab-btn.active { background: #FFF; color: var(--primary-green); }
.item-list { padding: 10px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
.item-card { display: flex; align-items: center; gap: 10px; padding: 10px; background: #FAFAFA; border-radius: 12px; cursor: pointer; border: 2px solid transparent; transition: 0.2s; }
.item-card.selected { background: #E8F5E9; border-color: var(--primary-green); }
.item-emoji { font-size: 22px; width: 30px; text-align: center; }
.item-info { flex: 1; }
.item-name { font-weight: 700; font-size: 13px; }
.item-cost { font-size: 11px; color: #666; }

.garden-container { padding: 16px; display: flex; flex-direction: column; flex: 1; }
.garden-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; flex-wrap: wrap; gap: 8px; }
.stats { display: flex; gap: 6px; }
.stat-card { background: #F5F5F5; padding: 6px 12px; border-radius: 20px; text-align: center; }
.stat-value { font-weight: 800; color: var(--primary-green); font-size: 14px; }
.stat-label { font-size: 9px; color: #666; text-transform: uppercase; }

.garden-area { position: relative; flex: 1; min-height: 250px; background: #A1887F; border-radius: 20px; overflow: hidden; box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); }
.garden-canvas { display: block; width: 100%; height: 100%; }
.entities-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
.entity { position: absolute; pointer-events: auto; cursor: pointer; font-size: 24px; filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.2)); transition: left 2s linear, top 2s linear; }
.entity:active { transform: scale(1.2); }

.garden-controls { margin-top: 12px; display: flex; justify-content: space-between; align-items: center; }
.color-picker-container { display: flex; align-items: center; gap: 8px; background: #F5F5F5; padding: 8px 12px; border-radius: 30px; }
#brush-color { width: 24px; height: 24px; border: none; border-radius: 50%; cursor: pointer; }

.status-panel { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
.status-card { background: #F9FAFB; border-radius: 12px; padding: 8px; }
.status-item { display: flex; align-items: center; gap: 10px; padding: 8px; border-bottom: 1px solid #EEE; }
.status-item:last-child { border-bottom: none; }
.status-label { font-size: 10px; color: #666; display: block; }
.status-value { font-size: 14px; font-weight: 700; }
#selected-display { background: #F9FAFB; padding: 16px; border-radius: 12px; text-align: center; border: 1px dashed #DDD; }

/* Botones */
.btn-primary, .btn-danger, .btn-secondary { padding: 10px 20px; border: none; border-radius: var(--radius-full); font-weight: 700; font-family: inherit; cursor: pointer; }
.btn-primary { background: var(--primary-green); color: white; box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3); }
.btn-danger { background: #EF5350; color: white; }
.btn-secondary { background: #EEE; color: #333; }
.btn-small { padding: 6px 12px; font-size: 11px; }

#toast-container { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 99999; pointer-events: none; }
.toast-msg { padding: 12px 24px; background: #333; color: white; border-radius: 30px; font-size: 14px; margin-top: 5px; animation: fadeUp 0.3s ease; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (min-width: 900px) {
    body { padding: 24px; }
    .container { flex-direction: row; height: calc(100vh - 48px); }
    .tree-menu { width: 260px; flex-shrink: 0; }
    .garden-container { flex: 1; min-width: 0; }
    .status-panel { width: 240px; flex-shrink: 0; }
}
.hidden { display: none !important; }