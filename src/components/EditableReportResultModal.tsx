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
            setEditedResult(report.result);
        }
    }, [report]);

    const handleSave = () => {
        if (report) {
            onSave({
                ...report,
                name: editedName,
                result: editedResult,
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
                        <Form.Label>Report Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Report Result</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={10}
                            value={editedResult}
                            onChange={(e) => setEditedResult(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSave}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}; 