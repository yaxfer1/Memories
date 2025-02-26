import React from 'react';
import { Card } from 'react-bootstrap';
import { useStore } from "../hooks/useStore";
import ReactMarkdown from 'react-markdown';

interface ResultBoxProps {
  result: string;
  text1: string;
  text3: string;
}

const ResultBox: React.FC<ResultBoxProps> = ({ result, text1, text3 }) => {
    const { actions } = useStore();

    // Obtener el resultado de todas las acciones
    const actionResult = actions.map((action) => action.result).join("\n\n");
  
    // Buscar la acción con tool === "final_answer"
    const finalAnswerAction = actions.find((action) => action.tool === "final_answer");
  
    // Extraer el contenido de `query` de manera estructurada
    let placeholderText = "No hay respuesta final disponible.";
    
    if (finalAnswerAction && finalAnswerAction.query) {
      const { introduction, main_body, research_steps, sources } = finalAnswerAction.query;
  
      // Formatear el contenido de `query`
      placeholderText = `### ${introduction || "Sin introducción"}\n\n`
        + `**Cuerpo:** ${main_body || "No disponible"}\n\n`
        + `**Pasos de investigación:** ${research_steps || "No especificado"}\n\n`
        + `**Fuentes:** ${sources || "No se encontraron fuentes"}\n`;
    }
  
    // Contenido combinado o placeholder si `result` está vacío
    const content = result.trim() ? result : placeholderText;
  return (
    <Card
      style={{
        position: "relative",
        height: "700px",
        width: "100%",
        overflowY: "scroll",
        border: "2px solid #ccc",
        marginBottom: "10px",
        marginTop: "10px",
        padding: "20px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        color: result.trim() ? "#000" : "#100",
        fontStyle: "normal",
      }}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </Card>
  );
};

export default ResultBox;
