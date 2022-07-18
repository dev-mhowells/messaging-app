import React from "react";
import triangle from "./images/triangle.png";
import triangleXs from "./images/triangle-xs.png";
import triangleXsUp from "./images/triangle-xs-up.png";
import triangleSmall from "./images/triangle-small.png";
import triangleSmallUp from "./images/triangle-small-up.png";

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
    <div className=" flex flex-col gap-1 bg-green-200 text-sm border-none rounded-b-md">
      <div className="flex justify-between ml-2 mr-2 rounded-md">
        <p className="justify-self-center self-center">
          {`${props.wordObj.word}`}
        </p>
        <img
          src={dropDown ? triangleXsUp : triangleXs}
          onClick={toggleDropDown}
          className="self-center mt-2 mb-2 hover:cursor-pointer"
        ></img>
      </div>
      {dropDown && (
        <div className="even:bg-green-50 w-full flex flex-col gap-1 border-none rounded-b-md">
          {props.wordObj.synonyms && (
            <div className="border-b ml-2 mr-2">
              <i>synonyms:</i>
              <p>{`${props.wordObj.synonyms}`}</p>
            </div>
          )}
          {props.wordObj.examples && (
            <div className="border-b ml-2 mr-2">
              <i>examples:</i>
              <p> {`${props.wordObj.examples}`}</p>
            </div>
          )}
          {props.wordObj.extra && (
            <div className="border-b ml-2 mr-2">
              <i>notes:</i>
              <p> {`${props.wordObj.extra}`}</p>
            </div>
          )}
          {audioUrl && (
            <div className=" ml-2 mr-2 ">
              <i>pronunciation:</i>
              <audio src={audioUrl} controls loop />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
