import React from "react";
import Message from "./Message";
import CorrectMessage from "./CorrectMessage";
import CorrectWord from "./CorrectWord";
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
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

export default function Messenger(props) {
  const messagesCollectionRef = collection(db, "messages");

  // doesn't work yet
  const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));

  const [messages, setMessages] = React.useState([]); // array of message objects from firebase
  const [message, setMessage] = React.useState(""); // value of messaging input

  const [messageToEdit, setMessageToEdit] = React.useState({}); // message to edit object
  const [correction, setCorrection] = React.useState(""); // value of correction textarea input in correctMessage

  const [selectedWords, setSelectedWords] = React.useState([]); // words selected by learner, array of objects, keys: word, messageId

  // ------------------------------------- MESSENGER ACTUAL ----------------------------------------

  React.useEffect(() => {
    onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
          selected: false,
        };
      });
      setMessages(allMessages);
    });
  }, []);

  // uses message state
  async function createMessage() {
    await addDoc(messagesCollectionRef, {
      createdAt: serverTimestamp(),
      message: message,
      uid: props.user.uid,
      words: [],
    });
  }

  // message to send set to value of input
  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  // --------------------------------- CORRECTING MESSAGE ----------------------------------

  // gets edited message object from input and sets messageToEdit state
  function getMessageToEdit(messageObj) {
    setMessageToEdit(messageObj);
  }

  function handleCorrectionChange(e) {
    setCorrection(e.target.value);
  }

  // adds correction text as property to corresponding message object in firebase
  // merge: true prevents update from overwriting entire doc
  function addCorrection() {
    const ref = doc(db, "messages", messageToEdit.id);
    setDoc(ref, { correction }, { merge: true });
  }

  console.log("MESSAGETOEDIT", messageToEdit);

  // --------------------------------- EXPLAINING WORD -------------------------------------

  // THIS SECTION IS A MESS AND DOESNT WORK!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  // ARRAY - USED FOR SETTING TABS FOR EACH WORD AND ID IS USED BY CORRECTMESSAGE
  // TO FIND MESSAGE ASSOCIATED WITH WORD... CALLED IN MESSAGE.JS
  function getSelectedWords(word, messageId) {
    setSelectedWords((prevSelectedWords) => [
      ...prevSelectedWords,
      { word, messageId },
    ]);
    // setSelectedWord(word);
  }

  // -------------------------------------------------------------------------------------

  const allSelectedWords = selectedWords.map((wordObj) => (
    <Link
      to={`console/correctWord/${wordObj.word}`}
      className="bg-sky-400 hover:bg-sky-900 text-white py-1 px-2"
    >
      {wordObj.word}
    </Link>
  ));

  const allMessages = messages.map((message) => {
    return (
      <Message
        getMessageToEdit={getMessageToEdit}
        message={message}
        getSelectedWords={getSelectedWords}
      />
    );
  });

  return (
    <div className="h-screen w-full flex flex-col font-poppins">
      <div className="flex gap-10">
        <section className="flex justify-between w-1/2 mt-5 ml-10">
          <div className="rounded-full w-12 h-12 bg-sky-900"></div>
          <h2>Brian Horseman</h2>
          <h2 className="py-2 px-4 bg-sky-100">30:00</h2>
          <button className="py-2 px-4 bg-sky-100" onClick={props.logout}>
            Log out
          </button>
        </section>
        <section className="w-2/5 flex items-end ml-10">
          {messageToEdit && (
            <Link
              to={`console/correctMessage`}
              className="bg-sky-400 hover:bg-sky-900 text-white py-1 px-2"
            >
              Message
            </Link>
          )}
          {allSelectedWords}
        </section>
      </div>
      <div className="h-full w-full flex gap-10 mb-10">
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
        <Routes>
          <Route exact path="console">
            <Route
              exact
              path="correctMessage"
              element={
                <CorrectMessage
                  messageToEdit={messageToEdit}
                  handleCorrectionChange={handleCorrectionChange}
                  correction={correction}
                  addCorrection={addCorrection}
                ></CorrectMessage>
              }
            />
            {selectedWords.map((word) => (
              <Route
                exact
                path={`correctWord/${word.word}`}
                element={<CorrectWord selectedWord={word} />}
              ></Route>
            ))}
          </Route>
        </Routes>
      </div>
    </div>
  );
}
