import React, { useState } from "react";

const PNGtoJpg = () => {
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

    const reader = new FileReader();

    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const jpgDataUrl = canvas.toDataURL("image/jpeg");
        setConvertedFileUrl(jpgDataUrl);
        setConversionStatus("Conversion successful!");
      };
      image.src = reader.result;
    };

    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="border border-warning p-2 text-center my-4 mx-2">
      <h4>PNG to JPG Converter</h4>
      <div>
        <div>
          <input
            type="file"
            onChange={handleFileChange}
            className="form-control"
          />

          <button
            onClick={handleFileConversion}
            disabled={!selectedFile}
            className="btn btn-success my-1"
          >
            Convert to JPG
          </button>

          <br />
          <br />
          <p>{conversionStatus}</p>

          {convertedFileUrl && (
            <div>
              <a
                href={convertedFileUrl}
                download="converted.jpg"
                className="btn btn-success d-block"
              >
                download
              </a>

              <img
                src={convertedFileUrl}
                alt="Converted JPG"
                style={{ width: "300px", marginTop: "20px" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PNGtoJpg;
