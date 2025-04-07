import React, { useState, useRef } from 'react';
import { Card, Button, ListGroup } from 'react-bootstrap';
import { useStore } from "../hooks/useStore";
import { Report } from '../types';
import { EditableReportResultModal } from './EditableReportResultModal';

const ReportResultList = () => {
  const { reports, setReports } = useStore();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const dragItemNode = useRef<HTMLDivElement | null>(null);

  const openModal = (report: Report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleSaveReport = (updatedReport: Report) => {
    // Actualizamos la lista de reportes con el reporte actualizado
    const updatedReports = reports.map((report) => 
      report.id === updatedReport.id ? updatedReport : report
    );
    
    // Actualizamos el estado global con la lista modificada
    setReports(updatedReports);
    
    // Cerrar el modal y limpiar el reporte seleccionado
    closeModal();
  };

  // Funciones para manejar el drag and drop
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index);
    dragItemNode.current = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    setDraggedItemIndex(null);
    dragItemNode.current?.classList.remove('dragging');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null) return;
    
    // Crear una copia del array de reportes
    const newReports = [...reports];
    
    // Guardar el reporte que estamos moviendo
    const draggedReport = newReports[draggedItemIndex];
    
    // Eliminar el reporte de su posición original
    newReports.splice(draggedItemIndex, 1);
    
    // Insertar el reporte en la nueva posición
    newReports.splice(index, 0, draggedReport);
    
    // Actualizar el estado con el nuevo orden
    setReports(newReports);
  };

  return (
    <div>
      <p className="text-muted mb-3">Drag and drop to reorder. Click on a report to edit it.</p>
      
      <div className="report-list">
        {reports.map((report, index) => (
          <div
            key={report.id.toString()}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className="report-card-container"
          >
            <Card
              onClick={() => openModal(report)}
              className="report-card"
            >
              <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                  <span className="report-handle">☰</span>
                  <h5 className="mb-0">{report.name}</h5>
                  <Button 
                    className="report-edit-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModal(report);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
              {report.RESULT ? (
                <p className="mb-0 report-preview">{report.RESULT.substring(0, 150)}...</p>
              ) : null}

              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <EditableReportResultModal
        show={isModalOpen}
        report={selectedReport}
        onClose={closeModal}
        onSave={handleSaveReport}
      />
    </div>
  );
};

export default ReportResultList;
