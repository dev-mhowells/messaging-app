import React from "react";
import Text from "./Text.js";
import Messenger from "./Messenger.js";
import Login from "./Login.js";

// import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// import { auth, provider } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase-config";

// --------------------------- GOOGLE LOGIN ----------------------------//

// function googleSignIn() {
//   signInWithPopup(auth, provider).then((result) => {
//     // The signed-in user info.
//     const user = result.user;
//   });
// }

// export default function App() {
//   // authstatechange sets userIn on log in and log out
//   const [user, setUser] = React.useState({});

//   onAuthStateChanged(auth, (user) => {
//     setUser(user);
//   });

// ---------------------------- CUSTOM LOGIN ---------------------------//

export default function App() {
  const [regEmail, setRegEmail] = React.useState("");
  const [regPass, setRegPass] = React.useState("");
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPass, setLoginPass] = React.useState("");
  const [user, setUser] = React.useState({});

  console.log(user);

  React.useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  async function register() {
    try {
      const newUser = await createUserWithEmailAndPassword(
        auth,
        regEmail,
        regPass
      );
      console.log(newUser);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function login() {
    try {
      const newUser = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPass
      );
      console.log(newUser);
    } catch (error) {
      console.log(error.message);
    }
  }

  async function logout() {
    await signOut(auth);
    console.log("logged out", user);
  }

  return (
    <div className="bg-white flex flex-col items-center justify-center h-screen">
      {/* <button onClick={() => googleSignIn()}>sign in</button>
        <button onClick={() => signOut(auth)}>sign out</button> */}
      {!user ? (
        <Login
          register={register}
          login={login}
          logout={logout}
          user={user}
          setRegEmail={setRegEmail}
          setRegPass={setRegPass}
          setLoginEmail={setLoginEmail}
          setLoginPass={setLoginPass}
        />
      ) : (
        <Messenger logout={logout} user={user} />
      )}
    </div>
  );
}
