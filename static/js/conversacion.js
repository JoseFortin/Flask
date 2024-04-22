  // Función para resaltar bloques de codigo cada segundo osea cuantos se podran producir 
  setInterval(highlightAll, 2000);

  function highlightAll() {
    // Selecciona todos los bloques de codigo y los resalta
    document.querySelectorAll("pre code").forEach(block => {
      hljs.highlightBlock(block);
    });
  }

  // Obtencion de elementos del DOM, LO QUE PERMITE OBTENER LOS OBJETOS DEL SCRIP QUE ESTA GENERADO
  const chatBox = document.querySelector(".chat-box");
  const messageInput = document.querySelector("#message-input");
  const sendBtn = document.querySelector("#send-btn");

  // Funcion para agregar un mensaje al chat
  function addMessage(message, isUserMessage) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("mt-3", "p-3", "rounded");

    // Determina si el mensaje es del usuario o del bot
    if (isUserMessage) {
      messageDiv.classList.add("user-message");
    } else {
      messageDiv.classList.add("bot-message");
    }

    // Añade el contenido del mensaje al contenedor
    messageDiv.innerHTML = `<p>${message}</p>`;

    // Agrega el contenedor al chat 
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  // Funcion para enviar mensajes al servidor y recibir respuestas del bot
  function sendMessage() {
    const message = messageInput.value.trim();
  
    if (message !== "") {
      addMessage(message, true);
  
      fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      })
        .then(response => response.json())
        .then(data => {
          messageInput.value = "";
  
          const messageDiv = document.createElement("div");
          messageDiv.classList.add("mt-3", "p-3", "rounded");
          messageDiv.classList.add("bot-message");
  
          let content = data.content;
  
          // Dividir el contenido en líneas individuales
          const lines = content.split("\n");
  
          // Crear un párrafo para cada línea
          lines.forEach(line => {
            const paragraph = document.createElement("p");
            paragraph.textContent = line.trim();
            messageDiv.appendChild(paragraph);
          });
  
          chatBox.appendChild(messageDiv);
          chatBox.scrollTop = chatBox.scrollHeight;
        })
        .catch(error => console.error(error));
    }
  }
  

  // EventListener para el botón de enviar
  sendBtn.addEventListener("click", sendMessage);

  // EventListener para enviar mensajes al presionar Enter
  messageInput.addEventListener("keydown", event => {
    if (event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  });
  