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


interface MainHeaderProps{
    boton: () => void
    chat: boolean
}

export const MainHeader = ({boton, chat}: MainHeaderProps) => {
    const{setJWT, jwt, setCompanies, setMemories, setNewCompanyName, setNewMemoryName, setSelectedCompany, setSelectedMemory, companies, newCompanyName, newMemoryName, selectedCompanyId, selectedMemoryId}=useStore()
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
        try{
        if (selectedCompanyId && newMemoryName.trim()) {
            const response = await addMemoryService(jwt, newMemoryName, selectedCompanyId)
            console.log(response)
            const newMemory: Memory = {
                id: BigInt(response),
                name: newMemoryName
            };
            const updatedCompanies = companies.map(company => {
                if (company.id === selectedCompanyId) {
                    return {
                        ...company,
                        memories: [...company.memories, newMemory]
                    };
                }
                return company;
            });

            setCompanies(updatedCompanies);
            setNewMemoryName("");
            setShowMemoryModal(false);

        }
    }
    catch(error){console.error('Error adding memory', error);}
    };

    const handleDeleteCompany = (companyId: bigint) => {
        setCompanies(companies.filter(company => company.id !== companyId));
        if (selectedCompanyId === companyId) {
            setSelectedCompany(0n);
            setSelectedMemory(0n);
        }
    };

    const handleDeleteMemory = (memoryId: bigint) => {
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
            if (selectedMemoryId === memoryId) {
                setSelectedMemory(0n);
            }
        }
    };

    const logout = useCallback(() => {
        window.sessionStorage.removeItem("jwt");
        setJWT("");
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
    return (
        <header id="mainheader">
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center', maxWidth: '7vw'}}>
                <Dropdown style={{width: '100%', maxWidth: '7vw'}}>
                    <Dropdown.Toggle variant="dark" className="header-dropdown" style={{maxWidth:"7vw", textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}>
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

                <Dropdown>
                    <Dropdown.Toggle 
                        variant="dark" 
                        className="header-dropdown"
                        disabled={selectedCompanyId==0n}
                        style={{maxWidth:"7vw", textOverflow:"ellipsis", overflow:"hidden", whiteSpace:"nowrap"}}
                    >
                        {companies.find(company => company.id === selectedCompanyId)?.memories.find(memory => memory.id === selectedMemoryId)?.name || "Memoria"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        {companies.find(company => company.id === selectedCompanyId)?.memories.map(memory => (
                            <Dropdown.Item 
                                key={memory.id} 
                                onClick={() => setSelectedMemory(memory.id)}
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
            </div>

            <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginRight: '10px'}}>
                <button onClick={boton} className="header-button">
                    {chat ? '💬' : '📄'}
                </button>
                {content}
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