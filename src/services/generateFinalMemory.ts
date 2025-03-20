import { Report } from '../types';

export const generateFinalMemory = async (reports: Report[]): Promise<string> => {
    try {
        const response = await fetch('/api/generate-final-memory', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reports }),
        });

        if (!response.ok) {
            throw new Error('Failed to generate final memory');
        }

        const data = await response.json();
        return data.result;
    } catch (error) {
        console.error('Error generating final memory:', error);
        throw error;
    }
}; 