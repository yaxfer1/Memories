import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, ListGroup } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useStore } from '../hooks/useStore';
import { EditableReportResultModal } from './EditableReportResultModal';
import { generateFinalMemory } from '../services/generateFinalMemory';

interface Report {
    id: bigint;
    name: string;
    result: string;
}

export const FinalMemoryView: React.FC = () => {
    const { reports, setReports, setFinalMemory } = useStore();
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDragEnd = (result: any) => {
        if (!result.destination) return;

        const items = Array.from(reports);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setReports(items);
    };

    const handleEditReport = (report: Report) => {
        setSelectedReport(report);
        setShowEditModal(true);
    };

    const handleSaveEdit = (editedReport: Report) => {
        const updatedReports = reports.map(report => 
            report.id === editedReport.id ? editedReport : report
        );
        setReports(updatedReports);
        setShowEditModal(false);
        setSelectedReport(null);
    };

    const handleGenerateFinalMemory = async () => {
        try {
            setIsGenerating(true);
            const finalMemory = await generateFinalMemory(reports);
            setFinalMemory(finalMemory);
        } catch (error) {
            console.error('Error generating final memory:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Container fluid className="final-memory-view">
            <Row className="mb-4">
                <Col>
                    <h2>Final Memory Generation</h2>
                    <p>Review and organize your reports before generating the final memory.</p>
                </Col>
                <Col xs="auto">
                    <Button 
                        variant="primary" 
                        onClick={handleGenerateFinalMemory}
                        disabled={isGenerating || reports.length === 0}
                    >
                        {isGenerating ? 'Generating...' : 'Generate Final Memory'}
                    </Button>
                </Col>
            </Row>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="reports">
                    {(provided) => (
                        <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
                            {reports.map((report, index) => (
                                <Draggable key={report.id.toString()} draggableId={report.id.toString()} index={index}>
                                    {(provided) => (
                                        <ListGroup.Item
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Card>
                                                <Card.Header>
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <h5 className="mb-0">{report.name}</h5>
                                                        <Button 
                                                            variant="outline-primary" 
                                                            size="sm"
                                                            onClick={() => handleEditReport(report)}
                                                        >
                                                            Edit
                                                        </Button>
                                                    </div>
                                                </Card.Header>
                                                <Card.Body>
                                                    <p className="mb-0">{report.result}</p>
                                                </Card.Body>
                                            </Card>
                                        </ListGroup.Item>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </ListGroup>
                    )}
                </Droppable>
            </DragDropContext>

            <EditableReportResultModal
                show={showEditModal}
                report={selectedReport}
                onClose={() => {
                    setShowEditModal(false);
                    setSelectedReport(null);
                }}
                onSave={handleSaveEdit}
            />
        </Container>
    );
}; 