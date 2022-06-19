import React from "react";
import Message from "./Message";
import { db, auth } from "./firebase-config";

export default function Messages(props) {
  //   const [isSelected, setIsSelected] = React.useState(false);

  //   function toggler() {
  //     setIsSelected((prevIsSelected) => !prevIsSelected);
  //   }

  const allMessages = props.messages.map((message) => {
    return <Message getEditMessage={props.getEditMessage} message={message} />;

    // message.selected = isSelected;
    // return (
    //   <div
    //     className={`flex flex-col bg-sky-100 w-3/5 rounded-md hover:cursor-pointer ${
    //       message.uid !== auth.currentUser.uid ? "self-end" : "self-start"
    //     }`}
    //   >
    //     <div
    //       className={`flex justify-between w-full ${
    //         !message.selected ? "bg-sky-400" : "bg-sky-900"
    //       }  rounded-md hover:cursor-pointer ${
    //         message.uid !== auth.currentUser.uid ? "self-end" : "self-start"
    //       }`}
    //       onClick={() => props.getEditMessage(message)}
    //       //   onClick={() => toggler(isSelected)}
    //     >
    //       <p className="p-2">{message.message}</p>
    //     </div>
    //     {message.correction && <p className="p-2">{message.correction}</p>}
    //   </div>
    // );
  });
  console.log(allMessages);
  return allMessages;
}
