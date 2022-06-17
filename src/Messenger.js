import React from "react";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  serverTimestamp,
  query,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, auth } from "./firebase-config";

export default function Messenger() {
  const messagesCollectionRef = collection(db, "messages");

  // doesn't work yet
  const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));

  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
      setMessages(allMessages);
    });
  }, []);

  async function createMessage() {
    await addDoc(messagesCollectionRef, {
      createdAt: serverTimestamp(),
      message: message,
      //   author: { name: auth.currentUser.displayName, id: auth.currentUser.uid },
    });
  }

  console.log("MESSAGES", messages);

  function handleMessageChange(e) {
    setMessage(e.target.value);
    console.log(e.target.value);
  }

  const [message, setMessage] = React.useState("");

  const [editMessage, setEditMessage] = React.useState("");

  function getEditMessage(text) {
    setEditMessage(text);
  }

  const allMessages = messages.map((message) => (
    <div className="flex justify-between bg-sky-100">
      <p>{message.message}</p>
      <button
        className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4"
        onClick={() => getEditMessage(message.message)}
      >
        edit
      </button>
    </div>
  ));

  return (
    <section className="w-1/2 h-3/4 self-start flex flex-col ml-20 gap-5">
      <div className="flex flex-col gap-1">{allMessages}</div>
      <div className="flex h-10 justify-between">
        <textarea
          className="h-10 w-full"
          value={message}
          onChange={handleMessageChange}
        ></textarea>
        <button
          className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4"
          onClick={() => createMessage()}
        >
          send
        </button>
      </div>
      <div contentEditable="true" className="h-20 w-40 bg-sky-300 w-full">
        {editMessage}
      </div>
    </section>
  );
}
