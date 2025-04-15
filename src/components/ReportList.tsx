//import React from "react";
import {useEffect, useState, useRef} from "react";
import {
    Button,
    ListGroup,
    Modal,
    Form
} from "react-bootstrap";
import "./styles.css";
import {Report, AgentAction} from "../types";
import {Link, useNavigate} from "react-router-dom"
//import ChatBox from "./ChatBox.tsx";
import {useStore} from "../hooks/useStore.tsx"
//@ts-expect-error
import getChatMessages from "../services/getChatMessages.js";
import addReportService from "../services/addReport.ts";
import deleteButton from "../assets/deleteButton.svg";
import editIcon from "../assets/edit.svg";
import deleteReportService from "../services/deleteReport.ts";
import renameReportService from "../services/renameReport.ts";
import { useLocation, useParams } from "react-router-dom";
import getFromReport from "../services/getFromReport.ts";
import menuButton from "../assets/menuButton.svg";
import newC from "../assets/newA.svg";

export const ReportList = () => {
    const navigate = useNavigate();
    const { isCollapsed, setIsCollapsed, deleteReport, setAdditionalContentGenerator, setActions, changeText1, changeText3, addReport, jwt, currentReportId, setCurrentReportId, reports, selectedMemoryId, setResult, setIsFinalMemory, isFinalMemory, setSingleReport } = useStore();
    const [editingReportId, setEditingReportId] = useState<bigint | null>(null);
    const [editedReportName, setEditedReportName] = useState("");
    const editInputRef = useRef<HTMLInputElement>(null);

    const handleButNewReport = () => {
        navigate('/home/generator');
        setAdditionalContentGenerator(false);
        setIsFinalMemory(false);
    }

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    }

    // Manejador para iniciar la edición de un reporte
    const handleEditReportName = (report: Report, e: React.MouseEvent) => {
        //e.preventDefault();
        //e.stopPropagation();
        setEditingReportId(report.id);
        setEditedReportName(report.name);
        
        // Enfoque del input en el siguiente ciclo de renderizado
        setTimeout(() => {
            if (editInputRef.current) {
                editInputRef.current.focus();
                editInputRef.current.select();
            }
        }, 10);
    };

    // Manejador para guardar el nuevo nombre
    const handleSaveReportName = async (reportId: bigint) => {
        if (editedReportName.trim()) {
            try {
                // Llamar al servicio de backend para actualizar el nombre
                await renameReportService(reportId, editedReportName);
                
                // Buscar el reporte que estamos editando
                const reportToUpdate = reports.find(r => r.id === reportId);
                
                if (reportToUpdate) {
                    // Actualizar el reporte en el estado
                    const updatedReport = {
                        ...reportToUpdate,
                        name: editedReportName
                    };
                    
                    setSingleReport(updatedReport);
                }
                
                // Resetear el estado de edición
                setEditingReportId(null);
                setEditedReportName("");
            } catch (error) {
                console.error("Error al actualizar el nombre del reporte:", error);
            }
        } else {
            // Si el nombre está vacío, dejarlo como estaba
            setEditingReportId(null);
        }
    };

    // Manejador para gestionar la pulsación de teclas durante la edición
    const handleKeyDown = (e: React.KeyboardEvent, reportId: bigint) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSaveReportName(reportId);
        } else if (e.key === 'Escape') {
            setEditingReportId(null);
            setEditedReportName("");
        }
    };

    const handleSelectReportWrapper = (reportId: bigint) => {
        // Si estamos editando, no seleccionar el reporte
        if (editingReportId !== null) return;
        
        setIsFinalMemory(false)
        handleSelectReport(reportId, setCurrentReportId, reports, changeText1, changeText3, setResult, setAdditionalContentGenerator, setActions)
    };

    const handleDeleteReport = async (reportId: bigint) => {
        console.log(reportId);
        try {
            const response = await deleteReportService(reportId);  
            console.log(response);
            deleteReport(reportId);
        } catch (error) {
            console.error("Error al eliminar reporte:", error);
        }
    };

    const handleEndReport = () => {
        setAdditionalContentGenerator(true)
        setIsFinalMemory(true)
    }

    // Manejador para cancelar la edición si se hace clic fuera del input
    const handleClickOutside = (e: MouseEvent) => {
        if (editingReportId !== null && editInputRef.current && !editInputRef.current.contains(e.target as Node)) {
            handleSaveReportName(editingReportId);
        }
    };

    useEffect(() => {
        // Agregar event listener para detectar clics fuera del input
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [editingReportId, editedReportName]);

    return (
        <div className="chat-list">
            <button 
                onClick={handleButNewReport} 
                className="new-chat-button"
            >
                <img 
                    src={newC} 
                    alt="New Report"
                    style={{
                        width: '20px',
                        height: '20px'
                    }}
                    className="svg-button"
                />
            </button>
            
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
                            <div className={`chat-content ${report.id === currentReportId ? 'active' : ''}`}>
                                {editingReportId === report.id ? (
                                    <input
                                        ref={editInputRef}
                                        className="inline-edit-input"
                                        value={editedReportName}
                                        onChange={(e) => setEditedReportName(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, report.id)}
                                        onBlur={() => handleSaveReportName(report.id)}
                                        onClick={(e) => e.stopPropagation()}
                                    />
                                ) : (
                                    <span>{report.name}</span>
                                )}
                                <div className="chat-actions">
                                    <button
                                        onClick={(e) => handleEditReportName(report, e)}
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
                                            handleDeleteReport(report.id);
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
            <Link
                to={`/home/generator/result`}
                onClick={() => handleEndReport()}
                className="chat-link"
            >
                <div className={`chat-content ${isFinalMemory ? 'active' : ''}`}>
                <span><strong>End Report</strong></span>
                           <button
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                ></button>
            </div>
            </Link>
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
