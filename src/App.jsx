import React from "react";
import PNGtoJpg from "./Converts/PNGtoJpg";
import JPGtoPNG from "./Converts/JPGtoPNG";
import JPGtoPDF from "./Converts/JPGtoPDF";
import PNGtoPDF from "./Converts/PNGtoPDF";
import MP3toMP4 from "./Converts/MP3toMP4";
import MP3toAAC from "./Converts/MP3toACC";
import MP3toWAV from "./Converts/MP3toWAV";
import AACtoMP3 from "./Converts/AACtoMP3";
import AACtoWAV from "./Converts/AACtoWAV";
import WAVtoMP3 from "./Converts/WAVtoMP3";
import WAVtoAAC from "./Converts/WAVtoAAC";
import AACtoMP4 from "./Converts/AACtoMP4";
import WAVtoMP4 from "./Converts/WAVtoMP4";
import MP3toMKV from "./Converts/MP3toMKV";
import MP3toAVI from "./Converts/MP3toAVI";
import MP3toFLAC from "./Converts/MP3toFLAC";
import MP3toOGG from "./Converts/MP3toOGG";
import MP3toWMA from "./Converts/MP3toWMA";
import MP3toM4A from "./Converts/MP3toM4A";
import MP3toAIFF from "./Converts/MP3toAIFF";
import MP3toWebM from "./Converts/MP3toWEBM";
import ZipFile from "./Converts/ZipFile";

const App = () => {
  return (
    <div className="d-flex gap-2 justify-content-center flex-wrap">
      <PNGtoJpg />
      <JPGtoPNG />
      <JPGtoPDF />
      <PNGtoPDF />
      <ZipFile />
      <MP3toMP4 />
      <MP3toMKV />
      <MP3toAVI />
      <MP3toAAC />
      <MP3toWAV />
      <MP3toFLAC />
      <MP3toOGG />
      <MP3toWMA />
      <MP3toM4A />
      <MP3toAIFF />
      <MP3toWebM />
      <AACtoMP3 />
      <AACtoWAV />
      <AACtoMP4 />
      <WAVtoMP3 />
      <WAVtoAAC />
      <WAVtoMP4 />
    </div>
  );
};

export default App;
