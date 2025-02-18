
import './Home.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Col} from 'react-bootstrap'

import {Outlet} from "react-router-dom";
import {useStore} from "../hooks/useStore.tsx";
import useUser from "../hooks/useUser.ts";
import {useState, useCallback} from "react";
import MainHeader from "../components/MainHeader.tsx";
//import {postChat} from "../services/postChat.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import DropdownMenu from '../components/DropdownMenu.jsx';
// @ts-expect-error
import DragAndDrop from '../components/DragAndDrop.jsx';
// @ts-expect-error
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



    const handleSetChat = () =>{
        setChat(!chat)
    }



    const handleMouseHover = useCallback(() => {
        setHovering(prev => prev || true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHovering(prev => prev && false);
    }, []);


    return (

        <Container style={{margin: '0' , padding:'0', width:'100vw', height:'100vh', overflow:'hidden'}}>

            <MainHeader boton={handleSetChat} chat={chat} />
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
                                flex: "1", 
                                overflowY: "auto", 
                                borderBottom: "1px solid #ccc", 
                            }}
                        >
                            <DragAndDrop />
                        </div>

                        <div
                            style={{
                                flex: "1", 
                                overflowY: "auto", 
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
                        ></ChatList>
                    </Col>
            {chat && (<Container className="containerGenerator" style={{marginTop:'0px', width: '60vw', height: '100vh', overflow: 'hidden'}}><Generator></Generator></Container>)}

            {!chat && (<Container className="containerChat" style={{marginTop:'0px', width: '100vw', height: '100vh', overflow: 'hidden'}}>

                    <Outlet/>
            </Container>
            )}
        </Container>
    );
}

export default HomePage;


