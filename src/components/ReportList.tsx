//import React from "react";
import {useEffect, useState, useRef} from "react";
import {
    Button,
} from "react-bootstrap";
import "./styles.css";
import {Report, AgentAction} from "../types";
import {Link} from "react-router-dom"
//import ChatBox from "./ChatBox.tsx";
import {useStore} from "../hooks/useStore.tsx"
//@ts-expect-error
import getChatMessages from "../services/getChatMessages.js";
import addReportService from "../services/addReport.ts";
import deleteButton from "../assets/deleteButton.svg";
import deleteChatService from "../services/deleteChat.ts";
import { useLocation, useParams } from "react-router-dom";
import getFromReport from "../services/getFromReport.ts";


export const ReportList = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [reportName, setReportName] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const { setAdditionalContentGenerator, setActions, actions, text1, text3, changeText1, changeText3, addReport, jwt, currentReportId, setCurrentReportId, reports, setReports, selectedMemoryId, setResult} = useStore();
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

    const handleSelectReportWrapper = (reportId: bigint) => {
        handleSelectReport(reportId, setCurrentReportId, reports, changeText1, changeText3, setResult, setAdditionalContentGenerator, setActions)
      };

      const location = useLocation();
const { reportId } = useParams(); 

useEffect(() => {
  if (currentReportId) {
    handleSelectReportWrapper(BigInt(currentReportId)); 
  }
}, []); 

    const handleDeleteChat = async (reportId: bigint) => {
        console.log(reportId);
        //deleteChat(chatId);
        //console.log(chats)
        try {
            const response = await deleteChatService(reportId);  
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
                                onClick={() => handleSelectReportWrapper(report.id)}
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


export const handleSelectReport = async (
    reportId: bigint,
    setCurrentReportId: (id: bigint) => void,
    reports: Report[],
    changeText1: (text: string) => void,
    changeText3: (text: string) => void,
    setResult: (text: string) => void,
    setAdditionalContentGenerator: (a: boolean) => void,
    setActions: (action: AgentAction[]) => void
) => {
    setCurrentReportId(reportId);

    // Obtener la data del reporte
    const response = await getFromReport(reportId);
    console.log("Respuesta recibida:", response);

    if (!Array.isArray(response) || response.length < 2) {
        console.error("Formato de respuesta inesperado:", response);
        setAdditionalContentGenerator(false);
        return;
    }

    // Extraer los valores correctos
    const reportData = response[0]; // Primer objeto con TEXT1 y TEXT2
    const tools = Array.isArray(response[1]) ? response[1] : []; // Segundo elemento (lista de herramientas)

    console.log("Tools:", tools);
    console.log("Report Data:", reportData);

    // Buscar el reporte en la lista de reports

    setAdditionalContentGenerator(true);
    if (tools.length > 0) {
        setActions(tools);
        setAdditionalContentGenerator(true);
    } else {
         setAdditionalContentGenerator(false);
    }

        // Asignar los textos del reporte
    changeText1(reportData.TEXT1 || ""); // Evitar valores undefined
    changeText3(reportData.TEXT2 || "");
    setResult(reportData.RESULT || "");
    
};
