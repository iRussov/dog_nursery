document.addEventListener("DOMContentLoaded", function() {
    const messageContainer = document.getElementById('message-container')
    const messageForm = document.getElementById('send-container')
    const messageInput = document.getElementById('message-input')

    const token = localStorage.getItem('token');

    const decodedToken = token ? decodeJWT(token): null;
    if(token){
      const socket = io('http://localhost:3001');
      const name = decodedToken.username;
      appendMessage('Вы подключились', 'otherMessage')
      socket.emit('new-user', name)

      socket.on('chat-message', data => {
        appendMessage(`${data.name}: ${data.message}`, 'otherMessage')
      })

      socket.on('user-connected', name => {
        appendMessage(`${name} подключился`, 'otherMessage')
      })

      socket.on('user-disconnected', name => {
        appendMessage(`${name} отключился`, 'otherMessage')
      })

      messageForm.addEventListener('submit', e => {
        e.preventDefault()
        const message = messageInput.value
        appendMessage(`Вы: ${message}`, 'myMessage')
        socket.emit('send-chat-message', message)
        messageInput.value = ''
      })
    }

    function appendMessage(message, messageOwner) {
      const messageElement = document.createElement('div')
      messageElement.innerText = message
      messageElement.classList.add('message')
      messageElement.classList.add(messageOwner)
      messageContainer.append(messageElement)
    }

    function decodeJWT(token) {
      return JSON.parse(atob(token.split('.')[1]));
    }
});