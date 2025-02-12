import "./styles.css";
//import logoupv from "../assets/react.svg"
import {Link, useNavigate} from 'react-router-dom'
import {useRoute} from 'wouter'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
import {useStore} from "../hooks/useStore.tsx"
import {useCallback} from "react";
interface MainHeaderProps{
    boton: () => void
    chat: boolean
}
export const MainHeader = ({boton, chat}: MainHeaderProps) => {
    const{setJWT, jwt}=useStore()
    const isLogged = Boolean(jwt)
    const goLogin = useNavigate();
    const [match] = useRoute("/");
    const logout = useCallback(() => {
        window.sessionStorage.removeItem("jwt");
        setJWT(null); // Usa setJWT del useStore
    }, [setJWT]);
    const handleClick = () => {
        //e.preventDefault()
        //logout()
        logout()
        goLogin("/")
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment

    const renderLoginButton = () => {
        return isLogged ? (
            <button
                onClick={handleClick}
                className="header-button"
            >
                ←
            </button>
        ) : (
            <Link to='/'>
                <button
                    className="header-button"
                >
                    →
                </button>
            </Link>
        );
    }
    const content = match
        ? null
        : renderLoginButton()

    return (
        <header id="mainheader" style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '10px 20px',
            gap: '15px'
        }}>
            <button
                onClick={boton}
                className="header-button"
            >
                {chat ? '💬' : '📄'}
            </button>
            {content}
        </header>
    );
};

export default MainHeader;