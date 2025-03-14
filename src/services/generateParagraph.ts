const ENDPOINT = 'http://127.0.0.1:5000/api';

export async function generateParagraph(jwt: string, query: string, text1: string, text2: string, currentReportId: bigint): Promise<any> {
  const reportidstr = currentReportId.toString()
  return fetch(`${ENDPOINT}/generate_paragraph`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, jwt, text1, text2, reportidstr })
  })
    .then(res => {
      if (!res.ok) throw new Error('Response is NOT ok');
      return res.json();
    })
    .then(data => {
      console.log("Datos recibidos: ", data);
      return data;  
    });
}
export default generateParagraph;
