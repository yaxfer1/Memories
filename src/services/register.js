const ENDPOINT = 'http://127.0.0.1:5000/api';

export default function register ( {username, password} ) {
    return fetch(`${ENDPOINT}/register`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    }).then(res => {
        if (!res.ok) throw new Error('Response is NOT ok')
        return res.json()
    })
}