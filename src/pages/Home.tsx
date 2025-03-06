import './Home.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import {Container, Col} from 'react-bootstrap'
import {Outlet, useNavigate, useLocation} from "react-router-dom";
import {useStore} from "../hooks/useStore.tsx";
import {useState, useCallback, useEffect} from "react";
import MainHeader from "../components/MainHeader.tsx";
//import {postChat} from "../services/postChat.js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import DropdownMenu from '../components/DropdownMenu.jsx';
import DragAndDrop from '../components/DragAndDrop.tsx';
import UrlInput from '../components/UrlInput.js';
import ChatList from '../components/ChatList.tsx';
import Generator from '../components/Generator.tsx';
import ReportList from '../components/ReportList.tsx';

function HomePage () {
    const{
        chat,
        chats,
        setChat,
        setCurrentChatId,
    } = useStore();
    
    const [hovering, setHovering] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Determinar si estamos en modo chat basado en la URL
    const isInChatMode = location.pathname.includes('/home/chat');

    // Actualizar el estado chat basado en la ruta actual
    useEffect(() => {
        setChat(!isInChatMode);
    }, [location.pathname]);

    const handleSetChat = () => {
        // En lugar de cambiar el estado, ahora navegamos a la ruta correspondiente
        if (isInChatMode) {
            navigate('/home/generator');
        } else {
            navigate('/home/chat');
        }
    }

    const handleMouseHover = useCallback(() => {
        setHovering(prev => prev || true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHovering(prev => prev && false);
    }, []);

    return (
        <Container style={{margin: '0' , padding:'0', width:'100vw', height:'100vh', overflow:'hidden'}}>
            <MainHeader boton={handleSetChat} chat={!isInChatMode} />
            
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
            
            {isInChatMode && (
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
            )}

            {!isInChatMode && (
                <Col style={{
                    position: "absolute",
                    left: "0px",
                    top: "0vh",
                    width: "18vw",
                    display: "flex",
                    flexDirection: "column",
                    height: "100vh",
                }}>
                    <ReportList></ReportList>
                </Col>
            )}

            {/* El contenedor principal siempre muestra el Outlet que cargará el componente correcto */}
            <Container 
                className={isInChatMode ? "containerChat" : "containerGenerator"} 
                style={{
                    marginTop:'0px', 
                    width: isInChatMode ? '100vw' : '60vw', 
                    height: '100vh', 
                    overflow: 'hidden'
                }}
            >
                <Outlet/>
            </Container>
        </Container>
    );
}

export default HomePage;


