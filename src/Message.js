import React from "react";
import { auth } from "./firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";

import sampleSound from "./media/birds.mp3";
import CorrectionDropdown from "./CorrectionDropdown";

export default function Message(props) {
  const [isSelected, setIsSelected] = React.useState(false);

  function toggler() {
    setIsSelected((prevIsSelected) => !prevIsSelected);
  }

  // not sure if I should be directly changing the properties of the message obj
  // like this as it is in state.... working for now
  // also.. why use this and not just isSeleceted state directly? come back later
  props.message.selected = isSelected;

  function splitMessage(message) {
    splitMessage = message.split(" ");
    return splitMessage;
  }

  const splitIntoWords = splitMessage(props.message.message);

  const selectedWordsRef = doc(db, "selectedWords", "wordsArr");

  // updates above firebase document with selected words which will be displayed as tabs to teacher
  async function updateSelectedWordsFB(word) {
    await updateDoc(selectedWordsRef, { words: arrayUnion(word) });
  }

  const eachWord = splitIntoWords.map((word) => (
    <button
      className="bg-sky-50 py-1 px-2 ml-2 rounded-md text-sm mr-2 mt-2 mb-2 hover:bg-sky-300"
      onClick={() => {
        // props.getSelectedWords(word, props.message.id);
        updateSelectedWordsFB({ word, messageId: props.message.id });
      }}
    >
      {word}
    </button>
  ));

  // ---------------------------------- FIREBASE AUDIO ---------------------------------------------

  const [wordBlob, setWordBlob] = React.useState();
  const [wordBlobs, setWordBlobs] = React.useState([]);

  // console.log("WORDBLOB", wordBlob);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();

  // Create a storage reference from our storage service
  const storageRef = ref(storage);

  // Create a child reference as messageId
  // loop through words in message, if match in audioRef, display audio, if no, don't =-- THIS NEXT
  const audioRef = ref(storage, `${props.message.id}/too`);
  const audioRef1 = ref(storage, `${props.message.id}/hello`);

  const audioRefs = [audioRef, audioRef1];

  // ------------------ AUDIO STUFF - COME BACK LATER ---------------------------------------------------------------

  // THIS WORKS FOR GETTING ONE SPECIFIC BIT OF AUDIO --- HOW TO SCALE ???

  const [oneRef, setOneRef] = React.useState("");

  function oneMoreTry() {
    if (props.message.id === "kZmRnRq8lwEQg9mRxABP") {
      getDownloadURL(ref(storage, `${props.message.id}/d`)).then((url) => {
        setOneRef(url);
      });
      return <audio src={oneRef} controls loop />;
    }
  }

  // ABOVE WORKS ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  function getAllUrls() {
    for (let wordObj of props.message.words) {
      if (wordObj.forAudioRef) {
        getDownloadURL(ref(storage, `${wordObj.forAudioRef}`)).then((url) => {
          console.log("URL", url);
        });
      }
    }
  }

  function getAllUrls2() {
    let allUrls = [];
    for (let wordObj of props.message.words) {
      if (wordObj.forAudioRef) {
        getDownloadURL(ref(storage, `${wordObj.forAudioRef}`)).then((url) => {
          allUrls.push(url);
        });
      }
    }
    return allUrls;
  }
  // returns empty array b/c async?

  const [allUrls, setAllUrls] = React.useState([]);

  function getAllUrls3() {
    for (let wordObj of props.message.words) {
      if (wordObj.forAudioRef) {
        getDownloadURL(ref(storage, `${wordObj.forAudioRef}`)).then((url) => {
          setAllUrls((prevArr) => [...prevArr, url]);
        });
      }
    }
  }

  // produces infinite loop when called

  // --------------------------------------------------------------------------------------------------

  return (
    <div
      className={`flex flex-col bg-sky-100 max-w-[80%] rounded-md hover:cursor-pointer ${
        props.message.uid !== auth.currentUser.uid ? "self-end" : "self-start"
      }`}
    >
      <div
        className={`flex justify-between w-full ${
          !props.message.selected ? "bg-sky-400" : "bg-sky-900"
        }  rounded-md hover:cursor-pointer ${
          props.message.uid !== auth.currentUser.uid ? "self-end" : "self-start"
        }`}
        onClick={() => {
          toggler(isSelected);
          props.getMessageToEdit(props.message);
          // getBlobs();
        }}
      >
        {!props.message.selected ? (
          <p className="p-2">{props.message.message}</p>
        ) : (
          <div className="">{eachWord}</div>
        )}
      </div>
      {props.message.correction && (
        <p className="p-2">{props.message.correction}</p>
      )}
      {props.message.words &&
        // props.message.words.map((wordObj) => (
        //   <div className="p-2 flex flex-col gap-1">
        //     <p>
        //       {`${wordObj.word}`} <button onClick={toggleDropDown}>drop</button>
        //     </p>
        //     {dropDown && (
        //       <div>
        //         <p> {`synonyms: ${wordObj.synonyms}`}</p>
        //         <p> {`examples: ${wordObj.examples}`}</p>
        //         <p> {`more: ${wordObj.extra}`}</p>
        //       </div>
        //     )}
        //   </div>
        // ))
        props.message.words.map((wordObj) => (
          <CorrectionDropdown
            wordObj={wordObj}
            message={props.message}
            correctionTracker={props.correctionTracker}
          />
        ))}

      {oneMoreTry()}
      {/* {getAllUrls2()} */}
    </div>
  );
}
