const ENDPOINT = 'http://127.0.0.1:5000/api';

export async function generateParagraph(jwt: string, query: string): Promise<any> {
  return fetch(`${ENDPOINT}/generate_paragraph`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ query, jwt })
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
