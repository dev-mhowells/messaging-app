import React from "react";
import { useParams } from "react-router-dom";

export default function (props) {
  const [definition, setDefinition] = React.useState("");

  //   console.log("THIS WORD", props.thisWord);
  let { word } = useParams();

  // finds the message ID for the selected word.
  // don't know how to pass message ID as props from Messenger.js
  // how to pass dynamic variables into dynamically created routes?
  // this is a temporary alternative, loops over selected words array
  // looks for match 'word' (dictated by url as in useParams), finds Id
  function findMessageId() {
    let messageId = "";
    for (let wordObj of props.selectedWord) {
      if (wordObj.word === word) {
        messageId = wordObj.messageId;
      }
    }
    return messageId;
  }

  console.log("THIS ONE", findMessageId());

  // object created using inputs from this component and passed to explainedWords arr
  // in state, in Messenger.js
  const wordExplained = {
    messageId: findMessageId(),
    word,
    definition,
  };

  // for onchange for definition feild, captures input and sets to definition state
  function handleDefinition(e) {
    setDefinition(e.target.value);
  }

  return (
    <section className="ml-10 w-2/5 flex flex-col gap-4 border-t-2 border-sky-700 text-xs">
      <p>Type</p>
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
      {/* <p>{props.thisWord}</p> */}
      {/* <p>{word}</p> */}
      <textarea
        className="h-20 w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
        onChange={handleDefinition}
      >
        {/* {props.correction} */}
      </textarea>
      <p>Examples</p>
      <div
        contentEditable="true"
        className="h-20 w-300 p-2 border-2 border-sky-700 rounded-md"
      ></div>
      <p>Pronunciation</p>
      <div
        contentEditable="true"
        className="h-20 w-300 p-2 border-2 border-sky-700 rounded-md"
      ></div>
      <button
        className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4"
        onClick={() => {
          props.handleExplainWord(wordExplained);
            props.addExplainedWord();
        }}
      >
        send
      </button>
    </section>
  );
}
