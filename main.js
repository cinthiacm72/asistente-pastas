const startBtn = document.getElementById("start-btn");
const output = document.getElementById("output");

// 👉 Reemplaza con tu token de Wit.ai
const WIT_TOKEN = "Bearer 72OKU3ULAQHNR3CMRMQ5DVQGKNIUG7LK";

// 🗣️ Reproducir respuesta
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "es-ES";
  const voices = speechSynthesis.getVoices();
  const spanishVoice = voices.find(v => v.lang.startsWith("es"));
  if (spanishVoice) utterance.voice = spanishVoice;
  speechSynthesis.speak(utterance);
}

// 🤖 Obtener respuesta según intent
function getResponse(text) {
  const t = text.toLowerCase();
  if (t.includes("hola")) return "¡Hola! ¿Cómo puedo ayudarte?";
  if (t.includes("producto") || t.includes("pastas")) return "Tenemos fusilli, penne y spaghetti.";
  if (t.includes("receta") || t.includes("ingrediente")) return "Claro, dime qué ingredientes tienes.";
  return "No entendí bien eso. ¿Puedes repetirlo?";
}

// 🎙️ Grabar y enviar a Wit.ai
async function recordAndSend() {
  output.innerHTML = "🎤 Grabando...";
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const recorder = new MediaRecorder(stream);
  const chunks = [];

  recorder.ondataavailable = e => chunks.push(e.data);

  recorder.onstop = async () => {
    const blob = new Blob(chunks, { type: "audio/webm" });
    const formData = new FormData();
    formData.append("file", blob, "audio.webm");

    output.innerHTML = "⏳ Analizando...";

    const response = await fetch("https://api.wit.ai/speech?v=20230603", {
      method: "POST",
      headers: {
        Authorization: WIT_TOKEN,
        "Content-Type": "audio/webm"
      },
      body: blob
    });

    const data = await response.json();
    const text = data.text;

    if (!text) {
      output.innerHTML = "<p>😕 No se pudo entender.</p>";
      speak("No entendí bien eso. ¿Puedes repetirlo?");
      return;
    }

    const reply = getResponse(text);

    output.innerHTML = `
      <p><strong>Tú:</strong> ${text}</p>
      <p><strong>Asistente:</strong> ${reply}</p>
    `;

    speak(reply);
  };

  recorder.start();

  setTimeout(() => {
    recorder.stop();
    stream.getTracks().forEach(track => track.stop());
  }, 4000); // 4 segundos de grabación
}

startBtn.addEventListener("click", async () => {
  try {
    await recordAndSend();
  } catch (err) {
    output.innerHTML = "<p>🚫 Error: " + err.message + "</p>";
    console.error(err);
  }
});
