import React from "react";
import { arrayUnion, doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import sampleSound from "./media/birds.mp3";
import { useReactMediaRecorder } from "react-media-recorder";

export default function (props) {
  const [allCorrectedWordObj, setAllCorrectedWordObj] = React.useState([]);
  const [definition, setDefinition] = React.useState("");

  // this works but I still need to get the data from FB so..
  function checkIfWordCorrected() {
    for (let messageObj of props.messages) {
      if (messageObj.words) {
        for (let wordObj of messageObj.words) {
          console.log("WORD IN ARR", wordObj);
          if (wordExplained.word === wordObj.word) {
            console.log("DOUBLE FOUND");
            // REPLACE
          } else {
            console.log("NOT DOUBLE");
            // ADD
          }
        }
      }
    }
  }

  // React.useEffect(() => {
  //   async function getWordArray() {
  //     const docRef = doc(db, "messages", props.selectedWord.messageId);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       const correctedWordObjs = docSnap.data().words;
  //       console.log("corrected words", correctedWordObjs);
  //       setAllCorrectedWordObj(correctedWordObjs);
  //     }
  //   }

  //   getWordArray();
  // }, []);

  // ------------------------ WORKING IN THIS SECTION, NEARLY THERE, YOU CAN DO IT!!! -----------------------

  // console.log("STATE", allCorrectedWordObj);
  const docRef = doc(db, "messages", props.selectedWord.messageId);

  // returns current array of word objects in FB for the message
  async function getWordArray() {
    let correctedWordObjs;
    // const docRef = doc(db, "messages", props.selectedWord.messageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      correctedWordObjs = docSnap.data().words;
    }
    console.log("GET OBJYS", correctedWordObjs);
    return correctedWordObjs;
  }

  function removeDupes(arr) {
    const wordIds = [];

    const uniqueArr = arr.filter((el) => {
      const isDupe = wordIds.includes(el.word);

      if (!isDupe) {
        wordIds.push(el.word);
        return true;
      }
      return false;
    });
    console.log("UNIQUE", uniqueArr);
    return uniqueArr;
  }

  async function updateWordObjArr() {
    // get corrected words array from FB
    const correctedWordObjs = await getWordArray();
    console.log("GOTTEN OBJYS", correctedWordObjs);
    // add current wordExplained object
    correctedWordObjs.push(wordExplained);
    // check if each wordObj.word matches wordExplained.word
    // if it does, replace wordObj with wordExplained
    // if it doesn't, just return the wordObj
    // this does't eliminate duplicates though
    const updatedArr = correctedWordObjs.map((wordObj) => {
      console.log("EACH OBYS", wordObj);
      if (wordObj.word === wordExplained.word) {
        return wordExplained;
      } else {
        return wordObj;
      }
    });
    console.log("ARR TO UPLOAD", updatedArr);
    // return updatedArr;
    const newArr = removeDupes(updatedArr);
    setDoc(docRef, { words: newArr }, { merge: true });
  }

  // async function addExplainedWord() {
  //   // CHECK IF WORD EXISTS:

  //   // const ref = doc(db, "messages", props.selectedWord.messageId);
  //   await updateDoc(docRef, {
  //     words: arrayUnion(wordExplained),
  //   });
  // }

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
      uploadAudio(blob);
    },
  });

  // --------------------------------------AUDIO NOT RELEVANT YET -------------------------------------------------

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();

  // Create a storage reference from our storage service
  const storageRef = ref(storage);

  // Create a child reference as messageId
  const audioRef = ref(
    storage,
    `${props.selectedWord.messageId}/${props.selectedWord.word}`
  );

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

  // ---------------------------------------------- CORE -----------------------------------------------------------

  //   object sent to firebase.. might not need messageId
  // BLOB URL ARE JUST ATTEMPTS TO COMMUNICATE TO MESSAGE.JS THAT THERE IS AUDIO -- NOT CURRENTLY IN USE
  const wordExplained = {
    messageId: props.selectedWord.messageId,
    word: props.selectedWord.word,
    definition,
    blobUrl: mediaBlobUrl ? mediaBlobUrl : null,
    // audioRef: audioRef ? audioRef : null, // CAUSES ERROR
  };

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
          // addExplainedWord();
          // getWordArray();
          updateWordObjArr();
        }}
      >
        send
      </button>
    </section>
  );
}
