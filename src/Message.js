import React from "react";
import { auth } from "./firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

import sampleSound from "./media/birds.mp3";

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

  const eachWord = splitIntoWords.map((word) => (
    <button
      className="bg-sky-50 py-1 px-2 ml-2 rounded-md text-sm mr-2 mt-2 mb-2 hover:bg-sky-300"
      onClick={() => props.getSelectedWords(word, props.message.id)}
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

  function displayAudioPlayers() {
    if (props.message.words) {
      let arrForBlobs = [];
      for (let wordObj of props.message.words) {
        if (wordObj.blobUrl) {
          arrForBlobs.push(wordObj.word);
          console.log("ARR FOR BLOBS", arrForBlobs);
        }
      }
      return arrForBlobs.map((blob) => (
        <audio src={wordBlob} controls autoPlay loop />
      ));
    }
  }

  // const blobMap = wordBlobs.map((blob, i) => {
  //   getDownloadURL(audioRef).then((url) => {
  //     setWordBlob((prevWordBlob) => [...prevWordBlob, url]);
  //   });
  //   console.log("THIS IS BLOB", blob);
  //   return <audio src={wordBlob[i]} controls autoPlay loop />;
  // });

  // THIS WORKS - RETURNS SPECIFIC AUDIO FILE BUT DYNAMICALLY FOR EACH WORD WITH AN ASSOCIATED AUDIO FILE
  function getBlobNoState() {
    getDownloadURL(audioRef).then((url) => {
      setWordBlob(url);
    });
  }

  // this is the function to be rendered
  function getBlobAndDisplay() {
    getBlobNoState();
    return displayAudioPlayers();
  }

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
        props.message.words.map((wordObj) => (
          <p className="p-2">{`${wordObj.word}: ${wordObj.definition}`}</p>
        ))}
      {/* {getBlobAndDisplay()} */}
    </div>
  );
}
