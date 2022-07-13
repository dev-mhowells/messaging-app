import React from "react";

export default function CorrectionDropdown(props) {
  const [dropDown, setDropDown] = React.useState(false);

  function toggleDropDown() {
    setDropDown((dropDown) => !dropDown);
  }

  return (
    <div className="p-2 flex flex-col gap-1">
      <p>
        {`${props.wordObj.word}`} <button onClick={toggleDropDown}>drop</button>
      </p>
      {dropDown && (
        <div>
          <p> {`synonyms: ${props.wordObj.synonyms}`}</p>
          <p> {`examples: ${props.wordObj.examples}`}</p>
          <p> {`more: ${props.wordObj.extra}`}</p>
        </div>
      )}
    </div>
  );
}
