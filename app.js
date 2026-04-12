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
