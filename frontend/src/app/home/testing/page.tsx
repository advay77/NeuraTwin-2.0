"use client";
import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
const page = () => {
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition(
    {}
  );

  const startListen = () => {
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  return (
    <div>
      <h1 className="text-center py-10 text-gray-500">SPEECK TO TEXT</h1>
      <div className="w-full h-[200px] border bprder-indigo-500 text-white">
        {transcript}
      </div>
      <button onClick={startListen} className="text-red-500 cursor-pointer">
        Start
      </button>
      <button
        onClick={SpeechRecognition.stopListening}
        className="text-red-500"
      >
        STOP
      </button>
    </div>
  );
};

export default page;
