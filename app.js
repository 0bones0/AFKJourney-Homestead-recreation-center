document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. DOM Elements ---
    const DOM = {
        navItems: document.querySelectorAll('.nav-item, .mobile-nav-item'),
        views: document.querySelectorAll('.view-section'),
        mobileMenuBtn: document.getElementById('mobile-menu-btn'),
        mobileMenu: document.getElementById('mobile-menu'),
        closeMobileBtn: document.getElementById('close-mobile-menu'),
        
        // Modal & Form Elements
        addHeroBtn: document.getElementById('add-hero-btn'),
        heroModal: document.getElementById('add-hero-modal'),
        closeModalBtn: document.getElementById('add-hero-close'),
        cancelModalBtn: document.getElementById('add-hero-cancel'),
        heroForm: document.getElementById('add-hero-form'),
        tableBody: document.getElementById('hero-table-body'),
    };

    // --- 2. State Management (LocalStorage) ---
    let state = {
        heroes: JSON.parse(localStorage.getItem('afk_heroes')) || []
    };

    const saveState = () => {
        localStorage.setItem('afk_heroes', JSON.stringify(state.heroes));
    };

    // --- 3. View Navigation Logic ---
    function switchView(targetId) {
        // Update active nav styling (Desktop)
        document.querySelectorAll('.nav-item').forEach(nav => {
            nav.classList.remove('nav-active', 'bg-slate-100');
            if (nav.getAttribute('data-target') === targetId) {
                nav.classList.add('nav-active', 'bg-slate-100');
            }
        });

        // Toggle visibility of sections
        DOM.views.forEach(view => {
            if (view.id === targetId) {
                view.classList.remove('hidden');
                view.classList.add('active');
            } else {
                view.classList.add('hidden');
                view.classList.remove('active');
            }
        });

        // Close mobile menu if it's open
        DOM.mobileMenu.classList.add('hidden');
    }

    DOM.navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            if (target) switchView(target);
        });
    });

    // --- Strategy Vault Logic ---
const modeSelector = document.getElementById('mode-selector');
const bossSelector = document.getElementById('boss-selector');
const currentBossTitle = document.getElementById('current-boss-title');
const addCompBtn = document.getElementById('add-comp-btn');
const formationsContainer = document.getElementById('formations-container');

// Boss Data (Based on video analysis)
const bossData = {
    'dream-realm': [
        { id: 'sarethiel', name: 'Sarethiel' },
        { id: 'gloommaw', name: 'Gloommaw' },
        { id: 'doomscourge', name: 'Doomscourge' },
        { id: 'blightshroom', name: 'Blightshroom' },
        { id: 'king-croaker', name: 'King Croaker' },
        { id: 'necrodrakon', name: 'Necrodrakon' }
    ],
    'primal-lord': [
        { id: 'midnight-harvester', name: 'Midnight Harvester' },
        { id: 'lone-gaze', name: 'Lone Gaze' }
    ],
    'guild-supremacy': [
        { id: 'mimic-chest', name: 'Supreme Mimic' },
        { id: 'mimic-crystal', name: 'Crystal Defense' }
    ],
    'battle-drills': [
        { id: 'corrupt-creature', name: 'Corrupt Core' }
    ]
};

// Update Boss Dropdown based on Mode
function updateBossOptions() {
    const selectedMode = modeSelector.value;
    const bosses = bossData[selectedMode] || [];
    
    bossSelector.innerHTML = '<option value="" disabled selected>-- Choose Target --</option>';
    
    bosses.forEach(boss => {
        const option = document.createElement('option');
        option.value = boss.id;
        option.textContent = boss.name;
        bossSelector.appendChild(option);
    });
    
    // Reset view when mode changes
    currentBossTitle.textContent = "Select a Target";
    addCompBtn.classList.add('hidden');
    formationsContainer.innerHTML = `
        <div class="text-center text-slate-400 py-10 flex flex-col items-center">
            <span class="text-4xl mb-3">🎯</span>
            <p>Select a boss to view or record your optimal team compositions.</p>
        </div>`;
}

// Render formations when a boss is selected
function renderBossStrategy() {
    const selectedBossName = bossSelector.options[bossSelector.selectedIndex].text;
    currentBossTitle.textContent = selectedBossName;
    addCompBtn.classList.remove('hidden');
    
    // Placeholder for logged formations (this is where you'd map over saved data)
    formationsContainer.innerHTML = `
        <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="flex items-center space-x-4 w-full md:w-auto">
                <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-xl shadow-inner border border-indigo-200">
                    🔮 </div>
                <div class="flex space-x-2">
                    <div class="w-10 h-10 bg-slate-200 rounded border border-slate-300"></div>
                    <div class="w-10 h-10 bg-slate-200 rounded border border-slate-300"></div>
                    <div class="w-10 h-10 bg-slate-200 rounded border border-slate-300"></div>
                    <div class="w-10 h-10 bg-slate-200 rounded border border-slate-300"></div>
                    <div class="w-10 h-10 bg-slate-200 rounded border border-slate-300"></div>
                </div>
            </div>
            <div class="text-right w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6">
                <p class="text-xs text-slate-500 uppercase font-bold">Total Damage</p>
                <p class="text-2xl font-bold text-red-600 heading-font">190B</p>
                <p class="text-xs text-slate-400 mt-1">Recorded: April 12, 2026</p>
            </div>
        </div>
    `;
}

// Event Listeners
modeSelector.addEventListener('change', updateBossOptions);
bossSelector.addEventListener('change', renderBossStrategy);

// Initialize the first dropdown on load
updateBossOptions();

    // --- Grind & Task Logic ---
const dailyTasksContainer = document.getElementById('daily-tasks-container');
const weeklyTasksContainer = document.getElementById('weekly-tasks-container');
const addDailyBtn = document.getElementById('add-daily-task-btn');
const addWeeklyBtn = document.getElementById('add-weekly-task-btn');
const progressBar = document.getElementById('daily-progress-bar');
const progressText = document.getElementById('daily-progress-text');

// Initialize tasks in state if they don't exist
if (!state.tasks) {
    state.tasks = JSON.parse(localStorage.getItem('afk_tasks')) || [
        { id: 1, text: "Complete AFK Stage x2", type: "daily", completed: false },
        { id: 2, text: "Sweep Dura's Trials x3", type: "daily", completed: false },
        { id: 3, text: "Dream Realm Attacks", type: "daily", completed: false },
        { id: 4, text: "Purchase Emporium Daily Items", type: "daily", completed: false },
        { id: 5, text: "Clear Legend Trial Floor x15", type: "weekly", completed: false },
        { id: 6, text: "Participate in Guild Supremacy x24", type: "weekly", completed: false }
    ];
}

const saveTasks = () => {
    localStorage.setItem('afk_tasks', JSON.stringify(state.tasks));
};

function renderTasks() {
    dailyTasksContainer.innerHTML = '';
    weeklyTasksContainer.innerHTML = '';
    
    let dailyTotal = 0;
    let dailyCompleted = 0;

    state.tasks.forEach(task => {
        if (task.type === 'daily') dailyTotal++;
        if (task.type === 'daily' && task.completed) dailyCompleted++;

        const taskDiv = document.createElement('div');
        taskDiv.className = `flex justify-between items-center p-3 rounded-lg border ${task.completed ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-slate-200 shadow-sm'}`;
        
        taskDiv.innerHTML = `
            <label class="flex items-center cursor-pointer flex-1">
                <input type="checkbox" class="task-checkbox mr-3 w-4 h-4 text-yellow-500 rounded border-slate-300 focus:ring-yellow-500" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                <span class="${task.completed ? 'line-through text-slate-400' : 'text-slate-700 font-medium'}">${task.text}</span>
            </label>
            <button class="edit-task-btn text-slate-400 hover:text-slate-800 ml-2" data-id="${task.id}" aria-label="Edit Task">✏️</button>
        `;

        if (task.type === 'daily') {
            dailyTasksContainer.appendChild(taskDiv);
        } else {
            weeklyTasksContainer.appendChild(taskDiv);
        }
    });

    // Update Progress Bar
    const percentage = dailyTotal === 0 ? 0 : Math.round((dailyCompleted / dailyTotal) * 100);
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${percentage}%`;

    attachTaskListeners();
}

function attachTaskListeners() {
    // Checkbox toggles
    document.querySelectorAll('.task-checkbox').forEach(box => {
        box.addEventListener('change', (e) => {
            const taskId = parseInt(e.target.getAttribute('data-id'));
            const task = state.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = e.target.checked;
                saveTasks();
                renderTasks();
            }
        });
    });

    // Edit buttons
    document.querySelectorAll('.edit-task-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const taskId = parseInt(e.currentTarget.getAttribute('data-id'));
            const task = state.tasks.find(t => t.id === taskId);
            if (task) {
                const newText = prompt("Modify task:", task.text);
                if (newText !== null && newText.trim() !== "") {
                    task.text = newText.trim();
                    saveTasks();
                    renderTasks();
                }
            }
        });
    });
}

function addNewTask(type) {
    const text = prompt(`Enter new ${type} task:`);
    if (text && text.trim() !== "") {
        const newTask = {
            id: Date.now(), // simple unique ID generator
            text: text.trim(),
            type: type,
            completed: false
        };
        state.tasks.push(newTask);
        saveTasks();
        renderTasks();
    }
}

addDailyBtn.addEventListener('click', () => addNewTask('daily'));
addWeeklyBtn.addEventListener('click', () => addNewTask('weekly'));

// Initialize task render
renderTasks();

    // --- 8. Mode Insights Logic ---

// Initialize insights state if it doesn't exist
if (!state.insights) {
    state.insights = JSON.parse(localStorage.getItem('afk_insights')) || {
        afkStage: 1819,
        durasTrials: { class: 'Ironwall (Tank)', floor: 40, target: 'Mythic (Lvl 25)' },
        legendTrials: { light: 141, nature: 141, eternity: 141, will: 141 },
        supremeArena: { rank: 82 }
    };
}

// Function to save insights to LocalStorage
const saveInsights = () => {
    localStorage.setItem('afk_insights', JSON.stringify(state.insights));
};

// Function to push data from state to the HTML
function renderInsights() {
    // AFK Stage
    document.getElementById('insight-afk-stage').textContent = state.insights.afkStage;
    
    // Dura's Trials
    document.getElementById('insight-dura-class').textContent = state.insights.durasTrials.class;
    document.getElementById('insight-dura-floor').textContent = `Floor ${state.insights.durasTrials.floor}`;
    document.getElementById('insight-dura-target').textContent = state.insights.durasTrials.target;
    
    // Legend Trials
    document.getElementById('insight-legend-light').textContent = state.insights.legendTrials.light;
    document.getElementById('insight-legend-nature').textContent = state.insights.legendTrials.nature;
    document.getElementById('insight-legend-eternity').textContent = state.insights.legendTrials.eternity;
    document.getElementById('insight-legend-will').textContent = state.insights.legendTrials.will;
    
    // Supreme Arena
    document.getElementById('insight-arena-rank').textContent = `Top ${state.insights.supremeArena.rank}`;
}

// --- Event Listeners for Update Buttons ---

document.getElementById('btn-update-afk').addEventListener('click', () => {
    const newVal = prompt("Enter current AFK Stage:", state.insights.afkStage);
    if (newVal && !isNaN(newVal)) {
        state.insights.afkStage = parseInt(newVal);
        saveInsights();
        renderInsights();
    }
});

document.getElementById('btn-update-dura').addEventListener('click', () => {
    // Chain prompts for multi-data cards
    const newClass = prompt("Enter active Class Rotation (e.g., Ironwall (Tank)):", state.insights.durasTrials.class);
    if (!newClass) return; // Exit if cancelled
    
    const newFloor = prompt("Enter current Floor:", state.insights.durasTrials.floor);
    if (!newFloor) return;
    
    const newTarget = prompt("Enter Target Charm Drop (e.g., Mythic (Lvl 25)):", state.insights.durasTrials.target);
    if (!newTarget) return;

    state.insights.durasTrials = { class: newClass, floor: parseInt(newFloor), target: newTarget };
    saveInsights();
    renderInsights();
});

document.getElementById('btn-update-legend').addEventListener('click', () => {
    const light = prompt("Light Tower Floor:", state.insights.legendTrials.light);
    if (!light) return;
    const nature = prompt("Nature Tower Floor:", state.insights.legendTrials.nature);
    if (!nature) return;
    const eternity = prompt("Eternity Tower Floor:", state.insights.legendTrials.eternity);
    if (!eternity) return;
    const will = prompt("Will Tower Floor:", state.insights.legendTrials.will);
    if (!will) return;

    state.insights.legendTrials = {
        light: parseInt(light), 
        nature: parseInt(nature), 
        eternity: parseInt(eternity), 
        will: parseInt(will)
    };
    saveInsights();
    renderInsights();
});

document.getElementById('btn-update-arena').addEventListener('click', () => {
    const newVal = prompt("Enter Supreme Arena Rank:", state.insights.supremeArena.rank);
    if (newVal && !isNaN(newVal)) {
        state.insights.supremeArena.rank = parseInt(newVal);
        saveInsights();
        renderInsights();
    }
});

// Run this on page load to populate the HTML with saved data
renderInsights();

    // --- 4. Mobile Menu Toggle ---
    DOM.mobileMenuBtn.addEventListener('click', () => DOM.mobileMenu.classList.remove('hidden'));
    DOM.closeMobileBtn.addEventListener('click', () => DOM.mobileMenu.classList.add('hidden'));

    // --- 5. Modal Logic ---
    const openModal = () => DOM.heroModal.classList.remove('hidden');
    const closeModal = () => {
        DOM.heroModal.classList.add('hidden');
        DOM.heroForm.reset(); // Clear form on close
    };

    DOM.addHeroBtn.addEventListener('click', openModal);
    DOM.closeModalBtn.addEventListener('click', closeModal);
    DOM.cancelModalBtn.addEventListener('click', closeModal);

    // --- 6. Hero Form Handling & Rendering ---
    function renderHeroes() {
        DOM.tableBody.innerHTML = ''; // Clear table
        
        if (state.heroes.length === 0) {
            DOM.tableBody.innerHTML = `<tr><td colspan="6" class="py-6 text-center text-slate-500 italic">No heroes registered in the Resonating Hall yet.</td></tr>`;
            return;
        }

        state.heroes.forEach(hero => {
            const tr = document.createElement('tr');
            tr.classList.add('border-b', 'border-slate-100', 'hover:bg-slate-50', 'transition-colors');
            tr.innerHTML = `
                <td class="py-3 px-4 font-bold text-slate-800">${hero.name}</td>
                <td class="py-3 px-4"><span class="px-2 py-1 bg-slate-100 rounded text-xs">${hero.faction}</span></td>
                <td class="py-3 px-4">${hero.hClass}</td>
                <td class="py-3 px-4 font-bold text-purple-600">${hero.ascension}</td>
                <td class="py-3 px-4">${hero.exWpn}</td>
                <td class="py-3 px-4">${hero.role}</td>
            `;
            DOM.tableBody.appendChild(tr);
        });
        
        updateFactionChart(); // Update chart whenever heroes change
    }

    DOM.heroForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent page reload
        
        const newHero = {
            name: document.getElementById('hero-name').value,
            faction: document.getElementById('hero-faction').value,
            hClass: document.getElementById('hero-class').value,
            ascension: document.getElementById('hero-asc').value,
            exWpn: document.getElementById('hero-ex').value,
            role: document.getElementById('hero-role').value
        };

        state.heroes.push(newHero);
        saveState();
        renderHeroes();
        closeModal();
    });

    // --- 7. Chart.js Initialization (Bonus) ---
    let factionChartInstance = null;

    function updateFactionChart() {
        const ctx = document.getElementById('factionChart');
        if (!ctx) return;

        // Calculate faction distribution from state
        const factionCounts = state.heroes.reduce((acc, hero) => {
            acc[hero.faction] = (acc[hero.faction] || 0) + 1;
            return acc;
        }, {});

        const data = {
            labels: ['Graveborn', 'Mauler', 'Lightbearer', 'Wilder', 'Celestial', 'Hypogean'],
            datasets: [{
                data: [
                    factionCounts['Graveborn'] || 0,
                    factionCounts['Mauler'] || 0,
                    factionCounts['Lightbearer'] || 0,
                    factionCounts['Wilder'] || 0,
                    factionCounts['Celestial'] || 0,
                    factionCounts['Hypogean'] || 0
                ],
                backgroundColor: ['#10b981', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6'],
                borderWidth: 0
            }]
        };

        if (factionChartInstance) {
            factionChartInstance.data = data;
            factionChartInstance.update();
        } else {
            factionChartInstance = new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 12 } }
                    }
                }
            });
        }
    }

    // Initialize application
    renderHeroes(); 
});
