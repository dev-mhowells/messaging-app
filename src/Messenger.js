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
    <div className="message">
      <p>{message.message}</p>
      <button onClick={() => getEditMessage(message.message)}>edit</button>
    </div>
  ));

  return (
    <section className="messenger-main">
      <div className="message-display">{allMessages}</div>
      <div className="input-section">
        <textarea
          className="textarea"
          value={message}
          onChange={handleMessageChange}
        ></textarea>
        <button className="send-btn" onClick={() => createMessage()}>
          send
        </button>
      </div>
      <div contentEditable="true" className="correction-text">
        {editMessage}
      </div>
    </section>
  );
}
