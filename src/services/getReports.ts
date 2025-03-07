const ENDPOINT = 'http://127.0.0.1:5000/api';

export default function getReportService( memory_id: bigint ) {
    return fetch(`${ENDPOINT}/get_reports`, {
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
