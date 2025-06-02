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
  hablar(respuesta);
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

   const intent = data.intents && data.intents.length > 0 ? data.intents[0].name : null;

    let tipoPasta = null;
    if (data.entities && data.entities['tipo_pasta:tipo_pasta']) {
      tipoPasta = data.entities['tipo_pasta:tipo_pasta'][0].value.toLowerCase();
    }

    if (intent === 'saludo') {
      return "¡Hola! 👋 Soy tu asistente de pastas italianas. ¿En qué puedo ayudarte?";
    }
    if (intent === 'consultar_producto') {
      if (tipoPasta === 'sin gluten') {
        return "Tenemos fusilli, spaghetti y penne sin gluten 🍝";
      }
      if (tipoPasta === 'integral') {
        return "Contamos con pastas integrales 100% de trigo: spaghetti, penne y rigatoni 🍃";
      }
      return "Ofrecemos spaghetti, fusilli, penne, tagliatelle y más. ¿Quieres saber sobre alguna pasta en especial?";
    }
    if (intent === 'sugerir_receta') {
      if (tipoPasta === 'spaghetti') {
        return "Te recomiendo Spaghetti alla Carbonara 🥓🧀. ¿Quieres los pasos?";
      }
      if (tipoPasta === 'fusilli') {
        return "Prueba una receta con pesto genovés 🌿 y tomates cherry 🍅. ¡Rápida y deliciosa!";
      }
      return "Puedes preparar Pasta alla Norma 🍆🍝 o Penne all’Arrabbiata 🌶️. ¿Quieres la receta?";
    }

    // Respuesta por defecto
    return "Lo siento, no entendí eso. ¿Puedes repetirlo?";

  } catch (error) {
    console.error("Error al obtener respuesta:", error);
    return "Error de conexión con Wit.ai.";
  }
}

// Función para que el navegador lea la respuesta
function hablar(texto) {
  if (!('speechSynthesis' in window)) return;

  const utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = 'es-ES';
  window.speechSynthesis.speak(utterance);

}
