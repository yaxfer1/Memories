import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import DragAndDrop from "./DragAndDrop.jsx";
const AI_CHAT_FILES = 'http://127.0.0.1:5000/api/upload_files';



const DropFiles = () => {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);

    const onDrop = (acceptedFiles) => {
        const pdfFiles = acceptedFiles.filter((file) => file.type === "application/pdf");
        setFiles((prev) => [...prev, ...pdfFiles]);
    };

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop,
        accept: {"application/pdf": []},
        noClick: true, // Disable click on the main drop zone
    });

    const uploadFiles = async () => {
        if (files.length === 0) {
            alert("No files to send");
            return;
        }

        const formData = new FormData();
        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            setUploading(true);

            const res = await fetch(AI_CHAT_FILES, {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                throw new Error(`Error at sending files: Code: ${res.status}`);
            }

            const data = await res.json();
            console.log("Sercer response:", data);
            alert("Files sent correctly.");
        } catch (error) {
            console.error("Error at sending files:", error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            {/* Full page drop zone */}
            <div
                {...getRootProps()}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: isDragActive ? "rgba(128, 128, 128, 0.5)" : "transparent",
                    zIndex: isDragActive ? 999 : -1,
                    transition: "background-color 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <input {...getInputProps()} />
                {isDragActive && (
                    <div style={{
                        padding: "20px",
                        backgroundColor: "white",
                        borderRadius: "8px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}>
                        Drop your PDF files here
                    </div>
                )}
            </div>

            {/* Clickable area */}
            <div
                onClick={open}
                style={{
                    padding: "15px",
                    border: "2px dashed #ccc",
                    borderRadius: "4px",
                    cursor: "pointer",
                    textAlign: "center",
                    marginBottom: "20px"
                }}
            >
                Click to upload PDF files
            </div>
        </>
    );
};

export default DropFiles;