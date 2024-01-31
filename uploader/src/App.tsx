import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';

function App() {
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    };

    const handleUpload = async () => {
        const formData = new FormData();
        if (file) {
        formData.append("userpic1", "chris2.jpg");  
        formData.append('file', file, file.name);
        formData.append("userpic2", "chris2.jpg");
        }

        try {
            const response = await axios.post('http://localhost:7071/api/HttpTrigger1', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('File uploaded successfully', response.data);
        } catch (error) {
            console.error('Error uploading file', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default App;

