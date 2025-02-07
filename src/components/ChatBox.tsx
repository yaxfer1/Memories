import React from "react";
import {
    Container,
    InputGroup,
    FormControl,
    Button,
} from "react-bootstrap";
import "./styles.css";
import {useStore} from "../hooks/useStore.tsx"
import {postChat} from "../services/postChat.js"
export const ChatBox = () => {
    //const {chatId} = useParams<{ chatId: string }>();
    const{
        newMessage,
        messages,
        setNewMessage,
        aimessages,
        setMessages,
        setAIMessage,
        setLoad,
        loading,
        jwt,
    }=useStore()

    const handleSendMessage = async () => {
        if (newMessage.trim() !== "") {

            setLoad(true)
            const mensaje = newMessage
            setNewMessage("")
            setMessages([...messages, mensaje])
            const chatr = await postChat(jwt, currentChatId,mensaje);
            setAIMessage([...aimessages, chatr])

            setLoad(false)

        }
    };

    const{
        currentChatId
    }=useStore();
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(event.target.value);
    };

    const combinedMessages = messages.map((message, index) => ({ text: message, sender: "user", index }))
        .concat(aimessages.map((message, index) => ({ text: message, sender: "AI", index })))
        .sort((a, b) => a.index - b.index);

    return (
        <Container fluid>
            <div className="messages-container">
                {combinedMessages.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${
                            message.sender === "user" ? "user-message" : "ai-message"
                        }`}
                    >
            <span className="message-sender">
              {message.sender === "user" ? "User:" : "AI:"}
            </span>
                        <span className="message-text">{message.text}</span>
                    </div>
                ))}
            </div>

            <InputGroup className="message-input-group">
                <FormControl
                    placeholder="Write your message here..."
                    value={newMessage}
                    onChange={handleTextChange}
                    disabled={loading}
                />
                <Button
                    variant="primary"
                    onClick={handleSendMessage}
                    disabled={loading}
                    className="send-button"
                >
                    {loading ? <div className="loader" /> : "Send"}
                </Button>
            </InputGroup>
        </Container>
    );

};

export default ChatBox;

/* styles.css */
