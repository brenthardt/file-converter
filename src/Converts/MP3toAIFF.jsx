import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

function MP3toAIFF() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [conversionStatus, setConversionStatus] = useState("");
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  const ffmpegRef = useRef(new FFmpeg());
  const messageRef = useRef(null);

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

  const convertToAIFF = async () => {
    if (!selectedFile) {
      setConversionStatus("Please select an MP3 file to convert.");
      return;
    }

    try {
      setConversionStatus("Converting to AIFF...");
      const ffmpeg = ffmpegRef.current;

      const mp3File = await fetchFile(URL.createObjectURL(selectedFile));
      await ffmpeg.writeFile("input.mp3", mp3File);

      await ffmpeg.exec([
        "-i",
        "input.mp3",
        "-c:a",
        "pcm_s16be",
        "-y",
        "output.aiff",
      ]);

      const fileData = await ffmpeg.readFile("output.aiff");
      setConvertedFileUrl(
        URL.createObjectURL(new Blob([fileData.buffer], { type: "audio/aiff" }))
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
      <h4>MP3 to AIFF Converter</h4>
      <button className="btn btn-success my-1" onClick={loadFFmpeg}>
        Load FFmpeg
      </button>
      <input
        className="form-control"
        type="file"
        accept="audio/mp3"
        onChange={handleFileChange}
      />
      <button
        className="btn btn-success my-1"
        onClick={convertToAIFF}
        disabled={!selectedFile}
      >
        Convert to AIFF
      </button>
      <p>{conversionStatus}</p>
      {convertedFileUrl && (
        <div>
          <a
            className="btn btn-success d-block"
            href={convertedFileUrl}
            download="output.aiff"
          >
            Download
          </a>
          <audio src={convertedFileUrl} controls />
        </div>
      )}
    </div>
  );
}

export default MP3toAIFF;
