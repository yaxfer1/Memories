import React, { useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useStore } from "../hooks/useStore";
import ReactMarkdown from 'react-markdown';

interface ResultBoxProps {
  result: string;
  text1: string;
  text3: string;
}

const ResultBox: React.FC<ResultBoxProps> = ({ result, text1, text3 }) => {
    const { actions, currentReportId, reports, setSingleReport } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [editedResult, setEditedResult] = useState('');

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
    
    const handleOpenModal = () => {
      setEditedResult(result);
      setShowModal(true);
    };

    const handleSaveChanges = () => {
      // Encontrar el reporte actual
      const currentReport = reports.find(report => report.id === currentReportId);
      if (currentReport) {
        // Actualizar el reporte con el nuevo resultado
        setSingleReport({
          ...currentReport,
          RESULT: editedResult
        });
      }
      setShowModal(false);
    };
    
  return (
    <>
      <div className="memory-result-header">
        <h5 className="memory-result-title">Report Result</h5>
        <Button 
          className="report-edit-button"
          onClick={handleOpenModal}
        >
          Edit Result
        </Button>
      </div>
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

      {/* Modal para editar el resultado del reporte */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg"
        className="report-editor-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Report Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={20}
                value={editedResult}
                onChange={(e) => setEditedResult(e.target.value)}
                style={{ fontFamily: 'monospace' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            className="cancel-button" 
            onClick={() => setShowModal(false)}
          >
            Cancel
          </Button>
          <Button 
            className="save-button" 
            onClick={handleSaveChanges}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ResultBox;
