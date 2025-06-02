const hablarBtn = document.getElementById("hablarBtn");
const respuestaEl = document.getElementById("respuesta");

// Inicializa reconocimiento de voz
const reconocimiento = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
reconocimiento.lang = "es-ES";

hablarBtn.addEventListener("click", () => {
  respuestaEl.textContent = "🎙️ Escuchando...";
  reconocimiento.start();
});

reconocimiento.onresult = async function(event) {
  const texto = event.results[0][0].transcript;
  respuestaEl.textContent = `Tú dijiste: "${texto}". Pensando...`;
  const respuesta = await obtenerRespuestaWit(texto);
  respuestaEl.textContent = respuesta;
};

// Aquí consultamos a la API de Wit.ai
async function obtenerRespuestaWit(texto) {
  try {
    const response = await fetch(`https://api.wit.ai/message?v=20250602&q=${encodeURIComponent(texto)}`, {
      headers: {
        Authorization: "Bearer 72OKU3ULAQHNR3CMRMQ5DVQGKNIUG7LK" // Tu token
      }
    });

    const data = await response.json();

    // Opcional: puedes personalizar según las entidades detectadas
    if (data.text) {
      return `🤖 Entendí: "${data.text}"`;
    } else {
      return "Lo siento, no entendí eso.";
    }

  } catch (error) {
    console.error("Error al obtener respuesta:", error);
    return "Error de conexión con Wit.ai.";
  }
}
