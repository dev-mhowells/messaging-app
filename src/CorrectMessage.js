import React from "react";

export default function CorrectMessage(props) {
  return (
    <section className="ml-10 w-2/5 flex flex-col gap-4 border-t-2 border-sky-700 text-xs">
      <p>Original</p>
      <div
        contentEditable="true"
        className="h-20 bg-sky-100 w-300 p-2 rounded-md"
      >
        {props.editMessage.message}
      </div>
      <p>Correction</p>
      <textarea
        className="h-20 w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
        onChange={props.handleCorrectionChange}
      >
        {props.correction}
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
        onClick={() => props.addCorrection()}
      >
        correct
      </button>
    </section>
  );
}
