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
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import { Translate } from "@google-cloud/translate/build/src/v2";

export default function Messenger(props) {
  const messagesCollectionRef = collection(db, "messages");

  const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));

  const [messages, setMessages] = React.useState([]); // array of message objects from firebase
  const [message, setMessage] = React.useState(""); // value of messaging input

  const [messageToEdit, setMessageToEdit] = React.useState({}); // message to edit object
  const [correction, setCorrection] = React.useState(""); // value of correction textarea input in correctMessage

  const [selectedWords, setSelectedWords] = React.useState([]); // words selected by learner, array of objects, keys: word, messageId

  // --------------------------------------- TRANSLATE-------------------------------------------

  // // Imports the Google Cloud client library
  // const { Translate } = require("@google-cloud/translate").v2;

  // // Creates a client
  // const translate = new Translate();

  // const text = "The text to translate, e.g. Hello, world!";
  // const target = "kr";

  // async function translateText() {
  //   // Translates the text into the target language. "text" can be a string for
  //   // translating a single piece of text, or an array of strings for translating
  //   // multiple texts.
  //   let [translations] = await translate.translate(text, target);
  //   translations = Array.isArray(translations) ? translations : [translations];
  //   console.log("Translations:");
  //   translations.forEach((translation, i) => {
  //     console.log(`${text[i]} => (${target}) ${translation}`);
  //   });
  // }

  // translateText();

  // ---------------------------------------- AUDIO -----------------------------------------------

  // THIS ISN'T NEEDED HERE?????
  // Create a reference with an initial file path and name
  // const storage = getStorage();
  // const audioRef = ref(storage, "audio");

  // getDownloadURL(audioRef)
  //   .then((url) => {
  //     console.log(url);
  //   })
  //   .catch((error) => {
  //     // Handle any errors
  //   });

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

  // --------------------------------- EXPLAINING WORD -------------------------------------

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

  const [selectedTab, setSelectedTab] = React.useState("");

  function getSelectedTab(e) {
    setSelectedTab(e.target.text);
  }

  const allSelectedWords = selectedWords.map((wordObj) => {
    return (
      <Link
        to={`console/correctWord/${wordObj.word}`}
        className={`${
          wordObj.word === selectedTab ? "bg-sky-700" : "bg-sky-400"
        } hover:bg-sky-900 text-white py-1 px-2 rounded-t-md`}
        onClick={getSelectedTab}
      >
        {wordObj.word}
      </Link>
    );
  });

  const messageTab = messageToEdit && (
    <Link
      to={`console/correctMessage`}
      className={`${
        selectedTab === "Message" ? "bg-sky-700" : "bg-sky-400"
      } hover:bg-sky-900 text-white py-1 px-2 rounded-t-md`}
      onClick={getSelectedTab}
    >
      Message
    </Link>
  );

  const allTabs = [messageTab, ...allSelectedWords];

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
      <div className="flex gap-10 h-[10%]">
        <section className="flex justify-between w-1/2 mt-4 ml-10">
          <div className="flex gap-4">
            <div className="rounded-full w-12 h-12 bg-sky-900 mb-4"></div>
            <h2>Teacher</h2>
          </div>
          <div className="flex gap-4">
            <h2>Student</h2>
            <div className="rounded-full w-12 h-12 bg-sky-900"></div>
          </div>
          <button className="py-2 px-4 bg-sky-100" onClick={props.logout}>
            Log out
          </button>
        </section>
        <section className="w-2/5 flex items-end">{allTabs}</section>
      </div>
      <div className="h-[90%] w-full flex gap-10">
        <section className=" h-full ml-10 w-1/2 flex flex-col justify-end gap-5 border-t-2 border-sky-700">
          <div className="p-3 flex flex-col gap-5 w-full overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-sky-700">
            {allMessages}
          </div>
          <textarea
            className="h-10 w-full focus:outline-none border-sky-700 focus:border-sky-300 p-2 border-2 rounded-md overflow-hidden resize-none"
            value={message}
            onChange={handleMessageChange}
          ></textarea>
          <div className="flex w-full justify-between">
            <h2 className="py-2 px-4 bg-sky-100 h-10">30:00</h2>
            <button
              className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4 h-10 w-1/3 self-end rounded-md mb-4"
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
                element={
                  <CorrectWord selectedWord={word} messages={messages} />
                }
              ></Route>
            ))}
          </Route>
        </Routes>
      </div>
    </div>
  );
}
