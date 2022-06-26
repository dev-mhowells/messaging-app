import React from "react";
import { auth } from "./firebase-config";

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
    </div>
  );
}
