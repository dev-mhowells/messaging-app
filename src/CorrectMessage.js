import React from "react";

// commented out correction options may be properly implemented in later iterations

export default function CorrectMessage(props) {
  return (
    <section className=" w-2/5 h-1/2 flex flex-col gap-4 border-t-2 border-sky-700 text-xs">
      <p className="mt-4">Original message</p>
      <div className=" bg-sky-100 w-300 p-2 rounded-md">
        {props.messageToEdit.message}
      </div>
      <p>Correction</p>
      <textarea
        className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"
        onChange={props.handleCorrectionChange}
      >
        {props.correction}
      </textarea>
      {/* <p>Explanation (optional)</p>
      <textarea className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"></textarea>
      <p>Examples (optional)</p>
      <textarea className="h-full w-300 p-2 border-2 border-sky-700 rounded-md resize-none focus:outline-none"></textarea> */}
      <button
        className="bg-sky-700 hover:bg-sky-900 text-white py-2 px-4 border-none rounded-md w-1/3 self-end mb-4"
        onClick={() => props.addCorrection()}
      >
        correct
      </button>
    </section>
  );
}
