import React from "react";
import { db, auth } from "./firebase-config";

export default function Message(props) {
  const [isSelected, setIsSelected] = React.useState(false);

  function toggler() {
    setIsSelected((prevIsSelected) => !prevIsSelected);
  }

  props.message.selected = isSelected;

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
        // onClick={() => props.getEditMessage(props.message)}
        onClick={() => toggler(isSelected)}
      >
        <p className="p-2">{props.message.message}</p>
      </div>
      {props.message.correction && (
        <p className="p-2">{props.message.correction}</p>
      )}
    </div>
  );
}
