
// Función para mostrar la vista previa de la imagen
function previewImage(event) {
    const file = event.target.files[0];
    if (file && file.size <= 200 * 1024 * 1024 && (file.type === 'image/png' || file.type === 'image/jpeg')) { // Verificar tamaño y tipo de archivo
        const reader = new FileReader();
        reader.onload = function () {
            const span = document.getElementById('contentLetter_plan');
            span.style.backgroundImage = `url(${reader.result})`; // Asignar la imagen como fondo
            span.style.backgroundSize = 'cover'; // Ajustar el tamaño del fondo
            span.textContent = ''; // Limpiar el contenido de texto
        };
        reader.readAsDataURL(file);
    } else {
        alert('Por favor, seleccione una imagen JPG o PNG de máximo 200MB.');
        event.target.value = ''; // Limpiar la selección del archivo
    }
}

// Función para arrastrar y soltar la imagen
const fileInput = document.getElementById('fileInput_plan');
const fileLabel = document.getElementById('contentLetter_plan');

if (fileLabel) {
    fileLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileLabel.classList.add('dragging');
    });

    fileLabel.addEventListener('dragleave', () => {
        fileLabel.classList.remove('dragging');
    });

    fileLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        fileLabel.classList.remove('dragging');
        const file = e.dataTransfer.files[0];
        fileInput.files = e.dataTransfer.files; // Asignar el archivo al input
        previewImage({
            target: {
                files: [file]
            }
        }); // Mostrar la vista previa de la imagen
    });
}

/**
 * Toggle de método de pago — Opción A: acción inmediata por checkbox
 *
 * Checked   → POST /api/paymentMethods/company  (crear asociación)
 * Unchecked → DELETE /api/paymentMethods/company/:id (eliminar asociación)
 *
 * En caso de error revierte el estado visual del checkbox.
 */
async function togglePaymentMethod(checkbox) {
    const paymentMethodId        = parseInt(checkbox.dataset.paymentMethodId);
    const companyId              = parseInt(checkbox.dataset.companyId);
    let   companyPaymentMethodId = checkbox.dataset.companyPaymentMethodId
                                     ? parseInt(checkbox.dataset.companyPaymentMethodId)
                                     : null;

    // Deshabilitar mientras se procesa para evitar doble clic
    checkbox.disabled = true;

    try {
        if (checkbox.checked) {
            // ── CREAR asociación ──────────────────────────────────────────
            const response = await httpRequest('/api/paymentMethods/company', {
                method: 'POST',
                body: { company_id: companyId, payment_method_id: paymentMethodId, available: true }
            });

            // Guardar el nuevo ID para futuras operaciones (toggle off / delete)
            if (response && response.data && response.data.company_payment_method_id) {
                checkbox.dataset.companyPaymentMethodId = response.data.company_payment_method_id;
            }

        } else {
            // ── ELIMINAR asociación ───────────────────────────────────────
            if (!companyPaymentMethodId) {
                console.error('No se encontró el ID de la asociación para eliminar.');
                checkbox.checked = true; // Revertir estado
                return;
            }
            await httpRequest(`/api/paymentMethods/company/${companyPaymentMethodId}`, {
                method: 'DELETE'
            });

            // Limpiar el ID guardado
            checkbox.dataset.companyPaymentMethodId = '';
        }

    } catch (error) {
        console.error('Error al actualizar método de pago:', error);
        // Revertir el estado visual del checkbox
        checkbox.checked = !checkbox.checked;
    } finally {
        checkbox.disabled = false;
    }
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HORARIOS DE DISPONIBILIDAD
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Mapa de day_of_week → id del div de horario
const DAY_TIME_MAP = {
    1: 'monday_time',
    2: 'tuesday_time',
    3: 'wednesday_time',
    4: 'thursday_time',
    5: 'friday_time',
    6: 'saturday_time',
    7: 'sunday_time',
};

/**
 * Muestra/oculta los inputs de horario al marcar/desmarcar un día.
 * @param {number} dayNumber - Número del día (1-7)
 */
function toggleDaySchedule(dayNumber) {
    const timeDiv = document.getElementById(DAY_TIME_MAP[dayNumber]);
    const checkbox = document.getElementById(`day_${dayNumber}`);

    if (!timeDiv || !checkbox) return;

    if (checkbox.checked) {
        timeDiv.classList.add('active');
    } else {
        timeDiv.classList.remove('active');
    }
}

/**
 * Recolecta los datos de los 7 días y los envía al backend.
 */
async function saveSchedules() {
    const companyId = document.getElementById('schedule_company_id')?.value;
    if (!companyId) {
        console.error('No se encontró el ID de la compañía.');
        return;
    }

    const saveBtn = document.getElementById('saveSchedules');
    const originalText = saveBtn.innerText;

    // Deshabilitar el botón y mostrar estado de carga
    saveBtn.disabled = true;
    saveBtn.innerText = 'Guardando...';

    const schedules = [];

    for (let day = 1; day <= 7; day++) {
        const checkbox = document.getElementById(`day_${day}`);
        const openTimeInput = document.getElementById(`open_time_${day}`);
        const closeTimeInput = document.getElementById(`close_time_${day}`);

        const isOpen = checkbox ? checkbox.checked : false;
        const openTime = openTimeInput ? openTimeInput.value : null;
        const closeTime = closeTimeInput ? closeTimeInput.value : null;

        schedules.push({
            day_of_week: day,
            is_open: isOpen,
            open_time: isOpen && openTime ? openTime : null,
            close_time: isOpen && closeTime ? closeTime : null,
        });
    }

    try {
        await httpRequest(`/api/schedules/company/${companyId}`, {
            method: 'PUT',
            body: { schedules }
        });

        // Feedback de éxito
        saveBtn.innerText = '✓ Guardado';
        saveBtn.classList.add('btn-success');

        setTimeout(() => {
            saveBtn.innerText = originalText;
            saveBtn.classList.remove('btn-success');
        }, 2000);

    } catch (error) {
        console.error('Error al guardar horarios:', error);

        // Feedback de error
        saveBtn.innerText = '✗ Error';
        saveBtn.classList.add('btn-error');

        setTimeout(() => {
            saveBtn.innerText = originalText;
            saveBtn.classList.remove('btn-error');
        }, 3000);
    } finally {
        saveBtn.disabled = false;
    }
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PLANES DE PRECIOS
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Recolecta los valores de los planes y los envía al backend.
 */
async function updatePlans() {
    const priceDayInput = document.getElementById('price_day');
    const priceMonthInput = document.getElementById('price_month');
    const priceBimonthlyInput = document.getElementById('price_bimonthly');
    const saveBtn = document.getElementById('updatePlansBtn');

    if (!priceDayInput || !priceMonthInput || !priceBimonthlyInput || !saveBtn) return;

    // Validar que se hayan llenado
    if (!priceDayInput.value || !priceMonthInput.value || !priceBimonthlyInput.value) {
        alert("Por favor, llene todos los campos de los planes.");
        return;
    }

    const originalText = saveBtn.innerText;
    saveBtn.disabled = true;
    saveBtn.innerText = 'Actualizando...';

    const body = {
        price_day: parseFloat(priceDayInput.value),
        price_month: parseFloat(priceMonthInput.value),
        price_bimonthly: parseFloat(priceBimonthlyInput.value)
    };

    try {
        const response = await httpRequest('/api/company/plans', {
            method: 'PUT',
            body: body
        });

        if (response && response.error) {
            throw new Error(response.error);
        }

        saveBtn.innerText = '✓ Actualizado';
        saveBtn.classList.add('btn-success');
        
        // Recargar iframe de la factura si existe
        const invoiceIframe = document.getElementById('invoiceIframe');
        if (invoiceIframe) {
            invoiceIframe.src = invoiceIframe.src;
        }

        setTimeout(() => {
            saveBtn.innerText = originalText;
            saveBtn.classList.remove('btn-success');
        }, 2000);

    } catch (error) {
        console.error('Error al actualizar planes:', error);
        saveBtn.innerText = '✗ Error';
        saveBtn.classList.add('btn-error');

        setTimeout(() => {
            saveBtn.innerText = originalText;
            saveBtn.classList.remove('btn-error');
        }, 3000);
    } finally {
        saveBtn.disabled = false;
    }
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  RESOLUCIONES DIAN (Vista Legal)
 * ─────────────────────────────────────────────────────────────────────────────
 */

// Solo ejecutar si estamos en la vista legal (el elemento existe en el DOM)
(function initResolutions() {
    const tableBody = document.getElementById('resolutionsTableBody');
    if (!tableBody) return; // No estamos en la vista legal

    const companyId = window.RESOLUTION_COMPANY_ID;
    const emptyState = document.getElementById('emptyState');
    const searchInput = document.getElementById('searchResolution');
    const filterSelect = document.getElementById('filterStatus');
    const btnAdd = document.getElementById('btn-add-resolution');

    // Modal de formulario
    const modal = document.getElementById('modalResolution');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('formResolution');
    const resolutionIdInput = document.getElementById('resolutionId');
    const resolutionNumberInput = document.getElementById('resolutionNumber');
    const resolutionDateInput = document.getElementById('resolutionDate');
    const expirationDateInput = document.getElementById('expirationDate');
    const resolutionStatusSelect = document.getElementById('resolutionStatus');
    const btnCancel = document.getElementById('btnCancelResolution');
    const btnSave = document.getElementById('btnSaveResolution');

    // Modal de confirmación de eliminación
    const modalDelete = document.getElementById('modalDeleteConfirm');
    const deleteIdInput = document.getElementById('deleteResolutionId');
    const btnConfirmDelete = document.getElementById('btnConfirmDelete');
    const btnCancelDelete = document.getElementById('btnCancelDelete');

    // Cache de resoluciones cargadas
    let allResolutions = [];

    /**
     * Formatea una fecha ISO a formato legible (YYYY-MM-DD).
     */
    function formatDate(dateStr) {
        if (!dateStr) return '—';
        const date = new Date(dateStr);
        return date.toISOString().split('T')[0];
    }

    /**
     * Determina si una resolución está vencida basándose en la fecha de vencimiento.
     */
    function isExpired(expirationDate) {
        return new Date(expirationDate) < new Date();
    }

    /**
     * Renderiza las filas de la tabla con las resoluciones proporcionadas.
     */
    function renderTable(resolutions) {
        tableBody.innerHTML = '';

        if (resolutions.length === 0) {
            emptyState.style.display = 'flex';
            return;
        }

        emptyState.style.display = 'none';

        resolutions.forEach((res, index) => {
            const expired = isExpired(res.expiration_date);
            const isActive = res.active && !expired;
            const statusLabel = isActive ? 'Activa' : 'Inactiva';
            const badgeClass = isActive ? 'badge-active' : 'badge-inactive';

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${res.resolution_number}</td>
                <td>${formatDate(res.resolution_date)}</td>
                <td>${formatDate(res.expiration_date)}</td>
                <td><span class="badge ${badgeClass}">${statusLabel}</span></td>
                <td>
                    <button class="btn-edit" title="Editar" onclick="editResolution(${res.resolution_id})">
                        <ion-icon name="edit"></ion-icon>
                    </button>
                    <button class="btn-delete" title="Eliminar" onclick="confirmDeleteResolution(${res.resolution_id})">
                        <ion-icon name="trash"></ion-icon>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    /**
     * Carga las resoluciones desde la API.
     */
    async function loadResolutions() {
        if (!companyId) {
            console.error('No se encontró el ID de la compañía para cargar resoluciones.');
            renderTable([]);
            return;
        }

        try {
            const response = await httpRequest(`/api/resolutions/company/${companyId}`, {
                method: 'GET'
            });

            allResolutions = response.data || [];
            applyFilters();
        } catch (error) {
            console.error('Error al cargar resoluciones:', error);
            allResolutions = [];
            renderTable([]);
        }
    }

    /**
     * Aplica los filtros de búsqueda y estado sobre las resoluciones cargadas.
     */
    function applyFilters() {
        const searchText = (searchInput.value || '').toLowerCase().trim();
        const statusFilter = filterSelect.value;

        let filtered = allResolutions;

        // Filtro por texto
        if (searchText) {
            filtered = filtered.filter(r =>
                r.resolution_number.toLowerCase().includes(searchText)
            );
        }

        // Filtro por estado
        if (statusFilter !== 'all') {
            const isActiveFilter = statusFilter === '1';
            filtered = filtered.filter(r => {
                const expired = isExpired(r.expiration_date);
                const isActive = r.active && !expired;
                return isActive === isActiveFilter;
            });
        }

        renderTable(filtered);
    }

    /**
     * Abre el modal en modo "Agregar".
     */
    function openAddModal() {
        modalTitle.textContent = 'Agregar Resolución DIAN';
        resolutionIdInput.value = '';
        form.reset();
        resolutionStatusSelect.value = '1';
        btnSave.textContent = 'Guardar';
        modal.style.display = 'flex';
    }

    /**
     * Abre el modal en modo "Editar" con datos precargados.
     */
    window.editResolution = function(id) {
        const resolution = allResolutions.find(r => r.resolution_id === id);
        if (!resolution) return;

        modalTitle.textContent = 'Editar Resolución DIAN';
        resolutionIdInput.value = resolution.resolution_id;
        resolutionNumberInput.value = resolution.resolution_number;
        resolutionDateInput.value = resolution.resolution_date ? formatDate(resolution.resolution_date) : '';
        expirationDateInput.value = formatDate(resolution.expiration_date);
        resolutionStatusSelect.value = resolution.active ? '1' : '0';
        btnSave.textContent = 'Actualizar';
        modal.style.display = 'flex';
    };

    /**
     * Abre el modal de confirmación de eliminación.
     */
    window.confirmDeleteResolution = function(id) {
        deleteIdInput.value = id;
        modalDelete.style.display = 'flex';
    };

    /**
     * Cierra un modal.
     */
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
    }

    /**
     * Guarda (crea o actualiza) una resolución.
     */
    async function saveResolution(e) {
        e.preventDefault();

        const id = resolutionIdInput.value;
        const isEdit = !!id;
        const originalText = btnSave.textContent;

        // Validación básica
        if (!resolutionNumberInput.value.trim()) {
            alert('El número de resolución es requerido.');
            return;
        }
        if (!expirationDateInput.value) {
            alert('La fecha de vencimiento es requerida.');
            return;
        }

        btnSave.disabled = true;
        btnSave.textContent = isEdit ? 'Actualizando...' : 'Guardando...';

        const body = {
            resolution_number: resolutionNumberInput.value.trim(),
            resolution_date: resolutionDateInput.value || null,
            expiration_date: expirationDateInput.value,
            active: resolutionStatusSelect.value === '1'
        };

        try {
            if (isEdit) {
                await httpRequest(`/api/resolutions/${id}`, {
                    method: 'PUT',
                    body: body
                });
            } else {
                await httpRequest(`/api/resolutions/company/${companyId}`, {
                    method: 'POST',
                    body: body
                });
            }

            closeModal(modal);
            form.reset();
            await loadResolutions();

        } catch (error) {
            console.error('Error al guardar resolución:', error);
            alert('Error al guardar la resolución. Intenta nuevamente.');
        } finally {
            btnSave.disabled = false;
            btnSave.textContent = originalText;
        }
    }

    /**
     * Elimina una resolución tras confirmación.
     */
    async function performDelete() {
        const id = deleteIdInput.value;
        if (!id) return;

        const btnDelete = btnConfirmDelete;
        const originalText = btnDelete.textContent;
        btnDelete.disabled = true;
        btnDelete.textContent = 'Eliminando...';

        try {
            await httpRequest(`/api/resolutions/${id}`, {
                method: 'DELETE'
            });

            closeModal(modalDelete);
            await loadResolutions();

        } catch (error) {
            console.error('Error al eliminar resolución:', error);
            alert('Error al eliminar la resolución. Intenta nuevamente.');
        } finally {
            btnDelete.disabled = false;
            btnDelete.textContent = originalText;
        }
    }

    // ─── Event Listeners ──────────────────────────────────────────────────

    // Botón Agregar
    btnAdd.addEventListener('click', openAddModal);

    // Formulario submit
    form.addEventListener('submit', saveResolution);

    // Cancelar formulario
    btnCancel.addEventListener('click', () => {
        closeModal(modal);
        form.reset();
    });

    // Confirmar eliminación
    btnConfirmDelete.addEventListener('click', performDelete);

    // Cancelar eliminación
    btnCancelDelete.addEventListener('click', () => closeModal(modalDelete));

    // Filtros en tiempo real
    searchInput.addEventListener('input', applyFilters);
    filterSelect.addEventListener('change', applyFilters);

    // Cerrar modales al hacer clic fuera del contenido
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal(modal);
            form.reset();
        }
    });
    modalDelete.addEventListener('click', (e) => {
        if (e.target === modalDelete) closeModal(modalDelete);
    });

    // ─── Inicialización ───────────────────────────────────────────────────
    loadResolutions();

})();
