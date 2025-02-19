import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useStore } from "../hooks/useStore";
const AI_CHAT_FILES = 'http://127.0.0.1:5000/api/upload_files';

const DragAndDrop = () => {
    const [uploading, setUploading] = useState(false);
    const {files, setFiles, selectedMemoryId, pdfFilenames, setpdfFilenames} = useStore();

    const onDrop = (acceptedFiles: File[]) => {
        console.log("acceptedFiles: ", acceptedFiles);
        const pdfFiles = acceptedFiles.filter((file: File) => file.type === "application/pdf");
        setFiles([...files, ...pdfFiles]);
        setpdfFilenames([...pdfFilenames, ...pdfFiles.map((file) => file.name)]);
        uploadFiles(pdfFiles);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "application/pdf": [] },
    });
    const uploadFiles = async (pdfFiles: File[]) => {
        if (pdfFiles.length === 0) {
            alert("No hay archivos para enviar.");
            return;
        }

        const formData = new FormData();
        pdfFiles.forEach((file) => {
            formData.append("files", file);
        });
        formData.append("memory_id", selectedMemoryId.toString());
        console.log("formData: ", formData);
        try {
            setUploading(true);

            const res = await fetch(AI_CHAT_FILES, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Error al enviar los archivos. Código: ${res.status}`);
            }

            const data = await res.json();
            console.log("Respuesta del servidor:", data);
            alert("Archivos enviados correctamente.");
        } catch (error: any) {
            alert("Error al enviar los archivos: " + error.message);
            console.error("Error al enviar los archivos:", error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
            {/* Drag-and-Drop Area */}
            <div
                {...getRootProps()}
                style={{
                    border: "2px dashed #cccccc",
                    padding: "5px",
                    textAlign: "center",
                    cursor: "pointer",
                    background: isDragActive ? "#f0f8ff" : "white",
                    width: "100%",
                    height: "100%",
                    marginBottom: "1px",

                }}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p>Drop files...</p>
                ) : (
                    <p>Drag and drop your PDF files.</p>
                )}
            </div>

            {/* List of Uploaded Files */}
            <div style={{ width: "100%" }}>

                <ul>
                    {pdfFilenames.map((pdfFilename, index) => (
                        <li key={index}>{pdfFilename}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};
export default DragAndDrop;
