import React from "react";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import sampleSound from "./media/birds.mp3";
import { useReactMediaRecorder } from "react-media-recorder";

export default function (props) {
  const [definition, setDefinition] = React.useState("");
  const [isAudio, setIsAudio] = React.useState(false); // changes to true onStop of audio recorder

  async function addExplainedWord() {
    const ref = doc(db, "messages", props.selectedWord.messageId);
    await updateDoc(ref, {
      words: arrayUnion(wordExplained),
    });
  }

  // for onchange for definition feild, captures input and sets to definition state
  function handleDefinition(e) {
    setDefinition(e.target.value);
  }

  // MEDIA REACT ----------------------------------------------------------------------------------

  // uploads blob to firebase
  function uploadAudio(blob) {
    const metadata = {
      //   contentType: "audio/wav",
    };
    uploadBytes(audioRef, blob, metadata).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  }

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
    onStop,
    clearBlobUrl,
  } = useReactMediaRecorder({
    audio: true,
    type: "audio/wav",
    onStart: () => {
      // reset control display with no audio - only useful if using AudioBlob state in console display!
      // props.setAudioBlob("");
    },
    onStop: (blobUrl, blob) => {
      console.log("onstop happened");
      // getBlob();
      setIsAudio(true);
      uploadAudio(blob);
    },
  });

  // FIREBASE ---------------------------------------------------------------------------------------

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();

  // Create a storage reference from our storage service
  const storageRef = ref(storage);

  // Create a child reference as messageId
  const audioRef = ref(
    storage,
    `${props.selectedWord.messageId}/${props.selectedWord.word}`
  );

  function clearMediaBlob() {
    mediaBlobUrl = null;
  }

  //   object sent to firebase.. might not need messageId
  // IS AUDIO AND BLOB URL ARE JUST ATTEMPTS TO COMMUNICATE TO MESSAGE.JS THAT THERE IS A MESSAGE --
  // MAYBE BEST JUST TO CHECK MESSAGE WITH STORAGE ANYWAY
  const wordExplained = {
    messageId: props.selectedWord.messageId,
    word: props.selectedWord.word,
    definition,
    isAudio,
    blobUrl: mediaBlobUrl ? mediaBlobUrl : null,
  };

  // mediaBlobUrl set as source because if use state as source, there is a delay
  function record() {
    return (
      <div>
        <p>{status}</p>
        <button
          className="bg-sky-400 border rounded-md p-1 text-white mr-2"
          onClick={startRecording}
        >
          Start Recording
        </button>
        <button
          className="bg-sky-400 border rounded-md p-1 text-white mr-2"
          onClick={() => {
            stopRecording();
          }}
        >
          Stop Recording
        </button>
        <audio src={mediaBlobUrl} controls autoPlay loop />
      </div>
    );
  }

  return (
    <section className=" w-2/5 flex flex-col gap-4 border-t-2 border-sky-700 text-xs">
      <p className="mt-4">Type</p>
      <div className="h-20 w-300 p-3 rounded-md border-2 border-sky-700">
        <button className="bg-sky-400 border rounded-md p-1 text-white mr-2">
          noun
        </button>
        <button className="bg-sky-400 border rounded-md p-1 text-white mr-2">
          verb
        </button>
        <button className="bg-sky-400 border rounded-md p-1 text-white mr-2">
          adjective
        </button>
        <button className="bg-sky-400 border rounded-md p-1 text-white mr-2">
          adverb
        </button>
      </div>
      <p>Definition</p>
      <textarea
        className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
        onChange={handleDefinition}
      ></textarea>
      <p>Examples</p>
      <textarea className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"></textarea>
      <p>Pronunciation</p>
      <div className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none">
        {record()}
      </div>
      <button
        className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4 border-none rounded-md w-1/3 self-end mb-4"
        onClick={() => {
          addExplainedWord();
          clearMediaBlob();
        }}
      >
        send
      </button>
    </section>
  );
}
