import React from "react";

export default function (props) {
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
      <p>Meaning</p>
      <textarea
        className="h-20 w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
        // onChange={props.handleCorrectionChange}
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
        //   onClick={() => props.addCorrection()}
      >
        send
      </button>
    </section>
  );
}
