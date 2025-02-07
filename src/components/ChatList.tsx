//import React from "react";
import {useEffect, useState, useRef} from "react";
import {
    Button,
} from "react-bootstrap";
import "./styles.css";
import {Chat} from "../types";
import {Link} from "react-router-dom"
//import ChatBox from "./ChatBox.tsx";
import {useStore} from "../hooks/useStore.tsx"
import getChatMessages from "../services/getChatMessages.js";

interface ChatListProps {
    setCurrentChatID: (value: bigint) => void;
    onNewChat: (name?: string) => void;
    chats: Chat[];
}

export const ChatList = ({
    setCurrentChatID,
    onNewChat,
    chats,
}: ChatListProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [chatName, setChatName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { setMessages, setAIMessage, messages, aimessages } = useStore();

    const handleClickOutside = (e: MouseEvent) => {
        if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
            handleSubmit();
        }
    };

    useEffect(() => {
        if (isEditing) {
            document.addEventListener("mousedown", handleClickOutside);
            inputRef.current?.focus();
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isEditing]);

    const handleSubmit = () => {
        if (chatName.trim()) {
            onNewChat(chatName);
        }
        setIsEditing(false);
        setChatName("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    useEffect(() => {
        console.log("Chats in the component:", chats);
    }, [chats]);
    const handleSelectChat = async (chatId: bigint) => {
        console.log(chatId);
        setMessages([]);
        console.log(messages)
        setAIMessage([]); //no va a hacer falta pq lo vamos a reventar
        console.log(aimessages);
        setCurrentChatID(chatId);
        console.log("chatID: " + chatId.toString())
        try {
            const response = await getChatMessages(chatId.toString());  // Esperar la respuesta
            console.log("Respuesta:", response);
            const [mensajes, aimessages] = response[0]
                .reduce(([mensajesAcc, aimessagesAcc], message: string, index: bigint) => {
                    if (response[1][index] === 42) {
                        aimessagesAcc.push(message); // Si el user_id es 42, lo agregamos a aimessages
                    } else {
                        mensajesAcc.push(message); // Si no, lo agregamos a mensajes
                    }
                    return [mensajesAcc, aimessagesAcc]; // Retornamos el acumulador
                }, [[], []]); // Inicializamos dos arrays vacíos

            console.log(mensajes)
            setMessages(mensajes)
            console.log(aimessages)
            setAIMessage(aimessages)
        } catch (error) {
            console.error("Error obteniendo los mensajes del chat:", error);
        }

        
        //getMessages y AIMessages
        //setNewAIMessage
    };
    return (
        <div className={"col-list"}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    onKeyPress={handleKeyPress}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        outline: 'none',
                    }}
                    placeholder="Enter chat name..."
                />
            ) : (
                <Button 
                    onClick={() => setIsEditing(true)} 
                    className="new-chat-button"
                >
                    New Chat
                </Button>
            )}
            <div className="chat-list">
                {chats
                    .slice()
                    .reverse() // Alternativa más eficiente a slice().reverse() en ES2023
                    .map((chat) => (
                        <div key={chat.id.toString()} className="chat-item">
                            <Link
                                to={`/home/${chat.id.toString()}`}
                                onClick={() => handleSelectChat(chat.id)}
                                className="chat-link"
                            >
                                <div className="chat-content">
                                    {chat.name}
                                </div>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};
export default ChatList;