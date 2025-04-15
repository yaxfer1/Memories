import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {useStore} from "../hooks/useStore"
import {AgentAction} from "../types";

interface EditableAgentActionModalProps {
  show: boolean;
  action: AgentAction | null;
  onClose: () => void;
  onSave: (editedAction: AgentAction) => void;
}

const EditableAgentActionModal: React.FC<EditableAgentActionModalProps> = ({
  show,
  action,
  onClose,
  onSave,
}) => {
  // Estados individuales para cada campo
  const [editedTool, setEditedTool] = useState<string>('');
  const [editedQuery, setEditedQuery] = useState<string>('');
  const [editedResult, setEditedResult] = useState<string>('');

  // Actualizar los campos cuando cambia la acción
  useEffect(() => {
    if (action) {
      setEditedTool(action.tool);
      setEditedQuery(JSON.stringify(action.query, null, 2)); // Formateo de JSON legible
      setEditedResult(action.result);
    }
  }, [action]);

  // Guardar cambios y enviar el objeto editado
  const handleSaveChanges = () => {
    const updatedAction: AgentAction = {
      tool: editedTool,
      query: editedQuery, // Se podría intentar volver a convertir a objeto si necesario
      result: editedResult,
    };
    onSave(updatedAction);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <Modal show={show} onHide={handleCancel} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Editar Detalle de la Acción</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Campo editable para la herramienta */}
        <Form.Group controlId="formTool">
          <Form.Label><strong>Tool</strong></Form.Label>
          <Form.Control
            type="text"
            style={{    
              border: "1px solid #0d0d0d",
              fontSize: '1em',
              backgroundColor: 'white',
              boxShadow: "none",
          }}
            value={editedTool}
            onChange={(e) => setEditedTool(e.target.value)}
          />
        </Form.Group>

        {/* Campo editable para la Query */}
        <Form.Group controlId="formQuery" className="mt-3">
          <Form.Label><strong>Query</strong></Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={editedQuery}
            onChange={(e) => setEditedQuery(e.target.value)}
            style={{    
              border: "1px solid #0d0d0d",
              fontSize: '1em',
              backgroundColor: 'white',
              boxShadow: "none",
          }}
          />
        </Form.Group>

        {/* Campo editable para el Resultado */}
        <Form.Group controlId="formResult" className="mt-3">
          <Form.Label><strong>Result</strong></Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            value={editedResult}
            onChange={(e) => setEditedResult(e.target.value)}
            style={{    
              border: "1px solid #0d0d0d",
              fontSize: '1em',
              backgroundColor: 'white',
              boxShadow: "none",
          }}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button className="cancel-button" onClick={handleCancel}>
          Cancel
        </Button>
        <Button className="save-button" onClick={handleSaveChanges}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditableAgentActionModal;
