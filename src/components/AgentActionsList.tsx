import React, { useState } from 'react';
import EditableAgentActionModal from './EditableAgentActionModal';
import {useStore} from "../hooks/useStore";
import { AgentAction } from '../types';

const AgentActionsList = () => {
  const {actions, setActions} = useStore();
  const [selectedAction, setSelectedAction] = useState<AgentAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (action: AgentAction) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAction(null);
  };

  const handleSaveAction = (updatedAction: AgentAction) => {
    // Actualizamos la lista de acciones reemplazando la acción actualizada
    const updatedActions = actions.map((action) => 
      action === selectedAction ? updatedAction : action
    );
  
    // Actualizamos el estado global con la lista modificada
    setActions(updatedActions);
  
    // Cerrar el modal y limpiar la acción seleccionada
    setSelectedAction(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)', // 3 columnas iguales
          gap: '20px', // Espacio entre filas y columnas
          marginTop: '20px',
        }}
      >
        {actions.map((action, index) => (
          <div
            key={index}
            onClick={() => openModal(action)}
            style={{
              cursor: 'pointer',
              border: '1px solid #ccc',
              padding: '15px',
              borderRadius: '8px',
              backgroundColor: '#f9f9f9',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <strong>{action.tool}</strong>
            <p>{typeof action.result === 'string' && action.result.substring(0, 50)}...</p>
          </div>
        ))}
      </div>

      {/* Modal para editar la acción seleccionada */}
      <EditableAgentActionModal
        show={isModalOpen}
        action={selectedAction}
        onClose={closeModal}
        onSave={handleSaveAction}
      />
    </div>
  );
};

export default AgentActionsList;
