const ENDPOINT = 'http://127.0.0.1:5000/api';

export default function getChatMessages( chat_id ) {
    console.log("chat_id: ", chat_id)
    return fetch(`${ENDPOINT}/get_chat_messages`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ chat_id })// Pasar el id en el cuerpo de la solicitud
    })
        .then(res => {
            if (!res.ok) throw new Error('Response is NOT ok');
            return res.json();
        })
        .then(res => {
            const elements = res;
            console.log("objeto recibido: ")
            console.log("elemento recibido: ", elements)
            return elements;
        });
}
