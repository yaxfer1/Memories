import React, { useState } from 'react';
import AgentActionsList from '../components/AgentActionsList';

const ENDPOINT = 'http://127.0.0.1:5000/api';

export async function fetchAgentActions(jwt: string, query: string): Promise<any> {
  return fetch(`${ENDPOINT}/agent_actions`, {
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
      return data;  // Se espera que sea un array de AgentAction
    });
}
export default fetchAgentActions;
