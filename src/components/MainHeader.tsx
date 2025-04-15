import "./styles.css";
import {Link, useNavigate} from 'react-router-dom'
import {useRoute} from 'wouter'
import {useStore} from "../hooks/useStore.tsx"
import {useCallback, useState, useEffect} from "react";
import { Dropdown, Button, Modal, Form } from 'react-bootstrap';
import { Company, Memory } from '../types';
import addBusinessService from '../services/addBusiness';
import addMemoryService from '../services/addMemory';
import getMemoriesFromBusiness from '../services/getMemoriesFromBusiness';
import deleteButton from "../assets/deleteButton.svg";
import deleteBusinessService from '../services/deleteBusiness.ts';
import deleteMemoryService from '../services/deleteMemory.ts';
import retrieveFromMemoryService from '../services/retrieveFromMemory.ts';
import getReportService from "../services/getReports.ts";

interface MainHeaderProps{
    boton: () => void;
    chat: boolean;
    isLeftCollapsed: boolean;
    toggleLeftColumn: () => void;
}

export const MainHeader = ({boton, chat, isLeftCollapsed, toggleLeftColumn}: MainHeaderProps) => {
    const{
        setJWT, 
        jwt, 
        setSubmittedUrls, 
        setFiles, 
        setpdfFilenames, 
        pdfFilenames, 
        setCompanies, 
        setMemories, 
        setNewCompanyName, 
        setNewMemoryName, 
        setSelectedCompany, 
        setSelectedMemory, 
        companies, 
        newCompanyName, 
        newMemoryName, 
        selectedCompanyId, 
        selectedMemoryId,
        reports,
        setReports,
        setIsSelectedCompanyAndMemory,
        rightColumnMode,
        setRightColumnMode,
        isRightColumnVisible,
        setRightColumnVisible
    } = useStore()
    const isLogged = Boolean(jwt)
    const goLogin = useNavigate();
    const [match] = useRoute("/");
    

    const [showCompanyModal, setShowCompanyModal] = useState(false);
    const [showMemoryModal, setShowMemoryModal] = useState(false);


    const handleAddCompany = async () => {
        try {
            if (newCompanyName.trim()) {
                const response = await addBusinessService(jwt, newCompanyName)
                console.log(response)
                console.log(newCompanyName)
                const newCompany: Company = {
                id: BigInt(response),
                name: newCompanyName,
                memories: [],
            };
            console.log(newCompany)
            setCompanies([...companies, newCompany]);
            setNewCompanyName("");
            setShowCompanyModal(false);
            }
        } catch (error) {
            console.error('Error adding company', error);
        }
    };

    const handleAddMemory = async () => {
        try {
            if (newMemoryName.trim() && selectedCompanyId != 0n) {
                const response = await addMemoryService(jwt, newMemoryName, selectedCompanyId);
                console.log(response);
                const newMemory: Memory = {
                    id: BigInt(response),
                    name: newMemoryName,
                    reports: [],
                    result: ''
                };
                
                setMemories(selectedCompanyId, [...companies.find(company => company.id === selectedCompanyId)?.memories || [], newMemory]);
                setSelectedMemory(newMemory.id);
                setNewMemoryName("");
                setShowMemoryModal(false);
                setIsSelectedCompanyAndMemory(true);
            } else {
                alert('Please select a company and enter a memory name');
            }
        } catch (error) {
            console.error('Error adding memory:', error);
        }
    };

    const handleDeleteCompany = async (companyId: bigint) => {
        try{
        setCompanies(companies.filter(company => company.id !== companyId));
        if (selectedCompanyId === companyId) {
            setSelectedCompany(0n);
            setSelectedMemory(0n);
        }
        const response = await deleteBusinessService(companyId);
    }
    catch(error){console.error('Error deleting company', error);}
    };

    const handleDeleteMemory = async (memoryId: bigint) => {
        try{
        if (selectedCompanyId!=0n) {
            const updatedCompanies = companies.map(company => {
                if (company.id === selectedCompanyId) {
                    return {
                        ...company,
                        memories: company.memories.filter(memory => memory.id !== memoryId)
                    };
                }
                return company;
            });
            setCompanies(updatedCompanies);
            const response = await deleteMemoryService(memoryId);
            if (selectedMemoryId === memoryId) {
                setSelectedMemory(0n);
            }
        }
        }
        catch(error){console.error('Error deleting memory', error);}
    };

    const handleSelectMemory = async (memoryId: bigint) => {
        setSubmittedUrls([])
        setFiles([])
        setpdfFilenames([])
        console.log("memoryId: ", memoryId);
        setSelectedMemory(memoryId);
        const response = await retrieveFromMemoryService(memoryId);

        const responseFilenames = response.filenames
        const urls = response.urls
        console.log("filenames: ", responseFilenames);
        console.log("urls: ", urls);
        const reports = response.reports
        console.log("reports: ", reports)
        setpdfFilenames(responseFilenames)
        setSubmittedUrls(urls)
        setReports(reports)
        console.log(response);
        setIsSelectedCompanyAndMemory(true)
    }

    const logout = useCallback(() => {
        window.sessionStorage.removeItem("jwt");
        setJWT("");
        window.location.href = "/";
    }, [setJWT]);

    const handleClick = () => {
        logout()
        goLogin("/")
    }

    const renderLoginButton = () => {
        return isLogged ? (
            <button onClick={handleClick} className="header-button">←</button>
        ) : (
            <Link to='/'><button className="header-button">→</button></Link>
        );
    }
    const content = renderLoginButton()

    const handleSelectCompany = async (companyId: bigint) => {
        const memories = await getMemoriesFromBusiness(jwt, companyId);
        console.log(memories);
        setSelectedCompany(companyId);
        if (Array.isArray(memories) && memories.length === 2 && Array.isArray(memories[0]) && Array.isArray(memories[1])) {
            const ids = memories[0]; 
            const names = memories[1]; 

            const formattedMemories: Memory[] = ids.map((id: bigint, index: number) => ({
                id: id,
                name: names[index], 
                reports: [],
                result: ''
            }));

            console.log(formattedMemories);
            if (formattedMemories.length > 0) {
                setSelectedMemory(formattedMemories[0].id); // Selecciona el primer chat si hay disponibles
            } else {
                console.log("No Memories available");
            }
            setMemories(companyId, formattedMemories); // Establecer el estado
        } else {
            console.error("Memories data is not in the expected format:", memories);
        }
        setSelectedMemory(0n);
    }

    // Funciones para controlar la columna derecha
    const toggleRightColumn = () => {
        setRightColumnVisible(!isRightColumnVisible);
    };

    const toggleFilesMode = () => {
        if (!isRightColumnVisible) {
            setRightColumnVisible(true);
        } else {
            setRightColumnMode(rightColumnMode === 'files' ? 'urls' : 'files');
        }
    };
    
    return (
        <header id="mainheader" className={isLeftCollapsed ? 'left-collapsed' : ''}>
            <div className="header-left">
                <button
                    onClick={toggleLeftColumn}
                    className="header-button toggle-left-column"
                    title={isLeftCollapsed ? "Mostrar columna" : "Ocultar columna"}
                >
                    {isLeftCollapsed ? 
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                    </svg> : 
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                    </svg>}
                </button>
                
                {chat && (
                <>
                <Dropdown style={{width: '100%'}}>
                    <Dropdown.Toggle variant="dark" className="header-dropdown" style={{textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}>
                        {companies.find(company => company.id === selectedCompanyId)?.name || "Empresa"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {companies.map(company => (
                            <Dropdown.Item 
                                key={company.id} 
                                onClick={() => handleSelectCompany(company.id)}
                                style={{display: 'flex', justifyContent: 'space-between'}}
                    
                            >
                                <span>{company.name}</span>
                                <button  
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteCompany(company.id);
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
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => setShowCompanyModal(true)}>
                            + Añadir Empresa
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>

                <Dropdown style={{marginLeft: "10px"}}>
                    <Dropdown.Toggle 
                        variant="dark" 
                        className="header-dropdown"
                        disabled={selectedCompanyId==0n}
                        style={{ textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}
                    >
                        {companies.find(company => company.id === selectedCompanyId)?.memories.find(memory => memory.id === selectedMemoryId)?.name || "Memoria"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {companies.find(company => company.id === selectedCompanyId)?.memories.map(memory => (
                            <Dropdown.Item 
                                key={memory.id} 
                                onClick={() => handleSelectMemory(memory.id)}
                                style={{display: 'flex', justifyContent: 'space-between'}}
                            >
                                <span>{memory.name}</span>
                                <button 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteMemory(memory.id);
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        padding: 0,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center'}}
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
                            </Dropdown.Item>
                        ))}
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={() => setShowMemoryModal(true)}>
                            + Añadir Memoria
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                </>
                )
            }
            </div>

            <div className="header-right">

                
            
                        {/* Controles fijos para la columna derecha */}
            <div className="right-column-controls">
                <button
                    onClick={toggleRightColumn}
                    className="header-button"
                    title={isRightColumnVisible ? "Ocultar panel lateral" : "Mostrar panel lateral"}
                >
                    {isRightColumnVisible ? 
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8z"/>
                    </svg>: 
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5z"/>
                    </svg> }
                </button>
                <button
                    onClick={toggleFilesMode}
                    className={`header-button ${isRightColumnVisible === true ? 'active-mode' : ''}`}
                    title="Modo Archivos"
                >
                    {rightColumnMode === 'files' ? 
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M9.293 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4.707A1 1 0 0 0 13.707 4L10 .293A1 1 0 0 0 9.293 0zM9.5 3.5v-2l3 3h-2a1 1 0 0 1-1-1zM4.5 9a.5.5 0 0 1 0-1h7a.5.5 0 0 1 0 1h-7zM4 10.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm.5 2.5a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1h-4z"/>
                    </svg>:
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1.002 1.002 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4.018 4.018 0 0 1-.128-1.287z"/>
                        <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243L6.586 4.672z"/>
                    </svg>
                    
                }
                </button>
                <button
                    onClick={boton}
                    className={`header-button ${chat === true ? 'active-mode' : ''}`}
                    title={chat ? "Modo Chat" : "Modo Generador"}
                >
                    {chat ? 
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z"/>
                    </svg> : 
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>}
                </button>
                {content}
            </div>
            </div>
            <Modal show={showCompanyModal} onHide={() => setShowCompanyModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir Nueva Empresa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Nombre de la empresa"
                        value={newCompanyName}
                        onChange={(e) => setNewCompanyName(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCompanyModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="dark" onClick={handleAddCompany}>
                        Añadir
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showMemoryModal} onHide={() => setShowMemoryModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Añadir Nueva Memoria</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control
                        type="text"
                        placeholder="Nombre de la memoria"
                        value={newMemoryName}
                        onChange={(e) => setNewMemoryName(e.target.value)}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowMemoryModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="dark" onClick={handleAddMemory}>
                        Añadir
                    </Button>
                </Modal.Footer>
            </Modal>
        </header>
    );
};

export default MainHeader;