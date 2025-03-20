import React, { useState } from "react";
import {useNavigate} from "react-router-dom"
import useUser from '../../hooks/useUser.ts'
import { useEffect } from "react";
import './index.css'

export default function Login({onLogin}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerError, setRegisterError] = useState(false);
    const navigate = useNavigate()
    const {isLoginLoading, hasLoginError, login, isLogged, register} = useUser()

    useEffect(() => {
        if (isLogged) {
            navigate('/home')
            onLogin && onLogin()
        }
    }, [isLogged, navigate, onLogin])

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isRegistering) {
            setRegisterError(false);
            register({ username, password })
                .then(() => {
                    // Si el registro es exitoso, hacer login automáticamente
                    login({ username, password });
                })
                .catch(() => {
                    setRegisterError(true);
                });
        } else {
            login({ username, password });
        }
    };

    const handleRegister = (e) => {
        e.preventDefault();
        setIsRegistering(!isRegistering);
        setRegisterError(false);
    }

    return (
        <>
            {isLoginLoading && <strong className="loading"> Checking credentials... </strong>}
            {!isLoginLoading &&
                <form className='form' onSubmit={handleSubmit}>
                    <label htmlFor="username">
                        <input
                            id="username"
                            type="text"
                            placeholder="username"
                            onChange={(e) => setUsername(e.target.value)}
                            value={username}
                        />
                    </label>

                    <label htmlFor="password">
                        <input
                            id="password"
                            type="password"
                            placeholder="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                        />
                    </label>

                    <button className='btn' type="submit">
                        <strong>{isRegistering ? 'Register' : 'Login'}</strong>
                    </button>
                    <button className='btn' onClick={handleRegister}>
                        <strong>{isRegistering ? 'Back to Login' : 'Go to Register'}</strong>
                    </button>
                </form>
            }
            {hasLoginError && !isRegistering && 
                <strong className="form-error">Credentials are invalid</strong>
            }
            {registerError && isRegistering && 
                <strong className="form-error">Registration failed. Try a different username.</strong>
            }
        </>
    );
}