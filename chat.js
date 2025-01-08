const chatWindow = document.getElementById('chatWindow');

// Arreglo para almacenar las respuestas del usuario
const userResponses = [];

// Secuencia de mensajes predefinidos del bot
const botMessages = [
  "Hola, soy un bot hecho para ti :). ¿Cómo te sientes el dia de hoy?",
  "Está bien, gracias por compartirlo. ¿Del 1 al 10, cuanto te calificarías fisica y mentalmente a ti misma?",
  "Entendido, gracias. Ahora, de 1 al 10, ¿qué calificación le darías a Carlos  física y mentalmente :) ?(Es necesario un número del 1 al 10).",
  "¿Qué tienes en mente con Carlos en el futuro?",
  "Muchas gracias por compartirlo. Bueno, esas eran todas mis preguntas. Presiona en el codigo QR que ves, dale en descargar y compartelo con Carlos :)"
];

let currentBotMessageIndex = 0;
let isFirstResponse = true; 
let isSecondResponse = false; 
let isThirdResponse = false; 

const keywordsInitial = ["bien", "muy bien", "un poco mal", "mal", "muy mal", "no lo sé"];
const keywordsNumbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
const keywordsFourth = ["vivir", "amarlo", "casarme", "hijo", "dinero", "estar", "siempre"];

function sendMessage() {
  const userInput = document.getElementById('userInput');
  const message = userInput.value.trim(); 
  if (message === '' || localStorage.getItem('conversationEnded')) return;

  // Crear el mensaje del usuario
  const userMessage = document.createElement('div');
  userMessage.classList.add('message', 'user');
  userMessage.innerHTML = `
    <div class="message-content">${userInput.value}</div>
  `;
  chatWindow.appendChild(userMessage);

  // Guardar la respuesta del usuario
  userResponses.push(message);

  userInput.value = '';
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Respuesta del bot
  setTimeout(() => {
    if (isFirstResponse) {
      const containsKeyword = keywordsInitial.some(keyword => message.toLowerCase().includes(keyword));
      if (containsKeyword) {
        botMessage(botMessages[1]);
        currentBotMessageIndex = 2;
        isFirstResponse = false;
        isSecondResponse = true;
      } else {
        botMessage(botMessages[0]);
      }
    } else if (isSecondResponse) {
      const containsKeyword = keywordsNumbers.some(keyword => message.includes(keyword));
      if (containsKeyword) {
        botMessage(botMessages[2]);
        currentBotMessageIndex = 3;
        isSecondResponse = false;
        isThirdResponse = true;
      } else {
        botMessage(botMessages[1]);
      }
    } else if (isThirdResponse) {
      const containsKeyword = keywordsNumbers.some(keyword => message.includes(keyword));
      if (containsKeyword) {
        botMessage(botMessages[3]);
        currentBotMessageIndex = 4;
        isThirdResponse = false;
      } else {
        botMessage(botMessages[2]);
      }
    } else {
      if (currentBotMessageIndex < botMessages.length - 1) {
        botMessage(botMessages[currentBotMessageIndex]);
        currentBotMessageIndex++;
      } else {
        generateQRCode(); // Generar el QR al final
      }
    }
  }, 1000);
}

function botMessage(text) {
  const botMessage = document.createElement('div');
  botMessage.classList.add('message', 'bot');
  botMessage.innerHTML = `
    <img src="perfil.png" alt="Bot">
    <div class="message-content"></div>
  `;
  chatWindow.appendChild(botMessage);

  const messageContent = botMessage.querySelector('.message-content');
  let i = 0;
  const typeEffect = setInterval(() => {
    if (i < text.length) {
      messageContent.textContent += text[i];
      i++;
    } else {
      clearInterval(typeEffect);
      if (text === botMessages[botMessages.length - 1]) {
        // Finalizar conversación
        localStorage.setItem('conversationEnded', 'true');
      }
    }
  }, 50);

  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function generateQRCode() {
  const botMessage = document.createElement('div');
  botMessage.classList.add('message', 'bot');
  botMessage.innerHTML = `
    <img src="perfil.png" alt="Bot">
    <div class="message-content">Muchas gracias por compartirlo. Bueno, esas eran todas mis preguntas. Presiona en el codigo QR que ves, dale en descargar y compartelo con Carlos :)</div>
  `;

  const qrCodeImg = document.createElement('img');
  const qrData = `Respuestas: ${userResponses.join(', ')}`;
  qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrData)}`;
  qrCodeImg.alt = "QR Code";
  qrCodeImg.style.marginTop = "10px";

  qrCodeImg.onload = function() {
    botMessage.appendChild(qrCodeImg);
    chatWindow.appendChild(botMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };

  qrCodeImg.onerror = function() {
    console.error('Error al generar el QR.');
    botMessage.innerHTML += `<div>Hubo un error al generar el código QR.</div>`;
    chatWindow.appendChild(botMessage);
    chatWindow.scrollTop = chatWindow.scrollHeight;
  };
}

window.onload = () => {
  if (!localStorage.getItem('conversationEnded')) {
    botMessage(botMessages[0]);
  }
};