const recordBtn = document.getElementById('record-btn');
const status = document.getElementById('status');
const output = document.getElementById('output');

const WIT_TOKEN = "Bearer 72OKU3ULAQHNR3CMRMQ5DVQGKNIUG7LK";

let mediaRecorder;
let audioChunks = [];

recordBtn.addEventListener('click', async () => {
  if (!navigator.mediaDevices || !window.MediaRecorder) {
    status.textContent = "Tu navegador no soporta grabación de audio.";
    return;
  }

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  let mimeType = '';
  if (MediaRecorder.isTypeSupported('audio/mp4')) {
    mimeType = 'audio/mp4';
  } else if (MediaRecorder.isTypeSupported('audio/mpeg')) {
    mimeType = 'audio/mpeg';
  } else {
    status.textContent = "Formato de audio no compatible.";
    return;
  }

  mediaRecorder = new MediaRecorder(stream, { mimeType });

  audioChunks = [];
  mediaRecorder.start();
  status.textContent = "🎙️ Grabando...";

  mediaRecorder.addEventListener('dataavailable', event => {
    audioChunks.push(event.data);
  });

  mediaRecorder.addEventListener('stop', async () => {
    status.textContent = "⏳ Procesando...";
    const audioBlob = new Blob(audioChunks, { type: mimeType });
    const text = await sendToWitSpeech(audioBlob, mimeType);
    const response = getResponse(text);

    output.innerHTML += `
      <p><strong>Tú:</strong> ${text}</p>
      <p><strong>Asistente:</strong> ${response}</p>
    `;
    speak(response); // Aquí se activa la voz del asistente
    status.textContent = "Presiona para hablar";
  });

  // Grabar durante 4 segundos
  setTimeout(() => {
    mediaRecorder.stop();
    stream.getTracks().forEach(track => track.stop());
  }, 4000);
});

async function sendToWitSpeech(blob, mimeType) {
  try {
    const res = await fetch("https://api.wit.ai/speech?v=20230603", {
      method: "POST",
      headers: {
        Authorization: WIT_TOKEN,
        "Content-Type": mimeType
      },
      body: blob
    });

    if (!res.ok) {
      console.error("Wit.ai error:", await res.text());
      return "No se pudo entender.";
    }

    const data = await res.json();
    return data.text || "No se entendió.";
  } catch (err) {
    console.error("Error de red:", err);
    return "Error al conectar con Wit.ai.";
  }
}

function getResponse(text) {
  const txt = text.toLowerCase();
  if (txt.includes("hola")) return "¡Hola! ¿Cómo puedo ayudarte?";
  if (txt.includes("producto") || txt.includes("tienen")) return "Tenemos fusilli, penne y spaghetti.";
  if (txt.includes("receta")) return "Claro, dime qué ingredientes tienes.";
  return "No entendí bien eso. ¿Puedes repetirlo?";
}

function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  speechSynthesis.speak(utterance);
}
