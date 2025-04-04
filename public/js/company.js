
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