import React from "react";
import { db, auth } from "./firebase-config";

export default function Message(props) {
  const [isSelected, setIsSelected] = React.useState(false);

  function toggler() {
    setIsSelected((prevIsSelected) => !prevIsSelected);
  }

  props.message.selected = isSelected;

  const splitWords = props.message.message;

  function splitMessage(message) {
    splitMessage = message.split(" ");
    return splitMessage;
  }

  //   const words = "here are some words to see what happens";

  const splitIntoWords = splitMessage(props.message.message);

  const eachWord = splitIntoWords.map((word) => (
    <button
      className="bg-sky-50 py-2 px-4 ml-2"
      onClick={() => props.getSelectedWords(word, props.message.id)}
    >
      {word}
    </button>
  ));

  return (
    <div
      className={`flex flex-col bg-sky-100 w-3/5 rounded-md hover:cursor-pointer ${
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
          <p className="p-2">{eachWord}</p>
        )}
      </div>
      {props.message.correction && (
        <p className="p-2">{props.message.correction}</p>
      )}
    </div>
  );
}
