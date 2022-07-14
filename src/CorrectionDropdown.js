import React from "react";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CorrectionDropdown(props) {
  const [dropDown, setDropDown] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState("");

  function toggleDropDown() {
    setDropDown((dropDown) => !dropDown);
  }

  const storage = getStorage();

  if (props.wordObj.forAudioRef) {
    getDownloadURL(ref(storage, `${props.wordObj.forAudioRef}`)).then((url) => {
      console.log("URL", url);
      setAudioUrl(url);
    });
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
          <audio src={audioUrl} controls loop />
        </div>
      )}
    </div>
  );
}
