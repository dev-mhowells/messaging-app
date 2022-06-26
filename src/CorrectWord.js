import React from "react";
import { arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase-config";

export default function (props) {
  const [definition, setDefinition] = React.useState("");

  async function addExplainedWord() {
    const ref = doc(db, "messages", props.selectedWord.messageId);
    await updateDoc(ref, {
      words: arrayUnion(wordExplained),
    });
  }

  //   object sent to firebase.. might not need messageId
  const wordExplained = {
    messageId: props.selectedWord.messageId,
    word: props.selectedWord.word,
    definition,
  };

  // for onchange for definition feild, captures input and sets to definition state
  function handleDefinition(e) {
    setDefinition(e.target.value);
  }

  return (
    <section className=" w-2/5 h-full flex flex-col gap-4 border-t-2 border-sky-700 text-xs">
      <p className="mt-4">Type</p>
      <div className="h-20 w-300 p-3 rounded-md border-2 border-sky-700">
        <button className="bg-sky-400 border rounded-md p-1 text-white mr-2">
          noun
        </button>
        <button className="bg-sky-400 border rounded-md p-1 text-white mr-2">
          verb
        </button>
        <button className="bg-sky-400 border rounded-md p-1 text-white mr-2">
          adjective
        </button>
        <button className="bg-sky-400 border rounded-md p-1 text-white mr-2">
          adverb
        </button>
      </div>
      <p>Definition</p>
      <textarea
        className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
        onChange={handleDefinition}
      ></textarea>
      <p>Examples</p>
      <textarea className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"></textarea>
      <p>Pronunciation</p>
      <textarea className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"></textarea>
      <button
        className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4 border-none rounded-md w-1/3 self-end mb-4"
        onClick={() => {
          addExplainedWord();
        }}
      >
        send
      </button>
    </section>
  );
}
