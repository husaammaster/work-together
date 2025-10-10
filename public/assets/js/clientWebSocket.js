
export const socket = new WebSocket('ws://localhost:8080');

socket.addEventListener('open', ({target: socket}) => {
    console.log("Socket opened", socket);

    // Nachricht zum Server senden
    // Nachrichten können nur gesendet werden, wenn eine Verbindung besteht
    socket.send(JSON.stringify({
        type:'dummy',
        payload: {
            value: ~~(Math.random()*1000)
        }
    }))
})
