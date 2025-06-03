const startBtn = document.getElementById("start-btn");
const output = document.getElementById("output");

// 👉 Función para hablar (compatible con iPhone y Android)
function speak(text) {
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";

  // Forzar voz en español
  const voices = speechSynthesis.getVoices();
  const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
  if (spanishVoice) utterance.voice = spanishVoice;

  speechSynthesis.speak(utterance);
}

// 👉 Función para obtener respuesta según palabras clave
function getResponse(text) {
  const lower = text.toLowerCase();

  if (lower.includes("hola") || lower.includes("buenos días")) {
    return "¡Hola! ¿Cómo puedo ayudarte?";
  }

  if (lower.includes("producto") || lower.includes("pastas")) {
    return "Tenemos fusilli, penne y spaghetti.";
  }

  if (lower.includes("receta") || lower.includes("ingrediente")) {
    return "Claro, dime qué ingredientes tienes.";
  }

  return "No entendí bien eso. ¿Puedes repetirlo?";
}

// 👉 Reconocimiento de voz (solo texto, sin enviar a servidores)
function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    output.textContent = "Tu navegador no soporta reconocimiento de voz.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "es-ES";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  output.textContent = "🎤 Escuchando...";

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    const userP = document.createElement("p");
    userP.textContent = "Tú: " + transcript;
    output.appendChild(userP);

    const response = getResponse(transcript);

    const botP = document.createElement("p");
    botP.textContent = "Asistente: " + response;
    output.appendChild(botP);

    speak(response);
  };

  recognition.onerror = (event) => {
    const errP = document.createElement("p");
    errP.textContent = "❌ Error: " + event.error;
    output.appendChild(errP);
  };

  recognition.start();
}

startBtn.addEventListener("click", () => {
  // Detener cualquier voz anterior
  speechSynthesis.cancel();
  startRecognition();
});

// Forzar carga de voces (recomendado en iOS)
speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices();
};
