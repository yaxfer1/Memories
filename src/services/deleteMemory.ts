const ENDPOINT = 'http://127.0.0.1:5000/api';

export default function deleteMemoryService( memory_id: bigint ) {

    return fetch(`${ENDPOINT}/rm_memory`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ memory_id })
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
