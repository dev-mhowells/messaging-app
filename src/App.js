import React from "react";
import Messenger from "./Messenger.js";
import Login from "./Login.js";
import CorrectWord from "./CorrectMessage.js";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { useNavigate } from "react-router-dom";

// import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
// import { auth, provider } from "./firebase-config.js";

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase-config";
import ProtectedRoutes from "./ProtectedRoutes.js";

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

  let navigate = useNavigate();

  // console.log(user);

  React.useEffect(() => {
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // user && navigate("messenger");
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
      navigate("/messenger");
    } catch (error) {
      console.log(error.message);
    }
  }

  async function logout() {
    await signOut(auth);
    setLoginEmail("");
    setLoginPass("");
    console.log("logged out", user);
    navigate("/");
  }

  // ----------------------- FUCNTIONS FOR DEMO PAGE -------------------------

  async function studentLogin() {
    try {
      const newUser = await signInWithEmailAndPassword(
        auth,
        "student@email.com",
        "password"
      );
      console.log(newUser);
      navigate("/messenger");
    } catch (error) {
      console.log(error.message);
    }
  }

  async function teacherLogin() {
    try {
      const newUser = await signInWithEmailAndPassword(
        auth,
        "teacher@email.com",
        "password"
      );
      console.log(newUser);
      navigate("/messenger");
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    // <Router>
    <Routes>
      <Route
        className="bg-white flex flex-col items-center justify-center h-screen"
        exact
        path="/"
        element={
          <Login
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
        {/* <Route
          exact
          path="/messenger/*"
          element={
            user && user.email === "teacher@email.com" ? (
              <Messenger logout={logout} user={user} />
            ) : (
              <MessengerStudent logout={logout} user={user} />
            )
          }
        />
      </Route> */}
        <Route
          exact
          path="/messenger/*"
          element={user && <Messenger logout={logout} user={user} />}
        />
      </Route>
    </Routes>
  );
}
