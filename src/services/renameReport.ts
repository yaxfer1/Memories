const ENDPOINT = 'http://127.0.0.1:5000/api';

export default function renameReportService( report_id: bigint, report_name: string ) {
    console.log("rep_id: ", report_id)
    return fetch(`${ENDPOINT}/rename_report`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ report_id, report_name })
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
