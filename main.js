const startRecognition = () => {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'es-ES';
  recognition.start();

  recognition.onresult = async (event) => {
    const texto = event.results[0][0].transcript;
    document.getElementById("userInput").textContent = `Tú: ${texto}`;
    
    const respuesta = await obtenerRespuesta(texto);
    document.getElementById("respuestaIA").textContent = `Asistente: ${respuesta}`;
    
    const voz = new SpeechSynthesisUtterance(respuesta);
    voz.lang = 'es-ES';
    speechSynthesis.speak(voz);
  };
};

async function obtenerRespuesta(texto) {
  // Aquí conectaremos con Dialogflow en los próximos pasos
  return "Estoy procesando tu pregunta sobre pastas..."; // temporal
}
