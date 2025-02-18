import {Container, Button, Col, Row, Stack} from "react-bootstrap";
import TextBox from "./TextBox.tsx";
import {SectionType} from "../types.d";
//@ts-expecte
import DropdownMenu from "./DropdownMenu.jsx";
import EditableTextBox from "./EditableTextBox.tsx";
import ResultBox from "./ResultBox.tsx";
import {ClipboardIcon} from "./Icons.tsx";
import {useStore} from "../hooks/useStore.tsx";
import {setContext} from "../services/setContext.ts";
import {getContext} from "../services/getContext.ts";
import {useState} from "react";

function Generator () {
    const [showAdditionalContent, setShowAdditionalContent] = useState(false);
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
    }=useStore();

    const handleGetContext = async ()=> {
        setLoad(true)
        /*await getContext(text3).then(text2=>{
                changeText2(text2)
                setEditedText(text2)
            }
        ).catch(()=>changeText2('error'))*/
        changeText2("asjfnas")
        setEditedText("asjfnas")
        setShowAdditionalContent(true)
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

    const handleClipboard = () => {
        navigator.clipboard.writeText(result).catch(() => {})
    }

    return(
        <Container className="containerGen" style={{
            position: "absolute",
            top: "5vh",
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
                        {showAdditionalContent && (
                            <div style={{marginBottom: "20px", textAlign: "center"}}>
                                <h2 style={{color: "#0d0d0d"}}>Prompt Structure</h2>
                            </div>
                        )}
                        
                        {showAdditionalContent && (
                            <TextBox
                                type={SectionType.Box1}
                                value={text1}
                                onChange={changeText1}
                                showAdditionalContent={showAdditionalContent}
                            />
                        )}
                        
                        {showAdditionalContent && (
                            <EditableTextBox
                                editedText={editedText}
                                setShowModal={setShowModal}
                                onChange={setEditedText}
                                showModal={showModal}
                                text={text2}
                                setText={changeText2}
                            />
                        )}

                        <TextBox
                            type={SectionType.Box3}
                            value={text3}
                            onChange={changeText3}
                            showAdditionalContent={!showAdditionalContent}
                        />

                        {showAdditionalContent && (
                            <Button
                                style={{
                                    marginTop: "20px",
                                    height: "50px",
                                    backgroundColor: "#0d0d0d",
                                    border: "2px solid #0d0d0d",
                                    transition: "border-color 0.2s ease-in-out, opacity 0.2s ease-in-out"
                                }}
                                onClick={handleTextChange}
                                disabled={loading}
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
                    </Stack>
                </Col>

                {showAdditionalContent && (
                    <Col style={{
                        width: "100%",
                        maxWidth: "800px",
                        marginTop: "20px"
                    }}>
                        <ResultBox result={result} text1={text1} text2={text2} text3={text3}/>
                        <div style={{textAlign: "right", marginTop: "10px"}}>
                            <Button
                                variant='link'
                                onClick={handleClipboard}>
                                <ClipboardIcon/>
                            </Button>
                        </div>
                    </Col>
                )}

                {!showAdditionalContent && (
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