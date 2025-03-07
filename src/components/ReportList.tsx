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
import addReportService from "../services/addReport.ts";
import useUser from "../hooks/useUser.ts";
import deleteButton from "../assets/deleteButton.svg";
import deleteChatService from "../services/deleteChat.ts";
import { useLocation, useParams } from "react-router-dom";



export const ReportList = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [reportName, setReportName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { setActions, actions, text1, text3, changeText1, changeText3, addReport, jwt, currentReportId, reports, setReports, selectedMemoryId } = useStore();
    const handleNewReport = async () => {
        try {
            const reportsadded = await addReportService(jwt, selectedMemoryId,reportName);
            console.log("Reporte añadido:", reportsadded);
    
            const repId = reportsadded;
            console.log("repId")
            console.log(repId)
            addReport({ id: repId, name: reportName, text1: "", text2: "", tools_result:[], result:"" });
        } catch (error) {
            console.error("Error at handling new report:", error);
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
        if (reportName.trim()) {
            handleNewReport();
        }
        setIsEditing(false);
        setReportName("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    const handleSelectChatWrapper = (chatId: bigint) => {
        //handleSelectChat(chatId, setMessages, setAIMessage, setCurrentChatID)
      };

      const location = useLocation();
const { chatId } = useParams(); 

useEffect(() => {
  if (currentReportId) {
    handleSelectChatWrapper(BigInt(currentReportId)); 
  }
}, []); 

    const handleDeleteChat = async (chatId: bigint) => {
        console.log(chatId);
        //deleteChat(chatId);
        //console.log(chats)
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
                    value={reportName}
                    onChange={(e) => setReportName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        outline: 'none',
                    }}
                    placeholder="Enter report name..."
                />
            ) : (
                <Button 
                    onClick={() => setIsEditing(true)} 
                    className="new-chat-button"
                    bsPrefix="custom-button"
                >
                    New Report

                </Button>
            )}
            <div className="chat-list">
                {reports
                    .slice()
                    .reverse()
                    .map((report) => (
                        <div key={report.id.toString()} className="chat-item">
                            <Link
                                to={`/home/generator/${report.id.toString()}`}
                                onClick={() => handleSelectChatWrapper(report.id)}
                                className="chat-link"
                            >
                                <div className="chat-content">
                                    <span>{report.name}</span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            //handleDeleteChat(chat.id);
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
export default ReportList;


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
  