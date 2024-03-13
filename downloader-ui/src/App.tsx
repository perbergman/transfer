import React from 'react';
import './App.css';

const App = () => {
  // This function is called when the user clicks the download button.
  const handleDownload = async () => {

    const container = 'uploads';
    const blob = encodeURIComponent('/opt/supplier/pig.yml');
    const mime = 'application/octet-stream';
    const url = `http://localhost:7071/api/Downloader/${container}/${blob}`;

    // Making a GET request to the Azure Function URL.
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': mime,
      },
    });

    // Checking if the response status is OK (status code 200-299).
    if (response.ok) {
      // Creating a new blob object from the response data.
      const blob = await response.blob();
      console.log(blob);
      // Generating a URL for the blob object.
      const url = window.URL.createObjectURL(blob);

      // Creating an anchor (<a>) element programmatically.
      const a = document.createElement('a');
      a.href = url; // Setting the href of the anchor to the blob URL.
      a.download = 'auto_dalle.png'; // Suggesting a filename for the downloaded file.

      // Appending the anchor to the document body.
      document.body.appendChild(a);

      // Programmatically triggering a click event on the anchor.
      // This will cause the file to be downloaded.
      a.click();

      // Removing the anchor from the document body.
      a.remove();

      // Releasing the blob URL to free up resources.
      window.URL.revokeObjectURL(url);
    } else {
      // Logging an error message if the response status is not OK.
      console.error('Failed to download file');
    }
  };

  // Rendering a button that, when clicked, will call the handleDownload function.
  return (
    <button onClick={handleDownload}>Download File</button>
  );
};

export default App;
