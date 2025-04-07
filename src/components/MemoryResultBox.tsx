import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useStore } from "../hooks/useStore";
import ReactMarkdown from 'react-markdown';


const MemoryResultBox = () => {
    const { reports, finalMemory, setFinalMemory, isGeneratedResult, setIsGeneratedResult, companies, selectedCompanyId, selectedMemoryId } = useStore();
    const [showModal, setShowModal] = useState(false);
    const [editedMemory, setEditedMemory] = useState('');
    const [generatedContent, setGeneratedContent] = useState('');

    // Obtener la memoria seleccionada del estado
    const selectedMemory = companies
        .find(company => company.id === selectedCompanyId)
        ?.memories.find(memory => memory.id === selectedMemoryId);

    // Generar el contenido combinado de los reportes en su orden actual
    useEffect(() => {
      const combinedContent = reports.map((report) => 
        `## ${report.name}\n\n${report.RESULT}`
      ).join("\n\n");
      setGeneratedContent(combinedContent);
    }, [reports]);
  
    // Decidir qué contenido mostrar según isGeneratedResult
    const content = isGeneratedResult && selectedMemory 
      ? selectedMemory.result || "No hay resultado generado aún. Utiliza el botón 'Generate Memory'."
      : finalMemory || generatedContent;

    const handleOpenModal = () => {
      setEditedMemory(content);
      setShowModal(true);
    };

    const handleSaveChanges = () => {
      setFinalMemory(editedMemory);
      setShowModal(false);
    };

    const toggleGeneratedResult = () => {
      setIsGeneratedResult(!isGeneratedResult);
    };

  return (
    <>
      <div className="memory-result-header">
        <div className="d-flex align-items-center">
          <h5 className="memory-result-title me-3">Final Memory</h5>
          <div className="toggle-container d-flex align-items-center">
            <span className={`toggle-label ${!isGeneratedResult ? 'active' : ''}`}>
              Reportes combinados
            </span>
            <label className="switch mx-2">
              <input 
                type="checkbox" 
                checked={isGeneratedResult}
                onChange={toggleGeneratedResult}
              />
              <span className="slider round"></span>
            </label>
            <span className={`toggle-label ${isGeneratedResult ? 'active' : ''}`}>
              Memoria generada
            </span>
          </div>
        </div>
        <Button 
          className="memory-edit-button"
          onClick={handleOpenModal}
        >
          Edit Final Memory
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
          color: content.trim() ? "#000" : "#100",
          fontStyle: "normal",
        }}
      >
        <ReactMarkdown>{content}</ReactMarkdown>
      </Card>

      {/* Modal para editar la memoria final */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)} 
        size="lg"
        className="memory-editor-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Final Memory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={20}
                value={editedMemory}
                onChange={(e) => setEditedMemory(e.target.value)}
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

export default MemoryResultBox;
