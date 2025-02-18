const ENDPOINT = 'http://127.0.0.1:5000/api';

export const addMemoryService = ( jwt: string, memory_name: string, business_id: bigint ) => {
    const id_string = business_id.toString();
    return fetch(`${ENDPOINT}/add_memory`, {
        method: 'POST',
        headers: {
            "Authorization": jwt,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ jwt, memory_name, id_string })
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
export default addMemoryService;