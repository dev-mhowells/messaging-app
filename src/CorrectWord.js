import React from "react";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import sampleSound from "./media/birds.mp3";
import { useReactMediaRecorder } from "react-media-recorder";

export default function (props) {
  const [definition, setDefinition] = React.useState("");

  async function addExplainedWord() {
    const ref = doc(db, "messages", props.selectedWord.messageId);
    await updateDoc(ref, {
      words: arrayUnion(wordExplained),
    });
  }

  //   object sent to firebase.. might not need messageId
  const wordExplained = {
    messageId: props.selectedWord.messageId,
    word: props.selectedWord.word,
    definition,
  };

  // for onchange for definition feild, captures input and sets to definition state
  function handleDefinition(e) {
    setDefinition(e.target.value);
  }

  // MEDIA REACT ----------------------------------------------------------------------------------

  // const [blobber, setBlobber] = React.useState();
  const [audioBlob, setAudioBlob] = React.useState();

  // uploads blob to firebase
  function uploadAudio(blob) {
    const metadata = {
      //   contentType: "audio/wav",
    };
    uploadBytes(audioRef, blob, metadata).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  }

  const { status, startRecording, stopRecording, mediaBlobUrl, onStop } =
    useReactMediaRecorder({
      audio: true,
      type: "audio/wav",
      onStop: (blobUrl, blob) => {
        console.log("onstop happened");
        // setBlobber(URL.createObjectURL(blob));
        uploadAudio(blob);
      },
    });

  // FIREBASE ---------------------------------------------------------------------------------------

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();

  // Create a storage reference from our storage service
  const storageRef = ref(storage);

  // Create a child reference as messageId
  const audioRef = ref(storage, `${props.selectedWord.messageId}`);

  // download - sets blobberUrl to blob dowloaded from firebase
  getDownloadURL(audioRef)
    .then((url) => {
      setAudioBlob(url);
    })
    .catch((error) => {
      switch (error.code) {
        case "storage/object-not-found":
          // File doesn't exist
          break;
        case "storage/unauthorized":
          // User doesn't have permission to access the object
          break;
        case "storage/canceled":
          // User canceled the upload
          break;
        case "storage/unknown":
          // Unknown error occurred, inspect the server response
          break;
      }
    });

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
        <audio src={audioBlob} controls autoPlay loop />
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
        {/* <audio src={audioBlob} controls autoPlay loop /> */}
      </div>
      <button
        className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4 border-none rounded-md w-1/3 self-end mb-4"
        onClick={() => {
          addExplainedWord();
        }}
      >
        send
      </button>
    </section>
  );
}
