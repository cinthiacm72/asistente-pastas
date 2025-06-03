const startBtn = document.getElementById('start-btn');
const output = document.getElementById('output');

// 👇 Token de Wit.ai (reemplaza por tu propio token si es necesario)
const WIT_TOKEN = "Bearer 72OKU3ULAQHNR3CMRMQ5DVQGKNIUG7LK";

// 🧠 Envía texto a Wit.ai
async function sendToWitAI(message) {
  try {
    const res = await fetch('https://api.wit.ai/message?v=20230603&q=' + encodeURIComponent(message), {
      headers: {
        Authorization: WIT_TOKEN
      }
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error al conectar con Wit.ai:", err);
    return { intents: [] };
  }
}

// 💬 Decide qué responder según el intent
function getResponse(intentName) {
  switch (intentName) {
    case "saludo":
      return "¡Hola! ¿Cómo puedo ayudarte?";
    case "productos":
      return "Tenemos fusilli, penne y spaghetti.";
    case "recetas":
      return "Claro, dime qué ingredientes tienes.";
    default:
      return "No entendí bien eso. ¿Puedes repetirlo?";
  }
}

// 🎙️ Inicia reconocimiento de voz
function startRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    output.textContent = "Tu navegador no soporta reconocimiento de voz.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  output.textContent = "🎧 Escuchando...";

  recognition.onresult = async (event) => {
    const userSpeech = event.results[0][0].transcript;
    output.innerHTML = `<p><strong>Tú:</strong> ${userSpeech}</p>`;

    const witData = await sendToWitAI(userSpeech);
    const intent = witData.intents?.[0]?.name || null;
    const response = getResponse(intent);

    const reply = document.createElement('p');
    reply.innerHTML = `<strong>Asistente:</strong> ${response}`;
    output.appendChild(reply);
  };

  recognition.onerror = (event) => {
    output.innerHTML = `<p style="color:red;">Error: ${event.error}</p>`;
  };

  recognition.start();
}

// 🖱️ Inicia sólo por interacción (necesario para iOS)
startBtn.addEventListener('click', () => {
  try {
    startRecognition();
  } catch (e) {
    output.innerHTML = `<p style="color:red;">Error inesperado: ${e.message}</p>`;
  }
});
