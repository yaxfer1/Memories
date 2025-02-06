import React from "react";
import {
    Container,
    InputGroup,
    FormControl,
    Button,
} from "react-bootstrap";
import "./styles.css";
import {useStore} from "../hooks/useStore.tsx"
import {postChat} from "../services/postChat.js"
export const ChatBox = () => {
    //const {chatId} = useParams<{ chatId: string }>();
    const{
        newMessage,
        messages,
        setNewMessage,
        //updateChatMessages,
        //updateChatAIMessages,
        aimessages,
        setMessages,
        setAIMessage,
        setLoad,
        loading,
        chats,
        jwt,
    }=useStore()

    const handleSendMessage = async () => {
        console.log("boton")
        if (newMessage.trim() !== "") {
            console.log("boton")
            setLoad(true)
            const mensaje = newMessage
            //const messages = chats.flatMap((chat) => chat.messages)
            //const aimessages = chats.flatMap((chat) => chat.aimessages)
            setNewMessage("")
            // Agregar el nuevo mensaje al estado de mensajes

            setMessages([...messages, mensaje])
            // -Mandar peticion de chatAIMandar el record a la db
            // setAIMessages -> Mandar el record a la db

            const chatr = await postChat(jwt, currentChatId,mensaje);
            setAIMessage([...aimessages, chatr])
            //updateChatAIMessages(currentChatId,[...aimessages, "chatr"])
            // Limpiar el campo de texto después de enviar el mensaje

            setLoad(false)

        }
    };

    const{
        currentChatId
    }=useStore();
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(event.target.value);
    };

    const combinedMessages = messages.map((message, index) => ({ text: message, sender: "user", index }))
        .concat(aimessages.map((message, index) => ({ text: message, sender: "AI", index })))
        .sort((a, b) => a.index - b.index);

    return (
        <Container fluid>
            {/* Lista de chats */}

            {/* Lista de mensajes */}
            <div className="messages-container">
                {combinedMessages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${
                            message.sender === "user" ? "user-message" : "ai-message"
                        }`}
                    >
            <span className="message-sender">
              {message.sender === "user" ? "User:" : "AI:"}
            </span>
                        <span className="message-text">{message.text}</span>
                    </div>
                ))}
            </div>

            {/* Input para nuevos mensajes */}
            <InputGroup className="message-input-group">
                <FormControl
                    placeholder="Write your message here..."
                    value={newMessage}
                    onChange={handleTextChange}
                    disabled={loading}
                />
                <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={loading}
                    className="send-button"
                >
                    {loading ? <div className="loader" /> : "Send"}
                </Button>
            </InputGroup>
        </Container>
    );

};

export default ChatBox;

/* styles.css */
