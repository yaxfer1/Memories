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
//@ts-expect-error
import getChatMessages from "../services/getChatMessages.js";
import addChatService from "../services/addChat.ts";
import useUser from "../hooks/useUser.ts";
import deleteButton from "../assets/deleteButton.svg";
import deleteChatService from "../services/deleteChat.ts";
import { useLocation, useParams } from "react-router-dom";


interface ChatListProps {
    setCurrentChatID: (value: bigint) => void;
    chats: Chat[];
}

export const ChatList = ({
    setCurrentChatID,
    chats,
}: ChatListProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [chatName, setChatName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { setMessages, setAIMessage, addChat, jwt, deleteChat, currentChatId } = useStore();
    const { addChatUser } = useUser();

    const handleNewChat = async () => {
        try {
            const chatsadded = await addChatService(jwt, chatName);
            console.log("Chat añadido:", chatsadded);
    
            const chatId = chatsadded[2];
    
            addChat({ id: chatId, name: chatName, messages: [], aimessages: [] });
        } catch (error) {
            console.error("Error al manejar el nuevo chat:", error);
        }
    };



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
            handleNewChat();
        }
        setIsEditing(false);
        setChatName("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSelectChatWrapper = (chatId: bigint) => {
        handleSelectChat(chatId, setMessages, setAIMessage, setCurrentChatID);
      };

      const location = useLocation();
const { chatId } = useParams(); // Extrae el ID del chat desde la URL

useEffect(() => {
  if (currentChatId) {
    handleSelectChatWrapper(BigInt(currentChatId)); 
  }
}, []); 

    const handleDeleteChat = async (chatId: bigint) => {
        console.log(chatId);
        deleteChat(chatId);
        console.log(chats)
        try {
            const response = await deleteChatService(chatId);  
            console.log(response)
        } catch (error) {
            console.error("Error obteniendo los mensajes del chat:", error);
        }

    };
    return (
        <div className={"col-list"}>
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={chatName}
                    onChange={(e) => setChatName(e.target.value)}
                    onKeyDown={handleKeyPress}
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
                    bsPrefix="custom-button"
                >
                    New Chat

                </Button>
            )}
            <div className="chat-list">
                {chats
                    .slice()
                    .reverse()
                    .map((chat) => (
                        <div key={chat.id.toString()} className="chat-item">
                            <Link
                                to={`/home/${chat.id.toString()}`}
                                onClick={() => handleSelectChatWrapper(chat.id)}
                                className="chat-link"
                            >
                                <div className="chat-content">
                                    <span>{chat.name}</span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            handleDeleteChat(chat.id);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <img 
                                            src={deleteButton} 
                                            alt="Delete"
                                            style={{
                                                width: '20px',
                                                height: '20px'
                                            }}
                                            className="svg-button"
                                        />
                                    </button>
                                </div>
                            </Link>
                        </div>
                    ))}
            </div>
        </div>
    );
};
export default ChatList;


export const handleSelectChat = async (
    chatId: bigint,
    setMessages: (messages: string[]) => void,
    setAIMessage: (messages: string[]) => void,
    setCurrentChatID: (id: bigint) => void
  ) => {
    console.log(chatId);
    setMessages([]);
    setAIMessage([]);
    setCurrentChatID(chatId);
    console.log("chatID: " + chatId.toString());
  
    try {
      const response = await getChatMessages(chatId.toString());
      console.log("Respuesta:", response);
  
      const [mensajes, aimessages] = response[0]
        //@ts-expect-error
        .reduce(([mensajesAcc, aimessagesAcc], message: string, index: bigint) => {
          if (response[1][index] === 42) {
            aimessagesAcc.push(message);
          } else {
            mensajesAcc.push(message);
          }
          return [mensajesAcc, aimessagesAcc];
        }, [[], []]);
  
      setMessages(mensajes);
      setAIMessage(aimessages);
    } catch (error) {
      console.error("Error obteniendo los mensajes del chat:", error);
    }
  };
  