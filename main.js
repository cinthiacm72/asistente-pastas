const startBtn = document.getElementById('start-btn');
const output = document.getElementById('output');

// 👇 Token de Wit.ai (protegido sólo en backend, pero lo usaremos aquí por simplicidad)
const WIT_TOKEN = "Bearer 72OKU3ULAQHNR3CMRMQ5DVQGKNIUG7LK"; // Reemplázalo

// 🧠 Habla con Wit.ai
async function sendToWitAI(message) {
  const res = await fetch('https://api.wit.ai/message?v=20230603&q=' + encodeURIComponent(message), {
    headers: {
      Authorization: WIT_TOKEN
    }
  });
  const data = await res.json();
  return data;
}

// 💬 Decidir respuesta según intent
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

// 🎙️ Escucha voz del usuario
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

  output.textContent = "Escuchando...";

  recognition.onresult = async (event) => {
    const userSpeech = event.results[0][0].transcript;
    output.textContent = `Tú: ${userSpeech}`;

    const witData = await sendToWitAI(userSpeech);
    const intent = witData.intents?.[0]?.name || null;
    const response = getResponse(intent);

    // Agrega respuesta del bot
    const reply = document.createElement('p');
    reply.textContent = "Asistente: " + response;
    output.appendChild(reply);
  };

  recognition.onerror = (event) => {
    output.textContent = "Error al reconocer voz: " + event.error;
  };

  recognition.start();
}

startBtn.addEventListener('click', startRecognition);
