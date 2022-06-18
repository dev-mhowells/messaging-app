import React from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase-config";

export default function Login() {
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
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        <h2>Register</h2>
        <label>email</label>
        <input
          className="border border-sky-300"
          onChange={(e) => {
            setRegEmail(e.target.value);
          }}
        ></input>
        <label>password</label>
        <input
          className="border border-sky-300"
          onChange={(e) => {
            setRegPass(e.target.value);
          }}
        ></input>
        <button className="bg-sky-200 py-2 px-4" onClick={() => register()}>
          register
        </button>
      </div>
      <h2>Log in</h2>
      <label>email</label>
      <input
        className="border border-sky-300"
        onChange={(e) => {
          setLoginEmail(e.target.value);
        }}
      ></input>
      <label>password</label>
      <input
        className="border border-sky-300"
        onChange={(e) => {
          setLoginPass(e.target.value);
        }}
      ></input>
      <button className="bg-sky-200 py-2 px-4" onClick={login}>
        login
      </button>
      <button className="bg-sky-200 py-2 px-4" onClick={logout}>
        log out
      </button>
      <h2>Hello {user ? user.email : "anon"}</h2>
    </div>
  );
}
