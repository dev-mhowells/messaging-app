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
  setDoc,
} from "firebase/firestore";
import { db, auth } from "./firebase-config";

export default function Messenger(props) {
  const messagesCollectionRef = collection(db, "messages");

  // doesn't work yet
  const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));

  const [messages, setMessages] = React.useState([]);
  const [message, setMessage] = React.useState("");
  const [editMessage, setEditMessage] = React.useState({}); // message to edit object
  const [correction, setCorrection] = React.useState("");

  const eachMessage = messages.map((message) => message);
  console.log("allmessages", eachMessage);
  console.log("currentUser", props.user.uid);

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
      uid: props.user.uid,
    });
  }

  // message to send
  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function getEditMessage(messageObj) {
    setEditMessage(messageObj);
  }

  function handleCorrectionChange(e) {
    setCorrection(e.target.value);
  }

  function addCorrection(e, messageID) {}

  //   async function getMyDocs() {
  //     console.log("updated");
  //     const snapshot = await db.collection("messages").get();
  //     return snapshot.docs.map((doc) => {
  //       db.collection("messages")
  //         .doc(doc.id)
  //         .update({ myNewField: "fieldValue" });
  //     });
  //   }

  // adds correction text as property to corresponding message object in firebase
  // merge: true prevents update from overwriting entire doc
  function addCorrection() {
    const ref = doc(db, "messages", editMessage.id);
    setDoc(ref, { correction }, { merge: true });
  }

  const allMessages = messages.map((message) => (
    <div
      className={`flex justify-between bg-sky-400 w-3/5 rounded-md hover:cursor-pointer ${
        message.uid !== auth.currentUser.uid ? "self-end" : "self-start"
      }`}
      onClick={() => getEditMessage(message)}
    >
      <p className="ml-2 p-2">{message.message}</p>
    </div>
  ));

  return (
    <div className="h-screen w-full flex flex-col font-poppins">
      <section className="flex justify-between w-1/2 mt-5 ml-10">
        <div className="rounded-full w-12 h-12 bg-sky-900"></div>
        <h2>Brian Horseman</h2>
        <h2 className="py-2 px-4 bg-sky-100">30:00</h2>
        <button className="py-2 px-4 bg-sky-100" onClick={props.logout}>
          Log out
        </button>
      </section>
      <div className="h-full w-full flex mt-5 gap-10 mb-10">
        <section className="ml-10 mb-10 w-1/2 h-full flex flex-col justify-end gap-5 border-t-2 border-sky-700">
          <div className="flex flex-col gap-5 w-full mt-5">{allMessages}</div>
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
        <section className="ml-10 w-2/5 flex flex-col gap-4 border-t-2 border-sky-700 text-xs">
          <p>Original</p>
          <div
            contentEditable="true"
            className="h-20 bg-sky-100 w-300 p-2 rounded-md"
          >
            {editMessage.message}
          </div>
          <p>Correction</p>
          {/* <div
            contentEditable="true"
            className="h-20 w-300 p-2 border-2 border-sky-700 rounded-md"
            onChange={handleCorrectionChange}
          >
            {correction}
          </div> */}
          <textarea
            className="h-20 w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
            onChange={handleCorrectionChange}
          >
            {correction}
          </textarea>
          <p>Explanation (optional)</p>
          <div
            contentEditable="true"
            className="h-20 w-300 p-2 border-2 border-sky-700 rounded-md"
          ></div>
          <p>Examples (optional)</p>
          <div
            contentEditable="true"
            className="h-20 w-300 p-2 border-2 border-sky-700 rounded-md"
          ></div>
          <button
            className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4"
            onClick={() => addCorrection()}
          >
            correct
          </button>
        </section>
      </div>
    </div>
  );
}
