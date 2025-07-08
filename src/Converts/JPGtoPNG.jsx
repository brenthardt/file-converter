import React, { useState } from "react";

const JPGtoPNG = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionStatus, setConversionStatus] = useState("");
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setConversionStatus("");
    setConvertedFileUrl(null);
  };

  const handleFileConversion = () => {
    if (!selectedFile) {
      setConversionStatus("Please select a file to convert.");
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set canvas dimensions to the image dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image onto the canvas
        ctx.drawImage(img, 0, 0);

        // Convert canvas content to PNG data URL
        const pngDataUrl = canvas.toDataURL("image/png");

        setConvertedFileUrl(pngDataUrl);
        setConversionStatus("Conversion successful!");
      };

      img.onerror = () => {
        setConversionStatus("Failed to load the image. Please try again.");
      };

      img.src = e.target.result;
    };

    fileReader.onerror = () => {
      setConversionStatus("Failed to read the file. Please try again.");
    };

    fileReader.readAsDataURL(selectedFile);
    setConversionStatus("Converting...");
  };

  return (
    <div className="border border-warning p-2 text-center my-4">
      <h4>JPG to PNG Converter</h4>
      <div>
        <div>
          <input
            type="file"
            accept="image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="form-control"
          />

          <button
            onClick={handleFileConversion}
            disabled={!selectedFile}
            className="btn btn-success my-1"
          >
            Convert to PNG
          </button>

          <br />
          <br />
          <p>{conversionStatus}</p>

          {convertedFileUrl && (
            <div>
              <a
                className="btn btn-success d-block"
                href={convertedFileUrl}
                download="converted-image.png"
              >
                download
              </a>
              <img
                src={convertedFileUrl}
                alt="Converted Image"
                style={{ width: "300px", marginTop: "20px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JPGtoPNG;
