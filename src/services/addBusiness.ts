const ENDPOINT = 'http://127.0.0.1:5000/api';

export const addBusinessService = ( jwt: string, business_name: string ) => {
    console.log("chat_name: ", business_name)
    return fetch(`${ENDPOINT}/add_business`, {
        method: 'POST',
        headers: {
            "Authorization": jwt,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ jwt, business_name })
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
export default addBusinessService;