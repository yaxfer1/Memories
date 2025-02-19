import React, { useState } from "react";
import { useStore } from "../hooks/useStore";
const URL_SCRAPING = 'http://127.0.0.1:5000/api/scrap_url';


const TextUploader = () => {
    const {submittedUrls, setSubmittedUrls, selectedMemoryId} = useStore();
    const [text, setText] = useState("");
    const [uploading, setUploading] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendTextToBackend(text);
    };

    const sendTextToBackend = async (text: string) => {
        if (!text.trim()) {
            alert("Please enter a valid URL");
            return;
        }
        if (selectedMemoryId==0n) {
            alert("Please select a memory");
            return;
        }

        try {
            setUploading(true);
            const res = await fetch(URL_SCRAPING, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({url: 	text, memory_id: selectedMemoryId}),
            });

            if (!res.ok) {
                throw new Error(`Error sending text. Code: ${res.status}`);
            }

            const data = await res.json();
            console.log("Server response:", data);
            setSubmittedUrls([...submittedUrls, text]);
            setText("");
        } catch (error) {
            console.error("Error sending text:", error.message);
            alert("There was an error sending the URL.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit} style={{ 
                position: 'relative',
                display: 'flex',
                gap: '5px'
            }}>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter URL here"
                    rows={1}
                    style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        resize: "none",
                    }}
                />
                <button
                    type="submit"
                    style={{
                        width: '40px',
                        backgroundColor: "#0d0d0d",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    disabled={uploading}
                >
                    {uploading ? "..." : "→"}
                </button>
            </form>

            <div style={{ marginTop: "20px" }}>
                <ul>
                    {submittedUrls.map((url, index) => (
                        <li key={index} style={{ wordWrap: "break-word" }}>
                            {url}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TextUploader;
