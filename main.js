const startBtn = document.getElementById("start-btn");
const output = document.getElementById("output");

window.addEventListener('touchstart', () => {
  speechSynthesis.getVoices();
}, { once: true });

function speak(text) {
  if (!text) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";

  const voices = speechSynthesis.getVoices();
  const spanishVoice = voices.find(voice => voice.lang.startsWith('es'));
  if (spanishVoice) utterance.voice = spanishVoice;

  speechSynthesis.speak(utterance);
}

function getResponse(text) {
  const lower = text.toLowerCase();
  console.log("Usuario dijo:", lower);

  if (lower.includes("hola")) return "¡Hola! ¿Cómo puedo ayudarte?";
  if (lower.includes("producto") || lower.includes("pastas")) return "Tenemos fusilli, penne y spaghetti.";
  if (lower.includes("receta") || lower.includes("ingrediente")) return "Claro, dime qué ingredientes tienes.";
  
  return "No entendí bien eso. ¿Puedes repetirlo?";
}

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
    console.log("Transcripción:", transcript);

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
    console.error("Error en reconocimiento:", event.error);
  };

  recognition.start();
}

startBtn.addEventListener("click", () => {
  speechSynthesis.cancel();
  startRecognition();
});
