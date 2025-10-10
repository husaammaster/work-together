// Dieses Modul soll ausschließlich eventhandler für WS-Nachrichten enthalten

const wsHandlers = {
    dummy(payload){
        console.log(`Dummy-Nachricht aus Handler-Modul ${payload.value}`)
    }
}

export default wsHandlers;