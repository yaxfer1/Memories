import {Container, Button, Col, Row, Stack, FormControl} from "react-bootstrap";
import TextBox from "./TextBox.tsx";
import {SectionType} from "../types.d";
import ResultBox from "./ResultBox.tsx";
import {ClipboardIcon} from "./Icons.tsx";
import {useStore} from "../hooks/useStore.tsx";
import {setContext} from "../services/setContext.ts";
import {useState, useRef, useEffect} from "react";
import fetchAgentActions from "../services/AgentActionsFetcher.tsx";
import AgentActionsList from "./AgentActionsList.tsx";
import generateParagraph from "../services/generateParagraph.ts";
import { EditableReportResultModal } from "./EditableReportResultModal.tsx";
import ReportResultList from "./ReportResultList.tsx";
import MemoryResultBox from "./MemoryResultBox.tsx";
import generateMemory from "../services/generateMemory.ts";
import addReportService from "../services/addReport.ts";

function Generator () {
    const{
        text1,
        changeText1,
        text2,
        changeText2,
        text3,
        changeText3,
        editedText,
        showModal,
        setShowModal,
        setEditedText,
        loading,
        result,
        setResult,
        setLoad,
        jwt,
        actions,
        setActions,
        generatorAdditionalContent,
        setAdditionalContentGenerator,
        currentReportId,
        isSelectedBusinessAndMemory,
        isFinalMemory,
        companies,
        reports,
        setSingleReport,
        selectedMemoryId,
        setSingleMemory,
        selectedCompanyId,
        setCurrentReportId,
        setIsGeneratedResult,
        addReport
    }=useStore();

    const [error, setError] = useState('');
    const inputRef = useRef<HTMLTextAreaElement>(null);

    // Efecto para enfocar el input cuando estamos en la vista inicial
    useEffect(() => {
        if (!generatorAdditionalContent && inputRef.current) {
            inputRef.current.focus();
        }
    }, [generatorAdditionalContent]);

    const handleGetContext = async ()=> {
        try {
            setLoad(true)
            
            // Crear un reporte con nombre basado en el contexto
            const nameContext = "Retrieval Prompt: "+ text1 + " Reports Name List:" + reports.map((report, index) =>  `${index + 1}. ${report.name}`).join(', ');
            
            // Llamar al servicio para crear un nuevo reporte
            const response = await addReportService(jwt, selectedMemoryId, nameContext);
            console.log("Response from addReportService:", response);
            
            // Extraer el ID y nombre del reporte (asumiendo que la respuesta tiene esta estructura)
            let repId;
            let repName;
            
            if (typeof response === 'object' && response !== null) {
                // Si la respuesta es un objeto con propiedades específicas
                repId = response.reportsadded || response.id ;
                repName = response.report_name || response.name || "Nuevo Reporte";
            } else {
                // Si la respuesta es directamente el ID
                repId = response;
                repName = "Nuevo Reporte";
            }
            
            console.log("New Report ID:", repId, "Name:", repName);
            
            // Añadir el reporte al estado
            const newReport = { 
                id: repId, 
                name: repName, 
                TEXT1: text1, 
                TEXT2: "", 
                tools_result: [], 
                RESULT: "" 
            };
            
            addReport(newReport);
            
            // Actualizar el ID del reporte actual
            setCurrentReportId(repId);
            
            // Ahora obtener las acciones del agente para este reporte
            const data = await fetchAgentActions(jwt, text1, repId);
            console.log("Agent Actions:", data);
            setActions(data);
            
            // Cambiar a modo de contenido adicional
            changeText2("asjfnas")
            setEditedText("asjfnas")
            setAdditionalContentGenerator(true)
            
            setError('');
        } catch (err: any) {
            console.error("Error in handleGetContext:", err);
            setError(err.message);
        } finally {
            setLoad(false);
        }
    }

    const handleTextChange =  async () => {
        // Aquí puedes realizar peticiones al backend con los textos y obtener el resultado
        // setResult(nuevoResultado);
        //setResult(result)
        // getContext().then(text3=>{changeText3(text3)}).catch(()=>changeText3('error'))
        //await getQuestion().then(result=>{setResult(result)}).catch(()=>setResult('error'))
        setLoad(true)
        await setContext(text1 + '|||' + text2 + '|||' + text3).then(result=>{

            setResult(result)

        }).catch(()=>setResult('error'))
        setLoad(false)
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        changeText1(e.target.value);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey && isSelectedBusinessAndMemory) {
            e.preventDefault();
            handleGetContext();
        }
    };

    const handleGenerateParagraph = async () =>{
        setLoad(true)
        try{
            const result = await generateParagraph(jwt, (text1 + '|||' + actions.map((action)=> (action.result)) + '|||' + text3), text1, text3, currentReportId)
            setResult(result)
            
            // Buscar el reporte actual en la lista
            const currentReport = reports.find(report => report.id === currentReportId);
            if (currentReport) {
                // Actualizar el reporte con el nuevo resultado
                setSingleReport({
                    ...currentReport,
                    TEXT1: text1,
                    TEXT2: text2,
                    RESULT: result
                });
            }
        }
        catch(err: any){
            setError(err.message)
        }
        setLoad(false)
    }

    const handleGenerateMemory = async () =>{
        setLoad(true)
        try{
            const result = await generateMemory(jwt, (text1 + '|||' + reports.map((report)=> (report.RESULT)) + '|||' + text3), text1, text3, selectedMemoryId)
            const currentMemory = companies
            .find(company => company.id === selectedCompanyId)
            ?.memories.find(memory => memory.id === selectedMemoryId);
        
            if (currentMemory) {
              // Actualizar el reporte con el nuevo resultado
              setSingleMemory({
                ...currentMemory,
                result: result
              });}
              setIsGeneratedResult(true)
        }
        catch(err: any){
            setError(err.message)
        }
        setLoad(false)
    }

    const handleClipboard = () => {
        navigator.clipboard.writeText(result).catch(() => {})
    }

    return(
        <Container className="containerGen" style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60vw",
            height: "90vh",
            overflowY: "auto",
            padding: "20px",
            scrollBehavior: "smooth"
        }}>
            {!generatorAdditionalContent && isSelectedBusinessAndMemory ? (
                <div className="new-report-container">
                    <div className="new-report-prompt">
                        <div className="new-report-header">
                            <h2>Nuevo Reporte</h2>
                            <p>Escribe tu consulta para generar un reporte técnico basado en la información disponible</p>
                        </div>
                        <div className="new-report-input-wrapper">
                            <FormControl
                                as="textarea"
                                placeholder="Describe el tema del reporte o qué información necesitas..."
                                className="new-report-input"
                                value={text1}
                                onChange={handleInputChange}
                                onKeyDown={handleKeyDown}
                                ref={inputRef}
                                disabled={loading}
                            />
                            <Button
                                style={{
                                    width: "100%",
                                    marginTop: "10px",
                                    height: "50px",
                                    backgroundColor: "#0d0d0d",
                                    border: "2px solid #0d0d0d",
                                    transition: "all 0.2s ease"
                                }}
                                disabled={loading}
                                onClick={handleGetContext}
                                className="new-report-button-send"
                            >
                                {loading ? (
                                    <div className="loader"></div>
                                ) : (
                                    "Generar Reporte"
                                )}
                            </Button>
                        </div>
                        {!isSelectedBusinessAndMemory && (
                            <div className="warning-message">
                                <p>Primero selecciona una empresa y una memoria para poder generar un reporte.</p>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <Row style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    margin: "0",
                  
                }}>
                    <Col style={{
                        width: "100%",
                        maxWidth: "800px",
                        marginBottom: "20px",
                        marginTop: "8vh",
                    }}>
                        <Stack gap={3}>
                            <TextBox
                                type={SectionType.Box1}
                                value={text1}
                                onChange={changeText1}
                                showAdditionalContent={!generatorAdditionalContent}
                                isSelectedBusinessAndMemory={isSelectedBusinessAndMemory}
                            />
                            
                            {generatorAdditionalContent &&  (!isFinalMemory && (actions.length > 0 &&(<AgentActionsList></AgentActionsList>)))}

                            {generatorAdditionalContent && (isFinalMemory &&(<ReportResultList></ReportResultList>))}

                            {generatorAdditionalContent && (
                                <TextBox
                                    type={SectionType.Box3}
                                    value={text3}
                                    onChange={changeText3}
                                    showAdditionalContent={generatorAdditionalContent}
                                    isSelectedBusinessAndMemory={isSelectedBusinessAndMemory}
                                />
                            )}
                            
                            


                            {generatorAdditionalContent && !isFinalMemory &&(
                                <Button
                                    style={{
                                        marginTop: "20px",
                                        height: "50px",
                                        backgroundColor: "#0d0d0d",
                                        border: "2px solid #0d0d0d",
                                        transition: "border-color 0.2s ease-in-out, opacity 0.2s ease-in-out"
                                    }}
                                    onClick={handleGenerateParagraph}
                                    disabled={loading}
                                    className="regenerate-button"
                                >
                                    {loading ? (
                                        <div className="loader-container">
                                            <div className="loader"></div>
                                        </div>
                                    ) : (
                                        "Regenerate"
                                    )}
                                </Button>
                            )}
                            {generatorAdditionalContent && isFinalMemory &&(
                                <Button
                                    style={{
                                        marginTop: "20px",
                                        height: "50px",
                                        backgroundColor: "#0d0d0d",
                                        border: "2px solid #0d0d0d",
                                        transition: "border-color 0.2s ease-in-out, opacity 0.2s ease-in-out"
                                    }}
                                    onClick={handleGenerateMemory}
                                    disabled={loading}
                                    className="regenerate-button"
                                >
                                    {loading ? (
                                        <div className="loader-container">
                                            <div className="loader"></div>
                                        </div>
                                    ) : (
                                        "Generate Memory"
                                    )}
                                </Button>
                            )}
                        </Stack>
                    </Col>

                    {generatorAdditionalContent && isFinalMemory && (
                        <Col style={{
                            width: "100%",
                            maxWidth: "800px",
                            marginTop: "20px"
                        }}>
                            <MemoryResultBox/>
                            <div style={{textAlign: "right", marginTop: "10px"}}>
                                <Button
                                    variant='link'
                                    onClick={handleClipboard}>
                                    <ClipboardIcon/>
                                </Button>
                            </div>
                        </Col>
                    )}

                    {generatorAdditionalContent && !isFinalMemory && (
                        <Col style={{
                            width: "100%",
                            maxWidth: "800px",
                            marginTop: "20px"
                        }}>
                            <ResultBox result={result} text1={text1} text3={text3}/>
                            <div style={{textAlign: "right", marginTop: "10px"}}>
                                <Button
                                    variant='link'
                                    onClick={handleClipboard}>
                                    <ClipboardIcon/>
                                </Button>
                            </div>
                        </Col>
                    )}
                </Row>
            )}
        </Container>
    );
};
export default Generator;