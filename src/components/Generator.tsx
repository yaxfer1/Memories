import {Container, Button, Col, Row, Stack} from "react-bootstrap";
import TextBox from "./TextBox.tsx";
import {SectionType} from "../types.d";
import DropdownMenu from "./DropdownMenu";
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
        await getContext(text3).then(text2=>{
                changeText2(text2)
                setEditedText(text2)
            }
        ).catch(()=>changeText2('error'))
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

            <Container className= "containerGen" style={{marginTop: '30px', left: 0, top:50, position:"absolute", display:"flow", height:"10vw"}}>

        <Row style={{
            width:"99vw",

            padding: "1.5rem 2.5rem",
            display: "flex",
            left: 0,
        }}>
            <Col style={{float: 'left', marginRight: '20px', height:"100px",}}>
                <Stack gap={2}>
                    {!showAdditionalContent &&
                        <div style={{marginTop: "125px", marginBottom: "100px"}}><span><h2>Context Retrieval from Database</h2></span>
                        </div>}
                    {showAdditionalContent &&
                        <div style={{marginBottom: "20px"}}><span><h2>Prompt Structure</h2></span></div>}
                    {showAdditionalContent && (<TextBox
                            type={SectionType.Box1}
                            value={text1}
                            onChange={changeText1}
                            showAdditionalContent={showAdditionalContent}

                        >
                            <DropdownMenu
                                onElementClick={changeText1}
                                type={"type1"}
                            ></DropdownMenu>

                        </TextBox>
                    )}
                    {showAdditionalContent && (<EditableTextBox
                        editedText={editedText}
                        setShowModal={setShowModal}
                        onChange={setEditedText}
                        showModal={showModal}
                        text={text2}
                        setText={changeText2}
                    ></EditableTextBox>)
                    }

                    <TextBox
                        type={SectionType.Box3}
                        value={text3}
                        onChange={changeText3}
                        showAdditionalContent={!showAdditionalContent}
                    >
                        {showAdditionalContent && (<DropdownMenu
                            onElementClick={changeText3}
                            type={"type2"}
                        ></DropdownMenu>)}
                    </TextBox>

                    {showAdditionalContent && (
                        <Button
                            style={{marginTop: "10px", height: "50px"}}
                            onClick={handleTextChange}
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="loader-container">
                                    <div className="loader"></div>
                                </div>
                            ) : (
                                "Send"
                            )}

                        </Button>)}


                </Stack>
            </Col>

            {showAdditionalContent && (<Col style={{float: 'left'}}>
                <ResultBox result={result} text1={text1} text2={text2} text3={text3}/>
                <div style={{position: 'absolute', left: 1770, top: 690, display: 'flex'}}>
                    <Button
                        variant='link'
                        onClick={handleClipboard}>
                        <ClipboardIcon/>
                    </Button>
                </div>
            </Col>)}

            {!showAdditionalContent && (
                <Button
                    style={{marginTop: "400px", height: "50px"}}
                    disabled={loading}
                    onClick={handleGetContext}>
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