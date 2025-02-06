
import './Home.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Col} from 'react-bootstrap'
import "../assets/react.svg"
import {Outlet} from "react-router-dom";
import {useStore} from "../hooks/useStore.tsx";
import useUser from "../hooks/useUser.ts";
import {useState, useCallback, useMemo} from "react";
import MainHeader from "../components/MainHeader.tsx";
//import {postChat} from "../services/postChat.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import DropdownMenu from '../components/DropdownMenu.jsx';
import DragAndDrop from '../components/DragAndDrop.jsx';
import UrlInput from '../components/UrlInput.jsx';
import ChatList from '../components/ChatList.tsx';
import Generator from '../components/Generator.tsx';


function HomePage () {


    const{
        chat,
        chats,
        setChat,
        setCurrentChatId,
    }=useStore()
    const [hovering, setHovering] = useState(true);
    const { addChatUser } = useUser();



    const handleSetChat = () =>{
        setChat(!chat)
    }



    const handleMouseHover = useCallback(() => {
        setHovering(prev => prev || true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHovering(prev => prev && false);
    }, []);

    const handleNewChat = async () => {
        //const newChatId = BigInt(Math.floor(Date.now() / 1000)); // Convierte el tiempo actual en segundos a BigInt
        const chat_name =  "CHATPRUEBA";
        console.log(chat_name)
        const chatsadded =await addChatUser(chat_name);
        console.log(chatsadded)
        //addChat({ id: newChatId, name: `Chat ${chats.length + 1}`, messages: [], aimessages: [] });
        //setCurrentChatId(newChatId);
    };

    return (

        <Container style={{margin: '0' , padding:'0', width:'100vw', height:'100vh', overflow:'hidden'}}>
            <Container onMouseOver={handleMouseHover} onMouseOut={handleMouseLeave}  style={{
                position: "absolute",
                height: "5vw",
                top: "0px",
                left: "15vw",
                maxWidth:"none",
                width: "100vw", // Fondo para identificar la zona
                zIndex: "10000",
            }}>
                {hovering && (<MainHeader boton={handleSetChat} chat={chat} />)}
            </Container>

            {chat && <Generator></Generator>}

            {!chat && (<Container className="containerChat" style={{marginTop:'0px', width: '100vw', height: '100vh', overflow: 'hidden'}}>

                    <Outlet/>
                    <Col
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "10vh",
                            width: "18vw",
                            display: "flex",
                            flexDirection: "column",
                            height: "100%",
                            overflowY: "auto",
                            zIndex: "0",
                        }}
                    >
                        <div
                            style={{
                                flex: "1", // Para que ocupe proporcionalmente el espacio disponible
                                overflowY: "auto", // Para manejar contenido desbordado
                                borderBottom: "1px solid #ccc", // Línea divisoria opcional
                            }}
                        >
                            <DragAndDrop />
                        </div>

                        <div
                            style={{
                                flex: "1", // Ocupará el mismo espacio que el anterior
                                overflowY: "auto", // También manejamos contenido desbordado
                            }}
                        >
                            <UrlInput />
                        </div>
                    </Col>

                    <Col style={{
                        position: "absolute",
                        left: "0px",
                        top: "0vh",
                        width: "18vw",
                        display: "flex",
                        flexDirection: "column",
                        height: "100vh",
                    }}>
                        <ChatList
                            chats={chats}
                            setCurrentChatID={setCurrentChatId}
                            onNewChat={handleNewChat}
                        ></ChatList>
                    </Col>
            </Container>
            )}
        </Container>
    );
}

export default HomePage;


