const AI_CHAT = "http://127.0.0.1:5000/api/ai_chat";

export const postChat = async (jwt, chatId, message) => {
    // Convertir el BigInt a String para solucionar el problema de serialización
    const chatIdString = chatId.toString();
    console.log("chatIdString: " + chatIdString)
    try {
        // Obtener el JWT almacenado en sessionStorage

        if (!jwt) {
            throw new Error("No hay token de autenticación.");
        }

        // Crear el cuerpo de la petición
        const bodyData = {
            id: chatIdString,
            message: message,
            jwt: jwt
        };

        // Realizar la petición al backend
        const res = await fetch(AI_CHAT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(bodyData)
        });

        if (!res.ok) {
            throw new Error(`Error en la solicitud. Código: ${res.status}`);
        }

        // Obtener la respuesta en JSON
        const data = await res.json();
        return data;

    } catch (error) {
        console.error("Error en postChat:", error.message);
        throw error;
    }
};