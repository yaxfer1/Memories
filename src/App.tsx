import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import HomePage from "./pages/Home";
import { StoreProvider, useStore } from "./hooks/useStore.tsx";
import "./App.css";
import ChatBox from "./components/ChatBox.tsx";
import Generator from "./components/Generator.tsx";

// ✅ Componente para rutas protegidas
function PrivateRoute({ children }: { children: React.ReactNode }) {
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

                                {/* ✅ Ruta principal del Home que redirige al generador por defecto */}
                                <Route
                                    path="/home"
                                    element={
                                        //<PrivateRoute>
                                            <HomePage />
                                        //</PrivateRoute>
                                    }
                                >
                                    {/* Ruta por defecto - redirige a generator */}
                                    <Route index element={<Navigate to="chat" replace />} />
                                    
                                    {/* Ruta para el generador */}
                                    <Route path="generator" element={<Generator />} />
                                    <Route path="generator/:reportID" element={<Generator />} />
                                    {/* Ruta para el chat con parámetro opcional de chatID */}
                                    <Route path="chat" element={<ChatBox />} />
                                    <Route path="chat/:chatID" element={<ChatBox />} />
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
