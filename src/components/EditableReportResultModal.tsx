import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { Report } from '../types';

interface EditableReportResultModalProps {
    show: boolean;
    report: Report | null;
    onClose: () => void;
    onSave: (report: Report) => void;
}

export const EditableReportResultModal: React.FC<EditableReportResultModalProps> = ({
    show,
    report,
    onClose,
    onSave,
}) => {
    const [editedName, setEditedName] = useState('');
    const [editedResult, setEditedResult] = useState('');

    useEffect(() => {
        if (report) {
            setEditedName(report.name);
            setEditedResult(report.RESULT);
        }
    }, [report]);

    const handleSave = () => {
        if (report) {
            onSave({
                ...report,
                name: editedName,
                RESULT: editedResult,
            });
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit Report</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Report Name</strong></Form.Label>
                        <Form.Control
                            type="text"
                            style={{    
                                border: "1px solid #0d0d0d",
                                fontSize: '1em',
                                backgroundColor: 'white',
                                boxShadow: "none",
                            }}
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label><strong>Report Result</strong></Form.Label>
                        <Form.Control
                            as="textarea"
                            style={{    
                                border: "1px solid #0d0d0d",
                                height: '500px',
                                fontSize: '1em',
                                backgroundColor: 'white',
                                boxShadow: "none",
                            }}
                            rows={10}
                            value={editedResult}
                            onChange={(e) => setEditedResult(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <button className="cancel-button" onClick={onClose}>
                    Cancel
                </button>
                <button className="save-button" onClick={handleSave}>
                    Save Changes
                </button>
            </Modal.Footer>
        </Modal>
    );
}; 