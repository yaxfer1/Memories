import React, { useEffect, useRef } from "react";
import {
    Container,
    InputGroup,
    FormControl,
    Button,
} from "react-bootstrap";
import "./styles.css";
import {useStore} from "../hooks/useStore.tsx"
//@ts-expect-error
import {postChat} from "../services/postChat.js"
import { useNavigate } from "react-router-dom";
import addChatService from "../services/addChat.ts"

export const ChatBox = () => {
    const{
        newMessage,
        messages,
        setNewMessage,
        aimessages,
        setMessages,
        setAIMessage,
        setLoad,
        loading,
        jwt,
        chats,
        addChat,
        isNewChat,
        setCurrentChatId,
        setIsNewChat,
    }=useStore()
    const [error, setError] = React.useState('');
    const navigate = useNavigate();
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-enfocar el input y hacer scroll a la última mensaje
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
        
        //scrollToBottom();
    }, [isNewChat, messages, aimessages]);

    //const scrollToBottom = () => {
    //    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    //};

    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {
            try {
                setLoad(true);
                let activeChatId = 0n;
                
                // Si es un chat nuevo, crearlo primero
                if(isNewChat) {
                    const nameContext = "Chat Prompt: "+ newMessage + " Chats Name List:" + chats.map((chat, index) =>  `${index + 1}. ${chat.name}`).join(', ');
                    const chatsAdded = await addChatService(jwt, nameContext);

                    const chatId = chatsAdded[2];
                    const chatName = chatsAdded[0];
                    
                    activeChatId = BigInt(chatId);
                    
                    addChat({ id: activeChatId, name: chatName, messages: [], aimessages: [] });
                    setCurrentChatId(activeChatId);
                    setIsNewChat(false);
                    
                    navigate(`/home/chat/${chatId.toString()}`);
                } else {
                    // Si no es un chat nuevo, usar el ID actual
                    activeChatId = currentChatId;
                }
                                
                // Actualizar interfaz con el mensaje del usuario
                const mensaje = newMessage;
                setMessages([...messages, mensaje]);
                
                // Enviar mensaje al servidor usando el ID activo
                const chatr = await postChat(jwt, activeChatId, mensaje);
                setAIMessage([...aimessages, chatr]);
                
                setNewMessage("");
                setLoad(false);
            }
            catch(err: any){
                console.error("Error in handleSendMessage", err);
                setError(err.message);
                setLoad(false);
            }
        }
    };

    const{
        currentChatId
    }=useStore();
    
    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    };

    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(event.target.value);
    };

    const combinedMessages = messages.map((message, index) => ({ text: message, sender: "user", index }))
        .concat(aimessages.map((message, index) => ({ text: message, sender: "AI", index })))
        .sort((a, b) => a.index - b.index);

    return (
        <Container fluid className="chat-container">
            {isNewChat ? (
                <div className="new-chat-container">
                    <div className="new-chat-prompt">
                        <div className="new-chat-header">
                            <h2>Nuevo Chat</h2>
                            <p>Escribe tu mensaje para comenzar una nueva conversación</p>
                        </div>
                        <div className="new-chat-input-wrapper">
                            <FormControl
                                as="textarea"
                                placeholder="¿En qué puedo ayudarte hoy?"
                                className="new-chat-input"
                                value={newMessage}
                                onChange={handleTextChange}
                                onKeyDown={handleKeyDown}
                                ref={inputRef}
                                disabled={loading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loading}
                                className="new-chat-button-send"
                            >
                                {loading ? <div className="loader" /> : "Comenzar Chat"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="messages-container">
                        {combinedMessages.length === 0 ? (
                            <div className="empty-chat">
                                <p>No hay mensajes aún. Comienza escribiendo algo abajo.</p>
                            </div>
                        ) : (
                            combinedMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`message ${
                                        message.sender === "user" ? "user-message" : "ai-message"
                                    }`}
                                >
                                    <span className="message-text">{message.text}</span>
                                </div>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <InputGroup className="message-input-group">
                        <FormControl
                            as="textarea"
                            placeholder="Escribe tu mensaje aquí... (Presiona Enter para enviar)"
                            className="custom-input-message"
                            value={newMessage}
                            onChange={handleTextChange}
                            onKeyDown={handleKeyDown}
                            ref={inputRef}
                            bsPrefix="custom-input"
                            disabled={loading}
                            rows={1}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={loading}
                            className="send-button"
                        >
                            {loading ? <div className="loader" /> : "Enviar"}
                        </button>
                    </InputGroup>
                </>
            )}
        </Container>
    );
};

export default ChatBox;

/* styles.css */
