import React, { useState } from "react";
import JSZip from "jszip"; 

const ZipFile = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [conversionStatus, setConversionStatus] = useState("");
  const [zipFileUrl, setZipFileUrl] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
    setConversionStatus("");
    setZipFileUrl(null);
  };

  const handleZipCreation = async () => {
    if (selectedFiles.length === 0) {
      setConversionStatus("Please select files to zip.");
      return;
    }

    setConversionStatus("Creating ZIP file...");

    try {
      const zip = new JSZip();
      const filePromises = [];

     
      for (const file of selectedFiles) {
        filePromises.push(
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
          
              zip.file(file.name, reader.result, { compression: "DEFLATE" });
              resolve();
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          })
        );
      }

     
      await Promise.all(filePromises);

    
      const zipBlob = await zip.generateAsync({ type: "blob" });
      setZipFileUrl(URL.createObjectURL(zipBlob));
      setConversionStatus("ZIP file created successfully!");
    } catch (error) {
      console.error("Error creating ZIP file:", error);
      setConversionStatus(`Error creating ZIP file: ${error.message}`);
    }
  };

  return (
    <div className="border border-warning p-2 text-center my-4 mx-2">
      <h4>Create a ZIP File</h4>
      <div>
        <input
          type="file"
          onChange={handleFileChange}
          className="form-control"
          multiple
        />
        <br />
        <button
          onClick={handleZipCreation}
          disabled={selectedFiles.length === 0}
          className="btn btn-success my-1"
        >
          Create ZIP File
        </button>
        <br />
        <br />
        <p>{conversionStatus}</p>

        {zipFileUrl && (
          <div>
            <a
              href={zipFileUrl}
              download="files.zip"
              className="btn btn-success d-block"
            >
              Download ZIP
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZipFile;
