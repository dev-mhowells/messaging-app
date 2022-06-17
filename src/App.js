import React from "react";
import Text from "./Text.js";
import Messenger from "./Messenger.js";

import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { auth, provider } from "./firebase-config.js";

// const firestore = firebase.firestore();

function googleSignIn() {
  signInWithPopup(auth, provider).then((result) => {
    // The signed-in user info.
    const user = result.user;
  });
}

export default function App() {
  // authstatechange sets userIn on log in and log out
  const [user, setUser] = React.useState({});

  onAuthStateChanged(auth, (user) => {
    setUser(user);
  });

  return (
    <div>
      <div>
        <button onClick={() => googleSignIn()}>sign in</button>
        <button onClick={() => signOut(auth)}>sign out</button>
        <Messenger />
      </div>
    </div>
  );
}
