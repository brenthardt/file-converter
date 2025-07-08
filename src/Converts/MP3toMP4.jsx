import React, { useState, useRef } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";

function MP3toMP4() {
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
      setConversionStatus("Please select an MP3 file to convert.");
      return;
    }

    try {
      setConversionStatus("Converting to MP4...");

      const ffmpeg = ffmpegRef.current;

      const mp3File = await fetchFile(URL.createObjectURL(selectedFile));
      await ffmpeg.writeFile("input.mp3", mp3File);
      console.log("MP3 file written to FFmpeg.");

      await ffmpeg.exec(["-i", "input.mp3"]);

      const logs = await ffmpeg.readFile("input.mp3");
      const logsStr = new TextDecoder().decode(logs);
      const match = logsStr.match(/Duration: (\d+:\d+:\d+\.\d+)/);
      const duration = match ? match[1] : "00:00:00.00";
      console.log(`Audio duration: ${duration}`);

      const [hours, minutes, seconds] = duration.split(":");
      const totalSeconds =
        parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseFloat(seconds);

      console.log(`Total duration in seconds: ${totalSeconds}`);

      await ffmpeg.exec([
        "-f",
        "lavfi",
        "-t",
        `${totalSeconds}`,
        "-i",
        "color=c=black:s=1280x720:r=30",
        "-i",
        "input.mp3",
        "-c:v",
        "libx264",
        "-c:a",
        "aac",
        "-shortest",
        "-y",
        "output.mp4",
      ]);

      const fileData = await ffmpeg.readFile("output.mp4");
      const data = new Uint8Array(fileData);

      if (data.length === 0) {
        throw new Error("Conversion failed, output file is empty.");
      }

      setConvertedFileUrl(
        URL.createObjectURL(new Blob([data.buffer], { type: "video/mp4" }))
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
      <h4>MP3 to MP4 Converter</h4>

      <div>
        <button className="btn btn-success my-1" onClick={loadFFmpeg}>
          Load FFmpeg
        </button>
      </div>

      <div>
        <input
          type="file"
          accept="audio/mp3"
          onChange={handleFileChange}
          className="form-control"
        />
        <br />
        <button
          onClick={convertToMP4}
          disabled={!selectedFile}
          className="btn btn-success my-1"
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
                href={convertedFileUrl}
                download="output.mp4"
                className="btn btn-success d-block"
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

export default MP3toMP4;
