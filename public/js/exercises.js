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