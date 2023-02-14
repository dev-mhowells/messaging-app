import React from "react";
import Messenger from "./Messenger.js";
import DemoLogin from "./DemoLogin.js";

import { Routes, Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase-config";
import ProtectedRoutes from "./ProtectedRoutes.js";

// ---------------------------- CUSTOM LOGIN ---------------------------//

export default function App() {
  const [regEmail, setRegEmail] = React.useState("");
  const [regPass, setRegPass] = React.useState("");
  const [loginEmail, setLoginEmail] = React.useState("");
  const [loginPass, setLoginPass] = React.useState("");
  const [user, setUser] = React.useState({});

  let navigate = useNavigate();

  React.useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // REGISTER AND LOGIN FUNCTIONS NOT CURRENTLY USED BY DEMO VERSION
  // KEPT HERE TO EXPAND ON LATER
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
      navigate("/messenger");
    } catch (error) {
      console.log(error.message);
    }
  }

  async function logout() {
    await signOut(auth);
    setLoginEmail("");
    setLoginPass("");
    navigate("/");
  }

  // ----------------------- AUTH FUCNTIONS FOR DEMO PAGE ------------------------- //

  // HARDCODED LOGIN CREDENTIALS FOR APP DEMO
  async function studentLogin() {
    try {
      await signInWithEmailAndPassword(auth, "student@email.com", "password");
      navigate("/messenger");
    } catch (error) {
      console.log(error.message);
    }
  }

  async function teacherLogin() {
    try {
      await signInWithEmailAndPassword(auth, "teacher@email.com", "password");
      navigate("/messenger");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <Routes>
      <Route
        className="bg-white flex flex-col items-center justify-center h-screen"
        exact
        path="/"
        element={
          <DemoLogin
            studentLogin={studentLogin}
            teacherLogin={teacherLogin}
            register={register}
            login={login}
            logout={logout}
            user={user}
            setRegEmail={setRegEmail}
            setRegPass={setRegPass}
            setLoginEmail={setLoginEmail}
            setLoginPass={setLoginPass}
          />
        }
      ></Route>
      <Route element={<ProtectedRoutes user={user} />}>
        <Route
          exact
          path="/messenger/*"
          element={user && <Messenger logout={logout} user={user} />}
        />
      </Route>
    </Routes>
  );
}
