const ENDPOINT = 'http://127.0.0.1:5000/api';

export default function getFromReport( report_id: bigint ) {
    const reportstr = report_id.toString()
    return fetch(`${ENDPOINT}/get_fromreport`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ reportstr })
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
