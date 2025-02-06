import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/Home";
import { StoreProvider, useStore } from "./hooks/useStore.tsx";
import "./App.css";
import ChatBox from "./components/ChatBox.tsx";

// ✅ Componente para rutas protegidas
function PrivateRoute({ children }) {
    const { jwt } = useStore(); // Verifica si el usuario está autenticado
    return jwt ? children : <Navigate to="/" replace />;
}

export default function App() {
    return (
        <StoreProvider>
            <div className="App">
                <Suspense fallback={null}>
                    <section className="App-content">
                        <Router>
                            <Routes>
                                {/* ✅ Si el usuario no está logueado, va a Login */}
                                <Route path="/" element={<Login />} />

                                {/* ✅ Si está logueado, puede acceder a Home */}
                                <Route
                                    path="/home"
                                    element={
                                        //<PrivateRoute>
                                            <HomePage />
                                        //</PrivateRoute>
                                    }
                                >
                                    <Route path=":chatID" element={<ChatBox />} />
                                </Route>

                                {/* Redirección de rutas no encontradas */}
                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </Router>
                    </section>
                </Suspense>
            </div>
        </StoreProvider>
    );
}
