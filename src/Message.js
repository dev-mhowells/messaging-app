import React from "react";
import { auth } from "./firebase-config";
import { doc, setDoc, arrayUnion, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";

import CorrectionDropdown from "./CorrectionDropdown";

export default function Message(props) {
  // MOVED TO MAIN MESSENGER:

  const [isSelected, setIsSelected] = React.useState(false);

  function toggler() {
    setIsSelected((prevIsSelected) => !prevIsSelected);
  }

  // not sure if I should be directly changing the properties of the message obj
  // like this as it is in state.... working for now
  // also.. why use this and not just isSeleceted state directly? come back later
  // props.message.selected = isSelected;

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

  // REFINE THIS FUNCTION SO THAT REPLACES 'S WITH EMPTY STRING
  function removeWordFormatting(word) {
    let onlyLetters = word.replace(/[^0-9a-z]/gi, "");
    // onlyLetters.replace(/[']s/gi, "");
    return onlyLetters.toLowerCase();
  }

  const eachWord = splitIntoWords.map((word) => {
    // console.log("DEFORMATTED", removeWordFormatting(word));
    return (
      <button
        className="bg-sky-50 py-1 px-2 ml-2 rounded-md text-sm mr-2 mt-2 mb-2 hover:bg-sky-300"
        onClick={() => {
          updateSelectedWordsFB({
            word: removeWordFormatting(word),
            messageId: props.message.id,
          });
        }}
      >
        {word}
      </button>
    );
  });

  const currentUserMessage = props.message.uid === auth.currentUser.uid;

  // --------------------------------------------------------------------------------------------------

  return (
    <div
      className={`flex flex-col max-w-[80%] bg-green-200 border-none rounded-t-md rounded-b-md ${
        currentUserMessage ? "self-end" : "self-start"
      }`}
    >
      <div
        className={`flex justify-between w-full ${
          !isSelected && currentUserMessage
            ? "bg-sky-400"
            : !isSelected
            ? "bg-sky-200"
            : "bg-sky-900"
        }  rounded-md hover:cursor-pointer 
       `}
        onClick={() => {
          toggler();
          props.getMessageToEdit(props.message);
        }}
      >
        {!isSelected ? (
          <p className="p-2">{props.message.message}</p>
        ) : (
          <div className="">{eachWord}</div>
        )}
      </div>
      {props.message.correction && (
        <p className="p-2 bg-red-400 border-none rounded-b-md">
          {props.message.correction}
        </p>
      )}
      {props.message.words &&
        props.message.words.map((wordObj) => (
          <CorrectionDropdown
            wordObj={wordObj}
            message={props.message}
            correctionTracker={props.correctionTracker}
          />
        ))}
    </div>
  );
}
