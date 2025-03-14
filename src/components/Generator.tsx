import {Container, Button, Col, Row, Stack} from "react-bootstrap";
import TextBox from "./TextBox.tsx";
import {SectionType} from "../types.d";
import ResultBox from "./ResultBox.tsx";
import {ClipboardIcon} from "./Icons.tsx";
import {useStore} from "../hooks/useStore.tsx";
import {setContext} from "../services/setContext.ts";
import {useState} from "react";
import fetchAgentActions from "../services/AgentActionsFetcher.tsx";
import AgentActionsList from "./AgentActionsList.tsx";
import generateParagraph from "../services/generateParagraph.ts";

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
    }=useStore();

    

    const [error, setError] = useState('');
    const handleGetContext = async ()=> {
        try {
            setLoad(true)
            const data = await fetchAgentActions(jwt, text1, currentReportId);
            setActions(data); // Se espera que 'data' sea un array con las acciones
            setError('');
            } catch (err: any) {
            setError(err.message);
            }
        changeText2("asjfnas")
        setEditedText("asjfnas")
        setAdditionalContentGenerator(true)
        setLoad(false)

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

    const handleGenerateParagraph = async () =>{
        setLoad(true)
        try{
            
            const result = await generateParagraph(jwt, (text1 + '|||' + actions.map((action)=> (action.result)) + '|||' + text3), text1, text3, currentReportId)
            setResult(result)
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
            top: "8vh",
            left: "50%",
            transform: "translateX(-50%)",
            width: "60vw",
            height: "90vh",
            overflowY: "auto",
            padding: "20px",
            scrollBehavior: "smooth"
        }}>
            <Row style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100%",
                margin: "0"
            }}>
                <Col style={{
                    width: "100%",
                    maxWidth: "800px",
                    marginBottom: "20px"
                }}>
                    <Stack gap={3}>
                        <TextBox
                            type={SectionType.Box1}
                            value={text1}
                            onChange={changeText1}
                            showAdditionalContent={!generatorAdditionalContent}
                        />
                        
                        {generatorAdditionalContent && (actions.length > 0 &&(<AgentActionsList></AgentActionsList>))}

                        {generatorAdditionalContent && (
                            <TextBox
                                type={SectionType.Box3}
                                value={text3}
                                onChange={changeText3}
                                showAdditionalContent={generatorAdditionalContent}
                            />
                        )}
                        
                        


                        {generatorAdditionalContent && (
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
                    </Stack>
                </Col>

                {generatorAdditionalContent && (
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

                {!generatorAdditionalContent && isSelectedBusinessAndMemory && (
                    <Button
                        style={{
                            marginTop: "20px",
                            height: "50px",
                            backgroundColor: "#0d0d0d",
                            border: "2px solid #0d0d0d",
                            transition: "border-color 0.2s ease-in-out, opacity 0.2s ease-in-out"
                        }}
                        disabled={loading}
                        onClick={handleGetContext}
                        className="send-button"
                    >
                        {loading ? (
                            <div className="loader-container">
                                <div className="loader"></div>
                            </div>
                        ) : (
                            "Send"
                        )}
                    </Button>
                )}
            </Row>
        </Container>
    );
};
export default Generator;