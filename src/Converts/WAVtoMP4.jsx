import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

function WAVtoMP4() {
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
      setConversionStatus("Please select a WAV file to convert.");
      return;
    }

    try {
      setConversionStatus("Converting to MP4...");

      const ffmpeg = ffmpegRef.current;

     
      await ffmpeg.writeFile(
        "input.wav",
        await fetchFile(URL.createObjectURL(selectedFile))
      );

      
      const videoFilter = "color=c=black:s=1280x720:r=30";

    
      await ffmpeg.exec([
        "-f",
        "lavfi",
        "-i",
        videoFilter, 
        "-i",
        "input.wav",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-shortest",
        "output.mp4",
      ]);

     
      const fileData = await ffmpeg.readFile("output.mp4");
      const data = new Uint8Array(fileData);

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
      <h4>WAV to MP4 Converter</h4>

      <div>
        <button className="btn btn-success my-1" onClick={loadFFmpeg}>
          Load FFmpeg
        </button>
      </div>

      <div>
        <input
          className="form-control"
          type="file"
          accept="audio/wav"
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
              style={{ width: "640px", marginTop: "20px" }}
            />
          </div>
        )}
      </div>

      <p ref={messageRef}></p>
    </div>
  );
}

export default WAVtoMP4;
