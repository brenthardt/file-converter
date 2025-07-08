import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

function AACtoMP4() {
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

      ffmpeg.on("log", ({ message }) => {
        if (messageRef.current) messageRef.current.innerHTML = message;
      });

      ffmpeg.on("progress", (ratio) => {
        if (messageRef.current) {
          messageRef.current.innerHTML = `Progress: ${Math.round(
            ratio * 100
          )}%`;
        }
      });

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

  const convertToMP4 = async () => {
    if (!selectedFile) {
      setConversionStatus("Please select an AAC file to convert.");
      return;
    }

    try {
      setConversionStatus("Converting to MP4...");

      const ffmpeg = ffmpegRef.current;

      // Write the input AAC file
      await ffmpeg.writeFile(
        "input.aac",
        await fetchFile(URL.createObjectURL(selectedFile))
      );

      // Generate a 10-hour dark background video
      await ffmpeg.exec([
        "-f",
        "lavfi",
        "-i",
        "color=c=black:s=1280x720:d=36000", // Dark background, 10 hours duration
        "-i",
        "input.aac",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-shortest",
        "output.mp4",
      ]);

      // Read the output MP4 file
      const fileData = await ffmpeg.readFile("output.mp4");
      const data = new Uint8Array(fileData);

      // Set the output URL
      setConvertedFileUrl(
        URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
      );
      setConversionStatus("Conversion successful!");
    } catch (error) {
      console.error("Conversion failed:", error);
      setConversionStatus("Conversion failed. Please try again.");
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
      <h4>AAC to MP4 Converter</h4>

      <div>
        <button className="btn btn-success my-1" onClick={loadFFmpeg}>
          Load FFmpeg
        </button>
      </div>

      <div>
        <input
          className="form-control"
          type="file"
          accept="audio/aac"
          onChange={handleFileChange}
        />
        <br />
        <button
          className="btn btn-success my-1"
          onClick={convertToMP4}
          disabled={!selectedFile}
        >
          Convert to MP4
        </button>
      </div>

      <div>
        <p>{conversionStatus}</p>

        {convertedFileUrl && (
          <div>
            <p>
              Download your converted file:{" "}
              <a
                className="btn btn-success d-block"
                href={convertedFileUrl}
                download="output.mp4"
              >
               download
              </a>
            </p>
            <video
              src={convertedFileUrl}
              controls
              style={{ width: "300px", marginTop: "20px" }}
            />
          </div>
        )}
      </div>

      <p ref={messageRef}></p>
    </div>
  );
}

export default AACtoMP4;
