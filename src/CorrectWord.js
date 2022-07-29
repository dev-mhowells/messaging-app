import React from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import recordImg from "./images/record.png";
import stopImg from "./images/stop.png";

import sampleSound from "./media/birds.mp3";
import { useReactMediaRecorder } from "react-media-recorder";

export default function (props) {
  const [examples, setExamples] = React.useState("");
  const [synonyms, setSynonyms] = React.useState("");
  const [extra, setExtra] = React.useState("");

  const [audioUrl, setAudioUrl] = React.useState("");

  const [currentWordObj, setCurrentWordObj] = React.useState({});
  const [passAudioBlobUrl, setPassAudioBlobUrl] = React.useState(false);

  // ----------------------- -----------------------

  // THIS COMPONENTS NEEDS LOOKING AT AFTER CHANGING DYNAMIC ROUTING FOR IT

  // regerence to the current message
  const docRef = doc(db, "messages", props.selectedWord.messageId);

  // finds the current word object associated with word of this tab in FB array of words for this message
  // updates textareaa feilds automatically if already corrected
  // updates on change of selected tab
  React.useEffect(() => {
    // determines whether to pass mediaBlobUrl from reactMediaRecorder, if false don't pass
    // prevents audioBlobUrl and AudioUrl from persisting between tab changes, this resets
    setPassAudioBlobUrl(false);
    // resets input fields
    setAudioUrl("");
    setSynonyms("");
    setExamples("");
    setExtra("");

    async function getCurrentWordObj() {
      const docSnap = await getDoc(docRef);
      // reference to words array of message
      if (docSnap.exists()) {
        const correctedWordObjs = docSnap.data().words;
        // for each wordObj in array, if the current word matches wordObj.word
        for (let wordObj of correctedWordObjs) {
          if (wordObj.word === props.selectedTab) {
            setCurrentWordObj(wordObj);
            setSynonyms(wordObj.synonyms);
            setExamples(wordObj.examples);
            setExtra(wordObj.extra);

            // audio
            if (wordObj.forAudioRef) {
              getDownloadURL(ref(storage, `${wordObj.forAudioRef}`)).then(
                (url) => {
                  setAudioUrl(url);
                }
              );
            }
          }
        }
      }
    }
    getCurrentWordObj();
  }, [props.selectedTab]);

  // returns current array of word objects in FB for the message
  async function getWordArray() {
    let correctedWordObjs;
    // const docRef = doc(db, "messages", props.selectedWord.messageId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      correctedWordObjs = docSnap.data().words;
    }
    return correctedWordObjs;
  }

  // creates new array removing any duplicate objects
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
    return uniqueArr;
  }

  async function updateWordObjArr() {
    // get corrected words array from FB
    const correctedWordObjs = await getWordArray();

    // add current wordExplained object
    correctedWordObjs.push(wordExplained);
    // check if each wordObj.word matches wordExplained.word
    // if it does, replace wordObj with wordExplained
    // if it doesn't, just return the wordObj
    // this does't eliminate duplicates though
    const updatedArr = correctedWordObjs.map((wordObj) => {
      if (wordObj.word === wordExplained.word) {
        return wordExplained;
      } else {
        return wordObj;
      }
    });

    // eliminate duplicates
    const newArr = removeDupes(updatedArr);
    // upload new array, replacing the old one
    setDoc(docRef, { words: newArr }, { merge: true });
  }

  // for onchange for definition feild, captures input and sets to definition state
  function handleExamples(e) {
    setExamples(e.target.value);
  }

  function handleSynonyms(e) {
    setSynonyms(e.target.value);
  }

  function handleExtra(e) {
    setExtra(e.target.value);
  }

  function clearInputs() {
    setExamples("");
    setSynonyms("");
    setExtra("");
  }

  // MEDIA REACT ----------------------------------------------------------------------------------

  // uploads blob to firebase
  function uploadAudio(blob) {
    const metadata = {
      //   contentType: "audio/wav",
    };
    uploadBytes(audioRef, blob, metadata).then((snapshot) => {});
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
      setAudioUrl("");
    },
    onStop: (blobUrl, blob) => {
      // console.log("onstop happened", console.log(mediaBlobUrl));
      // setAudioUrl(mediaBlobUrl);
      // once audio is recorded in a tab, it is immediately set to the audio inside the in-tab audioplayer
      // this is a control which allows it to be passed, and is turned off on tab change to prevent
      // thi saudio from persisting between tabs.
      setPassAudioBlobUrl(true);
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
      <div className="flex gap-4 justify-center items-center">
        <img
          className="hover:cursor-pointer"
          onClick={status === "recording" ? stopRecording : startRecording}
          src={status !== "recording" ? recordImg : stopImg}
        ></img>
        {/* <audio src={audioUrl ? audioUrl : mediaBlobUrl} controls /> */}
        <audio
          src={mediaBlobUrl && passAudioBlobUrl ? mediaBlobUrl : audioUrl}
          controls
        />
      </div>
    );
  }

  // ---------------------------------------------- CORE -----------------------------------------------------------

  //   object sent to firebase.. might not need messageId
  // BLOB URL ARE JUST ATTEMPTS TO COMMUNICATE TO MESSAGE.JS THAT THERE IS AUDIO -- NOT CURRENTLY IN USE
  const wordExplained = {
    messageId: props.selectedWord.messageId,
    word: props.selectedWord.word,
    synonyms,
    examples,
    extra,
    forAudioRef: `${props.selectedWord.messageId}/${props.selectedWord.word}`,
  };

  // sets tracker to a random number, useEffect in correctionDropdown set to run when
  // this value changes, then calls for audio - seems like a strange solution..
  function updateTracker() {
    props.setCorrectionTracker(Math.random() * 100);
  }

  return (
    <section className=" w-2/5 flex flex-col gap-4 border-t-2 border-sky-700 text-xs">
      <p className="mt-4">Synonyms</p>
      <textarea
        className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
        onChange={handleSynonyms}
        value={synonyms}
      ></textarea>
      <p>Examples</p>
      <textarea
        className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
        onChange={handleExamples}
        value={examples}
      ></textarea>
      <p>Pronunciation</p>
      <div className="h-full w-300 p-2 flex justify-center items-center">
        {record()}
      </div>
      <p>Extra information</p>
      <textarea
        className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
        onChange={handleExtra}
        value={extra}
      ></textarea>

      <button
        className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4 border-none rounded-md w-1/3 self-end mb-4"
        onClick={() => {
          updateTracker();
          updateWordObjArr();
          // controls tab redirects
          // props.removeTab(props.selectedWord.word);
          props.removeSelectedWordFB(props.selectedWord);
          props.tabReset(props.selectedWord.word);
          clearInputs();
        }}
      >
        send
      </button>
    </section>
  );
}
