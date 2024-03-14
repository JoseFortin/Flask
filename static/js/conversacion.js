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

    // Verifica si el mensaje no est vacio
    if (message !== "") {
      // Agrega el mensaje del usuario al chat
      addMessage(message, true);

      // Realiza una solicitud al servidor con el mensaje del usuario
      fetch("/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      })
        .then(response => response.json())
        .then(data => {
          // Limpia el area de entrada de mensajes
          messageInput.value = "";

          // Crea un contenedor para la respuesta del bot
          const messageDiv = document.createElement("div");
          messageDiv.classList.add("mt-3", "p-3", "rounded");
          messageDiv.classList.add("bot-message");

          // Extrae el contenido de la respuesta
          const content = data.content;

          // Verifica si la respuesta contiene un bloque de código
          const hasCodeBlock = content.includes("```");
          if (hasCodeBlock) {
            // Si hay un bloque de código, reemplaza y formatea
            const codeContent = content.replace(/```([\s\S]+?)```/g, '</p><pre><code>$1</code></pre><p>');
            messageDiv.innerHTML = `<p>${codeContent}</p>`;
          } else {
            // Si no hay bloque de código, agrega el contenido normal
            messageDiv.innerHTML = `<p>${content}</p>`;
          }

          // Agrega el contenedor al chat y realiza un scroll hacia abajo
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