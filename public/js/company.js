
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
