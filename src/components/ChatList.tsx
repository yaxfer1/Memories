//import React from "react";
import {useEffect, useState, useRef} from "react";
import {
    Button,
    Modal,
    Form
} from "react-bootstrap";
import "./styles.css";
import {Chat} from "../types";
import {Link, useNavigate} from "react-router-dom"
//import ChatBox from "./ChatBox.tsx";
import {useStore} from "../hooks/useStore.tsx"
//@ts-expect-error
import getChatMessages from "../services/getChatMessages.js";
import addChatService from "../services/addChat.ts";
import useUser from "../hooks/useUser.ts";
import deleteButton from "../assets/deleteButton.svg";
import editIcon from "../assets/edit.svg";
import deleteChatService from "../services/deleteChat.ts";
import renameChatService from "../services/renameChat.ts";
import { useLocation, useParams } from "react-router-dom";
import menuButton from "../assets/menuButton.svg";
import newC from "../assets/newA.svg";
interface ChatListProps {
    setCurrentChatID: (value: bigint) => void;
    chats: Chat[];
}

export const ChatList = ({
    setCurrentChatID,
    chats,
}: ChatListProps) => {
    const navigate = useNavigate();
    const { isNewChat, setIsNewChat, isCollapsed, setIsCollapsed, setMessages, setAIMessage, addChat, jwt, deleteChat, currentChatId, setChats } = useStore();
    const [editingChatId, setEditingChatId] = useState<bigint | null>(null);
    const [editedChatName, setEditedChatName] = useState("");
    const editInputRef = useRef<HTMLInputElement>(null);
    
    // Manejador para iniciar la edición de un chat
    const handleEditChatName = (chat: Chat, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setEditingChatId(chat.id);
        setEditedChatName(chat.name);
        
        // Enfoque del input en el siguiente ciclo de renderizado
        setTimeout(() => {
            if (editInputRef.current) {
                editInputRef.current.focus();
                editInputRef.current.select();
            }
        }, 10);
    };

    // Manejador para guardar el nuevo nombre
    const handleSaveChatName = async (chatId: bigint) => {
        if (editedChatName.trim()) {
            try {
                // Llamar al servicio de backend para actualizar el nombre
                await renameChatService(chatId, editedChatName);
                
                // Actualizar el estado local
                const updatedChats = chats.map(chat => 
                    chat.id === chatId 
                    ? { ...chat, name: editedChatName } 
                    : chat
                );
                
                setChats(updatedChats);
                
                // Resetear el estado de edición
                setEditingChatId(null);
                setEditedChatName("");
            } catch (error) {
                console.error("Error al actualizar el nombre del chat:", error);
            }
        } else {
            // Si el nombre está vacío, dejarlo como estaba
            setEditingChatId(null);
        }
    };

    // Manejador para gestionar la pulsación de teclas durante la edición
    const handleKeyDown = (e: React.KeyboardEvent, chatId: bigint) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveChatName(chatId);
        } else if (e.key === 'Escape') {
            setEditingChatId(null);
            setEditedChatName("");
        }
    };

    const handleCreateNewChat = async () => {
        navigate('/home/chat');
        setIsNewChat(true);
        setCurrentChatID(0n);
        setMessages([]);
        setAIMessage([]);
    };

    useEffect(()=>{
        if(currentChatId == 0n){
            console.log("useEffect")
            handleCreateNewChat();
        }
    }, [currentChatId])
    
    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed)
    }

    const handleSelectChatWrapper = (chatId: bigint) => {
        // Si estamos editando, no seleccionar el chat
        if (editingChatId !== null) return;
        
        handleSelectChat(chatId, setMessages, setAIMessage, setCurrentChatID);
        setIsNewChat(false);
    };

    const location = useLocation();
    const { chatId } = useParams();

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
            deleteChat(chatId);
        } catch (error) {
            console.error("Error obteniendo los mensajes del chat:", error);
        }
    };

    // Manejador para cancelar la edición si se hace clic fuera del input
    const handleClickOutside = (e: MouseEvent) => {
        if (editingChatId !== null && editInputRef.current && !editInputRef.current.contains(e.target as Node)) {
            handleSaveChatName(editingChatId);
        }
    };

    useEffect(() => {
        // Agregar event listener para detectar clics fuera del input
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingChatId, editedChatName]);

    return (
        <div className="chat-list">
            <button 
                onClick={handleCreateNewChat} 
                className="new-chat-button"
            >
                <img 
                    src={newC} 
                    alt="New Chat"
                    style={{
                        width: '20px',
                        height: '20px'
                    }}
                    className="svg-button"
                />
            </button>
            
            {chats
                .slice()
                .reverse()
                .map((chat) => (
                    <div key={chat.id.toString()} className="chat-item">
                        <Link
                            to={`/home/chat/${chat.id.toString()}`}
                            onClick={() => handleSelectChatWrapper(chat.id)}
                            className="chat-link"
                        >
                            <div className={`chat-content ${chat.id === currentChatId ? 'active' : ''}`}>
                                {editingChatId === chat.id ? (
                                    <input
                                        ref={editInputRef}
                                        className="inline-edit-input"
                                        value={editedChatName}
                                        onChange={(e) => setEditedChatName(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, chat.id)}
                                        onBlur={() => handleSaveChatName(chat.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span>{chat.name}</span>
                                )}
                                <div className="chat-actions">
                                    <button
                                        onClick={(e) => handleEditChatName(chat, e)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            padding: 0,
                                            marginRight: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <img 
                                            src={editIcon} 
                                            alt="Edit"
                                            style={{
                                                width: '16px',
                                                height: '16px'
                                            }}
                                            className="svg-button"
                                        />
                                    </button>
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
                            </div>
                        </Link>
                    </div>
                ))}
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
  