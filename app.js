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
                heroes: JSON.parse(localStorage.getItem('afk_heroes')) || [],
                tasks: JSON.parse(localStorage.getItem('afk_tasks')) || [],
                insights: JSON.parse(localStorage.getItem('afk_insights')) || {
                    afkStage: 1819,
                    durasTrials: { class: 'Ironwall (Tank)', floor: 40, target: 'Mythic' },
                    legendTrials: { light: 141, nature: 141, eternity: 141, will: 141 },
                    supremeArena: { rank: 82 }
                }
            };

            const saveState = () => {
                localStorage.setItem('afk_heroes', JSON.stringify(state.heroes));
                localStorage.setItem('afk_tasks', JSON.stringify(state.tasks));
                localStorage.setItem('afk_insights', JSON.stringify(state.insights));
            };
            
            // --- 3. View Navigation Logic ---
            function switchView(targetId) {
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('nav-active', 'bg-slate-100');
                    if (nav.getAttribute('data-target') === targetId) {
                        nav.classList.add('nav-active', 'bg-slate-100');
                    }
                });

                DOM.views.forEach(view => {
                    if (view.id === targetId) {
                        view.classList.remove('hidden');
                        view.classList.add('active');
                    } else {
                        view.classList.add('hidden');
                        view.classList.remove('active');
                    }
                });

                if (DOM.mobileMenu) DOM.mobileMenu.classList.add('hidden');
            }

            DOM.navItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const target = item.getAttribute('data-target');
                    if (target) switchView(target);
                });
            });

            // --- 4. Strategy Vault Logic ---
            const modeSelector = document.getElementById('mode-selector');
            const bossSelector = document.getElementById('boss-selector');
            const currentBossTitle = document.getElementById('current-boss-title');
            const addCompBtn = document.getElementById('add-comp-btn');
            const formationsContainer = document.getElementById('formations-container');

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

            function updateBossOptions() {
                if (!modeSelector || !bossSelector) return;
                const selectedMode = modeSelector.value;
                const bosses = bossData[selectedMode] || [];
                
                bossSelector.innerHTML = '<option value="" disabled selected>-- Choose Target --</option>';
                
                bosses.forEach(boss => {
                    const option = document.createElement('option');
                    option.value = boss.id;
                    option.textContent = boss.name;
                    bossSelector.appendChild(option);
                });
                
                currentBossTitle.textContent = "Select a Target";
                addCompBtn.classList.add('hidden');
                formationsContainer.innerHTML = `
                    <div class="text-center text-slate-400 py-10 flex flex-col items-center">
                        <span class="text-4xl mb-3">🎯</span>
                        <p>Select a boss to view or record your optimal team compositions.</p>
                    </div>`;
            }

            function renderBossStrategy() {
                const selectedBossName = bossSelector.options[bossSelector.selectedIndex].text;
                currentBossTitle.textContent = selectedBossName;
                addCompBtn.classList.remove('hidden');
                
                formationsContainer.innerHTML = `
                    <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div class="flex items-center space-x-4 w-full md:w-auto">
                            <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-xl shadow-inner border border-indigo-200">🔮</div>
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

            if (modeSelector) modeSelector.addEventListener('change', updateBossOptions);
            if (bossSelector) bossSelector.addEventListener('change', renderBossStrategy);
            updateBossOptions();

            // --- 5. Grind & Task Logic ---
            const dailyTasksContainer = document.getElementById('daily-tasks-container');
            const weeklyTasksContainer = document.getElementById('weekly-tasks-container');
            const addDailyBtn = document.getElementById('add-daily-task-btn');
            const addWeeklyBtn = document.getElementById('add-weekly-task-btn');
            const progressBar = document.getElementById('daily-progress-bar');
            const progressText = document.getElementById('daily-progress-text');

            if (state.tasks.length === 0) {
                state.tasks = [
                    { id: 1, text: "Complete AFK Stage x2", type: "daily", completed: false },
                    { id: 2, text: "Sweep Dura's Trials x3", type: "daily", completed: false },
                    { id: 3, text: "Dream Realm Attacks", type: "daily", completed: false },
                    { id: 4, text: "Purchase Emporium Daily Items", type: "daily", completed: false },
                    { id: 5, text: "Clear Legend Trial Floor x15", type: "weekly", completed: false },
                    { id: 6, text: "Participate in Guild Supremacy x24", type: "weekly", completed: false }
                ];
                saveState();
            }

            function renderTasks() {
                // Null check prevents crashing if you hide the elements!
                if (!dailyTasksContainer || !weeklyTasksContainer) return;

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

                const percentage = dailyTotal === 0 ? 0 : Math.round((dailyCompleted / dailyTotal) * 100);
                if (progressBar) progressBar.style.width = `${percentage}%`;
                if (progressText) progressText.textContent = `${percentage}%`;

                attachTaskListeners();
            }

            function attachTaskListeners() {
                document.querySelectorAll('.task-checkbox').forEach(box => {
                    box.addEventListener('change', (e) => {
                        const taskId = parseInt(e.target.getAttribute('data-id'));
                        const task = state.tasks.find(t => t.id === taskId);
                        if (task) {
                            task.completed = e.target.checked;
                            saveState();
                            renderTasks();
                        }
                    });
                });

                document.querySelectorAll('.edit-task-btn').forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        const taskId = parseInt(e.currentTarget.getAttribute('data-id'));
                        const task = state.tasks.find(t => t.id === taskId);
                        if (task) {
                            const newText = prompt("Modify task:", task.text);
                            if (newText !== null && newText.trim() !== "") {
                                task.text = newText.trim();
                                saveState();
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
                        id: Date.now(),
                        text: text.trim(),
                        type: type,
                        completed: false
                    };
                    state.tasks.push(newTask);
                    saveState();
                    renderTasks();
                }
            }

            if (addDailyBtn) addDailyBtn.addEventListener('click', () => addNewTask('daily'));
            if (addWeeklyBtn) addWeeklyBtn.addEventListener('click', () => addNewTask('weekly'));
            renderTasks();
                
            // --- 6. Mode Insights Logic (Interactive Controls) ---
            function renderInsights() {
                if (!document.getElementById('insight-afk-stage')) return;

                document.getElementById('insight-afk-stage').textContent = state.insights.afkStage;
                document.getElementById('insight-dura-floor').textContent = state.insights.durasTrials.floor;
                document.getElementById('insight-legend-light').textContent = state.insights.legendTrials.light;
                document.getElementById('insight-legend-nature').textContent = state.insights.legendTrials.nature;
                document.getElementById('insight-legend-eternity').textContent = state.insights.legendTrials.eternity;
                document.getElementById('insight-legend-will').textContent = state.insights.legendTrials.will;
                document.getElementById('insight-arena-rank').textContent = state.insights.supremeArena.rank;
            }

            // Global click listener for all + and - buttons
            document.addEventListener('click', (e) => {
                const btn = e.target.closest('button[data-action]');
                if (!btn) return;

                const target = btn.getAttribute('data-target');
                const action = btn.getAttribute('data-action');
                const modifier = action === 'plus' ? 1 : -1;

                switch (target) {
                    case 'afk': state.insights.afkStage += modifier; break;
                    case 'dura': state.insights.durasTrials.floor += modifier; break;
                    case 'light': state.insights.legendTrials.light += modifier; break;
                    case 'nature': state.insights.legendTrials.nature += modifier; break;
                    case 'eternity': state.insights.legendTrials.eternity += modifier; break;
                    case 'will': state.insights.legendTrials.will += modifier; break;
                    case 'arena':
                        let newRank = state.insights.supremeArena.rank + modifier;
                        state.insights.supremeArena.rank = newRank < 1 ? 1 : newRank;
                        break;
                }
                saveState();
                renderInsights();
            });

            renderInsights();

            // --- 7. Mobile Menu & Modal Toggles ---
            if (DOM.mobileMenuBtn) DOM.mobileMenuBtn.addEventListener('click', () => DOM.mobileMenu.classList.remove('hidden'));
            if (DOM.closeMobileBtn) DOM.closeMobileBtn.addEventListener('click', () => DOM.mobileMenu.classList.add('hidden'));

            const openModal = () => { if (DOM.heroModal) DOM.heroModal.classList.remove('hidden'); }
            const closeModal = () => {
                if (DOM.heroModal) DOM.heroModal.classList.add('hidden');
                if (DOM.heroForm) DOM.heroForm.reset();
            };

            if (DOM.addHeroBtn) DOM.addHeroBtn.addEventListener('click', openModal);
            if (DOM.closeModalBtn) DOM.closeModalBtn.addEventListener('click', closeModal);
            if (DOM.cancelModalBtn) DOM.cancelModalBtn.addEventListener('click', closeModal);

            // --- 8. Hero Form Handling & Rendering ---
            function renderHeroes() {
                if (!DOM.tableBody) return;
                DOM.tableBody.innerHTML = ''; 
                
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
                updateFactionChart();
            }

            if (DOM.heroForm) {
                DOM.heroForm.addEventListener('submit', (e) => {
                    e.preventDefault(); 
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
            }

            // --- 9. Chart.js Initialization ---
            let factionChartInstance = null;
            function updateFactionChart() {
                const ctx = document.getElementById('factionChart');
                if (!ctx) return;

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

            // Init Hall
            renderHeroes(); 
        });

