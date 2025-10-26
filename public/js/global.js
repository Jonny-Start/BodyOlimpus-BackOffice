/**
 * Funcionalidad global para deshabilitar el botón de envío al enviar un formulario
 * para evitar envíos múltiples.
 */
document.querySelectorAll("form").forEach((form) => {
  form.addEventListener("submit", () => {
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerText = "Enviando...";
    }
  });
});
