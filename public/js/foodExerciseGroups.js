
/**
 * Nutrition
 */
(function () {
    // Tabs de nutrición
    const nTabs = document.querySelectorAll('.nutrition-days .n-day-tab');
    const nPanels = document.querySelectorAll('.n-day-panel');

    nTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            nTabs.forEach(t => t.classList.remove('active'));
            nPanels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`.n-day-panel[data-day="${tab.dataset.day}"]`).classList.add('active');
        });
    });

    // Añadir filas
    const mealTpl = document.getElementById('meal-row-template');

    function addMeal(containerId) {
        const cont = document.getElementById(containerId);
        const node = mealTpl.content.cloneNode(true);
        cont.appendChild(node);
        renumber(cont);
        attachRecalc(cont);
        updateKpi(cont);
    }

    function renumber(cont) {
        [...cont.querySelectorAll('.meal-row .order')].forEach((el, idx) => el.textContent = idx + 1);
    }

    function sum(cont, selector) {
        return [...cont.querySelectorAll(selector)].reduce((s, el) => {
            const v = parseFloat(el.value || '0');
            return s + (isNaN(v) ? 0 : v);
        }, 0);
    }

    function updateKpi(cont) {
        const panel = cont.closest('.n-day-panel');
        const kpi = panel.querySelector('.day-kpi');
        const kcal = sum(cont, '.meal-kcal');
        const p = sum(cont, '.meal-prot');
        const c = sum(cont, '.meal-carb');
        const g = sum(cont, '.meal-fat');

        const tKcal = +document.getElementById('targetKcal')?.value || 0;
        const tP = +document.getElementById('targetProtein')?.value || 0;
        const tC = +document.getElementById('targetCarb')?.value || 0;
        const tG = +document.getElementById('targetFat')?.value || 0;

        const pct = tKcal ? Math.round((kcal / tKcal) * 100) : 0;
        kpi.textContent = `${kcal} kcal${tKcal ? ` / ${tKcal} (${pct}%)` : ''} | P ${p} g${tP ? `/${tP}` : ''} / C ${c} g${tC ? `/${tC}` : ''} / G ${g} g${tG ? `/${tG}` : ''}`;
    }

    function attachRecalc(cont) {
        cont.addEventListener('input', (e) => {
            if (e.target.matches('.meal-kcal, .meal-prot, .meal-carb, .meal-fat')) {
                updateKpi(cont);
            }
        });
    }

    document.querySelectorAll('.add-meal').forEach(btn => {
        btn.addEventListener('click', () => addMeal(btn.dataset.target));
    });

    // Eliminar fila
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-meal')) {
            const cont = e.target.closest('.n-day-panel').querySelector('.meal-rows');
            e.target.closest('.meal-row').remove();
            renumber(cont);
            updateKpi(cont);
        }
    });

    // Limpiar plan (solo comidas)
    document.getElementById('clearNutrition')?.addEventListener('click', () => {
        document.querySelectorAll('.meal-rows').forEach(cont => { cont.innerHTML = ''; updateKpi(cont); });
    });

    // Recalcular cuando cambian objetivos
    ['targetKcal', 'targetProtein', 'targetCarb', 'targetFat'].forEach(id => {
        document.getElementById(id)?.addEventListener('input', () => {
            document.querySelectorAll('.meal-rows').forEach(cont => updateKpi(cont));
        });
    });

    // Guardar (demo -> JSON)
    document.getElementById('saveNutrition')?.addEventListener('click', () => {
        const payload = {
            name: document.getElementById('dietName')?.value || '',
            start: document.getElementById('dietStart')?.value || '',
            focus: document.getElementById('dietFocus')?.value || '',
            targets: {
                kcal: +document.getElementById('targetKcal')?.value || 0,
                protein: +document.getElementById('targetProtein')?.value || 0,
                carb: +document.getElementById('targetCarb')?.value || 0,
                fat: +document.getElementById('targetFat')?.value || 0
            },
            days: {}
        };

        document.querySelectorAll('.n-day-panel').forEach(panel => {
            const key = panel.dataset.day;
            const rows = [...panel.querySelectorAll('.meal-row')].map(row => ({
                name: row.querySelector('.meal-name')?.value || '',
                time: row.querySelector('.meal-time')?.value || '',
                foods: row.querySelector('.meal-foods')?.value || '',
                kcal: +row.querySelector('.meal-kcal')?.value || 0,
                protein: +row.querySelector('.meal-prot')?.value || 0,
                carb: +row.querySelector('.meal-carb')?.value || 0,
                fat: +row.querySelector('.meal-fat')?.value || 0,
                notes: row.querySelector('.meal-notes')?.value || ''
            }));
            payload.days[key] = rows;
        });

        console.log('Plan nutricional (demo):', payload);
        alert('Plan nutricional preparado para guardar (ver consola). Integra el POST según tu backend.');
    });

    // Semilla UX: 3 comidas en Lunes
    addMeal('meals-mon'); addMeal('meals-mon'); addMeal('meals-mon');
})();

