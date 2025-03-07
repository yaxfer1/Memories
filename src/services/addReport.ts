const ENDPOINT = 'http://127.0.0.1:5000/api';

export default function addReportService( jwt: string, memory_id: bigint, report_name: string ) {
    const memory_ids = memory_id.toString()
    return fetch(`${ENDPOINT}/add_report_to_memory`, {
        method: 'POST',
        headers: {
            "Authorization": jwt,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ jwt, memory_ids ,report_name })
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
