import React from "react";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CorrectionDropdown(props) {
  const [dropDown, setDropDown] = React.useState(false);
  const [audioUrl, setAudioUrl] = React.useState("");

  function toggleDropDown() {
    setDropDown((dropDown) => !dropDown);
  }

  const storage = getStorage();

  // in useeffect to prevent a bunch of calls on rerender of any parent elements
  // uses correctiontracker state which is updated with a random value on every word correction submit
  // therefore only called on initial render and when an audio value is changed.
  React.useEffect(() => {
    function getAudio() {
      if (props.wordObj.forAudioRef) {
        getDownloadURL(ref(storage, `${props.wordObj.forAudioRef}`)).then(
          (url) => {
            console.log("URL", url);
            setAudioUrl(url);
          }
        );
      }
    }
    getAudio();
  }, [props.correctionTracker]);

  return (
    <div className="p-2 flex flex-col gap-1">
      <p>
        {`${props.wordObj.word}`} <button onClick={toggleDropDown}>drop</button>
      </p>
      {dropDown && (
        <div>
          {props.wordObj.synonyms && (
            <p> {`synonyms: ${props.wordObj.synonyms}`}</p>
          )}
          {props.wordObj.examples && (
            <p> {`examples: ${props.wordObj.examples}`}</p>
          )}
          {props.wordObj.extra && <p> {`more: ${props.wordObj.extra}`}</p>}
          {audioUrl && <audio src={audioUrl} controls loop />}
        </div>
      )}
    </div>
  );
}
