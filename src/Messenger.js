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
      <p className="ml-2">{message.message}</p>
      <button
        className="bg-sky-700 hover:bg-sky-900 text-white py-1 px-4"
        onClick={() => getEditMessage(message.message)}
      >
        edit
      </button>
    </div>
  ));

  return (
    <div className="h-screen w-full flex flex-col mt-10 gap-10 ml-10">
      <section className="flex justify-between w-1/2">
        <div className="rounded-full w-12 h-12 bg-sky-900"></div>
        <h2>Brian Horseman</h2>
        <h2 className="py-2 px-4 bg-sky-100">30:00</h2>
      </section>
      <div className="h-screen w-full flex mt-10 gap-10">
        <section className="w-1/2 h-3/4 flex flex-col gap-5">
          <div className="flex gap-5">
            <div className="rounded-full w-10 h-10 bg-sky-900"></div>
            <div className="flex flex-col gap-5 w-1/2">{allMessages}</div>
          </div>
          <div className="flex h-10 justify-between">
            <textarea
              className=" w-full border focus:outline-none border-sky-200 focus:border-sky-300 p-2"
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
        </section>
        <section className="w-2/5 flex flex-col gap-4">
          <p>Original</p>
          <div contentEditable="true" className="h-20 bg-sky-100 w-300 p-2">
            {editMessage}
          </div>
          <p>Correction</p>
          <div
            contentEditable="true"
            className="h-20 bg-sky-100 w-300 p-2"
          ></div>
          <p>Explanation (optional)</p>
          <div
            contentEditable="true"
            className="h-20 bg-sky-100 w-300 p-2"
          ></div>
          <p>Examples (optional)</p>
          <div
            contentEditable="true"
            className="h-20 bg-sky-100 w-300 p-2"
          ></div>
        </section>
      </div>
    </div>
  );
}
