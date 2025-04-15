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
import UrlInput from '../components/UrlInput.tsx';
import ChatList from '../components/ChatList.tsx';
import Generator from '../components/Generator.tsx';
import ReportList from '../components/ReportList.tsx';
import useUser from '../hooks/useUser.ts';

function HomePage () {
    const{
        chat,
        chats,
        setChat,
        setCurrentChatId,
        setIsSelectedCompanyAndMemory,
        isRightColumnVisible,
        rightColumnMode,
        setRightColumnVisible,
        setRightColumnMode,
        isCollapsed,
        setIsCollapsed
    } = useStore();
    const {addChatUser} = useUser();
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

    // Funciones para controlar la columna derecha
    const toggleRightColumn = () => {
        setRightColumnVisible(!isRightColumnVisible);
    };

    const toggleLeftColumn = () => {
        setIsCollapsed(!isCollapsed);
    };

    const setFilesMode = () => {
        setRightColumnMode('files');
        if (!isRightColumnVisible) {
            setRightColumnVisible(true);
        }
    };

    const setUrlsMode = () => {
        setRightColumnMode('urls');
        if (!isRightColumnVisible) {
            setRightColumnVisible(true);
        }
    };

    return (
        <Container style={{margin: '0' , padding:'0', width:'100vw', height:'100vh', overflow:'hidden'}}>
            <div className={`side-column left-column ${isCollapsed ? 'collapsed' : ''}`}>
                {isInChatMode ? <ChatList chats={chats} setCurrentChatID={setCurrentChatId} /> : <ReportList />}
            </div>
            
            <MainHeader 
                boton={handleSetChat} 
                chat={!isInChatMode} 
                isLeftCollapsed={isCollapsed}
                toggleLeftColumn={toggleLeftColumn}
            />
            
            <div className={`main-content ${isCollapsed ? 'with-left-collapsed' : ''} ${isRightColumnVisible ? 'with-right-column' : ''}`}>
                <Outlet />
            </div>
            

            
            {/* Columna derecha con modo dinámico */}
            <div className={`side-column right-column ${!isRightColumnVisible ? 'hidden' : ''}`}>
                <div className="right-column-header">
                    <h3 className="right-column-title">
                        {rightColumnMode === 'files' ? 'Archivos' : 'URLs'}
                    </h3>
                </div>
                <div className="right-column-content">
                    {rightColumnMode === 'files' ? (
                        <DragAndDrop />
                    ) : (
                        <UrlInput />
                    )}
                </div>
            </div>
        </Container>
    );
}

export default HomePage;


