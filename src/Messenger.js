import React from "react";
import crossSmall from "./images/cross-s.png";
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
  doc,
  setDoc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "./firebase-config";

// import { Translate } from "@google-cloud/translate/build/src/v2"; // CURRENTLY CAUSING ERROR WITH INSTALL FILES

import teacher from "./images/teacher.png";
import student from "./images/student.png";

export default function Messenger(props) {
  const messagesCollectionRef = collection(db, "messages");
  const q = query(messagesCollectionRef, orderBy("createdAt", "asc"));

  const [messages, setMessages] = React.useState([]); // array of message objects from firebase
  const [message, setMessage] = React.useState(""); // value of messaging input

  const [messageToEdit, setMessageToEdit] = React.useState({}); // message to edit object

  // state used in correctMessage to be submitted
  const [correction, setCorrection] = React.useState(""); // value of correction textarea input in correctMessage
  const [explanation, setExplanation] = React.useState(""); // value of correction textarea input in correctMessage
  const [examples, setExamples] = React.useState(""); // value of correction textarea input in correctMessage

  const [selectedWords, setSelectedWords] = React.useState([]); // words selected by learner, array of objects, keys: word, messageId

  // changed by correctWord to random value and used by useEffect in correction dropdown to trigger calling for audioUrls
  const [correctionTracker, setCorrectionTracker] = React.useState("");

  // --------------------------------------- GOOGLE TRANSLATION FEATURE NOT YET IMPLEMENTED -------------------------------------------

  // CODE TO BUILD UPON:
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
  // ------------------------------------- MESSENGER ACTUAL ----------------------------------------

  // ref to bottom of messenger
  const messagesBottom = React.useRef();

  // scrolls to the bottom of messenger when there is a new message
  React.useEffect(() => {
    messagesBottom.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  React.useEffect(() => {
    // updates messenger content whenever new message is added
    onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map((doc) => {
        return {
          ...doc.data(),
          id: doc.id,
        };
      });
      setMessages(allMessages);
    });

    // updates selected words automatically on change in array at firebase level
    const wordsSnap = onSnapshot(
      doc(db, "selectedWords", "wordsArr"),
      (doc) => {
        setSelectedWords(doc.data().words);
      }
    );
  }, []);

  // uploads message as object to firebase messages collection
  async function createMessage(e) {
    e.preventDefault();
    await addDoc(messagesCollectionRef, {
      createdAt: serverTimestamp(),
      message: message,
      uid: props.user.uid,
      words: [],
    });
    setMessage("");
  }

  // message to send, set to value of input
  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  // --------------------------------- CORRECTING MESSAGE ----------------------------------

  // sets the text for message to edit in message tab, used in Message.js
  // messageToEdit is passed into CorrectMessage.js and renders under 'original message'
  function getMessageToEdit(messageObj) {
    setMessageToEdit(messageObj);
  }

  // sets correction to the value of the correction textarea field in CorrectMessage.js
  function handleCorrectionChange(e) {
    setCorrection(e.target.value);
  }

  // sets correction to the value of the correction textarea field in CorrectMessage.js
  function handleExplanationChange(e) {
    setExplanation(e.target.value);
  }

  // sets correction to the value of the correction textarea field in CorrectMessage.js
  function handleExamplesChange(e) {
    setExamples(e.target.value);
  }

  // adds correction text as property to corresponding message object in firebase
  // merge: true prevents update from overwriting entire doc
  function addCorrection() {
    const ref = doc(db, "messages", messageToEdit.id);
    setDoc(ref, { correction }, { merge: true });
  }

  // -----------------------------TAB CONTROL ---------------------------------------

  const [selectedTab, setSelectedTab] = React.useState("");

  // sets value of selected tab when clicking on tab
  // was set as .value before, now need innerText
  function getSelectedTab(e) {
    setSelectedTab(e.target.innerText);
  }

  // removes whatever is passed in from the selected words array in Firebase
  // onSnapshot for this updates state selectedWords and tabs will be updated automatically
  async function removeSelectedWordFB(wordObj) {
    const selectedWordsRef = doc(db, "selectedWords", "wordsArr");
    await updateDoc(selectedWordsRef, { words: arrayRemove(wordObj) });
  }

  React.useEffect(() => {
    setSelectedTab("Message");
  }, []);

  // controls redirects on tab closure
  // finds the word after (or before) the one in the current tab from arr of selected words
  // navigates to that word. Used when closing out tab to nav to next automatically
  function tabReset(word) {
    // only change tab if the tab closed is the currently selected tab
    if (word === selectedTab) {
      // find index
      const index = selectedWords.findIndex((wordObj) => {
        return wordObj.word === word;
      });
      // controls direction in which new tab is selected upon tab close
      // if there is at least 2 tabs
      if (selectedWords.length > 1) {
        const newTab =
          index < selectedWords.length - 1
            ? selectedWords[index + 1].word
            : selectedWords[index - 1].word;
        // changes tab colour
        setSelectedTab(newTab);
      } else {
        // if only one tab left
        setSelectedTab("Message");
      }
    }
  }
  // ---------------------------------

  const allSelectedWords = selectedWords.map((wordObj) => {
    return (
      <div
        className={`${
          wordObj.word === selectedTab ? "bg-sky-700" : "bg-sky-400"
        } hover:bg-sky-900 text-white py-1 px-2 rounded-t-md flex gap-1`}
      >
        <p onClick={getSelectedTab}>{wordObj.word}</p>
        <img
          onClick={() => {
            removeSelectedWordFB(wordObj);
            tabReset(wordObj.word);
          }}
          src={crossSmall}
          className="self-center hover:cursor-pointer"
        ></img>
      </div>
    );
  });

  // onclick gets clicked text value and sets selectedTab value
  const messageTab = messageToEdit && (
    <p
      className={`${
        selectedTab === "Message" ? "bg-sky-700" : "bg-sky-400"
      } hover:bg-sky-900 text-white py-1 px-2 rounded-t-md`}
      onClick={getSelectedTab}
    >
      Message
    </p>
  );

  // array used for actually displaying tabs
  const allTabs = [messageTab, ...allSelectedWords];

  // ----------------------------------------- MESSAGES AND DISPLAY --------------------------------------

  // displayed in body
  const allMessages = messages.map((message) => {
    return (
      <Message
        getMessageToEdit={getMessageToEdit}
        message={message}
        correctionTracker={correctionTracker}
      />
    );
  });

  return (
    <div className={`h-screen w-full flex flex-col font-poppins`}>
      <div className={`flex gap-10 h-[10%] justify-center`}>
        <section className="flex justify-between w-full mt-4 ml-1 mr-1 md:ml-4 md:w-1/2">
          <div className="flex gap-4">
            <img
              className="rounded-full h-[90%] aspect-square bg-sky-900 mb-4"
              src={teacher}
            ></img>
            <h2 className="mt-1">Teacher</h2>
          </div>
          <div className="flex gap-4">
            <h2 className="self-end mb-2">Student</h2>
            <img
              className="rounded-full h-[90%] aspect-square bg-sky-900"
              src={student}
            ></img>
          </div>
          <button className="py-2 px-4 bg-sky-100" onClick={props.logout}>
            Log out
          </button>
        </section>
        {props.user.email === "teacher@email.com" && (
          <section className="w-2/5 flex items-end">{allTabs}</section>
        )}
      </div>
      <div className="h-[90%] w-full flex gap-10 justify-center">
        <section className=" h-full ml-1 mr-1 md:ml-4 w-full md:w-1/2 flex flex-col justify-end gap-5 border-t-2 border-sky-700">
          <div className="p-3 flex flex-col gap-5 w-full overflow-y-auto scrollbar scrollbar-thin scrollbar-thumb-sky-700">
            {allMessages}
            <div ref={messagesBottom}></div>
          </div>
          <form onSubmit={createMessage}>
            <textarea
              className="h-10 w-full focus:outline-none border-sky-700 focus:border-sky-300 p-2 border-2 rounded-md overflow-hidden resize-none"
              value={message}
              onChange={handleMessageChange}
            ></textarea>
            <div className="flex w-full justify-between">
              <h2 className="py-2 px-4 bg-sky-100 h-10">30:00</h2>
              <button
                className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4 h-10 w-1/3 self-end rounded-md mb-4"
                type="submit"
              >
                send
              </button>
            </div>
          </form>
        </section>
        {props.user.email === "teacher@email.com" &&
          selectedTab === "Message" && (
            <CorrectMessage
              messageToEdit={messageToEdit}
              handleCorrectionChange={handleCorrectionChange}
              correction={correction}
              addCorrection={addCorrection}
            ></CorrectMessage>
          )}
        {props.user.email === "teacher@email.com" &&
          selectedTab !== "Message" &&
          selectedWords.map((word) => {
            if (word.word === selectedTab)
              return (
                <CorrectWord
                  selectedTab={selectedTab}
                  selectedWord={word}
                  messages={messages}
                  tabReset={tabReset}
                  removeSelectedWordFB={removeSelectedWordFB}
                  setCorrectionTracker={setCorrectionTracker}
                />
              );
          })}
      </div>
    </div>
  );
}
