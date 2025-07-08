import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

function MP3toFLAC() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionStatus, setConversionStatus] = useState("");
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const ffmpegRef = useRef(new FFmpeg());

  const loadFFmpeg = async () => {
    try {
      setConversionStatus("Loading FFmpeg...");
      const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";
      const ffmpeg = ffmpegRef.current;

      await ffmpeg.load({
        coreURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.js`,
          "text/javascript"
        ),
        wasmURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.wasm`,
          "application/wasm"
        ),
        workerURL: await toBlobURL(
          `${baseURL}/ffmpeg-core.worker.js`,
          "text/javascript"
        ),
      });

      setConversionStatus("FFmpeg Loaded.");
    } catch (error) {
      console.error("Error loading FFmpeg:", error);
      setConversionStatus("Error loading FFmpeg.");
    }
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setConversionStatus("");
    setConvertedFileUrl(null);
  };

  const convertToFLAC = async () => {
    if (!selectedFile) {
      setConversionStatus("Please select an MP3 file to convert.");
      return;
    }

    try {
      setConversionStatus("Converting to FLAC...");
      const ffmpeg = ffmpegRef.current;

      
      const mp3File = await fetchFile(URL.createObjectURL(selectedFile));
      await ffmpeg.writeFile("input.mp3", mp3File);

     
      await ffmpeg.exec(["-i", "input.mp3", "output.flac"]);

      
      const fileData = await ffmpeg.readFile("output.flac");
      const data = new Uint8Array(fileData);

      if (data.length === 0) {
        throw new Error("Conversion failed, output file is empty.");
      }

      setConvertedFileUrl(
        URL.createObjectURL(new Blob([data.buffer], { type: "audio/flac" }))
      );
      setConversionStatus("Conversion successful!");
    } catch (error) {
      console.error("Conversion failed:", error);
      setConversionStatus(`Conversion failed: ${error.message}`);
    }
  };

  return (
    <div className="border border-warning p-2 text-center my-4 mx-2">
      <h6 className="border border-danger w-50 mx-auto p-1">
        <span className="text-danger">! INSTRUCTION</span>
        <br />
        1 upload a file <br />
        2 press load ffmpeg <br />3 press convert
      </h6>
      <h4>MP3 to FLAC Converter</h4>
      <button onClick={loadFFmpeg} className="btn btn-success my-1">
        Load FFmpeg
      </button>
      <input
        type="file"
        accept="audio/mp3"
        onChange={handleFileChange}
        className="form-control"
      />
      <button onClick={convertToFLAC} className="btn btn-success">
        Convert to FLAC
      </button>
      <p>{conversionStatus}</p>
      {convertedFileUrl && (
        <div>
          <a
            href={convertedFileUrl}
            download="output.flac"
            className="btn btn-success d-block"
          >
            Download FLAC
          </a>
          <audio controls src={convertedFileUrl} />
        </div>
      )}
    </div>
  );
}

export default MP3toFLAC;
