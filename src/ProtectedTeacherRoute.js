import { Outlet, Route, Navigate } from "react-router-dom";
import React from "react";
import Login from "./Login";
import Messenger from "./Messenger";

// need to specify outlet here, not the name of the component (Messenger) otherwise
// props don't pass.
export default function ProtectedTeacherRoute(props) {
  console.log("USER STATE IN PROTECTED ROUTE", props.user);
  return props.user ? <Outlet /> : <Navigate to="/messenger" />;
}
