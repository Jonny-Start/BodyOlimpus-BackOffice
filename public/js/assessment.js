/* 
* assessment 
*/
(function () {
    const date = document.getElementById('assessmentDate');
    if (!date.value) {
        const today = new Date().toISOString().slice(0, 10);
        date.value = today;
    }

    document.getElementById('clearMeasurements')?.addEventListener('click', () => {
        const ids = ['weight', 'shoulder', 'chest', 'biceps', 'forearm', 'waist', 'hip', 'thigh', 'midThigh', 'calf', 'neck', 'back', 'abdomen'];
        ids.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
    });
})();


/*
* routine
*/

(function () {
    // Tabs
    const tabs = document.querySelectorAll('.routine-days .day-tab');
    const panels = document.querySelectorAll('.day-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));
            tab.classList.add('active');
            document.querySelector(`.day-panel[data-day="${tab.dataset.day}"]`).classList.add('active');
        });
    });

    // Añadir filas
    const tpl = document.getElementById('exercise-row-template');

    function addRow(containerId) {
        const cont = document.getElementById(containerId);
        const node = tpl.content.cloneNode(true);
        cont.appendChild(node);
        renumber(cont);
        attachRecalc(cont);
        updateSummary(cont);
    }

    // Reasignar índices (#)
    function renumber(cont) {
        [...cont.querySelectorAll('.exercise-row .order')].forEach((el, idx) => {
            el.textContent = idx + 1;
        });
    }

    // Cálculo de volumen (sets*reps sum)
    function calcVolume(cont) {
        return [...cont.querySelectorAll('.exercise-row')].reduce((sum, row) => {
            const s = parseInt(row.querySelector('.ex-sets')?.value || '0', 10);
            const r = parseInt(row.querySelector('.ex-reps')?.value || '0', 10);
            return sum + (isNaN(s) || isNaN(r) ? 0 : s * r);
        }, 0);
    }

    function updateSummary(cont) {
        const panel = cont.closest('.day-panel');
        const summary = panel.querySelector('.day-summary');
        summary.textContent = `Volumen: ${calcVolume(cont)} reps totales`;
    }

    function attachRecalc(cont) {
        cont.addEventListener('input', (e) => {
            if (e.target.matches('.ex-sets, .ex-reps')) updateSummary(cont);
        });
    }

    document.querySelectorAll('.add-row').forEach(btn => {
        btn.addEventListener('click', () => addRow(btn.dataset.target));
    });

    // Delegación para eliminar filas
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-row')) {
            const cont = e.target.closest('.day-panel').querySelector('.exercise-rows');
            e.target.closest('.exercise-row').remove();
            renumber(cont);
            updateSummary(cont);
        }
    });

    // Botón limpiar rutina
    document.getElementById('clearRoutine')?.addEventListener('click', () => {
        document.querySelectorAll('.exercise-rows').forEach(cont => {
            cont.innerHTML = '';
            updateSummary(cont);
        });
    });

    // Guardar (demo: estructura de datos)
    document.getElementById('saveRoutine')?.addEventListener('click', () => {
        const data = {
            name: document.getElementById('routineName')?.value || '',
            start: document.getElementById('routineStart')?.value || '',
            split: document.getElementById('routineSplit')?.value || '',
            days: {}
        };

        document.querySelectorAll('.day-panel').forEach(panel => {
            const dayKey = panel.dataset.day;
            const rows = [...panel.querySelectorAll('.exercise-row')].map(row => ({
                name: row.querySelector('.ex-name')?.value || '',
                sets: +row.querySelector('.ex-sets')?.value || 0,
                reps: +row.querySelector('.ex-reps')?.value || 0,
                tempo: row.querySelector('.ex-tempo')?.value || '',
                rest_between_sets: +row.querySelector('.ex-rest')?.value || 0,
                rest_between_exercises: +row.querySelector('.ex-between')?.value || 0,
                rpe_rir: row.querySelector('.ex-rpe')?.value || '',
                notes: row.querySelector('.ex-notes')?.value || ''
            }));
            data.days[dayKey] = rows;
        });

        // Aquí puedes hacer un fetch/POST a tu endpoint
        // fetch('/api/routines', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(data) })
        //   .then(r => r.json()).then(console.log).catch(console.error);

        console.log('Rutina guardada (demo):', data);
        alert('Rutina preparada para guardar (ver consola). Integra el POST según tu backend.');
    });

    // Autosemilla: añade 3 filas al lunes por UX
    addRow('rows-mon');
    addRow('rows-mon');
    addRow('rows-mon');
})();


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



/**
 * Supplementation
 */
(function () {
    const tpl = document.getElementById('supp-row-template');
    const rows = document.getElementById('suppRows');
    const cafTotalEl = document.getElementById('caffeineTotal');

    function addRow() {
        const node = tpl.content.cloneNode(true);
        rows.appendChild(node);
        renumber();
        recalcCaffeine();
    }

    function renumber() {
        [...rows.querySelectorAll('.supp-row .order')].forEach((el, i) => el.textContent = i + 1);
    }

    function recalcCaffeine() {
        const total = [...rows.querySelectorAll('.sup-caffeine')].reduce((s, el) => {
            const v = parseFloat(el.value || '0'); return s + (isNaN(v) ? 0 : v);
        }, 0);
        cafTotalEl.textContent = total;
    }

    // Eventos
    document.getElementById('addSupp')?.addEventListener('click', addRow);

    document.body.addEventListener('input', (e) => {
        if (e.target.classList.contains('sup-caffeine')) recalcCaffeine();
    });

    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-supp')) {
            e.target.closest('.supp-row').remove();
            renumber();
            recalcCaffeine();
        }
    });

    document.getElementById('clearSupp')?.addEventListener('click', () => {
        rows.innerHTML = '';
        recalcCaffeine();
    });

    document.getElementById('saveSupp')?.addEventListener('click', () => {
        const data = {
            name: document.getElementById('stackName')?.value || '',
            start: document.getElementById('stackStart')?.value || '',
            cycle_weeks: +document.getElementById('stackCycle')?.value || 0,
            notes: document.getElementById('stackNotes')?.value || '',
            items: [...rows.querySelectorAll('.supp-row')].map(r => ({
                name: r.querySelector('.sup-name')?.value || '',
                dose: r.querySelector('.sup-dose')?.value || '',
                form: r.querySelector('.sup-form')?.value || '',
                frequency: r.querySelector('.sup-frequency')?.value || '',
                timing: r.querySelector('.sup-timing')?.value || '',
                time: r.querySelector('.sup-time')?.value || '',
                days: [...r.querySelectorAll('.sup-days input:checked')].map(ch => ch.value),
                caffeine_mg: +r.querySelector('.sup-caffeine')?.value || 0,
                notes: r.querySelector('.sup-notes')?.value || ''
            })),
            caffeine_total_mg: +cafTotalEl.textContent || 0
        };

        console.log('Suplementación (demo):', data);
        alert('Suplementación preparada para guardar (ver consola). Integra el POST según tu backend.');
    });

    // Semilla UX: una fila por defecto
    addRow();
})();
