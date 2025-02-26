import React from 'react';
import {Form} from 'react-bootstrap';
import {SectionType} from '../types.d';

interface TextBoxProps {
    type: SectionType;
    value: string;
    loading?: boolean;
    onChange: (value: string) => void;
    showAdditionalContent: boolean;
    children?: React.ReactNode; // Acepta elementos hijos
}

const commonStyles = {
    border: "2px solid #0d0d0d",
    height: '200px',
    fontSize: '1.2em',
    resize: 'none',
    backgroundColor: 'white',
    boxShadow: "none",
};

const getInitialValue = ({ type, loading }: { type: SectionType; loading?: boolean }) => {
    if (type === SectionType.Box1) return 'What do you want to generate a technical report about?';
    if (type === SectionType.Box2) return '';
    if (loading === true) return 'Cargando...';
    return 'Any additional information or parameters?';
};

export const TextBox = ({ type, value, loading, onChange, showAdditionalContent, children }: TextBoxProps) => {
    const styles =
        type === SectionType.Box1
            ? commonStyles
            : {
                ...commonStyles,
                opacity: showAdditionalContent ? 1 : 0,
                transition: 'opacity 0.5s ease-in-out'
            };
    const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(event.target.value);
    };

    // @ts-ignore
    return (
        <div>
            <Form.Control
                autoFocus={type === SectionType.Box1}
                as={'textarea'}
                cols={1000}
                placeholder={getInitialValue({ type, loading })}
                value={value}
                // @ts-ignore
                style={styles}
                onChange={handleTextChange}
            />
            {/* Renderiza los elementos hijos */}
            {(type === SectionType.Box1 ||  type === SectionType.Box3) && (
                <div style={{position: 'relative', bottom: 50, right: -340}}>{children}</div>)}
        </div>
    );
};

export default TextBox;
