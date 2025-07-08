import React, { useState } from "react";
import { jsPDF } from "jspdf";

const JPGtoPDF = () => {
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
        const pdf = new jsPDF();

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        let imgWidth = img.width;
        let imgHeight = img.height;

        if (imgWidth > pageWidth || imgHeight > pageHeight) {
          const scaleFactor = Math.min(
            pageWidth / imgWidth,
            pageHeight / imgHeight
          );
          imgWidth *= scaleFactor;
          imgHeight *= scaleFactor;
        }

        pdf.addImage(
          e.target.result,
          "JPEG",
          (pageWidth - imgWidth) / 2,
          (pageHeight - imgHeight) / 2,
          imgWidth,
          imgHeight
        );

        const pdfUrl = pdf.output("bloburl");
        setConvertedFileUrl(pdfUrl);
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
    <div className="border border-warning p-2 text-center my-4 mx-2">
      <h4>JPG to PDF Converter</h4>
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
            Convert to PDF
          </button>

          <br />
          <br />
          <p>{conversionStatus}</p>

          {convertedFileUrl && (
            <div>
              <a
                className="btn btn-success d-block"
                href={convertedFileUrl}
                download="converted-image.pdf"
              >
                download
              </a>
              <iframe
                src={convertedFileUrl}
                style={{
                  width: "100%",
                  height: "500px",
                  border: "none",
                  marginTop: "20px",
                }}
                title="Converted PDF"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JPGtoPDF;
