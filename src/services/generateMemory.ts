const ENDPOINT = 'http://127.0.0.1:5000/api';

export async function generateMemory(jwt: string, query: string, text1: string, text2: string, currentMemoryId: bigint): Promise<any> {
  const reportidstr = currentMemoryId.toString()
  return fetch(`${ENDPOINT}/generate_memory`, {
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
export default generateMemory;
