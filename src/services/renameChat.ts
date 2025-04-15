const ENDPOINT = 'http://127.0.0.1:5000/api';

export default function renameChatService( chat_id: bigint, chat_name: string ) {
    console.log("chat_id: ", chat_id)
    return fetch(`${ENDPOINT}/rename_chat`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ chat_id, chat_name })
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
