import React from "react";
import { auth } from "./firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Message(props) {
  const [isSelected, setIsSelected] = React.useState(false);

  function toggler() {
    setIsSelected((prevIsSelected) => !prevIsSelected);
  }

  // not sure if I should be directly changing the properties of the message obj
  // like this as it is in state.... working for now
  // also.. why use this and not just isSeleceted state directly? come back later
  props.message.selected = isSelected;

  function splitMessage(message) {
    splitMessage = message.split(" ");
    return splitMessage;
  }

  const splitIntoWords = splitMessage(props.message.message);

  const eachWord = splitIntoWords.map((word) => (
    <button
      className="bg-sky-50 py-1 px-2 ml-2 rounded-md text-sm mr-2 mt-2 mb-2 hover:bg-sky-300"
      onClick={() => props.getSelectedWords(word, props.message.id)}
    >
      {word}
    </button>
  ));

  // ---------------------------------- FIREBASE AUDIO ---------------------------------------------

  const [wordBlob, setWordBlob] = React.useState();
  const [wordBlobs, setWordBlobs] = React.useState([]);

  // console.log("WORDBLOB", wordBlob);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  const storage = getStorage();

  // Create a storage reference from our storage service
  const storageRef = ref(storage);

  // Create a child reference as messageId
  // loop through words in message, if match in audioRef, display audio, if no, don't =-- THIS NEXT
  const audioRef = ref(storage, `${props.message.id}/too`);
  const audioRef1 = ref(storage, `${props.message.id}/hello`);

  const audioRefs = [audioRef, audioRef1];

  // function getBlobs() {
  //   if (props.message.words) {
  //     for (let word of props.message.words) {
  //       console.log("WORD", word.word);
  //       const wordAudioRef = ref(storage, `${props.message.id}/${word.word}`);
  //       console.log("WORD AUDIO REF", wordAudioRef);
  //       getDownloadURL(wordAudioRef)
  //         .then((url) => {
  //           setWordBlobs((prevWordBlobs) => [...prevWordBlobs, url]);
  //         })
  //         .catch((error) => {
  //           switch (error.code) {
  //             case "storage/object-not-found":
  //               // File doesn't exist
  //               break;
  //             case "storage/unauthorized":
  //               // User doesn't have permission to access the object
  //               break;
  //             case "storage/canceled":
  //               // User canceled the upload
  //               break;
  //             case "storage/unknown":
  //               // Unknown error occurred, inspect the server response
  //               break;
  //           }
  //         });
  //     }
  //   }
  // }

  // console.log("BLOBS ARRAY", wordBlobs);
  // getBlobs();

  // const audioDisplay = wordBlobs.map((blob) => (
  //   <audio src={blob} controls autoPlay loop />
  // ));

  // function displayAudioAgain() {
  //   let audioSource;

  //   if (props.message.words) {
  //     for (let word of props.message.words) {
  //       if (Object.hasOwn(word, "blobUrl")) {
  //         const audioRef = ref(storage, `${props.message.id}/${word.word}`);
  //         getDownloadURL(audioRef).then((url) => {
  //           audioSource = url;
  //         });
  //       }
  //     }
  //   }
  //   return <audio src={audioSource} controls autoPlay loop />;
  // }

  function getBlob() {
    getDownloadURL(audioRef)
      .then((url) => {
        setWordBlob(url);
      })
      .catch((error) => {
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;
          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  }

  function getBlob2() {
    for (let ref of audioRefs) {
      getDownloadURL(ref)
        .then((url) => {
          setWordBlobs((prevWordBlobs) => [...prevWordBlobs, url]);
        })
        .catch((error) => {
          switch (error.code) {
            case "storage/object-not-found":
              // File doesn't exist
              break;
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect the server response
              break;
          }
        });
    }
  }

  // get the blob from firebase
  // getBlob();
  getBlob2(); // THIS CAUSES SOME KIND OF INFINITE LOOP

  // NEED TO ADD TO END OF BELOW, DICTATES WHETHER AUDIO CONTROLS SHOULD BE SHOWN

  return (
    <div
      className={`flex flex-col bg-sky-100 max-w-[80%] rounded-md hover:cursor-pointer ${
        props.message.uid !== auth.currentUser.uid ? "self-end" : "self-start"
      }`}
    >
      <div
        className={`flex justify-between w-full ${
          !props.message.selected ? "bg-sky-400" : "bg-sky-900"
        }  rounded-md hover:cursor-pointer ${
          props.message.uid !== auth.currentUser.uid ? "self-end" : "self-start"
        }`}
        onClick={() => {
          toggler(isSelected);
          props.getMessageToEdit(props.message);
          // getBlobs();
        }}
      >
        {!props.message.selected ? (
          <p className="p-2">{props.message.message}</p>
        ) : (
          <div className="">{eachWord}</div>
        )}
      </div>
      {props.message.correction && (
        <p className="p-2">{props.message.correction}</p>
      )}
      {props.message.words &&
        props.message.words.map((wordObj) => (
          <p className="p-2">{`${wordObj.word}: ${wordObj.definition}`}</p>
        ))}
      {props.message.words &&
        props.message.words.map(
          (word) =>
            Object.hasOwn(word, "isAudio") && (
              <audio src={wordBlobs[1]} controls autoPlay loop />
            )
        )}
      {/* {audioRefs.map((ref) => {
        <audio src={ref} controls autoPlay loop />;
      })} */}
      {/* {audioDisplay} */}
      {/* {displayAudioAgain()} */}
    </div>
  );
}
