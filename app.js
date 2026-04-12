const STORAGE_KEY = 'afkj_command_center_state_v1';

const defaultState = {
	tasks: {
		daily: [
			{ id: 'd1', label: 'Claim AFK Rewards (Min. 2 times a day)', checked: false },
			{ id: 'd2', label: 'Fast Rewards (Use free + 50/100 diamond attempts)', checked: false },
			{ id: 'd3', label: 'Dream Realm: Attack Boss (Check Strategy Vault)', checked: false },
			{ id: 'd4', label: 'Arena: Spend daily free tickets', checked: false },
			{ id: 'd5', label: 'Guild: Claim chests & complete guild quests', checked: false },
			{ id: 'd6', label: 'Homestead: Harvest crops & queue crafting', checked: false },
			{ id: 'd7', label: 'World Map: Hunt corrupted & collect ground loot', checked: false },
			{ id: 'd8', label: 'Friends: Send and receive Companion Points', checked: false }
		],
		weekly: [
			{ id: 'w1', label: 'Arcane Labyrinth: Clear current floors (Wed/Sun)', checked: false },
			{ id: 'w2', label: 'Legend Trial: Push Faction Towers', checked: false },
			{ id: 'w3', label: 'Honor Duel: Claim weekly 15 wins rewards', checked: false },
			{ id: 'w4', label: 'Battle Drill: Use stamina (If active)', checked: false },
			{ id: 'w5', label: 'Emporium: Buy weekly discounted items', checked: false }
		],
		wishlist: [
			{ id: 'wl1', label: 'Dream Realm Store: Odie copies', checked: true },
			{ id: 'wl2', label: 'Arena Store: Hewynn copies', checked: false },
			{ id: 'wl3', label: 'Guild Store: Stargaze Crystals (Monthly)', checked: false }
		]
	},
	heroes: [
		{ name: 'Cecia', faction: 'Graveborn', class: 'Marksman', asc: 'Mythic+', ex: '+5', role: '🌟 High (Carry)' },
		{ name: 'Thoran', faction: 'Graveborn', class: 'Tank', asc: 'Supreme', ex: '+10', role: '🌟 High (Tank/Cheese)' },
		{ name: 'Smokey', faction: 'Mauler', class: 'Support', asc: 'Mythic+', ex: '+5', role: '🌟 High (Healer)' },
		{ name: 'Odie', faction: 'Mauler', class: 'Marksman', asc: 'Supreme+', ex: '+10', role: '🔥 Boss Killer' },
		{ name: 'Reiner', faction: 'Celestial', class: 'Support', asc: 'Mythic', ex: '+0', role: '🔮 Meta Utility' }
	],
	buildings: [
		{ name: 'Mansion', level: 5, mat: '500 Wood, 200 Stone', status: 'Maxed', statusIcon: '🟢', queue: 'N/A' },
		{ name: 'Kitchen', level: 4, mat: '150 Wood', status: 'Upgrading', statusIcon: '🟡', queue: 'HP Potions (2h)' },
		{ name: 'Forge', level: 4, mat: '200 Iron', status: 'Need Mats', statusIcon: '🔴', queue: 'Silver Armor' },
		{ name: 'Alchemy', level: 3, mat: '100 Herbs', status: 'Idle', statusIcon: '🟢', queue: 'Buff Scrolls' }
	],
	bosses: [
		{ id: 'b1', name: 'Skyclops', faction: 'Graveborn', dmg: '15.2 Billion', team: ['Odie', 'Smokey', 'Thoran', 'Cecia', 'Koko'], icon: '🦅' },
		{ id: 'b2', name: 'Snow Stomper', faction: 'Mauler', dmg: '12.5 Billion', team: ['Marilee', 'Korin', 'Smokey', 'Reinier', 'Shakir'], icon: '🐺' },
		{ id: 'b3', name: 'Necrodrakon', faction: 'Lightbearer', dmg: '14.1 Billion', team: ['Temesia', 'Smokey', 'Korin', 'Vala', 'Koko'], icon: '🐉' },
		{ id: 'b4', name: 'King Croaker', faction: 'Wilder', dmg: '11.0 Billion', team: ['Thoran', 'Odie', 'Smokey', 'Marilee', 'Cassadee'], icon: '🐸' }
	],
	charts: {}
};

function loadState() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return structuredClone(defaultState);
		const parsed = JSON.parse(raw);
		return { ...structuredClone(defaultState), ...parsed };
	} catch {
		return structuredClone(defaultState);
	}
}

function saveState() {
	const toSave = { ...state };
	delete toSave.charts;
	localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
}

const state = loadState();

const factionColors = {
	Graveborn: '#68D391',
	Mauler: '#F6AD55',
	Lightbearer: '#63B3ED',
	Wilder: '#F687B3',
	Celestial: '#D69E2E',
	Hypogean: '#9F7AEA'
};

function initNav() {
	const navItems = document.querySelectorAll('.nav-item, .mobile-nav-item');
	const views = document.querySelectorAll('.view-section');
	const mobileMenu = document.getElementById('mobile-menu');

	navItems.forEach(item => {
		item.addEventListener('click', e => {
			e.preventDefault();
			const targetId = item.getAttribute('data-target');

			views.forEach(v => v.classList.add('hidden'));
			document.getElementById(targetId).classList.remove('hidden');

			document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('nav-active', 'bg-slate-200'));

			if (item.classList.contains('nav-item')) {
				item.classList.add('nav-active', 'bg-slate-200');
			} else {
				const desktopEquivalent = document.querySelector(`.nav-item[data-target="${targetId}"]`);
				if (desktopEquivalent) desktopEquivalent.classList.add('nav-active');
				mobileMenu.classList.add('hidden');
			}

			if (targetId === 'view-heroes' || targetId === 'view-treasury') {
				setTimeout(() => {
					if (state.charts.faction) state.charts.faction.resize();
					if (state.charts.diamond) state.charts.diamond.resize();
				}, 100);
			}
		});
	});

	document.getElementById('mobile-menu-btn').addEventListener('click', () => mobileMenu.classList.remove('hidden'));
	document.getElementById('close-mobile-menu').addEventListener('click', () => mobileMenu.classList.add('hidden'));
}

function createCheckbox(task) {
	const div = document.createElement('div');
	div.className = 'flex items-start cursor-pointer group';
	div.onclick = () => {
		task.checked = !task.checked;
		saveState();
		renderTasks();
	};

	const checkWrapper = document.createElement('div');
	checkWrapper.className = 'relative mt-1 mr-3';

	const input = document.createElement('input');
	input.type = 'checkbox';
	input.checked = task.checked;
	input.className = 'opacity-0 absolute h-0 w-0 checkbox-custom';

	const box = document.createElement('div');
	box.className = `w-5 h-5 border-2 rounded transition-colors ${task.checked ? 'bg-green-600 border-green-600' : 'border-slate-300 group-hover:border-slate-400'}`;
	if (task.checked) box.innerHTML = '<span class="absolute text-white text-xs top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">✓</span>';

	const label = document.createElement('span');
	label.className = `text-slate-700 ${task.checked ? 'line-through text-slate-400' : ''}`;
	label.textContent = task.label;

	checkWrapper.appendChild(input);
	checkWrapper.appendChild(box);
	div.appendChild(checkWrapper);
	div.appendChild(label);

	return div;
}

function renderTasks() {
	const dc = document.getElementById('daily-tasks-container');
	const wc = document.getElementById('weekly-tasks-container');
	const wlc = document.getElementById('wishlist-container');

	dc.innerHTML = '';
	wc.innerHTML = '';
	wlc.innerHTML = '';

	let dailyDone = 0;
	state.tasks.daily.forEach(t => {
		dc.appendChild(createCheckbox(t));
		if (t.checked) dailyDone++;
	});

	state.tasks.weekly.forEach(t => wc.appendChild(createCheckbox(t)));
	state.tasks.wishlist.forEach(t => wlc.appendChild(createCheckbox(t)));

	const percent = Math.round((dailyDone / state.tasks.daily.length) * 100);
	document.getElementById('daily-progress-bar').style.width = `${percent}%`;
	document.getElementById('daily-progress-text').textContent = `${percent}%`;

	const bar = document.getElementById('daily-progress-bar');
	if (percent === 100) {
		bar.classList.replace('bg-yellow-500', 'bg-green-500');
		document.getElementById('daily-progress-text').classList.replace('text-yellow-600', 'text-green-600');
	} else {
		bar.classList.replace('bg-green-500', 'bg-yellow-500');
		document.getElementById('daily-progress-text').classList.replace('text-green-600', 'text-yellow-600');
	}
}

function renderHeroes() {
	const tbody = document.getElementById('hero-table-body');
	const filter = document.getElementById('faction-filter');

	if (filter.options.length === 1) {
		const factions = [...new Set(state.heroes.map(h => h.faction))];
		factions.forEach(f => {
			const opt = document.createElement('option');
			opt.value = f;
			opt.textContent = f;
			filter.appendChild(opt);
		});
		filter.addEventListener('change', renderHeroes);
	}

	const activeFilter = filter.value;
	tbody.innerHTML = '';

	state.heroes.forEach(h => {
		if (activeFilter !== 'All' && h.faction !== activeFilter) return;

		const tr = document.createElement('tr');
		tr.className = 'border-b border-slate-100 hover:bg-slate-50 transition-colors';
		tr.innerHTML = `
			<td class="py-3 px-4 font-bold text-slate-800">${h.name}</td>
			<td class="py-3 px-4"><span class="px-2 py-1 rounded text-xs text-white" style="background-color: ${factionColors[h.faction] || '#A0AEC0'}">${h.faction}</span></td>
			<td class="py-3 px-4 text-slate-600">${h.class}</td>
			<td class="py-3 px-4 font-semibold text-purple-700">${h.asc}</td>
			<td class="py-3 px-4 text-slate-600">${h.ex}</td>
			<td class="py-3 px-4 text-slate-800">${h.role}</td>
		`;
		tbody.appendChild(tr);
	});
}

function renderHomestead() {
	const container = document.getElementById('buildings-container');
	container.innerHTML = '';

	state.buildings.forEach(b => {
		const lvlPercent = (b.level / 5) * 100;
		let barColor = 'bg-blue-500';
		if (b.status === 'Maxed') barColor = 'bg-green-500';
		if (b.status === 'Need Mats') barColor = 'bg-red-500';

		const card = document.createElement('div');
		card.className = 'bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow';
		card.innerHTML = `
			<div class="flex justify-between items-start mb-3">
				<h4 class="font-bold text-lg text-slate-800">${b.name}</h4>
				<span class="text-xs font-bold px-2 py-1 rounded bg-slate-100 border border-slate-200">Lvl ${b.level}</span>
			</div>
			<div class="w-full bg-slate-200 rounded-full h-1.5 mb-4">
				<div class="${barColor} h-1.5 rounded-full" style="width: ${lvlPercent}%"></div>
			</div>
			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span class="text-slate-500">Status:</span>
					<span class="font-semibold text-slate-700">${b.statusIcon} ${b.status}</span>
				</div>
				<div class="flex justify-between border-t border-slate-100 pt-2">
					<span class="text-slate-500">Queue:</span>
					<span class="font-medium text-slate-800 truncate ml-2 max-w-[120px]" title="${b.queue}">${b.queue}</span>
				</div>
				<div class="flex justify-between border-t border-slate-100 pt-2">
					<span class="text-slate-500">Cost:</span>
					<span class="font-medium text-slate-600 text-xs text-right ml-2">${b.mat}</span>
				</div>
			</div>
		`;
		container.appendChild(card);
	});
}

function renderBosses() {
	const selector = document.getElementById('boss-selector');
	selector.innerHTML = '';

	state.bosses.forEach((boss, index) => {
		const btn = document.createElement('button');
		btn.className = 'w-full text-left px-4 py-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors flex justify-between items-center';
		if (index === 0) btn.classList.add('border-blue-400', 'bg-blue-50');

		btn.innerHTML = `<span class="font-bold text-slate-700">${boss.icon} ${boss.name}</span> <span class="text-xs text-slate-400">View ➔</span>`;

		btn.onclick = () => {
			document.querySelectorAll('#boss-selector button').forEach(b => {
				b.classList.remove('border-blue-400', 'bg-blue-50');
				b.classList.add('border-slate-200', 'bg-white');
			});
			btn.classList.remove('border-slate-200', 'bg-white');
			btn.classList.add('border-blue-400', 'bg-blue-50');
			showBossDetails(boss);
		};

		selector.appendChild(btn);
	});

	if (state.bosses.length > 0) showBossDetails(state.bosses[0]);
}

function showBossDetails(boss) {
	const details = document.getElementById('boss-details');

	const teamHTML = boss.team
		.map(member => {
			const heroData = state.heroes.find(h => h.name === member);
			const color = heroData ? factionColors[heroData.faction] : '#CBD5E1';
			return `<div class="flex flex-col items-center p-3 border border-slate-100 rounded-lg shadow-sm bg-white">
				<div class="w-12 h-12 rounded-full mb-2 flex items-center justify-center text-white font-bold text-lg shadow-inner" style="background-color: ${color}">${member.charAt(0)}</div>
				<span class="text-sm font-bold text-slate-800">${member}</span>
			</div>`;
		})
		.join('');

	details.innerHTML = `
		<div class="bg-slate-50 rounded-xl p-6 border border-slate-200 h-full">
			<div class="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
				<div class="flex items-center">
					<span class="text-4xl mr-4">${boss.icon}</span>
					<div>
						<h3 class="text-2xl font-bold heading-font text-slate-800">${boss.name}</h3>
						<p class="text-sm text-slate-500">Best Faction: <span class="font-bold" style="color: ${factionColors[boss.faction]}">${boss.faction}</span></p>
					</div>
				</div>
				<div class="text-right">
					<p class="text-xs text-slate-400 uppercase tracking-wide">Personal Record</p>
					<p class="text-xl font-bold text-slate-800">${boss.dmg}</p>
				</div>
			</div>

			<h4 class="font-bold text-slate-700 mb-4 uppercase text-sm tracking-wider">Optimal Team Synergy</h4>
			<div class="grid grid-cols-2 md:grid-cols-5 gap-3">${teamHTML}</div>
		</div>
	`;
}

function initCharts() {
	const fCtx = document.getElementById('factionChart').getContext('2d');
	const factionCounts = {};
	state.heroes.forEach(h => (factionCounts[h.faction] = (factionCounts[h.faction] || 0) + 1));
	const labels = Object.keys(factionCounts);
	const data = Object.values(factionCounts);
	const bgColors = labels.map(l => factionColors[l]);

	state.charts.faction = new Chart(fCtx, {
		type: 'doughnut',
		data: { labels, datasets: [{ data, backgroundColor: bgColors, borderWidth: 0 }] },
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: { legend: { position: 'bottom', labels: { boxWidth: 12, padding: 15 } } },
			cutout: '65%'
		}
	});

	const dCtx = document.getElementById('diamondChart').getContext('2d');
	const currentDiamonds = 15400;
	const goalDiamonds = 30000;
	const remaining = Math.max(0, goalDiamonds - currentDiamonds);

	state.charts.diamond = new Chart(dCtx, {
		type: 'doughnut',
		data: {
			labels: ['Current', 'Remaining Goal'],
			datasets: [{ data: [currentDiamonds, remaining], backgroundColor: ['#D69E2E', '#EDF2F7'], borderWidth: 0 }]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			circumference: 180,
			rotation: 270,
			plugins: {
				legend: { display: false },
				tooltip: { callbacks: { label: ctx => ' ' + ctx.raw.toLocaleString() + ' 💎' } }
			},
			cutout: '80%'
		}
	});
}

document.addEventListener('DOMContentLoaded', () => {
	initNav();
	renderTasks();
	renderHeroes();
	renderHomestead();
	renderBosses();
	initCharts();
});
